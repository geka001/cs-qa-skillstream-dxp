# 📊 Taxonomy, Variants & Personalize - Current Status & Improvements

## 🔍 CURRENT STATUS

### ✅ What We HAVE Created in Contentstack

1. **Taxonomies** (4 taxonomies with ~30 terms):
   - ✅ `skill_level`: beginner, intermediate, advanced
   - ✅ `content_category`: product_knowledge, testing_strategy, automation, best_practices (with children)
   - ✅ `learner_segment`: rookie, at_risk, high_flyer
   - ✅ `product_team`: launch, data_insights, visual_builder, autodraft, dam

2. **Content Types** (6 content types):
   - ✅ `qa_training_module`
   - ✅ `quiz_item`
   - ✅ `qa_sop`
   - ✅ `qa_tool`
   - ✅ `manager_config`
   - ✅ `qa_user`

3. **Entries** (Currently):
   - ✅ Manager Configs (5)
   - ✅ QA Tools (15)
   - ✅ QA SOPs (7 correct ones)
   - ✅ Quiz Items (~14, MCP creating 136 more)
   - ✅ Training Modules (5 from Contentstack, rest in mockData)

### ❌ What We ARE NOT Using

| Feature | Status | Details |
|---------|--------|---------|
| **Taxonomy Fields** | ❌ NOT USED | Taxonomies exist but NOT linked to content type fields |
| **Contentstack Variants** | ❌ NOT USED | No variants created (using `target_segments` field instead) |
| **Contentstack Personalize** | ❌ NOT USED | No audiences/experiences configured |

---

## 🎯 HOW WE CURRENTLY DO PERSONALIZATION

### Our Custom Implementation (Code-based)

```typescript
// We filter content in code using JSON fields:
- target_segments: ["ROOKIE", "AT_RISK", "HIGH_FLYER"]
- target_teams: ["Launch", "Data & Insights", etc.]
- difficulty: "beginner" | "intermediate" | "advanced"
- mandatory: boolean
```

**Example from `lib/contentstack.ts`:**
```typescript
const filteredEntries = entries.filter(entry => {
  const targetTeams = JSON.parse(entry.target_teams);
  const targetSegments = JSON.parse(entry.target_segments);
  return targetSegments.includes(userSegment) && targetTeams.includes(userTeam);
});
```

**This works fine BUT doesn't leverage Contentstack's advanced features!**

---

## 🚀 IMPROVEMENTS NEEDED

### 🏷️ **1. TAXONOMY IMPLEMENTATION**

#### What to Do in Contentstack:
1. **Add Taxonomy Fields to Content Types**
   - Go to each content type (qa_training_module, qa_sop, qa_tool)
   - Add these taxonomy reference fields:
     - `skill_level_taxonomy` → References `skill_level` taxonomy
     - `category_taxonomy` → References `content_category` taxonomy
     - `segment_taxonomy` → References `learner_segment` taxonomy
     - `team_taxonomy` → References `product_team` taxonomy

2. **Tag All Entries**
   - For each module/SOP/tool entry:
     - Select appropriate taxonomy terms (e.g., "beginner", "launch", "rookie")
   - MCP can do this bulk tagging

#### What to Change in App:
```typescript
// BEFORE (Current):
filter(entry => JSON.parse(entry.target_segments).includes(userSegment))

// AFTER (With Taxonomy):
filter(entry => entry.segment_taxonomy?.includes('rookie'))
```

#### Benefits:
- ✅ Better content organization in Contentstack UI
- ✅ Hierarchical browsing (e.g., Product Knowledge → Launch → Modules)
- ✅ Multi-select filtering (e.g., show "beginner" OR "intermediate")
- ✅ Reusable tags across content types

---

### 🎨 **2. VARIANTS IMPLEMENTATION**

#### What Variants Would Replace:
Currently, we have 60+ modules with overlapping content for different segments:
- `mod-rookie-001` (ROOKIE version)
- `mod-atrisk-001` (AT_RISK version - same topic, simplified)
- `mod-hf-001` (HIGH_FLYER version - same topic, advanced)

