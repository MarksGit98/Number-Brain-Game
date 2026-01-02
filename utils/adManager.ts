/**
 * AdMob Manager for Number Brain Game
 * Conditionally loads AdMob only in production builds
 */

// Check if we're in a production build (not Expo Go)
const isProductionBuild = !__DEV__ || (typeof process !== 'undefined' && process.env.NODE_ENV === 'production');

// Conditionally import AdMob
let mobileAds: any = null;
let BannerAd: any = null;
let InterstitialAd: any = null;

if (isProductionBuild) {
  try {
    // Only import in production builds
    const googleMobileAds = require('react-native-google-mobile-ads');
    mobileAds = googleMobileAds.mobileAds;
    BannerAd = googleMobileAds.BannerAd;
    InterstitialAd = googleMobileAds.InterstitialAd;
  } catch (error) {
    console.warn('AdMob library not available (expected in development):', error);
  }
}

// Test ad unit IDs (replace with your actual IDs)
const AD_UNIT_IDS = {
  BANNER: __DEV__ 
    ? 'ca-app-pub-3940256099942544/6300978111' // Google test banner
    : 'YOUR_BANNER_AD_UNIT_ID', // Replace with your actual banner ad unit ID
  INTERSTITIAL: __DEV__
    ? 'ca-app-pub-3940256099942544/1033173712' // Google test interstitial
    : 'YOUR_INTERSTITIAL_AD_UNIT_ID', // Replace with your actual interstitial ad unit ID
};

class AdManager {
  private isInitialized: boolean = false;
  private interstitialAd: any = null;
  private solvedPuzzleCount: number = 0;
  private adsEnabled: boolean = true;
  private isAdFree: boolean = false;

  /**
   * Initialize AdMob (only in production builds)
   */
  async initialize(): Promise<void> {
    if (!isProductionBuild || !mobileAds) {
      console.log('AdMob not initialized (development mode)');
      return;
    }

    try {
      await mobileAds().initialize();
      this.isInitialized = true;
      this.loadInterstitial();
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize AdMob:', error);
    }
  }

  /**
   * Load an interstitial ad
   */
  async loadInterstitial(): Promise<void> {
    if (!isProductionBuild || !InterstitialAd || !this.adsEnabled || this.isAdFree) {
      return;
    }

    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
      });
      
      // Preload the ad
      await this.interstitialAd.load();
    } catch (error) {
      console.warn('Failed to load interstitial ad:', error);
    }
  }

  /**
   * Show interstitial ad if conditions are met
   */
  async showInterstitial(): Promise<void> {
    if (!isProductionBuild || !this.interstitialAd || !this.adsEnabled || this.isAdFree) {
      return;
    }

    // Show ad every 3 solved puzzles
    this.solvedPuzzleCount++;
    if (this.solvedPuzzleCount < 3) {
      return;
    }

    try {
      const isLoaded = await this.interstitialAd.loaded;
      if (isLoaded) {
        await this.interstitialAd.show();
        this.solvedPuzzleCount = 0; // Reset counter
        // Load next interstitial
        this.loadInterstitial();
      } else {
        // Try to load and show
        await this.interstitialAd.load();
        const loaded = await this.interstitialAd.loaded;
        if (loaded) {
          await this.interstitialAd.show();
          this.solvedPuzzleCount = 0;
          this.loadInterstitial();
        }
      }
    } catch (error) {
      console.warn('Failed to show interstitial ad:', error);
      // Try to reload for next time
      this.loadInterstitial();
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
    this.isAdFree = adFree;
    this.adsEnabled = !adFree;
    this.solvedPuzzleCount = 0;
  }

  /**
   * Check if ads are enabled
   */
  areAdsEnabled(): boolean {
    return this.adsEnabled && !this.isAdFree;
  }

  /**
   * Check if ad-free
   */
  isAdFreeUser(): boolean {
    return this.isAdFree;
  }

  /**
   * Get BannerAd component (returns null if not available)
   */
  getBannerAdComponent(): any {
    return BannerAd;
  }

  /**
   * Get banner ad unit ID
   */
  getBannerAdUnitId(): string {
    return AD_UNIT_IDS.BANNER;
  }

  /**
   * Check if AdMob is available
   */
  isAvailable(): boolean {
    return isProductionBuild && mobileAds !== null && this.isInitialized;
  }
}

// Export singleton instance
export const adManager = new AdManager();

// Export BannerAd component for conditional rendering
export { BannerAd };

