import React, { useRef } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { SCREEN_DIMENSIONS, SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER, SHADOW_OFFSETS, ANIMATION, HISTORY_BOX, LETTER_SPACING, SHADOW } from '../constants/sizing';
import { TEXT_SHADOW_BOLD_MEDIUM } from '../constants/fonts';
import { soundManager } from '../utils/soundManager';

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ButtonWithAnimationProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  textStyle?: any;
  buttonStyle?: any;
}

function ButtonWithAnimation({ onPress, children, style, textStyle, buttonStyle }: ButtonWithAnimationProps) {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    soundManager.playSound('buttonPress');
    onPress();
  };

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
          buttonStyle,
          {
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.STANDARD_ALT,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.buttonInner}
        >
          <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default function HowToPlayModal({
  visible,
  onClose,
}: HowToPlayModalProps) {
  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>How to Play</Text>
              
              <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={[styles.instructionBar, styles.instructionBarFirst]}>
                  <Text style={styles.instructionText}>
                    1. You start with a set of single digit numbers, 4 mathematical operations, and a target number.
                  </Text>
                </View>
                <View style={styles.instructionBar}>
                  <Text style={styles.instructionText}>
                    2. Select two numbers from the available digits and one of either +, -, ×, ÷ to perform an operation.
                  </Text>
                </View>
                <View style={styles.instructionBar}>
                  <Text style={styles.instructionText}>
                    3. The goal of the game is to be left with a single number tile equal to the target number.
                  </Text>
                </View>
                <View style={[styles.instructionBar, styles.instructionBarLast]}>
                  <Text style={styles.instructionText}>
                    4. Only operations that result in positive whole numbers are valid.
                  </Text>
                </View>
              </ScrollView>

              {/* Close Button */}
              <ButtonWithAnimation
                onPress={onClose}
                style={styles.closeButton}
                textStyle={styles.closeButtonText}
                buttonStyle={styles.closeButtonBase}
              >
                Close
              </ButtonWithAnimation>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: COLORS.BACKGROUND_WHITE,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.PADDING_MEDIUM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'flex-start' as const,
  },
  modalTitle: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold' as const,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: SPACING.MARGIN_MEDIUM,
    textAlign: 'center' as const,
  },
  scrollView: {
    height: SCREEN_HEIGHT * 0.45,
  },
  scrollContent: {
    paddingBottom: SPACING.PADDING_SMALL,
  },
  instructionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: HISTORY_BOX.BAR_PADDING_HORIZONTAL,
    paddingVertical: HISTORY_BOX.BAR_PADDING_VERTICAL,
    borderRadius: HISTORY_BOX.BAR_BORDER_RADIUS,
    marginBottom: HISTORY_BOX.BAR_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: SHADOW.OFFSET_SMALL,
    shadowOpacity: SHADOW.OPACITY_FULL,
    shadowRadius: 0,
    elevation: 0,
  },
  instructionBarFirst: {
    marginTop: 0,
  },
  instructionBarLast: {
    marginBottom: 0,
  },
  instructionText: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.06,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    ...TEXT_SHADOW_BOLD_MEDIUM,
    letterSpacing: LETTER_SPACING.TIGHT,
    flex: 1,
  },
  buttonInner: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  },
  closeButtonBase: {
    backgroundColor: COLORS.BACKGROUND_WHITE,
    paddingVertical: SPACING.MARGIN_SMALL,
    paddingHorizontal: SPACING.PADDING_MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    shadowRadius: 0,
    elevation: 0,
    marginTop: SPACING.MARGIN_SMALL,
  },
  closeButton: {
    // Margin handled by parent if needed
  },
  closeButtonText: {
    color: COLORS.TEXT_TERTIARY,
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: '500' as const,
  },
});

