# 🔍 Testing HIGH_FLYER Content from Contentstack

## ✅ Server Restarted

The dev server has been restarted to pick up the code changes.

---

## 🧪 Test Steps:

### Step 1: Clear Everything & Start Fresh
1. **Open browser in Incognito/Private mode** (to ensure fresh state)
2. Go to: `http://localhost:3000`
3. **Open DevTools Console** (F12 or Cmd+Option+I)

### Step 2: Login as New User
- **Name:** `LP Test`
- **Team:** `Launch`
- **User Type:** QA Team Member

### Step 3: Watch Console During Login
**Should see:**
```
🔄 Segment changed to ROOKIE, refreshing Contentstack cache...
📦 Fetching modules from Contentstack for team: Launch, segment: ROOKIE...
📦 Received X raw module entries from Contentstack
✅ Cache refreshed for ROOKIE
```

### Step 4: Complete Onboarding
- Complete all required modules
- Read required SOPs
- Explore required tools
- Wait for onboarding completion

### Step 5: Watch Console When Becoming HIGH_FLYER
**Should see:**
```
🔄 Segment changed to HIGH_FLYER, refreshing Contentstack cache...
📦 Fetching modules from Contentstack for team: Launch, segment: HIGH_FLYER...
📦 Received X raw module entries from Contentstack
✅ Cache refreshed for HIGH_FLYER
```

### Step 6: Verify Content Source
**Click on any module and check console:**

**✅ From Contentstack:**
```
📦 Using cached Contentstack content for Launch/HIGH_FLYER
```

**❌ From MockData (BAD):**
```
📦 Using mockData (Contentstack cache empty)
```

---

## 🚨 If Still Seeing MockData, Check:

### Issue 1: No HIGH_FLYER Entries in Contentstack

**Problem:** Contentstack might not have any modules tagged with HIGH_FLYER segment.

**How to Check:**
1. Go to: Contentstack → Content → qa_training_module
2. Open any module (e.g., "Introduction to Contentstack Launch")
3. Check the **segment_taxonomy** field
4. **Should include:** `["Rookie", "AT Risk", "High flyer"]` (all 3!)

**Why all 3?**
- If only "High flyer" is tagged, ROOKIE users won't see it
- Modules should be visible to multiple segments
- The app picks the right content for each segment

**If segment_taxonomy is empty or missing "High flyer":**
→ No HIGH_FLYER content in Contentstack
→ App falls back to mockData

---

### Issue 2: Modules Not Published

**Check:**
1. Go to: Contentstack → Content → qa_training_module
2. Verify entries are **Published** (not Draft)
3. Published to: `dev` environment

**If unpublished:**
→ Delivery API won't return them
→ App falls back to mockData

---

### Issue 3: useEffect Not Firing

**If console doesn't show cache refresh:**
```
🔄 Segment changed to HIGH_FLYER, refreshing Contentstack cache...
```

**Then the useEffect isn't firing. Check:**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Clear browser cache
- Try Incognito mode

---

## 🎯 Quick Debug Script

**Run this in browser console after becoming HIGH_FLYER:**

```javascript
// Check what's in the cache
console.log('Current segment:', localStorage.getItem('skillstream-user') && JSON.parse(localStorage.getItem('skillstream-user')).segment);

// Manually trigger cache refresh
(async () => {
  const { getPersonalizedContentAsync } = await import('./data/mockData');
  const result = await getPersonalizedContentAsync('HIGH_FLYER', [], 'Launch');
  console.log('HIGH_FLYER modules from Contentstack:', result.modules.length);
  console.log('Module titles:', result.modules.map(m => m.title));
})();
```

---

## 📋 Expected Results:

### For ROOKIE (Login):
```
📦 Fetching modules from Contentstack for team: Launch, segment: ROOKIE...
📦 Received 5-7 raw module entries from Contentstack
✅ Cache refreshed for ROOKIE
```

### For HIGH_FLYER (After Onboarding):
```
🔄 Segment changed to HIGH_FLYER, refreshing Contentstack cache...
📦 Fetching modules from Contentstack for team: Launch, segment: HIGH_FLYER...
📦 Received 5-10 raw module entries from Contentstack
✅ Cache refreshed for HIGH_FLYER
```

**If Contentstack returns 0 entries:**
→ No modules tagged for HIGH_FLYER in Contentstack
→ Need to update segment_taxonomy in Contentstack UI

---

## 🔧 Quick Fix If No HIGH_FLYER Content:

### Option 1: Update Existing Modules (Recommended)

**In Contentstack:**
1. Go to each module entry
2. Find **segment_taxonomy** field
3. Add all 3: `["Rookie", "AT Risk", "High flyer"]`
4. **Save and Publish**

**Why this works:**
- Same module, different segments see it
- No need to create new entries
- More realistic (content rarely changes, just targeting)

---

### Option 2: Temporarily Use MockData Fallback

**If you want to test the app now without waiting:**

The mockData fallback is already working, so HIGH_FLYER will see mockData content until you update Contentstack entries.

**Not ideal but allows testing other features!**

---

## 🎯 What to Share With Me:

**After testing, please copy/paste:**

1. **Console logs** when you become HIGH_FLYER
2. **Answer these questions:**
   - Does console show "🔄 Segment changed to HIGH_FLYER"?
   - Does it say "📦 Received X raw module entries" (how many)?
   - Does it say "Using mockData" or "Using cached Contentstack"?
3. **Contentstack UI check:**
   - Do your module entries have "High flyer" in segment_taxonomy?
   - Are they published to `dev`?

---

**Test now with the restarted server and share what you see! 🚀**

