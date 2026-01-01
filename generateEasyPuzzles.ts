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
 * DFS solver
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
  if (puzzle.digits.length === 0) {
    return false;
  }
  if (puzzle.digits.length === 1) {
    return puzzle.digits[0] === puzzle.target;
  }
  return solveWithDFS(puzzle);
}

function generateSolvablePuzzle(under49: boolean): Puzzle {
  let attempts = 0;
  const maxAttempts = 50000;

  while (attempts < maxAttempts) {
    // Generate 4 random single-digit numbers (1-9)
    const digits: number[] = [];
    for (let i = 0; i < 4; i++) {
      digits.push(Math.floor(Math.random() * 9) + 1);
    }

    // Generate target based on constraint
    let target: number;
    if (under49) {
      // Majority under 49: generate between 1 and 48
      target = Math.floor(Math.random() * 48) + 1;
    } else {
      // Remaining puzzles: between 49 and 99
      target = Math.floor(Math.random() * 51) + 49;
    }

    const puzzle = { digits, target };
    if (isPuzzleSolvable(puzzle)) {
      return puzzle;
    }

    attempts++;
  }

  // Fallback
  return { digits: [9, 7, 7, 6], target: under49 ? 20 : 56 };
}

function main() {
  const puzzlesPath = path.join(process.cwd(), 'puzzles.json');
  
  // Read existing puzzles
  const existingPuzzlesData = fs.readFileSync(puzzlesPath, 'utf-8');
  const existingPuzzles: Puzzle[] = JSON.parse(existingPuzzlesData);
  
  // Create set of existing puzzle keys for uniqueness check
  const existingKeys = new Set<string>();
  existingPuzzles.forEach(puzzle => {
    existingKeys.add(getPuzzleKey(puzzle));
  });

  console.log(`Existing puzzles: ${existingPuzzles.length}`);
  console.log(`Generating 80 new easy puzzles...`);
  console.log(`  - Target <= 99`);
  console.log(`  - Majority (50+) under 49`);
  console.log(`  - All solvable`);
  console.log(`  - All unique\n`);

  const newPuzzles: Puzzle[] = [];
  const puzzleKeys = new Set<string>(existingKeys);
  let generated = 0;
  let attempts = 0;
  const maxAttempts = 100000;

  // Generate 50 puzzles with target under 49 (majority)
  const under49Count = 50;
  // Generate 30 puzzles with target 49-99
  const over49Count = 30;

  // Generate puzzles under 49
  console.log(`Generating ${under49Count} puzzles with target < 49...`);
  while (generated < under49Count && attempts < maxAttempts) {
    attempts++;
    const puzzle = generateSolvablePuzzle(true);
    const key = getPuzzleKey(puzzle);

    if (!puzzleKeys.has(key)) {
      puzzleKeys.add(key);
      newPuzzles.push(puzzle);
      generated++;
      if (generated % 10 === 0) {
        console.log(`  Generated ${generated}/${under49Count}...`);
      }
    }
  }

  console.log(`\nGenerating ${over49Count} puzzles with target 49-99...`);
  const startCount = generated;
  while (generated < startCount + over49Count && attempts < maxAttempts) {
    attempts++;
    const puzzle = generateSolvablePuzzle(false);
    const key = getPuzzleKey(puzzle);

    if (!puzzleKeys.has(key)) {
      puzzleKeys.add(key);
      newPuzzles.push(puzzle);
      generated++;
      if ((generated - startCount) % 10 === 0) {
        console.log(`  Generated ${generated - startCount}/${over49Count}...`);
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

  console.log(`\n✓ Added ${newPuzzles.length} new puzzles to puzzles.json`);
  console.log(`  Total puzzles: ${allPuzzles.length}`);
  
  // Print summary
  const under49 = allPuzzles.filter(p => p.target < 49).length;
  const over49 = allPuzzles.filter(p => p.target >= 49 && p.target <= 99).length;
  const over99 = allPuzzles.filter(p => p.target > 99).length;
  console.log(`\nSummary:`);
  console.log(`  Target < 49: ${under49}`);
  console.log(`  Target 49-99: ${over49}`);
  console.log(`  Target > 99: ${over99}`);
}

main();

