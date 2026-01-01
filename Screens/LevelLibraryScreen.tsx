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

interface LevelLibraryScreenProps {
  libraryTab: Difficulty;
  onTabChange: (tab: Difficulty) => void;
  onClose: () => void;
  onReturnToMenu: () => void;
  onSelectPuzzle: (difficulty: Difficulty, puzzle: Puzzle, index: number) => void;
  completedPuzzles: Set<string>;
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
          onPress={onPress}
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
          
          return (
            <PuzzleCard
              key={index}
              levelNumber={index + 1}
              onPress={() => onSelectPuzzle(libraryTab, puzzle, index)}
              isCompleted={isCompleted}
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
    paddingTop: SPACING.CONTAINER_PADDING_TOP * 0.5,
    paddingBottom: SPACING.MARGIN_MEDIUM,
  },
  libraryTitleContainer: {
    width: CALCULATOR_DISPLAY.WIDTH * 0.7, // Scaled down to 70% of PlayButton width
    height: CALCULATOR_DISPLAY.HEIGHT * 0.5, // Scaled down to 50% of PlayButton height
    borderRadius: CALCULATOR_DISPLAY.BORDER_RADIUS,
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingHorizontal: CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.7,
    paddingVertical: CALCULATOR_DISPLAY.PADDING_VERTICAL * 0.5,
    borderWidth: BUTTON_BORDER.WIDTH * 2,
    borderColor: BUTTON_BORDER.COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  libraryTitle: {
    fontSize: FONT_SIZES.TARGET_NUMBER * 0.35, // Scaled down to 35% of PlayButton font size
    color: COLORS.TEXT_SUCCESS,
    fontFamily: 'Digital-7-Mono',
    letterSpacing: LETTER_SPACING.WIDE,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: FONT_SIZES.TARGET_NUMBER * 0.35,
    ...TEXT_SHADOW_BOLD_STRONG,
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
    fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.9, // Slightly smaller to fit "Medium" on one line
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
    justifyContent: 'flex-start',
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

