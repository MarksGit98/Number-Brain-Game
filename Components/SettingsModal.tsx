import React, { useRef } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { SCREEN_DIMENSIONS, SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, BUTTON_BORDER, SHADOW_OFFSETS, ANIMATION } from '../constants/sizing';
import { soundManager } from '../utils/soundManager';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  adsEnabled: boolean;
  isAdFree: boolean;
  developerMode: boolean;
  onMusicToggle: (enabled: boolean) => void;
  onSoundEffectsToggle: (enabled: boolean) => void;
  onAdsToggle: (enabled: boolean) => void;
  onDeveloperModeToggle: (enabled: boolean) => void;
  onPurchaseAdFree: () => void;
  onPrivacyPolicyPress?: () => void;
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

export default function SettingsModal({
  visible,
  onClose,
  musicEnabled,
  soundEffectsEnabled,
  adsEnabled,
  isAdFree,
  developerMode,
  onMusicToggle,
  onSoundEffectsToggle,
  onAdsToggle,
  onDeveloperModeToggle,
  onPurchaseAdFree,
  onPrivacyPolicyPress,
}: SettingsModalProps) {
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
              <Text style={styles.modalTitle}>Settings</Text>
              
              {/* Music Toggle */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Music</Text>
                <TouchableOpacity
                  style={[styles.toggle, musicEnabled && styles.toggleActive]}
                  onPress={() => {
                    if (musicEnabled) {
                      soundManager.playSound('buttonRelease');
                    } else {
                      soundManager.playSound('buttonPress');
                    }
                    onMusicToggle(!musicEnabled);
                  }}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.toggleThumb, 
                      { alignSelf: musicEnabled ? 'flex-end' : 'flex-start' }
                    ]} 
                  />
                </TouchableOpacity>
              </View>

              {/* Sound Effects Toggle */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <TouchableOpacity
                  style={[styles.toggle, soundEffectsEnabled && styles.toggleActive]}
                  onPress={() => {
                    if (soundEffectsEnabled) {
                      soundManager.playSound('buttonRelease');
                    } else {
                      soundManager.playSound('buttonPress');
                    }
                    onSoundEffectsToggle(!soundEffectsEnabled);
                  }}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.toggleThumb, 
                      { alignSelf: soundEffectsEnabled ? 'flex-end' : 'flex-start' }
                    ]} 
                  />
                </TouchableOpacity>
              </View>

              {/* Ads Toggle removed - ads are now purely internal, not user-visible */}

              {/* Developer Mode Toggle removed - internal only, not visible to users */}

              {/* Privacy Policy Link */}
              <TouchableOpacity
                onPress={() => {
                  soundManager.playSound('buttonPress');
                  if (onPrivacyPolicyPress) {
                    onPrivacyPolicyPress();
                  }
                }}
                style={styles.privacyPolicyLink}
                activeOpacity={0.7}
              >
                <Text style={styles.privacyPolicyLinkText}>Privacy Policy</Text>
              </TouchableOpacity>

              {/* Ad-Free Purchase Button */}
              <ButtonWithAnimation
                onPress={onPurchaseAdFree}
                style={styles.purchaseButton}
                textStyle={styles.purchaseButtonText}
                buttonStyle={styles.purchaseButtonBase}
              >
                Purchase Ad-Free Version
              </ButtonWithAnimation>

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
    width: SCREEN_WIDTH * 0.75,
    maxWidth: 350,
    backgroundColor: COLORS.BACKGROUND_WHITE,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.PADDING_MEDIUM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold' as const,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: SPACING.MARGIN_MEDIUM,
    textAlign: 'center' as const,
  },
  settingRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING.MARGIN_MEDIUM,
    paddingVertical: SPACING.PADDING_SMALL / 2,
  },
  settingLabel: {
    fontSize: FONT_SIZES.BUTTON_TEXT,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: '500' as const,
  },
  toggle: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.03,
    borderRadius: SCREEN_HEIGHT * 0.015,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center' as const,
    paddingHorizontal: 2,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
  },
  toggleActive: {
    backgroundColor: COLORS.TEXT_SUCCESS,
  },
  toggleThumb: {
    width: SCREEN_HEIGHT * 0.025,
    height: SCREEN_HEIGHT * 0.025,
    borderRadius: SCREEN_HEIGHT * 0.0125,
    backgroundColor: COLORS.BACKGROUND_WHITE,
  },
  buttonInner: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  },
  purchaseButtonBase: {
    backgroundColor: COLORS.BUTTON_BLUE,
    paddingVertical: SPACING.PADDING_MEDIUM,
    paddingHorizontal: SPACING.PADDING_LARGE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    shadowRadius: 0,
    elevation: 0,
  },
  purchaseButton: {
    marginTop: SPACING.MARGIN_SMALL,
    marginBottom: SPACING.MARGIN_SMALL,
  },
  purchaseButtonText: {
    color: COLORS.BACKGROUND_WHITE,
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: '600' as const,
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
  },
  closeButton: {
    // Margin handled by parent if needed
  },
  closeButtonText: {
    color: '#000000', // Black font instead of gray
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: '500' as const,
  },
  privacyPolicyLink: {
    paddingVertical: SPACING.PADDING_SMALL,
    paddingHorizontal: SPACING.PADDING_MEDIUM,
    marginBottom: SPACING.MARGIN_SMALL,
    alignItems: 'center' as const,
    backgroundColor: COLORS.SHADOW_BLACK, // Black background
    borderRadius: BORDER_RADIUS.SMALL,
  },
  privacyPolicyLinkText: {
    color: COLORS.BACKGROUND_WHITE, // White font
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: '500' as const,
    textDecorationLine: 'none' as const, // Remove underline
  },
});

