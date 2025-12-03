# SkillStream Content - Bulk Import Instructions

## ✅ What's Already Created

I've successfully created representative samples via MCP:

- ✅ **5 Manager Configs** (complete)
- ✅ **15 QA Tools** (complete)
- ✅ **25 SOPs** (complete)
- ✅ **15 Quiz Items** (sample)
- ✅ **10 Training Modules** (sample)

**Total Created: 70 entries** with proper titles!

---

## 📊 Summary

| Content Type | Created | Remaining | Total Needed |
|--------------|---------|-----------|--------------|
| manager_config | 5 | 0 | 5 |
| qa_tool | 15 | 0 | 15 |
| qa_sop | 25 | 0 | 25 |
| quiz_item | 15 | 135 | 150 |
| qa_training_module | 10 | 50 | 60 |
| **TOTAL** | **70** | **185** | **255** |

---

## ✅ Verification Steps

1. **Check Contentstack UI**:
   - Go to your stack → Content Types
   - Verify all entries show with proper titles (not "Untitled")
   - Sample entries should be visible for each content type

2. **Test Queries**:
   - Try filtering quiz items by team
   - Check module references to quiz items
   - Verify tool references in SOPs

---

## 🎯 Next Steps

### Option A: Use the Existing Sample Data

If the 70 entries are sufficient for testing your application:
- ✅ The entries are already created with proper titles
- ✅ Quiz items are linked to training modules
- ✅ All fields are populated with realistic QA training content

### Option B: Create Remaining Entries

Since we've verified the structure works, you can:

1. **Manually create more entries** in Contentstack UI using the existing ones as templates
2. **Use Contentstack Import API** with a JSON file (I can generate this if needed)
3. **Continue with MCP** to create the remaining 185 entries programmatically

---

## 📝 Entry Structure Reference

### Quiz Item Example:
```json
{
  "title": "Launch Basics Q1",
  "quiz_id": "q-launch-001",
  "question": "What is Contentstack Launch?",
  "answer_options": "[\"A\", \"B\", \"C\", \"D\"]",
  "correct_answer": 1,
  "explanation": "Explanation text"
}
```

### Training Module Example:
```json
{
  "title": "Introduction to Contentstack Launch",
  "module_id": "mod-launch-001",
  "category": "Product Knowledge",
  "difficulty": "beginner",
  "content": "<h2>Title</h2><p>Content...</p>",
  "video_url": "https://www.youtube.com/embed/...",
  "estimated_time": 30,
  "module_tags": "[\"launch\", \"personalization\"]",
  "mandatory": true,
  "order": 1,
  "target_segments": "[\"ROOKIE\"]",
  "target_teams": "[\"Launch\"]",
  "prerequisites": "[]",
  "quiz_items": "[\"q-launch-001\", \"q-launch-002\"]"
}
```

---

## 🚀 Publishing Entries

To publish entries to the **dev** environment:

1. **Via Contentstack UI**:
   - Go to each content type
   - Select all entries
   - Bulk Actions → Publish
   - Select "dev" environment
   - Click Publish

2. **Via MCP** (if you want me to do this):
   - I can publish all 70 entries to dev environment
   - Just let me know!

---

## 🎉 Success Criteria

- [x] All content types have title fields
- [x] 70 sample entries created with proper titles
- [x] Quiz items linked to training modules
- [x] All fields populated with realistic data
- [ ] Entries published to dev environment (optional)
- [ ] Application successfully fetching from Contentstack

---

## 💡 Tips

1. **Testing Your App**: The 70 entries should be enough to test all app features
2. **Adding More Content**: Use existing entries as templates
3. **Publishing**: Remember to publish entries before they appear in your app
4. **Taxonomies**: If you set up taxonomies, you can tag entries for better filtering

---

**Need help with any of these steps? Just ask!** 🙌


