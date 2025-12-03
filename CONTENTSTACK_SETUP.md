# Contentstack Integration Guide

This guide explains how to set up and use Contentstack CMS with the QA SkillStream DXP application.

## 🚀 Quick Start

### 1. Install Dependencies

No additional dependencies needed - uses Node.js built-in `https` module.

### 2. Configure Environment Variables

Create or update `.env.local`:

```bash
# Contentstack Configuration
NEXT_PUBLIC_CONTENTSTACK_API_KEY=blt8202119c48319b1d
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN=cse05e2bec5f06a9fee6a28b2d
NEXT_PUBLIC_CONTENTSTACK_REGION=na
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development

# Enable Contentstack (set to 'true' to use CMS, 'false' for mock data)
NEXT_PUBLIC_USE_CONTENTSTACK=false
```

### 3. Run the Setup Script

```bash
# Set environment variables for the script
export CONTENTSTACK_STACK_API_KEY=blt8202119c48319b1d
export CONTENTSTACK_MANAGEMENT_TOKEN=cse05e2bec5f06a9fee6a28b2d
export CONTENTSTACK_REGION=na
export CONTENTSTACK_ENVIRONMENT=development

# Run the setup script
node scripts/setup-contentstack.js
```

### 4. Enable Contentstack in Your App

Update `.env.local`:
```bash
NEXT_PUBLIC_USE_CONTENTSTACK=true
```

Restart your development server:
```bash
npm run dev
```

## 📋 What Gets Created

### Content Types

1. **Quiz Item** (`quiz_item`)
   - Question ID, Question, Options, Correct Answer, Explanation
   - Used as nested content in modules

2. **QA Tool** (`qa_tool`)
   - Tool ID, Name, Purpose, Docs Link, Integrations, Category
   - Target Segments for personalization

3. **Standard Operating Procedure** (`sop`)
   - SOP ID, Title, Criticality, Steps (array)
   - References to related tools
   - Target Segments for personalization

4. **QA Training Module** (`qa_module`)
   - Module ID, Title, Category, Difficulty, Content (rich text)
   - Video URL, Quiz (references), Tags, Estimated Time
   - Target Segments, Mandatory flag
   - References to related tools
   - **Personalization enabled**

5. **Personalization Configuration** (`personalization_config`)
   - Segment Type (ROOKIE, AT_RISK, HIGH_FLYER)
   - Welcome Message, Intervention Config, Badge Color

### Sample Data

- **5 QA Tools**: Jira, Postman, Slack, Selenium, TestRail
- **3 Quiz Items**: Sample questions for QA Foundations
- **2 SOPs**: Production Bug Escalation, Sprint Testing Workflow
- **4 Training Modules**:
  - QA Foundations 101 (ROOKIE)
  - Defect Management & Reporting (ROOKIE)
  - Remedial: QA Foundations Booster (AT_RISK)
  - Selenium Advanced (HIGH_FLYER)
- **3 Personalization Configs**: One for each segment

## 🎯 Personalization Setup

### Automatic Filtering by Segment

Content is automatically filtered based on the `target_segments` field:

```typescript
// Fetch modules for ROOKIE users only
const rookieModules = await getModules('ROOKIE');

// Fetch all modules (no filtering)
const allModules = await getModules();
```

### Personalization Rules

The system uses the following logic:

1. **ROOKIE Segment**
   - Shows fundamental modules
   - Mandatory modules flagged as `mandatory: true`
   - Access to basic tools (Jira, Postman, Slack, TestRail)

2. **AT_RISK Segment**
   - Shows remedial modules (category: "Remedial")
   - Shows intervention card with encouragement
   - Access to foundational resources

3. **HIGH_FLYER Segment**
   - Shows advanced modules (difficulty: "advanced")
   - Shows bonus modules (tags include "bonus")
   - Access to all tools including advanced automation tools

### Creating Variants

To create content variants for different segments:

#### Option 1: Multiple Entries (Recommended)

Create separate module entries for each segment:

```javascript
// In Contentstack, create multiple entries:
{
  title: "QA Foundations 101",
  module_id: "mod-rookie-001",
  target_segments: ["ROOKIE"],
  difficulty: "beginner"
}

{
  title: "QA Foundations 101 - Simplified",
  module_id: "mod-atrisk-foundations",
  target_segments: ["AT_RISK"],
  difficulty: "beginner",
  // Simplified content...
}
```

#### Option 2: Contentstack Personalize

Use Contentstack's built-in Personalize feature:

1. Enable personalization on the `qa_module` content type
2. Create base content
3. Add variants for different audiences (ROOKIE, AT_RISK, HIGH_FLYER)
4. Set personalization rules based on user attributes

## 🔧 API Integration

### Data Provider

The app uses a unified data provider that switches between Contentstack and mock data:

