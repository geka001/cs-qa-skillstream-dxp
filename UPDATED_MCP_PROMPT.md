# Updated MCP Prompt for Entry Creation

## ⚠️ IMPORTANT: Content Types Now Have Title Fields

All content types now have a **`title`** field as the first field. When creating entries, make sure to populate the `title` field:

---

## Updated Entry Creation Instructions for MCP

Please create entries for all content types with the following field mappings:

### 1. **quiz_item** entries:
```json
{
  "title": "Launch Personalization Question",  // ⭐ NEW: Brief descriptive title
  "quiz_id": "q1",
  "question": "What is the primary purpose of Contentstack Launch?",
  "answer_options": "[\"Content creation\", \"Experience optimization\", \"Asset management\", \"Workflow automation\"]",
  "correct_answer": 1,
  "explanation": "Launch is designed for experience optimization and personalization."
}
```

### 2. **manager_config** entries:
```json
{
  "title": "Sarah Johnson - Launch Team",  // ⭐ NEW: Manager name with team
  "team": "Launch",
  "manager_name": "Sarah Johnson",
  "manager_email": "sarah.johnson@contentstack.com"
}
```

### 3. **qa_tool** entries:
```json
{
  "title": "Jira",  // ⭐ NEW: Tool name (same as name field)
  "tool_id": "tool-001",
  "name": "Jira",
  "purpose": "Project management and issue tracking",
  "docs_link": "https://www.atlassian.com/software/jira/guides",
  "integrations": "[\"Confluence\", \"Slack\", \"GitHub\"]",
  "category": "Project Management",
  "target_segments": "[\"ROOKIE\", \"AT_RISK\", \"HIGH_FLYER\"]",
  "target_teams": "[]",
  "is_generic": true
}
```

### 4. **qa_sop** entries:
```json
{
  "title": "Production Bug Escalation Process",  // ⭐ Already correct
  "sop_id": "sop-001",
  "criticality": "critical",
  "mandatory": true,
  "steps": "[\"Verify bug exists\", \"Assess severity\", \"Create ticket\", ...]",
  "related_tools": "[\"tool-001\", \"tool-003\"]",
  "target_segments": "[\"ROOKIE\", \"AT_RISK\", \"HIGH_FLYER\"]",
  "target_teams": "[]"
}
```

### 5. **qa_training_module** entries:
```json
{
  "title": "Introduction to Contentstack Launch",  // ⭐ Already correct
  "module_id": "mod-launch-001",
  "category": "Product Knowledge",
  "difficulty": "beginner",
  "content": "<h2>Introduction...</h2>",
  "video_url": "https://www.youtube.com/embed/VIDEO_ID",
  "estimated_time": 30,
  "module_tags": "[\"launch\", \"personalization\"]",
  "mandatory": true,
  "order": 1,
  "target_segments": "[\"ROOKIE\"]",
  "target_teams": "[\"Launch\"]",
  "prerequisites": "[]",
  "quiz_items": "[\"q1\", \"q2\"]"
}
```

---

## 🔑 Key Changes for MCP:

### All Content Types Now Have:
1. **`title`** field (first field, marked as default/title field)
2. This ensures entries show with proper names instead of "Untitled"

### Field Mapping Summary:
| Content Type | Title Field Should Contain |
|--------------|---------------------------|
| `quiz_item` | Brief question summary (e.g., "Launch Personalization Question") |
| `manager_config` | "Manager Name - Team" (e.g., "Sarah Johnson - Launch Team") |
| `qa_tool` | Tool name (e.g., "Jira", "Postman") |
| `qa_sop` | SOP name (e.g., "Production Bug Escalation Process") |
| `qa_training_module` | Module name (e.g., "Introduction to Contentstack Launch") |

---

## 📝 Complete MCP Prompt (Copy This)

```
I need to recreate entries for the SkillStream QA training platform. The content types have been updated with title fields.

Please DELETE all existing entries first, then create fresh entries with proper titles:

### 1. Manager Configs (5 entries):
- Launch: title="Sarah Johnson - Launch Team", manager_name="Sarah Johnson", manager_email="sarah.johnson@contentstack.com"
- Data & Insights: title="Mike Chen - Data & Insights Team", manager_name="Mike Chen", manager_email="mike.chen@contentstack.com"
- Visual Builder: title="Emily White - Visual Builder Team", manager_name="Emily White", manager_email="emily.white@contentstack.com"
- AutoDraft: title="David Green - AutoDraft Team", manager_name="David Green", manager_email="david.green@contentstack.com"
- DAM: title="Sarah Brown - DAM Team", manager_name="Sarah Brown", manager_email="sarah.brown@contentstack.com"

### 2. QA Tools (15 entries):
Create tool entries with title=tool name. For each tool:
- title field should match the name field
- Examples: title="Jira", title="Postman", title="Playwright"

### 3. QA SOPs (25 entries):
Create SOP entries where title is the procedure name:
- Examples: title="Production Bug Escalation Process", title="Sprint Testing Workflow"

### 4. Quiz Items (~150 entries):
Create quiz items with descriptive titles:
- Format: title="[Topic] Question #[N]"
- Examples: 
  - title="Launch Personalization Q1"
  - title="DAM Asset Management Q1"

### 5. Training Modules (60 entries):
Create module entries where title is the module name:
- Examples: 
  - title="Introduction to Contentstack Launch"
  - title="Testing Personalization Rules"

**IMPORTANT**: 
- ALL entries must have the `title` field populated
- Publish all entries to the 'dev' environment after creation
- Use proper JSON formatting for array fields
```

---

## ✅ What to Do Now

### Step 1: Delete Existing Content in Contentstack
In Contentstack UI:
1. Go to each content type (qa_tool, qa_sop, manager_config, quiz_item)
2. Select all entries
3. Bulk delete

### Step 2: Delete and Recreate Content Types
```bash
# Delete content types in Contentstack UI first, then:
npm run cs:phase1
```

### Step 3: Give Updated Prompt to MCP
Use the prompt above to recreate all entries with proper titles.

---

## 🔄 Alternative: Quick Fix Without Deleting

If you don't want to delete everything, you can:
1. Manually edit each entry in Contentstack UI
2. Add a title value to the existing entries
3. But this will take longer than recreating

---

**Ready to proceed?** Delete the existing content types and run `npm run cs:phase1` again, then give the updated prompt to MCP! 🚀

