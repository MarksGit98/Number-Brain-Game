/**
 * Platform adapter utility
 * Automatically selects the correct implementation based on platform
 */
import { Platform } from 'react-native';

// Conditionally import platform-specific implementations
let storage: any;
let soundManager: any;
let adManager: any;

if (Platform.OS === 'web') {
  // Web implementations
  storage = require('../web/storage');
  soundManager = require('../web/soundManager').soundManager;
  adManager = require('../web/adManager').adManager;
} else {
  // Mobile implementations (default)
  storage = require('./storage');
  soundManager = require('./soundManager').soundManager;
  adManager = require('./adManager').adManager;
}

export { storage, soundManager, adManager };

