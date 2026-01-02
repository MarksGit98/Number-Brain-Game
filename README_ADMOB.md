# AdMob Integration Setup

## Installation

For production builds, install the AdMob library:

```bash
npm install react-native-google-mobile-ads
```

For Expo projects, you'll need to use a development build (not Expo Go) to test ads.

## Configuration

1. **Update Ad Unit IDs**: In `utils/adManager.ts`, replace the placeholder ad unit IDs:
   - `YOUR_BANNER_AD_UNIT_ID` - Your actual banner ad unit ID from AdMob
   - `YOUR_INTERSTITIAL_AD_UNIT_ID` - Your actual interstitial ad unit ID from AdMob

2. **Add AdMob App ID**: Add your AdMob App ID to `app.json`:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "react-native-google-mobile-ads",
           {
             "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx",
             "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx"
           }
         ]
       ]
     }
   }
   ```

## Features

- **Conditional Loading**: AdMob only loads in production builds, not in Expo Go
- **Banner Ads**: Displayed at the bottom of all screens when ads are enabled
- **Interstitial Ads**: Shown every 3 solved puzzles
- **Ad Toggle**: Users can disable ads in settings (unless ad-free)
- **Ad-Free Purchase**: Once purchased, ads are permanently disabled

## Development vs Production

- **Development/Expo Go**: AdMob library is not loaded, no ads will appear
- **Production Build**: AdMob library loads and ads function normally

