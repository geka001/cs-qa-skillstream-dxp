# 📋 Questions & Implementation Guide

## 🐛 Issue 1: Video Modal Flickering

### Problem:
Video screen appears → disappears → appears again

### Root Cause:
Likely caused by `useEffect` hooks triggering state updates when switching to video tab, causing re-renders.

### Fix:
The `markVideoWatched` useEffect is triggering after 3 seconds, which might cause a state update that re-renders the component.

**Solution:** Add a ref to prevent multiple calls.

---

## 📊 Issue 2: Analytics Page - Empty Blocks

### Problem:
Weekly Activity and Segment Journey blocks are showing but empty/placeholder

### Current State:
These are hardcoded placeholders in the analytics panel. They need to be populated with real data.

**Weekly Activity:** Should show user's activity over the past 7 days
**Segment Journey:** Should show the user's segment changes over time (ROOKIE → AT_RISK → HIGH_FLYER)

### Fix Needed:
Remove placeholder data and use real user data from `user.segmentHistory` and activity tracking.

---

## 🏷️ Question: How is Taxonomy Being Used?

### Current Implementation:

#### 1. **Content Filtering (Primary Use)**
Taxonomy is used to filter which modules/SOPs/tools a user sees:

```typescript
// In Contentstack entries:
segment_taxonomy: ["Rookie", "High flyer"]
team_taxonomy: ["Launch", "DAM"]

// In app code (lib/contentstack.ts):
// Filters modules by matching user's segment and team
const filteredModules = entries.filter(entry => {
  const teamMatch = taxonomyIncludes(entry.team_taxonomy, userTeam);
  const segmentMatch = taxonomyIncludes(entry.segment_taxonomy, userSegment);
  return teamMatch && segmentMatch;
});
```

**Example:**
- User: Launch team, ROOKIE segment
- Sees: Modules tagged with `team_taxonomy: ["Launch"]` AND `segment_taxonomy: ["Rookie"]`

---

#### 2. **Skill Level Classification**
```typescript
skill_level_taxonomy: ["beginner"] // From skill_level taxonomy
```
- Used to set module difficulty
- Displayed as badges in UI
- Used for sorting/grouping

---

#### 3. **Content Organization in Contentstack**
```typescript
sop_category: ["bug_management", "documentation"] // From sop_category taxonomy
tool_category: ["api_testing"] // From tool_category taxonomy
```
- Better organization in Contentstack UI
- Allows filtering in Contentstack interface
- Can be used for reporting

---

### What Taxonomy Does NOT Do (Yet):

❌ **Not Used for:**
- Content variants (same module, different versions)
- A/B testing
- Automatic personalization rules
- Dynamic audience targeting

---

## 🎯 How to Implement Variants

### What are Variants?

**Current Problem:**
- You have 60+ modules with duplicate content for different segments
- Example:
  - `mod-rookie-001` - "Test Planning" for ROOKIE
  - `mod-atrisk-001` - "Test Planning" for AT_RISK (simplified version)
  - `mod-hf-001` - "Test Planning" for HIGH_FLYER (advanced version)

**With Variants:**
- Create 1 base module: "Test Planning"
- Add 3 variants:
  - Rookie variant (basic content)
  - AT_RISK variant (remedial content)
  - High-Flyer variant (advanced content)

---

### Implementation Steps:

#### Step 1: Create Variant Group in Contentstack (Manual)
1. Go to **Settings** → **Variants** → **Create Variant Group**
2. Name: `learner_level_variants`
3. Add variants:
   - `rookie_version` (Default)
   - `at_risk_version`
   - `high_flyer_version`

---

#### Step 2: Add Variant Field to Content Type
1. Go to **Content Models** → **qa_training_module**
2. Add new field:
   - Field Type: **Variant**
   - Display Name: `Content Variant`
   - UID: `content_variant`
   - Variant Group: `learner_level_variants`

---

#### Step 3: Create Base Module with Variants
1. Create base module: "Test Planning Fundamentals"
2. Fill in common fields (title, category, etc.)
3. For `content` field, create 3 variants:
   - **Default (rookie_version)**: Basic content
   - **at_risk_version**: Simplified, step-by-step content
   - **high_flyer_version**: Advanced, complex scenarios

---

#### Step 4: Update App Code to Request Variants

**Current code (lib/contentstack.ts):**
```typescript
await fetchFromContentstack<ModuleEntry>('qa_training_module');
```

**With Variants:**
```typescript
await fetchFromContentstack<ModuleEntry>('qa_training_module', {
  query: JSON.stringify({
    variant: getVariantForSegment(userSegment) // "rookie_version", "at_risk_version", etc.
  })
});

function getVariantForSegment(segment: UserSegment): string {
  const variantMap = {
    'ROOKIE': 'rookie_version',
    'AT_RISK': 'at_risk_version',
    'HIGH_FLYER': 'high_flyer_version'
  };
  return variantMap[segment] || 'rookie_version';
}
```

---

#### Benefits of Variants:
- ✅ Reduce entries from 60 to ~20
- ✅ Single source of truth (update once, affects all variants)
- ✅ Easier content management
- ✅ Better content reuse

---

## 🎭 How to Implement Personalize

### What is Personalize?

**Contentstack Personalize** is a feature that automatically delivers different content to different users based on rules you define in the Contentstack UI.

---

### Implementation Steps:

#### Step 1: Create Audiences (In Contentstack UI)
1. Go to **Personalize** → **Audiences** → **Create Audience**

Create these audiences:

**Audience 1: Rookie QA Engineers**
```json
{
  "name": "Rookie QA Engineers",
  "rules": {
    "segment": "ROOKIE"
  }
}
```

