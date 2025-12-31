import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle, TextStyle } from 'react-native';
import { BUTTON_SIZES, FONT_SIZES, CALCULATOR_DISPLAY, SHADOW, LETTER_SPACING, SPACING } from '../constants/sizing';

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
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(translateYAnim, {
        toValue: 4,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.button,
          style,
        ]}
      >
        <Text style={[styles.text, textStyle]}>PLAY</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZES.PLAY_BUTTON_WIDTH,
    height: BUTTON_SIZES.PLAY_BUTTON_HEIGHT,
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.MARGIN_XLARGE,
    backgroundColor: '#2C2C2C',
    paddingHorizontal: CALCULATOR_DISPLAY.PADDING_HORIZONTAL,
    paddingVertical: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    shadowColor: '#000',
    shadowOffset: SHADOW.OFFSET_MEDIUM,
    shadowOpacity: SHADOW.OPACITY_FULL,
    shadowRadius: 0,
    elevation: 0,
  },
  text: {
    fontSize: FONT_SIZES.PLAY_BUTTON,
    fontWeight: '900',
    color: '#4CAF50',
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.EXTRA_WIDE,
  },
});

