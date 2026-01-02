import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Difficulty, Puzzle } from '../types';
import { getPuzzlesByDifficulty, getPuzzleByIndex, getPuzzleKey } from '../utils';
import TabButton from '../Components/TabButton';
import PuzzleCard from '../Components/PuzzleCard';
import HomeButton from '../Components/HomeButton';
import SettingsButton from '../Components/SettingsButton';
import { FONT_SIZES, SPACING, BUTTON_SIZES, COLORS, ANIMATION, SHADOW_OFFSETS, BORDER_RADIUS, BUTTON_BORDER, SCREEN_DIMENSIONS, CALCULATOR_DISPLAY, LETTER_SPACING } from '../constants/sizing';
import { TEXT_SHADOW_BOLD_STRONG } from '../constants/fonts';
import { soundManager } from '../utils/soundManager';

interface LevelLibraryScreenProps {
  libraryTab: Difficulty;
  onTabChange: (tab: Difficulty) => void;
  onClose: () => void;
  onReturnToMenu: () => void;
  onSelectPuzzle: (difficulty: Difficulty, puzzle: Puzzle, index: number) => void;
  completedPuzzles: Set<string>;
  developerMode: boolean;
  onOpenSettings: () => void;
}

// Difficulty Label Button Component
interface DifficultyLabelButtonProps {
  label: string;
  color: string;
  onPress: () => void;
  isSelected: boolean;
  style?: any;
}

