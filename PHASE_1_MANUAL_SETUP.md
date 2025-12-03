# Phase 1: Manual Content Type Setup in Contentstack UI

## 📋 Overview
You need to manually create 5 content types in the Contentstack UI before the MCP can create entries.

---

## 🏗️ Content Type 1: `qa_training_module`

### Basic Settings:
- **Display Name**: QA Training Module
- **UID**: `qa_training_module`
- **Description**: Training modules with video, content, and quizzes for QA onboarding

### Fields to Add:

#### 1. Title (Single Line Textbox)
- Display Name: `Title`
- UID: `title`
- Mandatory: ✅ Yes
- Unique: ❌ No
- Help Text: Module title (e.g., "Introduction to Contentstack Launch")

#### 2. Module ID (Single Line Textbox)
- Display Name: `Module ID`
- UID: `module_id`
- Mandatory: ✅ Yes
- Unique: ✅ Yes
- Help Text: Unique identifier (e.g., "mod-launch-001")

#### 3. Category (Single Line Textbox)
- Display Name: `Category`
- UID: `category`
- Mandatory: ❌ No
- Help Text: e.g., "Product Knowledge", "Testing Strategy", "Automation"

#### 4. Difficulty (Select - Dropdown)
- Display Name: `Difficulty`
- UID: `difficulty`
- Mandatory: ❌ No
- Options:
  - `beginner` | Beginner
  - `intermediate` | Intermediate
  - `advanced` | Advanced

#### 5. Content (Rich Text Editor)
- Display Name: `Content`
- UID: `content`
- Mandatory: ❌ No
- Help Text: Full module content with HTML formatting

#### 6. Video URL (Single Line Textbox)
- Display Name: `Video URL`
- UID: `video_url`
- Mandatory: ❌ No
- Help Text: YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)

#### 7. Estimated Time (Number)
- Display Name: `Estimated Time`
- UID: `estimated_time`
- Mandatory: ❌ No
- Help Text: Time in minutes

#### 8. Tags (Multiple Line Textbox)
- Display Name: `Tags`
- UID: `tags`
- Mandatory: ❌ No
- Help Text: JSON array: ["launch", "testing", "automation"]

#### 9. Mandatory (Boolean)
- Display Name: `Mandatory`
- UID: `mandatory`
- Mandatory: ❌ No
- Default: `false`
- Help Text: Is this module required for onboarding?

#### 10. Order (Number)
- Display Name: `Order`
- UID: `order`
- Mandatory: ❌ No
- Help Text: Display sequence/priority

#### 11. Target Segments (Multiple Line Textbox)
- Display Name: `Target Segments`
- UID: `target_segments`
- Mandatory: ❌ No
- Help Text: JSON array: ["ROOKIE", "AT_RISK", "HIGH_FLYER"]

#### 12. Target Teams (Multiple Line Textbox)
- Display Name: `Target Teams`
- UID: `target_teams`
- Mandatory: ❌ No
- Help Text: JSON array: ["Launch", "Data & Insights", "Visual Builder", "AutoDraft", "DAM"]

#### 13. Prerequisites (Multiple Line Textbox)
- Display Name: `Prerequisites`
- UID: `prerequisites`
- Mandatory: ❌ No
- Help Text: JSON array of module_ids: ["mod-launch-001", "mod-launch-002"]

#### 14. Quiz Items (Modular Blocks)
- Display Name: `Quiz Items`
- UID: `quiz_items`
- Mandatory: ❌ No
- **Reference to**: `quiz_item` content type
- Multiple: ✅ Yes
- Help Text: Quiz questions for this module

#### 15. Skill Level (Taxonomy) ⚠️ Add After Creating Taxonomy
- Display Name: `Skill Level`
- UID: Will be auto-set to `taxonomies` by Contentstack
- Select Taxonomy: `skill_level`
- Multiple: ✅ Yes

#### 16. Content Category (Taxonomy) ⚠️ Add After Creating Taxonomy
- Display Name: `Content Category`
- UID: Will be auto-set to `taxonomies` by Contentstack
- Select Taxonomy: `content_category`
- Multiple: ✅ Yes

---

## 🏗️ Content Type 2: `quiz_item`

### Basic Settings:
- **Display Name**: Quiz Item
- **UID**: `quiz_item`
- **Description**: Individual quiz questions for training modules

### Fields to Add:

#### 1. Quiz ID (Single Line Textbox)
- Display Name: `Quiz ID`
- UID: `quiz_id`
- Mandatory: ✅ Yes
- Unique: ✅ Yes
- Help Text: Unique identifier (e.g., "q1", "q2")

#### 2. Question (Single Line Textbox)
- Display Name: `Question`
- UID: `question`
- Mandatory: ✅ Yes
- Help Text: The quiz question text

#### 3. Options (Multiple Line Textbox)
- Display Name: `Options`
- UID: `options`
- Mandatory: ✅ Yes
- Help Text: JSON array of 4 answer options: ["Option 1", "Option 2", "Option 3", "Option 4"]

