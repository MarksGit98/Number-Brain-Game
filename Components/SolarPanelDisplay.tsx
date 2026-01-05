import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { SCREEN_DIMENSIONS, SPACING, BUTTON_BORDER } from '../constants/sizing';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

interface SolarPanelDisplayProps {
  style?: ViewStyle;
  borderWidth?: number;
  borderColor?: string;
  marginTop?: number;
  marginBottom?: number;
}

export default function SolarPanelDisplay({
  style,
  borderWidth = BUTTON_BORDER.WIDTH * 2, // Default to game screen style
  borderColor = '#16A34A', // Default to game screen style (darker green)
  marginTop = 0,
  marginBottom = SPACING.MARGIN_MEDIUM,
}: SolarPanelDisplayProps) {
  return (
    <View style={[
      styles.titleContainer,
      {
        borderWidth,
        borderColor,
        marginTop,
        marginBottom,
      },
      style,
    ]}>
      {['D', 'I', 'G', 'I', 'T', 'L'].map((letter, i) => (
        <React.Fragment key={i}>
          <View style={styles.solarPanelCell}>
            <Text style={styles.titleLetter}>{letter}</Text>
          </View>
          {i < 5 && <View style={styles.solarPanelDivider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#4ADE80', // Vibrant green for solar panel container
    paddingVertical: SCREEN_HEIGHT * 0.004, // Slightly increased padding
    paddingHorizontal: SCREEN_WIDTH * 0.025, // Slightly increased padding
    borderRadius: SCREEN_HEIGHT * 0.008, // Slightly larger border radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT * 0.045, // Increased height
    width: SCREEN_WIDTH * 0.45, // Increased width
    alignSelf: 'center', // Center horizontally
    // Create rectangular solar panel cells
    overflow: 'hidden',
  },
  solarPanelCell: {
    flex: 1,
    height: '100%',
    backgroundColor: '#22C55E', // Darker vibrant green for individual solar panel cells
    alignItems: 'center',
    justifyContent: 'center',
  },
  solarPanelDivider: {
    width: 2,
    height: '100%',
    backgroundColor: '#4ADE80', // Same as container background for vertical bar
  },
  titleLetter: {
    fontSize: SCREEN_HEIGHT * 0.028, // Slightly larger to match bigger container
    fontFamily: 'Digital-7-Mono',
    color: '#FFFFFF', // White text to complement vibrant green solar panel
    textAlign: 'center',
    textAlignVertical: 'center', // Ensure vertical centering
    includeFontPadding: false, // Prevent extra padding that could cause cutoff
    lineHeight: SCREEN_HEIGHT * 0.028, // Match font size for proper vertical centering
  },
});

