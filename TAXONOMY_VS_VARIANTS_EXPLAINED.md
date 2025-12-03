# 🏷️ Taxonomy vs Variants - Understanding the Relationship

## ❓ Your Question:
**"If we use variants, is there no use of taxonomy?"**

---

## ✅ Short Answer: **We NEED BOTH!**

Taxonomy and Variants serve **different purposes** and work **together**, not instead of each other.

---

## 🎯 What Each Does

### 1. Taxonomy (What You Have Now)
**Purpose:** Filter **WHICH** modules a user sees

**Example:**
```
User: Launch team, ROOKIE segment

Taxonomy filters:
├─ team_taxonomy: ["Launch"] ← Shows to Launch team
└─ segment_taxonomy: ["Rookie"] ← Shows to Rookie segment

Result: User sees "Introduction to Contentstack Launch" module
```

**Taxonomy answers:** "Should this user see this module at all?"

---

### 2. Variants (What We're Adding)
**Purpose:** Control **WHAT CONTENT** the user sees inside a module

**Example:**
```
Module: "Introduction to Contentstack Launch"
User: ROOKIE segment

Variant selection:
└─ Shows: rookie_version content

Module: "Introduction to Contentstack Launch" (SAME MODULE!)
User: HIGH_FLYER segment

Variant selection:
└─ Shows: high_flyer_version content
```

**Variants answer:** "What version of content should this user see?"

---

## 🎨 How They Work TOGETHER

### Current Setup (Taxonomy Only):
```
Separate Modules for Each Segment:

Module 1: "Test Planning - Rookie"
├─ team_taxonomy: ["Launch"]
├─ segment_taxonomy: ["Rookie"]
└─ content: "Basic test planning..."

Module 2: "Test Planning - AT Risk"
├─ team_taxonomy: ["Launch"]
├─ segment_taxonomy: ["AT Risk"]
└─ content: "Simplified test planning..."

Module 3: "Test Planning - High Flyer"
├─ team_taxonomy: ["Launch"]
├─ segment_taxonomy: ["High flyer"]
└─ content: "Advanced test planning..."

ROOKIE user sees: Module 1 only
AT_RISK user sees: Module 2 only
HIGH_FLYER user sees: Module 3 only
```

---

### With Variants (Taxonomy + Variants):
```
ONE Module with Variants:

Module: "Test Planning Fundamentals"
├─ team_taxonomy: ["Launch"] ← Taxonomy still filters by team!
├─ segment_taxonomy: ["Rookie", "AT Risk", "High flyer"] ← Shows to ALL segments
└─ content (variants):
    ├─ rookie_version: "Basic test planning..."
    ├─ at_risk_version: "Simplified test planning..."
    └─ high_flyer_version: "Advanced test planning..."

Step 1 (Taxonomy): Should user see this module?
├─ Check team_taxonomy: Launch? ✅ YES
└─ Check segment_taxonomy: Has user's segment? ✅ YES

Step 2 (Variants): Which version to show?
└─ User is ROOKIE → Show rookie_version content

Result: 
- ROOKIE sees: "Basic test planning..."
- AT_RISK sees: "Simplified test planning..."
- HIGH_FLYER sees: "Advanced test planning..."
```

---

## 📊 The Key Difference

### Taxonomy:
- **Filters entire entries**
- "Show or hide this module"
- **Boolean logic:** IN or OUT

### Variants:
- **Selects content within an entry**
- "Show this version of the module"
- **Choice logic:** Which version?

---

## 🎯 Why You STILL Need Taxonomy

### Use Case 1: Team-Specific Modules
```
Module: "Launch Deployment Best Practices"
├─ team_taxonomy: ["Launch"] ← ONLY Launch team sees this!
├─ segment_taxonomy: ["Rookie", "AT Risk", "High flyer"]
└─ content (variants): rookie_version, at_risk_version, high_flyer_version

Data & Insights team: DOESN'T see this module (filtered by taxonomy)
Launch team ROOKIE: DOES see this module, rookie_version content
Launch team HIGH_FLYER: DOES see this module, high_flyer_version content
```

---

### Use Case 2: Generic Modules (All Teams)
```
Module: "Test Planning Fundamentals"
├─ team_taxonomy: ["Launch", "Data & Insights", "Visual Builder", "AutoDraft", "DAM"]
├─ segment_taxonomy: ["Rookie", "AT Risk", "High flyer"]
└─ content (variants): rookie_version, at_risk_version, high_flyer_version

ALL teams see this module
But content varies by segment (rookie vs high-flyer)
```

---

### Use Case 3: Segment-Specific Modules
```
Module: "Performance Optimization Techniques"
├─ team_taxonomy: ["Launch", "Visual Builder"]
├─ segment_taxonomy: ["High flyer"] ← ONLY High-Flyers see this!
└─ content (variants): high_flyer_version only

ROOKIE users: DON'T see this module (filtered by taxonomy)
HIGH_FLYER users: DO see this module
```

---

## 🔍 Real Example with Your App

### Scenario: Launch Team User

**Without Variants (Current):**
```
ROOKIE user browses:
├─ Taxonomy filters to: Launch + Rookie modules
└─ Sees: 7 modules tagged with Launch + Rookie

AT_RISK user browses:
├─ Taxonomy filters to: Launch + AT_RISK modules
└─ Sees: 7 different modules tagged with Launch + AT_RISK

HIGH_FLYER user browses:
├─ Taxonomy filters to: Launch + High_Flyer modules
└─ Sees: 7 different modules tagged with Launch + High_Flyer

Total entries in Contentstack: 21 modules (7 × 3 segments)
```

