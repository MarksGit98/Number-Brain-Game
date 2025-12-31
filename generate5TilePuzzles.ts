import * as fs from 'fs';
import * as path from 'path';

interface Puzzle {
  digits: number[];
  target: number;
}

type Operation = '+' | '-' | '*' | '/';

function performOperation(a: number, b: number, operation: Operation): number | null {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      if (a - b < 0) return null;
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

function solvePuzzle(digits: number[], target: number): boolean {
  if (digits.length === 1) {
    return digits[0] === target;
  }

  const operations: Operation[] = ['+', '-', '*', '/'];

  for (let i = 0; i < digits.length; i++) {
    for (let j = i + 1; j < digits.length; j++) {
      const a = digits[i];
      const b = digits[j];
      const remaining = digits.filter((_, idx) => idx !== i && idx !== j);

      for (const op of operations) {
        const result = performOperation(a, b, op);
        if (result !== null && result >= 0) {
          if (solvePuzzle([...remaining, result], target)) {
            return true;
          }
        }

        if (op === '-' || op === '/') {
          const reverseResult = performOperation(b, a, op);
          if (reverseResult !== null && reverseResult >= 0) {
            if (solvePuzzle([...remaining, reverseResult], target)) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

function generateSolvable5TilePuzzle(): Puzzle {
  let attempts = 0;
  const maxAttempts = 50000;

  while (attempts < maxAttempts) {
    // Generate 5 random single-digit numbers (1-9)
    const digits: number[] = [];
    for (let i = 0; i < 5; i++) {
      digits.push(Math.floor(Math.random() * 9) + 1);
    }

    // Generate a reasonable target (between 1 and 300 for 5 tiles)
    const target = Math.floor(Math.random() * 299) + 1;

    const puzzle = { digits, target };
    if (solvePuzzle([...puzzle.digits], puzzle.target)) {
      return puzzle;
    }

    attempts++;
  }

  // Fallback: return a known solvable 5-tile puzzle
  return { digits: [9, 8, 7, 6, 5], target: 100 };
}

function generate5TilePuzzles(count: number): Puzzle[] {
  console.log(`Generating ${count} solvable 5-tile puzzles...`);
  const puzzles: Puzzle[] = [];
  
  for (let i = 0; i < count; i++) {
    const puzzle = generateSolvable5TilePuzzle();
    puzzles.push(puzzle);
    if ((i + 1) % 10 === 0) {
      console.log(`Generated ${i + 1}/${count} puzzles...`);
    }
  }
  
  return puzzles;
}

const puzzles = generate5TilePuzzles(50);
const outputPath = path.join(process.cwd(), 'puzzles5tile.json');

fs.writeFileSync(outputPath, JSON.stringify(puzzles, null, 2));
console.log(`\nSuccessfully generated ${puzzles.length} 5-tile puzzles and saved to ${outputPath}`);

