# ✅ Taxonomy Fields - ACTUAL STATE

## 📋 Confirmed Field Mapping

### **qa_training_module**
- ✅ `skill_level_taxonomy` → References: `skill_level` taxonomy
- ✅ `segment_taxonomy` → References: `learner_segment` taxonomy

### **qa_sop**
- ✅ `sop_category` → References: ❓ (which taxonomy? `content_category`?)

### **qa_tool**
- ✅ `tool_category` → References: ❓ (which taxonomy? `content_category`?)

---

## 🤔 CLARIFICATION NEEDED

### Question 1: Field Type
When you say "sop_category" and "tool_category" - are these:
- **A) Taxonomy fields** (Field Type: Taxonomy)?
- **B) Plain text fields** (Field Type: Text)?

### Question 2: What Do They Reference?
If they ARE taxonomy fields, which taxonomy do they reference?
- `content_category` taxonomy?
- A different taxonomy?

### Question 3: Missing Fields
I notice these are missing:
- **No `team_taxonomy` in any content type** (for Launch, DAM, etc.)
- **No `category_taxonomy` in modules** (for product_knowledge, testing_strategy, etc.)

Is this intentional? Or should we add them?

---

## 💡 SIMPLIFIED MIGRATION PLAN

Based on what exists, here's the actual work needed:

### **Content Type: qa_training_module**

**Fields to populate:**
1. `skill_level_taxonomy` → Map from current `difficulty` field
2. `segment_taxonomy` → Map from current `target_segments` JSON

**Mapping Logic:**
```javascript
// For module "mod-launch-001"
{
  difficulty: "beginner",              // Current field (text)
  target_segments: '["ROOKIE"]',       // Current field (JSON)
  
  // Taxonomy fields to populate:
  skill_level_taxonomy: ["beginner"],  // From skill_level taxonomy
  segment_taxonomy: ["rookie"]         // From learner_segment taxonomy
}
```

**Question:** What about team and category?
- Module has `target_teams: '["Launch"]'` → No taxonomy field for this?
- Module has `category: "Product Knowledge"` → No taxonomy field for this?

---

### **Content Type: qa_sop**

**Field to populate:**
1. `sop_category` → Map from... what?

**Current SOP structure:**
```json
{
  "title": "Bug Reporting Guidelines",
  "criticality": "critical",
  "target_segments": '["ROOKIE", "AT_RISK", "HIGH_FLYER"]',
  "target_teams": '["Launch", "DAM", ...]'
}
```

**Questions:**
- What should `sop_category` values be?
  - Testing strategy? Best practices? Product knowledge?
- Is this based on the SOP content/purpose?
- Should I map from `criticality` field instead?

---

### **Content Type: qa_tool**

**Field to populate:**
1. `tool_category` → Map from current `category` field?

**Current Tool structure:**
```json
{
  "title": "Postman",
  "category": "API Testing",           // Current field (text)
  "target_segments": '["ROOKIE", "AT_RISK", "HIGH_FLYER"]'
}
```

**Mapping Logic:**
```javascript
// For tool "Postman"
{
  category: "API Testing",            // Current field
  
  // Taxonomy field to populate:
  tool_category: ["api_testing"]      // From content_category taxonomy?
}
```

---

## 🎯 WHAT I NEED FROM YOU

### **Clarification 1: Field Types**
Are `sop_category` and `tool_category`:
- **Taxonomy fields** (can select from pre-defined terms)?
- **Text fields** (free text)?

### **Clarification 2: Taxonomy Linkage**
If they are taxonomy fields, click on them in UI and tell me:
- "References: _______ taxonomy"

### **Clarification 3: Missing Fields**
Do you want to add these missing taxonomy fields?
- `team_taxonomy` (for Launch, DAM, Visual Builder, etc.)
- `category_taxonomy` in modules (for product_knowledge, testing_strategy, etc.)

Or is the current field setup intentional and minimal?

### **Clarification 4: Migration Scope**
Which option do you prefer?

**Option A: Minimal Migration (What Exists Now)**
- Only populate the 4 fields that exist:
  - qa_training_module: skill_level_taxonomy, segment_taxonomy
  - qa_sop: sop_category
  - qa_tool: tool_category
- Keep JSON string fields as-is for teams
- **Time:** 30 minutes

**Option B: Add Missing Fields + Full Migration**
- Add team_taxonomy to all content types
- Add category_taxonomy to modules
- Populate all taxonomy fields
- Deprecate JSON strings
- **Time:** 2-3 hours (including UI work)

**Option C: Do Nothing**
- Keep current approach (JSON strings)
- Leave taxonomy fields empty
- **Time:** 0 minutes

---

## 🔍 DECISION TREE

```
Do sop_category and tool_category reference taxonomies?
│
├─ YES → Which taxonomies? content_category?
│   │
│   └─ Are you okay with minimal setup (only 4 fields)?
│       │
│       ├─ YES → I'll create MCP prompt for minimal tagging
│       │        (30 min work)
│       │
│       └─ NO → Add team_taxonomy fields first?
│                (2-3 hours work)
│
└─ NO → They're text fields, not taxonomy
    │
    └─ Do you want to change them to taxonomy fields?
        │
        ├─ YES → Manual UI work to change field type
        │
        └─ NO → Skip taxonomy migration
```

---

## 📝 NEXT STEPS

**Please answer these:**

1. **Click on `sop_category` field** in qa_sop content type:
   - Is it Field Type: **Taxonomy** or **Text**?
   - If Taxonomy: "References: _______ taxonomy"

2. **Click on `tool_category` field** in qa_tool content type:
   - Is it Field Type: **Taxonomy** or **Text**?
   - If Taxonomy: "References: _______ taxonomy"

3. **Are you okay with minimal setup?**
   - Just populate the 4 existing fields
   - Keep teams/categories as JSON strings
   - OR: Add more taxonomy fields first?

4. **Which option: A, B, or C?**

Once you clarify, I can either:
- Create MCP prompts to tag entries (if taxonomy fields confirmed)
- Create plan to add missing fields (if you want full setup)
- Do nothing (if you prefer current approach)

**What do you see when you click on those fields?** 🔍

