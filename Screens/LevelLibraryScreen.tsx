import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Difficulty, Puzzle } from '../types';
import { getPuzzlesByDifficulty, getPuzzleByIndex, getPuzzleKey } from '../utils';
import TabButton from '../Components/TabButton';
import PuzzleCard from '../Components/PuzzleCard';
import NavArrowButton from '../Components/NavArrowButton';
import HomeButton from '../Components/HomeButton';
import { FONT_SIZES, SPACING, BUTTON_SIZES } from '../constants/sizing';

interface LevelLibraryScreenProps {
  libraryTab: Difficulty;
  onTabChange: (tab: Difficulty) => void;
  onClose: () => void;
  onReturnToMenu: () => void;
  onSelectPuzzle: (difficulty: Difficulty, puzzle: Puzzle, index: number) => void;
  completedPuzzles: Set<string>;
}

export default function LevelLibraryScreen({
  libraryTab,
  onTabChange,
  onClose,
  onReturnToMenu,
  onSelectPuzzle,
  completedPuzzles,
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
      <View style={styles.libraryHeader}>
        <Text style={styles.libraryTitle}>Level Library</Text>
        <View style={styles.backButtonContainer}>
          <NavArrowButton
            direction="left"
            onPress={onClose}
          />
        </View>
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

      <View style={styles.puzzleGrid}>
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
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.CONTAINER_PADDING_HORIZONTAL,
    paddingTop: SPACING.CONTAINER_PADDING_TOP,
    paddingBottom: SPACING.MARGIN_MEDIUM,
    width: '100%',
  },
  libraryTitle: {
    fontSize: FONT_SIZES.TITLE * 0.93, // ~28px equivalent
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: '600',
  },
  backButtonContainer: {
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
  },
  homeButtonContainer: {
    position: 'absolute',
    top: SPACING.CONTAINER_PADDING_TOP,
    left: SPACING.CONTAINER_PADDING_HORIZONTAL,
    width: BUTTON_SIZES.NAV_ARROW_SIZE,
    height: BUTTON_SIZES.NAV_ARROW_SIZE,
    zIndex: 10,
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
  puzzleGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.CONTAINER_PADDING_HORIZONTAL,
    paddingBottom: SPACING.MARGIN_MEDIUM,
    justifyContent: 'space-between',
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

