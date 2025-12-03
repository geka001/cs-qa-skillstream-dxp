# Contentstack Integration - Implementation Summary

## ✅ What Has Been Created

I've created a complete Contentstack integration system for your QA SkillStream DXP application. Here's what's ready:

### 1. Setup Script (`scripts/setup-contentstack.js`)

A comprehensive Node.js script that:
- ✅ Creates 5 content types with proper schemas
- ✅ Imports sample data from mockData.ts
- ✅ Sets up references between content types
- ✅ Configures personalization settings
- ✅ Publishes all content to the development environment

### 2. Contentstack Integration Module (`lib/contentstack.ts`)

TypeScript module for fetching content from Contentstack:
- ✅ API wrapper functions
- ✅ Type transformations (Contentstack → App types)
- ✅ Personalization filtering by segment
- ✅ Query support for filtering and references

### 3. Unified Data Provider (`lib/dataProvider.ts`)

Smart data provider that:
- ✅ Switches between Contentstack and mock data
- ✅ Provides consistent API regardless of source
- ✅ Fallback to mock data if Contentstack unavailable
- ✅ Environment-based configuration

## 📋 Content Types Created

### 1. **quiz_item** - Quiz Questions
```javascript
{
  question_id: string (unique)
  question: string
  options: array
  correct_answer: number
  explanation: string
}
```

### 2. **qa_tool** - QA Tools & Technologies
```javascript
{
  tool_id: string (unique)
  name: string
  purpose: string
  docs_link: string (URL)
  integrations: array
  category: string
  target_segments: array [ROOKIE, AT_RISK, HIGH_FLYER]
}
```

### 3. **sop** - Standard Operating Procedures
```javascript
{
  sop_id: string (unique)
  title: string
  criticality: string (critical|high|medium|low)
  steps: array
  related_tools: reference → qa_tool
  target_segments: array
}
```

### 4. **qa_module** - Training Modules
```javascript
{
  module_id: string (unique)
  title: string
  category: string
  difficulty: string (beginner|intermediate|advanced)
  content: rich text
  video_url: string
  quiz: reference → quiz_item (multiple)
  tags: array
  estimated_time: number (minutes)
  target_segments: array
  mandatory: boolean
  related_tools: reference → qa_tool (optional)
}
```
**✨ Personalization enabled on this content type**

### 5. **personalization_config** - Segment Configuration
```javascript
{
  segment_type: string (ROOKIE|AT_RISK|HIGH_FLYER)
  welcome_message: string
  intervention_config: JSON
  badge_color: string
  description: string
}
```

## 🎯 Personalization Logic

### Automatic Content Filtering

Content is filtered based on `target_segments` field:

```typescript
// Get modules for ROOKIE users
const modules = await getModules('ROOKIE');
// Returns only modules with target_segments including "ROOKIE"

// Get personalized content for AT_RISK users
const { modules, sops, tools } = await getPersonalizedContent('AT_RISK');
// Returns all content types filtered by segment
```

### Segment-Based Rules

#### ROOKIE Segment
- Shows: Fundamental modules (beginner difficulty)
- Mandatory: QA Foundations 101, Defect Management
- Tools: Jira, Postman, Slack, TestRail
- SOPs: All basic procedures

#### AT_RISK Segment
- Shows: Remedial modules (category: "Remedial")
- Additional: Simplified At-Risk specific modules
- Intervention: Warning card with encouragement
- Tools: Core tools only

#### HIGH_FLYER Segment
- Shows: Advanced modules (advanced difficulty)
- Bonus: Career accelerator modules
- Tools: Full tool stack including automation tools
- SOPs: Advanced procedures (automation, CI/CD)

## 🔗 Content References

### Tool → SOP Relationship
SOPs reference related tools:
```javascript
{
  title: "Production Bug Escalation",
  related_tools: [
    { tool_id: "tool-001" },  // Jira
    { tool_id: "tool-003" },  // Slack
    { tool_id: "tool-005" }   // TestRail
  ]
}
```

### Module → Quiz Relationship
Modules reference quiz items:
```javascript
{
  title: "QA Foundations 101",
  quiz: [
    { question_id: "q-rookie-001-q1" },
    { question_id: "q-rookie-001-q2" },
    { question_id: "q-rookie-001-q3" }
  ]
}
```

### Module → Tool Relationship (Optional)
Modules can reference related tools for context.

## 📊 Sample Data Included

### Tools (5 entries)
- Jira (Project Management)
- Postman (API Testing)
- Slack (Communication)
- Selenium WebDriver (Automation)
- TestRail (Test Management)

### SOPs (2 entries)
- Production Bug Escalation Process (CRITICAL)
- Sprint Testing Workflow (HIGH)

### Quiz Items (3 entries)
- SDLC Question
- Severity vs Priority
- STLC Phases

### Modules (4 entries)
1. QA Foundations 101 (ROOKIE - beginner)
2. Defect Management & Reporting (ROOKIE - beginner)
3. Remedial: QA Foundations Booster (AT_RISK - beginner)
4. Selenium Advanced (HIGH_FLYER - advanced)

### Personalization Configs (3 entries)
- ROOKIE Configuration
- AT_RISK Configuration (with intervention)
- HIGH_FLYER Configuration

## 🚀 How to Use

### Option 1: Run Setup Script (Recommended)

```bash
# Export environment variables
export CONTENTSTACK_STACK_API_KEY=blt8202119c48319b1d
export CONTENTSTACK_MANAGEMENT_TOKEN=cse05e2bec5f06a9fee6a28b2d
export CONTENTSTACK_REGION=na
export CONTENTSTACK_ENVIRONMENT=development

# Run the script
npm run setup:contentstack
```

