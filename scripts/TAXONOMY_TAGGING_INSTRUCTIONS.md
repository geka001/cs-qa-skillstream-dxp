# 🎯 Bulk Taxonomy Tagging - Setup & Usage

## ✅ Test Results

**MCP Limitation Confirmed:**
- ✅ Can create entries without taxonomies
- ❌ Cannot create/update entries with taxonomies via MCP
- ❌ Error: "Error in fetching Terms" (error code 121)

**Conclusion:** MCP tools do not currently support taxonomy field updates.

---

## 🛠️ Solution: Node.js Script

I've created a script that uses the official Contentstack Management SDK to bulk tag all 20 training modules.

---

## 📋 Prerequisites

1. Node.js installed (v14 or higher)
2. Contentstack credentials:
   - Email
   - Password
   - Stack API Key
   - Management Token

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp
npm install @contentstack/management dotenv
```

### Step 2: Create `.env` File

Create a `.env` file in the project root with your credentials:

```bash
# .env
CS_EMAIL=your-email@example.com
CS_PASSWORD=your-password
CS_API_KEY=blt... (your stack API key)
CS_MANAGEMENT_TOKEN=cs... (your management token)
```

**⚠️ Important:** Add `.env` to your `.gitignore` to keep credentials secure!

### Step 3: Get Your Credentials

#### Stack API Key:
1. Go to Contentstack → **Settings** → **Stack Settings**
2. Copy your **Stack API Key**

#### Management Token:
1. Go to Contentstack → **Settings** → **Tokens**
2. Click **+ Management Token**
3. Name it "Bulk Taxonomy Tagger"
4. Grant permissions: **Read** and **Write** for **Entries**
5. Save and copy the token

---

## ▶️ Run the Script

```bash
node scripts/bulk-taxonomy-tagger.js
```

---

## 📊 What the Script Does

For each of the 20 training modules, it will:

1. ✅ Fetch the entry
2. ✅ Update taxonomy fields:
   - `skill_level`: beginner/intermediate/advanced (based on `difficulty` field)
   - `user_segment`: rookie/at_risk/high_flyer (based on `target_segments` field)
3. ✅ Publish to `dev` environment
4. ✅ Show progress in console

---

## 📋 Complete Mapping

| Module | Skill Level | User Segment |
|--------|-------------|--------------|
| DAM Advanced | intermediate | high_flyer |
| AutoDraft Advanced | intermediate | high_flyer |
| Visual Builder Advanced | intermediate | high_flyer |
| Data & Insights Advanced | intermediate | high_flyer |
| Bug Reporting | beginner | rookie, at_risk |
| Test Automation Intro | intermediate | rookie, high_flyer |
| AutoDraft Basics | beginner | rookie |
| Data & Insights Basics | beginner | rookie |
| CI/CD | advanced | high_flyer |
| Remedial Fundamentals | beginner | at_risk |
| Performance Testing | intermediate | high_flyer |
| Test Coverage | intermediate | high_flyer |
| Launch Intro | beginner | rookie |
| Advanced Playwright | advanced | high_flyer |
| Test Strategy | intermediate | high_flyer |
| Advanced Launch | intermediate | high_flyer |
| QA Tools | beginner | rookie |
| API Testing | beginner | rookie, at_risk |
| DAM Basics | beginner | rookie |
| Visual Builder Basics | beginner | rookie |

---

## 🎯 Expected Output

```
🚀 Starting Bulk Taxonomy Tagging...

Stack API Key: blt1234567...
Content Type: qa_training_module
Total Modules: 20

Tagging: DAM Advanced Asset Management (blta0422de3287e017b)
✅ Successfully tagged: DAM Advanced Asset Management
✅ Published to dev: DAM Advanced Asset Management

...

============================================================
📊 TAGGING SUMMARY
============================================================
✅ Successfully tagged: 20/20
❌ Failed: 0/20

✅ Bulk tagging complete!
```

---

## 🆘 Troubleshooting

### Error: "Cannot find module @contentstack/management"
```bash
npm install @contentstack/management
```

### Error: "Authentication failed"
- Check your email and password in `.env`
- Verify management token has correct permissions

### Error: "Entry not found"
- Verify entry UIDs in the script match your stack
- Check branch is set to `main`

### Error: "Taxonomy not found"
- Ensure `skill_level` and `user_segment` taxonomies exist
- Verify terms exist: beginner, intermediate, advanced, rookie, at_risk, high_flyer

---

## 🔄 Alternative: Manual UI Tagging

If you prefer manual tagging, use this reference:

**Beginner + Rookie (6 modules):**
- Launch Intro
- AutoDraft Basics
- Data & Insights Basics
- QA Tools
- DAM Basics
- Visual Builder Basics

**Beginner + At Risk (1 module):**
- Remedial Fundamentals

**Beginner + Rookie + At Risk (2 modules):**
- Bug Reporting
- API Testing

**Intermediate + High Flyer (8 modules):**
- DAM Advanced, AutoDraft Advanced, Visual Builder Advanced, Data & Insights Advanced
- Performance Testing, Test Coverage, Test Strategy, Advanced Launch

**Intermediate + Rookie + High Flyer (1 module):**
- Test Automation Intro

**Advanced + High Flyer (3 modules):**
- CI/CD, Advanced Playwright

---

## ✅ Verify Results

After running the script:

1. Go to Contentstack → **Entries** → **QA Training Module**
2. Open any entry
3. Check the **Taxonomy** field
4. You should see tags like:
   - **Skill Level**: Beginner/Intermediate/Advanced
   - **User Segment**: Rookie/At Risk/High Flyer

---

**Ready to run?** Just install dependencies and execute the script! 🚀

