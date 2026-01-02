/**
 * Web-specific banner ad component using Google AdSense
 * Replaces the mobile BannerAdComponent for web platform
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { adManager } from './adManager';

interface BannerAdComponentProps {
  enabled?: boolean;
}

export default function BannerAdComponent({ enabled = true }: BannerAdComponentProps) {
  const adContainerRef = useRef<View | null>(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !adManager.isAdsEnabled()) {
      return;
    }

    // Initialize AdSense if not already done
    adManager.initialize();

    // Load AdSense ad
    const loadAd = () => {
      if (adLoadedRef.current || typeof window === 'undefined') {
        return;
      }

      try {
        const adUnitId = adManager.getBannerAdUnitId();
        const publisherId = adManager.getPublisherId();

        // Create AdSense ad unit using DOM manipulation
        const adContainer = document.createElement('div');
        adContainer.id = 'adsense-banner-container';
        adContainer.innerHTML = `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="${publisherId}"
               data-ad-slot="${adUnitId}"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        `;

        // Find the root element and append ad container
        const rootElement = document.getElementById('root');
        if (rootElement) {
          // Create a wrapper div at the bottom
          const wrapper = document.createElement('div');
          wrapper.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; display: flex; justify-content: center;';
          wrapper.appendChild(adContainer);
          rootElement.appendChild(wrapper);
        }

        // Push ad to AdSense
        const checkAndPush = () => {
          if ((window as any).adsbygoogle) {
            (window as any).adsbygoogle.push({});
            adLoadedRef.current = true;
          } else {
            setTimeout(checkAndPush, 100);
          }
        };
        checkAndPush();
      } catch (error) {
        console.warn('Failed to load AdSense ad:', error);
      }
    };

    // Wait a bit for DOM to be ready
    setTimeout(loadAd, 500);

    // Cleanup
    return () => {
      const container = document.getElementById('adsense-banner-container');
      if (container && container.parentElement) {
        container.parentElement.remove();
      }
      adLoadedRef.current = false;
    };
  }, [enabled]);

  if (!enabled || !adManager.isAdsEnabled()) {
    return null;
  }

  // Return empty View - ad is injected directly into DOM
  return null;
}

