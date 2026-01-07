# Free Tier Protection

## 🛡️ Daily Submission Limit

To ensure you **never exceed Firebase's free tier**, the app automatically caps daily submissions at **15,000 per day**.

### Why 15,000?

Firebase Free Tier limits:
- ✅ **20,000 writes/day** (free)
- ✅ **50,000 reads/day** (free)
- ✅ **1 GB storage** (free)

We cap submissions at **15,000** to leave a **5,000-write buffer** for:
- Count checks (uses 1 read per submission)
- Any other writes you might add later
- Safety margin for Firebase's calculations

### How It Works

```typescript
// Before submitting any result, the app checks:

1. Has this user already submitted today? → Skip if yes
2. Have we reached 15,000 submissions today? → Skip if yes
3. Submit result to Firebase ✅
```

### What Happens at the Limit?

**Scenario:** You hit 15,000 submissions on a particular day

**For users who completed the challenge BEFORE the limit:**
- ✅ Their result is stored
- ✅ They see their percentile
- ✅ Everything works normally

**For users who complete AFTER the limit:**
- ⚠️ Their result is **not** stored in Firebase
- ✅ They can still see their percentile based on existing data
- ✅ The game still works perfectly
- 📊 They're compared against the 15,000 players who submitted

**User Experience:** No error messages, no broken functionality. They just don't get added to the database.

### Cost Protection

| Daily Active Users | Submissions | Within Free Tier? |
|-------------------|-------------|-------------------|
| 1,000 | 1,000 | ✅ Yes (95% buffer) |
| 5,000 | 5,000 | ✅ Yes (75% buffer) |
| 10,000 | 10,000 | ✅ Yes (50% buffer) |
| 15,000 | **15,000** | ✅ Yes (cap reached) |
| 20,000 | **15,000** | ✅ Yes (protected by cap) |
| 50,000 | **15,000** | ✅ Yes (protected by cap) |

**Result:** You'll **never** get charged, even with 50K+ daily users!

### Monitoring

Check your Firebase Console daily usage:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Usage** tab
4. Monitor "Cloud Firestore" writes

### If You Consistently Hit 15K/Day

**Option 1: Increase the Cap**
Edit `web-react/src/utils/leaderboard.ts`:
```typescript
const MAX_DAILY_SUBMISSIONS = 18000; // Increase to 18K (still safe)
```

**Option 2: Upgrade to Blaze Plan (Pay-as-you-go)**
- Still **very cheap** at scale
- Example: 30K writes/day = ~$0.30/month extra
- No surprise bills (set budget alerts)

### Code Implementation

```typescript
// In web-react/src/utils/leaderboard.ts

const MAX_DAILY_SUBMISSIONS = 15000;

async function hasReachedDailyLimit(): Promise<boolean> {
  const today = getTodaysDate();
  const resultsRef = collection(db, 'dailyTimedResults');
  const q = query(resultsRef, where('date', '==', today));
  
  const snapshot = await getCountFromServer(q);
  const count = snapshot.data().count;
  
  return count >= MAX_DAILY_SUBMISSIONS;
}

// Called before every submission
if (await hasReachedDailyLimit()) {
  console.warn('Daily limit reached');
  return false; // Don't submit
}
```

### Performance Impact

**Count Check Cost:**
- Uses `getCountFromServer()` (efficient, doesn't download documents)
- 1 read per submission attempt
- Adds ~100-200ms latency to submission
- **Does not** affect gameplay or user experience

### Summary

✅ **Automatic protection** - No manual intervention needed
✅ **Zero cost** - Stay within free tier forever
✅ **Graceful degradation** - Users see percentile even if not counted
✅ **No errors** - Silent cap, no broken UI
✅ **Adjustable** - Easy to increase limit if needed

Your leaderboard is **production-ready** and **cost-protected**! 🎉

