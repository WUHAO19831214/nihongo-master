import React from 'react';
import { VocabularyWord } from '../types';

interface HeaderProps {
  totalWords: number;
  currentIndex: number;
}

export const Header: React.FC<HeaderProps> = ({ totalWords, currentIndex }) => {
  const progressPercentage = Math.round(((currentIndex + 1) / totalWords) * 100);

  return (
    <header className="flex-none border-b border-gray-200 dark:border-border-dark bg-white dark:bg-card-dark px-4 sm:px-6 py-4 z-10 shadow-sm transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-tight text-slate-800 dark:text-white">Nihongo Master</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">JLPT N4 Vocabulary • Session 14</p>
          </div>
          {/* Mobile spacer to push User Settings to right if needed, but flex-col handles it */}
        </div>

        {/* Stats Center */}
        <div className="flex flex-1 w-full sm:max-w-2xl items-center gap-4 sm:gap-8">
          
          {/* Progress Bar */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600 dark:text-slate-300">Session Progress</span>
              <span className="text-primary">{currentIndex + 1}/{totalWords} Words</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Accuracy Badge (Hidden on very small screens to save space) */}
          <div className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="size-10 rounded-full border-4 border-green-500 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-slate-700 dark:text-white">85%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Accuracy</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">Excellent</span>
            </div>
          </div>
        </div>

        {/* User/Settings */}
        <div className="hidden sm:flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
            <img 
              alt="User profile" 
              className="h-full w-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_j65Wi8EOqC0vFpYcTH1szXE4gBO7lbERbl6teGQ7Xewl-BUzFVa21OBJ5Wj_DtjZqtxk3J5usrPzEXddeuCe-Poa_Ta09gLwNNHIcxBY2fERUeLXtHRyqqZRREADkg5N-1bL86sVHETTmhDUAympt8EMSHTZxNutSyo2YQ5rgkKWcInk-iEybBnHznWLP26Cg6-GjJ6FEhp6OLLVIPtaUyAhthMrPkglRcRAm7t9JePTJy_WDA-STP-rOgWG0Fwh5aKU314fcIiK" 
            />
          </div>
        </div>

      </div>
    </header>
  );
};
