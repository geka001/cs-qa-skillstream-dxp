# 🤖 MCP Bulk Tagging Instructions - Option A (Minimal Migration)

## 📋 Overview

Tag all entries with taxonomy terms to improve Contentstack UI organization.
**NO app code changes needed** - this is purely for content management.

---

## 🎯 PART 1: Tag Training Modules (20 entries)

### Instructions for MCP:

```
I need you to bulk tag all entries in the `qa_training_module` content type with taxonomy terms.

For EACH entry in qa_training_module:

1. Fetch the entry
2. Read its current `difficulty` and `target_segments` fields
3. Map to taxonomy terms:
   - difficulty → skill_level_taxonomy
   - target_segments → segment_taxonomy
4. Update the entry with taxonomy terms
5. Publish the entry to the `dev` environment

### Mapping Rules:

**difficulty → skill_level_taxonomy:**
- "beginner" → ["beginner"]
- "intermediate" → ["intermediate"]
- "advanced" → ["advanced"]

**target_segments → segment_taxonomy:**
- '["ROOKIE"]' → ["rookie"]
- '["AT_RISK"]' → ["at_risk"]
- '["HIGH_FLYER"]' → ["high_flyer"]
- '["ROOKIE", "HIGH_FLYER"]' → ["rookie", "high_flyer"]
- '["ROOKIE", "AT_RISK", "HIGH_FLYER"]' → ["rookie", "at_risk", "high_flyer"]

### Example:

If entry has:
- difficulty: "beginner"
- target_segments: '["ROOKIE"]'

Then update it with:
- skill_level_taxonomy: ["beginner"]
- segment_taxonomy: ["rookie"]

### Important:
- Use the Update Entry API, not create
- Set taxonomy fields using term UIDs (beginner, rookie, etc.)
- Publish after updating
- Process all 20 entries
```

---

## 🎯 PART 2: Tag SOPs (7 entries)

### Instructions for MCP:

```
I need you to tag all entries in the `qa_sop` content type with the `sop_category` taxonomy.

For EACH SOP entry, use this mapping based on the title:

1. **"Test Case Documentation Standard"** (sop-001)
   - sop_category: ["documentation", "testing_workflow"]

2. **"Bug Reporting Guidelines"** (sop-002)
   - sop_category: ["bug_management", "documentation"]

3. **"Code Review Checklist for QA"** (sop-003)
   - sop_category: ["documentation"]

4. **"Performance Testing Protocol"** (sop-004)
   - sop_category: ["testing_workflow"]

5. **"Environment Setup Guide"** (sop-005)
   - sop_category: ["environment_setup"]

6. **"Sprint Planning Participation"** (sop-006)
   - sop_category: ["communication"]

7. **"Test Environment Maintenance"** (sop-007)
   - sop_category: ["environment_setup", "testing_workflow"]

### Process:
1. Fetch the SOP entry by title
2. Update its `sop_category` field with the appropriate taxonomy terms
3. Publish to `dev` environment

### Available taxonomy terms in `sop_category`:
- bug_management
- testing_workflow
- environment_setup
- documentation
- communication
```

---

## 🎯 PART 3: Tag Tools (15 entries)

### Instructions for MCP:

```
I need you to tag all entries in the `qa_tool` content type with the `tool_category` taxonomy.

For EACH tool entry, map its `category` field to `tool_category` taxonomy:

### Mapping by Tool Name:

1. **Jira** → tool_category: ["project_management"]
2. **Confluence** → tool_category: ["communication"]
3. **Postman** → tool_category: ["api_testing"]
4. **Selenium** → tool_category: ["automation_framework"]
5. **JMeter** → tool_category: ["performance_testing"]
6. **BrowserStack** → tool_category: ["browser_testing"]
7. **Slack** → tool_category: ["communication"]
8. **Git** → tool_category: ["communication"]
9. **Playwright** → tool_category: ["automation_framework"]
10. **REST Assured** → tool_category: ["api_testing"]
11. **GoCD** → tool_category: ["automation_framework"]
12. **Jenkins** → tool_category: ["automation_framework"]
13. **Cypress** → tool_category: ["automation_framework"]
14. **GraphQL Playground** → tool_category: ["api_testing"]
15. **TestRail** (if exists) → tool_category: ["project_management"]

### General Mapping Rules (if tool name differs):
- Category contains "API Testing" → ["api_testing"]
- Category contains "Automation" → ["automation_framework"]
- Category contains "Performance" → ["performance_testing"]
- Category contains "Project Management" → ["project_management"]
- Category contains "Communication" → ["communication"]
- Category contains "Browser" or "Cross-browser" → ["browser_testing"]

### Process:
1. Fetch all tool entries
2. For each tool, update `tool_category` based on tool name or category
3. Publish to `dev` environment

### Available taxonomy terms in `tool_category`:
- project_management
- api_testing
- automation_framework
- communication
- performance_testing
- browser_testing
```