**Audience 2: At-Risk Learners**
```json
{
  "name": "At-Risk Learners",
  "rules": {
    "segment": "AT_RISK"
  }
}
```

**Audience 3: High-Flyer Engineers**
```json
{
  "name": "High-Flyer Engineers",
  "rules": {
    "segment": "HIGH_FLYER"
  }
}
```

**Audience 4: Launch Team**
```json
{
  "name": "Launch Team",
  "rules": {
    "team": "Launch"
  }
}
```

(Repeat for all 5 teams)

---

#### Step 2: Create Experiences (In Contentstack UI)
1. Go to **Personalize** → **Experiences** → **Create Experience**

**Experience 1: Rookie Onboarding Path**
```json
{
  "name": "Rookie Onboarding Path",
  "audience": "Rookie QA Engineers + Launch Team",
  "content": "Show modules tagged with rookie + launch"
}
```

**Experience 2: Remedial Training**
```json
{
  "name": "Remedial Training",
  "audience": "At-Risk Learners",
  "content": "Show AT_RISK modules + mandatory SOPs"
}
```

**Experience 3: Advanced Track**
```json
{
  "name": "Advanced Track",
  "audience": "High-Flyer Engineers",
  "content": "Show HIGH_FLYER modules + optional advanced content"
}
```

---

#### Step 3: Assign Experiences to Entries
For each module in Contentstack:
1. Edit module entry
2. Go to **Personalize** tab
3. Select which experiences this module belongs to

Example:
- Module: "Advanced Launch Analytics"
  - Experiences: `Advanced Track` only

---

#### Step 4: Update App Code to Use Personalize API

**Current code:**
```typescript
// Manual filtering in app
const modules = await getCsModules(userTeam, userSegment);
```

**With Personalize:**
```typescript
// Contentstack does the filtering
const modules = await getPersonalizedModules({
  user_profile: {
    segment: user.segment,
    team: user.team,
    onboardingComplete: user.onboardingComplete
  }
});
```

**New Personalize Service:**
```typescript
// lib/contentstack-personalize.ts
export async function getPersonalizedModules(userProfile: {
  segment: UserSegment;
  team: Team;
  onboardingComplete: boolean;
}) {
  const response = await axios.post(
    `${API_BASE}/v3/personalize`,
    {
      content_type_uid: 'qa_training_module',
      user_profile: {
        segment: userProfile.segment.toLowerCase(),
        team: userProfile.team.toLowerCase().replace(/\s+/g, '_'),
        onboarding_complete: userProfile.onboardingComplete
      }
    },
    {
      headers: {
        'api_key': CONFIG.apiKey,
        'authorization': CONFIG.managementToken,
      }
    }
  );
  
  return response.data.entries;
}
```

---

#### Benefits of Personalize:
- ✅ Zero filtering logic in app code
- ✅ Business users can change rules in Contentstack UI
- ✅ A/B testing built-in
- ✅ Analytics on personalization performance
- ✅ Real-time rule updates (no code deploy needed)

---

## 🆚 Taxonomy vs Variants vs Personalize

### When to Use Each:

| Feature | Use Case | Example |
|---------|----------|---------|
| **Taxonomy** | Filtering & organization | Show only Launch modules |
| **Variants** | Same content, different versions | Basic vs Advanced version of same topic |
| **Personalize** | Dynamic delivery based on rules | Show different modules to different audiences |

### Can Use Together:
- **Taxonomy** for basic filtering (team, segment)
- **Variants** for content versions (rookie/at-risk/high-flyer)
- **Personalize** for complex rules (if score > 80 AND onboarding complete, show advanced)

---

## 🎯 My Recommendations

### For Your App:

#### Current State (What You Have):
- ✅ Taxonomy filtering (working great!)
- ❌ No variants (60+ duplicate modules)
- ❌ No Personalize (manual filtering in code)

#### Recommended Next Steps:

**Option A: Keep Current (Easiest)**
- Taxonomy is working well
- Code is clean and maintainable
- Don't need variants/personalize unless:
  - Managing duplicate content becomes painful
  - Business users want to change rules without dev help

**Option B: Add Variants (Medium Effort)**
- Consolidate 60 modules → 20 base modules with variants
- Cleaner content management
- **Time:** 4-6 hours
- **Benefit:** Less content duplication

**Option C: Add Personalize (Most Complex)**
- Move all filtering to Contentstack
- Business users control rules
- **Time:** 8-10 hours
- **Benefit:** No code changes for rule updates
- **Requirement:** Contentstack Personalize license (premium feature)

---

## 🔧 Immediate Fixes Needed:

### 1. Fix Video Modal Flickering
Update `ModuleViewer.tsx` to prevent state update flicker

### 2. Fix Analytics Blocks
Remove placeholder data and use real:
- `user.segmentHistory` for Segment Journey
- Track user activity for Weekly Activity

### 3. Clean Up Console Logs
Remove debug console.logs from production code

---

## 📝 Summary

### Taxonomy (Current): ✅ Working!
- Filtering by team and segment
- Content organization
- **No changes needed**

### Variants (Not Implemented): 🔶 Optional
- Would reduce duplicate modules
- 4-6 hours to implement
- Good for content management

### Personalize (Not Implemented): 🔶 Optional
- Would move rules to Contentstack
- 8-10 hours to implement
- Requires premium license

**My advice:** Fix the video flickering and analytics blocks first. Variants and Personalize can wait unless you have a specific need!

---

**Want me to fix the video flickering and analytics issues now?** 🚀

