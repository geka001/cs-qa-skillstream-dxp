# 🚀 Full Taxonomy Migration - Complete Implementation Plan

## 🎯 GOAL
Use Contentstack taxonomy fields everywhere instead of JSON strings, showcasing Contentstack's full capabilities.

---

## 📋 PHASE 1: Add Missing Taxonomy Fields (Manual UI Work)

### Step 1A: qa_training_module (Add 1 field)
**Current fields:**
- ✅ skill_level_taxonomy
- ✅ segment_taxonomy

**Need to add:**
- ➕ **team_taxonomy** (Field Type: Taxonomy, References: product_team)

**How to add:**
1. Go to Content Models → qa_training_module → Edit
2. Click "Add Field" → Select "Taxonomy"
3. Display Name: `team_taxonomy`
4. Field UID: `team_taxonomy`
5. Select Taxonomy: `product_team`
6. Allow Multiple: Yes
7. Save

---

### Step 1B: qa_sop (Add 2 fields)
**Current fields:**
- ✅ sop_category

**Need to add:**
- ➕ **segment_taxonomy** (Field Type: Taxonomy, References: learner_segment)
- ➕ **team_taxonomy** (Field Type: Taxonomy, References: product_team)

**How to add:**
1. Go to Content Models → qa_sop → Edit
2. Add Field → Taxonomy
   - Display Name: `segment_taxonomy`
   - Field UID: `segment_taxonomy`
   - Select Taxonomy: `learner_segment`
   - Allow Multiple: Yes
3. Add Field → Taxonomy
   - Display Name: `team_taxonomy`
   - Field UID: `team_taxonomy`
   - Select Taxonomy: `product_team`
   - Allow Multiple: Yes
4. Save

---

### Step 1C: qa_tool (Add 2 fields)
**Current fields:**
- ✅ tool_category

**Need to add:**
- ➕ **segment_taxonomy** (Field Type: Taxonomy, References: learner_segment)
- ➕ **team_taxonomy** (Field Type: Taxonomy, References: product_team)

**How to add:**
Same as qa_sop above.

---

## 📝 PHASE 2: Tag All New Fields (Manual Entry Work)

### Step 2A: Tag Modules with team_taxonomy (27 entries)

```markdown
# Launch Team Modules (3 entries)
1. Introduction to Contentstack Launch → team_taxonomy: [launch]
2. Advanced Launch Features → team_taxonomy: [launch]
3. Launch Analytics & Reporting → team_taxonomy: [launch]

# Data & Insights Team (2 entries)
4. Introduction to Data & Insights → team_taxonomy: [data_insights]
5. Advanced Analytics with D&I → team_taxonomy: [data_insights]

# Visual Builder Team (2 entries)
6. Introduction to Visual Builder → team_taxonomy: [visual_builder]
7. Advanced Visual Builder → team_taxonomy: [visual_builder]

# AutoDraft Team (3 entries)
8. Introduction to AutoDraft → team_taxonomy: [autodraft]
9. Advanced AutoDraft Features → team_taxonomy: [autodraft]
10. AutoDraft API Testing → team_taxonomy: [autodraft]

# DAM Team (3 entries)
11. Introduction to DAM → team_taxonomy: [dam]
12. Advanced DAM Operations → team_taxonomy: [dam]
13. DAM Performance Optimization → team_taxonomy: [dam]

# Generic Modules (14 entries - ALL teams)
14-27. All AT_RISK, HIGH_FLYER, and generic modules:
→ team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam] (select all 5)
```

---

### Step 2B: Tag SOPs with segment_taxonomy + team_taxonomy (7 entries)

```markdown
1. Test Case Documentation Standard (sop-001)
   - segment_taxonomy: [rookie, at_risk, high_flyer] (all 3)
   - team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam] (all 5)

2. Bug Reporting Guidelines (sop-002)
   - segment_taxonomy: [rookie, at_risk, high_flyer]
   - team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam]

3. Code Review Checklist for QA (sop-003)
   - segment_taxonomy: [rookie]
   - team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam]

4. Performance Testing Protocol (sop-004)
   - segment_taxonomy: [high_flyer]
   - team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam]

5. Environment Setup Guide (sop-005)
   - segment_taxonomy: [rookie, at_risk, high_flyer]
   - team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam]

6. Sprint Planning Participation (sop-006)
   - segment_taxonomy: [rookie, high_flyer]
   - team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam]

7. Test Environment Maintenance (sop-007)
   - segment_taxonomy: [rookie, at_risk, high_flyer]
   - team_taxonomy: [launch, data_insights, visual_builder, autodraft, dam]
```

