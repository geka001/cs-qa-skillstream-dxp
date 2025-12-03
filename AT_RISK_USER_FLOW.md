# AT_RISK User Flow - Complete Journey

## Scenario: ROOKIE User Fails Quiz and Becomes AT_RISK

This document outlines the complete user experience when a ROOKIE user struggles and requires intervention.

---

## 📍 Step 1: Initial State (ROOKIE User)

**What User Sees:**
- Dashboard with 4 foundational modules
- Modules are unlocked and ready to start
- First module is highlighted as "Start Next" ⭐

**User Profile:**
- Segment: ROOKIE
- Completed Modules: 0
- Quiz Scores: {}

---

## 📍 Step 2: User Takes First Module

**Actions:**
1. User clicks "Start Learning" on first module
2. Reads content (40% progress tracked after 15 seconds)
3. Watches video (70% progress after 3 seconds on video tab)
4. Clicks "Take Quiz"

---

## 📍 Step 3: User Fails Quiz (< 50%)

**What Happens:**
1. User answers quiz questions
2. Final score: 45% (below 50% threshold)
3. **System automatically changes segment to AT_RISK**
4. Toast notification appears (RED):
   > ⚠️ "Your manager has been notified about your learning progress"
   > 
   > "Additional support resources have been prepared for you."

**User Profile Updated:**
- Segment: AT_RISK (changed!)
- Completed Modules: [first-module-id] (marked complete even with low score)
- Quiz Scores: { first-module-id: 45 }
- Interventions Received: 1

---

## 📍 Step 4: Dashboard Refreshes with AT_RISK Content

**What User Now Sees:**

### A. Intervention Card (Top of Dashboard)
```
┌─────────────────────────────────────────────┐
│ ⚠️ Performance Gap Detected                 │
│                                             │
│ We've identified areas where you need      │
│ additional support. Complete the remedial  │
│ modules below to strengthen your skills.   │
│                                             │
│ [View Remedial Content →]                  │
└─────────────────────────────────────────────┘
```

### B. Module Grid (7 Total Modules)

**3 Remedial Modules (UNLOCKED) ✅**
1. **[⭐ Recommended]** Test Case Writing - Quick Refresher
   - Category: Remedial
   - Difficulty: Beginner
   - Status: Unlocked, Ready to Start
   - Badge: "Recommended Next"
   
2. Defect Tracking - Simplified
   - Category: Remedial
   - Status: Unlocked
   
3. QA Fundamentals Recap
   - Category: At-Risk Support
   - Status: Unlocked

**4 Original ROOKIE Modules (LOCKED) 🔒**
4. [🔒] QA Testing Fundamentals
   - Status: COMPLETED ✓ (but still shows for reference)
   
5. [🔒] Test Case Design & Execution
   - Status: LOCKED
   - Warning: "Prerequisites Required: Complete remedial modules first"
   
6. [🔒] Defect Management
   - Status: LOCKED
   - Warning: "Prerequisites Required: Complete remedial modules first"
   
7. [🔒] Test Automation Basics
   - Status: LOCKED
   - Warning: "Prerequisites Required: Complete remedial modules first"

---

## 📍 Step 5: User Completes Remedial Modules

**Flow:**
1. User starts "Test Case Writing - Quick Refresher" (⭐ recommended)
2. Completes it with 80% → Module marked complete
3. **No toast notification** (already notified once about AT_RISK status)
4. Next remedial module becomes ⭐ recommended
5. User continues with other 2 remedial modules

---

## 📍 Step 6: All Remedial Modules Complete

**What Changes:**

### Module Grid Updates:
**3 Remedial Modules**
- ✓ Test Case Writing - Quick Refresher (100%)
- ✓ Defect Tracking - Simplified (100%)
- ✓ QA Fundamentals Recap (100%)

