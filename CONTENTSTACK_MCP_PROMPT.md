# Contentstack MCP Prompt - Ready to Use

Copy and paste this prompt to the Contentstack MCP:

---

## PROMPT START

I need you to create a complete Contentstack content model for a **QA Onboarding & Training Application** called **SkillStream**.

### Application Purpose:
SkillStream delivers personalized training to QA engineers based on:
- **User Segment**: ROOKIE (new), AT_RISK (struggling), HIGH_FLYER (advanced)
- **Product Team**: Launch, Data & Insights, Visual Builder, AutoDraft, DAM

### Create These Content Types:

#### 1. `qa_training_module`
- title (text, required)
- module_id (text, required, unique) 
- category (text) - e.g., "Product Knowledge"
- difficulty (select: beginner/intermediate/advanced)
- content (rich text) - Full HTML content
- video_url (text) - YouTube embed URL
- estimated_time (number) - minutes
- tags (json/multi-line text) - Array like ["launch", "testing"]
- mandatory (boolean) - Required for onboarding?
- order (number) - Display sequence
- target_segments (json/multi-line text) - Array like ["ROOKIE", "HIGH_FLYER"]
- target_teams (json/multi-line text) - Array like ["Launch", "DAM"]
- prerequisites (json/multi-line text) - Array of module_ids
- quiz_items (reference to quiz_item, multiple)
- **Taxonomy**: skill_level, content_category

#### 2. `quiz_item`
- quiz_id (text, required, unique)
- question (text, required)
- options (json/multi-line text) - Array of 4 options
- correct_answer (number) - Index 0-3
- explanation (multi-line text)

#### 3. `qa_sop` (Standard Operating Procedures)
- sop_id (text, required, unique)
- title (text, required)
- criticality (select: critical/high/medium/low)
- mandatory (boolean)
- steps (json/multi-line text) - Array of step instructions
- related_tools (json/multi-line text) - Array of tool_ids
- target_segments (json/multi-line text)
- target_teams (json/multi-line text)
- **Taxonomy**: sop_category

#### 4. `qa_tool`
- tool_id (text, required, unique)
- name (text, required) - e.g., "Jira", "Playwright"
- purpose (multi-line text)
- docs_link (text) - Documentation URL
- integrations (json/multi-line text) - Array of tool names
- category (text)
- target_segments (json/multi-line text)
- target_teams (json/multi-line text)
- is_generic (boolean) - Show to all teams?
- **Taxonomy**: tool_category

#### 5. `manager_config`
- team (select: Launch/Data & Insights/Visual Builder/AutoDraft/DAM)
- manager_name (text)
- manager_email (text)

---

### Create These Taxonomies (BEFORE content types):

1. **skill_level**: Beginner, Intermediate, Advanced

2. **content_category**: 
   - Product Knowledge → Launch, Data & Insights, Visual Builder, AutoDraft, DAM
   - Testing Strategy → Functional, API, Performance, Accessibility
   - Automation → Playwright, REST Assured, CI/CD
   - Best Practices → Bug Management, Documentation, Code Review

3. **sop_category**: Bug Management, Testing Workflow, Environment Setup, Documentation, Communication

4. **tool_category**: Project Management, API Testing, Automation Framework, Communication, Performance Testing, Browser Testing

---

### Create Sample Entries:

**Modules** (~60 total):
- Launch Team: 12 modules (4 mandatory ROOKIE, 4 intermediate, 4 advanced)
- Data & Insights: 10 modules
- Visual Builder: 10 modules
- AutoDraft: 8 modules
- DAM: 8 modules
- Remedial (AT_RISK): 3 modules
- Each module should have 2-4 quiz questions

**Example Module**:
```json
{
  "title": "Introduction to Contentstack Launch",
  "module_id": "mod-launch-001",
  "category": "Product Knowledge",
  "difficulty": "beginner",
  "content": "<h2>Introduction to Launch</h2><p>Launch is an experience optimization platform...</p>",
  "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "estimated_time": 30,
  "tags": ["launch", "personalization", "product-knowledge"],
  "mandatory": true,
  "order": 1,
  "target_segments": ["ROOKIE"],
  "target_teams": ["Launch"],
  "prerequisites": []
}
```

**SOPs** (~25 total):
- Production Bug Escalation (critical, mandatory, all teams)
- Sprint Testing Workflow (high, mandatory, all teams)
- Test Environment Setup (medium, all teams)
- 3-4 team-specific SOPs per team

**Tools** (~15 total):
- Generic (all teams): Jira, Postman, Slack, TestRail, BrowserStack, Charles Proxy
- Team-specific: Playwright, GoCD, Jenkins (all teams), REST Assured (AutoDraft & DAM only)

**Manager Configs** (5 entries, one per team):
```json
{
  "team": "Launch",
  "manager_name": "Jane Doe",
  "manager_email": "jane.doe@contentstack.com"
}
```

---

### Set Up Personalization:

**Audiences**:
1. ROOKIE_SEGMENT (segment = ROOKIE)
2. AT_RISK_SEGMENT (segment = AT_RISK)
3. HIGH_FLYER_SEGMENT (segment = HIGH_FLYER)
4. LAUNCH_TEAM (team = Launch)
5. DATA_INSIGHTS_TEAM (team = Data & Insights)
6. VISUAL_BUILDER_TEAM (team = Visual Builder)
7. AUTODRAFT_TEAM (team = AutoDraft)
8. DAM_TEAM (team = DAM)

**Experiences**:
1. Show remedial modules to AT_RISK users
2. Show advanced modules to HIGH_FLYER users
3. Filter modules by team
4. Show mandatory content to all users in that team

---

### Create Content Variants:

For key modules, create variants:
- **Rookie Variant**: Basic explanations, more examples
- **AT_RISK Variant**: Additional practice, step-by-step guides
- **HIGH_FLYER Variant**: Advanced challenges, edge cases

---

### Environment Setup:
- Create in **dev** environment
- Set up for future promotion to staging/production
- Use webhook for cache invalidation

---

### References:
- Link `quiz_item` to `qa_training_module` (modular blocks)
- Link `qa_tool` to `qa_sop` (multi-reference for related_tools)

---

### Deliverables:
1. All content types created with proper fields
2. All taxonomies created and linked
3. Sample entries for all content types (~150 total entries)
4. Personalization audiences and experiences configured
5. Content variants created
6. All content published to dev environment
7. Export a JSON file of all content for backup

---

**Please proceed with creating this content model step-by-step. Start with taxonomies, then content types, then sample entries, then personalization setup.**

## PROMPT END

