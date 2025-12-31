import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, View, ViewStyle, TextStyle } from 'react-native';
import { BUTTON_SIZES, FONT_SIZES, BORDER_RADIUS, SHADOW, INSET_SHADOW, SPACING } from '../constants/sizing';

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;
  const insetShadowOpacityAnim = useRef(new Animated.Value(0)).current;
  const pressOverlayAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(translateYAnim, {
        toValue: 3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(insetShadowOpacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(pressOverlayAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (isSelected) {
      // Keep shadow states and color if selected, but reset scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
      return;
    }
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
      Animated.timing(shadowOpacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(insetShadowOpacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(pressOverlayAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

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

  const getPressOverlayColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'rgba(76, 175, 80, 0.3)'; // Lighter green
      case 'medium':
        return 'rgba(255, 152, 0, 0.3)'; // Lighter orange
      case 'hard':
        return 'rgba(244, 67, 54, 0.3)'; // Lighter red
    }
  };

  // Update shadow opacity and scale when selection changes
  useEffect(() => {
    if (isSelected) {
      shadowOpacityAnim.setValue(0);
      insetShadowOpacityAnim.setValue(1);
      pressOverlayAnim.setValue(1);
      // Ensure scale is reset to 1 when selected
      scaleAnim.setValue(1);
      translateYAnim.setValue(2);
    } else {
      shadowOpacityAnim.setValue(1);
      insetShadowOpacityAnim.setValue(0);
      pressOverlayAnim.setValue(0);
      // Ensure scale is reset to 1 when unselected
      scaleAnim.setValue(1);
      translateYAnim.setValue(0);
    }
  }, [isSelected, shadowOpacityAnim, insetShadowOpacityAnim, pressOverlayAnim, scaleAnim, translateYAnim]);

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
            backgroundColor: colors.bg,
            shadowColor: '#000',
            shadowOpacity: isSelected ? 0 : shadowOpacityAnim,
            shadowOffset: { width: 4, height: 4 },
          },
          isSelected && styles.buttonSelected,
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          {/* Dark overlay that appears when pressed */}
          <Animated.View
            style={[
              styles.pressOverlay,
              {
                backgroundColor: getPressOverlayColor(),
                opacity: isSelected ? 1 : pressOverlayAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
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
                opacity: isSelected ? 1 : insetShadowOpacityAnim,
              },
            ]}
            pointerEvents="none"
          />
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
    shadowRadius: 0,
    elevation: 0,
  },
  buttonSelected: {
    transform: [{ translateX: SHADOW.OFFSET_SMALL.width }, { translateY: SHADOW.OFFSET_SMALL.height }],
  },
  buttonInner: {
    paddingVertical: BUTTON_SIZES.DIFFICULTY_BUTTON_PADDING_VERTICAL,
    paddingHorizontal: BUTTON_SIZES.DIFFICULTY_BUTTON_PADDING_HORIZONTAL,
    borderRadius: BORDER_RADIUS.LARGE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.LARGE,
  },
  insetShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.LARGE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: SHADOW.OPACITY_FULL,
    shadowRadius: INSET_SHADOW.RADIUS,
    borderWidth: INSET_SHADOW.BORDER_WIDTH_THICK,
    borderColor: 'rgba(0, 0, 0, 0.4)',
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