#### 4. Correct Answer (Number)
- Display Name: `Correct Answer`
- UID: `correct_answer`
- Mandatory: ✅ Yes
- Help Text: Index of correct option (0 for first option, 1 for second, etc.)

#### 5. Explanation (Multiple Line Textbox)
- Display Name: `Explanation`
- UID: `explanation`
- Mandatory: ❌ No
- Help Text: Why this answer is correct

---

## 🏗️ Content Type 3: `qa_sop`

### Basic Settings:
- **Display Name**: QA Standard Operating Procedure
- **UID**: `qa_sop`
- **Description**: Standard operating procedures for QA workflows

### Fields to Add:

#### 1. Title (Single Line Textbox)
- Display Name: `Title`
- UID: `title`
- Mandatory: ✅ Yes
- Help Text: SOP title (e.g., "Production Bug Escalation Process")

#### 2. SOP ID (Single Line Textbox)
- Display Name: `SOP ID`
- UID: `sop_id`
- Mandatory: ✅ Yes
- Unique: ✅ Yes
- Help Text: Unique identifier (e.g., "sop-001")

#### 3. Criticality (Select - Dropdown)
- Display Name: `Criticality`
- UID: `criticality`
- Mandatory: ❌ No
- Options:
  - `critical` | Critical
  - `high` | High
  - `medium` | Medium
  - `low` | Low

#### 4. Mandatory (Boolean)
- Display Name: `Mandatory`
- UID: `mandatory`
- Mandatory: ❌ No
- Default: `false`
- Help Text: Required for onboarding completion?

#### 5. Steps (Multiple Line Textbox)
- Display Name: `Steps`
- UID: `steps`
- Mandatory: ✅ Yes
- Help Text: JSON array of step-by-step instructions: ["Step 1", "Step 2", ...]

#### 6. Related Tools (Multiple Line Textbox)
- Display Name: `Related Tools`
- UID: `related_tools`
- Mandatory: ❌ No
- Help Text: JSON array of tool_ids: ["tool-001", "tool-003"]

#### 7. Target Segments (Multiple Line Textbox)
- Display Name: `Target Segments`
- UID: `target_segments`
- Mandatory: ❌ No
- Help Text: JSON array: ["ROOKIE", "AT_RISK", "HIGH_FLYER"]

#### 8. Target Teams (Multiple Line Textbox)
- Display Name: `Target Teams`
- UID: `target_teams`
- Mandatory: ❌ No
- Help Text: JSON array: ["Launch", "DAM"] or leave empty for all teams

#### 9. SOP Category (Taxonomy) ⚠️ Add After Creating Taxonomy
- Display Name: `SOP Category`
- UID: Will be auto-set to `taxonomies`
- Select Taxonomy: `sop_category`
- Multiple: ✅ Yes

---

## 🏗️ Content Type 4: `qa_tool`

### Basic Settings:
- **Display Name**: QA Tool
- **UID**: `qa_tool`
- **Description**: Testing tools, documentation, and integration info

### Fields to Add:

#### 1. Name (Single Line Textbox)
- Display Name: `Name`
- UID: `name`
- Mandatory: ✅ Yes
- Help Text: Tool name (e.g., "Jira", "Playwright", "Postman")

#### 2. Tool ID (Single Line Textbox)
- Display Name: `Tool ID`
- UID: `tool_id`
- Mandatory: ✅ Yes
- Unique: ✅ Yes
- Help Text: Unique identifier (e.g., "tool-001")

#### 3. Purpose (Multiple Line Textbox)
- Display Name: `Purpose`
- UID: `purpose`
- Mandatory: ❌ No
- Help Text: What this tool is used for

#### 4. Docs Link (Single Line Textbox)
- Display Name: `Documentation Link`
- UID: `docs_link`
- Mandatory: ❌ No
- Help Text: Official documentation URL

#### 5. Integrations (Multiple Line Textbox)
- Display Name: `Integrations`
- UID: `integrations`
- Mandatory: ❌ No
- Help Text: JSON array of tool names it integrates with: ["Jenkins", "GitHub", "Slack"]

#### 6. Category (Single Line Textbox)
- Display Name: `Category`
- UID: `category`
- Mandatory: ❌ No
- Help Text: e.g., "Project Management", "API Testing", "Automation"

#### 7. Target Segments (Multiple Line Textbox)
- Display Name: `Target Segments`
- UID: `target_segments`
- Mandatory: ❌ No
- Help Text: JSON array: ["ROOKIE", "HIGH_FLYER"]

#### 8. Target Teams (Multiple Line Textbox)
- Display Name: `Target Teams`
- UID: `target_teams`
- Mandatory: ❌ No
- Help Text: JSON array: ["AutoDraft", "DAM"] or leave empty for all teams

#### 9. Is Generic (Boolean)
- Display Name: `Is Generic`
- UID: `is_generic`
- Mandatory: ❌ No
- Default: `false`
- Help Text: Is this tool shown to all teams?

