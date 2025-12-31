import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, SHADOW, FONT_SIZES, SPACING, SCREEN_DIMENSIONS, PERCENTAGES } from '../constants/sizing';

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
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          isCompleted ? styles.cardCompleted : styles.cardIncomplete,
          style,
        ]}
      >
        <Text style={styles.levelText}>{levelNumber}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%' as const, // Exactly 3 cards per row (31% × 3 = 93%, leaving 7% for margins and spacing)
    aspectRatio: 1, // Maintain square shape
    borderRadius: BORDER_RADIUS.XLARGE,
    marginBottom: SPACING.MARGIN_SMALL, // Only bottom margin for row spacing
    padding: SPACING.PADDING_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: SHADOW.OFFSET_MEDIUM,
    shadowOpacity: SHADOW.OPACITY_FULL,
    shadowRadius: 0,
    elevation: 0,
  },
  cardCompleted: {
    backgroundColor: '#4CAF50',
  },
  cardIncomplete: {
    backgroundColor: '#F44336',
  },
  levelText: {
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: 'bold',
    color: '#fff',
  },
});

