# 🚀 Quick Start Guide - Team-Based QA Onboarding

## ✅ What's New?

Your SkillStream app now supports:
- **5 Contentstack product teams** with specialized training
- **Multi-user progress tracking** (no more shared profiles!)
- **Manager notifications** when users complete onboarding or need help
- **AI Tutor** to answer questions during learning
- **Generic tools page** (team-specific tools are in training modules)

---

## 🎯 How to Use

### **1. Start the Development Server**

If not already running:
```bash
cd /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp
npm run dev
```

Access at: **http://localhost:3000**

### **2. Login as a New User**

1. Enter your name (e.g., "Alice Smith")
2. Select your product team:
   - Launch
   - Data & Insights
   - Visual Builder
   - AutoDraft
   - DAM
3. Click "Start Learning"

**Note:** All new users start as ROOKIE (segments are automatic based on performance)

### **3. Explore Team-Specific Training**

**Launch Team** will see:
- Introduction to Contentstack Launch
- Testing Personalization Rules
- A/B Testing Validation
- + All general QA modules

**AutoDraft Team** will see:
- Introduction to AutoDraft
- API Testing with REST Assured
- AI Output Validation
- + All general QA modules

(Same pattern for other teams)

### **4. Use the AI Tutor**

1. Open any module (click "Start Learning")
2. Click "Ask AI Tutor" button (bottom right)
3. Type your question (e.g., "What is a test case?")
4. AI responds with helpful information
5. Minimize/close when done

**Note:** AI Tutor is NOT available on quiz pages

### **5. Complete Onboarding**

Requirements:
- ✅ Complete all mandatory modules
- ✅ Read all mandatory SOPs (first 2)
- ✅ Explore at least 3 tools
- ✅ Maintain average quiz score ≥ 70%
- ✅ Not in AT_RISK status

When complete:
- 🎉 Celebration modal appears
- 📧 Manager gets email notification (check console)
- ✅ Badge shows in analytics panel

### **6. Check Manager Notifications**

**Open browser console** (F12) to see simulated manager emails:

**When user completes onboarding:**
```
📧 [SIMULATED EMAIL]
To: sarah.johnson@contentstack.com
Subject: 🎉 Alice Smith from Launch Team Completed Onboarding!
```

**When user becomes AT_RISK:**
```
📧 [SIMULATED EMAIL]
To: sarah.johnson@contentstack.com
Subject: ⚠️ Alice Smith from Launch Team Needs Support
```

---

## 👥 Test Multi-User Support

### **Scenario 1: Two Users, Different Teams**

1. **User 1:** "Alice Smith" → Launch team
   - Complete 2 modules
   - Logout

2. **User 2:** "Bob Jones" → DAM team
   - See fresh profile (0 modules)
   - See different team-specific content
   - Complete 1 module
   - Logout

3. **User 1 Returns:** "Alice Smith"
   - Still has 2 modules completed ✅
   - Progress preserved!

### **Scenario 2: AT_RISK Notification**

1. Login as "Alice Smith"
2. Complete a quiz with score < 50%
3. **Check console** for manager email notification
4. **See toast:** "Your manager has been notified..."
5. Remedial modules appear

### **Scenario 3: Onboarding Complete**

1. Complete all requirements
2. **Check console** for manager email
3. **See modal:** "🎉 Onboarding Complete!"
4. **Analytics panel** shows "Onboarding Complete" badge

---

## 🔧 Manager Configuration

Want to update manager details?

**Edit:** `lib/managerConfig.ts`

```typescript
{
  team: 'Launch',
  managerName: 'Your Name',
  managerEmail: 'your.email@contentstack.com'
}
```

---

## 📊 Where is Data Stored?

**LocalStorage Keys:**
- `skillstream_alice_smith` - Alice's progress
- `skillstream_bob_jones` - Bob's progress
- `skillstream_user` - Last user (backward compat)

**To Reset a User:**
Open browser console:
```javascript
localStorage.removeItem('skillstream_alice_smith');
location.reload();
```

**To Reset All:**
```javascript
localStorage.clear();
location.reload();
```

---

## 🐛 Troubleshooting

### **Issue:** "No modules showing up"
- **Fix:** Make sure you selected a team at login
- **Fix:** Check that you're logged in (refresh page)

### **Issue:** "AI Tutor not appearing"
- **Fix:** Only available on module content pages, NOT quiz pages
- **Fix:** Click "Start Learning" on a module first

### **Issue:** "Manager email not sent"
- **Fix:** Check browser console (F12) for simulated emails
- **Fix:** Real emails require integration (currently placeholder)

### **Issue:** "Progress lost after login"
- **Fix:** Make sure you enter the EXACT same name
- **Fix:** Names are case-insensitive but spelling must match

### **Issue:** "Can't see team-specific modules"
- **Fix:** Team-based modules only show for that team
- **Fix:** Try different team to see different content

---

## 📈 What to Demo

### **Demo 1: Team-Based Training**
1. Show login page with team dropdown
2. Login as "Launch" team member
3. Show Launch-specific modules
4. Switch to "DAM" team member
5. Show different content

### **Demo 2: Manager Notifications**
1. Fail a quiz → Show AT_RISK email in console
2. Complete onboarding → Show completion email
3. Show toast notifications

### **Demo 3: Multi-User Support**
1. Create "Alice" with progress
2. Create "Bob" with different progress
3. Switch between them
4. Show independent progress

### **Demo 4: AI Tutor**
1. Open module
2. Click "Ask AI Tutor"
3. Ask questions
4. Show responses
5. Minimize/maximize

### **Demo 5: Tools Page**
1. Navigate to Tools
2. Show only generic tools
3. Explain team-specific tools are in training

---

## 🎓 Learning Paths by Team

### **Launch (Personalization)**
Modules: 7 (3 team + 4 general)  
Focus: A/B testing, personalization rules, experience optimization

### **Data & Insights (Analytics)**
Modules: 6 (2 team + 4 general)  
Focus: Dashboard testing, data validation, analytics

### **Visual Builder (WYSIWYG)**
Modules: 6 (2 team + 4 general)  
Focus: Visual regression, component testing, responsive design

### **AutoDraft (AI Content)**
Modules: 7 (3 team + 4 general)  
Focus: API testing, REST Assured, AI validation

### **DAM (Asset Management)**
Modules: 7 (3 team + 4 general)  
Focus: Asset testing, transformations, CDN, API testing

---

## 🎉 Success!

Your team-based QA onboarding platform is ready!

**Key Features:**
✅ Team-specific training paths  
✅ Multi-user support  
✅ Manager notifications  
✅ AI Tutor assistant  
✅ Progress tracking  
✅ Onboarding completion  

**Next Steps:**
- Test all scenarios
- Customize manager emails
- Add real AI integration
- Deploy to production

---

**Happy Training! 🚀**

For detailed implementation docs, see: `TEAM_BASED_FEATURES_COMPLETE.md`

