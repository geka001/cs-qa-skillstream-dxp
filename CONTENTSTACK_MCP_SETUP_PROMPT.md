# Contentstack MCP Setup Prompt for SkillStream QA Onboarding App

## Application Overview

**SkillStream** is a personalized QA onboarding and training platform for Contentstack product teams. It delivers team-specific training modules, SOPs, and tool documentation based on:
- **User Segment** (ROOKIE, AT_RISK, HIGH_FLYER)
- **Product Team** (Launch, Data & Insights, Visual Builder, AutoDraft, DAM)

### Key Features:
1. **Personalized Content Delivery**: Content filtered by user segment and team
2. **Learning Pathways**: Mandatory modules → Regular modules → Advanced modules
3. **Quiz-Based Assessment**: Track scores, update user segments dynamically
4. **Prerequisites System**: Modules can have prerequisites (order-based learning)
5. **Remedial Content**: AT_RISK users get additional support modules
6. **Onboarding Tracking**: Track module, SOP, and tool completion
7. **Manager Dashboard**: Team managers monitor progress across their team

---

## Required Content Models (Content Types)

### 1. **Training Module** (`qa_training_module`)

**Purpose**: Core learning content with video, text, and quiz

**Fields**:
- `title` (Single Line Text, Required) - e.g., "Introduction to Contentstack Launch"
- `module_id` (Single Line Text, Required, Unique) - e.g., "mod-launch-001"
- `category` (Single Line Text) - e.g., "Product Knowledge", "Testing Strategy", "Automation"
- `difficulty` (Single Select) - Options: "beginner", "intermediate", "advanced"
- `content` (Rich Text Editor) - Full module content with HTML
- `video_url` (Single Line Text) - YouTube embed URL
- `estimated_time` (Number) - Time in minutes
- `tags` (Multiple Line Text or JSON) - Array of tags like ["launch", "personalization"]
- `mandatory` (Boolean) - Is this module required for onboarding?
- `order` (Number) - Display order within the sequence
- `target_segments` (Multiple Line Text or JSON) - Array: ["ROOKIE", "AT_RISK", "HIGH_FLYER"]
- `target_teams` (Multiple Line Text or JSON) - Array: ["Launch", "Data & Insights", "Visual Builder", "AutoDraft", "DAM"]
- `prerequisites` (Multiple Line Text or JSON) - Array of module_ids that must be completed first
- `quiz_items` (Modular Blocks Reference) - Reference to quiz questions

**Taxonomy Fields**:
- `skill_level` (Taxonomy) - Beginner / Intermediate / Advanced
- `content_category` (Taxonomy) - Product Knowledge / Testing / Automation / Best Practices

**Example Entries**:
- ~60 modules total across 5 teams
- Each team has 4-6 mandatory ROOKIE modules
- Additional intermediate/advanced modules for HIGH_FLYER segment
- 3 remedial modules for AT_RISK users

---

### 2. **Quiz Item** (`quiz_item`)

**Purpose**: Quiz questions embedded in training modules

**Fields**:
- `quiz_id` (Single Line Text, Required, Unique) - e.g., "q1", "q2"
- `question` (Single Line Text, Required) - The question text
- `options` (Multiple Line Text or JSON) - Array of 4 answer options
- `correct_answer` (Number) - Index of correct option (0-3)
- `explanation` (Multi Line Text) - Why this answer is correct

**Example**: Each module has 2-4 quiz questions

---

### 3. **Standard Operating Procedure (SOP)** (`qa_sop`)

**Purpose**: Step-by-step procedures for QA workflows

**Fields**:
- `sop_id` (Single Line Text, Required, Unique) - e.g., "sop-001"
- `title` (Single Line Text, Required) - e.g., "Production Bug Escalation Process"
- `criticality` (Single Select) - Options: "critical", "high", "medium", "low"
- `mandatory` (Boolean) - Required for onboarding?
- `steps` (Multiple Line Text or JSON) - Array of step-by-step instructions
- `related_tools` (Multiple Line Text or JSON) - Array of tool_ids like ["tool-001", "tool-003"]
- `target_segments` (Multiple Line Text or JSON) - Which segments see this SOP
- `target_teams` (Multiple Line Text or JSON) - Which teams see this SOP (if team-specific)