**4 Original ROOKIE Modules NOW UNLOCKED** 🔓
- ✓ QA Testing Fundamentals (45% - already completed)
- [⭐ Recommended] Test Case Design & Execution (unlocked!)
- Defect Management (unlocked!)
- Test Automation Basics (unlocked!)

**User can now continue with regular curriculum!**

---

## 📍 Step 7: Potential Path Back to ROOKIE

If user performs well on subsequent quizzes (consistently 70%+):
- User could be moved back to ROOKIE segment
- Remedial modules remain visible (for reference)
- Toast notification: "Great progress! Keep up the good work"

---

## 🎯 Key Features of This Flow

### 1. **Enforced Remediation**
- ✅ Can't skip remedial content
- ✅ Must complete all remedial modules first
- ✅ Clear lock icon and warning on non-remedial modules

### 2. **Clear Communication**
- ✅ One-time toast when segment changes (no spam)
- ✅ Intervention card explains what happened
- ✅ Prerequisites warning shows what's needed

### 3. **Guided Learning Path**
- ✅ First remedial module automatically recommended
- ✅ Clear progression: remedial → original curriculum
- ✅ Visual progress tracking (0% → 40% → 70% → 100%)

### 4. **Preservation of Progress**
- ✅ Already-completed modules stay completed
- ✅ Quiz scores preserved
- ✅ Original modules still visible (just locked)

### 5. **Smart Recommendations**
- ✅ Next recommended module highlights
- ✅ Highlighting disappears when modal opens
- ✅ Mandatory modules prioritized

---

## 🔄 Complete User Journey Diagram

```
ROOKIE (4 modules)
    │
    ├─ Complete Module 1 ─┐
    │                      │
    ├─ Score < 50%? ───────┤
    │                      │
    └─ YES → AT_RISK       │
         │                 │
         ├─ Toast (once)   │
         ├─ Intervention   │
         │   Card          │
         │                 │
         ├─ 3 Remedial     │
         │   Modules       │
         │   UNLOCKED      │
         │                 │
         ├─ 4 Original     │
         │   Modules       │
         │   LOCKED 🔒     │
         │                 │
         ├─ Complete       │
         │   Remedial 1    │
         │   (80%) ✓       │
         │                 │
         ├─ Complete       │
         │   Remedial 2    │
         │   (85%) ✓       │
         │                 │
         ├─ Complete       │
         │   Remedial 3    │
         │   (90%) ✓       │
         │                 │
         └─ Original       │
             Modules       │
             UNLOCKED 🔓   │
             │             │
             └─ Continue ──┘
                Regular
                Curriculum
```

---

## 🧪 Testing This Flow

1. **Start as ROOKIE**: Login, see 4 modules
2. **Fail first quiz**: Answer questions to get < 50%
3. **Check for toast**: Should see red notification (only once!)
4. **Verify locks**: Original modules should be locked
5. **Complete remedial**: Finish all 3 remedial modules
6. **Verify unlock**: Original modules should unlock
7. **Complete another module**: No toast should appear
8. **Refresh page**: State should persist

---

## 💡 Why This Approach Works

### Educational Perspective:
- **Scaffolding**: Provides support when student struggles
- **Mastery Learning**: Must master basics before advancing
- **Reduced Cognitive Load**: Focus on one thing at a time

### UX Perspective:
- **Clear Guidance**: User always knows what to do next
- **Positive Framing**: "Support" not "punishment"
- **Progress Visible**: Can see completion building up

### Business Perspective:
- **Prevents Gaps**: Ensures foundational knowledge
- **Manager Notification**: Enables timely intervention
- **Data Tracking**: Analytics on struggling users

---

## 🎓 Success Metrics

After implementing this flow:
- ✅ AT_RISK users complete remedial content first
- ✅ No confusion about locked modules
- ✅ Clear path back to regular curriculum
- ✅ Manager can provide timely support
- ✅ Improved pass rates on subsequent assessments

---

Last Updated: November 28, 2025

