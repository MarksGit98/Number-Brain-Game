import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, View, ViewStyle, TextStyle } from 'react-native';
import { BUTTON_SIZES, FONT_SIZES, BORDER_RADIUS, SPACING, ANIMATION, SHADOW_OFFSETS, COLORS, BUTTON_BORDER } from '../constants/sizing';
import { soundManager } from '../utils/soundManager';

interface DifficultyButtonProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onPress: () => void;
  isSelected: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function DifficultyButton({
  difficulty,
  onPress,
  isSelected,
  style,
  textStyle,
}: DifficultyButtonProps) {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;

  const getColors = () => {
    switch (difficulty) {
      case 'easy':
        return { bg: '#4CAF50', shadow: '#388E3C' };
      case 'medium':
        return { bg: '#FF9800', shadow: '#F57C00' };
      case 'hard':
        return { bg: '#F44336', shadow: '#D32F2F' };
    }
  };

  const colors = getColors();
  const tileCount = difficulty === 'easy' ? '4 Tiles' : difficulty === 'medium' ? '5 Tiles' : '6 Tiles';

  const handlePress = () => {
    if (isSelected) {
      soundManager.playSound('buttonRelease');
    } else {
      soundManager.playSound('buttonPress');
    }
    onPress();
  };

  // Animate between unselected and selected states
  useEffect(() => {
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
            backgroundColor: colors.bg,
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.DIFFICULTY,
            shadowRadius: 0,
          },
          isSelected && styles.buttonSelected,
          style,
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          <Text style={[styles.text, isSelected && styles.textSelected, textStyle]}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>
          <Text style={[styles.subtext, isSelected && styles.subtextSelected]}>
            {tileCount}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZES.DIFFICULTY_BUTTON_WIDTH,
    borderRadius: BORDER_RADIUS.LARGE,
    marginBottom: BUTTON_SIZES.DIFFICULTY_BUTTON_MARGIN_BOTTOM,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonSelected: {
    // Transform is now handled by animated translateX/translateY on outer Animated.View
  },
  buttonInner: {
    paddingVertical: BUTTON_SIZES.DIFFICULTY_BUTTON_PADDING_VERTICAL,
    paddingHorizontal: BUTTON_SIZES.DIFFICULTY_BUTTON_PADDING_HORIZONTAL,
    borderRadius: BORDER_RADIUS.LARGE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontSize: FONT_SIZES.DIFFICULTY_BUTTON,
    fontWeight: 'bold',
    color: '#fff',
  },
  textSelected: {
    fontSize: FONT_SIZES.DIFFICULTY_BUTTON,
  },
  subtext: {
    fontSize: FONT_SIZES.DIFFICULTY_SUBTEXT,
    color: '#fff',
    opacity: 0.9,
    marginTop: SPACING.PADDING_SMALL / 6,
  },
  subtextSelected: {
    fontSize: FONT_SIZES.DIFFICULTY_SUBTEXT,
    opacity: 1,
  },
});