**Taxonomy Fields**:
- `sop_category` (Taxonomy) - Bug Management / Testing Workflow / Environment Setup / Documentation

**Example Entries**:
- Production Bug Escalation Process (mandatory, critical)
- Sprint Testing Workflow (mandatory, high)
- Test Environment Setup (medium)
- API Testing Best Practices
- Accessibility Testing Checklist

---

### 4. **Tool** (`qa_tool`)

**Purpose**: Documentation links and info for QA tools

**Fields**:
- `tool_id` (Single Line Text, Required, Unique) - e.g., "tool-001"
- `name` (Single Line Text, Required) - e.g., "Jira", "Postman", "Playwright"
- `purpose` (Multi Line Text) - What this tool is used for
- `docs_link` (Single Line Text) - Official documentation URL
- `integrations` (Multiple Line Text or JSON) - Array of tools it integrates with
- `category` (Single Line Text) - e.g., "Project Management", "API Testing", "Automation"
- `target_segments` (Multiple Line Text or JSON) - Which segments see this
- `target_teams` (Multiple Line Text or JSON) - Which teams use this tool
- `is_generic` (Boolean) - Is this shown to all teams? (vs. team-specific)

**Taxonomy Fields**:
- `tool_category` (Taxonomy) - Project Management / Testing / Automation / Communication

**Example Entries**:
- **Generic Tools** (all teams): Jira, Postman, Slack, TestRail, BrowserStack, Charles Proxy
- **Team-Specific Tools**:
  - All teams: Playwright, GoCD (high-level), Jenkins (high-level)
  - AutoDraft & DAM only: REST Assured (API testing)

---

### 5. **Manager Configuration** (`manager_config`)

**Purpose**: Manager details for email notifications

**Fields**:
- `team` (Single Select, Required) - Options: "Launch", "Data & Insights", "Visual Builder", "AutoDraft", "DAM"
- `manager_name` (Single Line Text) - e.g., "Jane Doe"
- `manager_email` (Single Line Text) - e.g., "jane.doe@contentstack.com"

**Example Entries**:
- One entry per team (5 total)

---

## Taxonomy Structure

### 1. **Skill Level** (`skill_level`)
```
├── Beginner
├── Intermediate
└── Advanced
```

### 2. **Content Category** (`content_category`)
```
├── Product Knowledge
│   ├── Launch
│   ├── Data & Insights
│   ├── Visual Builder
│   ├── AutoDraft
│   └── DAM
├── Testing Strategy
│   ├── Functional Testing
│   ├── API Testing
│   ├── Performance Testing
│   └── Accessibility Testing
├── Automation
│   ├── Playwright
│   ├── REST Assured
│   └── CI/CD
└── Best Practices
    ├── Bug Management
    ├── Documentation
    └── Code Review
```

### 3. **SOP Category** (`sop_category`)
```
├── Bug Management
├── Testing Workflow
├── Environment Setup
├── Documentation
└── Communication
```

### 4. **Tool Category** (`tool_category`)
```
├── Project Management
├── API Testing
├── Automation Framework
├── Communication
├── Performance Testing
└── Browser Testing
```

---

## Personalization & Variants

### Personalization Audiences

1. **By User Segment**:
   - **ROOKIE Audience**: New QA engineers (default)
   - **AT_RISK Audience**: Users with quiz scores < 70%
   - **HIGH_FLYER Audience**: Users with quiz scores > 85%

2. **By Product Team**:
   - **Launch Team**: Launch-specific modules
   - **Data & Insights Team**: Analytics-focused modules
   - **Visual Builder Team**: Visual builder testing modules
   - **AutoDraft Team**: AI content generation testing
   - **DAM Team**: Asset management testing

### Personalization Rules

**Rule 1: Show Remedial Modules to AT_RISK Users**
- Audience: AT_RISK segment
- Content: Modules with `target_segments` includes "AT_RISK"
- Priority: High

