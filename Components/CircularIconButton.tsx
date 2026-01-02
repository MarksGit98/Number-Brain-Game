import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { BUTTON_SIZES, ANIMATION, COLORS, NUMERIC_CONSTANTS, ELEVATION, SHADOW_OFFSETS, BUTTON_BORDER, PADDING_VALUES } from '../constants/sizing';
import { soundManager } from '../utils/soundManager';

interface CircularIconButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

export default function CircularIconButton({
  onPress,
  disabled = false,
  style,
  children,
}: CircularIconButtonProps) {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(translateXAnim, {
        toValue: ANIMATION.TRANSLATE_X_PRESSED,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
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
    ]).start();
  };

  const handlePressOut = () => {
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
  };

  const handlePress = () => {
    if (!disabled) {
      soundManager.playSound('buttonPress');
    }
    onPress();
  };

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
          disabled && styles.buttonDisabled,
          style,
          {
            shadowColor: disabled ? COLORS.BACKGROUND_DISABLED_DARK : COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.CIRCULAR,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
    backgroundColor: COLORS.BUTTON_BLUE,
    borderRadius: BUTTON_SIZES.NAV_ARROW_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    shadowRadius: 0, // Solid black shadow
    elevation: ELEVATION.NONE,
  },
  buttonInner: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: BUTTON_SIZES.NAV_ARROW_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: PADDING_VALUES.ZERO, // Ensure no padding affects centering
  },
  buttonDisabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    shadowOpacity: ANIMATION.OPACITY_SHADOW_MEDIUM,
    elevation: ELEVATION.NONE,
    opacity: ANIMATION.OPACITY_DISABLED,
  },
});

