# 📊 Data Source Analysis - What's Coming From Where?

## 🎯 Summary

| Data Type | Primary Source | Fallback | Status |
|-----------|---------------|----------|--------|
| **Modules** | ✅ Contentstack | mockData | Working |
| **SOPs** | ✅ Contentstack | mockData | Working |
| **Tools** | ✅ Contentstack | mockData | Working |
| **Quiz Items** | ✅ Contentstack | mockData | Working |
| **User Profiles** | ✅ Contentstack | - | Working |
| **Manager Configs** | ✅ Contentstack | mockData | Working |
| **Welcome Messages** | ❌ mockData | - | Static text |
| **Segment Config** | ❌ mockData | - | Static config |

---

## 🟢 Data Coming From CONTENTSTACK:

### 1. Training Modules (`qa_training_module`)
**Source:** `lib/contentstack.ts` → `getCsModules()`
**Used by:**
- Dashboard (`app/dashboard/page.tsx`)
- My Modules page (`app/dashboard/modules/page.tsx`)
- Onboarding calculations (`lib/onboarding.ts`)
- Manager dashboard

**How it works:**
```typescript
// In data/mockData.ts → getPersonalizedContentAsync()
const csModules = await getCsModules(team, segment);
if (csModules.length > 0) {
  modules = csModules; // ✅ Use Contentstack
} else {
  modules = mockModules.filter(...); // ❌ Fallback to mockData
}
```

---

### 2. SOPs (`qa_sop`)
**Source:** `lib/contentstack.ts` → `fetchSOPs()`
**Used by:**
- SOPs page (`app/dashboard/sops/page.tsx`)
- Onboarding calculations
- Manager dashboard

**How it works:**
```typescript
// In data/mockData.ts → getSOPs()
if (isContentstackEnabled()) {
  const sops = await fetchSOPs(team, segment);
  return sops; // ✅ Use Contentstack
}
return mockSOPs.filter(...); // ❌ Fallback
```

---

### 3. Tools (`qa_tool`)
**Source:** `lib/contentstack.ts` → `fetchTools()`
**Used by:**
- Tools page (`app/dashboard/tools/page.tsx`)
- Onboarding calculations
- Manager dashboard

**How it works:**
```typescript
// In data/mockData.ts → getTools()
if (isContentstackEnabled()) {
  const tools = await fetchTools(team, segment);
  return tools; // ✅ Use Contentstack
}
return mockTools.filter(...); // ❌ Fallback
```

---

### 4. Quiz Items (`quiz_item`)
**Source:** `lib/contentstack.ts` → `getCsQuizItems()`
**Used by:**
- Module quizzes (mapped to modules in `getCsModules`)

**How it works:**
```typescript
// In getCsModules()
const quizEntries = await fetchFromContentstack('quiz_item');
// Map quiz items to modules based on quiz_items field
```

---

### 5. User Profiles (`qa_user`)
**Source:** `lib/userService.ts` → API routes → `lib/contentstackUser.ts`
**Used by:**
- Login/authentication
- Progress tracking
- Manager dashboard

**How it works:**
```typescript
// In contexts/AppContext.tsx
const existingUser = await getUserByNameAndTeam(name, team);
// Creates/updates user in Contentstack
```

---

### 6. Manager Configs (`manager_config`)
**Source:** `lib/contentstack.ts` → `fetchManagerConfig()`
**Used by:**
- Manager email notifications
- Team configuration

---

## 🔴 Data Still Coming From MOCKDATA:

### 1. Welcome Messages
**Location:** `data/mockData.ts` line 2267
**Used by:** Dashboard welcome banner

```typescript
export const welcomeMessages: Record<UserSegment, string> = {
  ROOKIE: 'Welcome to your QA journey!...',
  AT_RISK: 'We\'ve noticed you need some extra support...',
  HIGH_FLYER: 'Congratulations on your exceptional progress!...'
};
```

**Impact:** Low - just static display text
**Migration needed?** Optional - could be moved to Contentstack for CMS control

---

### 2. Segment Configuration (atRiskIntervention)
**Location:** `data/mockData.ts`
**Used by:** AT_RISK intervention cards

```typescript
export const atRiskIntervention = {
  title: 'Getting Back on Track',
  message: '...',
  // ...
};
```

**Impact:** Low - static configuration
**Migration needed?** Optional

---

### 3. Fallback Data (when Contentstack fails)
**Location:** `data/mockData.ts`
**Used by:** All data fetching functions as fallback

**When used:**
- Contentstack API errors
- Network issues
- Empty Contentstack responses
- Missing taxonomy tags

