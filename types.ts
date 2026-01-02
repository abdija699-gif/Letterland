
export type Screen = 'home' | 'trace' | 'games' | 'rewards';

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  cost: number;
}

export interface UserStats {
  stars: number;
  stickers: string[];
  completedLetters: string[];
}

export interface LetterData {
  letter: string;
  word: string;
  image: string;
  color: string;
}
