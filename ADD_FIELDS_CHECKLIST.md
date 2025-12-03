# ✅ Manual Taxonomy Fields Checklist

## 📝 INSTRUCTIONS

For each field below:
1. Go to **Content Models** → **[Content Type]** → **Edit**
2. Click **+ Add Field**
3. Select **Taxonomy**
4. Fill in the details exactly as shown
5. Click **Save**
6. Mark checkbox ✅ when done

---

## 🎯 Content Type 1: qa_training_module

**Add 1 field:**

### ☐ Field 1: team_taxonomy
```
Display Name: Team Taxonomy
UID: team_taxonomy
Field Type: Taxonomy
Select Taxonomy: product_team
Allow Multiple: ✅ YES (toggle ON)
Mandatory: ❌ NO (toggle OFF)
Help Text: Select which product team(s) this module applies to
```

**Save the content type after adding the field!**

---

## 📋 Content Type 2: qa_sop

**Add 2 fields:**

### ☐ Field 1: segment_taxonomy
```
Display Name: Segment Taxonomy
UID: segment_taxonomy
Field Type: Taxonomy
Select Taxonomy: user_segment
Allow Multiple: ✅ YES (toggle ON)
Mandatory: ❌ NO (toggle OFF)
Help Text: Select which learner segment(s) this SOP applies to
```

### ☐ Field 2: team_taxonomy
```
Display Name: Team Taxonomy
UID: team_taxonomy
Field Type: Taxonomy
Select Taxonomy: product_team
Allow Multiple: ✅ YES (toggle ON)
Mandatory: ❌ NO (toggle OFF)
Help Text: Select which team(s) this SOP applies to
```

**Save the content type after adding both fields!**

---

## 🛠️ Content Type 3: qa_tool

**Add 2 fields:**

### ☐ Field 1: segment_taxonomy
```
Display Name: Segment Taxonomy
UID: segment_taxonomy
Field Type: Taxonomy
Select Taxonomy: user_segment
Allow Multiple: ✅ YES (toggle ON)
Mandatory: ❌ NO (toggle OFF)
Help Text: Select which learner segment(s) can access this tool
```

### ☐ Field 2: team_taxonomy
```
Display Name: Team Taxonomy
UID: team_taxonomy
Field Type: Taxonomy
Select Taxonomy: product_team
Allow Multiple: ✅ YES (toggle ON)
Mandatory: ❌ NO (toggle OFF)
Help Text: Select which team(s) use this tool
```

**Save the content type after adding both fields!**

---

## ✅ FINAL CHECKLIST

After adding all fields, verify:

### qa_training_module (should have 3 taxonomy fields total):
- [ ] skill_level_taxonomy (already exists)
- [ ] segment_taxonomy (already exists)
- [ ] team_taxonomy (YOU JUST ADDED)

### qa_sop (should have 3 taxonomy fields total):
- [ ] sop_category (already exists)
- [ ] segment_taxonomy (YOU JUST ADDED)
- [ ] team_taxonomy (YOU JUST ADDED)

### qa_tool (should have 3 taxonomy fields total):
- [ ] tool_category (already exists)
- [ ] segment_taxonomy (YOU JUST ADDED)
- [ ] team_taxonomy (YOU JUST ADDED)

---

## 🎯 SUMMARY

**Total fields to add: 5**

| Content Type | Field to Add | References Taxonomy | Status |
|--------------|-------------|---------------------|---------|
| qa_training_module | team_taxonomy | product_team | ☐ |
| qa_sop | segment_taxonomy | user_segment | ☐ |
| qa_sop | team_taxonomy | product_team | ☐ |
| qa_tool | segment_taxonomy | user_segment | ☐ |
| qa_tool | team_taxonomy | product_team | ☐ |

---

## 💡 TIPS

1. **UID must be exact:** `team_taxonomy` and `segment_taxonomy` (lowercase, underscore)
2. **Always select the correct taxonomy:**
   - `product_team` for team_taxonomy
   - `user_segment` for segment_taxonomy
3. **Enable "Allow Multiple"** for all fields
4. **Keep "Mandatory" OFF** for all fields
5. **Save after each field addition**

---

## ⚠️ COMMON MISTAKES TO AVOID

❌ **Wrong:** Taxonomy UID = `learner_segment` → Should be `user_segment`
❌ **Wrong:** Field UID = `teamTaxonomy` → Should be `team_taxonomy` (lowercase, underscore)
❌ **Wrong:** Allow Multiple = OFF → Should be ON
❌ **Wrong:** Forgetting to save the content type

---

## 🚀 WHEN DONE

Let me know when you've added all 5 fields, and I'll create the **Phase 2 Tagging Guide**!

**Time estimate: 10-15 minutes** ⏱️

