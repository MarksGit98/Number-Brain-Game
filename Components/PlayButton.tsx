import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, View, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { FONT_SIZES, CALCULATOR_DISPLAY, LETTER_SPACING, SPACING, COLORS, ANIMATION, BUTTON_BORDER, SCREEN_DIMENSIONS } from '../constants/sizing';
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
  const chyronAnim = useRef(new Animated.Value(0)).current;

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

  // Chyron animation - scrolls text horizontally (matches CSS chyronWrap)
  // Animation goes: 100% -> -100% -> 100% over 8 seconds (faster)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        // Move from left to right - takes 50% of animation (4 seconds)
        Animated.timing(chyronAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        // Move back from right to left - takes 50% of animation (4 seconds)
        Animated.timing(chyronAnim, {
          toValue: 2,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Calculate translation range based on inner border area
  // Text should animate within the inner border bounds
  const buttonWidth = CALCULATOR_DISPLAY.WIDTH;
  const borderWidth = BUTTON_BORDER.WIDTH * 5;
  const innerBorderOffset = borderWidth + 2; // Border width + small gap
  const innerWidth = buttonWidth - (innerBorderOffset * 2); // Available width inside inner border
  
  // Estimate text width - "PLAY" with letter spacing (using reduced font size)
  const letterSpacing = LETTER_SPACING.WIDE;
  const playButtonTextSize = FONT_SIZES.PLAY_BUTTON_TEXT * 0.85; // Match the reduced font size in styles
  const estimatedTextWidth = (playButtonTextSize * 4) + (letterSpacing * 3); // 4 chars + 3 spaces
  
  // Scroll range: ensure text stays within inner border bounds
  // Maximum scroll is half the difference between inner width and text width
  // Add minimum scroll range to ensure animation is visible even if calculation is small
  const calculatedScrollRange = (innerWidth - estimatedTextWidth) / 2;
  const minScrollRange = SCREEN_DIMENSIONS.WIDTH * 0.05; // Minimum scroll range to ensure visibility
  const maxScrollRange = Math.max(minScrollRange, calculatedScrollRange);
  
  // Interpolate translateX: 0 -> 1 -> 2 maps to -maxScrollRange -> +maxScrollRange -> -maxScrollRange
  // This creates the left-to-right scrolling effect where text moves within inner border bounds
  const translateX = chyronAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-maxScrollRange, maxScrollRange, -maxScrollRange],
  });

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
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <Text style={[styles.text, textStyle]}>PLAY</Text>
        </Animated.View>
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
    overflow: 'hidden' as const, // Ensure content is clipped to border radius
    display: 'flex', // Ensure flex layout
  },
  buttonInner: {
    position: 'absolute' as const,
    top: BUTTON_BORDER.WIDTH * 5 + 2, // Match inner border position
    left: BUTTON_BORDER.WIDTH * 5 + 2,
    right: BUTTON_BORDER.WIDTH * 5 + 2,
    bottom: BUTTON_BORDER.WIDTH * 5 + 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden' as const, // Clip text to inner border area
    display: 'flex' as const,
  },
  textContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  text: {
    fontSize: FONT_SIZES.PLAY_BUTTON_TEXT * 0.85, // Reduced font size for chyron
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.PLAY_BUTTON_TEXT * 0.85 * 0.95, // Adjusted line height to match reduced font size
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
    borderRadius: Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 5) - 2), // Ensure non-negative
    zIndex: 0, // Behind darken overlay and text
  },
  darkenOverlay: {
    position: 'absolute',
    backgroundColor: '#000000', // Black overlay to darken background
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 5), // Match button radius minus border
    zIndex: 1, // Above inner border but below text and TouchableOpacity
  },
});

