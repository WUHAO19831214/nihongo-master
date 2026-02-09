export interface VocabularyWord {
  id: string;
  kanji: string;
  romaji: string;
  english: string;
  chinese: string;
  partOfSpeech: string;
  audioUrl?: string; // Optional URL for audio, otherwise use synthesis
  exampleSentence: {
    japanese: string;
    romaji: string;
    english: string;
  };
}

export interface AnalysisResult {
  id: string;
  kanji: string;
  isCorrect: boolean;
  confidence: number;
  timestamp: string; // Relative time string for display (e.g., "2s ago")
}

export enum InputMode {
  MANUAL = 'MANUAL',
  CAMERA = 'CAMERA',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
