import React, { useRef, forwardRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle, TextStyle } from 'react-native';
import { BUTTON_SIZES, FONT_SIZES, BORDER_RADIUS, SHADOW, INSET_SHADOW, BUTTON_BORDER, ANIMATION, COLORS, SHADOW_OFFSETS, BORDER_RADIUS_ADJUSTMENTS, PERCENTAGES, FONT_WEIGHTS, NUMERIC_CONSTANTS } from '../constants/sizing';

interface DigitButtonProps {
  digit: number;
  onPress: () => void;
  disabled?: boolean;
  isFirstSelected?: boolean;
  isSecondSelected?: boolean;
  isAnimating?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const DigitButton = forwardRef<TouchableOpacity, DigitButtonProps>(({
  digit,
  onPress,
  disabled = false,
  isFirstSelected = false,
  isSecondSelected = false,
  isAnimating = false,
  style,
  textStyle,
}, ref) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;
  const insetShadowOpacityAnim = useRef(new Animated.Value(0)).current;
  const pressOverlayAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: ANIMATION.SCALE_PRESSED,
        useNativeDriver: true,
        tension: ANIMATION.TENSION,
        friction: ANIMATION.FRICTION,
      }),
      Animated.timing(translateYAnim, {
        toValue: ANIMATION.TRANSLATE_Y_PRESSED,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: ANIMATION.OPACITY_HIDDEN,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: false,
      }),
      Animated.timing(insetShadowOpacityAnim, {
        toValue: ANIMATION.OPACITY_FULL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: false,
      }),
      Animated.timing(pressOverlayAnim, {
        toValue: ANIMATION.OPACITY_FULL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    const isSelected = isFirstSelected || isSecondSelected;
    if (isSelected) {
      // When selected button is released, animate overlay back to darker selected color
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: ANIMATION.SCALE_NORMAL,
          useNativeDriver: true,
          tension: ANIMATION.TENSION,
          friction: ANIMATION.FRICTION,
        }),
        Animated.timing(pressOverlayAnim, {
          toValue: ANIMATION.OPACITY_HIDDEN, // Return to 0 (darker selected color)
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: false,
        }),
      ]).start();
      return;
    }
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: ANIMATION.SCALE_NORMAL,
        useNativeDriver: true,
        tension: ANIMATION.TENSION,
        friction: ANIMATION.FRICTION,
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
      Animated.timing(insetShadowOpacityAnim, {
        toValue: ANIMATION.OPACITY_HIDDEN,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: false,
      }),
      Animated.timing(pressOverlayAnim, {
        toValue: ANIMATION.OPACITY_HIDDEN,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getBackgroundColor = () => {
    if (isFirstSelected) return COLORS.DIGIT_FIRST_SELECTED;
    if (isSecondSelected) return COLORS.DIGIT_SECOND_SELECTED;
    return COLORS.BACKGROUND_WHITE;
  };

  const getShadowColor = () => {
    return COLORS.SHADOW_BLACK;
  };

  const getTextColor = () => {
    if (isFirstSelected || isSecondSelected) return COLORS.TEXT_WHITE;
    return COLORS.TEXT_SECONDARY;
  };

  const getPressOverlayColor = () => {
    // During press animation, use much darker color
    const isPressing = pressOverlayAnim._value > 0 && pressOverlayAnim._value < 1;
    if (isPressing) {
      // Much darker color during press animation
      if (isFirstSelected) return COLORS.OVERLAY_BLUE_DARKER;
      if (isSecondSelected) return COLORS.OVERLAY_RED_DARKER;
      return COLORS.OVERLAY_BLUE_DARKER; // Darker blue overlay during press
    }
    // When fully selected, use lighter shade
    if (isFirstSelected) return COLORS.OVERLAY_BLUE_LIGHT; // Very light blue overlay when selected (lighter shade)
    if (isSecondSelected) return COLORS.OVERLAY_RED_LIGHT; // Very light red overlay when selected (lighter shade)
    return COLORS.OVERLAY_BLUE_DARK; // Default press color
  };

  const isSelected = isFirstSelected || isSecondSelected;

  // Update shadow opacity and scale when selection changes
  useEffect(() => {
    if (isSelected) {
      shadowOpacityAnim.setValue(ANIMATION.OPACITY_HIDDEN);
      insetShadowOpacityAnim.setValue(ANIMATION.OPACITY_FULL);
      pressOverlayAnim.setValue(ANIMATION.OPACITY_HIDDEN); // Set to 0 to show darker selected color (not actively pressing)
      // Ensure scale is reset to 1 when selected
      scaleAnim.setValue(ANIMATION.SCALE_NORMAL);
      translateYAnim.setValue(ANIMATION.TRANSLATE_Y_SELECTED);
    } else {
      shadowOpacityAnim.setValue(ANIMATION.OPACITY_FULL);
      insetShadowOpacityAnim.setValue(ANIMATION.OPACITY_HIDDEN);
      pressOverlayAnim.setValue(ANIMATION.OPACITY_HIDDEN);
      // Ensure scale is reset to 1 when unselected
      scaleAnim.setValue(ANIMATION.SCALE_NORMAL);
      translateYAnim.setValue(ANIMATION.TRANSLATE_Y_NORMAL);
    }
  }, [isSelected, shadowOpacityAnim, insetShadowOpacityAnim, pressOverlayAnim, scaleAnim, translateYAnim]);

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
          opacity: isAnimating ? ANIMATION.OPACITY_HIDDEN : ANIMATION.OPACITY_FULL,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: isSelected ? ANIMATION.OPACITY_HIDDEN : shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.STANDARD_ALT,
          },
          isSelected && styles.buttonSelected,
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
          {/* Dark overlay that appears when pressed */}
          <Animated.View
            style={[
              styles.pressOverlay,
              {
                backgroundColor: pressOverlayAnim.interpolate({
                  inputRange: ANIMATION.INTERPOLATION_INPUT,
                  outputRange: [
                    // When not pressed (0): darker overlay if selected, transparent if not
                    isSelected 
                      ? (isFirstSelected ? COLORS.OVERLAY_BLUE_DARKER : COLORS.OVERLAY_RED_DARKER)
                      : 'transparent',
                    // When fully pressed (1): lighter color during active press
                    isFirstSelected 
                      ? COLORS.OVERLAY_BLUE_LIGHT 
                      : isSecondSelected 
                        ? COLORS.OVERLAY_RED_LIGHT 
                        : COLORS.OVERLAY_BLUE_LIGHT,
                  ],
                }),
                opacity: isSelected 
                  ? pressOverlayAnim.interpolate({
                      inputRange: [0, 0.3, 0.7, 1],
                      outputRange: [1, 0.6, 0.6, 1], // Show lighter during transition when pressing selected button
                    })
                  : pressOverlayAnim.interpolate({
                      inputRange: ANIMATION.INTERPOLATION_INPUT,
                      outputRange: ANIMATION.INTERPOLATION_OUTPUT,
                    }),
              },
            ]}
            pointerEvents="none"
          />
          {/* Inset shadow layer for pressed state - positioned inside */}
          <Animated.View
            style={[
              styles.insetShadow,
              {
                opacity: isSelected ? ANIMATION.OPACITY_FULL : insetShadowOpacityAnim,
              },
            ]}
            pointerEvents="none"
          />
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
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
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonInner: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: BORDER_RADIUS.XLARGE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressOverlay: {
    position: 'absolute',
    top: NUMERIC_CONSTANTS.POSITION_TOP,
    left: NUMERIC_CONSTANTS.POSITION_LEFT,
    right: NUMERIC_CONSTANTS.POSITION_RIGHT,
    bottom: NUMERIC_CONSTANTS.POSITION_BOTTOM,
    borderRadius: BORDER_RADIUS.XLARGE,
  },
  buttonSelected: {
    transform: [{ translateX: SHADOW.OFFSET_SMALL.width }, { translateY: SHADOW.OFFSET_SMALL.height }],
  },
  insetShadow: {
    position: 'absolute',
    top: SHADOW.OFFSET_SMALL.height / 2,
    left: SHADOW.OFFSET_SMALL.width / 2,
    right: SHADOW.OFFSET_SMALL.width / 2,
    bottom: SHADOW.OFFSET_SMALL.height / 2,
    borderRadius: BORDER_RADIUS.XLARGE - BORDER_RADIUS_ADJUSTMENTS.INSET_SHADOW_OFFSET,
    shadowColor: COLORS.SHADOW_BLACK,
    shadowOffset: SHADOW_OFFSETS.ZERO,
    shadowOpacity: ANIMATION.OPACITY_SHADOW_FULL,
    shadowRadius: SHADOW.RADIUS_SMALL,
    elevation: 0,
  },
  text: {
    fontSize: FONT_SIZES.DIGIT_TEXT,
    fontWeight: FONT_WEIGHTS.BOLD, // Bolder
    fontFamily: 'Digital-7-Mono',
  },
});

