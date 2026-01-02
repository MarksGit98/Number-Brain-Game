import React, { useRef } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { SCREEN_DIMENSIONS, SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER, SHADOW_OFFSETS, ANIMATION, HISTORY_BOX, LETTER_SPACING, SHADOW, BUTTON_SIZES, CALCULATOR_DISPLAY } from '../constants/sizing';
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
                  <View style={styles.instructionTextContainer}>
                    <Text style={styles.instructionText}>1. Each puzzle begins with a set of single digit number tiles </Text>
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
                <View style={styles.instructionBar}>
                  <Text style={styles.instructionText}>
                    2. Select two numbers from the available digits and one of the math symbols to perform an operation.
                  </Text>
                </View>
                <View style={styles.instructionBar}>
                  <Text style={styles.instructionText}>
                    3. Only operations that result in positive integers are valid.
                  </Text>
                </View>
                <View style={[styles.instructionBar, styles.instructionBarLast]}>
                  <Text style={styles.instructionText}>
                    4. Continue performing operations until you are left with a single number tile equal to the target number.
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
    color: COLORS.BACKGROUND_DARK, // Same color as calculator display background
    marginBottom: SPACING.MARGIN_MEDIUM,
    textAlign: 'center' as const,
  },
  scrollView: {
    height: SCREEN_HEIGHT * 0.4, // Reduced from 0.45
  },
  scrollContent: {
    paddingBottom: SPACING.PADDING_SMALL / 2, // Reduced padding
  },
  instructionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: HISTORY_BOX.BAR_PADDING_HORIZONTAL,
    paddingVertical: HISTORY_BOX.BAR_PADDING_VERTICAL,
    borderRadius: HISTORY_BOX.BAR_BORDER_RADIUS,
    marginBottom: 0, // No margin bottom for seamless appearance
    // Metallic border effect with glisten - scaled appropriately for instruction bars
    // Top border is brightest (direct light), left is slightly dimmer (indirect light) for realistic corner depth
    borderTopColor: '#B0B0B0', // Brightest metallic gray (top highlight - direct light source)
    borderLeftColor: '#909090', // Slightly dimmer metallic gray (left highlight - indirect light, creates depth at corner)
    borderRightColor: '#404040', // Dark metallic gray (right shadow - darker metal)
    borderBottomColor: '#404040', // Dark metallic gray (bottom shadow - matches right)
    borderTopWidth: BUTTON_BORDER.WIDTH * 1.5, // Scaled border width for smaller instruction bars
    borderLeftWidth: BUTTON_BORDER.WIDTH * 1.5,
    borderRightWidth: BUTTON_BORDER.WIDTH * 1.5,
    borderBottomWidth: BUTTON_BORDER.WIDTH * 1.5,
    // Subtle glisten effect with shadow (scaled down for smaller bars)
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  instructionBarFirst: {
    marginTop: 0,
  },
  instructionBarLast: {
    marginBottom: 0,
  },
  instructionTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
    alignContent: 'flex-start',
    alignSelf: 'flex-start', // Align to start to prevent wrapping issues
  },
  instructionText: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.06,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    ...TEXT_SHADOW_BOLD_MEDIUM,
    letterSpacing: LETTER_SPACING.TIGHT,
  },
  inlineTileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2, // Reduced horizontal margin
    flexShrink: 1, // Allow shrinking if needed
    flexGrow: 0, // Don't grow
  },
  miniTile: {
    width: SCREEN_WIDTH * 0.028, // Further reduced size to fit inline
    height: SCREEN_WIDTH * 0.028,
    backgroundColor: COLORS.BACKGROUND_WHITE,
    borderRadius: SCREEN_WIDTH * 0.007,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0.5, // Minimal margin between tiles
  },
  miniTileText: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 0.6,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Digital-7-Mono',
    fontWeight: 'bold',
  },
  inlineOperationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2, // Reduced to match tiles
    flexShrink: 1, // Allow shrinking if needed
    flexGrow: 0, // Don't grow
  },
  miniOperation: {
    width: SCREEN_WIDTH * 0.028, // Match tile size
    height: SCREEN_WIDTH * 0.028,
    backgroundColor: COLORS.BUTTON_ORANGE,
    borderRadius: SCREEN_WIDTH * 0.014, // Circular
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0.5, // Minimal margin to match tiles
  },
  miniOperationText: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 0.5,
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Digital-7-Mono',
    fontWeight: 'bold',
  },
  inlineTargetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  miniTarget: {
    minWidth: SCREEN_WIDTH * 0.08,
    height: SCREEN_WIDTH * 0.05,
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: SCREEN_WIDTH * 0.01,
    borderWidth: BUTTON_BORDER.WIDTH * 2,
    borderColor: BUTTON_BORDER.COLOR,
    paddingHorizontal: SCREEN_WIDTH * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTargetText: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 0.7,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
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
    marginTop: SPACING.MARGIN_SMALL / 2, // Reduced margin
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

