import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSidebar } from './components/InputSidebar';
import { Flashcard } from './components/Flashcard';
import { LiveMonitor } from './components/LiveMonitor';
import { VOCABULARY_LIST, MOCK_ANALYSIS_HISTORY } from './constants';
import { InputMode, AnalysisResult, VocabularyWord } from './types';

function App() {
  const [vocabularyList, setVocabularyList] = useState<VocabularyWord[]>(VOCABULARY_LIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.MANUAL);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>(MOCK_ANALYSIS_HISTORY);

  const totalWords = vocabularyList.length;
  // Ensure we don't crash if list is empty (though simulated list always has items)
  const currentWord = vocabularyList[currentIndex] || VOCABULARY_LIST[0];

  const handleNext = () => {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Cycle back to start or show finish screen (simple cycle for now)
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleUpdateList = (newList: VocabularyWord[]) => {
    setVocabularyList(newList);
    setCurrentIndex(0);
    setInputMode(InputMode.MANUAL); // Reset to manual to start review
  };

  const addAnalysisResult = (result: AnalysisResult) => {
    setAnalysisHistory(prev => [result, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <Header
        totalWords={totalWords}
        currentIndex={currentIndex}
      />

      <main className="flex-1 flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">

        {/* Top: Flashcard (Expanded) */}
        <Flashcard
          word={currentWord}
          previousWord={currentIndex > 0 ? vocabularyList[currentIndex - 1] : undefined}
          nextWord={currentIndex < totalWords - 1 ? vocabularyList[currentIndex + 1] : undefined}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={vocabularyList.length > 1}
          hasPrevious={currentIndex > 0}
        />

        {/* Bottom: Input */}
        <InputSidebar
          inputMode={inputMode}
          setInputMode={setInputMode}
          currentWord={currentWord}
          onUpdateList={handleUpdateList}
        />

      </main>
    </div>
  );
}

export default App;
