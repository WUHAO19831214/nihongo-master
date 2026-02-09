import { VocabularyWord } from './types';

export const VOCABULARY_LIST: VocabularyWord[] = [
  {
    id: '1',
    kanji: '猫',
    romaji: 'Neko',
    english: 'Cat',
    chinese: '猫',
    partOfSpeech: 'Noun',
    exampleSentence: {
      japanese: '猫がベッドで寝ています。',
      romaji: 'Neko ga beddo de neteimasu.',
      english: 'The cat is sleeping on the bed.',
    },
  },
  {
    id: '2',
    kanji: '犬',
    romaji: 'Inu',
    english: 'Dog',
    chinese: '狗',
    partOfSpeech: 'Common Noun',
    exampleSentence: {
      japanese: 'その犬は大きいです。',
      romaji: 'Sono inu wa ookii desu.',
      english: 'That dog is big.',
    },
  },
  {
    id: '3',
    kanji: '図書館',
    romaji: 'Toshokan',
    english: 'Library',
    chinese: '图书馆',
    partOfSpeech: 'Noun',
    exampleSentence: {
      japanese: '図書館で勉強します。',
      romaji: 'Toshokan de benkyou shimasu.',
      english: 'I study at the library.',
    },
  },
  {
    id: '4',
    kanji: '食べる',
    romaji: 'Taberu',
    english: 'To Eat',
    chinese: '吃',
    partOfSpeech: 'Verb',
    exampleSentence: {
      japanese: '私は寿司を食べるのが好きです。',
      romaji: 'Watashi wa sushi o taberu no ga suki desu.',
      english: 'I like to eat sushi.',
    },
  },
  {
    id: '5',
    kanji: '見る',
    romaji: 'Miru',
    english: 'To See',
    chinese: '看',
    partOfSpeech: 'Verb',
    exampleSentence: {
      japanese: '映画を見る。',
      romaji: 'Eiga o miru.',
      english: 'I watch a movie.',
    },
  },
];

export const MOCK_ANALYSIS_HISTORY = [
  {
    id: 'log-1',
    kanji: '猫',
    isCorrect: true,
    confidence: 94,
    timestamp: '2s ago',
  },
  {
    id: 'log-2',
    kanji: '犬',
    isCorrect: false,
    confidence: 45,
    timestamp: '45s ago',
  },
];
