import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from '../types';

const STORAGE_KEYS = {
  COMPLETED_PUZZLES: '@NumberBrain:completedPuzzles',
  LAST_PLAYED_DIFFICULTY: '@NumberBrain:lastPlayedDifficulty',
  LAST_PLAYED_INDEX: '@NumberBrain:lastPlayedIndex',
  MUSIC_ENABLED: '@NumberBrain:musicEnabled',
  SOUND_EFFECTS_ENABLED: '@NumberBrain:soundEffectsEnabled',
  ADS_ENABLED: '@NumberBrain:adsEnabled',
  AD_FREE: '@NumberBrain:adFree',
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
 * Save music enabled preference
 */
export async function saveMusicEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MUSIC_ENABLED, JSON.stringify(enabled));
  } catch (error) {
    console.warn('Failed to save music enabled preference:', error);
  }
}

/**
 * Load music enabled preference
 */
export async function loadMusicEnabled(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MUSIC_ENABLED);
    if (data !== null) {
      return JSON.parse(data) as boolean;
    }
  } catch (error) {
    console.warn('Failed to load music enabled preference:', error);
  }
  return true; // Default to enabled
}

/**
 * Save sound effects enabled preference
 */
export async function saveSoundEffectsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND_EFFECTS_ENABLED, JSON.stringify(enabled));
  } catch (error) {
    console.warn('Failed to save sound effects enabled preference:', error);
  }
}

/**
 * Load sound effects enabled preference
 */
export async function loadSoundEffectsEnabled(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SOUND_EFFECTS_ENABLED);
    if (data !== null) {
      return JSON.parse(data) as boolean;
    }
  } catch (error) {
    console.warn('Failed to load sound effects enabled preference:', error);
  }
  return true; // Default to enabled
}

/**
 * Save ads enabled preference
 */
export async function saveAdsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ADS_ENABLED, JSON.stringify(enabled));
  } catch (error) {
    console.warn('Failed to save ads enabled preference:', error);
  }
}

/**
 * Load ads enabled preference
 */
export async function loadAdsEnabled(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ADS_ENABLED);
    if (data !== null) {
      return JSON.parse(data) as boolean;
    }
  } catch (error) {
    console.warn('Failed to load ads enabled preference:', error);
  }
  return true; // Default to enabled
}

/**
 * Save ad-free status
 */
export async function saveAdFree(adFree: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AD_FREE, JSON.stringify(adFree));
  } catch (error) {
    console.warn('Failed to save ad-free status:', error);
  }
}

/**
 * Load ad-free status
 */
export async function loadAdFree(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.AD_FREE);
    if (data !== null) {
      return JSON.parse(data) as boolean;
    }
  } catch (error) {
    console.warn('Failed to load ad-free status:', error);
  }
  return false; // Default to not ad-free
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
      STORAGE_KEYS.MUSIC_ENABLED,
      STORAGE_KEYS.SOUND_EFFECTS_ENABLED,
      STORAGE_KEYS.ADS_ENABLED,
      STORAGE_KEYS.AD_FREE,
    ]);
  } catch (error) {
    console.warn('Failed to clear game data:', error);
  }
}
