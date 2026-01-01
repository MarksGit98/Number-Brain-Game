import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text, ViewStyle, TextStyle } from 'react-native';
import { FONT_SIZES } from '../constants/sizing';
import { soundManager } from '../utils/soundManager';

interface TabButtonProps {
  label: string;
  onPress: () => void;
  isActive: boolean;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function TabButton({
  label,
  onPress,
  isActive,
  color,
  style,
  textStyle,
}: TabButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(translateYAnim, {
        toValue: 1,
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
        styles.tabWrapper,
        style,
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
        style={[
          styles.tab, 
          isActive && styles.tabActive,
          isActive && color && { borderBottomColor: color }
        ]}
      >
        <Text style={[
          styles.tabText, 
          isActive && styles.tabTextActive,
          isActive && color && { color: color },
          textStyle
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabWrapper: {
    flex: 1,
    width: '33.33%',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginBottom: -2,
  },
  tabActive: {
    borderBottomColor: '#4CAF50', // Will be overridden by color prop if provided
  },
  tabText: {
    fontSize: FONT_SIZES.BUTTON_TEXT * 0.78, // Scaled down to fit on one line
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    fontWeight: 'bold',
  },
});

