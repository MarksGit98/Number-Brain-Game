/**
 * Script to validate puzzles.json and remove unsolvable puzzles
 */

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
      if (a - b < 0) return null; // No negative results allowed
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
 * Creates a unique key for a state (sorted numbers array)
 */
function getStateKey(numbers: number[]): string {
  return [...numbers].sort((a, b) => a - b).join(',');
}

/**
 * DFS (Depth-First Search) solver
 * Uses recursion to explore all possible combinations
 */
function solveWithDFS(puzzle: Puzzle): boolean {
  const visited = new Set<string>();
  
  function dfs(numbers: number[]): boolean {
    // Base case: if we have one number, check if it matches target
    if (numbers.length === 1) {
      return numbers[0] === puzzle.target;
    }

    // Create state key to avoid duplicate states
    const stateKey = getStateKey(numbers);
    if (visited.has(stateKey)) {
      return false;
    }
    visited.add(stateKey);

    const operations: Operation[] = ['+', '-', '*', '/'];

    // Try all pairs of numbers
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const a = numbers[i];
        const b = numbers[j];
        
        // Create remaining numbers array
        const remaining = numbers.filter((_, idx) => idx !== i && idx !== j);

        // Try all operations
        for (const op of operations) {
          // Try a op b
          const result = performOperation(a, b, op);
          if (result !== null && result >= 0) {
            if (dfs([...remaining, result])) {
              return true;
            }
          }

          // Try b op a (for non-commutative operations)
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

/**
 * Main function to test if a puzzle is solvable
 */
function isPuzzleSolvable(puzzle: Puzzle): boolean {
  if (puzzle.digits.length === 0) {
    return false;
  }

  if (puzzle.digits.length === 1) {
    return puzzle.digits[0] === puzzle.target;
  }

  return solveWithDFS(puzzle);
}

function validatePuzzles(): void {
  const puzzlesPath = path.join(process.cwd(), 'puzzles.json');
  
  // Read puzzles.json
  const puzzlesData = fs.readFileSync(puzzlesPath, 'utf-8');
  const puzzles: Puzzle[] = JSON.parse(puzzlesData);

  console.log(`Testing ${puzzles.length} puzzles...\n`);
  console.log('='.repeat(80));

  const solvablePuzzles: Puzzle[] = [];
  const unsolvablePuzzles: Puzzle[] = [];

  puzzles.forEach((puzzle, index) => {
    const isSolvable = isPuzzleSolvable(puzzle);
    
    console.log(`Puzzle ${index + 1}: [${puzzle.digits.join(', ')}] → Target: ${puzzle.target}`);
    console.log(`  Result: ${isSolvable ? '✓ SOLVABLE' : '✗ NOT SOLVABLE'}`);
    
    if (isSolvable) {
      solvablePuzzles.push(puzzle);
    } else {
      unsolvablePuzzles.push(puzzle);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\nSummary:`);
  console.log(`  Solvable: ${solvablePuzzles.length}`);
  console.log(`  Unsolvable: ${unsolvablePuzzles.length}`);

  if (unsolvablePuzzles.length > 0) {
    console.log(`\nRemoving ${unsolvablePuzzles.length} unsolvable puzzle(s):`);
    unsolvablePuzzles.forEach((puzzle) => {
      console.log(`  - [${puzzle.digits.join(', ')}] → Target: ${puzzle.target}`);
    });

    // Write only solvable puzzles back to puzzles.json
    fs.writeFileSync(
      puzzlesPath,
      JSON.stringify(solvablePuzzles, null, 2) + '\n',
      'utf-8'
    );

    console.log(`\n✓ Updated puzzles.json with ${solvablePuzzles.length} solvable puzzle(s)`);
  } else {
    console.log(`\n✓ All puzzles are solvable! No changes needed.`);
  }
}

// Run validation
validatePuzzles();
