# 🔧 SOP Onboarding Consistency Fix

## 🐛 Issues Reported

1. **SOP count mismatch**: Manager shows "4/6", QA shows "0/2"
2. **SOP sorting needed**: QA dashboard should sort SOPs by criticality (critical → high → medium → low)

---

## 📊 Root Cause Analysis

### Issue 1: Different SOP Counting Logic

**Manager Dashboard** (`UserDetailModal.tsx`):
```typescript
// WRONG: Showed ALL SOPs for current segment
const { sops } = getPersonalizedContent(user.segment, ...);
SOPs: {completedSOPsCount}/{sops.length}  // e.g., 4/6 (all SOPs)
```

**QA Dashboard** (`lib/onboarding.ts`):
```typescript
// CORRECT: Shows only ROOKIE mandatory SOPs for onboarding
const { sops: rookieSOPs } = getPersonalizedContent('ROOKIE', ...);
const mandatorySOPs = rookieSOPs.filter(s => s.mandatory);
SOPs: {completedMandatorySOPs}/{mandatorySOPs.length}  // e.g., 0/2 (mandatory only)
```

### Why They Were Different

**Example User: Test User (ROOKIE)**
- Total SOPs available: 6 (includes optional SOPs)
- Mandatory SOPs for onboarding: 2 (SOP-001: Critical, SOP-002: High)
- Completed: 4 SOPs (including 2 optional ones)

**Manager Dashboard showed**: 4/6 (all SOPs)
**QA Dashboard showed**: 0/2 (only mandatory SOPs count for onboarding)

**The Problem**: Manager was counting ALL SOPs, QA was counting only mandatory!

### Issue 2: No SOP Sorting

SOPs were displayed in the order they were stored, not by criticality. This made it hard to prioritize which SOPs to read first.

---

## ✅ The Fixes

### Fix 1: Manager Dashboard - Use Mandatory SOPs

**File**: `components/manager/UserDetailModal.tsx`

**Before**:
```typescript
const { sops } = getPersonalizedContent(user.segment, user.completedModules, user.team);
const completedSOPsCount = user.completedSOPs?.length || 0;

// Display
<h3>SOPs Completed ({completedSOPsCount}/{sops.length})</h3>
```

**After**:
```typescript
// Use ROOKIE content for onboarding tracking (same as QA dashboard)
const { sops: rookieSOPs } = getPersonalizedContent('ROOKIE', user.completedModules, user.team);

// Filter for mandatory SOPs only
const mandatorySOPs = rookieSOPs.filter(s => s.mandatory);

// Count completed mandatory SOPs
const completedMandatorySOPsCount = (user.completedSOPs || []).filter(id =>
  mandatorySOPs.some(s => s.id === id)
).length;

// Display
<h3>SOPs Completed ({completedMandatorySOPsCount}/{mandatorySOPs.length})</h3>
<p className="text-xs text-muted-foreground mt-2">
  Mandatory SOPs required for onboarding
</p>
```

### Fix 2: QA Dashboard - Sort by Criticality

**File**: `app/dashboard/sops/page.tsx`

**Added**:
```typescript
// Sort by criticality: critical > high > medium > low
const criticalityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
const sortedSOPs = sops.sort((a, b) => 
  criticalityOrder[a.criticality] - criticalityOrder[b.criticality]
);

setPersonalizedSOPs(sortedSOPs);
```

**Result**: SOPs now display in priority order:
1. 🔴 Critical SOPs first
2. 🟠 High priority SOPs
3. 🟡 Medium priority SOPs
4. 🔵 Low priority SOPs last

---

## 🎯 What Changed

### Now Both Dashboards Use:

1. ✅ **ROOKIE mandatory SOPs** for onboarding count (not all SOPs)
2. ✅ **Same filtering logic** (`s.mandatory` check)
3. ✅ **Consistent calculation** = consistent results!

### QA Dashboard Enhancement:

4. ✅ **SOPs sorted by criticality** (critical → high → medium → low)
5. ✅ **Easy to identify** which SOPs to prioritize

---

## 📝 Files Modified

1. ✅ `components/manager/UserDetailModal.tsx` - Fixed SOP counting to use mandatory SOPs
2. ✅ `app/dashboard/sops/page.tsx` - Added SOP sorting by criticality

---

## 🧪 Testing

### Expected Results

**Test User: "Test User_Launch" (ROOKIE)**
- Completed SOPs: `['sop-007', 'sop-006', 'sop-005', 'sop-003']` (4 total)
- Mandatory SOPs: `sop-001` (critical), `sop-002` (high) - 2 total
- Completed Mandatory: 0 (user completed optional SOPs, not mandatory ones yet)

**QA Dashboard** (Onboarding Progress):
- Shows: "SOPs: 0/2"
- Requires: Complete sop-001 and sop-002 for onboarding

**Manager Dashboard** (User Detail Modal):
- Shows: "SOPs: 0/2" ✅ **Now matches!**
- Shows: "Mandatory SOPs required for onboarding"

### SOP Display Order (QA Dashboard)

**Before**: Random order (sop-005, sop-007, sop-001, sop-003, etc.)

**After**: Sorted by criticality
1. sop-001 (Critical) 🔴
2. sop-002 (High) 🟠
3. sop-003 (Medium) 🟡
4. sop-005 (Low) 🔵
5. ...etc

---

## 📊 Onboarding Requirements (Now Consistent)

Both dashboards now track the **same mandatory content**:

```typescript
Onboarding Completion Requires:
✅ Modules: 4 mandatory ROOKIE modules
✅ SOPs: 2 mandatory SOPs (critical/high priority)
✅ Tools: 3 essential tools
✅ Score: 70% average quiz score
✅ Status: Not AT_RISK
```

### Which SOPs Are Mandatory?

Check `data/mockData.ts`:
```typescript
const mockSOPs = [
  {
    id: 'sop-001',
    title: 'Production Bug Escalation Process',
    criticality: 'critical',
    mandatory: true  // ✅ Required for onboarding
  },
  {
    id: 'sop-002',
    title: 'Sprint Testing Workflow',
    criticality: 'high',
    mandatory: true  // ✅ Required for onboarding
  },
  {
    id: 'sop-003',
    title: 'Test Case Documentation',
    criticality: 'medium',
    mandatory: false  // ❌ Optional
  },
  // ... more SOPs
];
```

---

## 🎉 Result

**SOP tracking is now consistent across both dashboards!**

Both QA and Manager dashboards:
- ✅ Show the same SOP count (mandatory only)
- ✅ Use the same onboarding requirements
- ✅ Track the same completion progress
- ✅ Display clear, prioritized SOPs

**Plus**: SOPs are now sorted by criticality in the QA dashboard, making it easy to prioritize what to read first! 🚀

---

## 🧪 Test Steps

1. **Refresh browser** (Cmd + Shift + R)
2. **Login as QA user**
   - Go to SOPs page
   - **Verify**: SOPs are sorted by criticality (critical first)
   - Check right sidebar "Onboarding Progress"
   - **Verify**: Shows "SOPs: X/2"
3. **Logout and login as Manager**
   - Find the same user
   - Click "View Details"
   - **Verify**: Shows "SOPs: X/2" (matches QA dashboard!)
   - **Verify**: Shows "Mandatory SOPs required for onboarding"

Both should now show **identical SOP counts**! ✅


