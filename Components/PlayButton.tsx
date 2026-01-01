import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle, TextStyle } from 'react-native';
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

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: ANIMATION.SCALE_PRESSED_LIGHT, // Slightly shrink when pressed
      duration: ANIMATION.DURATION_FAST,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: ANIMATION.SCALE_NORMAL, // Return to normal size
      duration: ANIMATION.DURATION_FAST,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    soundManager.playSound('buttonPress');
    onPress();
  };

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
    paddingVertical: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    borderWidth: BUTTON_BORDER.WIDTH * 2, // Thin-moderate border (2x the standard thin border)
    borderColor: BUTTON_BORDER.COLOR,
  },
  buttonInner: {
    width: '100%' as const,
    height: '100%' as const,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontSize: FONT_SIZES.TARGET_NUMBER,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.TARGET_NUMBER,
    // Enhanced shadow for 3D pop effect (matching targetNumber in GameScreen)
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});

