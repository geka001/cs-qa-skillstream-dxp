# 🤖 MCP Instructions - Complete Module & Quiz Migration

## 📋 Current Status

✅ **Content Types Created** (Phase 1 complete)
- qa_training_module
- quiz_item  
- qa_tool
- qa_sop
- manager_config
- qa_user

✅ **Partial Entries Created**:
- 20 training modules (need 40+ more)
- 25 quiz items (need 125+ more)

---

## 🎯 TASK 1: Complete Training Modules (40+ More Needed)

### MCP Prompt:

```
Please create the remaining 40+ training module entries in Contentstack for the content type 'qa_training_module'.

Based on the existing 20 modules you've created, continue with the same pattern for the remaining teams and content areas. Here's what I need:

**Teams to Cover** (ensure each team has comprehensive modules):
1. Launch Team - Continue with advanced modules
2. Data & Insights Team - Create full learning path
3. Visual Builder Team - Create full learning path
4. AutoDraft Team - Create full learning path  
5. DAM (Digital Asset Management) Team - Create full learning path

**Module Categories** (ensure good distribution):
- Product Knowledge (core product features)
- Testing Fundamentals
- Automation & Tools
- Best Practices
- Advanced Topics
- Remedial (for AT_RISK users)
- High-Flyer (advanced content)

**Required Fields for Each Module**:
- title: Clear, descriptive title
- module_id: Unique ID (e.g., "mod-launch-002", "mod-data-001")
- category: One of the categories above
- content: Detailed HTML content explaining the topic (2-3 paragraphs minimum)
- video_url: Use relevant YouTube embed URLs (educational QA/testing content)
- difficulty: "beginner", "intermediate", or "advanced"
- estimated_time: 20, 30, 45, or 60 minutes
- mandatory: true for first 3-4 modules per team, false for others
- order: Sequential numbering (1, 2, 3...)
- prerequisites: JSON array of module_ids (e.g., ["mod-launch-001"])
- quiz_items: JSON array of 3-5 quiz IDs (e.g., ["q-launch-003", "q-launch-004"])
- target_segments: JSON array - ["ROOKIE"] for basics, ["ROOKIE", "HIGH_FLYER"] for advanced
- target_teams: JSON array - ["Launch"] or specific teams
- module_tags: JSON array of relevant tags

**Distribution Guidelines**:
- Launch: 12-15 modules (already has some, add more advanced ones)
- Data & Insights: 10-12 modules
- Visual Builder: 10-12 modules
- AutoDraft: 8-10 modules
- DAM: 8-10 modules
- Remedial (cross-team): 5 modules
- High-Flyer (cross-team): 5 modules

**After Creating**:
- Publish ALL entries to the 'dev' environment
- Verify that all required fields are filled
- Ensure quiz_items reference valid quiz IDs
```

---

## 🎯 TASK 2: Complete Quiz Items (125+ More Needed)

### MCP Prompt:

```
Please create 125+ additional quiz item entries in Contentstack for the content type 'quiz_item'.

**Requirements**:
1. Create quiz questions for ALL the training modules (each module needs 3-5 questions)
2. Each quiz must have a unique quiz_id that matches the module's quiz_items field

**Quiz ID Naming Convention**:
- Launch quizzes: q-launch-001, q-launch-002, q-launch-003...
- Data quizzes: q-data-001, q-data-002...
- Visual Builder quizzes: q-vb-001, q-vb-002...
- AutoDraft quizzes: q-autodraft-001, q-autodraft-002...
- DAM quizzes: q-dam-001, q-dam-002...
- Remedial quizzes: q-remedial-001, q-remedial-002...
- High-Flyer quizzes: q-advanced-001, q-advanced-002...

**Required Fields for Each Quiz Question**:
- title: Short identifier (e.g., "Launch Q1", "Data Q2")
- quiz_id: Unique ID matching the naming convention above
- question: Clear, specific question about the module content
- answer_options: JSON array of 4 options (strings)
- correct_answer: Index of correct answer (0, 1, 2, or 3)
- explanation: Why the answer is correct (1-2 sentences)

**Question Types to Include**:
- Concept understanding (What is X?)
- Practical application (How would you...?)
- Best practices (What's the best way to...?)
- Troubleshooting (If X happens, what should you do?)
- Tool usage (Which tool would you use for...?)

**Quality Guidelines**:
- Make questions specific and practical
- Avoid trick questions
- Provide clear explanations
- Cover key topics from each module
- Mix difficulty levels

**After Creating**:
- Publish ALL entries to the 'dev' environment
- Verify that quiz_ids match module references
- Test a few quiz flows to ensure they work
```

