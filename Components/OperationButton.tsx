import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, View, ViewStyle, TextStyle } from 'react-native';
import { BUTTON_SIZES, FONT_SIZES, SHADOW, BUTTON_BORDER, ANIMATION, COLORS, SHADOW_OFFSETS, NUMERIC_CONSTANTS, ELEVATION, PADDING_VALUES } from '../constants/sizing';
import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface OperationButtonProps {
  operation: string;
  onPress: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function OperationButton({
  operation,
  onPress,
  disabled = false,
  isSelected = false,
  style,
  textStyle,
}: OperationButtonProps) {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;

  // Animate between unselected and selected states
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateXAnim, {
        toValue: isSelected ? ANIMATION.TRANSLATE_X_SELECTED : ANIMATION.TRANSLATE_X_NORMAL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: isSelected ? ANIMATION.TRANSLATE_Y_SELECTED : ANIMATION.TRANSLATE_Y_NORMAL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: isSelected ? ANIMATION.OPACITY_HIDDEN : ANIMATION.OPACITY_FULL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isSelected, translateXAnim, translateYAnim, shadowOpacityAnim]);

  return (
    <Animated.View
      style={[
        {
          transform: [
            { translateX: translateXAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.CIRCULAR,
            shadowRadius: 0, // Solid black shadow (matches other buttons)
          },
          isSelected && styles.buttonSelected,
          disabled && styles.buttonDisabled,
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          <Text style={[
            styles.text,
            operation === '+' && styles.textPlus, // Special centering for plus symbol
            textStyle
          ]}>
            {operation === '*' ? '×' : operation === '/' ? '÷' : operation === '+' ? '＋' : operation === '-' ? '−' : operation}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZES.OPERATION_BUTTON_SIZE,
    height: BUTTON_SIZES.OPERATION_BUTTON_SIZE,
    backgroundColor: COLORS.BUTTON_ORANGE,
    borderRadius: BUTTON_SIZES.OPERATION_BUTTON_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
    margin: BUTTON_SIZES.OPERATION_BUTTON_MARGIN,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    elevation: ELEVATION.NONE,
  },
  buttonInner: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: BUTTON_SIZES.OPERATION_BUTTON_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: PADDING_VALUES.ZERO, // Ensure no padding affects centering
  },
  buttonSelected: {
    backgroundColor: COLORS.BUTTON_ORANGE_DARK,
  },
  buttonDisabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    shadowOpacity: ANIMATION.OPACITY_SHADOW_MEDIUM,
    elevation: ELEVATION.NONE,
    opacity: ANIMATION.OPACITY_DISABLED,
  },
  text: {
    fontSize: FONT_SIZES.OPERATION_SYMBOL * NUMERIC_CONSTANTS.FONT_MULTIPLIER_FULL,
    fontWeight: '900' as const, // Extra bold for bolder appearance
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Digital-7-Mono',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.OPERATION_SYMBOL * NUMERIC_CONSTANTS.FONT_MULTIPLIER_FULL,
  },
  textPlus: {
    // Offset the plus symbol lower so it appears centered (scaled by screen height)
    transform: [{ translateY: SCREEN_HEIGHT * 0.008 }], // Offset down based on screen height for proper scaling
  },
});

