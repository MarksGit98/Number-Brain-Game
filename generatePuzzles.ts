import * as fs from 'fs';
import * as path from 'path';
import { generateSolvablePuzzle } from './puzzleSolver';

interface Puzzle {
  digits: number[];
  target: number;
}

function generatePuzzles(count: number): Puzzle[] {
  console.log(`Generating ${count} solvable puzzles...`);
  const puzzles: Puzzle[] = [];
  
  for (let i = 0; i < count; i++) {
    const puzzle = generateSolvablePuzzle();
    puzzles.push(puzzle);
    if ((i + 1) % 10 === 0) {
      console.log(`Generated ${i + 1}/${count} puzzles...`);
    }
  }
  
  return puzzles;
}

const puzzles = generatePuzzles(100);
const outputPath = path.join(__dirname, 'puzzles.json');

fs.writeFileSync(outputPath, JSON.stringify(puzzles, null, 2));
console.log(`\nSuccessfully generated ${puzzles.length} puzzles and saved to ${outputPath}`);

