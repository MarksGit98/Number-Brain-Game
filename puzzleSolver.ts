type Operation = '+' | '-' | '*' | '/';

interface Puzzle {
  digits: number[];
  target: number;
}

function performOperation(a: number, b: number, operation: Operation): number | null {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      if (a - b < 0) return null; // No negative results
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

  // Try all pairs of digits
  for (let i = 0; i < digits.length; i++) {
    for (let j = i + 1; j < digits.length; j++) {
      const a = digits[i];
      const b = digits[j];
      const remaining = digits.filter((_, idx) => idx !== i && idx !== j);

      // Try all operations
      for (const op of operations) {
        const result = performOperation(a, b, op);
        if (result !== null && result >= 0) {
          // Try solving with the new number
          if (solvePuzzle([...remaining, result], target)) {
            return true;
          }
        }

        // Try reverse operation (b op a) for non-commutative operations
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

export function isPuzzleSolvable(puzzle: Puzzle): boolean {
  return solvePuzzle([...puzzle.digits], puzzle.target);
}

export function generateSolvablePuzzle(): Puzzle {
  let attempts = 0;
  const maxAttempts = 10000;

  while (attempts < maxAttempts) {
    // Generate 4 random single-digit numbers (1-9)
    const digits: number[] = [];
    for (let i = 0; i < 4; i++) {
      digits.push(Math.floor(Math.random() * 9) + 1);
    }

    // Generate a reasonable target (between 1 and 200)
    const target = Math.floor(Math.random() * 199) + 1;

    const puzzle = { digits, target };
    if (isPuzzleSolvable(puzzle)) {
      return puzzle;
    }

    attempts++;
  }

  // Fallback: return a known solvable puzzle
  return { digits: [9, 7, 7, 6], target: 56 };
}

