# Firebase Setup Guide for DIGITL

This guide will help you set up Firebase for the Daily Timed Challenge leaderboard.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `digitl-game` (or your preferred name)
4. Disable Google Analytics (optional, not needed for this feature)
5. Click "Create project"

## Step 2: Register Web App

1. In your Firebase project, click the **Web** icon (`</>`)
2. Register app with nickname: `DIGITL Web`
3. **Don't** check "Set up Firebase Hosting" (you're using Vercel)
4. Click "Register app"
5. Copy the `firebaseConfig` object shown

## Step 3: Update Firebase Config

1. Open `web-react/src/utils/firebase.ts`
2. Replace the placeholder config with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "digitl-game.firebaseapp.com",
  projectId: "digitl-game",
  storageBucket: "digitl-game.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click "Create database"
3. Select **Production mode** (we'll set custom rules next)
4. Choose your region (closest to your users, e.g., `us-east1`)
5. Click "Enable"

## Step 5: Set Security Rules

1. In Firestore Database, click the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Daily Timed Challenge results
    match /dailyTimedResults/{result} {
      // Allow anyone to read (for percentile calculations)
      allow read: if true;
      
      // Only allow creating valid results
      allow create: if request.resource.data.totalTime is int
                    && request.resource.data.totalTime >= 5
                    && request.resource.data.totalTime <= 3600
                    && request.resource.data.easyTime is int
                    && request.resource.data.easyTime >= 0
                    && request.resource.data.mediumTime is int
                    && request.resource.data.mediumTime >= 0
                    && request.resource.data.hardTime is int
                    && request.resource.data.hardTime >= 0
                    && request.resource.data.date is string
                    && request.resource.data.userId is string
                    && request.resource.data.puzzleIndex is int;
      
      // Never allow updates or deletes (prevent cheating)
      allow update, delete: if false;
    }
    
    // Daily Challenge solutions
    match /dailyChallengeResults/{result} {
      // Allow anyone to read (for solution uniqueness calculations)
      allow read: if true;
      
      // Only allow creating valid results
      allow create: if request.resource.data.solution is string
                    && request.resource.data.date is string
                    && request.resource.data.userId is string
                    && request.resource.data.puzzleIndex is int
                    && request.resource.data.difficulty is string;
      
      // Never allow updates or deletes (prevent cheating)
      allow update, delete: if false;
    }
  }
}
```

3. Click **Publish**

## Step 6: Create Indexes (Optional but Recommended)

For better query performance:

1. Go to **Indexes** tab in Firestore
2. Click "Create index"
3. Collection ID: `dailyTimedResults`
4. Add fields:
   - `date` (Ascending)
   - `totalTime` (Ascending)
5. Query scope: Collection
6. Click "Create"

## Step 7: Test Your Setup

1. Deploy your app to Vercel: `vercel --prod`
2. Complete a Daily Timed Challenge
3. Check Firebase Console > Firestore Database
4. You should see a new document in `dailyTimedResults` collection

## Step 8: Data Cleanup (Optional)

To automatically delete old data and save storage:

### Option A: Manual Cleanup
Run this script periodically to delete data older than 7 days:

```javascript
// In Firebase Console > Firestore > Delete old data
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const dateString = sevenDaysAgo.toISOString().split('T')[0];

// Delete documents older than 7 days
db.collection('dailyTimedResults')
  .where('date', '<', dateString)
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => doc.ref.delete());
  });
```

### Option B: Cloud Functions (Requires Blaze Plan)
Set up a scheduled function to auto-delete old data daily.

## 6. Create Composite Indexes (Required for Daily Challenge)

The Daily Challenge duplicate submission checks require composite indexes. Create these in Firebase Console:

### Index 1: Check for duplicate submissions
**Collection:** `dailyChallengeResults`
- Field 1: `date` (Ascending)
- Field 2: `userId` (Ascending)
- Field 3: `difficulty` (Ascending)

### Index 2: Check daily submission limits
**Collection:** `dailyChallengeResults`
- Field 1: `date` (Ascending)
- Field 2: `difficulty` (Ascending)

### How to Create Indexes:

1. Go to **Firebase Console** → **Firestore Database** → **Indexes** tab
2. Click **"Create Index"**
3. Select **Collection ID**: `dailyChallengeResults`
4. Add the fields listed above with "Ascending" order
5. Click **"Create"**
6. Wait for index to build (usually ~1 minute)

**Note:** If you try to submit without indexes, Firebase will show an error in the console with a link to auto-create the index.

## Troubleshooting

### "Permission denied" errors
- Check that your Security Rules are published
- Verify the rules allow `read: if true` and `create` with proper validation

### Data not appearing
- Check browser console for errors
- Verify `firebaseConfig` is correct in `firebase.ts`
- Ensure Firestore is enabled (not Realtime Database)

### "Missing index" errors
- Follow step 6 above to create the required composite indexes
- Or click the link in the error message to auto-create the index

### High costs
- Free tier: 50K reads/day, 20K writes/day, 1GB storage
- Monitor usage in Firebase Console > Usage tab
- Set up budget alerts in Google Cloud Console

## Security & Cost Protection

✅ **Safe to commit:** `firebaseConfig` with API keys (they're meant to be public)
✅ **Security:** Enforced through Firestore Security Rules, not hidden keys
✅ **Anti-cheat:** Rules validate times are reasonable (10s - 1 hour)
✅ **One submission per day:** App checks `hasSubmittedToday()` before submitting
✅ **Free tier protection:** Daily submission cap at 15,000 (out of 20,000 free writes/day)

## What Happens Now

1. **User completes Daily Timed Challenge** → Result submitted to Firebase
2. **Percentile calculated** → Compares user's time to all other players today
3. **Display ranking** → "You solved the daily faster than 73% of players today!"
4. **Share results** → Users can share their times via clipboard

Enjoy your leaderboard! 🎉

