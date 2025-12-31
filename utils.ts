import { Difficulty, Puzzle } from './types';

// Import puzzles - using require for React Native compatibility
const puzzles4Tile = require('./puzzles.json');
const puzzles5Tile = require('./puzzles5tile.json');
const puzzles6Tile = require('./puzzles6tile.json');

export function getPuzzlesByDifficulty(difficulty: Difficulty): Puzzle[] {
  switch (difficulty) {
    case 'easy':
      return puzzles4Tile as Puzzle[];
    case 'medium':
      return puzzles5Tile as Puzzle[];
    case 'hard':
      return puzzles6Tile as Puzzle[];
  }
}

export function getRandomPuzzle(difficulty: Difficulty): Puzzle {
  const puzzles = getPuzzlesByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

export function getPuzzleByIndex(difficulty: Difficulty, index: number): Puzzle | null {
  const puzzles = getPuzzlesByDifficulty(difficulty);
  if (index >= 0 && index < puzzles.length) {
    return puzzles[index];
  }
  return null;
}

export function getPuzzleKey(difficulty: Difficulty, index: number): string {
  return `${difficulty}-${index}`;
}

export function performOperation(a: number, b: number, operation: string): number | null {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return null;
      const result = a / b;
      return Number.isInteger(result) ? result : null;
    default:
      return null;
  }
}

export const AFFIRMATIONS = ['Amazing', 'Awesome', 'Great', 'Excellent', 'Perfect', 'Brilliant', 'Fantastic', 'Incredible', 'Outstanding', 'Superb'];

