import React, { useRef, forwardRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle, TextStyle } from 'react-native';
import type { ComponentRef } from 'react';
import { BUTTON_SIZES, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER, ANIMATION, COLORS, SHADOW_OFFSETS, NUMERIC_CONSTANTS } from '../constants/sizing';
import { TEXT_SHADOW_BOLD_MEDIUM } from '../constants/fonts';

interface DigitButtonProps {
  digit: number;
  onPress: () => void;
  disabled?: boolean;
  isFirstSelected?: boolean;
  isSecondSelected?: boolean;
  isError?: boolean;
  isAnimating?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const DigitButton = forwardRef<ComponentRef<typeof TouchableOpacity>, DigitButtonProps>(({
  digit,
  onPress,
  disabled = false,
  isFirstSelected = false,
  isSecondSelected = false,
  isError = false,
  isAnimating = false,
  style,
  textStyle,
}, ref) => {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;
  const isPressedRef = useRef(false);

  const getBackgroundColor = () => {
    if (isError) return COLORS.DIGIT_ERROR;
    if (isFirstSelected) return COLORS.DIGIT_FIRST_SELECTED;
    if (isSecondSelected) return COLORS.DIGIT_SECOND_SELECTED;
    return COLORS.BACKGROUND_WHITE;
  };

  const getTextColor = () => {
    if (isError || isFirstSelected || isSecondSelected) return COLORS.TEXT_WHITE;
    return COLORS.TEXT_SECONDARY;
  };

  const isSelected = isFirstSelected || isSecondSelected || isError;

  // Handle press in (button pressed down)
  const handlePressIn = () => {
    if (!disabled && !isAnimating && !isSelected) {
      isPressedRef.current = true;
      Animated.parallel([
        Animated.timing(translateXAnim, {
          toValue: SHADOW_OFFSETS.STANDARD_ALT.width,
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: SHADOW_OFFSETS.STANDARD_ALT.height,
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacityAnim, {
          toValue: ANIMATION.OPACITY_HIDDEN,
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  // Handle press out (button released)
  const handlePressOut = () => {
    if (!disabled && !isAnimating && !isSelected) {
      isPressedRef.current = false;
      Animated.parallel([
        Animated.timing(translateXAnim, {
          toValue: ANIMATION.TRANSLATE_X_NORMAL,
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: ANIMATION.TRANSLATE_Y_NORMAL,
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacityAnim, {
          toValue: ANIMATION.OPACITY_FULL,
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  // Animate between unselected and selected states
  useEffect(() => {
    if (!isPressedRef.current) {
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
    }
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
            backgroundColor: getBackgroundColor(),
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.STANDARD_ALT,
            shadowRadius: 0, // Solid black shadow (matches other buttons)
            borderWidth: BUTTON_BORDER.WIDTH,
            borderColor: BUTTON_BORDER.COLOR,
          },
          style,
        ]}
      >
        <TouchableOpacity
          ref={ref}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || isAnimating}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          <Text style={[
            styles.text,
            { 
              color: getTextColor(),
              fontSize: digit.toString().length > 2 
                ? FONT_SIZES.DIGIT_TEXT * 0.7 // Shrink to 70% for 3+ digits
                : FONT_SIZES.DIGIT_TEXT
            },
            textStyle
          ]}>
            {digit}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

DigitButton.displayName = 'DigitButton';

export default DigitButton;

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZES.DIGIT_BUTTON_SIZE,
    height: BUTTON_SIZES.DIGIT_BUTTON_SIZE,
    borderRadius: BORDER_RADIUS.XLARGE,
    margin: BUTTON_SIZES.DIGIT_BUTTON_MARGIN,
  },
  buttonInner: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: BORDER_RADIUS.XLARGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontWeight: 'bold',
    ...TEXT_SHADOW_BOLD_MEDIUM,
  },
});

