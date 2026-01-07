import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, View, ViewStyle, TextStyle } from 'react-native';
import { BUTTON_SIZES, BUTTON_BORDER, ANIMATION, COLORS, SHADOW_OFFSETS, NUMERIC_CONSTANTS, ELEVATION, PADDING_VALUES } from '../constants/sizing';

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
  const isPressedRef = useRef(false);

  // Map operation symbols to match web version
  const displaySymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation === '+' ? '＋' : operation === '-' ? '−' : operation;
  
  // Adjust vertical alignment for different symbols to center them properly (matching web version)
  // Scale adjustments proportionally with button size
  // Calculate transform directly as a constant value to ensure it's applied on first render
  const verticalAdjustmentScale = BUTTON_SIZES.OPERATION_BUTTON_SIZE / 100;
  let verticalAdjustment: Array<{ translateY: number }>;
  if (operation === '+') {
    verticalAdjustment = [{ translateY: 16 * verticalAdjustmentScale }]; // Plus needs to move down even more to center
  } else if (operation === '-') {
    verticalAdjustment = [{ translateY: -1 * verticalAdjustmentScale }]; // Minus needs to move up
  } else if (operation === '*') {
    verticalAdjustment = [{ translateY: -1 * verticalAdjustmentScale }]; // Multiplication needs to move up
  } else if (operation === '/') {
    verticalAdjustment = [{ translateY: -1 * verticalAdjustmentScale }]; // Division needs to move up
  } else {
    verticalAdjustment = [{ translateY: 0 }];
  }

  // Handle press in (button pressed down)
  const handlePressIn = () => {
    if (!disabled && !isSelected) {
      isPressedRef.current = true;
      const shadowOffset = SHADOW_OFFSETS.CIRCULAR.width;
      Animated.parallel([
        Animated.timing(translateXAnim, {
          toValue: shadowOffset,
          duration: ANIMATION.DURATION_FAST,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: shadowOffset,
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
    if (!disabled && !isSelected) {
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
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.CIRCULAR,
            shadowRadius: 0, // Solid black shadow (matches other buttons)
            borderWidth: BUTTON_BORDER.WIDTH,
            borderColor: BUTTON_BORDER.COLOR,
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
          <View style={{ transform: verticalAdjustment }}>
            <Text 
              style={[
                styles.text,
                textStyle
              ]}
            >
              {displaySymbol}
            </Text>
          </View>
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
    margin: BUTTON_SIZES.OPERATION_BUTTON_MARGIN * 0.5, // Reduced margin to match web version
  },
  buttonInner: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: BUTTON_SIZES.OPERATION_BUTTON_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonSelected: {
    backgroundColor: COLORS.BUTTON_ORANGE_DARK,
  },
  buttonDisabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    shadowOpacity: ANIMATION.OPACITY_SHADOW_MEDIUM,
    opacity: ANIMATION.OPACITY_DISABLED,
  },
  text: {
    fontSize: BUTTON_SIZES.OPERATION_BUTTON_SIZE * 0.85, // Scale font size proportionally to button size (matching web version)
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Digital-7-Mono',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: BUTTON_SIZES.OPERATION_BUTTON_SIZE * 0.85, // Match font size for proper vertical centering
  },
});