---

**With Variants (Proposed):**
```
ROOKIE user browses:
├─ Taxonomy filters to: Launch modules with Rookie in segment_taxonomy
├─ Finds: 7 modules
└─ For each module, shows: rookie_version content

AT_RISK user browses:
├─ Taxonomy filters to: Launch modules with AT_RISK in segment_taxonomy
├─ Finds: 7 modules (SAME modules!)
└─ For each module, shows: at_risk_version content

HIGH_FLYER user browses:
├─ Taxonomy filters to: Launch modules with High_Flyer in segment_taxonomy
├─ Finds: 7 modules (SAME modules!)
└─ For each module, shows: high_flyer_version content

Total entries in Contentstack: 7 modules (with 3 variants each)
```

---

## 💡 The Magic: Two-Step Filtering

### Step 1: Taxonomy (Entry Level)
```javascript
// Filter which entries to show
const modules = allModules.filter(module => {
  const teamMatch = module.team_taxonomy.includes(user.team);
  const segmentMatch = module.segment_taxonomy.includes(user.segment);
  return teamMatch && segmentMatch;
});
```

### Step 2: Variants (Content Level)
```javascript
// Select which variant content to show
modules.forEach(module => {
  const variantKey = getVariantForSegment(user.segment);
  // "rookie_version", "at_risk_version", or "high_flyer_version"
  
  module.displayContent = module.content[variantKey];
});
```

---

## 🎯 Summary Table

| Feature | Purpose | Level | Example |
|---------|---------|-------|---------|
| **Taxonomy** | Filter entries | Entry-level | "Launch team sees this" |
| **Variants** | Select content | Field-level | "Rookies see basic version" |

---

## ✅ What You Need in Entries

### With Variants, Your Entries Should Have:

```json
{
  "title": "Test Planning Fundamentals",
  "module_id": "mod-001",
  
  // TAXONOMY (still needed!)
  "team_taxonomy": ["Launch", "DAM"], // Which teams?
  "segment_taxonomy": ["Rookie", "AT Risk", "High flyer"], // Which segments?
  
  // VARIANTS (new!)
  "content": {
    "rookie_version": "Basic test planning...",
    "at_risk_version": "Simplified test planning...",
    "high_flyer_version": "Advanced test planning..."
  },
  
  "category": "Testing Fundamentals",
  "mandatory": true
}
```

**Key point:** 
- `segment_taxonomy` = ["Rookie", "AT Risk", "High flyer"] ← Shows to ALL segments!
- Variants determine WHICH content each segment sees

---

## 🚨 Common Mistake to Avoid

### ❌ WRONG Approach:
```json
{
  "team_taxonomy": ["Launch"],
  "segment_taxonomy": ["Rookie"], // ← Only Rookie!
  "content": {
    "rookie_version": "...",
    "at_risk_version": "...", // ← AT_RISK users can't see this!
    "high_flyer_version": "..." // ← HIGH_FLYER users can't see this!
  }
}
```

**Problem:** Taxonomy filters out AT_RISK and HIGH_FLYER users, so they never see the module, even though variants exist!

---

### ✅ CORRECT Approach:
```json
{
  "team_taxonomy": ["Launch"],
  "segment_taxonomy": ["Rookie", "AT Risk", "High flyer"], // ← All segments!
  "content": {
    "rookie_version": "...",
    "at_risk_version": "...",
    "high_flyer_version": "..."
  }
}
```

**Result:** All segments see the module, but each sees their appropriate variant!

---

## 🎯 Final Answer to Your Question

### "If we use variants, is there no use of taxonomy?"

**NO! We ABSOLUTELY need taxonomy!**

**Taxonomy is used for:**
1. ✅ **Team filtering** - Launch vs DAM vs Visual Builder
2. ✅ **Entry-level decisions** - Should user see this module at all?
3. ✅ **Content organization** - Categorization, skill levels
4. ✅ **Prerequisites** - Advanced modules only for HIGH_FLYER

**Variants are used for:**
1. ✅ **Content versions** - Basic vs Advanced within same module
2. ✅ **Reduce duplication** - One module instead of three
3. ✅ **Content management** - Easier to update

**They work TOGETHER, not separately!**

---

## 📝 Quick Checklist for Variant Entries

When creating entries with variants, you MUST have:

- [ ] `team_taxonomy` - Which teams see this?
- [ ] `segment_taxonomy` - **Include ALL segments** that have variant content
- [ ] `content.rookie_version` - Content for rookies
- [ ] `content.at_risk_version` - Content for at-risk learners
- [ ] `content.high_flyer_version` - Content for high-flyers
- [ ] Other taxonomy fields (skill_level, category, etc.)

---

## 🎯 Bottom Line

**Variants:**
- Solve content duplication (60 → 20 entries)
- Make content management easier
- But DON'T replace taxonomy!

**Taxonomy:**
- Still needed for team filtering
- Still needed for showing/hiding modules
- Works WITH variants, not instead of them

**Together:**
- Taxonomy says: "Show this module to Launch ROOKIE users"
- Variants say: "Show them the rookie_version content"
- Perfect harmony! ✨

---

**Does this make sense?** 🤔

Taxonomy = **WHO** sees the module  
Variants = **WHAT** version they see

Both are essential! 🎯

