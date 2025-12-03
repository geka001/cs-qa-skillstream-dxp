# 📋 Manual Guide: Add Taxonomy Fields to Content Types

## ✅ STEP 1: Verify Taxonomies Exist

First, let's check if all required taxonomies are created in your stack.

### Check in Contentstack UI:
1. Go to **Settings** → **Taxonomies**
2. Verify these 6 taxonomies exist:

#### Required Taxonomies:
- ✅ **skill_level** (with terms: beginner, intermediate, advanced)
- ✅ **learner_segment** (with terms: rookie, at_risk, high_flyer)
- ✅ **product_team** (with terms: launch, data_insights, visual_builder, autodraft, dam)
- ✅ **content_category** (hierarchical with multiple terms)
- ✅ **sop_category** (with 5 terms)
- ✅ **tool_category** (with 6 terms)

### If Any Taxonomy is Missing:
Run this command to create all taxonomies:
```bash
cd /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp
npm run cs:phase1
```

This will create all 6 taxonomies if they don't exist.

---

## 📝 STEP 2: Add Taxonomy Fields to Content Types

Now you'll manually add the taxonomy fields in Contentstack UI.

---

### 🎯 2A: Add team_taxonomy to qa_training_module

**Current Status:**
- ✅ Has: skill_level_taxonomy, segment_taxonomy
- ❌ Missing: team_taxonomy

**Steps:**
1. Go to **Content Models** → **qa_training_module**
2. Click **Edit** (pencil icon)
3. Scroll down in the field list
4. Click **+ Add Field** (or **New Field**)
5. Select **Taxonomy** from the field type list
6. Configure the field:
   ```
   Display Name: Team Taxonomy
   UID: team_taxonomy
   Help Text: Select which product team(s) this module applies to
   ```
7. Under **Select Taxonomy**, choose: **product_team**
8. Enable: **Allow Multiple** (toggle ON)
9. Keep: **Mandatory** (toggle OFF)
10. Click **Save**
11. Click **Save** on the content type

**Verification:**
- Go back to qa_training_module
- You should see `team_taxonomy` field in the field list

---

### 📋 2B: Add segment_taxonomy to qa_sop

**Current Status:**
- ✅ Has: sop_category
- ❌ Missing: segment_taxonomy, team_taxonomy

**Steps:**
1. Go to **Content Models** → **qa_sop**
2. Click **Edit**
3. Click **+ Add Field**
4. Select **Taxonomy**
5. Configure:
   ```
   Display Name: Segment Taxonomy
   UID: segment_taxonomy
   Help Text: Select which learner segment(s) this SOP applies to
   ```
6. Under **Select Taxonomy**, choose: **learner_segment**
7. Enable: **Allow Multiple** (toggle ON)
8. Keep: **Mandatory** (toggle OFF)
9. Click **Save**
10. **Don't close yet!** Continue to add team_taxonomy...

---

### 📋 2C: Add team_taxonomy to qa_sop

**Still in qa_sop content type:**

1. Click **+ Add Field** again
2. Select **Taxonomy**
3. Configure:
   ```
   Display Name: Team Taxonomy
   UID: team_taxonomy
   Help Text: Select which team(s) this SOP applies to
   ```
4. Under **Select Taxonomy**, choose: **product_team**
5. Enable: **Allow Multiple** (toggle ON)
6. Keep: **Mandatory** (toggle OFF)
7. Click **Save**
8. Click **Save** on the content type

**Verification:**
- qa_sop should now have 3 taxonomy fields:
  - ✅ sop_category
  - ✅ segment_taxonomy
  - ✅ team_taxonomy

---

### 🛠️ 2D: Add segment_taxonomy to qa_tool

**Current Status:**
- ✅ Has: tool_category
- ❌ Missing: segment_taxonomy, team_taxonomy

