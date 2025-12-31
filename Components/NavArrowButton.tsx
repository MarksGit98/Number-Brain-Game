import React from 'react';
import { StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { FONT_SIZES, SPACING, COLORS, NUMERIC_CONSTANTS } from '../constants/sizing';
import CircularIconButton from './CircularIconButton';

interface NavArrowButtonProps {
  direction: 'left' | 'right';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function NavArrowButton({
  direction,
  onPress,
  disabled = false,
  style,
  textStyle,
}: NavArrowButtonProps) {
  const arrow = direction === 'left' ? '←' : '→';

  return (
    <CircularIconButton
      onPress={onPress}
      disabled={disabled}
      style={[
        direction === 'left' && styles.leftMargin,
        direction === 'right' && styles.rightMargin,
        style,
      ]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>
        {arrow}
      </Text>
    </CircularIconButton>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.BUTTON_TEXT * NUMERIC_CONSTANTS.FONT_MULTIPLIER_NAV_ARROW,
    fontWeight: 'bold' as const,
    color: COLORS.TEXT_WHITE,
  },
  textDisabled: {
    color: COLORS.TEXT_DISABLED,
  },
  leftMargin: {
    marginRight: SPACING.MARGIN_MEDIUM,
  },
  rightMargin: {
    marginLeft: SPACING.MARGIN_MEDIUM,
  },
});

