# 🎭 Contentstack Personalize SDK Implementation Guide

## ✅ What I've Done:

### 1. Installed Personalize SDK
```bash
✅ npm install @contentstack/personalize-edge-sdk
```

### 2. Created Personalize Service
**File:** `lib/contentstackPersonalize.ts`
- ✅ Initializes Personalize SDK with user attributes
- ✅ Fetches entries with variants applied
- ✅ Handles error fallbacks

### 3. Updated Main Contentstack Service
**File:** `lib/contentstack.ts`
- ✅ Integrated Personalize SDK for variant support
- ✅ Falls back to standard API if Personalize not configured
- ✅ Backward compatible

---

## 🔧 What YOU Need to Do:

### Step 1: Get Personalize Project UID

**Go to Contentstack:**
1. Navigate to **Personalize** (left sidebar)
2. Click **Settings** (or Project Settings)
3. Find **Project UID**
4. Copy the value (looks like: `blt...` or similar)

**If you don't see Personalize:**
- It might not be enabled for your stack
- Contact Contentstack support to enable it
- Or check if it's under a different menu

---

### Step 2: Add to Environment Variables

**Update your `.env.local` file:**

```bash
# Add this line (I've already added it to env.local template):
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=bltXXXXXXXXXXXXXXXX
```

**Replace `bltXXXXXXXXXXXXXXXX` with your actual Project UID from Step 1**

---

### Step 3: Configure Personalize Audience (In Contentstack UI)

**You need to set up audiences matching your user segments:**

#### Go to: Personalize → Audiences

**Create 3 Audiences:**

**Audience 1: Rookie Learners**
- Name: `Rookie Learners`
- UID: `rookie_learners`
- Attribute Rules:
  ```json
  {
    "segment": "rookie"
  }
  ```

**Audience 2: At-Risk Learners**
- Name: `At-Risk Learners`
- UID: `at_risk_learners`
- Attribute Rules:
  ```json
  {
    "segment": "at_risk"
  }
  ```

**Audience 3: High-Flyer Learners**
- Name: `High-Flyer Learners`
- UID: `high_flyer_learners`
- Attribute Rules:
  ```json
  {
    "segment": "high_flyer"
  }
  ```

---

### Step 4: Link Variants to Audiences (In Contentstack UI)

**This is the crucial step!**

#### Go to: Settings → Variants → Variant Groups → "Learner Level Variants"

**For EACH variant, set the audience:**

**Variant 1: rookie_version**
- Linked Audience: `Rookie Learners`

**Variant 2: at_risk_version**
- Linked Audience: `At-Risk Learners`

**Variant 3: high_flyer_version**
- Linked Audience: `High-Flyer Learners`

**This tells Contentstack: "When user has segment=rookie, show rookie_version"**

---

### Step 5: Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Restart to pick up new env variable
npm run dev
```

---

## 🧪 Testing:

### Test 1: Check Personalize Initialization

**Browser console should show:**
```
🎭 Using Personalize SDK to fetch modules with variants
✅ Personalize SDK initialized with attributes: { segment: 'ROOKIE', team: 'Launch' }
```

**If you see:**
```
⚠️ Personalize SDK not configured
📦 Using standard Delivery API (variants not supported)
```
**Then:** Project UID is missing or wrong

---

### Test 2: Verify Variant Delivery

**Login as ROOKIE:**
```
Expected logs:
✅ Personalize SDK initialized with attributes: { segment: 'ROOKIE', team: 'Launch' }
✅ Personalized 5 entries
📦 Processing module: Introduction to Contentstack Launch...
✅ Extracted content: [rookie content here...]
```

**Become HIGH_FLYER:**
```
Expected logs:
✅ Personalize SDK initialized with attributes: { segment: 'HIGH_FLYER', team: 'Launch' }
✅ Personalized 5 entries
📦 Processing module: Introduction to Contentstack Launch...
✅ Extracted content: [high_flyer content here...]
```

---

## 🎯 How It Works:

### The Flow:
```
1. User logs in (ROOKIE, Launch team)
   ↓
2. App calls getCsModules('Launch', 'ROOKIE')
   ↓
3. Personalize SDK initializes with:
   {
     segment: 'rookie',
     team: 'Launch'
   }
   ↓
4. Fetch entries from Contentstack
   ↓
5. Personalize SDK checks each entry:
   - Has variants? YES
   - User segment: 'rookie'
   - Match to audience: 'Rookie Learners'
   - Apply variant: 'rookie_version'
   ↓
6. Entry returned with rookie_version content ✅
```

---

## 📋 Checklist:

### In Contentstack UI:
- [ ] Get Personalize Project UID from Settings
- [ ] Create 3 audiences (rookie, at_risk, high_flyer)
- [ ] Link each variant to its audience
- [ ] Verify entry has all 3 variants filled
- [ ] Entry is Published to `dev`

### In Code:
- [x] Personalize SDK installed
- [x] Personalize service created (`lib/contentstackPersonalize.ts`)
- [x] Main service updated to use Personalize
- [ ] Add Project UID to `.env.local`
- [ ] Restart dev server

---

## 🚨 Important Notes:

### Variant UIDs vs Audience Matching:

**The variant ID you mentioned (`cs339eb8eb9100124a`) is the ENTRY UID, not variant UID.**

**Variant UIDs should be:**
- `rookie_version`
- `at_risk_version`
- `high_flyer_version`

**Make sure these match in:**
1. Variant Group setup (Settings → Variants)
2. App code (`getVariantForSegment` function)
3. Audience rules (segment attribute)

---

## 🎯 What I Need From You:

### Step 1: Get Project UID
Go to Contentstack → Personalize → Settings → Copy Project UID

### Step 2: Add to .env.local
```bash
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=your_project_uid_here
```

### Step 3: Set Up Audiences
Create 3 audiences with segment attribute rules

### Step 4: Link Variants
Link each variant to its audience in Variant Group settings

### Step 5: Test
Restart server and check console logs

---

## 📞 If You Get Stuck:

**Common Issues:**

1. **Can't find Personalize menu:**
   - Feature might not be enabled for your stack
   - Contact Contentstack support
   - Alternative: Use separate fields approach

2. **Can't find Project UID:**
   - Personalize might not be set up yet
   - Need to create a Personalize project first
   - Check Contentstack docs

3. **Variants still not working:**
   - Check console logs
   - Share error messages
   - Verify audience rules match user attributes

---

## 🎯 Next Steps:

1. **Find Personalize Project UID** in Contentstack
2. **Add to .env.local**
3. **Create audiences**
4. **Link variants to audiences**
5. **Restart server**
6. **Test!**

---

**Let me know if you can find the Personalize Project UID, or if Personalize isn't enabled in your stack!** 🚀

If Personalize isn't available, we can implement the **separate fields** approach instead (which is simpler and doesn't require Personalize).

