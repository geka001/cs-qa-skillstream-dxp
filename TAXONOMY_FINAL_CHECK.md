# ✅ Taxonomy Fields - CONFIRMED STRUCTURE

## 📋 Confirmed Fields (All are Taxonomy Type)

### **qa_training_module**
1. ✅ `skill_level_taxonomy` → References: `skill_level` taxonomy
2. ✅ `segment_taxonomy` → References: `learner_segment` taxonomy

### **qa_sop**
1. ✅ `sop_category` (Field Type: **Taxonomy** - dropdown) → References: ❓

### **qa_tool**
1. ✅ `tool_category` (Field Type: **Taxonomy** - dropdown) → References: ❓

---

## 🔍 LAST CLARIFICATION NEEDED

When you click on `sop_category` field in the qa_sop content type, you should see something like:

```
Field Label: SOP Category
Field Type: Taxonomy
Display Name: sop_category
References: [TAXONOMY NAME HERE]  ← What does this say?
```

### Please tell me:

**For `sop_category` in qa_sop:**
- References: _______ taxonomy

**For `tool_category` in qa_tool:**
- References: _______ taxonomy

**Most likely it's one of these:**
- `content_category` (our hierarchical taxonomy with product_knowledge, testing_strategy, automation, best_practices)
- `skill_level` (beginner, intermediate, advanced)
- Some other taxonomy name

---

## 🎯 WHY THIS MATTERS

Once I know which taxonomy each field references, I can create the correct mapping:

### Example 1: If both reference `content_category`:
```javascript
// For SOP: "Bug Reporting Guidelines"
sop_category: ["best_practices", "bug_management"]  // Hierarchical

// For Tool: "Postman"
tool_category: ["automation", "api_testing"]  // Hierarchical
```

### Example 2: If they reference different taxonomies:
```javascript
// SOP references 'content_category'
sop_category: ["best_practices"]

// Tool references something else
tool_category: ["beginner"]  // If it references skill_level
```

---

## 📋 Available Taxonomies

**Reminder of what taxonomies we created:**

1. **skill_level**
   - beginner
   - intermediate
   - advanced

2. **content_category** (hierarchical)
   - product_knowledge
     - launch
     - data_insights
     - visual_builder
     - autodraft
     - dam
   - testing_strategy
     - functional_testing
     - api_testing
     - performance_testing
     - accessibility_testing
   - automation
     - playwright
     - rest_assured
     - ci_cd
   - best_practices
     - bug_management
     - documentation
     - code_review

3. **learner_segment**
   - rookie
   - at_risk
   - high_flyer

4. **product_team**
   - launch
   - data_insights
   - visual_builder
   - autodraft
   - dam

---

## 🚀 ONCE YOU TELL ME

I'll immediately create:

1. **MCP Prompt for Bulk Tagging** (~40 entries)
   - Mapping from current fields to taxonomy terms
   - Bulk update all entries
   - Publish to dev environment

2. **App Code Updates** (if needed)
   - Update `lib/contentstack.ts` to use taxonomy fields
   - Replace JSON string parsing with taxonomy arrays
   - Test filtering logic

3. **Verification Script**
   - Check all entries are tagged correctly
   - Confirm app displays content properly

---

## ❓ FINAL QUESTION

**What does it say under "References" for:**
1. `sop_category` in qa_sop → References: _______
2. `tool_category` in qa_tool → References: _______

(Just the taxonomy name/UID is enough!)

Then we're ready to roll! 🎯

