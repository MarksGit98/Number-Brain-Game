/**
 * Web entry point for the game
 * Uses Expo's web support with react-native-web
 */
import { registerRootComponent } from 'expo';
import App from '../App';

// Register the app for web
registerRootComponent(App);

