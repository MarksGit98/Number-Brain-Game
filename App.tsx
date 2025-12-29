import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Operation = '+' | '-' | '*' | '/';

interface GameState {
  digits: number[];
  target: number;
  selectedIndices: number[];
  history: Array<{ operation: Operation; operands: [number, number]; result: number }>;
}

function generatePuzzle(): { digits: number[]; target: number } {
  // Generate 4 random single-digit numbers (1-9)
  const digits: number[] = [];
  for (let i = 0; i < 4; i++) {
    digits.push(Math.floor(Math.random() * 9) + 1);
  }
  
  // For now, generate a random target between 20 and 100
  // In a full implementation, you'd want to ensure the target is solvable
  const target = Math.floor(Math.random() * 80) + 20;
  
  return { digits, target };
}

function performOperation(a: number, b: number, operation: Operation): number | null {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      // Only allow division if result is a whole number
      if (b === 0) return null;
      const result = a / b;
      return Number.isInteger(result) ? result : null;
    default:
      return null;
  }
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const puzzle = generatePuzzle();
    return {
      digits: puzzle.digits,
      target: puzzle.target,
      selectedIndices: [],
      history: [],
    };
  });

  const handleDigitPress = (index: number) => {
    setGameState((prev) => {
      const newIndices = [...prev.selectedIndices];
      const existingIndex = newIndices.indexOf(index);
      
      if (existingIndex !== -1) {
        // Deselect if already selected
        newIndices.splice(existingIndex, 1);
      } else if (newIndices.length < 2) {
        // Select if not already selected and we have space
        newIndices.push(index);
      }
      
      return { ...prev, selectedIndices: newIndices };
    });
  };

  const handleOperationPress = (operation: Operation) => {
    if (gameState.selectedIndices.length !== 2) {
      Alert.alert('Select Two Numbers', 'Please select exactly two numbers to perform an operation.');
      return;
    }

    const [index1, index2] = gameState.selectedIndices;
    const a = gameState.digits[index1];
    const b = gameState.digits[index2];

    const result = performOperation(a, b, operation);
    
    if (result === null || result < 0) {
      Alert.alert('Invalid Operation', 'This operation results in an invalid number. Please try a different operation.');
      return;
    }

    setGameState((prev) => {
      const newDigits = [...prev.digits];
      // Remove the two selected digits and add the result
      // Sort indices in descending order to remove from end first
      const sortedIndices = [...prev.selectedIndices].sort((a, b) => b - a);
      sortedIndices.forEach((idx) => newDigits.splice(idx, 1));
      newDigits.push(result);

      const newHistory = [...prev.history, {
        operation,
        operands: [a, b],
        result: result,
      }];

      // Check win condition
      if (newDigits.length === 1 && newDigits[0] === prev.target) {
        setTimeout(() => {
          Alert.alert('Success!', `You reached the target number ${prev.target}!`, [
            {
              text: 'New Game',
              onPress: () => {
                const puzzle = generatePuzzle();
                setGameState({
                  digits: puzzle.digits,
                  target: puzzle.target,
                  selectedIndices: [],
                  history: [],
                });
              },
            },
          ]);
        }, 100);
      }

      // Check lose condition (only one number left but it's not the target)
      if (newDigits.length === 1 && newDigits[0] !== prev.target) {
        setTimeout(() => {
          Alert.alert('Game Over', `You ended with ${newDigits[0]}, but the target was ${prev.target}.`, [
            {
              text: 'Try Again',
              onPress: () => {
                const puzzle = generatePuzzle();
                setGameState({
                  digits: puzzle.digits,
                  target: puzzle.target,
                  selectedIndices: [],
                  history: [],
                });
              },
            },
          ]);
        }, 100);
      }

      return {
        digits: newDigits,
        target: prev.target,
        selectedIndices: [],
        history: newHistory,
      };
    });
  };

  const handleReset = () => {
    const puzzle = generatePuzzle();
    setGameState({
      digits: puzzle.digits,
      target: puzzle.target,
      selectedIndices: [],
      history: [],
    });
  };

  const operations: Operation[] = ['+', '-', '*', '/'];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>Number Brain</Text>
      
      <View style={styles.targetContainer}>
        <Text style={styles.targetLabel}>Target:</Text>
        <Text style={styles.targetNumber}>{gameState.target}</Text>
      </View>

      <View style={styles.digitsContainer}>
        {gameState.digits.map((digit, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.digitButton,
              gameState.selectedIndices.includes(index) && styles.digitButtonSelected,
            ]}
            onPress={() => handleDigitPress(index)}
          >
            <Text style={[
              styles.digitText,
              gameState.selectedIndices.includes(index) && styles.digitTextSelected,
            ]}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.operationsContainer}>
        {operations.map((op) => (
          <TouchableOpacity
            key={op}
            style={styles.operationButton}
            onPress={() => handleOperationPress(op)}
          >
            <Text style={styles.operationText}>{op}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {gameState.history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>History:</Text>
          {gameState.history.slice(-3).map((entry, index) => (
            <Text key={index} style={styles.historyText}>
              {entry.operands[0]} {entry.operation} {entry.operands[1]} = {entry.result}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  targetLabel: {
    fontSize: 22,
    color: '#666',
    marginRight: 12,
    fontWeight: '600',
  },
  targetNumber: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  digitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  digitButton: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  digitButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  digitText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  digitTextSelected: {
    color: '#fff',
  },
  operationsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  operationButton: {
    width: 65,
    height: 65,
    backgroundColor: '#2196F3',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  operationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  controlsContainer: {
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

