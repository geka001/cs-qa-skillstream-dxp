# 🔄 Migration Plan: localStorage → Contentstack

## 🎯 Goal
Move all user data from localStorage to Contentstack so the app works when hosted (multiple users, persistent data across devices).

---

## 📊 Current State: What's in localStorage

### 1. **User Profile** (`skillstream_user`)
```typescript
{
  name: string;
  role: string;
  team: Team; // "Launch" | "Data & Insights" | "Visual Builder" | "AutoDraft" | "DAM"
  segment: UserSegment; // "ROOKIE" | "AT_RISK" | "HIGH_FLYER"
  joinDate: string;
  completedModules: string[];
  quizScores: { [moduleId: string]: number };
  timeSpent: number;
  interventionsReceived: number;
  moduleProgress: {
    [moduleId: string]: {
      contentRead: boolean;
      videoWatched: boolean;
      lastAccessed: string;
      timeSpentOnModule: number;
    };
  };
  completedSOPs: string[];
  exploredTools: string[];
  onboardingComplete: boolean;
  onboardingCompletedDate?: string;
}
```

### 2. **Analytics Data** (`skillstream_analytics`)
```typescript
{
  moduleCompletion: number;
  averageQuizScore: number;
  timeSpent: number;
  lastActivity: string;
  segmentHistory: Array<{
    segment: UserSegment;
    date: string;
  }>;
}
```

### 3. **Manager Dashboard Data** (`skillstream_manager_[team]`)
```typescript
{
  users: UserProfile[];
  lastUpdated: string;
}
```

---

## 🏗️ Solution: New Contentstack Content Type

### Create: `qa_user` Content Type

**Purpose:** Store all user progress, analytics, and state

**Fields:**

| Field Name | UID | Data Type | Description | Mandatory |
|------------|-----|-----------|-------------|-----------|
| **Title** | `title` | Text | User's full name | Yes |
| **User ID** | `user_id` | Text | Unique identifier (email or name+team) | Yes (Unique) |
| **Name** | `name` | Text | User's name | Yes |
| **Email** | `email` | Text | User's email address | No |
| **Team** | `team` | Text | Launch/Data & Insights/Visual Builder/AutoDraft/DAM | Yes |
| **Role** | `role` | Text | QA Engineer level | No |
| **Segment** | `segment` | Text | ROOKIE/AT_RISK/HIGH_FLYER | Yes |
| **Join Date** | `join_date` | Text (ISO date) | When user started | Yes |
| **Completed Modules** | `completed_modules` | Text (JSON array) | ["mod-001", "mod-002"] | No |
| **Quiz Scores** | `quiz_scores` | Text (JSON object) | {"mod-001": 85, "mod-002": 92} | No |
| **Module Progress** | `module_progress` | Text (JSON object) | Detailed progress per module | No |
| **Completed SOPs** | `completed_sops` | Text (JSON array) | ["sop-001", "sop-002"] | No |
| **Explored Tools** | `explored_tools` | Text (JSON array) | ["tool-001", "tool-003"] | No |
| **Time Spent** | `time_spent` | Number | Total minutes spent | No |
| **Interventions Received** | `interventions_received` | Number | Count of AT_RISK interventions | No |
| **Onboarding Complete** | `onboarding_complete` | Boolean | Has completed onboarding | No |
| **Onboarding Completed Date** | `onboarding_completed_date` | Text (ISO date) | When onboarding finished | No |
| **Segment History** | `segment_history` | Text (JSON array) | History of segment changes | No |
| **Last Activity** | `last_activity` | Text (ISO date) | Last login/activity timestamp | No |

---

## 🔧 Implementation Plan

### **Phase 1: Create Content Type** ✅ (Do This First)

1. **Option A: Via Script (Recommended)**
   - Add `qa_user` content type to `scripts/phase1-setup-contentstack.js`
   - Run script to create