#### 10. Tool Category (Taxonomy) ⚠️ Add After Creating Taxonomy
- Display Name: `Tool Category`
- UID: Will be auto-set to `taxonomies`
- Select Taxonomy: `tool_category`
- Multiple: ✅ Yes

---

## 🏗️ Content Type 5: `manager_config`

### Basic Settings:
- **Display Name**: Manager Configuration
- **UID**: `manager_config`
- **Description**: Manager contact details for team notifications

### Fields to Add:

#### 1. Team (Select - Dropdown)
- Display Name: `Team`
- UID: `team`
- Mandatory: ✅ Yes
- Unique: ✅ Yes (set in options)
- Options:
  - `Launch` | Launch
  - `Data & Insights` | Data & Insights
  - `Visual Builder` | Visual Builder
  - `AutoDraft` | AutoDraft
  - `DAM` | DAM

#### 2. Manager Name (Single Line Textbox)
- Display Name: `Manager Name`
- UID: `manager_name`
- Mandatory: ✅ Yes
- Help Text: Full name of the team manager

#### 3. Manager Email (Single Line Textbox)
- Display Name: `Manager Email`
- UID: `manager_email`
- Mandatory: ✅ Yes
- Help Text: Manager's email address for notifications

---

## 🌳 Taxonomies to Create (Before Adding to Content Types)

### 1. Taxonomy: `skill_level`
- **Display Name**: Skill Level
- **UID**: `skill_level`
- **Terms**:
  ```
  Beginner
  Intermediate
  Advanced
  ```

### 2. Taxonomy: `content_category`
- **Display Name**: Content Category
- **UID**: `content_category`
- **Terms** (hierarchical):
  ```
  Product Knowledge
    ├── Launch
    ├── Data & Insights
    ├── Visual Builder
    ├── AutoDraft
    └── DAM
  Testing Strategy
    ├── Functional Testing
    ├── API Testing
    ├── Performance Testing
    └── Accessibility Testing
  Automation
    ├── Playwright
    ├── REST Assured
    └── CI/CD
  Best Practices
    ├── Bug Management
    ├── Documentation
    └── Code Review
  ```

### 3. Taxonomy: `sop_category`
- **Display Name**: SOP Category
- **UID**: `sop_category`
- **Terms**:
  ```
  Bug Management
  Testing Workflow
  Environment Setup
  Documentation
  Communication
  ```

### 4. Taxonomy: `tool_category`
- **Display Name**: Tool Category
- **UID**: `tool_category`
- **Terms**:
  ```
  Project Management
  API Testing
  Automation Framework
  Communication
  Performance Testing
  Browser Testing
  ```

---

## 📝 Step-by-Step Setup Order

### Step 1: Create Taxonomies
1. Go to **Content Models** → **Taxonomies**
2. Click **+ New Taxonomy**
3. Create all 4 taxonomies with their terms (see above)

### Step 2: Create Content Types (Without Taxonomy Fields First)
1. Go to **Content Models** → **Content Types**
2. Click **+ New Content Type**
3. Create all 5 content types with fields **EXCEPT** taxonomy fields
4. For `qa_training_module`, add the **Modular Blocks** field referencing `quiz_item`

### Step 3: Add Taxonomy Fields
1. Edit each content type
2. Click **+ Add Field** → **Taxonomy**
3. Select the appropriate taxonomy
4. Enable **Multiple** selection
5. Save

### Step 4: Verify Environment Setup
1. Go to **Settings** → **Environments**
2. Ensure you have a `dev` environment (or create one)

---

## ✅ Verification Checklist

Before proceeding to Phase 2 (MCP automation), verify:

- [ ] All 4 taxonomies created with terms
- [ ] `quiz_item` content type created
- [ ] `qa_training_module` content type created with Modular Blocks field referencing `quiz_item`
- [ ] `qa_sop` content type created
- [ ] `qa_tool` content type created
- [ ] `manager_config` content type created
- [ ] All taxonomy fields added to content types
- [ ] `dev` environment exists
- [ ] All content types are published (make them available)

---

## 🎯 What Happens Next (Phase 2 - MCP Will Do This)

Once you complete Phase 1, the MCP will:
- ✅ Create ~60 training module entries
- ✅ Create ~150 quiz item entries
- ✅ Create ~25 SOP entries
- ✅ Create ~15 tool entries
- ✅ Create 5 manager config entries
- ✅ Link quiz items to modules
- ✅ Tag all entries with taxonomy terms
- ✅ Publish all entries to dev environment

---

## ❓ Common Issues

### Issue: Can't add Modular Blocks field
**Solution**: Make sure `quiz_item` content type is created first

### Issue: Taxonomy field not showing
**Solution**: Create taxonomies BEFORE adding taxonomy fields to content types

### Issue: Can't set Unique on Select field
**Solution**: This is a Contentstack limitation. Just note that each team should have only one manager_config entry

---

**Once you complete Phase 1, let me know and I'll help you configure the MCP prompt for Phase 2!** 🚀

