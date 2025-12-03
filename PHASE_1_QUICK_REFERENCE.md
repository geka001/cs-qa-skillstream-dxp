# Quick Reference: Content Type Field Summary

## 📊 At-a-Glance Field List

### `qa_training_module` (16 fields)
| Field Name | Type | Mandatory | Unique | Notes |
|------------|------|-----------|--------|-------|
| title | Single Line Text | ✅ | ❌ | Module title |
| module_id | Single Line Text | ✅ | ✅ | e.g., "mod-launch-001" |
| category | Single Line Text | ❌ | ❌ | "Product Knowledge", etc. |
| difficulty | Select | ❌ | ❌ | beginner/intermediate/advanced |
| content | Rich Text | ❌ | ❌ | HTML content |
| video_url | Single Line Text | ❌ | ❌ | YouTube embed URL |
| estimated_time | Number | ❌ | ❌ | Minutes |
| tags | Multi-line Text | ❌ | ❌ | JSON array |
| mandatory | Boolean | ❌ | ❌ | Default: false |
| order | Number | ❌ | ❌ | Display sequence |
| target_segments | Multi-line Text | ❌ | ❌ | JSON array |
| target_teams | Multi-line Text | ❌ | ❌ | JSON array |
| prerequisites | Multi-line Text | ❌ | ❌ | JSON array of IDs |
| quiz_items | Modular Blocks | ❌ | ❌ | → quiz_item |
| skill_level | Taxonomy | ❌ | ❌ | Multiple ✅ |
| content_category | Taxonomy | ❌ | ❌ | Multiple ✅ |

### `quiz_item` (5 fields)
| Field Name | Type | Mandatory | Unique | Notes |
|------------|------|-----------|--------|-------|
| quiz_id | Single Line Text | ✅ | ✅ | e.g., "q1", "q2" |
| question | Single Line Text | ✅ | ❌ | Question text |
| options | Multi-line Text | ✅ | ❌ | JSON array (4 options) |
| correct_answer | Number | ✅ | ❌ | Index (0-3) |
| explanation | Multi-line Text | ❌ | ❌ | Why answer is correct |

### `qa_sop` (9 fields)
| Field Name | Type | Mandatory | Unique | Notes |
|------------|------|-----------|--------|-------|
| title | Single Line Text | ✅ | ❌ | SOP title |
| sop_id | Single Line Text | ✅ | ✅ | e.g., "sop-001" |
| criticality | Select | ❌ | ❌ | critical/high/medium/low |
| mandatory | Boolean | ❌ | ❌ | Default: false |
| steps | Multi-line Text | ✅ | ❌ | JSON array of steps |
| related_tools | Multi-line Text | ❌ | ❌ | JSON array of tool IDs |
| target_segments | Multi-line Text | ❌ | ❌ | JSON array |
| target_teams | Multi-line Text | ❌ | ❌ | JSON array |
| sop_category | Taxonomy | ❌ | ❌ | Multiple ✅ |

### `qa_tool` (10 fields)
| Field Name | Type | Mandatory | Unique | Notes |
|------------|------|-----------|--------|-------|
| name | Single Line Text | ✅ | ❌ | Tool name |
| tool_id | Single Line Text | ✅ | ✅ | e.g., "tool-001" |
| purpose | Multi-line Text | ❌ | ❌ | Description |
| docs_link | Single Line Text | ❌ | ❌ | Documentation URL |
| integrations | Multi-line Text | ❌ | ❌ | JSON array |
| category | Single Line Text | ❌ | ❌ | Tool category |
| target_segments | Multi-line Text | ❌ | ❌ | JSON array |
| target_teams | Multi-line Text | ❌ | ❌ | JSON array |
| is_generic | Boolean | ❌ | ❌ | Show to all teams? |
| tool_category | Taxonomy | ❌ | ❌ | Multiple ✅ |

### `manager_config` (3 fields)
| Field Name | Type | Mandatory | Unique | Notes |
|------------|------|-----------|--------|-------|
| team | Select | ✅ | ✅ | 5 options (teams) |
| manager_name | Single Line Text | ✅ | ❌ | Manager full name |
| manager_email | Single Line Text | ✅ | ❌ | Email address |

---

## 🎯 Total Count Summary

- **Content Types**: 5
- **Total Fields**: 43
- **Taxonomies**: 4
- **Taxonomy Terms**: ~30

---

## ⏱️ Estimated Setup Time

| Task | Time | Difficulty |
|------|------|------------|
| Create 4 Taxonomies | 15 min | Easy |
| Create quiz_item | 5 min | Easy |
| Create manager_config | 3 min | Easy |
| Create qa_tool | 8 min | Easy |
| Create qa_sop | 8 min | Medium |
| Create qa_training_module | 15 min | Medium |
| Add Taxonomy Fields | 10 min | Easy |
| **Total** | **~60 min** | **Medium** |

---

## 🚨 Critical Dependencies (Order Matters!)

```
1. Create Taxonomies (all 4)
   ↓
2. Create quiz_item (needed for modular blocks)
   ↓
3. Create qa_training_module (references quiz_item)
   ↓
4. Create qa_sop
   ↓
5. Create qa_tool
   ↓
6. Create manager_config
   ↓
7. Add Taxonomy Fields to all content types
```

---

## 📋 Copy-Paste Taxonomy Terms

### skill_level
```
Beginner
Intermediate
Advanced
```

### content_category (hierarchical - create parents first)
```
Product Knowledge
Testing Strategy
Automation
Best Practices
```
Then add children:
```
Product Knowledge → Launch
Product Knowledge → Data & Insights
Product Knowledge → Visual Builder
Product Knowledge → AutoDraft
Product Knowledge → DAM

Testing Strategy → Functional Testing
Testing Strategy → API Testing
Testing Strategy → Performance Testing
Testing Strategy → Accessibility Testing

Automation → Playwright
Automation → REST Assured
Automation → CI/CD

Best Practices → Bug Management
Best Practices → Documentation
Best Practices → Code Review
```

### sop_category
```
Bug Management
Testing Workflow
Environment Setup
Documentation
Communication
```

### tool_category
```
Project Management
API Testing
Automation Framework
Communication
Performance Testing
Browser Testing
```

---

## ✅ Phase 1 Completion Checklist

Print this and check off as you go:

**Taxonomies:**
- [ ] `skill_level` created (3 terms)
- [ ] `content_category` created (4 parent + 16 child = 20 terms)
- [ ] `sop_category` created (5 terms)
- [ ] `tool_category` created (6 terms)

**Content Types:**
- [ ] `quiz_item` created (5 fields)
- [ ] `manager_config` created (3 fields)
- [ ] `qa_tool` created (9 regular fields)
- [ ] `qa_sop` created (8 regular fields)
- [ ] `qa_training_module` created (13 regular fields + 1 modular block field)

**Taxonomy Field References:**
- [ ] `qa_training_module` → skill_level (multiple)
- [ ] `qa_training_module` → content_category (multiple)
- [ ] `qa_sop` → sop_category (multiple)
- [ ] `qa_tool` → tool_category (multiple)

**Modular Block References:**
- [ ] `qa_training_module` → quiz_items → quiz_item content type

**Environment:**
- [ ] `dev` environment exists

**Final Steps:**
- [ ] All content types published/enabled
- [ ] Test creating one sample entry in each content type
- [ ] Screenshot or export content type schemas for backup

---

**Once complete, you're ready for Phase 2 (MCP automation)!** 🎉

