import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameState, Operation, Difficulty } from '../types';
import { getPuzzlesByDifficulty, performOperation } from '../utils';
import DigitButton from '../Components/DigitButton';
import OperationButton from '../Components/OperationButton';
import UndoButton from '../Components/UndoButton';
import HomeButton from '../Components/HomeButton';
import LibraryButton from '../Components/LibraryButton';
import SettingsButton from '../Components/SettingsButton';
import PressableButton3D from '../Components/PressableButton3D';
import { SCREEN_DIMENSIONS, FONT_SIZES, SPACING, CALCULATOR_DISPLAY, HISTORY_BOX, LEVEL_POSITION, CONTROLS, BORDER_RADIUS, SHADOW, LETTER_SPACING, BUTTON_SIZES, DIGIT_CONTAINER_POSITION, COLORS, FONT_WEIGHTS, SHADOW_OFFSETS, ELEVATION, ANIMATION, NUMERIC_CONSTANTS, BUTTON_BORDER } from '../constants/sizing';
import { TEXT_SHADOW_BOLD_STRONG, TEXT_SHADOW_BOLD_MEDIUM, TEXT_SHADOW_BOLD_EXTRA } from '../constants/fonts';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

interface GameScreenProps {
  gameState: GameState;
  difficulty: Difficulty;
  currentPuzzleIndex: number | null;
  showSuccessBanner: boolean;
  successMessage: string;
  isAnimating: boolean;
  animatingDigit: number | null;
  isShaking: boolean;
  shakingDigitIndices: number[];
  errorDigitIndex: number | null;
  shakeTranslateX: Animated.Value;
  onDigitPress: (index: number) => void;
  onOperationPress: (operation: Operation) => void;
  onUndo: () => void;
  onReturnToMenu: () => void;
  onOpenLevelLibrary: () => void;
  onOpenSettings: () => void;
  onSuccessBannerDismiss: () => void;
  targetContainerRef: React.RefObject<View | null>;
  digitContainerRef: React.RefObject<View | null>;
  animatingDigitButtonRef: React.RefObject<any>;
  animatedPosition: Animated.ValueXY;
  animatedScale: Animated.Value;
  animatedOpacity: Animated.Value;
}

