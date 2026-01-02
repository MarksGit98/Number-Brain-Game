import React from 'react';
import { View, StyleSheet } from 'react-native';
import { adManager } from '../utils/adManager';

interface BannerAdComponentProps {
  enabled?: boolean;
}

export default function BannerAdComponent({ enabled = true }: BannerAdComponentProps) {
  const BannerAd = adManager.getBannerAdComponent();
  const adUnitId = adManager.getBannerAdUnitId();
  const isAvailable = adManager.isAvailable();
  const shouldShow = enabled && adManager.areAdsEnabled() && isAvailable;

  if (!shouldShow || !BannerAd) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size="BANNER"
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});

