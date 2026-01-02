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
  private backgroundMusic: Audio.Sound | null = null;
  private config: SoundConfig = {
    volume: 0.7,
    shouldPlay: true,
  };
  private musicEnabled: boolean = true;
  private musicVolume: number = 0.3; // Lower volume for background music

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
      await this.loadBackgroundMusic();
    } catch (error) {
      console.warn('Failed to load some sounds:', error);
    }
  }

  /**
   * Load background music
   */
  async loadBackgroundMusic(): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/background-music.mp3'),
        { 
          shouldPlay: false, 
          volume: this.musicVolume,
          isLooping: true, // Loop the background music
        }
      );
      this.backgroundMusic = sound;
      // Don't start playing here - let setMusicEnabled handle it after loading
    } catch (error) {
      console.warn('Failed to load background music:', error);
    }
  }

  /**
   * Play background music
   */
  async playBackgroundMusic(): Promise<void> {
    if (!this.musicEnabled || !this.backgroundMusic) {
      return;
    }

    try {
      const status = await this.backgroundMusic.getStatusAsync();
      if (!status.isLoaded || !status.isPlaying) {
        await this.backgroundMusic.playAsync();
      }
    } catch (error) {
      console.warn('Failed to play background music:', error);
    }
  }

  /**
   * Stop background music
   */
  async stopBackgroundMusic(): Promise<void> {
    if (!this.backgroundMusic) {
      return;
    }

    try {
      await this.backgroundMusic.pauseAsync();
    } catch (error) {
      console.warn('Failed to stop background music:', error);
    }
  }

  /**
   * Set music enabled/disabled
   */
  async setMusicEnabled(enabled: boolean): Promise<void> {
    this.musicEnabled = enabled;
    
    if (enabled) {
      await this.playBackgroundMusic();
    } else {
      await this.stopBackgroundMusic();
    }
  }

  /**
   * Check if music is enabled
   */
  isMusicEnabled(): boolean {
    return this.musicEnabled;
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
    
    if (this.backgroundMusic) {
      unloadPromises.push(
        this.backgroundMusic.unloadAsync().catch(error =>
          console.warn('Failed to unload background music:', error)
        )
      );
      this.backgroundMusic = null;
    }
    
    await Promise.all(unloadPromises);
    this.sounds.clear();
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

