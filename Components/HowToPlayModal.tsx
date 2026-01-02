import React, { useRef } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { SCREEN_DIMENSIONS, SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER, SHADOW_OFFSETS, ANIMATION } from '../constants/sizing';
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
                <View style={styles.instructionItem}>
                  <View style={styles.instructionTextContainer}>
                    <Text style={styles.instructionText}>• Each puzzle begins with a set of single digit number tiles </Text>
                    <View style={styles.inlineTileContainer}>
                      <View style={styles.miniTile}><Text style={styles.miniTileText}>7</Text></View>
                      <View style={styles.miniTile}><Text style={styles.miniTileText}>3</Text></View>
                      <View style={styles.miniTile}><Text style={styles.miniTileText}>5</Text></View>
                      <View style={styles.miniTile}><Text style={styles.miniTileText}>2</Text></View>
                    </View>
                    <Text style={styles.instructionText}>, 4 mathematical operators </Text>
                    <View style={styles.inlineOperationContainer}>
                      <View style={styles.miniOperation}><Text style={styles.miniOperationText}>+</Text></View>
                      <View style={styles.miniOperation}><Text style={styles.miniOperationText}>−</Text></View>
                      <View style={styles.miniOperation}><Text style={styles.miniOperationText}>×</Text></View>
                      <View style={styles.miniOperation}><Text style={styles.miniOperationText}>÷</Text></View>
                    </View>
                    <Text style={styles.instructionText}>, and a target number </Text>
                    <View style={styles.inlineTargetContainer}>
                      <View style={styles.miniTarget}><Text style={styles.miniTargetText}>42</Text></View>
                    </View>
                    <Text style={styles.instructionText}>.</Text>
                  </View>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionText}>
                    • Select two numbers from the available digits and one of the math symbols to perform an operation.
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionText}>
                    • Only operations that result in positive integers are valid.
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionText}>
                    • Continue performing operations until you are left with a single number tile equal to the target number.
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
    flexDirection: 'column' as const,
  },
  modalTitle: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold' as const,
    color: COLORS.BACKGROUND_DARK, // Same color as calculator display background
    marginBottom: SPACING.MARGIN_MEDIUM,
    textAlign: 'center' as const,
  },
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  scrollContent: {
    paddingBottom: SPACING.PADDING_SMALL,
  },
  instructionItem: {
    marginBottom: SPACING.MARGIN_SMALL,
  },
  instructionTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  instructionText: {
    fontSize: FONT_SIZES.BUTTON_TEXT,
    color: COLORS.BACKGROUND_DARK,
    lineHeight: FONT_SIZES.BUTTON_TEXT * 1.4,
  },
  inlineTileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  miniTile: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    backgroundColor: COLORS.BACKGROUND_WHITE,
    borderRadius: SCREEN_WIDTH * 0.01,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  miniTileText: {
    fontSize: FONT_SIZES.BUTTON_TEXT * 0.7,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  inlineOperationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  miniOperation: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    backgroundColor: COLORS.BUTTON_ORANGE,
    borderRadius: SCREEN_WIDTH * 0.03,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  miniOperationText: {
    fontSize: FONT_SIZES.BUTTON_TEXT * 0.6,
    color: COLORS.TEXT_WHITE,
    fontWeight: 'bold',
  },
  inlineTargetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  miniTarget: {
    minWidth: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.06,
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: SCREEN_WIDTH * 0.01,
    borderWidth: BUTTON_BORDER.WIDTH * 2,
    borderColor: BUTTON_BORDER.COLOR,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTargetText: {
    fontSize: FONT_SIZES.BUTTON_TEXT * 0.8,
    color: COLORS.TEXT_SUCCESS,
    fontWeight: 'bold',
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
    marginTop: 0,
  },
  closeButton: {
    // Margin handled by parent if needed
  },
  closeButtonText: {
    color: '#000000', // Black font instead of gray
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: '500' as const,
  },
});