#### What to Do in Contentstack:
1. **Create Variant Groups**
   - Variant Group: `learner_level`
   - Variants: `rookie_version`, `at_risk_version`, `high_flyer_version`

2. **Create Base Entries**
   - Create ONE base module: "Introduction to Contentstack Launch"
   - Add 3 variants to it:
     - Rookie Variant: Basic content + video
     - AT_RISK Variant: Simplified content + shorter video
     - High-Flyer Variant: Advanced content + deep-dive video

3. **Link Variants to Personalize Audiences**
   - Each variant shows based on user segment

#### What to Change in App:
```typescript
// BEFORE (Current):
// Fetch 60+ separate modules
const modules = await getCsModules(userTeam, userSegment);

// AFTER (With Variants):
// Fetch 20 base modules with variant resolution
const modules = await getCsModulesWithVariants(userTeam, userSegment);
// Contentstack automatically returns the correct variant
```

#### Benefits:
- ✅ Reduce entries from 60+ to ~20 base modules
- ✅ Single source of truth (update base, variants inherit)
- ✅ Automatic variant selection based on user profile
- ✅ A/B testing capabilities

---

### 🎯 **3. PERSONALIZE IMPLEMENTATION**

#### What to Do in Contentstack:
1. **Create Audiences** (User Segments)
   - Audience: `Rookie QA Engineers`
     - Rule: `user.segment == "ROOKIE"`
   - Audience: `At-Risk Learners`
     - Rule: `user.segment == "AT_RISK"`
   - Audience: `High-Flyer Engineers`
     - Rule: `user.segment == "HIGH_FLYER"`
   - Audience: `Launch Team`
     - Rule: `user.team == "Launch"`
   - Audience: `AutoDraft Team`
     - Rule: `user.team == "AutoDraft"`
   - ... (5 team audiences)

2. **Create Experiences** (Content Rules)
   - Experience: `Rookie Onboarding Path`
     - If user is `Rookie QA Engineers` + `Launch Team`
     - Show: Modules tagged with `rookie` + `launch`
   
   - Experience: `Remedial Training`
     - If user is `At-Risk Learners`
     - Show: Remedial modules + mandatory SOPs
   
   - Experience: `Advanced Track`
     - If user is `High-Flyer Engineers`
     - Show: Advanced modules + optional best practices

3. **Assign Experiences to Entries**
   - For each module/SOP/tool:
     - Select which experiences it belongs to
     - Contentstack automatically filters based on user profile

#### What to Change in App:
```typescript
// BEFORE (Current):
// Manual filtering in code
const modules = await getCsModules(userTeam, userSegment);

// AFTER (With Personalize):
// Contentstack does the filtering via Personalize API
const modules = await getPersonalizedModules({
  user_profile: {
    segment: user.segment,
    team: user.team,
    quiz_scores: user.quizScores
  }
});
// Returns ONLY modules matching the user's experiences
```

#### What to Send from App:
```typescript
// User profile for Personalize API
{
  "segment": "ROOKIE",
  "team": "Launch",
  "average_score": 75,
  "completed_modules": ["mod-launch-001", "mod-launch-002"],
  "onboarding_complete": false
}
```

#### Benefits:
- ✅ Zero filtering logic in app code
- ✅ Business users can change rules in Contentstack UI
- ✅ A/B testing and analytics
- ✅ Dynamic content based on user behavior
- ✅ Real-time rule updates without code deploy

---

## 📋 IMPLEMENTATION ROADMAP

### **Phase 1: Taxonomy** (Easiest, High Value)
**Effort**: Medium | **Impact**: High | **Time**: 1-2 hours

1. ✅ Taxonomies already created
2. ⚠️ Manually add taxonomy fields to content types in UI
3. 🤖 MCP can tag all entries with taxonomy terms
4. 💻 Update `lib/contentstack.ts` to read taxonomy fields
5. 🧹 Remove `target_segments` JSON field (optional)

**MCP Can Do:**
- Bulk tag entries with correct taxonomy terms

