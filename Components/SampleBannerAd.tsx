import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// AdMob standard banner dimensions
// Standard banner: 320x50 dp (density-independent pixels)
// On most devices, 50dp ≈ 50px, but we'll use screen-relative sizing
const BANNER_HEIGHT = 50; // Standard AdMob banner height in pixels
const BANNER_WIDTH = Math.min(320, SCREEN_WIDTH); // Standard width, but full-width on smaller screens

export default function SampleBannerAd() {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Sample Ad Banner</Text>
        <Text style={styles.bannerSubtext}>{Math.round(BANNER_WIDTH)} × {BANNER_HEIGHT}px</Text>
      </View>
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
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  banner: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    backgroundColor: '#E0E0E0', // Light gray background
    borderTopWidth: 2,
    borderTopColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 2,
  },
  bannerSubtext: {
    fontSize: 10,
    color: '#9E9E9E',
  },
});

