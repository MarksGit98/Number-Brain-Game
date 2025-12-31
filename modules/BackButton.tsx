import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle, TextStyle } from 'react-native';
import PressableButton3D from '../Components/PressableButton3D';
import { FONT_SIZES, SPACING } from '../constants/sizing';

interface BackButtonProps {
  onPress: () => void;
  position?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function BackButton({
  onPress,
  position = 'left',
  style,
  textStyle,
}: BackButtonProps) {
  return (
    <PressableButton3D
      variant="primary"
      size="small"
      onPress={onPress}
      style={[
        styles.button,
        position === 'right' && styles.buttonRight,
        style,
      ]}
    >
      <Text style={[styles.buttonText, textStyle]}>← Back</Text>
    </PressableButton3D>
  );
}

const styles = StyleSheet.create({
  button: {
    // Styles handled by PressableButton3D
  },
  buttonRight: {
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontSize: FONT_SIZES.BUTTON_TEXT * 0.89, // Slightly smaller
    fontWeight: '600',
    color: '#fff',
  },
});