```typescript
import { getModules, getPersonalizedContent } from '@/lib/dataProvider';

// Get all modules
const modules = await getModules();

// Get personalized content for a segment
const { modules, sops, tools } = await getPersonalizedContent('ROOKIE');
```

### Available Functions

```typescript
// Modules
await getModules(segment?)                    // All modules (optionally filtered)
await getModuleById(moduleId)                 // Single module
await getMandatoryModules(segment)            // Mandatory modules only
await getRemedialModules()                    // Remedial modules
await getBonusModules()                       // Bonus modules
await getModulesByDifficulty(difficulty)      // Filter by difficulty
await getModulesByCategory(category)          // Filter by category
await getModulesByTag(tag)                    // Filter by tag
await searchModules(query)                    // Search modules

// SOPs
await getSOPs(segment?)                       // All SOPs (optionally filtered)
await getSOPById(sopId)                       // Single SOP

// Tools
await getTools(segment?)                      // All tools (optionally filtered)
await getToolById(toolId)                     // Single tool

// Personalization
await getPersonalizedContent(segment)         // All personalized content
await getPersonalizationConfig(segment)       // Segment configuration

// Metadata
await getModuleCategories()                   // All categories
await getAllTags()                            // All tags
```

## 📊 Content Management Workflow

### Adding New Content

1. **Log into Contentstack**
   ```
   https://app.contentstack.com/#!/stack/blt8202119c48319b1d
   ```

2. **Create New Entry**
   - Navigate to Content Types → QA Training Module
   - Click "New Entry"
   - Fill in all required fields
   - Set target segments
   - Add quiz questions (create Quiz Item entries first)
   - Link related tools

3. **Publish Entry**
   - Click "Publish"
   - Select environment: `development`
   - Confirm publish

### Updating Existing Content

1. Find the entry in Contentstack
2. Edit fields
3. Save and republish
4. Changes appear in app immediately (no rebuild needed)

### Managing Personalization

1. **Update Segment Rules**
   - Go to Personalization Configuration content type
   - Edit ROOKIE, AT_RISK, or HIGH_FLYER config
   - Update welcome messages, intervention config

2. **Adjust Module Targeting**
   - Edit module entry
   - Update `target_segments` field
   - Add/remove segments as needed

## 🔍 Testing

### Test with Mock Data

```bash
# .env.local
NEXT_PUBLIC_USE_CONTENTSTACK=false
```

### Test with Contentstack

```bash
# .env.local
NEXT_PUBLIC_USE_CONTENTSTACK=true
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_token
```

### Verify Data Source

Check the console output when starting the app:
```
📊 Data Source: Contentstack CMS
```
or
```
📊 Data Source: Mock Data
```

## 🚨 Troubleshooting

### Setup Script Fails

**Issue**: "API Error (401)"
- **Solution**: Check management token is correct

**Issue**: "API Error (422): Content type already exists"
- **Solution**: This is normal - content types were already created

### No Data Appears in App

**Issue**: App shows no modules
- **Check**: `NEXT_PUBLIC_USE_CONTENTSTACK=true` in `.env.local`
- **Check**: Delivery token is set and valid
- **Check**: Entries are published to the correct environment
- **Check**: Browser console for errors

### Personalization Not Working

**Issue**: Users see wrong content
- **Check**: `target_segments` field is set correctly
- **Check**: Segment value matches exactly: "ROOKIE", "AT_RISK", or "HIGH_FLYER"
- **Check**: Entries are published

## 📚 Next Steps

1. **Add More Content**
   - Create all 18 modules from mockData.ts
   - Add more quiz questions
   - Add more SOPs and tools

2. **Set Up Contentstack Personalize**
   - Enable Personalize in stack settings
   - Create audience definitions
   - Set up variant delivery rules

3. **Integrate with Lytics**
   - Send user events to Lytics
   - Sync segments back to Contentstack
   - Enable real-time personalization

4. **Enable Live Preview**
   - Set up Live Preview in Contentstack
   - Configure preview URL
   - Test content changes before publish

## 🔗 Resources

- [Contentstack Documentation](https://www.contentstack.com/docs/)
- [Contentstack Management API](https://www.contentstack.com/docs/developers/apis/content-management-api/)
- [Contentstack Delivery API](https://www.contentstack.com/docs/developers/apis/content-delivery-api/)
- [Contentstack Personalize](https://www.contentstack.com/docs/developers/personalize/)

## 💡 Pro Tips

1. **Use References**: Link modules to tools and SOPs for better content organization
2. **Tag Everything**: Use comprehensive tags for better filtering and search
3. **Set Estimated Time**: Helps users plan their learning
4. **Write Good Explanations**: Quiz explanations are key for learning
5. **Test Both Modes**: Always test with both mock and Contentstack data

---

**Need Help?** Check the [Contentstack Community](https://www.contentstack.com/community/) or [Support](https://www.contentstack.com/support/).