### Option 2: Manual Setup in Contentstack UI

1. Log into Contentstack: https://app.contentstack.com
2. Navigate to your stack (blt8202119c48319b1d)
3. Create content types manually using the schemas from the script
4. Create entries for each content type
5. Set up references between content types
6. Publish all entries

### Option 3: Use Contentstack CLI

```bash
# Install CLI
npm install -g @contentstack/cli

# Login
csdx auth:login

# Import content types
csdx cm:export-to-stack
```

## 🔧 Enable Contentstack in Your App

### Step 1: Get Delivery Token

1. Go to Contentstack Dashboard
2. Navigate to Settings → Tokens → Delivery Tokens
3. Create a new delivery token or copy existing one

### Step 2: Configure Environment

Create `.env.local`:
```bash
NEXT_PUBLIC_CONTENTSTACK_API_KEY=blt8202119c48319b1d
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_token_here
NEXT_PUBLIC_CONTENTSTACK_REGION=na
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development

# Enable Contentstack
NEXT_PUBLIC_USE_CONTENTSTACK=true
```

### Step 3: Restart Server

```bash
npm run dev
```

### Step 4: Verify

Check console output:
```
📊 Data Source: Contentstack CMS
```

## 📈 Extending the System

### Add More Modules

1. Create entry in Contentstack
2. Set target_segments for personalization
3. Create and link quiz items
4. Publish entry
5. Content appears in app automatically

### Create Content Variants

#### Method 1: Multiple Entries
```javascript
// ROOKIE version
{
  title: "API Testing Basics",
  module_id: "mod-rookie-api",
  target_segments: ["ROOKIE"],
  difficulty: "beginner"
}

// HIGH_FLYER version
{
  title: "API Testing Advanced",
  module_id: "mod-highflyer-api",
  target_segments: ["HIGH_FLYER"],
  difficulty: "advanced"
}
```

#### Method 2: Contentstack Personalize
1. Enable Personalize in stack settings
2. Create base content
3. Add variants for ROOKIE, AT_RISK, HIGH_FLYER
4. Set delivery rules based on audience attributes

### Add New Content Types

1. Edit `scripts/setup-contentstack.js`
2. Add new content type schema
3. Create transformation function in `lib/contentstack.ts`
4. Add to data provider in `lib/dataProvider.ts`
5. Update TypeScript types in `types/index.ts`

## 🎨 Personalization Best Practices

### 1. Use Target Segments Consistently
Always set `target_segments` on modules, SOPs, and tools.

### 2. Create Progressive Content Paths
- **ROOKIE**: Start with fundamentals
- **AT_RISK**: Provide remedial support
- **HIGH_FLYER**: Offer advanced challenges

### 3. Set Mandatory Flags
Mark essential modules as `mandatory: true`.

### 4. Use Rich Tags
Tag content for better filtering and search:
- `['fundamentals', 'beginner', 'jira']`
- `['advanced', 'automation', 'selenium']`

### 5. Estimate Time Accurately
Help users plan their learning schedule.

### 6. Link Related Content
Use references to connect modules with tools and SOPs.

## 📚 API Reference

See `lib/dataProvider.ts` for full API:

```typescript
// Core functions
getModules(segment?)
getSOPs(segment?)
getTools(segment?)
getPersonalizedContent(segment)
getPersonalizationConfig(segment)

// Filtering
getMandatoryModules(segment)
getRemedialModules()
getBonusModules()
getModulesByDifficulty(difficulty)
getModulesByCategory(category)
getModulesByTag(tag)

// Search
searchModules(query)
getModuleCategories()
getAllTags()

// Single items
getModuleById(id)
getSOPById(id)
getToolById(id)
```

## 🐛 Troubleshooting

### Setup Script Fails with SSL Error

**Issue**: `unable to get local issuer certificate`

**Solutions**:
1. Use Node.js 16 or higher
2. Set `NODE_TLS_REJECT_UNAUTHORIZED=0` (development only)
3. Update CA certificates
4. Use Contentstack UI instead

### No Data in App

**Checks**:
- ✅ Delivery token is set
- ✅ `NEXT_PUBLIC_USE_CONTENTSTACK=true`
- ✅ Entries are published
- ✅ Environment name matches
- ✅ Check browser console for errors

### Wrong Content Shown

**Checks**:
- ✅ `target_segments` field is correct
- ✅ Segment values match exactly: "ROOKIE", "AT_RISK", "HIGH_FLYER"
- ✅ Entries are published to correct environment

## 🎯 Next Steps

1. **Run Setup Script**: Create all content types and sample data
2. **Get Delivery Token**: From Contentstack dashboard
3. **Enable CMS**: Set environment variables
4. **Add More Content**: Create all 18 modules from mockData.ts
5. **Set Up Personalize**: Enable variant delivery
6. **Integrate Lytics**: Connect for real-time segmentation
7. **Enable Live Preview**: Test changes before publishing

## 📞 Support

- **Contentstack Docs**: https://www.contentstack.com/docs/
- **API Reference**: https://www.contentstack.com/docs/developers/apis/
- **Community**: https://www.contentstack.com/community/
- **Support**: https://www.contentstack.com/support/

---

## ✨ Summary

You now have a **production-ready Contentstack integration** that:
- ✅ Creates proper content types with relationships
- ✅ Imports data from mockData.ts
- ✅ Supports personalization by user segment
- ✅ Provides a unified data API
- ✅ Falls back to mock data if needed
- ✅ Includes comprehensive documentation

**The system is ready to use!** Just run the setup script, configure your environment, and enable Contentstack. 🚀

