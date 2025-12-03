# 🔧 Module Migration - Debugging Guide

## 🐛 Issue Reported

**Symptom**: "Introduction to Contentstack Launch" module showing wrong video URL
- **Expected** (from Contentstack): `https://www.youtube.com/embed/oKAQK11Qt98`
- **Actual** (showing): `https://www.youtube.com/embed/dQw4w9WgXcQ` (mockData URL)

**Conclusion**: Still using mockData, not Contentstack

---

## 🔍 Debug Steps to Take

### Step 1: Verify Server Restart

**Dev server has been restarted**. Wait 10 seconds for full initialization.

### Step 2: Hard Refresh Browser

```
1. Open browser Dev Tools (F12 or Cmd + Option + I)
2. Go to Console tab
3. Hard refresh: Cmd + Shift + R (Mac) or Ctrl + Shift + R (Windows)
```

### Step 3: Check Console Logs

You should see these logs when dashboard loads:

**Expected (Success)**:
```
🔍 getCsModules called with: {userTeam: 'Launch', userSegment: 'ROOKIE', enabled: true}
📦 Fetching modules from Contentstack for team: Launch, segment: ROOKIE...
📦 Received 20 raw module entries from Contentstack
📋 Module Introduction to Contentstack Launch: teamMatch=true, segmentMatch=true
📦 After filtering: 5 modules match team=Launch, segment=ROOKIE
✅ Mapped to 5 module objects
📋 First module: Introduction to Contentstack Launch - Video: https://www.youtube.com/embed/oKAQK11Qt98
✅ Using 5 modules from Contentstack
```

**If You See (Problem)**:
```
🔍 getCsModules called with: {userTeam: 'Launch', userSegment: 'ROOKIE', enabled: false}
📦 Contentstack disabled for modules. Using mock data.
⚠️  No modules from Contentstack, using mockData fallback
```

---

## 🔧 Troubleshooting

### Problem 1: `enabled: false`

**Cause**: `NEXT_PUBLIC_USE_CONTENTSTACK` not being read correctly

**Fix**:
1. Check `.env.local`:
```bash
cat .env.local | grep NEXT_PUBLIC_USE_CONTENTSTACK
```
Should show: `NEXT_PUBLIC_USE_CONTENTSTACK=true`

2. Restart server (environment variables only load on server start):
```bash
# Kill all node processes
killall node
# Wait 2 seconds
sleep 2
# Start fresh
npm run dev
```

### Problem 2: `📦 Received 0 raw module entries`

**Cause**: Modules not published to 'dev' environment or API credentials wrong

**Fix**:
1. Check Contentstack UI:
   - Go to QA Training Module content type
   - Check "Publish Status" column
   - Should show "Published" for all entries
   - Click entry → Check "Publish Details" → Should include "dev" environment

2. Test API directly:
```bash
npm run cs:check-modules
```

### Problem 3: `📦 After filtering: 0 modules match`

**Cause**: Team/segment filtering removing all modules

**Fix**: Check the actual data structure. The filter logs will show why:
```
📋 Module Introduction to Contentstack Launch: teamMatch=false, segmentMatch=true
```

If `teamMatch=false`, the `target_teams` field in Contentstack might be wrong or empty.

---

## 🧪 Quick Test Script

Run this to test module fetching directly:

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

(async () => {
  const res = await axios.get('https://cdn.contentstack.io/v3/content_types/qa_training_module/entries', {
    headers: {
      api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
      access_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN
    },
    params: { environment: 'dev' }
  });
  
  console.log('Total modules:', res.data.entries.length);
  const launch = res.data.entries.filter(e => {
    try {
      const teams = JSON.parse(e.target_teams || '[]');
      return teams.includes('Launch');
    } catch { return false; }
  });
  console.log('Launch team modules:', launch.length);
  console.log('First Launch module:', launch[0]?.title, launch[0]?.video_url);
})();
"
```

**Expected Output**:
```
Total modules: 20
Launch team modules: 5
First Launch module: Introduction to Contentstack Launch https://www.youtube.com/embed/oKAQK11Qt98
```

---

## 📋 Checklist

Before testing, verify:

- [ ] Dev server restarted (`npm run dev`)
- [ ] Hard refresh browser (`Cmd + Shift + R`)
- [ ] Console tab open in Dev Tools
- [ ] Logged in as Launch team user

Look for these specific logs:
- [ ] `🔍 getCsModules called with:` - Function is being called
- [ ] `📦 Received X raw module entries` - Contentstack returned data
- [ ] `📦 After filtering: X modules` - Filtering worked
- [ ] `✅ Using X modules from Contentstack` - Success!

If you see `⚠️  No modules from Contentstack, using mockData fallback`, then:
1. Check the console for error messages
2. Run `npm run cs:check-modules` to verify entries exist
3. Check `.env.local` for `NEXT_PUBLIC_USE_CONTENTSTACK=true`
4. Restart server and hard refresh

---

## 🎯 What Should Happen

### When Working Correctly:

1. **Dashboard loads** → Calls `getPersonalizedContentAsync()`
2. **Fetches from Contentstack** → Gets 20 modules
3. **Filters by team** → Launch user sees ~5 Launch modules
4. **Filters by segment** → ROOKIE sees ROOKIE modules
5. **Video URL matches Contentstack** → `oKAQK11Qt98` not `dQw4w9WgXcQ`
6. **Module content** → HTML from Contentstack, not mockData text

---

## ✅ Next Steps

1. **Open browser console** (F12)
2. **Login as Launch team user**
3. **Check console logs** - look for the 🔍 and 📦 emojis
4. **Check module video** - should match Contentstack URL
5. **Report results** - what do the console logs show?

The detailed logging will tell us exactly where the issue is! 🔍