export default function GameScreen({
  gameState,
  difficulty,
  currentPuzzleIndex,
  showSuccessBanner,
  successMessage,
  isAnimating,
  animatingDigit,
  isShaking,
  shakingDigitIndices,
  errorDigitIndex,
  shakeTranslateX,
  onDigitPress,
  onOperationPress,
  onUndo,
  onReturnToMenu,
  onOpenLevelLibrary,
  onOpenSettings,
  onSuccessBannerDismiss,
  targetContainerRef,
  digitContainerRef,
  animatingDigitButtonRef,
  animatedPosition,
  animatedScale,
  animatedOpacity,
}: GameScreenProps) {
  const operations: Operation[] = ['+', '-', '*', '/'];
  const puzzles = getPuzzlesByDifficulty(difficulty);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {showSuccessBanner && (
        <TouchableOpacity 
          style={styles.successBannerOverlay}
          activeOpacity={1}
          onPress={onSuccessBannerDismiss}
        >
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successMessage}!</Text>
          </View>
        </TouchableOpacity>
      )}
      
      <View style={styles.homeButtonContainer}>
        <HomeButton
          onPress={onReturnToMenu}
        />
      </View>
      
      <View style={styles.settingsButtonContainer}>
        <SettingsButton
          onPress={onOpenSettings}
        />
      </View>
      
      <Text style={styles.title}>Number Brain</Text>
      
      <View style={styles.gameContent}>
        {/* Level Number Container */}
        {currentPuzzleIndex !== null && (
          <View style={styles.levelNumberContainer}>
            <Text style={styles.levelNumber}>
              Level {currentPuzzleIndex + 1}
            </Text>
          </View>
        )}
        
        {/* Target Display Container */}
        <View 
          ref={targetContainerRef}
          style={styles.targetContainerWrapper}
          onLayout={() => {
            if (targetContainerRef.current) {
              targetContainerRef.current.measure((fx: number, fy: number, fwidth: number, fheight: number, pageX: number, pageY: number) => {
                // Position measurement handled by parent via ref callback
              });
            }
          }}
        >
          <View style={styles.targetContainer}>
            <Text style={styles.targetNumber}>{gameState.target}</Text>
          </View>
        </View>

        {/* Digit Buttons Container */}
        <View 
          ref={digitContainerRef}
          style={styles.digitsContainerWrapper}
        >
          <View style={styles.digitsContainer}>
            {gameState.digits.map((digit, index) => {
              const isFirstSelected = 
                gameState.selectedIndices[0] === index || 
                gameState.firstSelectedIndex === index;
              const isSecondSelected = 
                gameState.selectedIndices[1] === index || 
                gameState.secondSelectedIndex === index;
              
              const isAnimatingThis = isAnimating && animatingDigit === digit && gameState.digits.length === 1;
              const isShakingThis = (isShaking && gameState.digits.length === 1) || shakingDigitIndices.includes(index);
              const isErrorThis = errorDigitIndex === index;
              
              const digitButton = (
                <DigitButton
                  key={index}
                  ref={isAnimatingThis ? animatingDigitButtonRef : undefined}
                  digit={digit}
                  onPress={() => onDigitPress(index)}
                  disabled={isAnimating || isShaking || shakingDigitIndices.length > 0}
                  isFirstSelected={isFirstSelected}
                  isSecondSelected={isSecondSelected}
                  isError={isErrorThis}
                  isAnimating={isAnimatingThis}
                />
              );
              
              // Wrap in Animated.View to apply shake animation when shaking
              if (isShakingThis) {
                return (
                  <Animated.View
                    key={index}
                    style={{
                      transform: [{ translateX: shakeTranslateX }],
                    }}
                  >
                    {digitButton}
                  </Animated.View>
                );
              }
              
              return digitButton;
            })}
          </View>
        </View>
      
        {/* Animated tile that floats up and fades out */}
        {isAnimating && animatingDigit !== null && (
          <Animated.View
            style={[
              styles.animatedDigitContainer,
              {
                transform: [
                  { translateX: animatedPosition.x },
                  { translateY: animatedPosition.y },
                ],
                opacity: animatedOpacity,
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.digitButton}>
              <Text style={[styles.digitText, styles.animatedDigitText]}>{animatingDigit}</Text>
            </View>
          </Animated.View>
        )}

        {/* Operation Buttons Container */}
        <View style={styles.operationsContainerWrapper}>
          <View style={styles.operationsContainer}>
            {operations.map((op) => (
              <OperationButton
                key={op}
                operation={op}
                onPress={() => onOperationPress(op)}
                isSelected={gameState.selectedOperation === op}
              />
            ))}
          </View>
        </View>

        {/* Undo Button - positioned between operations and history */}
        <View style={styles.undoButtonWrapper}>
          <UndoButton
            onPress={onUndo}
            disabled={gameState.history.length === 0}
          />
        </View>

        {/* History Container */}
        <View style={styles.historyContainerWrapper}>
          <View style={[
            styles.historyContainer,
            {
              minHeight: HISTORY_BOX.HEIGHT_ONE_LINE,
              // Height calculation (HEIGHT_ONE_LINE includes title space, but title is removed)
              // For 0 or 1 entries: use HEIGHT_ONE_LINE
              // For 2+ entries: HEIGHT_ONE_LINE + (additional entries beyond first * bar height)
              // Cap height at maximum turns for difficulty: Easy=3, Medium=4, Hard=5
              // Maximum history entries = initial tile count - 1
              height: (() => {
                const maxEntries = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
                const cappedHistoryLength = Math.min(gameState.history.length, maxEntries);
                return cappedHistoryLength <= 1
                  ? HISTORY_BOX.HEIGHT_ONE_LINE
                  : HISTORY_BOX.HEIGHT_ONE_LINE + ((cappedHistoryLength - 1) * HISTORY_BOX.BAR_HEIGHT);
              })(),
              borderWidth: BUTTON_BORDER.WIDTH,
              borderColor: gameState.history.length > 0 ? '#000000' : '#B0B0B0',
            },
            ]}>
          {gameState.history.length > 0 ? (
            gameState.history.map((entry, index) => (
              <View key={index} style={[
                styles.historyBar,
                // Remove margin bottom on last bar to prevent extra space
                index === gameState.history.length - 1 && styles.historyBarLast,
              ]}>
                <Text style={styles.historyNumber}>{index + 1})</Text>
                <Text style={styles.historyText}>
                  {entry.operands[0]} {entry.operation} {entry.operands[1]} = {entry.result}
                </Text>
              </View>
            ))
          ) : null}
          </View>
        </View>

        {/* Library button at bottom right */}
        <View style={styles.libraryButtonContainer}>
          <LibraryButton
            onPress={onOpenLevelLibrary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.CONTAINER_PADDING_HORIZONTAL,
    paddingTop: SPACING.CONTAINER_PADDING_TOP,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold' as const,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MARGIN_MEDIUM,
    textAlign: 'center',
  },
  homeButtonContainer: {
    position: 'absolute',
    top: SPACING.CONTAINER_PADDING_TOP,
    left: SPACING.CONTAINER_PADDING_HORIZONTAL,
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
    zIndex: 10,
  },
  gameContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%' as const,
    paddingTop: SPACING.PADDING_MEDIUM,
  },
  levelNumberContainer: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: SPACING.MARGIN_SMALL,
  },
  targetContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: SPACING.MARGIN_SMALL,
  },
  targetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: CALCULATOR_DISPLAY.PADDING_HORIZONTAL,
    paddingVertical: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS,
    width: CALCULATOR_DISPLAY.WIDTH,
    height: CALCULATOR_DISPLAY.HEIGHT,
    borderWidth: BUTTON_BORDER.WIDTH * 2, // Thin-moderate border (2x the standard thin border)
    borderColor: BUTTON_BORDER.COLOR,
  },
  targetNumber: {
    fontSize: FONT_SIZES.TARGET_NUMBER,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.TARGET_NUMBER,
    // Enhanced shadow for 3D pop effect
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  digitsContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: SPACING.MARGIN_SMALL,
  },
  digitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%' as const,
  },
  digitButton: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,

  },
  digitButtonFirstSelected: {
    backgroundColor: '#2196F3',
  },
  digitButtonSecondSelected: {
    backgroundColor: '#F44336',
  },
  digitButtonAnimating: {
    opacity: 0,
  },
  digitText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  digitTextFirstSelected: {
    color: '#fff',
  },
  digitTextSecondSelected: {
    color: '#fff',
  },
  operationsContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: 0, // Removed margin, spacing handled by undo button wrapper
  },
  operationsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%' as const,
  },
  operationButton: {
    width: 65,
    height: 65,
    backgroundColor: '#2196F3',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  operationButtonSelected: {
    backgroundColor: '#1976D2',
    borderWidth: 3,
    borderColor: '#0D47A1',
  },
  operationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  undoButtonWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginTop: SPACING.MARGIN_SMALL,
    marginBottom: SPACING.MARGIN_SMALL,
  },
  historyContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: SPACING.MARGIN_SMALL,
    // Reserve max height to prevent other elements from shifting
    height: HISTORY_BOX.HEIGHT_HARD,
    justifyContent: 'flex-start',
  },
  historyContainer: {
    backgroundColor: '#fff',
    padding: HISTORY_BOX.PADDING,
    borderRadius: HISTORY_BOX.BORDER_RADIUS,
    width: HISTORY_BOX.WIDTH,
    maxWidth: HISTORY_BOX.MAX_WIDTH,
    shadowColor: '#000',
    shadowOffset: SHADOW.OFFSET_SMALL,
    shadowOpacity: SHADOW.OPACITY_LIGHT,
    shadowRadius: SHADOW.RADIUS_MEDIUM,
    elevation: 2,
    overflow: 'hidden', // Ensure content doesn't overflow rounded corners
    alignSelf: 'flex-start', // Prevent stretching to full wrapper height
  },
  historyTitle: {
    fontSize: FONT_SIZES.HISTORY_TITLE,
    fontWeight: 'bold' as const,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: HISTORY_BOX.TITLE_MARGIN_BOTTOM,
  },
  historyBar: {
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
  historyBarLast: {
    marginBottom: 0, // Remove margin on last bar
  },
  historyNumber: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.06, // Marginally increased
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    ...TEXT_SHADOW_BOLD_EXTRA, // Extra bold for numbers (bolder than history text)
    letterSpacing: LETTER_SPACING.TIGHT,
    marginRight: SPACING.MARGIN_SMALL,
  },
  historyText: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.06, // Marginally increased
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    ...TEXT_SHADOW_BOLD_MEDIUM, // Use text shadow for bold effect (fontWeight doesn't work with Digital-7 Mono)
    letterSpacing: LETTER_SPACING.TIGHT,
  },
  historyPlaceholder: {
    height: SPACING.MARGIN_MEDIUM,
  },
  settingsButtonContainer: {
    position: 'absolute',
    top: SPACING.CONTAINER_PADDING_TOP,
    right: SPACING.CONTAINER_PADDING_HORIZONTAL,
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
    zIndex: 10,
  },
  libraryButtonContainer: {
    position: 'absolute',
    bottom: BUTTON_SIZES.NAV_ARROW_BOTTOM,
    right: BUTTON_SIZES.NAV_ARROW_HORIZONTAL,
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
    zIndex: 10,
  },
  undoButton: {
    backgroundColor: '#9E9E9E',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  undoButtonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  undoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  undoButtonTextDisabled: {
    color: '#9E9E9E',
  },
  menuButton: {
    backgroundColor: '#9E9E9E',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  libraryButtonGame: {
    backgroundColor: '#6C757D',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  libraryButtonTextGame: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: BUTTON_SIZES.NAV_ARROW_BOTTOM,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: BUTTON_SIZES.NAV_ARROW_HORIZONTAL,
    pointerEvents: 'box-none',
  },
  bottomNavLeft: {
    pointerEvents: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MARGIN_SMALL,
  },
  bottomNavRight: {
    pointerEvents: 'auto',
  },
  navArrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navArrowLeft: {
    marginRight: 20,
  },
  navArrowRight: {
    marginLeft: 20,
  },
  navArrowDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  navArrowText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  navArrowTextDisabled: {
    color: '#9E9E9E',
  },
  levelNumber: {
    fontSize: FONT_SIZES.LEVEL_NUMBER,
    fontWeight: 'normal',
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Digital-7-Mono',
  },
  successBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBanner: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successBannerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  animatedDigitContainer: {
    position: 'absolute',
    width: 75,
    height: 75,
    top: 0,
    left: 0,
    zIndex: 100,
  },
  animatedDigitText: {
    color: '#4CAF50',
  },
});


