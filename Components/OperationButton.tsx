import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle, TextStyle } from 'react-native';
import { BUTTON_SIZES, FONT_SIZES, BORDER_RADIUS, SHADOW, INSET_SHADOW, BUTTON_BORDER, ANIMATION, COLORS, SHADOW_OFFSETS, BORDER_RADIUS_ADJUSTMENTS, PERCENTAGES, FONT_WEIGHTS, NUMERIC_CONSTANTS, ELEVATION, PADDING_VALUES } from '../constants/sizing';

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
    if (isSelected) {
      // Keep shadow states and color if selected, but reset scale
      Animated.spring(scaleAnim, {
        toValue: ANIMATION.SCALE_NORMAL,
        useNativeDriver: true,
        tension: ANIMATION.TENSION,
        friction: ANIMATION.FRICTION,
      }).start();
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

  // Update shadow opacity and scale when selection changes
  useEffect(() => {
    if (isSelected) {
      shadowOpacityAnim.setValue(ANIMATION.OPACITY_HIDDEN);
      insetShadowOpacityAnim.setValue(ANIMATION.OPACITY_FULL);
      pressOverlayAnim.setValue(ANIMATION.OPACITY_FULL);
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
        },
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: isSelected ? ANIMATION.OPACITY_HIDDEN : shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.STANDARD_ALT,
          },
          isSelected && styles.buttonSelected,
          disabled && styles.buttonDisabled,
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          {/* Dark overlay that appears when pressed */}
          <Animated.View
            style={[
              styles.pressOverlay,
              {
                backgroundColor: isSelected ? COLORS.OVERLAY_BLUE_OPERATION_SELECTED : COLORS.OVERLAY_BLUE_OPERATION_PRESSED, // Darker during press, lighter when selected
                opacity: isSelected ? ANIMATION.OPACITY_FULL : pressOverlayAnim.interpolate({
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
          <Text style={[
            styles.text,
            (operation === '+' || operation === '-') && styles.textLarger,
            textStyle
          ]}>
            {operation === '*' ? '×' : operation === '/' ? '÷' : operation}
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
    backgroundColor: COLORS.BUTTON_BLUE,
    borderRadius: BUTTON_SIZES.OPERATION_BUTTON_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
    margin: BUTTON_SIZES.OPERATION_BUTTON_MARGIN,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    shadowColor: COLORS.SHADOW_BLACK,
    shadowRadius: ELEVATION.NONE,
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
  pressOverlay: {
    position: 'absolute',
    top: NUMERIC_CONSTANTS.POSITION_TOP,
    left: NUMERIC_CONSTANTS.POSITION_LEFT,
    right: NUMERIC_CONSTANTS.POSITION_RIGHT,
    bottom: NUMERIC_CONSTANTS.POSITION_BOTTOM,
    borderRadius: BUTTON_SIZES.OPERATION_BUTTON_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
  },
  buttonSelected: {
    backgroundColor: COLORS.BUTTON_BLUE_DARK,
    shadowColor: COLORS.SHADOW_BLACK,
    transform: [{ translateX: SHADOW.OFFSET_SMALL.width }, { translateY: SHADOW.OFFSET_SMALL.height }],
  },
  insetShadow: {
    position: 'absolute',
    top: SHADOW.OFFSET_SMALL.height / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    left: SHADOW.OFFSET_SMALL.width / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    right: SHADOW.OFFSET_SMALL.width / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    bottom: SHADOW.OFFSET_SMALL.height / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    borderRadius: (BUTTON_SIZES.OPERATION_BUTTON_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2) - BORDER_RADIUS_ADJUSTMENTS.INSET_SHADOW_OFFSET, // Circular
    borderWidth: INSET_SHADOW.BORDER_WIDTH,
    borderColor: COLORS.BORDER_DARK,
    shadowColor: COLORS.SHADOW_BLACK,
    shadowOffset: SHADOW_OFFSETS.ZERO,
    shadowOpacity: ANIMATION.OPACITY_SHADOW_FULL,
    shadowRadius: SHADOW.RADIUS_SMALL,
    elevation: ELEVATION.NONE,
  },
  buttonDisabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    shadowOpacity: ANIMATION.OPACITY_SHADOW_MEDIUM,
    elevation: ELEVATION.NONE,
    opacity: ANIMATION.OPACITY_DISABLED,
  },
  text: {
    fontSize: FONT_SIZES.OPERATION_SYMBOL * NUMERIC_CONSTANTS.FONT_MULTIPLIER_FULL, // Scaled up to full size
    fontWeight: 'normal' as const,
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Digital-7-Mono',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.OPERATION_SYMBOL * NUMERIC_CONSTANTS.FONT_MULTIPLIER_FULL, // Match fontSize for perfect centering
  },
  textLarger: {
    fontSize: FONT_SIZES.OPERATION_SYMBOL * 1.3, // 30% larger for + and - to match × and ÷ visual size
    lineHeight: FONT_SIZES.OPERATION_SYMBOL * 1.3, // Match fontSize for perfect centering
  },
});

