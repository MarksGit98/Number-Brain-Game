export type Operation = '+' | '-' | '*' | '/';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  digits: number[];
  target: number;
}

export interface GameState {
  digits: number[];
  target: number;
  selectedIndices: number[];
  firstSelectedIndex: number | null;
  secondSelectedIndex: number | null;
  selectedOperation: Operation | null;
  history: Array<{ 
    operation: Operation; 
    operands: [number, number]; 
    result: number; 
    previousDigits: number[] 
  }>;
}

