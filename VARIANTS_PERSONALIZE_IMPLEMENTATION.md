# 🎭 Implementing Variants & Personalize - Complete Guide

## 📋 Overview

We'll implement BOTH features in the right order:
1. **Variants** (easier, high value)
2. **Personalize** (more complex, requires Variants setup first)

---

## 🎯 Part 1: VARIANTS Setup

Variants allow you to have ONE module with multiple versions (Rookie, AT_RISK, High-Flyer).

### Benefits:
- Reduce 60 modules → 20 base modules with variants
- Single source of truth (update once)
- Better content management

---

## 📝 Phase 1: Manual Setup in Contentstack UI (YOU DO)

### Step 1: Create Variant Group
1. Go to **Settings** → **Variants** → **Variant Groups**
2. Click **+ Create Variant Group**
3. Fill in:
   - **Name**: `Learner Level Variants`
   - **UID**: `learner_level_variants`
   - **Description**: `Content variants for different learner segments (Rookie, AT-Risk, High-Flyer)`

4. Add 3 Variants:

**Variant 1:**
   - **Name**: `Rookie Version`
   - **UID**: `rookie_version`
   - **Description**: `Basic content for new learners`
   - **Default**: ✅ Yes

**Variant 2:**
   - **Name**: `AT-Risk Version`
   - **UID**: `at_risk_version`
   - **Description**: `Simplified, step-by-step content for struggling learners`
   - **Default**: ❌ No

**Variant 3:**
   - **Name**: `High-Flyer Version`
   - **UID**: `high_flyer_version`
   - **Description**: `Advanced content for accelerated learners`
   - **Default**: ❌ No

5. Click **Save**

---

### Step 2: Add Variant Field to Content Types

#### For `qa_training_module`:
1. Go to **Content Models** → **qa_training_module** → **Edit**
2. Scroll to find the `content` field
3. Click **Edit** on the `content` field
4. Enable **Variants**:
   - Toggle: **Variantize this field** → ON ✅
   - Select Variant Group: `learner_level_variants`
5. Click **Save**
6. Repeat for `video_url` field (optional, if you have different videos per segment)
7. Click **Save Content Type**

---

### Step 3: Test Variant Creation
1. Go to **Entries** → **qa_training_module**
2. Open any existing module (e.g., "Introduction to Contentstack Launch")
3. Find the `content` field
4. You should now see **3 tabs** above the content field:
   - `Rookie Version` (default)
   - `AT-Risk Version`
   - `High-Flyer Version`
5. Click each tab and add different content for each variant
6. **Save** and **Publish**

**Example:**
```
Rookie Version Content:
"Learn the basics of Contentstack Launch..."

AT-Risk Version Content:
"Let's break this down step-by-step. First, understand what Launch is..."

High-Flyer Version Content:
"Advanced concepts: Dive deep into Launch architecture and optimization..."
```

---

### ✅ Phase 1 Checklist:
- [ ] Created Variant Group `learner_level_variants` with 3 variants
- [ ] Added variant field to `content` field in `qa_training_module`
- [ ] Tested creating variants in one entry
- [ ] Published the test entry

**Let me know when this is done, then I'll create the API code!**

---

## 🔧 Phase 2: API Integration (I DO VIA CODE)

Once you complete Phase 1, I'll create:

### 1. Update Contentstack Service (`lib/contentstack.ts`)
- Add variant parameter to API calls
- Map user segment to variant UID
- Fetch correct variant based on user segment

### 2. Helper Function
```typescript
function getVariantForSegment(segment: UserSegment): string {
  const variantMap = {
    'ROOKIE': 'rookie_version',
    'AT_RISK': 'at_risk_version',
    'HIGH_FLYER': 'high_flyer_version'
  };
  return variantMap[segment] || 'rookie_version';
}
```

### 3. Update Fetch Calls
```typescript
// Current
await fetchFromContentstack('qa_training_module');

// With Variants
await fetchFromContentstack('qa_training_module', {
  variant: getVariantForSegment(userSegment)
});
```

---

## 🎭 Part 2: PERSONALIZE Setup

Personalize automatically delivers different content based on rules you define.

---

## 📝 Phase 3: Manual Setup in Contentstack UI (YOU DO)

### Step 1: Create Audiences

1. Go to **Personalize** → **Audiences** → **+ Create Audience**