---

### Step 2C: Tag Tools with segment_taxonomy + team_taxonomy (15 entries)

```markdown
# Generic Tools (6 entries - all teams, all segments)
1. Jira → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5 teams]
2. Confluence → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5]
3. Slack → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5]
4. Git → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5]
5. Selenium → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5]
6. JMeter → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5]

# Team-Specific Tools
7. Playwright → segment_taxonomy: [rookie, high_flyer], team_taxonomy: [all 5 teams]
8. REST Assured → segment_taxonomy: [rookie, high_flyer], team_taxonomy: [autodraft, dam]
9. GoCD → segment_taxonomy: [rookie, high_flyer], team_taxonomy: [all 5]
10. Jenkins → segment_taxonomy: [rookie, high_flyer], team_taxonomy: [all 5]
11. Postman → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5]
12. BrowserStack → segment_taxonomy: [rookie, high_flyer], team_taxonomy: [all 5]
13. Cypress → segment_taxonomy: [high_flyer], team_taxonomy: [visual_builder, launch]
14. GraphQL Playground → segment_taxonomy: [high_flyer], team_taxonomy: [launch, visual_builder]
15. TestRail → segment_taxonomy: [rookie, at_risk, high_flyer], team_taxonomy: [all 5]
```

---

## 💻 PHASE 3: Update App Code

### File 1: lib/contentstack.ts

#### Change 1: Add Helper Function for Case Mapping
```typescript
/**
 * Map app segment/team names to taxonomy term UIDs
 */
function mapToTaxonomyTerm(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '_').replace(/&/g, '');
}

// Examples:
// "ROOKIE" → "rookie"
// "Launch" → "launch"
// "Data & Insights" → "data_insights"
```

#### Change 2: Update getCsModules()
```typescript
// BEFORE
const filteredEntries = entries.filter(entry => {
  const targetTeams = safeJsonParse<Team[]>(entry.target_teams, []);
  const targetSegments = safeJsonParse<UserSegment[]>(entry.target_segments, []);
  
  const teamMatch = targetTeams.length === 0 || targetTeams.includes(userTeam);
  const segmentMatch = targetSegments.includes(userSegment);
  
  return teamMatch && segmentMatch;
});

// AFTER
const filteredEntries = entries.filter(entry => {
  const targetTeams = entry.team_taxonomy || [];
  const targetSegments = entry.segment_taxonomy || [];
  
  const userTeamTerm = mapToTaxonomyTerm(userTeam); // "Launch" → "launch"
  const userSegmentTerm = mapToTaxonomyTerm(userSegment); // "ROOKIE" → "rookie"
  
  const teamMatch = targetTeams.length === 0 || targetTeams.includes(userTeamTerm);
  const segmentMatch = targetSegments.includes(userSegmentTerm);
  
  return teamMatch && segmentMatch;
});
```

#### Change 3: Update Module Mapping
```typescript
// BEFORE
return {
  id: entry.module_id || entry.uid,
  title: entry.title,
  content: entry.content || '',
  category: entry.category,
  videoUrl: entry.video_url || '',
  difficulty: entry.difficulty as 'beginner' | 'intermediate' | 'advanced', // Plain text
  // ... rest
};

// AFTER
return {
  id: entry.module_id || entry.uid,
  title: entry.title,
  content: entry.content || '',
  category: entry.category,
  videoUrl: entry.video_url || '',
  difficulty: (entry.skill_level_taxonomy?.[0] || 'beginner') as 'beginner' | 'intermediate' | 'advanced', // From taxonomy!
  // ... rest
};
```

