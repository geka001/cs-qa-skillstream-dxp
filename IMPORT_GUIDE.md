# How to Import Content Types into Contentstack

## 📦 Import File Created

**File:** `contentstack-import.json`

This file contains all 5 content types ready to import:
- QA Training Module (with variant fields)
- Standard Operating Procedure (with variant fields)
- QA Tool
- Quiz Item
- Personalization Configuration

---

## 🚀 **Import Steps**

### **Option 1: Use Contentstack CLI (Recommended)**

#### Step 1: Install Contentstack CLI

```bash
npm install -g @contentstack/cli
```

#### Step 2: Login to Contentstack

```bash
csdx auth:login
```

Follow the prompts to authenticate.

#### Step 3: Import Content Types

```bash
cd /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp

csdx cm:stacks:import --stack-api-key blt8202119c48319b1d \
  --data-dir . \
  --module content-types \
  --content-types-only
```

Or import the specific file:

```bash
csdx cm:import-content-types --file-path contentstack-import.json \
  --stack-api-key blt8202119c48319b1d
```

---

### **Option 2: Manual Import via UI**

Unfortunately, Contentstack doesn't have a direct "Import JSON" button in the UI for content types. You'll need to use the CLI method above OR create them manually.

---

### **Option 3: Use Our Script (Alternative)**

If CLI doesn't work, you can try our existing script but it may have the same permission issues:

```bash
npm run setup:contentstack
```

---

## ⚠️ **Important Notes**

### **About Taxonomy Fields:**

The JSON import **cannot include taxonomy fields** because:
1. Taxonomy fields require the taxonomy to exist first (✅ we have these)
2. The API/import doesn't support adding taxonomy fields directly
3. You'll still need to add taxonomy fields manually after import

### **After Import:**

1. ✅ Content types will be created
2. ✅ All basic fields will be there
3. ⏳ **You still need to add taxonomy fields via UI** (but it's easier now!)

---

## 🎯 **Recommended Workflow**

### **Step 1: Import Content Types (Choose One)**

**A) Via CLI:**
```bash
npm install -g @contentstack/cli
csdx auth:login
csdx cm:stacks:import --stack-api-key blt8202119c48319b1d --module content-types --content-types-only
```

**B) Via Our Script:**
```bash
npm run setup:contentstack
```

**C) Manual Creation in UI** (if above fail)

### **Step 2: Add Taxonomy Fields (Manual - 10 min)**

Once content types exist, add taxonomy fields to:

| Content Type | Taxonomy Fields to Add |
|--------------|------------------------|
| **qa_module** | QA Skills, Learning Path, Difficulty Level, Target Segment (4 fields) |
| **sop** | Related Skills, Target Segment (2 fields) |
| **qa_tool** | Tool Category, Target Segment (2 fields) |

**Use the table from:** `TAXONOMY_MANUAL_SETUP.md`

### **Step 3: Create Entries**

```bash
# If you used CLI/script, entries might already exist
# If not, run:
npm run setup:contentstack  # Creates entries
npm run cs:taxonomy-tag     # Tags entries with taxonomy
```

### **Step 4: Create Variants**

```bash
npm run cs:variants-create
```

### **Step 5: Test**

```bash
npm run cs:test
```

---

## 🔍 **Troubleshooting**

### **CLI Not Installed:**

```bash
npm install -g @contentstack/cli
```

### **Authentication Issues:**

```bash
csdx auth:logout
csdx auth:login
```

### **Import Fails:**

Use the manual script instead:
```bash
npm run setup:contentstack
```

### **Permission Issues:**

- Make sure your management token has full permissions
- Try regenerating the management token in Contentstack UI
- Settings → Tokens → Create New Management Token (all scopes)

---

## ✅ **Success Criteria**

After import, you should have:

- ✅ 5 content types visible in Contentstack
- ✅ All basic fields present
- ⏳ Need to add taxonomy fields (10 min)
- ⏳ Need to create entries (if not already created)

---

## 💡 **Best Path Forward**

Since taxonomy fields can't be imported via JSON, here's the simplest approach:

1. **Try CLI import first** (fastest if it works)
2. **If CLI fails**, use our script: `npm run setup:contentstack`
3. **Then add taxonomy fields manually** (10 min, unavoidable)
4. **Tag entries**: `npm run cs:taxonomy-tag`
5. **Done!**

---

## 📖 **Related Files**

- `contentstack-import.json` - Import file (this creates content types)
- `TAXONOMY_MANUAL_SETUP.md` - How to add taxonomy fields
- `FRESH_SETUP_COMPLETE.md` - Complete setup status

---

**Ready to import?** Try the CLI method first, it's the fastest! 🚀

```bash
npm install -g @contentstack/cli
csdx auth:login
csdx cm:stacks:import --stack-api-key blt8202119c48319b1d --module content-types
```