**Audience 1: Rookie QA Engineers**
   - **Name**: `Rookie QA Engineers`
   - **UID**: `rookie_qa_engineers`
   - **Description**: `New QA team members in rookie segment`
   - **Rules**: (We'll configure via API or manually)

**Audience 2: At-Risk Learners**
   - **Name**: `At-Risk Learners`
   - **UID**: `at_risk_learners`
   - **Description**: `Learners who need remedial training`

**Audience 3: High-Flyer Engineers**
   - **Name**: `High-Flyer Engineers`
   - **UID**: `high_flyer_engineers`
   - **Description**: `Advanced learners on accelerated path`

**Audience 4-8: Team-Specific Audiences**
   - `Launch Team`
   - `Data & Insights Team`
   - `Visual Builder Team`
   - `AutoDraft Team`
   - `DAM Team`

2. Click **Save** for each

---

### Step 2: Create Experiences

1. Go to **Personalize** → **Experiences** → **+ Create Experience**

**Experience 1: Rookie Onboarding**
   - **Name**: `Rookie Onboarding Path`
   - **UID**: `rookie_onboarding_path`
   - **Audience**: `Rookie QA Engineers`
   - **Description**: `Default learning path for new QA team members`

**Experience 2: Remedial Training**
   - **Name**: `Remedial Training Track`
   - **UID**: `remedial_training_track`
   - **Audience**: `At-Risk Learners`
   - **Description**: `Simplified content with additional support`

**Experience 3: Advanced Track**
   - **Name**: `Advanced Learning Track`
   - **UID**: `advanced_learning_track`
   - **Audience**: `High-Flyer Engineers`
   - **Description**: `Advanced modules and optional deep-dives`

3. Click **Save** for each

---

### Step 3: Assign Experiences to Entries

For EACH module entry:
1. Open the entry
2. Go to **Personalize** tab
3. Select which experiences this module belongs to
4. Click **Save** and **Publish**

**Example for "Introduction to Contentstack Launch":**
- ✅ `Rookie Onboarding Path`
- ✅ `Remedial Training Track` (if applicable)
- ❌ `Advanced Learning Track` (not for this module)

---

### ✅ Phase 3 Checklist:
- [ ] Created 8 audiences (3 segments + 5 teams)
- [ ] Created 3 experiences
- [ ] Assigned experiences to entries
- [ ] Published entries with personalization

**Let me know when this is done, then I'll integrate with the app!**

---

## 🔧 Phase 4: Personalize API Integration (I DO VIA CODE)

Once you complete Phase 3, I'll create:

### 1. New Personalize Service
```typescript
// lib/contentstack-personalize.ts
export async function getPersonalizedModules(userProfile: {
  segment: UserSegment;
  team: Team;
  onboardingComplete: boolean;
}) {
  // Call Contentstack Personalize API
  // Automatically filters based on audiences & experiences
  return personalizedModules;
}
```

### 2. Update App to Use Personalize
```typescript
// Before (manual filtering)
const modules = await getCsModules(userTeam, userSegment);

// After (Contentstack does filtering)
const modules = await getPersonalizedModules({
  segment: user.segment,
  team: user.team,
  onboardingComplete: user.onboardingComplete
});
```

---

## 📊 Summary: Who Does What?

### 🟦 YOU (Manual UI Setup):

#### Variants:
- [ ] **Step 1:** Create Variant Group (5 min)
- [ ] **Step 2:** Add variant field to content type (2 min)
- [ ] **Step 3:** Test creating variants in one entry (5 min)

#### Personalize:
- [ ] **Step 1:** Create 8 audiences (10 min)
- [ ] **Step 2:** Create 3 experiences (5 min)
- [ ] **Step 3:** Assign experiences to entries (20-30 min)

**Total Time: ~45-60 minutes**

---

### 🟩 ME (API/Code):

#### Variants:
- [ ] Update `lib/contentstack.ts` to request variants
- [ ] Add variant mapping helper
- [ ] Test variant fetching
- [ ] Update TypeScript interfaces

#### Personalize:
- [ ] Create `lib/contentstack-personalize.ts` service
- [ ] Implement Personalize API calls
- [ ] Update `data/mockData.ts` to use Personalize
- [ ] Add user profile mapping
- [ ] Test personalization logic

**Total Time: ~2-3 hours coding**

---

## 🎯 Recommended Approach

### Option A: Do Variants First (Recommended)
**Why?**
- Easier to understand
- Immediate benefit (consolidate duplicate content)
- Can test thoroughly before Personalize
- Personalize builds on top of Variants

**Timeline:**
- Day 1: You do Variant setup (Phase 1)
- Day 1: I do Variant code (Phase 2)
- Day 2: Test variants thoroughly
- Day 3: You do Personalize setup (Phase 3)
- Day 3: I do Personalize code (Phase 4)

---

### Option B: Do Both Together
**Why?**
- Faster overall completion
- One migration period

**Risk:**
- More complex debugging
- Harder to isolate issues

---

## 🚀 Next Steps

### Immediate Action Items:

1. **Start with Variants** (do Phase 1 now):
   - [ ] Create Variant Group
   - [ ] Add to content type
   - [ ] Test one entry
   - [ ] Report back when done ✅

2. **I'll then code Phase 2** (30 min):
   - [ ] API integration
   - [ ] Test with your setup

3. **Then move to Personalize** (after Variants work):
   - [ ] You do Phase 3 setup
   - [ ] I do Phase 4 code

---

## 📝 What I Need From You Now:

**Please confirm:**
1. ✅ Start with Variants first? (Recommended)
2. ✅ You'll do Phase 1 (Manual UI setup)?
3. ✅ Let me know when Phase 1 is complete?

**Once you complete Phase 1, I'll immediately:**
- Create the API integration code
- Test it with your setup
- Document everything

---

## 📄 Additional Resources:

**Contentstack Docs:**
- Variants: https://www.contentstack.com/docs/developers/variants
- Personalize: https://www.contentstack.com/docs/developers/personalize

**Our Docs:**
- Full guide: `TAXONOMY_VARIANTS_PERSONALIZE_GUIDE.md`

---

**Ready to start? Just let me know when you've completed Phase 1 (Variant Group setup), and I'll jump in with the code!** 🚀

