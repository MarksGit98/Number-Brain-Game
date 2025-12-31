import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameState, Operation, Difficulty } from '../types';
import { getPuzzlesByDifficulty, performOperation } from '../utils';
import DigitButton from '../Components/DigitButton';
import OperationButton from '../Components/OperationButton';
import NavArrowButton from '../Components/NavArrowButton';
import UndoButton from '../Components/UndoButton';
import HomeButton from '../Components/HomeButton';
import LibraryButton from '../Components/LibraryButton';
import PressableButton3D from '../Components/PressableButton3D';
import { SCREEN_DIMENSIONS, FONT_SIZES, SPACING, CALCULATOR_DISPLAY, HISTORY_BOX, LEVEL_POSITION, CONTROLS, BORDER_RADIUS, SHADOW, LETTER_SPACING, BUTTON_SIZES, DIGIT_CONTAINER_POSITION, COLORS, FONT_WEIGHTS, SHADOW_OFFSETS, ELEVATION, ANIMATION, NUMERIC_CONSTANTS } from '../constants/sizing';

const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

interface GameScreenProps {
  gameState: GameState;
  difficulty: Difficulty;
  currentPuzzleIndex: number | null;
  showSuccessBanner: boolean;
  successMessage: string;
  isAnimating: boolean;
  animatingDigit: number | null;
  onDigitPress: (index: number) => void;
  onOperationPress: (operation: Operation) => void;
  onUndo: () => void;
  onReturnToMenu: () => void;
  onOpenLevelLibrary: () => void;
  onGoToNextLevel: () => void;
  onGoToPreviousLevel: () => void;
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
  onDigitPress,
  onOperationPress,
  onUndo,
  onReturnToMenu,
  onOpenLevelLibrary,
  onGoToNextLevel,
  onGoToPreviousLevel,
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
              
              return (
                <DigitButton
                  key={index}
                  ref={isAnimatingThis ? animatingDigitButtonRef : undefined}
                  digit={digit}
                  onPress={() => onDigitPress(index)}
                  disabled={isAnimating}
                  isFirstSelected={isFirstSelected}
                  isSecondSelected={isSecondSelected}
                  isAnimating={isAnimatingThis}
                />
              );
            })}
          </View>
        </View>
      
        {/* Animated tile that moves to target */}
        {isAnimating && animatingDigit !== null && (
          <Animated.View
            style={[
              styles.animatedDigitContainer,
              {
                transform: [
                  { translateX: animatedPosition.x },
                  { translateY: animatedPosition.y },
                  { scale: animatedScale },
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

        {/* History Container */}
        <View style={styles.historyContainerWrapper}>
          <View style={[
            styles.historyContainer,
            difficulty === 'easy' && styles.historyContainerEasy,
            difficulty === 'medium' && styles.historyContainerMedium,
            difficulty === 'hard' && styles.historyContainerHard,
          ]}>
            <Text style={styles.historyTitle}>History</Text>
          {gameState.history.length > 0 ? (
            gameState.history.slice(
              -(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)
            ).map((entry, index) => (
              <View key={index} style={styles.historyBar}>
                <Text style={styles.historyText}>
                  {entry.operands[0]} {entry.operation} {entry.operands[1]} = {entry.result}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.historyPlaceholder} />
          )}
          </View>
        </View>

        {/* Controls Container */}
        <View style={styles.controlsContainerWrapper}>
          <View style={styles.controlsContainer}>
            <View style={styles.undoButtonContainer}>
              <UndoButton
                onPress={onUndo}
                disabled={gameState.history.length === 0}
              />
            </View>
            <View style={styles.libraryButtonContainer}>
              <LibraryButton
                onPress={onOpenLevelLibrary}
              />
            </View>
          </View>
        </View>

        {/* Navigation arrows at bottom corners */}
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNavLeft}>
            <NavArrowButton
              direction="left"
              onPress={onGoToPreviousLevel}
              disabled={currentPuzzleIndex === null || currentPuzzleIndex === 0}
            />
          </View>
          <View style={styles.bottomNavRight}>
            <NavArrowButton
              direction="right"
              onPress={onGoToNextLevel}
              disabled={currentPuzzleIndex === null || currentPuzzleIndex >= puzzles.length - 1}
            />
          </View>
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
    shadowColor: COLORS.SHADOW_BLACK,
    shadowOffset: SHADOW.OFFSET_MEDIUM,
    shadowOpacity: SHADOW.OPACITY_FULL,
    shadowRadius: ELEVATION.NONE,
    elevation: ELEVATION.NONE,
    display: 'flex',
    flexDirection: 'row',
  },
  targetNumber: {
    fontSize: FONT_SIZES.TARGET_NUMBER,
    fontWeight: '900' as const, // Bolder
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.TARGET_NUMBER,
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
    marginBottom: SPACING.MARGIN_SMALL,
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
  historyContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: SPACING.MARGIN_SMALL,
  },
  historyContainer: {
    backgroundColor: '#fff',
    padding: HISTORY_BOX.PADDING,
    borderRadius: HISTORY_BOX.BORDER_RADIUS,
    width: HISTORY_BOX.WIDTH,
    maxWidth: HISTORY_BOX.MAX_WIDTH,
    height: HISTORY_BOX.HEIGHT_EASY,
    shadowColor: '#000',
    shadowOffset: SHADOW.OFFSET_SMALL,
    shadowOpacity: SHADOW.OPACITY_LIGHT,
    shadowRadius: SHADOW.RADIUS_MEDIUM,
    elevation: 2,
  },
  historyContainerEasy: {
    height: HISTORY_BOX.HEIGHT_EASY,
  },
  historyContainerMedium: {
    height: HISTORY_BOX.HEIGHT_MEDIUM,
  },
  historyContainerHard: {
    height: HISTORY_BOX.HEIGHT_HARD,
  },
  historyTitle: {
    fontSize: FONT_SIZES.HISTORY_TITLE,
    fontWeight: 'bold' as const,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: HISTORY_BOX.TITLE_MARGIN_BOTTOM,
  },
  historyBar: {
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
  historyText: {
    fontSize: FONT_SIZES.HISTORY_TEXT,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    fontWeight: 'bold' as const,
    letterSpacing: LETTER_SPACING.TIGHT,
  },
  historyPlaceholder: {
    height: SPACING.MARGIN_MEDIUM,
  },
  controlsContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: SPACING.MARGIN_SMALL,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%' as const,
    position: 'relative',
  },
  undoButtonContainer: {
    position: 'absolute',
    left: BUTTON_SIZES.NAV_ARROW_HORIZONTAL,
    top: SPACING.MARGIN_MEDIUM, // Small vertical offset to clear history box
    alignItems: 'center',
    justifyContent: 'center',
  },
  libraryButtonContainer: {
    position: 'absolute',
    right: BUTTON_SIZES.NAV_ARROW_HORIZONTAL,
    top: SPACING.MARGIN_MEDIUM, // Small vertical offset to clear history box
    alignItems: 'center',
    justifyContent: 'center',
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