**Steps:**
1. Go to **Content Models** → **qa_tool**
2. Click **Edit**
3. Click **+ Add Field**
4. Select **Taxonomy**
5. Configure:
   ```
   Display Name: Segment Taxonomy
   UID: segment_taxonomy
   Help Text: Select which learner segment(s) can access this tool
   ```
6. Under **Select Taxonomy**, choose: **learner_segment**
7. Enable: **Allow Multiple** (toggle ON)
8. Keep: **Mandatory** (toggle OFF)
9. Click **Save**
10. **Don't close yet!** Continue to add team_taxonomy...

---

### 🛠️ 2E: Add team_taxonomy to qa_tool

**Still in qa_tool content type:**

1. Click **+ Add Field** again
2. Select **Taxonomy**
3. Configure:
   ```
   Display Name: Team Taxonomy
   UID: team_taxonomy
   Help Text: Select which team(s) use this tool
   ```
4. Under **Select Taxonomy**, choose: **product_team**
5. Enable: **Allow Multiple** (toggle ON)
6. Keep: **Mandatory** (toggle OFF)
7. Click **Save**
8. Click **Save** on the content type

**Verification:**
- qa_tool should now have 3 taxonomy fields:
  - ✅ tool_category
  - ✅ segment_taxonomy
  - ✅ team_taxonomy

---

## ✅ VERIFICATION CHECKLIST

After completing all steps, verify:

### qa_training_module (3 taxonomy fields)
- [ ] skill_level_taxonomy → References: skill_level
- [ ] segment_taxonomy → References: learner_segment
- [ ] team_taxonomy → References: product_team

### qa_sop (3 taxonomy fields)
- [ ] sop_category → References: sop_category
- [ ] segment_taxonomy → References: learner_segment
- [ ] team_taxonomy → References: product_team

### qa_tool (3 taxonomy fields)
- [ ] tool_category → References: tool_category
- [ ] segment_taxonomy → References: learner_segment
- [ ] team_taxonomy → References: product_team

---

## 🎯 VISUAL GUIDE

### What a Taxonomy Field Looks Like:

```
┌─────────────────────────────────────────┐
│ Field Type: Taxonomy                    │
│                                         │
│ Display Name: Team Taxonomy             │
│ UID: team_taxonomy                      │
│                                         │
│ Select Taxonomy: [product_team ▼]      │
│                                         │
│ ☑ Allow Multiple                        │
│ ☐ Mandatory                             │
│                                         │
│ Help Text:                              │
│ Select which team(s) this applies to    │
│                                         │
│           [Cancel]  [Save]              │
└─────────────────────────────────────────┘
```

---

## 🚨 COMMON ISSUES

### Issue 1: "Taxonomy not found in dropdown"
**Solution:** The taxonomy doesn't exist. Run `npm run cs:phase1` to create it.

### Issue 2: "Field UID already exists"
**Solution:** The field is already added. Skip this step.

### Issue 3: "Can't save content type"
**Solution:** 
- Check if UID is lowercase and uses underscores
- Ensure taxonomy reference is selected
- Try refreshing the page and retry

---

## ⏭️ WHAT'S NEXT?

After adding all fields:

### Phase 1 Complete! ✅

**Next: Phase 2 - Tag Entries**
I'll create a detailed guide for tagging all 49 entries with the new taxonomy fields.

**Let me know when you've added all the fields!** Then I'll create the Phase 2 tagging guide.

---

## 💡 TIPS

1. **Do one content type at a time** - Don't rush
2. **Double-check the taxonomy reference** - Make sure you select the correct taxonomy
3. **Enable "Allow Multiple"** - Most fields need to select multiple terms
4. **Keep "Mandatory" OFF** - Makes migration easier
5. **Save frequently** - Save after each field addition

---

## 📸 SCREENSHOT CHECKLIST

If you encounter issues, take screenshots of:
1. The taxonomy list (Settings → Taxonomies)
2. The field configuration form
3. Any error messages

Then I can help troubleshoot!

---

**Ready to start? Begin with qa_training_module → Add team_taxonomy!** 🚀

