import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, InputMode, VocabularyWord } from '../types';
import { analyzeHandwriting } from '../services/geminiService';

interface LiveMonitorProps {
  inputMode: InputMode;
  currentWord: VocabularyWord;
  history: AnalysisResult[];
  addResult: (result: AnalysisResult) => void;
  onNext: () => void;
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({ inputMode, currentWord, history, addResult, onNext }) => {
  const [isActive, setIsActive] = useState(false);
  const [monitorState, setMonitorState] = useState<'IDLE' | 'WRITING' | 'WAITING' | 'ANALYZING' | 'RESULT'>('IDLE');
  const [lastMotionTime, setLastMotionTime] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextWordTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Camera Control ---
  useEffect(() => {
    if (inputMode === InputMode.CAMERA) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        setMonitorState('WRITING'); // Assume start writing immediately or waiting for motion
        detectMotion();
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setMonitorState('IDLE');
  };

  // --- Motion Detection Loop ---
  const detectMotion = () => {
    if (!videoRef.current || !canvasRef.current || !diffCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const diffCanvas = diffCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const diffCtx = diffCanvas.getContext('2d');

    if (!ctx || !diffCtx) return;

    // Set dimensions
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      diffCanvas.width = video.videoWidth;
      diffCanvas.height = video.videoHeight;
    }

    let previousFrame: ImageData | null = null;

    const loop = () => {
      if (!streamRef.current) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (previousFrame) {
        // Simple Diff
        let diffScore = 0;
        const data = currentFrame.data;
        const prevData = previousFrame.data;

        // Checking every 4th pixel for performance
        for (let i = 0; i < data.length; i += 4 * 4) {
          const rDiff = Math.abs(data[i] - prevData[i]);
          const gDiff = Math.abs(data[i + 1] - prevData[i + 1]);
          const bDiff = Math.abs(data[i + 2] - prevData[i + 2]);
          if (rDiff + gDiff + bDiff > 100) {
            diffScore++;
          }
        }

        if (diffScore > 200) { // Threshold
          setLastMotionTime(Date.now());
          setMonitorState((prev) => {
            if (prev === 'WAITING' || prev === 'RESULT') return 'WRITING'; // Reset to writing
            return prev === 'IDLE' ? 'WRITING' : prev;
          });
        }
      }

      previousFrame = currentFrame;
      requestAnimationFrame(loop);
    };

    loop();
  };

  // --- State Logic (Timer) ---
  useEffect(() => {
    if (monitorState === 'WRITING') {
      // Clear existing check timers
      if (analysisTimerRef.current) clearTimeout(analysisTimerRef.current);
      if (nextWordTimerRef.current) clearTimeout(nextWordTimerRef.current);
      setFeedback(null); // Clear old feedback

      // Check constantly if we should switch to WAITING
      const checkInterval = setInterval(() => {
        if (Date.now() - lastMotionTime > 1500) { // 1.5s no motion
          setMonitorState('WAITING');
        }
      }, 500);

      return () => clearInterval(checkInterval);
    }

    if (monitorState === 'WAITING') {
      // We entered waiting state, wait a bit more then analyze
      // (Debounce)
      const timer = setTimeout(() => {
        handleAnalyze();
      }, 1000); // 1s wait before trigger
      return () => clearTimeout(timer);
    }
  }, [monitorState, lastMotionTime]);


  // --- Analysis & Feedback ---
  const handleAnalyze = async () => {
    setMonitorState('ANALYZING');

    let imageBase64 = '';
    if (videoRef.current && canvasRef.current) {
      imageBase64 = canvasRef.current.toDataURL('image/jpeg');
    }

    // Call API
    const aiResult = await analyzeHandwriting(imageBase64, currentWord);

    // Process Result
    addResult({
      id: Date.now().toString(),
      kanji: currentWord.kanji,
      isCorrect: aiResult.isCorrect,
      confidence: aiResult.confidence,
      timestamp: 'Just now',
    });

    setMonitorState('RESULT');
    setFeedback({
      isCorrect: aiResult.isCorrect,
      message: aiResult.isCorrect ? 'Correct! Good job.' : 'Not quite. Try again.'
    });

    // Audio Feedback
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'ja-JP';
    speech.text = aiResult.isCorrect ? `正解！ ${currentWord.kanji}` : `惜しい。もう一度。`;
    window.speechSynthesis.speak(speech);

    // Auto Advance if correct
    if (aiResult.isCorrect) {
      nextWordTimerRef.current = setTimeout(() => {
        onNext();
        setFeedback(null);
        setMonitorState('WRITING'); // Reset for next word
      }, 5000);
    }
  };


  return (
    <section className="lg:col-span-4 flex flex-col gap-6 h-full min-h-[500px]">
      <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden flex flex-col h-full shadow-sm relative">

        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-border-dark flex justify-between items-center bg-white dark:bg-card-dark z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`size-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <h3 className="font-bold text-slate-800 dark:text-white">Live Monitor</h3>
          </div>
          <div className="text-xs font-mono text-slate-500">
            STATUS: <span className="font-bold text-primary">{monitorState}</span>
          </div>
        </div>

        {/* Camera Feed Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden group">

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${!isActive ? 'hidden' : 'block'}`}
          />
          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={diffCanvasRef} className="hidden" />

          {/* Overlays based on state */}
          {monitorState === 'WRITING' && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm animate-pulse">edit</span>
              Writing...
            </div>
          )}

          {monitorState === 'WAITING' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 text-white font-bold flex items-center gap-3">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Checking...
              </div>
            </div>
          )}

          {monitorState === 'ANALYZING' && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
              <div className="bg-white text-primary px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold text-lg">Analyzing...</span>
              </div>
            </div>
          )}

          {monitorState === 'RESULT' && feedback && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md ${feedback.isCorrect ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
              <div className={`text-9xl mb-4 ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'} drop-shadow-lg`}>
                <span className="material-symbols-outlined text-[120px]">
                  {feedback.isCorrect ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <h2 className="text-4xl font-bold text-white drop-shadow-md mb-2">
                {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
              </h2>
              {feedback.isCorrect && (
                <p className="text-white/80 animate-pulse">Next word in 5s...</p>
              )}
            </div>
          )}

          {/* Placeholder for when camera is off */}
          {!isActive && (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-4">
              <span className="material-symbols-outlined text-6xl opacity-20">videocam_off</span>
              <p>Camera inactive</p>
            </div>
          )}

        </div>

        {/* Footer / Feedback Log */}
        <div className="h-1/3 min-h-[160px] max-h-[250px] bg-slate-50 dark:bg-[#15202b] border-t border-gray-200 dark:border-border-dark p-4 flex flex-col overflow-y-auto shrink-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 sticky top-0 bg-slate-50 dark:bg-[#15202b] py-1">Recent Analysis</p>
          <div className="flex flex-col gap-2">

            {history.length === 0 && (
              <div className="text-center text-slate-400 text-xs py-4">No scans yet.</div>
            )}

            {history.map((item, index) => (
              <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark shadow-sm ${index !== 0 ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="size-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded text-lg font-japanese font-bold text-slate-700 dark:text-white">
                    {item.kanji}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </p>
                    <p className="text-xs text-slate-500">{item.timestamp} • {item.confidence}%</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined ${item.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {item.isCorrect ? 'check_circle' : 'cancel'}
                </span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};
