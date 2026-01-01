import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import { Operation, Difficulty, GameState, Puzzle } from './types';
import { getRandomPuzzle, getPuzzlesByDifficulty, getPuzzleByIndex, getPuzzleKey, performOperation, AFFIRMATIONS } from './utils';
import { saveCompletedPuzzles, loadCompletedPuzzles, saveLastPlayedLevel } from './utils/storage';
import MainMenuScreen from './Screens/MainMenuScreen';
import GameScreen from './Screens/GameScreen';
import LevelLibraryScreen from './Screens/LevelLibraryScreen';
import SettingsModal from './Components/SettingsModal';
import { soundManager } from './utils/soundManager';
import { SCREEN_DIMENSIONS } from './constants/sizing';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Digital-7-Mono': require('./assets/fonts/digital-7-mono.ttf'),
  });

  const [showMenu, setShowMenu] = useState(true);
  const [showLevelLibrary, setShowLevelLibrary] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingDigit, setAnimatingDigit] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [shakingDigitIndices, setShakingDigitIndices] = useState<number[]>([]);
  const [errorDigitIndex, setErrorDigitIndex] = useState<number | null>(null);
  const animatedPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const shakeTranslateX = useRef(new Animated.Value(0)).current;
  const targetPositionRef = useRef<{ x: number; y: number } | null>(null);
  const digitPositionRef = useRef<{ x: number; y: number } | null>(null);
  const targetContainerRef = useRef<View>(null);
  const digitContainerRef = useRef<View>(null);
  const animatingDigitButtonRef = useRef<any>(null);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());
  const [libraryTab, setLibraryTab] = useState<Difficulty>('easy');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [isLoadingSavedData, setIsLoadingSavedData] = useState(true);

  // Load saved data and initialize sounds on app start
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Initialize sound manager
        await soundManager.initialize();
        await soundManager.loadAllSounds();

        // Load completed puzzles
        const savedCompletedPuzzles = await loadCompletedPuzzles();
        setCompletedPuzzles(savedCompletedPuzzles);

        // Load last played level (optional - you can restore this if desired)
        // const lastPlayed = await loadLastPlayedLevel();
        // if (lastPlayed.difficulty && lastPlayed.index !== null) {
        //   // Optionally restore the last played level
        // }
      } catch (error) {
        console.warn('Failed to load saved data:', error);
      } finally {
        setIsLoadingSavedData(false);
      }
    };

    loadSavedData();
  }, []);

  // Save completed puzzles whenever they change
  useEffect(() => {
    if (!isLoadingSavedData && completedPuzzles.size > 0) {
      saveCompletedPuzzles(completedPuzzles);
    }
  }, [completedPuzzles, isLoadingSavedData]);

  const startGame = () => {
    if (!selectedDifficulty) return;
    const puzzles = getPuzzlesByDifficulty(selectedDifficulty);
    
    // Find the first unsolved level (lowest index that is not completed)
    let firstUnsolvedIndex: number | null = null;
    for (let i = 0; i < puzzles.length; i++) {
      const puzzleKey = getPuzzleKey(selectedDifficulty, i);
      if (!completedPuzzles.has(puzzleKey)) {
        firstUnsolvedIndex = i;
        break;
      }
    }
    
    // If all levels are completed, start from the first level (index 0)
    const indexToLoad = firstUnsolvedIndex !== null ? firstUnsolvedIndex : 0;
    const puzzle = puzzles[indexToLoad];
    
    setDifficulty(selectedDifficulty);
    setCurrentPuzzleIndex(indexToLoad);
    setGameState({
      digits: puzzle.digits,
      target: puzzle.target,
      selectedIndices: [],
      firstSelectedIndex: null,
      secondSelectedIndex: null,
      selectedOperation: null,
      history: [],
    });
    setShowMenu(false);
    setShowLevelLibrary(false);
    
    // Save last played level
    saveLastPlayedLevel(selectedDifficulty, indexToLoad);
  };

  const loadPuzzleByIndex = (index: number) => {
    if (difficulty !== null) {
      const puzzle = getPuzzleByIndex(difficulty, index);
      if (puzzle) {
        setCurrentPuzzleIndex(index);
        setGameState({
          digits: puzzle.digits,
          target: puzzle.target,
          selectedIndices: [],
          firstSelectedIndex: null,
          secondSelectedIndex: null,
          selectedOperation: null,
          history: [],
        });
        setShowSuccessBanner(false);
        setIsAnimating(false);
        setAnimatingDigit(null);
        setIsShaking(false);
        setShakingDigitIndices([]);
        shakeTranslateX.setValue(0);
        
        // Save last played level
        saveLastPlayedLevel(difficulty, index);
      }
    }
  };

  const goToNextLevel = () => {
    if (difficulty !== null && currentPuzzleIndex !== null) {
      const puzzles = getPuzzlesByDifficulty(difficulty);
      const nextIndex = currentPuzzleIndex + 1;
      if (nextIndex < puzzles.length) {
        loadPuzzleByIndex(nextIndex);
      }
    }
  };

  const goToPreviousLevel = () => {
    if (difficulty !== null && currentPuzzleIndex !== null) {
      const prevIndex = currentPuzzleIndex - 1;
      if (prevIndex >= 0) {
        loadPuzzleByIndex(prevIndex);
      }
    }
  };

  const handleSuccessBannerDismiss = () => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    setShowSuccessBanner(false);
    goToNextLevel();
  };

  useEffect(() => {
    if (showSuccessBanner) {
      // Auto-advance after 2.5 seconds
      successTimeoutRef.current = setTimeout(() => {
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
          successTimeoutRef.current = null;
        }
        setShowSuccessBanner(false);
        goToNextLevel();
      }, 2500);

      return () => {
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }
      };
    }
  }, [showSuccessBanner, difficulty]);

  const returnToMenu = () => {
    setShowMenu(true);
    setShowLevelLibrary(false);
    setDifficulty(null);
    setGameState(null);
    setCurrentPuzzleIndex(null);
  };

  const openLevelLibrary = () => {
    setShowLevelLibrary(true);
    setShowMenu(false);
  };

  const closeLevelLibrary = () => {
    setShowLevelLibrary(false);
    if (!gameState) {
      setShowMenu(true);
    }
  };

  const handleSelectPuzzle = (selectedDifficulty: Difficulty, puzzle: Puzzle, index: number) => {
    setSelectedDifficulty(selectedDifficulty);
    setDifficulty(selectedDifficulty);
    setCurrentPuzzleIndex(index);
    setGameState({
      digits: puzzle.digits,
      target: puzzle.target,
      selectedIndices: [],
      firstSelectedIndex: null,
      secondSelectedIndex: null,
      selectedOperation: null,
      history: [],
    });
    setShowLevelLibrary(false);
    setShowMenu(false);
    
    // Save last played level
    saveLastPlayedLevel(selectedDifficulty, index);
  };

  if (!fontsLoaded) {
    return null; // Show loading state while fonts load
  }

  const handleMusicToggle = (enabled: boolean) => {
    setMusicEnabled(enabled);
    // TODO: Integrate with music player when implemented
  };

  const handleSoundEffectsToggle = (enabled: boolean) => {
    setSoundEffectsEnabled(enabled);
    soundManager.setSoundEnabled(enabled);
  };

  const handlePurchaseAdFree = () => {
    Alert.alert('Ad-Free Version', 'This feature will be available soon!');
    // TODO: Implement ad-free purchase logic
  };

  if (showLevelLibrary) {
    return (
      <>
        <LevelLibraryScreen
          libraryTab={libraryTab}
          onTabChange={setLibraryTab}
          onClose={closeLevelLibrary}
          onReturnToMenu={returnToMenu}
          onSelectPuzzle={handleSelectPuzzle}
          completedPuzzles={completedPuzzles}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
        <SettingsModal
          visible={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          musicEnabled={musicEnabled}
          soundEffectsEnabled={soundEffectsEnabled}
          onMusicToggle={handleMusicToggle}
          onSoundEffectsToggle={handleSoundEffectsToggle}
          onPurchaseAdFree={handlePurchaseAdFree}
        />
      </>
    );
  }

  if (showMenu || !gameState) {
    return (
      <>
        <MainMenuScreen
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          onStartGame={startGame}
          onOpenLevelLibrary={openLevelLibrary}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
        <SettingsModal
          visible={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          musicEnabled={musicEnabled}
          soundEffectsEnabled={soundEffectsEnabled}
          onMusicToggle={handleMusicToggle}
          onSoundEffectsToggle={handleSoundEffectsToggle}
          onPurchaseAdFree={handlePurchaseAdFree}
        />
      </>
    );
  }

  // Helper function to trigger shake animation for invalid operations
  const triggerInvalidOperationShake = (index1: number, index2: number) => {
    // Play error click sound
    soundManager.playSound('errorClick');
    
    // Start shake animation (tiles keep their selected colors during shake)
    setShakingDigitIndices([index1, index2]);
    shakeTranslateX.setValue(0);
    
    // Create shake animation (same as wrong answer shake)
    const singleShake = Animated.sequence([
      Animated.timing(shakeTranslateX, {
        toValue: 6,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: -6,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: 6,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: -6,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: 0,
        duration: 55,
        useNativeDriver: true,
      }),
    ]);
    
    Animated.sequence([
      singleShake,
      singleShake,
    ]).start(() => {
      // Reset tiles and operation after shake animation completes
      setShakingDigitIndices([]);
      shakeTranslateX.setValue(0);
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          firstSelectedIndex: null,
          secondSelectedIndex: null,
          selectedIndices: [],
          selectedOperation: null,
        };
      });
    });
  };

  const handleDigitPress = (index: number) => {
    if (!gameState) return;
    
    // Check if button is currently selected to determine which sound to play
    const isCurrentlySelected = 
      gameState.firstSelectedIndex === index || 
      gameState.secondSelectedIndex === index || 
      gameState.selectedIndices.includes(index);
    
    // Play appropriate sound before state update
    if (isCurrentlySelected) {
      soundManager.playSound('buttonRelease');
    } else {
      soundManager.playSound('buttonPress');
    }
    
    setGameState((prev) => {
      if (!prev) return prev;
      
      // New method: if operation is selected first, then first number, then second number - perform operation
      if (prev.selectedOperation !== null && prev.firstSelectedIndex !== null && prev.secondSelectedIndex === null) {
        if (prev.firstSelectedIndex === index) {
          // Deselect first number if clicking it again
          return { ...prev, firstSelectedIndex: null };
        }
        
        // Set second selected index, then perform operation
        const secondIndex = index;
        const a = prev.digits[prev.firstSelectedIndex];
        const b = prev.digits[secondIndex];
        const result = performOperation(a, b, prev.selectedOperation);
        
        if (result === null || result < 0) {
          // First set secondSelectedIndex to show it as selected (red), then trigger shake
          const firstIndex = prev.firstSelectedIndex;
          if (firstIndex !== null) {
            // Set state immediately to show second number as selected (red)
            // Then after a brief delay to allow React to render, trigger shake animation
            setTimeout(() => {
              triggerInvalidOperationShake(firstIndex, secondIndex);
            }, 200);
            // Return state with secondSelectedIndex set so it shows as red
            return { ...prev, secondSelectedIndex: secondIndex };
          }
          return prev;
        }
        
        return performOperationAndUpdateState(prev, prev.firstSelectedIndex, secondIndex, a, b, prev.selectedOperation, result);
      }
      
      // New method: if operation is selected first, then select first number
      if (prev.selectedOperation !== null && prev.firstSelectedIndex === null) {
        return { ...prev, firstSelectedIndex: index };
      }
      
      // New method: if we have first number and operator selected, select second number and perform operation
      if (prev.firstSelectedIndex !== null && prev.selectedOperation !== null) {
        if (prev.firstSelectedIndex === index) {
          // Deselect first number if clicking it again
          return { ...prev, firstSelectedIndex: null, selectedOperation: null, secondSelectedIndex: null };
        }
        
        // Set second selected index for visual feedback, then perform operation
        const secondIndex = index;
        const a = prev.digits[prev.firstSelectedIndex];
        const b = prev.digits[secondIndex];
        const result = performOperation(a, b, prev.selectedOperation);
        
        if (result === null || result < 0) {
          // First set secondSelectedIndex to show it as selected (red), then trigger shake
          const firstIndex = prev.firstSelectedIndex;
          if (firstIndex !== null) {
            // Set state immediately to show second number as selected (red)
            // Then after a brief delay to allow React to render, trigger shake animation
            setTimeout(() => {
              triggerInvalidOperationShake(firstIndex, secondIndex);
            }, 200);
            // Return state with secondSelectedIndex set so it shows as red
            return { ...prev, secondSelectedIndex: secondIndex };
          }
          return prev;
        }
        
        return performOperationAndUpdateState(prev, prev.firstSelectedIndex, secondIndex, a, b, prev.selectedOperation, result);
      }
      
      // New method: if we have first number selected but no operator, allow selecting second number
      if (prev.firstSelectedIndex !== null && prev.selectedOperation === null) {
        if (prev.firstSelectedIndex === index) {
          // Deselect first number
          return { ...prev, firstSelectedIndex: null, secondSelectedIndex: null };
        }
        // If second number is already selected and clicking it again, deselect it
        if (prev.secondSelectedIndex === index) {
          return { ...prev, secondSelectedIndex: null };
        }
        // Select or change second selection
        return { ...prev, secondSelectedIndex: index };
      }
      
      // New method: if nothing selected, select first number
      if (prev.firstSelectedIndex === null && prev.selectedOperation === null) {
        return { ...prev, firstSelectedIndex: index };
      }
      
      // Old method: select two numbers
      const newIndices = [...prev.selectedIndices];
      const existingIndex = newIndices.indexOf(index);
      
      if (existingIndex !== -1) {
        // Deselect if already selected
        newIndices.splice(existingIndex, 1);
      } else if (newIndices.length < 2) {
        // Select if not already selected and we have space
        newIndices.push(index);
      }
      
      return { ...prev, selectedIndices: newIndices };
    });
  };

  const performOperationAndUpdateState = (
    prev: GameState,
    index1: number,
    index2: number,
    a: number,
    b: number,
    operation: Operation,
    result: number
  ): GameState => {
    // Store the previous digits state before modification
    const previousDigits = [...prev.digits];
    
    const newDigits = [...prev.digits];
    // Remove the two selected digits and add the result
    // Sort indices in descending order to remove from end first
    const sortedIndices = [index1, index2].sort((a, b) => b - a);
    sortedIndices.forEach((idx) => newDigits.splice(idx, 1));
    newDigits.push(result);

    const newHistory = [...prev.history, {
      operation,
      operands: [a, b] as [number, number],
      result: result,
      previousDigits: previousDigits,
    }];

    // Check win condition
    if (newDigits.length === 1 && newDigits[0] === prev.target) {
      // Wait half a second to show the final tile, then start animation
      setTimeout(() => {
        setIsAnimating(true);
        setAnimatingDigit(newDigits[0]);
        
        // Measure digit position to start animation from
        const measureDigitPosition = () => {
          if (animatingDigitButtonRef.current) {
            animatingDigitButtonRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
              const startX = pageX + width / 2 - 37.5;
              const startY = pageY + height / 2 - 37.5;
              
              // Validate position is reasonable
              if (startX <= 0 || startY <= 0) {
                // Fallback: skip animation and show banner directly
                handleAnimationComplete();
                return;
              }
              
              // Set initial position
              animatedPosition.setValue({ x: startX, y: startY });
              animatedOpacity.setValue(1);
              
              // Animate: float up to top of screen and fade out
              Animated.parallel([
                Animated.timing(animatedPosition, {
                  toValue: { x: startX, y: -SCREEN_DIMENSIONS.HEIGHT },
                  duration: 1000,
                  useNativeDriver: true,
                }),
                Animated.timing(animatedOpacity, {
                  toValue: 0,
                  duration: 1000,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                handleAnimationComplete();
              });
            });
          } else {
            // Retry if ref not ready
            setTimeout(measureDigitPosition, 50);
          }
        };
        
        const handleAnimationComplete = () => {
          // Mark puzzle as completed and show success banner
          if (difficulty && currentPuzzleIndex !== null) {
            const puzzleKey = getPuzzleKey(difficulty, currentPuzzleIndex);
            setCompletedPuzzles(prev => new Set([...prev, puzzleKey]));
          }
          setIsAnimating(false);
          setAnimatingDigit(null);
          const randomAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
          setSuccessMessage(randomAffirmation);
          setShowSuccessBanner(true);
        };
        
        // Start measuring position
        setTimeout(measureDigitPosition, 100);
      }, 500);
    }

    // Check lose condition (only one number left but it's not the target)
    if (newDigits.length === 1 && newDigits[0] !== prev.target) {
      setTimeout(() => {
        // Start shake animation
        setIsShaking(true);
        shakeTranslateX.setValue(0);
        
        // Create shake animation (side to side for ~0.5 second)
        // Each shake cycle: right, left, right, left, center (total ~275ms)
        // Repeat 2 times for ~0.55 second
        const singleShake = Animated.sequence([
          Animated.timing(shakeTranslateX, {
            toValue: 6,
            duration: 55,
            useNativeDriver: true,
          }),
          Animated.timing(shakeTranslateX, {
            toValue: -6,
            duration: 55,
            useNativeDriver: true,
          }),
          Animated.timing(shakeTranslateX, {
            toValue: 6,
            duration: 55,
            useNativeDriver: true,
          }),
          Animated.timing(shakeTranslateX, {
            toValue: -6,
            duration: 55,
            useNativeDriver: true,
          }),
          Animated.timing(shakeTranslateX, {
            toValue: 0,
            duration: 55,
            useNativeDriver: true,
          }),
        ]);
        
        Animated.sequence([
          singleShake,
          singleShake,
        ]).start(() => {
          // Reset puzzle after shake animation completes
          setIsShaking(false);
          shakeTranslateX.setValue(0);
          if (currentPuzzleIndex !== null) {
            loadPuzzleByIndex(currentPuzzleIndex);
          }
        });
      }, 100);
    }

    return {
      digits: newDigits,
      target: prev.target,
      selectedIndices: [],
      firstSelectedIndex: null,
      secondSelectedIndex: null,
      selectedOperation: null,
      history: newHistory,
    };
  };

  const handleOperationPress = (operation: Operation) => {
    if (!gameState) return;
    
    // Allow deselecting operation by pressing it again
    // If the same operation is already selected, deselect it
    if (gameState.selectedOperation === operation) {
      soundManager.playSound('buttonRelease');
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          selectedOperation: null,
        };
      });
      return;
    }
    
    // Selecting a new operation
    soundManager.playSound('buttonPress');
    
    // New method 4: if operation is selected first, then both numbers are selected, perform operation
    if (gameState.selectedOperation !== null && gameState.firstSelectedIndex !== null && gameState.secondSelectedIndex !== null) {
      const index1 = gameState.firstSelectedIndex;
      const index2 = gameState.secondSelectedIndex;
      const a = gameState.digits[index1];
      const b = gameState.digits[index2];

      const result = performOperation(a, b, gameState.selectedOperation);
      
      if (result === null || result < 0) {
        // Trigger shake animation for invalid operation
        triggerInvalidOperationShake(index1, index2);
        return;
      }

      setGameState((prev) => {
        if (!prev) return prev;
        return performOperationAndUpdateState(prev, index1, index2, a, b, gameState.selectedOperation!, result);
      });
      return;
    }
    
    // New method 3: if we have both first and second number selected (but no operator), perform operation
    if (gameState.firstSelectedIndex !== null && gameState.secondSelectedIndex !== null && gameState.selectedOperation === null) {
      const index1 = gameState.firstSelectedIndex;
      const index2 = gameState.secondSelectedIndex;
      const a = gameState.digits[index1];
      const b = gameState.digits[index2];

      const result = performOperation(a, b, operation);
      
      if (result === null || result < 0) {
        // Trigger shake animation for invalid operation
        triggerInvalidOperationShake(index1, index2);
        return;
      }

      setGameState((prev) => {
        if (!prev) return prev;
        return performOperationAndUpdateState(prev, index1, index2, a, b, operation, result);
      });
      return;
    }
    
    // New method 2: if we have first number selected (but no second), just set the operator
    if (gameState.firstSelectedIndex !== null && gameState.secondSelectedIndex === null) {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          selectedOperation: operation,
        };
      });
      return;
    }
    
    // New method 1: if nothing is selected, allow selecting operation first
    if (gameState.firstSelectedIndex === null && gameState.secondSelectedIndex === null && gameState.selectedOperation === null) {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          selectedOperation: operation,
        };
      });
      return;
    }
    
    // Old method: if we have two numbers selected in selectedIndices, perform operation
    if (gameState.selectedIndices.length === 2) {
      const [index1, index2] = gameState.selectedIndices;
      const a = gameState.digits[index1];
      const b = gameState.digits[index2];

      const result = performOperation(a, b, operation);
      
      if (result === null || result < 0) {
        // Trigger shake animation for invalid operation
        triggerInvalidOperationShake(index1, index2);
        return;
      }

      setGameState((prev) => {
        if (!prev) return prev;
        return performOperationAndUpdateState(prev, index1, index2, a, b, operation, result);
      });
      return;
    }
    
    Alert.alert('Select Numbers First', 'Please select one or two numbers, then choose an operation.');
  };

  const handleUndo = () => {
    if (!gameState || gameState.history.length === 0) {
      return;
    }

    setGameState((prev) => {
      if (!prev) return prev;
      const lastEntry = prev.history[prev.history.length - 1];
      
      // Simply restore the previous digits array - this preserves exact order and positions
      const newDigits = [...lastEntry.previousDigits];
      
      // Remove the last history entry
      const newHistory = prev.history.slice(0, -1);
      
      return {
        ...prev,
        digits: newDigits,
        history: newHistory,
        selectedIndices: [],
        firstSelectedIndex: null,
        secondSelectedIndex: null,
        selectedOperation: null,
      };
    });
  };


  // Update target position ref when layout changes
  const updateTargetPosition = () => {
    if (targetContainerRef.current) {
      targetContainerRef.current.measure((fx: number, fy: number, fwidth: number, fheight: number, pageX: number, pageY: number) => {
        targetPositionRef.current = {
          x: pageX + fwidth / 2 - 37.5,
          y: pageY + fheight / 2 - 37.5,
        };
      });
    }
  };

  if (!gameState || !difficulty) {
    return null;
  }

  return (
    <>
      <GameScreen
        gameState={gameState}
        difficulty={difficulty}
        currentPuzzleIndex={currentPuzzleIndex}
        showSuccessBanner={showSuccessBanner}
        successMessage={successMessage}
        isAnimating={isAnimating}
        animatingDigit={animatingDigit}
        isShaking={isShaking}
        shakingDigitIndices={shakingDigitIndices}
        errorDigitIndex={errorDigitIndex}
        shakeTranslateX={shakeTranslateX}
        onDigitPress={handleDigitPress}
        onOperationPress={handleOperationPress}
        onUndo={handleUndo}
        onReturnToMenu={returnToMenu}
      onOpenLevelLibrary={openLevelLibrary}
      onOpenSettings={() => setShowSettingsModal(true)}
      onSuccessBannerDismiss={handleSuccessBannerDismiss}
        targetContainerRef={targetContainerRef}
        digitContainerRef={digitContainerRef}
        animatingDigitButtonRef={animatingDigitButtonRef}
        animatedPosition={animatedPosition}
        animatedScale={animatedScale}
        animatedOpacity={animatedOpacity}
      />
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        musicEnabled={musicEnabled}
        soundEffectsEnabled={soundEffectsEnabled}
        onMusicToggle={handleMusicToggle}
        onSoundEffectsToggle={handleSoundEffectsToggle}
        onPurchaseAdFree={handlePurchaseAdFree}
      />
    </>
  );
}
