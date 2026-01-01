import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle } from 'react-native';
import { BUTTON_SIZES, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER, ANIMATION, COLORS, SHADOW_OFFSETS, SPACING } from '../constants/sizing';
import { TEXT_SHADOW_BOLD_STRONG } from '../constants/fonts';
import { soundManager } from '../utils/soundManager';

interface PuzzleCardProps {
  levelNumber: number;
  onPress: () => void;
  isCompleted: boolean;
  style?: ViewStyle;
}

export default function PuzzleCard({
  levelNumber,
  onPress,
  isCompleted,
  style,
}: PuzzleCardProps) {
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

  const getBackgroundColor = () => {
    return isCompleted ? COLORS.DIFFICULTY_EASY : COLORS.DIFFICULTY_HARD; // Green for completed, Red for incomplete
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
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.STANDARD_ALT,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            soundManager.playSound('buttonPress');
            onPress();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          <Text style={[
            styles.text,
            {
              fontSize: levelNumber.toString().length > 2
                ? FONT_SIZES.DIGIT_TEXT * 0.7 // Shrink to 70% for 3+ digits
                : FONT_SIZES.DIGIT_TEXT // Match digit button font size
            }
          ]}>
            {levelNumber}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZES.DIGIT_BUTTON_SIZE,
    height: BUTTON_SIZES.DIGIT_BUTTON_SIZE,
    borderRadius: BORDER_RADIUS.XLARGE,
    margin: SPACING.LEVEL_TILE_MARGIN, // Gap between tiles (calculated to fit exactly 3 per row)
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
  text: {
    // fontSize is now set dynamically based on levelNumber length
    fontWeight: 'bold',
    color: COLORS.TEXT_WHITE,
    ...TEXT_SHADOW_BOLD_STRONG, // Use stronger text shadow for bolder effect
  },
});