---

## 📊 VERIFICATION CHECKLIST

After MCP completes, verify:

### Check 1: Module Entries
```bash
cd /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp
node scripts/check-taxonomy-fields.js
```

Expected output:
```json
{
  "skill_level_taxonomy": ["beginner"],
  "segment_taxonomy": ["rookie"],
  "taxonomies": ["skill_level", "learner_segment"]
}
```

### Check 2: SOP Entries
Manually check 1-2 SOP entries in Contentstack UI:
- ✅ sop_category field should have selected terms
- ✅ Should see taxonomy badges/tags

### Check 3: Tool Entries
Manually check 1-2 Tool entries in Contentstack UI:
- ✅ tool_category field should have selected terms
- ✅ Should see taxonomy badges/tags

---

## 🎯 SUCCESS CRITERIA

After completion, you should be able to:

### In Contentstack UI:
1. **Browse by Taxonomy**
   - Filter modules by skill level (beginner/intermediate/advanced)
   - Filter modules by segment (rookie/at_risk/high_flyer)
   - Filter SOPs by category (bug_management, documentation, etc.)
   - Filter tools by category (api_testing, automation_framework, etc.)

2. **Better Organization**
   - See taxonomy tags on entry cards
   - Use taxonomy facets for search
   - Hierarchical content browsing

3. **Content Management**
   - Easier to find related content
   - Bulk operations by taxonomy
   - Better reporting

### In Your App:
- ✅ **Everything works exactly as before**
- ✅ No changes needed
- ✅ No testing needed
- ✅ JSON string filtering still works

---

## 📝 STEP-BY-STEP EXECUTION

### Step 1: Give MCP Part 1 Instructions
Copy the "PART 1: Tag Training Modules" section to MCP and wait for completion.

### Step 2: Verify Modules
Run the verification script to check if modules are tagged.

### Step 3: Give MCP Part 2 Instructions
Copy the "PART 2: Tag SOPs" section to MCP and wait for completion.

### Step 4: Give MCP Part 3 Instructions
Copy the "PART 3: Tag Tools" section to MCP and wait for completion.

### Step 5: Final Verification
Check a few entries in Contentstack UI to confirm taxonomy tags are visible.

---

## 🚨 IMPORTANT NOTES

1. **No App Changes**: This is purely for Contentstack UI organization
2. **Backward Compatible**: Old fields (target_segments, difficulty) remain unchanged
3. **Non-Breaking**: App continues to use JSON string filtering
4. **Reversible**: Can remove taxonomy tags if needed
5. **Safe**: All entries are published, so no draft issues

---

## ⏭️ AFTER COMPLETION

Once all entries are tagged, you can decide:

### Option 1: Keep As-Is (Recommended)
- Enjoy better Contentstack UI
- App works exactly as before
- No further action needed

### Option 2: Upgrade to Full Migration Later
- Update app code to use taxonomy fields
- Remove JSON string parsing
- Cleaner codebase
- Can do this anytime in the future

---

## 🎉 READY TO START?

**Copy the PART 1 instructions above and give them to the Contentstack MCP!**

Let me know when Part 1 is complete, and I'll help verify before moving to Part 2 and Part 3.

**Start with Part 1 (Training Modules) now!** 🚀

