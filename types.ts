export interface Phonetics {
  ipa: string;
  syllables: string;
  tip: string;
}

export interface Etymology {
  rootAnalysis: string;
  backstory: string;
}

export interface Cognate {
  word: string;
  connection: string;
}

export interface Nuance {
  synonyms: { word: string; context: string }[];
  antonym: string;
  examples: string[];
}

export interface LexiconData {
  word: string;
  phonetics: Phonetics;
  etymology: Etymology;
  cognates: Cognate[];
  nuance: Nuance;
}

export interface NotebookEntry {
  word: string;
  timestamp: number;
}
