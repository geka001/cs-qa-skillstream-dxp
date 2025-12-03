# 🧪 Testing Personalize Variants - Quick Guide

## ✅ What's Complete:
- ✅ Personalize SDK installed
- ✅ Project UID added to `.env.local`
- ✅ Code updated to use Personalize
- ✅ 3 Audiences created in Contentstack
- ✅ Dev server restarted

---

## 🎯 Next: Test If Variants Are Working

### Step 1: Open Browser Console

**In Chrome/Firefox:**
- Press `F12` or `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)
- Go to **Console** tab

---

### Step 2: Login to the App

**Go to:** `http://localhost:3000`

**Login as:**
- **Name:** `Test User`
- **Team:** `Launch`

---

### Step 3: Check Console Logs

**Look for these logs:**

#### ✅ SUCCESS (Personalize Working):
```
🎭 Using Personalize SDK to fetch modules with variants
✅ Personalize SDK initialized with attributes: { segment: 'ROOKIE', team: 'Launch' }
🔍 Fetching entries with Personalize: { contentTypeUid: 'qa_training_module', segment: 'ROOKIE' }
✅ Personalized 5 entries
```

#### ⚠️ FALLBACK (Personalize Not Working):
```
⚠️ Personalize SDK not configured
📦 Using standard Delivery API (variants not supported)
```

#### ❌ ERROR:
```
❌ Error initializing Personalize SDK: [error message]
```

---

### Step 4: Open a Module

**Click:** "Start Learning" on any module (e.g., "Introduction to Contentstack Launch")

**Check the content:**
- Does it show **rookie-level content** (basic introduction)?
- Or is it still showing mockData content?

---

### Step 5: Test Different Segments

#### Test High-Flyer:
1. Complete all required modules for onboarding
2. User should become HIGH_FLYER
3. Open a module
4. **Expected:** Should show advanced content (high_flyer_version)

**Console should show:**
```
✅ Personalize SDK initialized with attributes: { segment: 'HIGH_FLYER', team: 'Launch' }
```

#### Test At-Risk:
1. Fail a quiz (score < 60%)
2. User should become AT_RISK
3. Open a module
4. **Expected:** Should show remedial content (at_risk_version)

**Console should show:**
```
✅ Personalize SDK initialized with attributes: { segment: 'AT_RISK', team: 'Launch' }
```

---

## 🚨 Troubleshooting:

### Issue 1: "⚠️ Personalize SDK not configured"

**This means the SDK can't initialize. Check:**

1. **`.env.local` has the Project UID:**
   ```bash
   # Run in terminal:
   cat .env.local | grep PERSONALIZE
   
   # Should show:
   # NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=68a6ec844875734317267dcf
   ```

2. **Dev server was restarted after adding UID**
   - Stop server (Ctrl+C)
   - Run `npm run dev` again

3. **Hard refresh browser**
   - Mac: `Cmd+Shift+R`
   - Windows: `Ctrl+Shift+R`

---

### Issue 2: Still Seeing MockData Content

**This means SDK is running but variants not applied. Check:**

1. **Audiences have correct attribute rules:**
   - Go to: Contentstack → Personalize → Audiences
   - Click each audience and verify:
     - Attribute name: `segment` (lowercase!)
     - Values: `rookie`, `at_risk`, `high_flyer` (lowercase with underscore!)

2. **Variants are linked to audiences:**
   - Go to: Contentstack → Settings → Variants → Learner Level Variants
   - Verify each variant is linked:
     - `rookie_version` → Rookie Learners
     - `at_risk_version` → At-Risk Learners
     - `high_flyer_version` → High-Flyer Learners

3. **Entry has content in all variants:**
   - Go to: Content → qa_training_module → Introduction to Contentstack Launch
   - Check all 3 variant tabs have content filled in

4. **Entry is published to `dev` environment:**
   - Make sure entry status is "Published" (not Draft)

---

### Issue 3: Errors in Console

**If you see any errors, share them with me!**

Common errors:
- `API Error 401`: Wrong API key or delivery token
- `API Error 404`: Wrong Project UID
- `Network Error`: Check internet connection

---

## 🎯 What to Share With Me:

### If It's Working ✅:
- Screenshot of console showing "✅ Personalize SDK initialized"
- Confirmation that content changes between segments

### If It's NOT Working ❌:
- **Console logs** (copy/paste all logs)
- **Screenshot of Audiences page** (showing attribute rules)
- **Screenshot of Variants page** (showing linked audiences)
- **Entry status** (Published or Draft?)

---

## 📋 Quick Verification Checklist:

### Before Testing:
- [ ] `.env.local` has `NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=68a6ec844875734317267dcf`
- [ ] Dev server restarted
- [ ] Browser refreshed (hard refresh)

### In Contentstack:
- [ ] 3 audiences created with correct `segment` attribute
- [ ] All 3 variants linked to audiences
- [ ] Entry has content in all 3 variants
- [ ] Entry is published to `dev`

### In Browser:
- [ ] Console open to see logs
- [ ] Logged in as Test User / Launch team
- [ ] Checked console for Personalize SDK logs

---

## 🚀 Ready to Test!

**Open your browser, check the console, and let me know what you see!**

**Share:**
1. Console logs (especially any with 🎭 or ⚠️)
2. Whether content changes between segments
3. Any errors

**Let's get those variants working! 🎉**

