import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { BUTTON_SIZES, SHADOW, ANIMATION, COLORS, NUMERIC_CONSTANTS, ELEVATION, SHADOW_OFFSETS, INSET_SHADOW, BUTTON_BORDER, BORDER_RADIUS_ADJUSTMENTS, PADDING_VALUES } from '../constants/sizing';

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
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.STANDARD_ALT,
          },
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
                backgroundColor: COLORS.OVERLAY_BLUE_OPERATION_PRESSED,
                opacity: pressOverlayAnim.interpolate({
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
                opacity: insetShadowOpacityAnim,
              },
            ]}
            pointerEvents="none"
          />
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
    shadowRadius: ELEVATION.NONE,
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
  pressOverlay: {
    position: 'absolute',
    top: NUMERIC_CONSTANTS.POSITION_TOP,
    left: NUMERIC_CONSTANTS.POSITION_LEFT,
    right: NUMERIC_CONSTANTS.POSITION_RIGHT,
    bottom: NUMERIC_CONSTANTS.POSITION_BOTTOM,
    borderRadius: BUTTON_SIZES.NAV_ARROW_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
  },
  insetShadow: {
    position: 'absolute',
    top: SHADOW.OFFSET_SMALL.height / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    left: SHADOW.OFFSET_SMALL.width / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    right: SHADOW.OFFSET_SMALL.width / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    bottom: SHADOW.OFFSET_SMALL.height / NUMERIC_CONSTANTS.DIVIDE_BY_2,
    borderRadius: (BUTTON_SIZES.NAV_ARROW_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2) - BORDER_RADIUS_ADJUSTMENTS.INSET_SHADOW_OFFSET, // Circular
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
});

