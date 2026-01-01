import * as fs from 'fs';
import * as path from 'path';

type Operation = '+' | '-' | '*' | '/';

interface Puzzle {
  digits: number[];
  target: number;
}

/**
 * Performs an operation on two numbers, returning null if invalid
 */
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

/**
 * Creates a unique key for a puzzle (sorted digits + target)
 */
function getPuzzleKey(puzzle: Puzzle): string {
  const sortedDigits = [...puzzle.digits].sort((a, b) => a - b).join(',');
  return `${sortedDigits}|${puzzle.target}`;
}

/**
 * Creates a unique key for a state (sorted numbers array)
 */
function getStateKey(numbers: number[]): string {
  return [...numbers].sort((a, b) => a - b).join(',');
}

/**
 * DFS solver for 5-tile puzzles
 */
function solveWithDFS(puzzle: Puzzle): boolean {
  const visited = new Set<string>();
  
  function dfs(numbers: number[]): boolean {
    if (numbers.length === 1) {
      return numbers[0] === puzzle.target;
    }

    const stateKey = getStateKey(numbers);
    if (visited.has(stateKey)) {
      return false;
    }
    visited.add(stateKey);

    const operations: Operation[] = ['+', '-', '*', '/'];

    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const a = numbers[i];
        const b = numbers[j];
        const remaining = numbers.filter((_, idx) => idx !== i && idx !== j);

        for (const op of operations) {
          const result = performOperation(a, b, op);
          if (result !== null && result >= 0) {
            if (dfs([...remaining, result])) {
              return true;
            }
          }

          if (op === '-' || op === '/') {
            const reverseResult = performOperation(b, a, op);
            if (reverseResult !== null && reverseResult >= 0) {
              if (dfs([...remaining, reverseResult])) {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  }

  return dfs([...puzzle.digits]);
}

function isPuzzleSolvable(puzzle: Puzzle): boolean {
  if (puzzle.digits.length !== 5) {
    return false;
  }
  return solveWithDFS(puzzle);
}

function generateSolvable5TilePuzzle(under100: boolean): Puzzle {
  let attempts = 0;
  const maxAttempts = 100000;

  while (attempts < maxAttempts) {
    // Generate 5 random single-digit numbers (1-9)
    const digits: number[] = [];
    for (let i = 0; i < 5; i++) {
      digits.push(Math.floor(Math.random() * 9) + 1);
    }

    // Generate target based on constraint
    let target: number;
    if (under100) {
      // Majority under 100: generate between 1 and 99
      target = Math.floor(Math.random() * 99) + 1;
    } else {
      // Remaining puzzles: between 100 and 149
      target = Math.floor(Math.random() * 50) + 100;
    }

    const puzzle = { digits, target };
    if (isPuzzleSolvable(puzzle)) {
      return puzzle;
    }

    attempts++;
  }

  // Fallback
  return { digits: [9, 8, 7, 6, 5], target: under100 ? 50 : 120 };
}

function main() {
  const puzzlesPath = path.join(process.cwd(), 'puzzles5tile.json');
  
  // Read existing puzzles
  const existingPuzzlesData = fs.readFileSync(puzzlesPath, 'utf-8');
  const existingPuzzles: Puzzle[] = JSON.parse(existingPuzzlesData);
  
  // Create set of existing puzzle keys for uniqueness check
  const existingKeys = new Set<string>();
  existingPuzzles.forEach(puzzle => {
    existingKeys.add(getPuzzleKey(puzzle));
  });

  console.log(`Existing 5-tile puzzles: ${existingPuzzles.length}`);
  console.log(`Generating 80 new medium puzzles (5 tiles)...`);
  console.log(`  - Target <= 149`);
  console.log(`  - Majority (50+) under 100`);
  console.log(`  - All solvable`);
  console.log(`  - All unique\n`);

  const newPuzzles: Puzzle[] = [];
  const puzzleKeys = new Set<string>(existingKeys);
  let generated = 0;
  let attempts = 0;
  const maxAttempts = 200000;

  // Generate 50 puzzles with target under 100 (majority)
  const under100Count = 50;
  // Generate 30 puzzles with target 100-149
  const over100Count = 30;

  // Generate puzzles under 100
  console.log(`Generating ${under100Count} puzzles with target < 100...`);
  while (generated < under100Count && attempts < maxAttempts) {
    attempts++;
    const puzzle = generateSolvable5TilePuzzle(true);
    const key = getPuzzleKey(puzzle);

    if (!puzzleKeys.has(key)) {
      puzzleKeys.add(key);
      newPuzzles.push(puzzle);
      generated++;
      if (generated % 10 === 0) {
        console.log(`  Generated ${generated}/${under100Count}...`);
      }
    }
  }

  console.log(`\nGenerating ${over100Count} puzzles with target 100-149...`);
  const startCount = generated;
  while (generated < startCount + over100Count && attempts < maxAttempts) {
    attempts++;
    const puzzle = generateSolvable5TilePuzzle(false);
    const key = getPuzzleKey(puzzle);

    if (!puzzleKeys.has(key)) {
      puzzleKeys.add(key);
      newPuzzles.push(puzzle);
      generated++;
      if ((generated - startCount) % 10 === 0) {
        console.log(`  Generated ${generated - startCount}/${over100Count}...`);
      }
    }
  }

  if (newPuzzles.length < 80) {
    console.log(`\nWarning: Only generated ${newPuzzles.length}/80 puzzles after ${attempts} attempts`);
  } else {
    console.log(`\n✓ Successfully generated ${newPuzzles.length} unique puzzles`);
  }

  // Validate all new puzzles are solvable
  console.log(`\nValidating solvability...`);
  const unsolvable = newPuzzles.filter(p => !isPuzzleSolvable(p));
  if (unsolvable.length > 0) {
    console.log(`  ✗ Found ${unsolvable.length} unsolvable puzzles, removing...`);
    unsolvable.forEach(p => {
      const index = newPuzzles.indexOf(p);
      newPuzzles.splice(index, 1);
    });
  } else {
    console.log(`  ✓ All ${newPuzzles.length} puzzles are solvable`);
  }

  // Combine with existing puzzles
  const allPuzzles = [...existingPuzzles, ...newPuzzles];

  // Write to file
  fs.writeFileSync(
    puzzlesPath,
    JSON.stringify(allPuzzles, null, 2) + '\n',
    'utf-8'
  );

  console.log(`\n✓ Added ${newPuzzles.length} new puzzles to puzzles5tile.json`);
  console.log(`  Total puzzles: ${allPuzzles.length}`);
  
  // Print summary
  const under100 = allPuzzles.filter(p => p.target < 100).length;
  const over100 = allPuzzles.filter(p => p.target >= 100 && p.target <= 149).length;
  const over149 = allPuzzles.filter(p => p.target > 149).length;
  console.log(`\nSummary:`);
  console.log(`  Target < 100: ${under100}`);
  console.log(`  Target 100-149: ${over100}`);
  console.log(`  Target > 149: ${over149}`);
}

main();

