import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, View, ViewStyle, TextStyle } from 'react-native';
import { FONT_SIZES, CALCULATOR_DISPLAY, LETTER_SPACING, SPACING, COLORS, ANIMATION, BUTTON_BORDER } from '../constants/sizing';
import { TEXT_SHADOW_BOLD_STRONG } from '../constants/fonts';
import { soundManager } from '../utils/soundManager';

interface PlayButtonProps {
  onPress: () => void;
  variant: 'easy' | 'medium' | 'hard';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function PlayButton({
  onPress,
  variant,
  style,
  textStyle,
}: PlayButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: ANIMATION.SCALE_PRESSED_LIGHT, // Slightly shrink when pressed
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.5, // Darken overlay (50% opacity black overlay)
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: ANIMATION.SCALE_NORMAL, // Return to normal size
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0, // Remove darken overlay
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    soundManager.playSound('buttonPress');
    onPress();
  };

  const borderWidth = BUTTON_BORDER.WIDTH * 5;

  return (
    <Animated.View
      style={[
        styles.button,
        {
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      <View style={styles.innerBorder} />
      <View style={styles.bevel} />
      <Animated.View
        style={[
          styles.darkenOverlay,
          {
            opacity: overlayOpacity,
            top: borderWidth,
            left: borderWidth,
            right: borderWidth,
            bottom: borderWidth,
          },
        ]}
      />
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.buttonInner}
      >
        <Text style={[styles.text, textStyle]}>PLAY</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: CALCULATOR_DISPLAY.WIDTH,
    height: CALCULATOR_DISPLAY.HEIGHT,
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS,
    marginBottom: SPACING.MARGIN_XLARGE,
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: CALCULATOR_DISPLAY.PADDING_HORIZONTAL,
    paddingTop: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    paddingBottom: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    // Metallic border effect with glisten - top/left highlights, bottom/right shadows for embossed depth
    // Top border is brightest (direct light), left is slightly dimmer (indirect light) for realistic corner depth
    borderTopColor: '#B0B0B0', // Brightest metallic gray (top highlight - direct light source)
    borderLeftColor: '#909090', // Slightly dimmer metallic gray (left highlight - indirect light, creates depth at corner)
    borderRightColor: '#404040', // Dark metallic gray (right shadow - darker metal)
    borderBottomColor: '#404040', // Dark metallic gray (bottom shadow - matches right)
    borderTopWidth: BUTTON_BORDER.WIDTH * 5, // Increased border size
    borderLeftWidth: BUTTON_BORDER.WIDTH * 5,
    borderRightWidth: BUTTON_BORDER.WIDTH * 5,
    borderBottomWidth: BUTTON_BORDER.WIDTH * 5,
    // Subtle glisten effect with shadow
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    display: 'flex', // Ensure flex layout
  },
  buttonInner: {
    width: '100%' as const,
    height: '100%' as const,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    display: 'flex', // Ensure flex layout
  },
  text: {
    fontSize: FONT_SIZES.PLAY_BUTTON_TEXT,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.PLAY_BUTTON_TEXT * 0.95, // Slightly reduced to account for font metrics
    // Enhanced shadow for 3D pop effect (matching targetNumber in GameScreen)
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    zIndex: 2, // Ensure text appears above darken overlay
  },
  innerBorder: {
    position: 'absolute',
    top: BUTTON_BORDER.WIDTH * 5 + 2, // Outer border width + small gap
    left: BUTTON_BORDER.WIDTH * 5 + 2,
    right: BUTTON_BORDER.WIDTH * 5 + 2,
    bottom: BUTTON_BORDER.WIDTH * 5 + 2,
    backgroundColor: '#1F1F1F', // Slightly darker than BACKGROUND_DARK (#2C2C2C)
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 5) - 2,
    zIndex: 0, // Behind darken overlay and text
  },
  darkenOverlay: {
    position: 'absolute',
    backgroundColor: '#000000', // Black overlay to darken background
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 5), // Match button radius minus border
    zIndex: 1, // Above inner border but below text and TouchableOpacity
  },
});

