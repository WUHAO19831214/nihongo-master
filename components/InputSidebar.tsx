import React, { useState, useRef } from 'react';
import { InputMode, VocabularyWord } from '../types';
import { generateMnemonic, analyzeHandwriting } from '../services/geminiService';

interface InputSidebarProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  currentWord: VocabularyWord;
  onUpdateList: (list: VocabularyWord[]) => void;
}

export const InputSidebar: React.FC<InputSidebarProps> = ({ inputMode, setInputMode, currentWord, onUpdateList }) => {
  const [notes, setNotes] = useState('');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInputPanel, setShowInputPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiAssist = async () => {
    setIsGenerating(true);
    const mnemonic = await generateMnemonic(currentWord);
    setNotes((prev) => (prev ? prev + '\n\n' + mnemonic : mnemonic));
    setIsGenerating(false);
  };

  const parseAndSetList = (text: string) => {
    // Simple parser: Assume line by line or comma separated
    // Format: Kanji (Romaji) - Meaning
    // This is a naive parser for demo purposes.
    // In a real app, we would use an LLM or robust parser.
    const lines = text.split(/\n/);
    const newWords: VocabularyWord[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[,，\s]+/); // Split by space or comma
      if (parts.length >= 2) {
        newWords.push({
          id: `custom-${Date.now()}-${idx}`,
          kanji: parts[0],
          romaji: '???', // Placeholder, would need API to fetch
          english: parts.slice(1).join(' '),
          chinese: parts.slice(1).join(' '), // Fallback
          partOfSpeech: 'Noun',
          exampleSentence: {
            japanese: parts[0] + 'を使います。',
            romaji: 'Placeholder sentence',
            english: 'I use ' + parts[1],
          }
        });
      }
    });

    if (newWords.length > 0) {
      onUpdateList(newWords);
      alert(`Loaded ${newWords.length} words!`);
      setShowInputPanel(false);
    } else {
      alert("Could not parse words. Try format: 'Kanji Meaning'");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulation of OCR / Image processing
    // In real implementation, send to Gemini here
    // For now, we simulate finding "Cats" and "Dogs" from an image
    setTimeout(() => {
      alert("Simulating Image Analysis... Found: 猫 (Cat), 犬 (Dog)");
      const mockWords: VocabularyWord[] = [
        {
          id: `ocr-${Date.now()}-1`,
          kanji: '猫',
          romaji: 'Neko',
          english: 'Cat',
          chinese: '猫',
          partOfSpeech: 'Noun',
          exampleSentence: {
            japanese: '猫がいます。',
            romaji: 'Neko ga imasu.',
            english: 'There is a cat.',
          }
        },
        {
          id: `ocr-${Date.now()}-2`,
          kanji: '犬',
          romaji: 'Inu',
          english: 'Dog',
          chinese: '狗',
          partOfSpeech: 'Noun',
          exampleSentence: {
            japanese: '犬が走る。',
            romaji: 'Inu ga hashiru.',
            english: 'The dog runs.',
          }
        }
      ];
      onUpdateList(mockWords);
    }, 1500);
  };

  return (
    <section className="flex flex-col gap-6 h-auto shrink-0 pb-10">

      {/* Input Tabs - Renamed for clarity */}
      <div className="bg-white dark:bg-card-dark rounded-xl p-1 flex border border-gray-200 dark:border-border-dark shadow-sm shrink-0">
        <button
          onClick={() => setInputMode(InputMode.MANUAL)}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${inputMode === InputMode.MANUAL && !showInputPanel
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            Notes
          </span>
        </button>
        <button
          onClick={() => setShowInputPanel(true)}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${showInputPanel
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">playlist_add</span>
            New List
          </span>
        </button>
      </div>

      {/* New List Input Panel */}
      {showInputPanel ? (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark p-5 flex flex-col gap-4 shadow-sm flex-1 min-h-[300px]">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 dark:text-white">Create Study List</h3>
            <button onClick={() => setShowInputPanel(false)} className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-48 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter words (one per line):
Example:
猫 Cat
犬 Dog"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => parseAndSetList(inputText)}
              className="bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-600"
            >
              Load Text
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
          <p className="text-xs text-slate-400">Supports text paste or photo upload (OCR).</p>
        </div>
      ) : (
        /* Manual Input Area (Notes) */
        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark p-5 flex flex-col gap-4 shadow-sm flex-1 min-h-[300px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-semibold">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              <h3>Practice Notes</h3>
            </div>
            <button
              onClick={handleAiAssist}
              disabled={isGenerating}
              className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
              title="Ask AI for a mnemonic"
            >
              {isGenerating ? 'Thinking...' : 'AI Assist'}
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none"
            placeholder="Type notes, mnemonic devices, or try typing the kanji here..."
          />

          <div className="text-xs text-slate-400 dark:text-slate-500 flex justify-between shrink-0">
            <span>Supports Romaji & Kana</span>
            <span>{notes.length}/500</span>
          </div>
        </div>
      )}

      {/* Camera Toggle (Only if not in input panel) */}


    </section>
  );
};
