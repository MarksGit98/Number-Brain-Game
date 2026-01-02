/**
 * Web-specific ad manager using Google AdSense
 * For web, we use Google AdSense instead of react-native-google-mobile-ads
 */

// Google AdSense Publisher ID (replace with your actual AdSense publisher ID)
// Format: ca-pub-XXXXXXXXXXXXXXXX
const ADSENSE_PUBLISHER_ID = process.env.REACT_APP_ADSENSE_PUBLISHER_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

// AdSense ad unit IDs (replace with your actual ad unit IDs)
const AD_UNIT_IDS = {
  BANNER: process.env.REACT_APP_ADSENSE_BANNER_ID || 'YOUR_BANNER_AD_UNIT_ID',
  INTERSTITIAL: process.env.REACT_APP_ADSENSE_INTERSTITIAL_ID || 'YOUR_INTERSTITIAL_AD_UNIT_ID',
};

class AdManager {
  private adsEnabled: boolean = true;
  private adFree: boolean = false;
  private isInitialized: boolean = false;
  private solvedPuzzleCount: number = 0;

  /**
   * Initialize Google AdSense
   */
  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Load Google AdSense script
      if (!document.getElementById('adsbygoogle-script')) {
        const script = document.createElement('script');
        script.id = 'adsbygoogle-script';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      this.isInitialized = true;
      console.log('Google AdSense initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize Google AdSense:', error);
    }
  }

  /**
   * Set ads enabled/disabled
   */
  setAdsEnabled(enabled: boolean): void {
    this.adsEnabled = enabled;
    if (!enabled) {
      this.solvedPuzzleCount = 0;
    }
  }

  /**
   * Set ad-free status
   */
  setAdFree(adFree: boolean): void {
    this.adFree = adFree;
    this.adsEnabled = !adFree;
    this.solvedPuzzleCount = 0;
  }

  /**
   * Check if ads are enabled
   */
  isAdsEnabled(): boolean {
    return this.adsEnabled && !this.adFree;
  }

  /**
   * Check if AdSense is available
   */
  isAvailable(): boolean {
    return this.isInitialized && typeof window !== 'undefined' && (window as any).adsbygoogle !== undefined;
  }

  /**
   * Get banner ad unit ID
   */
  getBannerAdUnitId(): string {
    return AD_UNIT_IDS.BANNER;
  }

  /**
   * Get AdSense publisher ID
   */
  getPublisherId(): string {
    return ADSENSE_PUBLISHER_ID;
  }

  /**
   * Show interstitial ad (for web, we'll use a modal approach)
   */
  async showInterstitialAd(): Promise<void> {
    if (!this.isAdsEnabled() || !this.isAvailable()) {
      return;
    }

    // Show ad every 3 solved puzzles (matching mobile behavior)
    this.solvedPuzzleCount++;
    if (this.solvedPuzzleCount < 3) {
      return;
    }

    // For web, interstitial ads are typically shown in a modal or overlay
    // You can implement a modal that displays an AdSense ad unit
    // This is a placeholder - implement based on your UI needs
    this.solvedPuzzleCount = 0;
  }

  /**
   * Get BannerAd component (returns null for web - we use HTML instead)
   */
  getBannerAdComponent(): any {
    return null; // Web uses HTML ad units, not React components
  }
}

// Export singleton instance
export const adManager = new AdManager();