---

## 📁 Files That Import from mockData:

| File | What It Uses | From Contentstack? |
|------|-------------|-------------------|
| `app/dashboard/page.tsx` | `getPersonalizedContentAsync`, `welcomeMessages`, `mockModules` (import only) | ✅ Yes (via async function) |
| `app/dashboard/modules/page.tsx` | `getPersonalizedContentAsync` | ✅ Yes |
| `app/dashboard/sops/page.tsx` | `getSOPs` | ✅ Yes |
| `app/dashboard/tools/page.tsx` | `getTools` | ✅ Yes |
| `lib/onboarding.ts` | `getPersonalizedContent` (sync) | ✅ Yes (via cache) |
| `components/manager/UserList.tsx` | `getPersonalizedContent` | ✅ Yes (via cache) |
| `components/manager/UserDetailModal.tsx` | `getPersonalizedContent` | ✅ Yes (via cache) |
| `components/layout/AnalyticsPanel.tsx` | `getPersonalizedContent` | ✅ Yes (via cache) |
| `lib/dataProvider.ts` | `mockModules`, `mockSOPs`, `mockTools` | ⚠️ Used for fallback |

---

## 🔄 How The Cache Works:

```
1. User logs in
   ↓
2. getPersonalizedContentAsync() called
   ↓
3. Fetches from Contentstack:
   - getCsModules() → qa_training_module
   - getSOPs() → qa_sop
   - getTools() → qa_tool
   ↓
4. Stores in cache:
   contentstackContentCache[`${team}_${segment}`] = {
     modules, sops, tools
   }
   ↓
5. Sync functions (getPersonalizedContent) check cache first
   - If cache exists → Use Contentstack data ✅
   - If cache empty → Fallback to mockData ❌
```

---

## ✅ Verification Checklist:

### Modules
- [x] Fetched from Contentstack (`getCsModules`)
- [x] Filtered by team_taxonomy
- [x] Filtered by segment_taxonomy
- [x] Quiz items mapped from Contentstack
- [x] Fallback to mockData if empty

### SOPs
- [x] Fetched from Contentstack (`fetchSOPs`)
- [x] Filtered by sop_category taxonomy
- [x] Sorted by criticality
- [x] Fallback to mockData if empty

### Tools
- [x] Fetched from Contentstack (`fetchTools`)
- [x] Filtered by tool_category taxonomy
- [x] isGeneric flag respected
- [x] Fallback to mockData if empty

### User Data
- [x] Stored in Contentstack (`qa_user`)
- [x] Progress persists across sessions
- [x] Quiz scores saved
- [x] Segment history tracked

---

## 🎯 What's NOT From Contentstack (Intentionally):

1. **Welcome Messages** - Static UI text
2. **Segment Colors/Styling** - UI configuration
3. **Intervention Messages** - Static UI text
4. **Badge Colors** - UI configuration
5. **App Configuration** - Environment variables

These are intentionally kept in code because:
- They're UI/UX configuration, not content
- They don't need CMS editing
- They're tightly coupled to code logic

---

## 📊 Data Flow Diagram:

```
┌─────────────────────────────────────────────────────────────┐
│                        CONTENTSTACK                          │
├─────────────────────────────────────────────────────────────┤
│  qa_training_module  │  qa_sop  │  qa_tool  │  qa_user     │
│  quiz_item           │          │           │  manager_config│
└──────────┬───────────┴────┬─────┴─────┬─────┴───────┬───────┘
           │                │           │             │
           ▼                ▼           ▼             ▼
┌──────────────────────────────────────────────────────────────┐
│                     lib/contentstack.ts                       │
│  getCsModules() │ fetchSOPs() │ fetchTools() │ fetchUsers()  │
└──────────┬───────────┴────┬─────┴─────┬─────┴───────┬────────┘
           │                │           │             │
           ▼                ▼           ▼             ▼
┌──────────────────────────────────────────────────────────────┐
│                      data/mockData.ts                         │
│  getPersonalizedContentAsync() → CACHE                       │
│  getPersonalizedContent() ← reads from CACHE                 │
│                                                               │
│  FALLBACK: mockModules, mockSOPs, mockTools                  │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│                     React Components                          │
│  Dashboard │ Modules │ SOPs │ Tools │ Manager                │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Conclusion:

**Primary data (modules, SOPs, tools, users) comes from Contentstack ✅**

**MockData is only used for:**
1. Static UI text (welcome messages, interventions)
2. Fallback when Contentstack fails
3. Development/testing without Contentstack

**The app is properly integrated with Contentstack!** 🎉