2. **Option B: Manual in Contentstack UI**
   - Create content type with fields above
   - Set `user_id` as unique field
   - Set `title` as display field

---

### **Phase 2: Create Contentstack User Service**

Create `lib/contentstackUser.ts`:

```typescript
// Functions needed:
- getUserByNameAndTeam(name: string, team: Team): Promise<UserProfile | null>
- createUser(user: UserProfile): Promise<UserProfile>
- updateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>
- getUsersByTeam(team: Team): Promise<UserProfile[]> // For manager dashboard
```

---

### **Phase 3: Update AppContext**

Modify `contexts/AppContext.tsx`:

1. **On Login:**
   - Check if user exists in Contentstack
   - If yes: Load user data
   - If no: Create new user entry

2. **On Any Update:**
   - Instead of `setUserState()` → save to Contentstack
   - Use debouncing (don't save on every keystroke)

3. **Remove localStorage:**
   - Remove all `localStorage.setItem()` calls
   - Remove all `localStorage.getItem()` calls

---

### **Phase 4: Update Manager Dashboard**

Modify `contexts/ManagerContext.tsx`:

1. Fetch users by team from Contentstack
2. Remove localStorage storage
3. Auto-refresh from Contentstack every 30 seconds

---

### **Phase 5: Testing**

1. Test user creation (new user)
2. Test user login (existing user)
3. Test progress updates (modules, SOPs, tools)
4. Test segment changes (ROOKIE → AT_RISK → HIGH_FLYER)
5. Test manager dashboard (view team progress)
6. Test multi-user scenarios (2+ users on same team)

---

## ⚠️ Important Considerations

### **1. User Identification**
- **Problem:** No authentication system
- **Solution:** Use `name + team` as unique identifier
- **Example:** `user_id: "Sarah Chen_Launch"`

### **2. Real-time Updates**
- **Problem:** Contentstack is not real-time
- **Solution:** 
  - Optimistic UI updates (update UI immediately)
  - Background sync to Contentstack (debounced)
  - Polling for manager dashboard (30s interval)

### **3. Concurrent Updates**
- **Problem:** Two users with same name on different devices
- **Solution:** Add email field as true unique identifier (optional for now)

### **4. Performance**
- **Problem:** API calls on every update
- **Solution:**
  - Debounce updates (save after 2s of inactivity)
  - Batch updates when possible
  - Cache user data in memory

---

## 📝 Migration Steps (What I'll Do)

### Step 1: Add `qa_user` Content Type to Phase 1 Script
- Update `scripts/phase1-setup-contentstack.js`
- Add all fields with proper types

### Step 2: Run Updated Phase 1 Script
- Create the `qa_user` content type in Contentstack

### Step 3: Create User Service Layer
- `lib/contentstackUser.ts` with CRUD functions

### Step 4: Update AppContext
- Replace localStorage with Contentstack calls
- Add debouncing for updates

### Step 5: Update Manager Context
- Fetch from Contentstack instead of localStorage

### Step 6: Test Everything
- Test user flows
- Test manager dashboard

---

## 🚀 Timeline Estimate

- **Phase 1 (Content Type):** 10 minutes
- **Phase 2 (User Service):** 30 minutes
- **Phase 3 (AppContext):** 45 minutes
- **Phase 4 (Manager Context):** 20 minutes
- **Phase 5 (Testing):** 30 minutes

**Total:** ~2 hours

---

## ❓ Questions for You

Before I start implementing:

1. **User Identification:** Should I use `name + team` as unique ID, or do you want to add email as a required field?

2. **Existing Users:** What should happen to users currently in localStorage? 
   - Option A: Migrate them to Contentstack on first login after deployment
   - Option B: Start fresh (users re-register)

3. **Manager Dashboard:** Should managers also be stored in Contentstack as users with a `manager` role?

4. **API Rate Limits:** Do you have concerns about Contentstack API rate limits? (Delivery API allows 10 requests/second)

Let me know your preferences, and I'll start implementing! 🚀