**We Need to Do:**
- Add taxonomy fields to content types (manual)
- Update app code to use taxonomy fields

---

### **Phase 2: Variants** (Medium Difficulty, Medium Value)
**Effort**: High | **Impact**: Medium | **Time**: 3-4 hours

1. Create variant groups in Contentstack
2. Consolidate 60+ modules into ~20 base modules
3. Create 3 variants per base module (rookie/at-risk/high-flyer)
4. Update app to fetch variants via Personalize API
5. Test variant switching based on user segment

**MCP Can Do:**
- Create variant groups
- Create base entries with variants

**We Need to Do:**
- Design which modules should have variants
- Update app to use Variants API
- Test variant resolution

---

### **Phase 3: Personalize** (Most Complex, Highest Value)
**Effort**: High | **Impact**: Highest | **Time**: 4-6 hours

1. **In Contentstack UI** (Manual):
   - Create 8 audiences (3 segments + 5 teams)
   - Create 4-5 experiences (rookie path, remedial, advanced, etc.)
   - Assign experiences to entries

2. **In App**:
   - Integrate Personalize API
   - Send user profile to Personalize
   - Remove all manual filtering logic
   - Update `lib/contentstack.ts` to use Personalize endpoints

3. **Testing**:
   - Test each user segment gets correct content
   - Verify segment changes (rookie → at-risk → high-flyer) trigger content updates

**MCP Can Do:**
- ❌ Cannot create audiences/experiences (UI-only)

**We Need to Do:**
- Manual setup in Contentstack Personalize UI
- App integration with Personalize API
- Extensive testing

---

## 💡 RECOMMENDATIONS

### **Option A: Quick Win (Start with Taxonomy)**
**Timeline**: 1-2 hours | **Effort**: Low | **Impact**: Medium

- Implement taxonomy only
- Keep current filtering logic as fallback
- Better content organization in Contentstack
- Easy to implement, low risk

### **Option B: Full Implementation (All 3)**
**Timeline**: 8-12 hours | **Effort**: High | **Impact**: Highest

- Implement taxonomy, variants, and personalize
- Remove all filtering logic from app
- Contentstack becomes the single source of truth
- Best long-term solution, but requires testing

### **Option C: Staged Rollout (Recommended)**
**Timeline**: Spread over multiple sessions | **Effort**: Medium | **Impact**: Highest

1. **Week 1**: Taxonomy (1-2 hours)
   - Add fields, tag entries, update app
   
2. **Week 2**: Variants (3-4 hours)
   - Create variants for high-value modules only
   - Test variant switching
   
3. **Week 3**: Personalize (4-6 hours)
   - Set up audiences/experiences
   - Integrate Personalize API
   - Remove manual filtering

---

## ❓ QUESTIONS TO ANSWER BEFORE STARTING

1. **Do you want to implement all 3 features?**
   - Yes → Choose Option B or C
   - No → Choose Option A (taxonomy only)

2. **Do you have access to Contentstack Personalize?**
   - Personalize is a premium add-on
   - Check if it's enabled in your stack

3. **Are you okay with manual UI work?**
   - Taxonomy fields: Must add in UI (cannot automate via API easily)
   - Personalize audiences: Must create in UI (no API support)
   - Variants: Can automate via MCP

4. **How much time do you want to invest?**
   - 1-2 hours → Taxonomy only
   - 4-6 hours → Taxonomy + Variants
   - 8-12 hours → Full implementation

---

## 🎯 MY RECOMMENDATION

**Start with Option A (Taxonomy Only)** because:
- ✅ Easiest to implement
- ✅ Immediate value (better content organization)
- ✅ Non-breaking change (keeps current filtering as fallback)
- ✅ Can add Variants/Personalize later

Then evaluate if Variants/Personalize add enough value for the effort.

---

## 📝 NEXT STEPS

**Let me know:**
1. Which option you prefer (A, B, or C)?
2. Do you have Contentstack Personalize enabled?
3. Should I prepare detailed instructions for your chosen option?

I'll then create:
- Detailed implementation steps
- MCP prompts for automation
- Code changes needed
- Testing checklist

