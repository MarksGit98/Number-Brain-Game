import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from '../types';

const STORAGE_KEYS = {
  COMPLETED_PUZZLES: '@NumberBrain:completedPuzzles',
  LAST_PLAYED_DIFFICULTY: '@NumberBrain:lastPlayedDifficulty',
  LAST_PLAYED_INDEX: '@NumberBrain:lastPlayedIndex',
};

/**
 * Save completed puzzles to storage
 */
export async function saveCompletedPuzzles(completedPuzzles: Set<string>): Promise<void> {
  try {
    const puzzlesArray = Array.from(completedPuzzles);
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_PUZZLES, JSON.stringify(puzzlesArray));
  } catch (error) {
    console.warn('Failed to save completed puzzles:', error);
  }
}

/**
 * Load completed puzzles from storage
 */
export async function loadCompletedPuzzles(): Promise<Set<string>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_PUZZLES);
    if (data) {
      const puzzlesArray = JSON.parse(data) as string[];
      return new Set(puzzlesArray);
    }
  } catch (error) {
    console.warn('Failed to load completed puzzles:', error);
  }
  return new Set<string>();
}

/**
 * Save the last played level
 */
export async function saveLastPlayedLevel(
  difficulty: Difficulty,
  index: number
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_PLAYED_DIFFICULTY, difficulty);
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_PLAYED_INDEX, JSON.stringify(index));
  } catch (error) {
    console.warn('Failed to save last played level:', error);
  }
}

/**
 * Load the last played level
 */
export async function loadLastPlayedLevel(): Promise<{
  difficulty: Difficulty | null;
  index: number | null;
}> {
  try {
    const difficulty = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PLAYED_DIFFICULTY) as Difficulty | null;
    const indexData = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PLAYED_INDEX);
    const index = indexData ? JSON.parse(indexData) : null;
    return {
      difficulty,
      index,
    };
  } catch (error) {
    console.warn('Failed to load last played level:', error);
    return { difficulty: null, index: null };
  }
}

/**
 * Clear all saved game data (for testing/reset)
 */
export async function clearAllGameData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.COMPLETED_PUZZLES,
      STORAGE_KEYS.LAST_PLAYED_DIFFICULTY,
      STORAGE_KEYS.LAST_PLAYED_INDEX,
    ]);
  } catch (error) {
    console.warn('Failed to clear game data:', error);
  }
}