#### Change 4: Update getCsSOPs()
```typescript
// BEFORE
return entries
  .filter(entry => {
    const targetSegments = safeJsonParse<UserSegment[]>(entry.target_segments, []);
    const targetTeams = safeJsonParse<Team[]>(entry.target_teams, []);
    return targetSegments.includes(userSegment) && 
           (targetTeams.length === 0 || targetTeams.includes(userTeam));
  })

// AFTER
return entries
  .filter(entry => {
    const targetSegments = entry.segment_taxonomy || [];
    const targetTeams = entry.team_taxonomy || [];
    
    const userTeamTerm = mapToTaxonomyTerm(userTeam);
    const userSegmentTerm = mapToTaxonomyTerm(userSegment);
    
    return targetSegments.includes(userSegmentTerm) && 
           (targetTeams.length === 0 || targetTeams.includes(userTeamTerm));
  })
```

#### Change 5: Update getCsTools()
```typescript
// BEFORE
return entries
  .filter(entry => {
    const targetTeams = safeJsonParse<Team[]>(entry.target_teams, []);
    return entry.is_generic || targetTeams.includes(userTeam);
  })

// AFTER
return entries
  .filter(entry => {
    const targetTeams = entry.team_taxonomy || [];
    const userTeamTerm = mapToTaxonomyTerm(userTeam);
    
    return entry.is_generic || targetTeams.includes(userTeamTerm);
  })
```

---

### File 2: TypeScript Interfaces (types.ts or similar)

Update the interfaces to match Contentstack response:

```typescript
// Add to Contentstack response types
interface CsTrainingModule {
  uid: string;
  title: string;
  content: string;
  video_url?: string;
  skill_level_taxonomy?: string[]; // NEW!
  segment_taxonomy?: string[];     // NEW!
  team_taxonomy?: string[];        // NEW!
  // Remove these old fields (optional):
  // difficulty?: string;
  // target_segments?: string;
  // target_teams?: string;
}
```

---

## ✅ PHASE 4: Testing Checklist

### Test 1: Modules Filtering
- [ ] Login as Launch ROOKIE → See Launch + generic modules
- [ ] Complete quiz (fail) → See AT_RISK modules
- [ ] Complete quiz (high score) → See HIGH_FLYER modules
- [ ] Switch teams → See team-specific modules

### Test 2: SOPs Filtering
- [ ] ROOKIE user → See rookie SOPs
- [ ] AT_RISK user → See at_risk SOPs
- [ ] HIGH_FLYER user → See high_flyer SOPs

### Test 3: Tools Filtering
- [ ] Launch team → See generic + Launch tools
- [ ] AutoDraft team → See REST Assured
- [ ] DAM team → See REST Assured

### Test 4: Backward Compatibility
- [ ] Check console for errors
- [ ] Verify no entries are missing taxonomy
- [ ] Confirm all filtering works

---

## 📊 EFFORT ESTIMATE

| Phase | Task | Time | Difficulty |
|-------|------|------|------------|
| 1 | Add taxonomy fields (UI) | 15 min | Easy |
| 2 | Tag entries manually | 30 min | Easy |
| 3 | Update code | 30 min | Medium |
| 4 | Testing | 15 min | Easy |
| **TOTAL** | | **90 min** | **Medium** |

---

## 🎯 BENEFITS OF FULL MIGRATION

### Immediate Benefits:
✅ **Cleaner code** - No more `JSON.parse()` everywhere
✅ **Single source of truth** - Taxonomy fields only
✅ **Type safety** - Arrays instead of JSON strings
✅ **Performance** - No JSON parsing overhead
✅ **Contentstack showcase** - Proper feature usage

### Future Benefits:
✅ **Variants ready** - Can easily add content variants
✅ **Personalize ready** - Can use Personalize API
✅ **Better reporting** - Contentstack analytics on taxonomy usage
✅ **Easier maintenance** - One field to update, not JSON + taxonomy

---

## 🚀 EXECUTION ORDER

### Start Now:
1. **Add taxonomy fields** (Phase 1) - 15 minutes
2. **Tag entries** (Phase 2) - 30 minutes
   - I'll create a detailed tagging guide for new fields
3. **Update code** (Phase 3) - 30 minutes
   - I'll implement all code changes
4. **Test** (Phase 4) - 15 minutes

---

## 💡 READY TO START?

**Next Steps:**
1. You add the missing taxonomy fields (Phase 1)
2. I'll create a detailed tagging guide for the new fields
3. You tag the entries
4. I'll update the code
5. We test together

**Should I wait for you to add the fields, or do you want me to create the tagging guide first so you can do both at once?**

Let me know when you're ready to start Phase 1! 🚀

