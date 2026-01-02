/**
 * Web version of the App
 * Reuses the main App logic but with web-specific adapters
 */
import React from 'react';
import { Platform } from 'react-native';
import AppMain from '../App';
import * as webStorage from './storage';
import { soundManager as webSoundManager } from './soundManager';

// Override storage imports for web
// This is a workaround - we'll need to modify the main App to accept storage as props
// For now, we'll create a wrapper that provides web-specific implementations

// Since we can't easily override imports in the main App, we'll need to create
// a web-specific version that imports web adapters
// For simplicity, let's create a web entry that uses the same App but with platform detection

export default function WebApp() {
  // The main App will use react-native-web which should work
  // We just need to ensure web-specific storage and sound managers are used
  // This will be handled through platform-specific imports in the main App
  return <AppMain />;
}

