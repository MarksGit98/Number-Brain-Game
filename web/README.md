# Web Version of Digitl

This folder contains the web-specific implementation of the Digitl game that can run in browsers on any device.

## Structure

- `index.tsx` - Web entry point (uses Expo's web support)
- `index.html` - HTML template
- `storage.ts` - Web storage adapter using localStorage (replaces AsyncStorage)
- `soundManager.ts` - Web sound manager using HTML5 Audio API (replaces expo-av)
- `adManager.ts` - Web ad manager (no-op, can be extended with web ad networks)
- `tsconfig.json` - TypeScript configuration for web
- `webpack.config.js` - Optional webpack configuration (alternative to Expo)

## Quick Start

The easiest way to run the web version is using Expo's built-in web support:

```bash
# From the root directory
npm run web:dev
```

This will start Expo's web server with hot reloading.

## Building for Production

To build the web version for production using Expo:

```bash
npm run web:build
```

The built files will be in the `web-build` directory.

## Platform-Specific Adapters

The web version uses platform-specific adapters that replace mobile-specific implementations:

### Storage (`web/storage.ts`)
- Uses `localStorage` instead of `AsyncStorage`
- Same API, different implementation

### Sound Manager (`web/soundManager.ts`)
- Uses HTML5 Audio API instead of `expo-av`
- Same API, different implementation

### Ad Manager (`web/adManager.ts`)
- No-op implementation (can be extended with web ad networks like Google AdSense)

## Integration with Main App

The main `App.tsx` can be modified to use platform detection:

```typescript
import { Platform } from 'react-native';
import * as storage from Platform.OS === 'web' 
  ? require('./web/storage') 
  : require('./utils/storage');
```

Or use webpack aliases (see `web/webpack.config.js`) to automatically swap implementations.

## Notes

- The web version reuses ALL components from the main codebase
- React Native Web handles component compatibility automatically
- All screens, components, and game logic are shared
- Only platform-specific utilities (storage, sound, ads) are swapped
- Works on desktop, mobile browsers, and tablets

## Important: AdMob vs AdSense

- **Mobile**: Uses `react-native-google-mobile-ads` (AdMob)
- **Web**: Uses Google AdSense (different from AdMob)
- The web version automatically uses AdSense - no need to install react-native-google-mobile-ads for web
- See `DEPLOYMENT.md` for setup instructions

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions to:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3
- Traditional web hosting

