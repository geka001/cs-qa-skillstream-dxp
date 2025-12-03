# 🎯 Complete Taxonomy Setup - Updated Guide

## 📊 CURRENT STATUS

### ✅ Taxonomies You Have (5):
1. ✅ **skill_level** (beginner, intermediate, advanced)
2. ✅ **content_category** (hierarchical)
3. ✅ **sop_category** (5 terms)
4. ✅ **tool_category** (6 terms)
5. ✅ **user_segment** (Rookie, AT Risk, High flyer) ← We'll use this!

### ❌ Missing (1):
6. ❌ **product_team** (Launch, Data & Insights, Visual Builder, AutoDraft, DAM)

---

## 🚀 STEP 1: Create product_team Taxonomy

### Option A: Run Script (Recommended)
```bash
npm run taxonomy:create-product-team
```

**This will:**
- ✅ Create `product_team` taxonomy
- ✅ Add 5 team terms (launch, data_insights, visual_builder, autodraft, dam)
- ⚠️ Skip if already exists

**Time:** 30 seconds

---

### Option B: Manual Creation (If script fails)

1. Go to **Settings** → **Taxonomies**
2. Click **+ New Taxonomy**
3. Configure:
   ```
   Name: Product Team
   UID: product_team
   Description: Contentstack product teams
   ```
4. Click **Save**
5. Add 5 terms:
   - **Launch** (UID: launch)
   - **Data & Insights** (UID: data_insights)
   - **Visual Builder** (UID: visual_builder)
   - **AutoDraft** (UID: autodraft)
   - **DAM** (UID: dam)

---

## 📝 STEP 2: Add Taxonomy Fields to Content Types

### Important Note on Naming:
- ✅ Use **`user_segment`** instead of `learner_segment` (we'll reference your existing taxonomy)
- ✅ Create **`product_team`** fields (new taxonomy you just created)

---

### 🎯 2A: Add team_taxonomy to qa_training_module

1. Go to **Content Models** → **qa_training_module** → **Edit**
2. Click **+ Add Field** → Select **Taxonomy**
3. Configure:
   ```
   Display Name: Team Taxonomy
   UID: team_taxonomy
   Select Taxonomy: product_team  ← The new taxonomy!
   Allow Multiple: ✅ ON
   Mandatory: ❌ OFF
   ```
4. Click **Save**

---

### 📋 2B: Add segment_taxonomy to qa_sop

1. Go to **Content Models** → **qa_sop** → **Edit**
2. Click **+ Add Field** → Select **Taxonomy**
3. Configure:
   ```
   Display Name: Segment Taxonomy
   UID: segment_taxonomy
   Select Taxonomy: user_segment  ← Your existing taxonomy!
   Allow Multiple: ✅ ON
   Mandatory: ❌ OFF
   ```
4. Click **Save** (don't close yet, continue to next field...)

---

### 📋 2C: Add team_taxonomy to qa_sop

**Still in qa_sop:**

1. Click **+ Add Field** → Select **Taxonomy**
2. Configure:
   ```
   Display Name: Team Taxonomy
   UID: team_taxonomy
   Select Taxonomy: product_team  ← The new taxonomy!
   Allow Multiple: ✅ ON
   Mandatory: ❌ OFF
   ```
3. Click **Save**
4. Click **Save** on the content type

---

### 🛠️ 2D: Add segment_taxonomy to qa_tool

1. Go to **Content Models** → **qa_tool** → **Edit**
2. Click **+ Add Field** → Select **Taxonomy**
3. Configure:
   ```
   Display Name: Segment Taxonomy
   UID: segment_taxonomy
   Select Taxonomy: user_segment  ← Your existing taxonomy!
   Allow Multiple: ✅ ON
   Mandatory: ❌ OFF
   ```
4. Click **Save** (don't close yet...)

---

### 🛠️ 2E: Add team_taxonomy to qa_tool

**Still in qa_tool:**

1. Click **+ Add Field** → Select **Taxonomy**
2. Configure:
   ```
   Display Name: Team Taxonomy
   UID: team_taxonomy
   Select Taxonomy: product_team  ← The new taxonomy!
   Allow Multiple: ✅ ON
   Mandatory: ❌ OFF
   ```
3. Click **Save**
4. Click **Save** on the content type

---

## ✅ FINAL VERIFICATION

### Check your taxonomies (Settings → Taxonomies):
- [ ] skill_level (3 terms)
- [ ] content_category (hierarchical)
- [ ] sop_category (5 terms)
- [ ] tool_category (6 terms)
- [ ] user_segment (3 terms: Rookie, AT Risk, High flyer)
- [ ] **product_team** (5 terms: Launch, Data & Insights, Visual Builder, AutoDraft, DAM)

### Check your content types:

**qa_training_module** (3 taxonomy fields):
- [ ] skill_level_taxonomy → References: skill_level
- [ ] segment_taxonomy → References: user_segment
- [ ] team_taxonomy → References: product_team

**qa_sop** (3 taxonomy fields):
- [ ] sop_category → References: sop_category
- [ ] segment_taxonomy → References: user_segment
- [ ] team_taxonomy → References: product_team

**qa_tool** (3 taxonomy fields):
- [ ] tool_category → References: tool_category
- [ ] segment_taxonomy → References: user_segment
- [ ] team_taxonomy → References: product_team

---

## 🎯 NEXT STEPS

Once all fields are added:

### ✅ Phase 1 Complete!

**Next: Phase 2 - Tag Entries**
I'll create a detailed tagging guide for all the new fields you just added.

**Let me know when:**
1. ✅ `product_team` taxonomy is created (run the script or create manually)
2. ✅ All 5 taxonomy fields are added to content types

Then I'll create the Phase 2 tagging guide! 🚀

---

## 📊 SUMMARY

**What you need to do:**
1. Run `npm run taxonomy:create-product-team` (30 seconds)
2. Add 5 taxonomy fields manually in UI (10 minutes)
3. Let me know when done → I'll create Phase 2 guide

**Total time:** ~15 minutes

**Then we move to Phase 3:** Update app code to use taxonomy fields! 💪

