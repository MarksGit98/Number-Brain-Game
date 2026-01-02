/**
 * Web-specific sound manager - No-op implementation
 * Sound and music are disabled for web version
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

class SoundManager {
  private musicEnabled: boolean = false;
  private soundEnabled: boolean = false;

  /**
   * Initialize the sound manager (no-op for web)
   */
  async initialize(): Promise<void> {
    // No initialization needed - sounds disabled for web
  }

  /**
   * Preload a sound file (no-op for web)
   */
  async loadSound(type: SoundType, source: string): Promise<void> {
    // No-op - sounds disabled for web
  }

  /**
   * Preload all sound effects (no-op for web)
   */
  async loadAllSounds(): Promise<void> {
    // No-op - sounds disabled for web
  }

  /**
   * Load background music (no-op for web)
   */
  async loadBackgroundMusic(): Promise<void> {
    // No-op - music disabled for web
  }

  /**
   * Play background music (no-op for web)
   */
  async playBackgroundMusic(): Promise<void> {
    // No-op - music disabled for web
  }

  /**
   * Stop background music (no-op for web)
   */
  async stopBackgroundMusic(): Promise<void> {
    // No-op - music disabled for web
  }

  /**
   * Set music enabled/disabled (no-op for web)
   */
  async setMusicEnabled(enabled: boolean): Promise<void> {
    this.musicEnabled = enabled;
    // No-op - music disabled for web
  }

  /**
   * Check if music is enabled
   */
  isMusicEnabled(): boolean {
    return false; // Always disabled for web
  }

  /**
   * Play a sound effect (no-op for web)
   */
  async playSound(type: SoundType): Promise<void> {
    // No-op - sounds disabled for web
  }

  /**
   * Stop a sound (no-op for web)
   */
  async stopSound(type: SoundType): Promise<void> {
    // No-op - sounds disabled for web
  }

  /**
   * Set volume (no-op for web)
   */
  async setVolume(volume: number): Promise<void> {
    // No-op - sounds disabled for web
  }

  /**
   * Enable or disable sound effects
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    // No-op - sounds disabled for web
  }

  /**
   * Check if sounds are enabled
   */
  isSoundEnabled(): boolean {
    return false; // Always disabled for web
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return 0; // No volume for web
  }

  /**
   * Unload all sounds and cleanup (no-op for web)
   */
  async cleanup(): Promise<void> {
    // No-op - sounds disabled for web
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

