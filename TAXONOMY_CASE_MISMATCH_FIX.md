# 🐛 Troubleshooting: App Using MockData Instead of Contentstack

## 🔍 Issues Identified:

1. ❌ Content coming from mockData, not Contentstack
2. ❌ Modules visible in app but not in Contentstack UI
3. ❌ User becomes HIGH_FLYER after 1 module (should be after onboarding)
4. ❌ SOP count not updating when viewed
5. ❌ App is slow

---

## 🎯 ROOT CAUSE

The issue is likely **taxonomy term case mismatch**:

### What's in Contentstack:
- Taxonomy terms: **Rookie**, **AT Risk**, **High flyer** (Title case from UI)

### What the app is looking for:
- Taxonomy terms: **rookie**, **at_risk**, **high_flyer** (lowercase)

**Result:** Filtering doesn't match, returns 0 modules, falls back to mockData!

---

## 🔧 FIX REQUIRED

We need to update the taxonomy terms in Contentstack to match what the code expects.

### Quick Test First:
Open browser console (F12) and check for these logs:
```
🔍 getCsModules called with: {userTeam: "Launch", userSegment: "ROOKIE"}
📦 Fetching modules from Contentstack...
📦 Received 20 raw module entries from Contentstack
📋 Module "Introduction to Contentstack Launch": teamMatch=false, segmentMatch=false
```

If you see `teamMatch=false` or `segmentMatch=false`, it confirms the case mismatch!

---

## ✅ SOLUTION OPTIONS

### Option A: Update Contentstack Taxonomy Terms (Recommended)
Change the taxonomy terms in Contentstack UI to lowercase:

**In Settings → Taxonomies → user_segment:**
- Change "Rookie" → "rookie"
- Change "AT Risk" → "at_risk"  
- Change "High flyer" → "high_flyer"

**In Settings → Taxonomies → product_team:**
- Change "Launch" → "launch"
- Change "Data & Insights" → "data_insights"
- Change "Visual Builder" → "visual_builder"
- Change "AutoDraft" → "autodraft"
- Change "DAM" → "dam"

**Then re-tag all entries with the lowercase terms.**

---

### Option B: Update App Code to Handle Case (Faster)
Update the `mapToTaxonomyTerm` function to handle the actual terms in Contentstack.

Let me implement Option B first to get you working quickly!

---

## 🚀 IMMEDIATE FIX

I'll update the code to handle the actual taxonomy terms you have in Contentstack.

**Stand by for code update...**