**Rule 2: Show Advanced Modules to HIGH_FLYER Users**
- Audience: HIGH_FLYER segment
- Content: Modules with `difficulty` = "advanced" AND `target_segments` includes "HIGH_FLYER"
- Priority: Medium

**Rule 3: Team-Specific Content**
- Audience: Based on user's `team` field
- Content: Modules where `target_teams` includes user's team
- Priority: High

**Rule 4: Mandatory Content for All**
- Audience: All users
- Content: Modules where `mandatory` = true AND team matches
- Priority: Critical

### Content Variants

**Module Variants by Segment**:
1. **Rookie Variant**:
   - Basic, fundamental content
   - Longer explanations
   - More examples
   
2. **AT_RISK Variant**:
   - Additional practice exercises
   - Step-by-step breakdowns
   - Extra resources and links
   
3. **HIGH_FLYER Variant**:
   - Advanced challenges
   - Edge case scenarios
   - Best practices and optimization tips

**Tool Documentation Variants by Team**:
- Different tool lists per team
- Team-specific usage guidelines

---

## Sample Data Requirements

### Modules:
- **Launch Team**: 12 modules (4 mandatory rookie, 4 intermediate, 4 advanced)
- **Data & Insights Team**: 10 modules
- **Visual Builder Team**: 10 modules
- **AutoDraft Team**: 8 modules
- **DAM Team**: 8 modules
- **Remedial Modules**: 3 modules (for AT_RISK users, all teams)
- **Total**: ~60 modules

### SOPs:
- 5-6 mandatory SOPs (all teams)
- 3-4 team-specific SOPs per team
- **Total**: ~25 SOPs

### Tools:
- 10 generic tools (shown to all)
- 5-6 team-specific tools
- **Total**: ~15 tools

### Quiz Items:
- 2-4 questions per module
- **Total**: ~150 quiz items

---

## Additional Requirements

### 1. **References Between Content Types**:
- `qa_training_module` → References → `quiz_item` (Modular Blocks)
- `qa_sop` → References → `qa_tool` (Multi-reference)

### 2. **Workflow**:
- Content should support "Draft" and "Published" states
- Only published content visible in app

### 3. **Environments**:
- **dev**: Development environment
- **staging**: Pre-production testing
- **production**: Live content

### 4. **Localization** (Future):
- Currently English (en-us) only
- Plan to add Spanish (es), French (fr) later

### 5. **Content Preview**:
- Support for previewing unpublished content
- Webhook for cache invalidation on publish

---

## Integration with App

### Delivery API Usage:
```javascript
// Fetch modules for a specific team and segment
GET /v3/content_types/qa_training_module/entries
?query={"target_teams": "Launch", "target_segments": "ROOKIE"}
&include[]=quiz_items

// Fetch all SOPs
GET /v3/content_types/qa_sop/entries
?include[]=related_tools

// Fetch tools
GET /v3/content_types/qa_tool/entries
?query={"target_teams": "Launch"}
```

### Management API Usage:
- Create/update entries programmatically
- Bulk import from mockData.ts
- Sync content across environments

---

## Success Criteria

✅ All 60+ modules created with proper team/segment targeting  
✅ All quiz questions linked to modules  
✅ SOPs with tool references working  
✅ Taxonomy structure implemented  
✅ Personalization rules active and tested  
✅ Content variants created for ROOKIE/AT_RISK/HIGH_FLYER  
✅ All content published to dev environment  
✅ App successfully fetching data from Contentstack instead of mockData.ts  

---

## Notes for Contentstack MCP

1. **Field Types**: Use JSON/Multiple Line Text for arrays (target_segments, target_teams, tags, steps, etc.)
2. **Unique IDs**: Ensure module_id, sop_id, tool_id, quiz_id are unique across all entries
3. **References**: Set up proper references between modules → quiz items and SOPs → tools
4. **Bulk Import**: Provide scripts/JSON to import all ~60 modules at once
5. **Environment**: Start with 'dev' environment, then promote to staging/production
6. **Taxonomy**: Create all taxonomies BEFORE creating content types
7. **Personalize**: Set up audiences and experiences after content is created

---

**This prompt provides all the information needed to set up the complete Contentstack content model for the SkillStream QA Onboarding application.**

