import { Audio } from 'expo-av';

/**
 * Sound Manager for Number Brain Game
 * Handles all sound effects in the game
 */

export type SoundType = 
  | 'buttonPress' 
  | 'buttonRelease' 
  | 'errorClick'
  | 'operationSuccess' 
  | 'operationError' 
  | 'puzzleComplete' 
  | 'levelComplete'
  | 'menuNavigation';

interface SoundConfig {
  volume: number;
  shouldPlay: boolean;
}

class SoundManager {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private config: SoundConfig = {
    volume: 0.7,
    shouldPlay: true,
  };

  /**
   * Initialize the sound manager
   */
  async initialize(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.warn('Failed to initialize audio mode:', error);
    }
  }

  /**
   * Preload a sound file
   */
  async loadSound(type: SoundType, source: any): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: false, volume: this.config.volume }
      );
      this.sounds.set(type, sound);
    } catch (error) {
      console.warn(`Failed to load sound ${type}:`, error);
    }
  }

  /**
   * Preload all sound effects
   */
  async loadAllSounds(): Promise<void> {
    try {
      await this.loadSound('buttonPress', require('../assets/sounds/button-press.mp3'));
      await this.loadSound('buttonRelease', require('../assets/sounds/button-release.wav'));
      await this.loadSound('errorClick', require('../assets/sounds/error-click.wav'));
      await this.loadSound('puzzleComplete', require('../assets/sounds/success.wav'));
    } catch (error) {
      console.warn('Failed to load some sounds:', error);
    }
  }

  /**
   * Play a sound effect
   */
  async playSound(type: SoundType): Promise<void> {
    if (!this.config.shouldPlay) {
      return;
    }

    try {
      const sound = this.sounds.get(type);
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.warn(`Failed to play sound ${type}:`, error);
    }
  }

  /**
   * Stop a sound
   */
  async stopSound(type: SoundType): Promise<void> {
    try {
      const sound = this.sounds.get(type);
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.warn(`Failed to stop sound ${type}:`, error);
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  async setVolume(volume: number): Promise<void> {
    this.config.volume = Math.max(0, Math.min(1, volume));
    try {
      const updatePromises = Array.from(this.sounds.values()).map(sound =>
        sound.setVolumeAsync(this.config.volume)
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.warn('Failed to update volume:', error);
    }
  }

  /**
   * Enable or disable sound effects
   */
  setSoundEnabled(enabled: boolean): void {
    this.config.shouldPlay = enabled;
  }

  /**
   * Check if sounds are enabled
   */
  isSoundEnabled(): boolean {
    return this.config.shouldPlay;
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.config.volume;
  }

  /**
   * Unload all sounds and cleanup
   */
  async cleanup(): Promise<void> {
    const unloadPromises = Array.from(this.sounds.values()).map(sound =>
      sound.unloadAsync().catch(error => 
        console.warn('Failed to unload sound:', error)
      )
    );
    await Promise.all(unloadPromises);
    this.sounds.clear();
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

