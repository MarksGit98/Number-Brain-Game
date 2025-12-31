/**
 * Puzzle Solver Test File
 * 
 * This file contains DFS and BFS algorithms to determine if a puzzle is solvable.
 * A puzzle is solvable if it's possible to combine the given digits using
 * +, -, *, / operations to end up with a single number that equals the target.
 */

type Operation = '+' | '-' | '*' | '/';

interface Puzzle {
  digits: number[];
  target: number;
}

interface PuzzleState {
  numbers: number[];
  operations: Array<{ operation: Operation; operands: [number, number]; result: number }>;
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
export function solveWithDFS(puzzle: Puzzle): boolean {
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
 * BFS (Breadth-First Search) solver
 * Uses a queue to explore all possible states level by level
 */
export function solveWithBFS(puzzle: Puzzle): boolean {
  const queue: number[][] = [[...puzzle.digits]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentNumbers = queue.shift()!;

    // Check if we've reached the target
    if (currentNumbers.length === 1) {
      if (currentNumbers[0] === puzzle.target) {
        return true;
      }
      continue;
    }

    // Create state key to avoid duplicate states
    const stateKey = getStateKey(currentNumbers);
    if (visited.has(stateKey)) {
      continue;
    }
    visited.add(stateKey);

    const operations: Operation[] = ['+', '-', '*', '/'];

    // Try all pairs of numbers
    for (let i = 0; i < currentNumbers.length; i++) {
      for (let j = i + 1; j < currentNumbers.length; j++) {
        const a = currentNumbers[i];
        const b = currentNumbers[j];
        
        // Create remaining numbers array
        const remaining = currentNumbers.filter((_, idx) => idx !== i && idx !== j);

        // Try all operations
        for (const op of operations) {
          // Try a op b
          const result = performOperation(a, b, op);
          if (result !== null && result >= 0) {
            const newState = [...remaining, result];
            const newStateKey = getStateKey(newState);
            if (!visited.has(newStateKey)) {
              queue.push(newState);
            }
          }

          // Try b op a (for non-commutative operations)
          if (op === '-' || op === '/') {
            const reverseResult = performOperation(b, a, op);
            if (reverseResult !== null && reverseResult >= 0) {
              const newState = [...remaining, reverseResult];
              const newStateKey = getStateKey(newState);
              if (!visited.has(newStateKey)) {
                queue.push(newState);
              }
            }
          }
        }
      }
    }
  }

  return false;
}

/**
 * Main function to test if a puzzle is solvable
 * Uses DFS by default (more memory efficient)
 */
export function isPuzzleSolvable(puzzle: Puzzle, useBFS: boolean = false): boolean {
  if (puzzle.digits.length === 0) {
    return false;
  }

  if (puzzle.digits.length === 1) {
    return puzzle.digits[0] === puzzle.target;
  }

  return useBFS ? solveWithBFS(puzzle) : solveWithDFS(puzzle);
}

/**
 * Test function to compare DFS and BFS results
 */
export function testPuzzle(puzzle: Puzzle): {
  solvable: boolean;
  dfsResult: boolean;
  bfsResult: boolean;
  resultsMatch: boolean;
} {
  const dfsResult = solveWithDFS(puzzle);
  const bfsResult = solveWithBFS(puzzle);
  
  return {
    solvable: dfsResult,
    dfsResult,
    bfsResult,
    resultsMatch: dfsResult === bfsResult,
  };
}

/**
 * Test multiple puzzles
 */
export function testMultiplePuzzles(puzzles: Puzzle[]): void {
  console.log('Testing puzzles with DFS and BFS:\n');
  console.log('='.repeat(80));
  
  puzzles.forEach((puzzle, index) => {
    const result = testPuzzle(puzzle);
    console.log(`\nPuzzle ${index + 1}:`);
    console.log(`  Digits: [${puzzle.digits.join(', ')}]`);
    console.log(`  Target: ${puzzle.target}`);
    console.log(`  DFS Result: ${result.dfsResult ? 'SOLVABLE' : 'NOT SOLVABLE'}`);
    console.log(`  BFS Result: ${result.bfsResult ? 'SOLVABLE' : 'NOT SOLVABLE'}`);
    console.log(`  Results Match: ${result.resultsMatch ? '✓' : '✗ MISMATCH!'}`);
  });
  
  console.log('\n' + '='.repeat(80));
}

// Example usage and test cases
// Run tests when executed directly with ts-node
// Example: npx ts-node puzzleSolverTest.ts

// Test cases
const testPuzzles: Puzzle[] = [
  { digits: [9, 7, 7, 6], target: 56 },
  { digits: [8, 5, 3, 2], target: 24 },
  { digits: [6, 4, 4, 3], target: 18 },
  { digits: [5, 5, 2, 1], target: 12 },
  { digits: [7, 6, 5, 4], target: 28 },
  { digits: [1, 1, 1, 1], target: 100 }, // Should be unsolvable
  { digits: [9, 9, 9, 9], target: 1 }, // Should be unsolvable
];

// Run tests if this file is executed directly
// To run: npx ts-node puzzleSolverTest.ts
if (process.argv[1] && process.argv[1].endsWith('puzzleSolverTest.ts')) {
  testMultiplePuzzles(testPuzzles);
}

