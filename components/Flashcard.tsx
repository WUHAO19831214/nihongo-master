import React, { useEffect } from 'react';
import { VocabularyWord } from '../types';

interface FlashcardProps {
  word: VocabularyWord;
  previousWord?: VocabularyWord;
  nextWord?: VocabularyWord;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({ word, previousWord, nextWord, onNext, onPrevious, hasPrevious, hasNext }) => {

  const playAudio = () => {
    if (word.audioUrl) {
      new Audio(word.audioUrl).play();
    } else {
      // Fallback to synthesis
      const utterParams = new SpeechSynthesisUtterance(word.kanji);
      utterParams.lang = 'ja-JP';
      window.speechSynthesis.speak(utterParams);
    }
  };

  // Auto-play audio on mount (optional - maybe too annoying? let's keep it manual for now)
  // useEffect(() => { playAudio(); }, [word]);

  return (
    <section className="flex flex-col gap-4 select-none shrink-0">

      {/* Navigation Controls - Moved to Top for visibility */}
      <div className="flex items-center gap-4 shrink-0 relative z-10 mb-2">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="h-12 px-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="hidden sm:inline">Prev</span>
        </button>
        <button
          onClick={onNext}
          className="h-12 flex-1 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {hasNext ? 'Next Word' : 'Finish'}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      {/* Main Flashcard */}
      <div className="flex-1 min-h-[400px] bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark shadow-sm relative overflow-hidden flex flex-col">

        {/* Card Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Previews (Top Area) */}
        <div className="flex justify-between px-6 pt-6 opacity-40 text-xs font-japanese">
          <div className="flex flex-col items-start gap-1">
            {previousWord && (
              <>
                <span className="font-bold text-slate-400">PREV</span>
                <span className="text-xl">{previousWord.kanji}</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            {nextWord && (
              <>
                <span className="font-bold text-slate-400">NEXT</span>
                <span className="text-xl">{nextWord.kanji}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-0">
          <span className="text-sm font-bold text-primary uppercase tracking-widest mb-4 bg-primary/10 px-3 py-1 rounded-full">
            {word.partOfSpeech}
          </span>

          {/* Kanji Hero */}
          <div className="relative group cursor-pointer mb-2" onClick={playAudio}>
            <h1
              className="text-[80px] sm:text-[140px] md:text-[160px] font-bold leading-none text-slate-900 dark:text-white font-japanese transition-transform group-hover:scale-105 duration-300"
              lang="ja"
            >
              {word.kanji}
            </h1>
            {/* Audio Hint */}
            <div className="absolute right-0 bottom-4 bg-white dark:bg-slate-700 rounded-full p-2 shadow-sm border border-slate-100 dark:border-slate-600 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary text-2xl">volume_up</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-medium text-slate-700 dark:text-slate-200">{word.romaji}</h2>
            <div className="flex flex-col gap-1 items-center">
              <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">{word.english}</p>
              {word.chinese && (
                <p className="text-base text-slate-400 dark:text-slate-500">{word.chinese}</p>
              )}
            </div>
          </div>

          {/* Example Sentence */}
          <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-inner">
            <p className="text-lg font-japanese text-slate-800 dark:text-slate-200 mb-1">{word.exampleSentence.japanese}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">{word.exampleSentence.romaji}</p>
            <div className="h-px w-full bg-slate-200 dark:bg-slate-700 my-3"></div>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{word.exampleSentence.english}</p>
          </div>
        </div>
      </div>

    </section>
  );
};
