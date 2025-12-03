# Phase 1 Automated Setup Guide

## 🚀 Quick Start

Run this ONE command to create all content types and taxonomies automatically:

```bash
npm install && npm run cs:phase1
```

That's it! The script will create:
- ✅ 4 Taxonomies (~30 terms)
- ✅ 5 Content Types (43 fields)

---

## 📋 What Will Be Created

### Taxonomies:
1. **skill_level** - Beginner, Intermediate, Advanced
2. **content_category** - Hierarchical structure with Product Knowledge, Testing Strategy, etc.
3. **sop_category** - Bug Management, Testing Workflow, etc.
4. **tool_category** - Project Management, API Testing, etc.

### Content Types:
1. **quiz_item** - Quiz questions
2. **manager_config** - Manager details
3. **qa_tool** - Tool documentation
4. **qa_sop** - Standard Operating Procedures
5. **qa_training_module** - Training modules with quiz references

---

## ⚙️ Prerequisites

Make sure your `.env.local` has these values:

```env
CONTENTSTACK_STACK_API_KEY=your_stack_api_key
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token
CONTENTSTACK_REGION=NA
CONTENTSTACK_ENVIRONMENT=dev
```

---

## 🔧 Step-by-Step Instructions

### Step 1: Install Dependencies
```bash
npm install
```

This installs `axios` which is needed for API calls.

### Step 2: Update .env.local
Make sure you have your Contentstack credentials:

```env
CONTENTSTACK_STACK_API_KEY=blt...
CONTENTSTACK_MANAGEMENT_TOKEN=cs...
CONTENTSTACK_REGION=NA
CONTENTSTACK_ENVIRONMENT=dev
```

### Step 3: Run Phase 1 Script
```bash
npm run cs:phase1
```

### Step 4: Add Taxonomy Fields (Manual - 5 minutes)
The script will tell you which taxonomy fields to add manually in the UI:

**In Contentstack UI:**
1. Go to **Content Models** → **qa_training_module** → Edit
2. Click **+ Add Field** → **Taxonomy**
3. Select **skill_level**, enable **Multiple**, save
4. Click **+ Add Field** → **Taxonomy**
5. Select **content_category**, enable **Multiple**, save

Repeat for:
- **qa_sop** → Add **sop_category** (multiple)
- **qa_tool** → Add **tool_category** (multiple)

---

## 📊 Expected Output

```
🚀 Starting Phase 1: Contentstack Setup via API

Region: NA
API Base: https://api.contentstack.io
Environment: dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: Creating Taxonomies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Creating taxonomy: Skill Level
✅ Taxonomy created: Skill Level
  ✅ Term added: Beginner
  ✅ Term added: Intermediate
  ✅ Term added: Advanced

📁 Creating taxonomy: Content Category
✅ Taxonomy created: Content Category
  ✅ Term added: Product Knowledge
    ✅ Term added: Launch
    ✅ Term added: Data & Insights
    ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: Creating Content Types
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Creating content type: Quiz Item
✅ Content type created: Quiz Item

📝 Creating content type: Manager Configuration
✅ Content type created: Manager Configuration

...

✅ Phase 1 Setup Complete!

Summary:
  ✅ 4 Taxonomies created (~30 terms)
  ✅ 5 Content Types created (43 fields)
  ⚠️  Taxonomy fields need manual addition in UI
```

---

## ⚠️ Troubleshooting

### Error: "API Error (401)"
**Problem**: Invalid management token  
**Solution**: Update `CONTENTSTACK_MANAGEMENT_TOKEN` in `.env.local`

### Error: "already exists"
**Problem**: Content types/taxonomies already exist  
**Solution**: Script will skip existing items automatically

### Error: "Cannot find module 'axios'"
**Problem**: Dependencies not installed  
**Solution**: Run `npm install` first

### Error: "unable to get local issuer certificate"
**Problem**: SSL certificate issue (development only)  
**Solution**: Run with `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run cs:phase1` (DEV ONLY!)

---

## 📝 Manual Step: Add Taxonomy Fields

After the script completes, add these taxonomy fields **manually** in the Contentstack UI:

| Content Type | Taxonomy Field | Taxonomy | Multiple |
|--------------|----------------|----------|----------|
| qa_training_module | Skill Level | skill_level | ✅ Yes |
| qa_training_module | Content Category | content_category | ✅ Yes |
| qa_sop | SOP Category | sop_category | ✅ Yes |
| qa_tool | Tool Category | tool_category | ✅ Yes |

**Why Manual?**: Contentstack Management API has limitations with adding taxonomy fields programmatically.

---

## ✅ Verification

After running the script, verify in Contentstack UI:

**Taxonomies** (Content Models → Taxonomies):
- [ ] skill_level (3 terms)
- [ ] content_category (20 terms with hierarchy)
- [ ] sop_category (5 terms)
- [ ] tool_category (6 terms)

**Content Types** (Content Models → Content Types):
- [ ] quiz_item (5 fields)
- [ ] manager_config (3 fields)
- [ ] qa_tool (9 fields + taxonomy field to add)
- [ ] qa_sop (8 fields + taxonomy field to add)
- [ ] qa_training_module (13 fields + 1 modular block + 2 taxonomy fields to add)

---

## 🎯 Next Steps

Once Phase 1 is complete (including manual taxonomy fields):

1. **Phase 2**: Use Contentstack MCP to create entries (~200 entries)
2. **Phase 3**: Set up Personalization and Variants (manual in UI)
3. **App Integration**: Update app to fetch data from Contentstack

---

## 🆘 Need Help?

If the script fails or you encounter issues:

1. Check your `.env.local` credentials
2. Verify your stack region (NA, EU, AZURE_NA, AZURE_EU)
3. Ensure you have Management API access
4. Check the Contentstack Management API documentation
5. Try creating one content type manually to verify permissions

---

**Ready? Run the command!** 🚀

```bash
npm run cs:phase1
```