const DifficultyLabelButton = ({ label, color, onPress, isSelected, style }: DifficultyLabelButtonProps) => {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(1)).current;

  // Update animation values when selection changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateXAnim, {
        toValue: isSelected ? ANIMATION.TRANSLATE_X_PRESSED : ANIMATION.TRANSLATE_X_NORMAL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: isSelected ? ANIMATION.TRANSLATE_Y_PRESSED : ANIMATION.TRANSLATE_Y_NORMAL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: isSelected ? ANIMATION.OPACITY_HIDDEN : ANIMATION.OPACITY_FULL,
        duration: ANIMATION.DURATION_FAST,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isSelected, translateXAnim, translateYAnim, shadowOpacityAnim]);

  const handlePressIn = () => {
    if (!isSelected) {
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
    }
  };

  const handlePressOut = () => {
    if (!isSelected) {
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
    }
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
        styles.difficultyLabelButtonWrapper,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.difficultyLabelButton,
          {
            backgroundColor: color,
            shadowColor: COLORS.SHADOW_BLACK,
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: SHADOW_OFFSETS.DIFFICULTY,
            shadowRadius: 0,
          },
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
          style={styles.difficultyLabelButtonInner}
        >
          <Text style={styles.difficultyLabelButtonText}>{label}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default function LevelLibraryScreen({
  libraryTab,
  onTabChange,
  onClose,
  onReturnToMenu,
  onSelectPuzzle,
  completedPuzzles,
  developerMode,
  onOpenSettings,
}: LevelLibraryScreenProps) {
  const puzzles = getPuzzlesByDifficulty(libraryTab);
  const completedCount = puzzles.reduce((count, _, index) => {
    return completedPuzzles.has(getPuzzleKey(libraryTab, index)) ? count + 1 : count;
  }, 0);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.homeButtonContainer}>
        <HomeButton
          onPress={onReturnToMenu}
        />
      </View>
      <View style={styles.settingsButtonContainer}>
        <SettingsButton onPress={onOpenSettings} />
      </View>
      <View style={styles.libraryHeader}>
        <View style={styles.libraryTitleContainer}>
          <View style={styles.libraryTitleInnerBorder} />
          <Text style={styles.libraryTitle}>LEVELS</Text>
        </View>
      </View>

      <View style={styles.difficultyLabelsContainer}>
        <DifficultyLabelButton
          label="Easy"
          color={COLORS.DIFFICULTY_EASY}
          onPress={() => onTabChange('easy')}
          isSelected={libraryTab === 'easy'}
        />
        <DifficultyLabelButton
          label="Medium"
          color={COLORS.DIFFICULTY_MEDIUM}
          onPress={() => onTabChange('medium')}
          isSelected={libraryTab === 'medium'}
        />
        <DifficultyLabelButton
          label="Hard"
          color={COLORS.DIFFICULTY_HARD}
          onPress={() => onTabChange('hard')}
          isSelected={libraryTab === 'hard'}
        />
      </View>

      <View style={styles.tabContainer}>
        <TabButton
          label="Easy"
          onPress={() => onTabChange('easy')}
          isActive={libraryTab === 'easy'}
          color="#4CAF50"
        />
        <TabButton
          label="Medium"
          onPress={() => onTabChange('medium')}
          isActive={libraryTab === 'medium'}
          color="#FF9800"
        />
        <TabButton
          label="Hard"
          onPress={() => onTabChange('hard')}
          isActive={libraryTab === 'hard'}
          color="#F44336"
        />
      </View>

      <Text style={styles.progressText}>
        {completedCount} / {puzzles.length} Completed
      </Text>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.puzzleGrid}
        showsVerticalScrollIndicator={true}
      >
        {puzzles.map((puzzle, index) => {
          const puzzleKey = getPuzzleKey(libraryTab, index);
          const isCompleted = completedPuzzles.has(puzzleKey);
          
          // Determine if level is locked
          // Level 1 is always unlocked, level N+1 unlocks after completing level N
          // Developer mode unlocks all levels
          const isLocked = !developerMode && index > 0 && !completedPuzzles.has(getPuzzleKey(libraryTab, index - 1));
          
          return (
            <PuzzleCard
              key={index}
              levelNumber={index + 1}
              onPress={() => {
                if (!isLocked) {
                  onSelectPuzzle(libraryTab, puzzle, index);
                }
              }}
              isCompleted={isCompleted}
              isLocked={isLocked}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.CONTAINER_PADDING_HORIZONTAL,
    paddingTop: SPACING.CONTAINER_PADDING_TOP,
  },
  libraryHeader: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.CONTAINER_PADDING_HORIZONTAL,
    paddingTop: SPACING.CONTAINER_PADDING_TOP * 0.4, // Reduced from 0.5
    paddingBottom: SPACING.MARGIN_MEDIUM, // Increased from MARGIN_SMALL to create more gap
  },
  libraryTitleContainer: {
    width: CALCULATOR_DISPLAY.WIDTH * 0.68, // Scaled down to 68% of calculator display width
    height: CALCULATOR_DISPLAY.HEIGHT * 0.44, // Scaled down to 44% of calculator display height
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS * 0.68, // Scaled border radius
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.5,
    paddingTop: CALCULATOR_DISPLAY.PADDING_VERTICAL * 0.2,
    paddingBottom: CALCULATOR_DISPLAY.PADDING_VERTICAL * 0.2,
    // Metallic border effect - matching game screen calculator display (scaled)
    borderTopColor: '#B0B0B0', // Brightest metallic gray (top highlight - direct light source)
    borderLeftColor: '#909090', // Slightly dimmer metallic gray (left highlight - indirect light, creates depth at corner)
    borderRightColor: '#404040', // Dark metallic gray (right shadow - darker metal)
    borderBottomColor: '#404040', // Dark metallic gray (bottom shadow - matches right)
    borderTopWidth: BUTTON_BORDER.WIDTH * 5, // Increased border size (matching game screen, scaled)
    borderLeftWidth: BUTTON_BORDER.WIDTH * 5,
    borderRightWidth: BUTTON_BORDER.WIDTH * 5,
    borderBottomWidth: BUTTON_BORDER.WIDTH * 5,
    // Subtle glisten effect with shadow
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden' as const, // Ensure content is clipped to border radius
    display: 'flex', // Ensure flex layout
    marginTop: -SCREEN_DIMENSIONS.HEIGHT * 0.01, // Raise slightly up without affecting other elements
  },
  libraryTitleInnerBorder: {
    position: 'absolute',
    // Position inner border inside outer border (scaled for smaller display)
    top: BUTTON_BORDER.WIDTH * 5 + 2,
    left: BUTTON_BORDER.WIDTH * 5 + 2,
    right: BUTTON_BORDER.WIDTH * 5 + 2,
    bottom: BUTTON_BORDER.WIDTH * 5 + 2,
    backgroundColor: '#1F1F1F', // Slightly darker than BACKGROUND_DARK (#2C2C2C)
    borderRadius: Math.max(2, (CALCULATOR_DISPLAY.BORDER_RADIUS * 0.68) - (BUTTON_BORDER.WIDTH * 5) - 2), // Scaled border radius
    zIndex: 0, // Behind text
  },
  libraryTitle: {
    fontSize: FONT_SIZES.TARGET_NUMBER * 0.3, // Scaled down to 35% of PlayButton font size
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.TARGET_NUMBER * 0.35, // Match fontSize for perfect vertical centering
    // Enhanced shadow for 3D pop effect (matching targetNumber in GameScreen)
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    zIndex: 1, // Above inner border
  },
  homeButtonContainer: {
    position: 'absolute',
    top: SPACING.CONTAINER_PADDING_TOP,
    left: SPACING.CONTAINER_PADDING_HORIZONTAL,
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
    zIndex: 10,
  },
  settingsButtonContainer: {
    position: 'absolute',
    top: SPACING.CONTAINER_PADDING_TOP,
    right: SPACING.CONTAINER_PADDING_HORIZONTAL,
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
    zIndex: 10,
  },
  difficultyLabelsContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: SPACING.MARGIN_SMALL,
    paddingHorizontal: SPACING.CONTAINER_PADDING_HORIZONTAL,
    justifyContent: 'space-between',
  },
  difficultyLabelButtonWrapper: {
    flex: 0,
    width: '32%',
  },
  difficultyLabelButton: {
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    shadowRadius: 0,
    elevation: 0,
  },
  difficultyLabelButtonInner: {
    paddingVertical: SPACING.PADDING_SMALL,
    paddingHorizontal: SPACING.PADDING_SMALL,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  difficultyLabelButtonText: {
    fontSize: FONT_SIZES.DIFFICULTY_BUTTON_LEVELS, // Smaller font size for levels screen
    fontWeight: 'bold' as const,
    color: COLORS.TEXT_WHITE,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    marginBottom: SPACING.MARGIN_MEDIUM,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginBottom: -2,
    width: '33.33%',
  },
  tabActive: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: FONT_SIZES.HISTORY_TITLE,
    color: '#666',
    textAlign: 'center',
    marginBottom: SPACING.MARGIN_MEDIUM,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    marginTop: -SCREEN_DIMENSIONS.HEIGHT * 0.02, // Shift up by 2% of screen height
  },
  puzzleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: SPACING.MARGIN_MEDIUM,
    justifyContent: 'center', // Center the tiles
    alignItems: 'flex-start',
    width: '100%',
  },
  puzzleCard: {
    width: '31%', // Adjusted to fit exactly 3 per row with margins
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: SPACING.MARGIN_SMALL, // Only bottom margin for spacing between rows
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  puzzleCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  puzzleLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

