import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const PressableButton3DStyles = StyleSheet.create({
  base: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 0,
  },
  // Variants
  primary: {
    backgroundColor: '#2196F3',
    shadowColor: '#000',
  } as ViewStyle,
  secondary: {
    backgroundColor: '#9E9E9E',
    shadowColor: '#000',
  } as ViewStyle,
  success: {
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
  } as ViewStyle,
  danger: {
    backgroundColor: '#F44336',
    shadowColor: '#000',
  } as ViewStyle,
  warning: {
    backgroundColor: '#FF9800',
    shadowColor: '#000',
  } as ViewStyle,
  neutral: {
    backgroundColor: '#6C757D',
    shadowColor: '#000',
  } as ViewStyle,
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
    minHeight: 40,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minWidth: 75,
    minHeight: 50,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  large: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    minWidth: 100,
    minHeight: 60,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  // Text styles for variants
  text: {
    fontWeight: 'bold',
    color: '#fff',
  } as TextStyle,
  // Disabled state
  disabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0.3,
    elevation: 0,
    opacity: 0.5,
  } as ViewStyle,
});

// Add text styles to variants
PressableButton3DStyles.primary = {
  ...PressableButton3DStyles.primary,
  text: { ...PressableButton3DStyles.text, color: '#fff' },
} as ViewStyle & { text: TextStyle };

PressableButton3DStyles.secondary = {
  ...PressableButton3DStyles.secondary,
  text: { ...PressableButton3DStyles.text, color: '#fff' },
} as ViewStyle & { text: TextStyle };

PressableButton3DStyles.success = {
  ...PressableButton3DStyles.success,
  text: { ...PressableButton3DStyles.text, color: '#fff' },
} as ViewStyle & { text: TextStyle };

PressableButton3DStyles.danger = {
  ...PressableButton3DStyles.danger,
  text: { ...PressableButton3DStyles.text, color: '#fff' },
} as ViewStyle & { text: TextStyle };

PressableButton3DStyles.warning = {
  ...PressableButton3DStyles.warning,
  text: { ...PressableButton3DStyles.text, color: '#fff' },
} as ViewStyle & { text: TextStyle };

PressableButton3DStyles.neutral = {
  ...PressableButton3DStyles.neutral,
  text: { ...PressableButton3DStyles.text, color: '#fff' },
} as ViewStyle & { text: TextStyle };

// Add text styles to sizes
PressableButton3DStyles.small = {
  ...PressableButton3DStyles.small,
  text: { fontSize: 14 } as TextStyle,
} as ViewStyle & { text: TextStyle };

PressableButton3DStyles.medium = {
  ...PressableButton3DStyles.medium,
  text: { fontSize: 18 } as TextStyle,
} as ViewStyle & { text: TextStyle };

PressableButton3DStyles.large = {
  ...PressableButton3DStyles.large,
  text: { fontSize: 24 } as TextStyle,
} as ViewStyle & { text: TextStyle };

