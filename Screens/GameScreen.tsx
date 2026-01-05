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
import SolarPanelDisplay from '../Components/SolarPanelDisplay';
import { SCREEN_DIMENSIONS, FONT_SIZES, SPACING, CALCULATOR_DISPLAY, HISTORY_BOX, LEVEL_POSITION, CONTROLS, BORDER_RADIUS, SHADOW, LETTER_SPACING, BUTTON_SIZES, DIGIT_CONTAINER_POSITION, COLORS, FONT_WEIGHTS, SHADOW_OFFSETS, ELEVATION, ANIMATION, NUMERIC_CONSTANTS, BUTTON_BORDER, PADDING_VALUES } from '../constants/sizing';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

// Calculate spacing for target display digits based on mobile container size
// Measure actual "8" width: Digital-7-Mono font typically has "8" at ~0.65-0.7x font size
// We'll use 0.68 to ensure we have enough space for the full "8" character
const actualDigit8Width = FONT_SIZES.TARGET_NUMBER * 0.48; // Actual measured width of "8" at this font size
const containerPadding = SCREEN_WIDTH * 0.015; // Increased padding to prevent edge cutoff
// Use condensed fixed spacing between digits (scaled for mobile, similar to web version)
const digitSpacing = LETTER_SPACING.WIDE * 0.5; // Condensed spacing between digits

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
  isAdFree: boolean;
  onPurchaseAdFree: () => void;
  targetContainerRef: React.RefObject<View | null>;
  digitContainerRef: React.RefObject<View | null>;
  animatingDigitButtonRef: React.RefObject<any>;
  animatedPosition: Animated.ValueXY;
  animatedScale: Animated.Value;
  animatedOpacity: Animated.Value;
  bounceTranslateY: Animated.Value;
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
  isAdFree,
  onPurchaseAdFree,
  targetContainerRef,
  digitContainerRef,
  animatingDigitButtonRef,
  animatedPosition,
  animatedScale,
  animatedOpacity,
  bounceTranslateY,
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
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>{successMessage}!</Text>
              {!isAdFree && (
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onPurchaseAdFree();
                    onSuccessBannerDismiss();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.purchaseButtonText}>Purchase Ad-Free</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
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
      
      <SolarPanelDisplay
        borderWidth={BUTTON_BORDER.WIDTH * 2}
        borderColor="#16A34A"
        marginTop={SCREEN_HEIGHT * 0.01}
        marginBottom={SPACING.MARGIN_SMALL}
      />
      
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
            <View style={styles.targetInnerBorder} />
            {/* Target number with digit spacing (includes faded 8s for empty slots) */}
            <View style={styles.targetNumberContainer}>
              {(() => {
                const targetDigits = gameState.target.toString().split('');
                const totalPositions = 4;
                const numEmptySlots = totalPositions - targetDigits.length;
                
                return Array.from({ length: totalPositions }, (_, i) => {
                  const isFaded = i < numEmptySlots;
                  const digit = isFaded ? '8' : targetDigits[i - numEmptySlots];
                  const isLast = i === totalPositions - 1;
                  
                  return (
                    <View key={i} style={[
                      styles.digitContainer,
                      isLast && styles.digitContainerLast
                    ]}>
                      <Text style={[
                        styles.targetNumberDigit,
                        isFaded && styles.targetNumberDigitFaded
                      ]}>
                        {digit}
                      </Text>
                    </View>
                  );
                });
              })()}
            </View>
          </View>
        </View>

        {/* Digit Buttons Container */}
        <View 
          ref={digitContainerRef}
          style={styles.digitsContainerWrapper}
        >
          {((difficulty === 'medium' || difficulty === 'hard') && gameState.digits.length === 5) ? (
            // Medium or Hard puzzle with 5 tiles: 3 in first row, 2 in second row
            <View style={styles.digitsContainerMedium5}>
              <View style={styles.digitRow}>
                {gameState.digits.slice(0, 3).map((digit, index) => {
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
                  
                  if (isAnimatingThis) {
                    return (
                      <Animated.View
                        key={index}
                        style={{
                          transform: [{ translateY: bounceTranslateY }],
                        }}
                      >
                        {digitButton}
                      </Animated.View>
                    );
                  }
                  
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
              <View style={styles.digitRow}>
                {gameState.digits.slice(3, 5).map((digit, index) => {
                  const actualIndex = index + 3;
                  const isFirstSelected = 
                    gameState.selectedIndices[0] === actualIndex || 
                    gameState.firstSelectedIndex === actualIndex;
                  const isSecondSelected = 
                    gameState.selectedIndices[1] === actualIndex || 
                    gameState.secondSelectedIndex === actualIndex;
                  
                  const isAnimatingThis = isAnimating && animatingDigit === digit && gameState.digits.length === 1;
                  const isShakingThis = (isShaking && gameState.digits.length === 1) || shakingDigitIndices.includes(actualIndex);
                  const isErrorThis = errorDigitIndex === actualIndex;
                  
                  const digitButton = (
                    <DigitButton
                      key={actualIndex}
                      ref={isAnimatingThis ? animatingDigitButtonRef : undefined}
                      digit={digit}
                      onPress={() => onDigitPress(actualIndex)}
                      disabled={isAnimating || isShaking || shakingDigitIndices.length > 0}
                      isFirstSelected={isFirstSelected}
                      isSecondSelected={isSecondSelected}
                      isError={isErrorThis}
                      isAnimating={isAnimatingThis}
                    />
                  );
                  
                  if (isAnimatingThis) {
                    return (
                      <Animated.View
                        key={actualIndex}
                        style={{
                          transform: [{ translateY: bounceTranslateY }],
                        }}
                      >
                        {digitButton}
                      </Animated.View>
                    );
                  }
                  
                  if (isShakingThis) {
                    return (
                      <Animated.View
                        key={actualIndex}
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
          ) : (
            // Default layout (4 in a row for easy/4 tiles, or default wrap for others)
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
                
                // Wrap in Animated.View to apply bounce animation when animating
                if (isAnimatingThis) {
                  return (
                    <Animated.View
                      key={index}
                      style={{
                        transform: [{ translateY: bounceTranslateY }],
                      }}
                    >
                      {digitButton}
                    </Animated.View>
                  );
                }
                
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
          )}
        </View>
      

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
            <UndoButton
              onPress={onUndo}
              disabled={gameState.history.length === 0}
              style={styles.undoButtonInRow}
            />
          </View>
        </View>

        {/* History Container */}
        <View style={styles.historyContainerWrapper}>
          <View style={[
            styles.historyContainer,
            {
              // Fixed height based on difficulty: Easy=3, Medium=4, Hard=5 lines
              height: difficulty === 'easy' ? HISTORY_BOX.HEIGHT_EASY 
                     : difficulty === 'medium' ? HISTORY_BOX.HEIGHT_MEDIUM 
                     : HISTORY_BOX.HEIGHT_HARD,
            },
          ]}>
            <View style={styles.historyInnerBorder} />
            <View style={styles.historyContentWrapper}>
            {(() => {
              const maxEntries = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
              const lines = [];
              
              // Always render all possible lines (gray if not filled, green if filled)
              for (let i = 0; i < maxEntries; i++) {
                const hasEntry = i < gameState.history.length;
                const entry = hasEntry ? gameState.history[i] : undefined;
                
                lines.push(
                  <View key={i} style={styles.historyBar}>
                  <View style={styles.historyNumberContainer}>
                    <Text style={[
                      styles.historyNumber,
                      !hasEntry && styles.historyNumberEmpty
                    ]}>
                      {i + 1})
                    </Text>
                  </View>
                  {hasEntry && entry ? (
                    <Text style={styles.historyText}>
                      {entry.operands[0]} {entry.operation === '*' ? '×' : entry.operation === '/' ? '÷' : entry.operation} {entry.operands[1]} = {entry.result}
                    </Text>
                  ) : (
                    <Text style={styles.historyTextEmpty} />
                  )}
                </View>
                );
              }
              
              return lines;
            })()}
            </View>
          </View>
        </View>

        {/* Library button at bottom right */}
       
      </View>
      <View style={styles.libraryButtonContainer}>
          <LibraryButton
            onPress={onOpenLevelLibrary}
          />
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
  },
  levelNumberContainer: {
    width: '100%' as const,
    alignItems: 'center',
    paddingBottom: CALCULATOR_DISPLAY.PADDING_VERTICAL,
  },
  targetContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
    marginBottom: SPACING.MARGIN_SMALL,
  },
  // Base calculator display style - reused for both target and history
  targetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: CALCULATOR_DISPLAY.PADDING_HORIZONTAL,
    paddingTop: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    paddingBottom: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS,
    width: CALCULATOR_DISPLAY.WIDTH,
    height: CALCULATOR_DISPLAY.HEIGHT,
    // Metallic border effect with glisten - top/left highlights, bottom/right shadows for embossed depth
    // Top border is brightest (direct light), left is slightly dimmer (indirect light) for realistic corner depth
    borderTopColor: '#B0B0B0', // Brightest metallic gray (top highlight - direct light source)
    borderLeftColor: '#909090', // Slightly dimmer metallic gray (left highlight - indirect light, creates depth at corner)
    borderRightColor: '#404040', // Dark metallic gray (right shadow - darker metal)
    borderBottomColor: '#404040', // Dark metallic gray (bottom shadow - matches right)
    borderTopWidth: BUTTON_BORDER.WIDTH * 3, // Reduced border size
    borderLeftWidth: BUTTON_BORDER.WIDTH * 3,
    borderRightWidth: BUTTON_BORDER.WIDTH * 3,
    borderBottomWidth: BUTTON_BORDER.WIDTH * 3,
    // Subtle glisten effect with shadow
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden' as const, // Ensure content is clipped to border radius
    display: 'flex', // Ensure flex layout
  },
  targetInnerBorder: {
    position: 'absolute',
    top: BUTTON_BORDER.WIDTH * 3 + 2, // Outer border width + small gap
    left: BUTTON_BORDER.WIDTH * 3 + 2,
    right: BUTTON_BORDER.WIDTH * 3 + 2,
    bottom: BUTTON_BORDER.WIDTH * 3 + 2,
    backgroundColor: '#1F1F1F', // Slightly darker than BACKGROUND_DARK (#2C2C2C)
    borderRadius: Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 3) - 2), // Ensure non-negative
    zIndex: 0, // Behind text
  },
  fadedEightsContainer: {
    position: 'absolute',
    top: BUTTON_BORDER.WIDTH * 3 + 2,
    left: BUTTON_BORDER.WIDTH * 3 + 2,
    right: BUTTON_BORDER.WIDTH * 3 + 2,
    bottom: BUTTON_BORDER.WIDTH * 3 + 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  fadedEightsText: {
    fontSize: FONT_SIZES.TARGET_NUMBER,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    opacity: 0.08, // Very faded
    includeFontPadding: false,
  },
  targetNumberContainer: {
    position: 'absolute',
    top: BUTTON_BORDER.WIDTH * 3 + 2,
    left: BUTTON_BORDER.WIDTH * 3 + 2,
    right: BUTTON_BORDER.WIDTH * 3 + 2,
    bottom: BUTTON_BORDER.WIDTH * 3 + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: containerPadding, // Add small padding to prevent edge cutoff
    zIndex: 1,
  },
  digitContainer: {
    width: actualDigit8Width, // Fixed width based on actual "8" measurement - ensures even spacing for all digits
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: digitSpacing, // Calculated spacing based on mobile container size
  },
  digitContainerLast: {
    marginRight: 0, // Remove margin from last digit
  },
  targetNumberDigit: {
    fontSize: FONT_SIZES.TARGET_NUMBER,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.TARGET_NUMBER * 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    opacity: 1,
  },
  targetNumberDigitFaded: {
    opacity: 0.08, // Very faded for empty slots
  },
  targetNumber: {
    fontSize: FONT_SIZES.TARGET_NUMBER,
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.TARGET_NUMBER * 0.95, // Slightly reduced to account for font metrics
    // Enhanced shadow for 3D pop effect
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    zIndex: 1, // Above inner border
  },
  digitsContainerWrapper: {
    width: '100%' as const,
    alignItems: 'center',
  },
  digitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%' as const,
  },
  digitsContainerMedium5: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%' as const,
  },
  digitRow: {
    flexDirection: 'row',
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
    paddingTop: SPACING.MARGIN_SMALL, // Additional top padding for operation row
    marginBottom: SPACING.MARGIN_SMALL, // Spacing before history box
  },
  operationsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%' as const,
  },
  undoButtonInRow: {
    // Override CircularIconButton default size to match scaled operation buttons
    width: BUTTON_SIZES.OPERATION_BUTTON_SIZE, // Match operation button size (scaled down 5%)
    height: BUTTON_SIZES.OPERATION_BUTTON_SIZE,
    borderRadius: BUTTON_SIZES.OPERATION_BUTTON_SIZE / NUMERIC_CONSTANTS.DIVIDE_BY_2, // Circular
    marginLeft: BUTTON_SIZES.OPERATION_BUTTON_MARGIN,
  },
  operationButton: {
    width: 65,
    height: 65,
    backgroundColor: '#2196F3',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    // Reserve max height to prevent other elements from shifting
    height: HISTORY_BOX.HEIGHT_HARD,
    justifyContent: 'flex-start',
  },
  historyContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: CALCULATOR_DISPLAY.PADDING_HORIZONTAL,
    paddingTop: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    paddingBottom: CALCULATOR_DISPLAY.PADDING_VERTICAL,
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS,
    width: CALCULATOR_DISPLAY.WIDTH,
    // Metallic border effect with glisten - top/left highlights, bottom/right shadows for embossed depth
    // Top border is brightest (direct light), left is slightly dimmer (indirect light) for realistic corner depth
    borderTopColor: '#B0B0B0', // Brightest metallic gray (top highlight - direct light source)
    borderLeftColor: '#909090', // Slightly dimmer metallic gray (left highlight - indirect light, creates depth at corner)
    borderRightColor: '#404040', // Dark metallic gray (right shadow - darker metal)
    borderBottomColor: '#404040', // Dark metallic gray (bottom shadow - matches right)
    borderTopWidth: BUTTON_BORDER.WIDTH * 3, // Reduced border size
    borderLeftWidth: BUTTON_BORDER.WIDTH * 3,
    borderRightWidth: BUTTON_BORDER.WIDTH * 3,
    borderBottomWidth: BUTTON_BORDER.WIDTH * 3,
    // Subtle glisten effect with shadow
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden' as const, // Ensure content is clipped to border radius
    display: 'flex', // Ensure flex layout
  },
  historyInnerBorder: {
    position: 'absolute',
    top: BUTTON_BORDER.WIDTH * 3 + 2, // Outer border width + small gap
    left: BUTTON_BORDER.WIDTH * 3 + 2,
    right: BUTTON_BORDER.WIDTH * 3 + 2,
    bottom: BUTTON_BORDER.WIDTH * 3 + 2,
    backgroundColor: '#1F1F1F', // Slightly darker than BACKGROUND_DARK (#2C2C2C)
    borderRadius: Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 3) - 2), // Ensure non-negative
    zIndex: 0, // Behind text
  },
  historyContentWrapper: {
    position: 'absolute',
    top: BUTTON_BORDER.WIDTH * 3 + 2,
    left: BUTTON_BORDER.WIDTH * 3 + 2,
    right: BUTTON_BORDER.WIDTH * 3 + 2,
    bottom: BUTTON_BORDER.WIDTH * 3 + 2,
    paddingTop: HISTORY_BOX.INNER_PADDING,
    paddingBottom: HISTORY_BOX.INNER_PADDING,
    paddingLeft: HISTORY_BOX.INNER_PADDING,
    paddingRight: HISTORY_BOX.INNER_PADDING,
    flexDirection: 'column',
    zIndex: 1,
  },
  historyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: HISTORY_BOX.BAR_PADDING_VERTICAL,
  },
  historyBarLast: {
    // No special styling needed for last bar
  },
  historyNumberContainer: {
    width: SCREEN_WIDTH * 0.06, // Fixed width column for numbers
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: SPACING.MARGIN_MEDIUM, // Increased gap between number and equation
    flexShrink: 0, // Prevent shrinking
  },
  historyNumber: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.28, // Increased font size to make numbers more distinct
    color: COLORS.TEXT_SUCCESS, // Green when filled
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.TIGHT,
    textAlign: 'left', // Left-align numbers
  },
  historyNumberEmpty: {
    color: '#3A3A3A', // Lighter version of background (#2C2C2C) - looks like an imprint on calculator screen
  },
  historyText: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.10, // Slightly increased font size
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.TIGHT,
    textAlign: 'left',
    flex: 1,
    includeFontPadding: false,
  },
  historyTextEmpty: {
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.10,
    color: 'transparent', // Invisible but maintains line height
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.TIGHT,
    flex: 1,
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
    bottom: SPACING.CONTAINER_PADDING_TOP + SCREEN_HEIGHT * 0.025,
    right: SPACING.CONTAINER_PADDING_HORIZONTAL,
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
    fontSize: FONT_SIZES.HISTORY_TEXT * 1.5,
    color: COLORS.TEXT_TERTIARY, // Gray color for original simple display
    fontFamily: 'Digital-7-Mono',
    textAlign: 'center',
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
    marginBottom: SPACING.MARGIN_SMALL,
  },
  purchaseButton: {
    backgroundColor: COLORS.BUTTON_BLUE,
    paddingVertical: SPACING.PADDING_MEDIUM,
    paddingHorizontal: SPACING.PADDING_LARGE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    marginTop: SPACING.MARGIN_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    // Same depth styling as difficulty buttons
    shadowColor: COLORS.SHADOW_BLACK,
    shadowOffset: SHADOW_OFFSETS.DIFFICULTY,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  purchaseButtonText: {
    color: COLORS.BACKGROUND_WHITE,
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: '600' as const,
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


