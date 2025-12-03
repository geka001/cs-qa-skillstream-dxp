# 🚀 Quick Start: Enable Variants in 3 Steps

## ✅ What's Already Done:
- ✅ Personalize SDK installed
- ✅ Code updated
- ✅ Project UID added to `.env.local`

---

## 🎯 What You Need to Do (15 min):

### Step 1: Create 3 Audiences (5 min)

**Path:** Contentstack → **Personalize** → **Audiences** → **+ Create Audience**

Create these 3 audiences with exact attribute rules:

```
┌─────────────────────────────────────────────┐
│ Audience 1: Rookie Learners                │
├─────────────────────────────────────────────┤
│ Name: Rookie Learners                       │
│ Attribute Rule:                             │
│   • Attribute: segment                      │
│   • Condition: equals (or is)               │
│   • Value: rookie                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Audience 2: At-Risk Learners               │
├─────────────────────────────────────────────┤
│ Name: At-Risk Learners                      │
│ Attribute Rule:                             │
│   • Attribute: segment                      │
│   • Condition: equals (or is)               │
│   • Value: at_risk                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Audience 3: High-Flyer Learners            │
├─────────────────────────────────────────────┤
│ Name: High-Flyer Learners                   │
│ Attribute Rule:                             │
│   • Attribute: segment                      │
│   • Condition: equals (or is)               │
│   • Value: high_flyer                       │
└─────────────────────────────────────────────┘
```

**⚠️ CRITICAL:** 
- The attribute name MUST be: `segment` (lowercase)
- The values MUST be: `rookie`, `at_risk`, `high_flyer` (lowercase with underscore)

---

### Step 2: Link Variants to Audiences (5 min)

**Path:** Contentstack → **Settings** → **Variants** → **Learner Level Variants** (your variant group)

Link each variant to its audience:

```
┌─────────────────────────────────────────────┐
│ Variant: rookie_version                     │
│ → Link to: Rookie Learners ✅              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Variant: at_risk_version                    │
│ → Link to: At-Risk Learners ✅             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Variant: high_flyer_version                 │
│ → Link to: High-Flyer Learners ✅          │
└─────────────────────────────────────────────┘
```

**How to link:**
1. Click **Edit** on each variant
2. Look for **"Target Audience"** or **"Linked Audience"** dropdown
3. Select the matching audience
4. Save

---

### Step 3: Verify & Restart (5 min)

**A. Verify Entry Content:**
- Go to: **Content** → **qa_training_module** → **Introduction to Contentstack Launch**
- Check all 3 variants have content
- Entry must be **Published** to `dev` environment

**B. Restart Dev Server:**
```bash
# In terminal, stop server (Ctrl+C), then:
npm run dev
```

**C. Check Browser Console:**
Should see:
```
🎭 Using Personalize SDK to fetch modules with variants
✅ Personalize SDK initialized with attributes: { segment: 'ROOKIE', team: 'Launch' }
```

---

## 🧪 Test It:

### Login as Rookie (Launch Team):
- Name: `Test User`
- Team: `Launch`

**Expected in module viewer:**
- Should show **rookie_version** content (basic introduction)

### Complete onboarding → Become High-Flyer:
**Expected:**
- Should show **high_flyer_version** content (advanced concepts)

### Fail a quiz → Become At-Risk:
**Expected:**
- Should show **at_risk_version** content (step-by-step guide)

---

## ⚠️ Common Issues:

### Issue 1: Still seeing mockData
**Causes:**
- Audiences not created
- Variants not linked to audiences
- Entry not published

**Fix:**
- Complete Steps 1 & 2 above
- Publish entry to `dev`
- Hard refresh browser (Cmd+Shift+R)

### Issue 2: Console shows "Personalize SDK not configured"
**Causes:**
- `.env.local` not updated
- Server not restarted

**Fix:**
```bash
# Check .env.local has:
cat .env.local | grep PERSONALIZE
# Should show: NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=68a6ec844875734317267dcf

# Restart server:
npm run dev
```

### Issue 3: Wrong variant showing
**Causes:**
- Attribute rules incorrect
- Variant not linked to correct audience

**Fix:**
- Verify attribute name is `segment` (lowercase)
- Verify values are `rookie`, `at_risk`, `high_flyer` (lowercase)
- Check variant → audience linking

---

## 📊 How to Verify It's Working:

### Browser Console Logs:
```
✅ WORKING:
🎭 Using Personalize SDK to fetch modules with variants
✅ Personalize SDK initialized with attributes: { segment: 'ROOKIE', team: 'Launch' }
✅ Personalized 5 entries

❌ NOT WORKING:
⚠️ Personalize SDK not configured
📦 Using standard Delivery API (variants not supported)
```

### In App:
- Rookie user sees simpler content
- High-Flyer user sees advanced content
- At-Risk user sees remedial content

---

## 🎯 Summary:

1. **Create 3 audiences** (segment = rookie/at_risk/high_flyer)
2. **Link variants** (rookie_version → Rookie Learners, etc.)
3. **Restart server** (`npm run dev`)
4. **Test in browser**

**Total time: 15 minutes** ⏱️

---

**Need help? Share:**
- Screenshot of Personalize → Audiences page
- Screenshot of Settings → Variants page
- Console logs from browser

**Let's get those variants working! 🚀**

