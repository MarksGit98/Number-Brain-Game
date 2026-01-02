import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Difficulty } from '../types';
import PlayButton from '../Components/PlayButton';
import DifficultyButton from '../Components/DifficultyButton';
import SettingsButton from '../Components/SettingsButton';
import LibraryButton from '../Components/LibraryButton';
import PressableButton3D from '../Components/PressableButton3D';
import { SCREEN_DIMENSIONS, FONT_SIZES, SPACING, BUTTON_SIZES, COLORS, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

interface MainMenuScreenProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartGame: () => void;
  onOpenLevelLibrary: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export default function MainMenuScreen({
  selectedDifficulty,
  onDifficultyChange,
  onStartGame,
  onOpenLevelLibrary,
  onOpenSettings,
  onOpenHowToPlay,
}: MainMenuScreenProps) {
  return (
    <View style={styles.menuContainer}>
      <StatusBar style="auto" />
      <View style={styles.libraryButtonContainer}>
        <LibraryButton onPress={onOpenLevelLibrary} />
      </View>
      <View style={styles.settingsButtonContainer}>
        <SettingsButton onPress={onOpenSettings} />
      </View>
      <View style={styles.titleContainer}>
        {['D', 'I', 'G', 'I', 'T', 'L'].map((letter, i) => (
          <React.Fragment key={i}>
            <View style={styles.solarPanelCell}>
              <Text style={styles.titleLetter}>{letter}</Text>
            </View>
            {i < 5 && <View style={styles.solarPanelDivider} />}
          </React.Fragment>
        ))}
      </View>
      
      <View style={styles.menuContent}>
        <PlayButton
          variant={selectedDifficulty}
          onPress={onStartGame}
        />
        
        <View style={styles.difficultyContainer}>
          <DifficultyButton
            difficulty="easy"
            onPress={() => onDifficultyChange('easy')}
            isSelected={selectedDifficulty === 'easy'}
          />
          
          <DifficultyButton
            difficulty="medium"
            onPress={() => onDifficultyChange('medium')}
            isSelected={selectedDifficulty === 'medium'}
          />
          
          <DifficultyButton
            difficulty="hard"
            onPress={() => onDifficultyChange('hard')}
            isSelected={selectedDifficulty === 'hard'}
          />
        </View>

        <PressableButton3D
          onPress={onOpenHowToPlay}
          style={styles.howToPlayButton}
          textStyle={styles.howToPlayButtonText}
        >
          How to Play
        </PressableButton3D>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.CONTAINER_PADDING_HORIZONTAL,
    paddingTop: SPACING.CONTAINER_PADDING_TOP,
  },
  libraryButtonContainer: {
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
  menuContent: {
    width: '100%',
    maxWidth: SPACING.CONTAINER_PADDING_HORIZONTAL * 20, // ~400px equivalent
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    backgroundColor: '#8B7355', // Light brown/tan color for solar panel (matching calculator aesthetic)
    paddingVertical: SCREEN_HEIGHT * 0.003, // Reduced vertical padding
    paddingHorizontal: SCREEN_WIDTH * 0.02, // Reduced horizontal padding for smaller width
    borderRadius: SCREEN_HEIGHT * 0.006,
    marginBottom: SPACING.MARGIN_MEDIUM,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT * 0.035, // Fixed smaller height
    width: SCREEN_WIDTH * 0.4, // Scaled down to fit between top circles
    alignSelf: 'center', // Center horizontally
    // Create rectangular solar panel cells
    overflow: 'hidden',
  },
  solarPanelCell: {
    flex: 1,
    height: '100%',
    backgroundColor: '#6B5D4F', // Darker brown for individual solar panel cells
    alignItems: 'center',
    justifyContent: 'center',
  },
  solarPanelDivider: {
    width: 2,
    height: '100%',
    backgroundColor: '#8B7355', // Same as container background for vertical bar
  },
  titleLetter: {
    fontSize: FONT_SIZES.TITLE,
    fontFamily: 'Digital-7-Mono',
    color: COLORS.BACKGROUND_DARK, // Same color as calculator display background
    textAlign: 'center',
    // Text shadow for thickness (Digital-7-Mono doesn't support bold)
    textShadowColor: COLORS.BACKGROUND_DARK,
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 2,
  },
  playButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonEasy: {
    backgroundColor: '#4CAF50',
  },
  playButtonMedium: {
    backgroundColor: '#FF9800',
  },
  playButtonHard: {
    backgroundColor: '#F44336',
  },
  playButtonText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  difficultyContainer: {
    width: '100%',
    alignItems: 'center',
  },
  difficultyButton: {
    width: '80%',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  difficultyButtonSelected: {
    borderColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  mediumButton: {
    backgroundColor: '#FF9800',
  },
  hardButton: {
    backgroundColor: '#F44336',
  },
  difficultyButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  difficultyButtonTextSelected: {
    fontSize: 26,
  },
  difficultySubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  difficultySubtextSelected: {
    fontSize: 15,
    opacity: 1,
  },
  libraryButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#6C757D',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  libraryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  howToPlayButton: {
    width: '80%',
    paddingVertical: SPACING.PADDING_MEDIUM,
    paddingHorizontal: SPACING.PADDING_LARGE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: COLORS.BUTTON_BLUE,
    borderWidth: BUTTON_BORDER.WIDTH,
    borderColor: BUTTON_BORDER.COLOR,
    marginTop: SPACING.MARGIN_MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howToPlayButtonText: {
    fontSize: FONT_SIZES.BUTTON_TEXT,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_WHITE,
  },
});