---

## 🎯 TASK 3: Verify & Test

### MCP Prompt:

```
Please verify the following:

1. **Total Counts**:
   - Training Modules: Should have 60+ total
   - Quiz Items: Should have 150+ total

2. **Publishing Status**:
   - ALL entries must be published to 'dev' environment
   - Verify by checking publish_details field

3. **Reference Integrity**:
   - Each module's quiz_items array should reference existing quiz_ids
   - Check that all quiz_ids in modules exist as quiz_item entries

4. **Team Distribution**:
   - Verify each team has sufficient modules (8-15 each)
   - Verify mix of mandatory/optional modules
   - Verify presence of remedial and high-flyer content

5. **Data Quality**:
   - All required fields filled (no empty strings)
   - JSON fields properly formatted
   - Video URLs are valid
   - Difficulty levels appropriate

Please provide a summary report of:
- Total entries created
- Entries per team
- Any missing or problematic entries
- Publishing status
```

---

## 📊 Expected Outcome

After MCP completes these tasks:

### Training Modules:
```
✅ Total: 60+ modules
├── Launch: 12-15 modules
├── Data & Insights: 10-12 modules
├── Visual Builder: 10-12 modules
├── AutoDraft: 8-10 modules
├── DAM: 8-10 modules
├── Remedial: 5 modules (AT_RISK content)
└── High-Flyer: 5 modules (advanced content)
```

### Quiz Items:
```
✅ Total: 150+ quiz questions
├── 3-5 questions per module
├── Covering all module topics
└── Mix of difficulty levels
```

### Publishing Status:
```
✅ ALL entries published to 'dev' environment
✅ All references valid
✅ Ready for application to fetch
```

---

## 🧪 Testing After Completion

Once MCP completes all tasks, test the migration:

1. **Run Check Script**:
```bash
npm run cs:check-modules
```

Should show:
```
✅ Found 60+ published training modules
✅ Found 150+ published quiz items
✅ MODULES ARE READY FOR MIGRATION!
✅ QUIZ ITEMS ARE READY FOR MIGRATION!
```

2. **Test in Application**:
   - Refresh browser
   - Login as different teams (Launch, Data & Insights, etc.)
   - Verify modules load from Contentstack
   - Check console: "✅ Using X modules from Contentstack"
   - Complete a module and take quiz
   - Verify quiz questions display correctly

3. **Verify Data**:
   - Each team sees only their modules
   - ROOKIE sees basic modules
   - HIGH_FLYER sees advanced content
   - AT_RISK sees remedial modules
   - Quiz questions match module content

---

## ✅ Migration Implementation Status

**Already Implemented** (Ready to use once MCP completes entries):
- ✅ `getCsModules()` function in `lib/contentstack.ts`
- ✅ `getCsQuizItems()` function in `lib/contentstack.ts`
- ✅ `getPersonalizedContentAsync()` in `mockData.ts`
- ✅ Dashboard updated to use async function
- ✅ Fallback to mockData if Contentstack unavailable
- ✅ Console logging for debugging

**What Happens When MCP Completes**:
1. Run `npm run cs:check-modules` to verify
2. Restart dev server: `npm run dev`
3. Application automatically fetches from Contentstack
4. No code changes needed!

---

## 🎯 Summary for MCP

**Please complete in this order**:
1. **Create 40+ more training modules** (diverse teams & content)
2. **Create 125+ more quiz questions** (3-5 per module)
3. **Publish ALL entries** to dev environment
4. **Verify integrity** (references, data quality)
5. **Provide completion report**

**Key Points**:
- Follow existing naming conventions
- Maintain reference integrity (quiz_ids match)
- Publish everything to 'dev'
- Cover all 5 teams comprehensively
- Include remedial and high-flyer content

Once complete, the application will automatically use Contentstack data! 🎉


