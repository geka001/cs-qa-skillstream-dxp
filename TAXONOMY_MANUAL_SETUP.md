# Taxonomy Setup - Manual UI Guide

## Issue with Automated Script

The automated taxonomy field addition script is encountering API validation errors. This is common with complex Contentstack features like Taxonomy, which are best configured through the UI.

## ✅ Manual Setup Instructions (Recommended - 10 minutes)

### Step 1: Access Content Type Editor

1. Go to: https://app.contentstack.com
2. Navigate to your stack
3. Go to: **Content Models → Content Types**

### Step 2: Add Taxonomy Fields to `qa_training_module`

1. Click on **QA Training Module** content type
2. Click **Edit** (top right)
3. In the schema editor, click **+ Add Field**
4. Select **Taxonomy** field type

#### Add these 2 taxonomy fields:

**Field 1: Skill Level**
- Display Name: `Skill Level`
- UID: `skill_level_taxonomy`
- Select Taxonomy: `Skill Level` (skill_level)
- Allow Multiple: ☑ Yes
- Mandatory: ☐ No
- Click Save

**Field 2: Content Category**
- Display Name: `Content Category`
- UID: `content_category_taxonomy`
- Select Taxonomy: `Content Category` (content_category)
- Allow Multiple: ☑ Yes
- Mandatory: ☐ No
- Click Save

5. Click **Save** on the content type

### Step 3: Add Taxonomy Fields to `qa_sop`

1. Click on **QA Standard Operating Procedure** content type
2. Click **Edit**
3. Add **+ Field** → **Taxonomy**

**Field 1: SOP Category**
- Display Name: `SOP Category`
- UID: `sop_category_taxonomy`
- Select Taxonomy: `SOP Category` (sop_category)
- Allow Multiple: ☑ Yes
- Mandatory: ☑ Yes

4. Click **Save**

### Step 4: Add Taxonomy Fields to `qa_tool`

1. Click on **QA Tool** content type
2. Click **Edit**
3. Add **+ Field** → **Taxonomy**

**Field 1: Tool Category**
- Display Name: `Tool Category`
- UID: `tool_category_taxonomy`
- Select Taxonomy: `Tool Category` (tool_category)
- Allow Multiple: ☑ Yes
- Mandatory: ☑ Yes

4. Click **Save**

---

## Step 5: Tag Existing Entries

After adding taxonomy fields to content types, you need to tag existing entries.

### Option A: Manual Tagging (Recommended for accuracy)

1. Go to **Entries → QA Training Module**
2. Open each module entry
3. Scroll to the taxonomy fields
4. Select appropriate taxonomy terms from dropdowns
5. Save each entry

### Option B: Automated Tagging (Can try after UI setup)

Once taxonomy fields are added via UI, you can run:

```bash
npm run cs:taxonomy-tag
```

This will attempt to automatically tag entries based on predefined mappings.

---

## Verification

After setup, verify:

1. ✅ All 3 content types have taxonomy fields:
   - **qa_training_module**: skill_level_taxonomy, content_category_taxonomy
   - **qa_sop**: sop_category_taxonomy
   - **qa_tool**: tool_category_taxonomy
2. ✅ Taxonomy fields appear in entry editor
3. ✅ Can select terms from taxonomy dropdowns
4. ✅ Entries are tagged with taxonomy terms

---

## Why Manual Setup?

Contentstack's Taxonomy feature has specific API requirements that can be tricky:
- Field schema validation is strict
- UI provides better error messages
- Visual confirmation of taxonomy linkage
- Immediate feedback on configuration

**Time Required:** 10-15 minutes for all 3 content types

---

## Next Steps

After taxonomy fields are added:

1. ✅ Tag your entries (manually or with script)
2. ✅ Continue with Variants setup: `npm run cs:variants`
3. ✅ Set up Personalize in UI (see `QUICKSTART_ADVANCED_FEATURES.md`)

---

## Support

If you encounter issues:
- Check that all 4 taxonomies exist in Settings → Taxonomies:
  - ✅ Skill Level (skill_level)
  - ✅ Content Category (content_category)
  - ✅ SOP Category (sop_category)
  - ✅ Tool Category (tool_category)
- Ensure content types are not locked
- Try refreshing the page
- Contact Contentstack support if needed

---

**Bottom Line:** The taxonomy fields need to be added through the Contentstack UI. The automated script works for creating the taxonomies themselves (which succeeded ✅), but adding taxonomy fields to content types is best done manually through the UI interface.

