import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { PressableButton3DStyles } from '../Styles/buttonStyles';
import { soundManager } from '../utils/soundManager';

interface PressableButton3DProps {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

export default function PressableButton3D({
  onPress,
  disabled = false,
  style,
  textStyle,
  children,
  variant = 'primary',
  size = 'medium',
}: PressableButton3DProps) {
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
        toValue: 2,
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return PressableButton3DStyles.primary;
      case 'secondary':
        return PressableButton3DStyles.secondary;
      case 'success':
        return PressableButton3DStyles.success;
      case 'danger':
        return PressableButton3DStyles.danger;
      case 'warning':
        return PressableButton3DStyles.warning;
      case 'neutral':
        return PressableButton3DStyles.neutral;
      default:
        return PressableButton3DStyles.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return PressableButton3DStyles.small;
      case 'medium':
        return PressableButton3DStyles.medium;
      case 'large':
        return PressableButton3DStyles.large;
      default:
        return PressableButton3DStyles.medium;
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();
  const disabledStyle = disabled ? PressableButton3DStyles.disabled : {};

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
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[
          PressableButton3DStyles.base,
          variantStyle,
          sizeStyle,
          disabledStyle,
          style,
        ]}
      >
        {typeof children === 'string' ? (
          <Animated.Text style={[PressableButton3DStyles.text, variantStyle.text, sizeStyle.text, textStyle]}>
            {children}
          </Animated.Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

