# 🎯 SkillStream QA Onboarding DXP
## *Comprehensive Demo Guide for Executive Presentation*

---

<div align="center">

![SkillStream](https://images.contentstack.io/v3/assets/blt8202119c48319b1d/blt0719c05cb93fa636/6931bc63178ae2ee6634f01d/CS_OnlyLogo.webp)

### **A Personalized Learning Experience Platform**
*Powered by Contentstack's Complete DXP Suite*

**Version**: 1.0.0 | **Date**: December 2025

---

</div>

## 📋 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Business Use Cases](#-business-use-cases)
3. [Key Features & Highlights](#-key-features--highlights)
4. [Contentstack Products Utilized](#-contentstack-products-utilized)
5. [Application Architecture](#️-application-architecture)
6. [User Flows & Journeys](#-user-flows--journeys)
7. [File Structure & Responsibilities](#-file-structure--responsibilities)
8. [Live Demo Scenarios](#-live-demo-scenarios)
9. [Integration Challenges & Solutions](#-integration-challenges--solutions)
10. [Technical Achievements](#-technical-achievements)
11. [Future Roadmap](#-future-roadmap)

---

## 🎯 Executive Summary

**SkillStream QA Onboarding DXP** is a production-ready, personalized learning management system that demonstrates the full power of Contentstack's Digital Experience Platform. The application provides:

| Metric | Value |
|--------|-------|
| **Content Types** | 8+ custom content types |
| **Product Teams** | 4 dynamically managed teams |
| **Learning Modules** | 15+ training modules |
| **Personalization Segments** | 3 user segments (ROOKIE, AT_RISK, HIGH_FLYER) |
| **Integrations** | Slack, Visual Builder, Live Preview, Personalize SDK |

### What Makes This Unique

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SkillStream DXP Capabilities                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🎓 PERSONALIZED LEARNING    │  📊 REAL-TIME ANALYTICS    │  🤖 AUTOMATION │
│  • Segment-based content     │  • Progress tracking       │  • Slack alerts │
│  • Adaptive difficulty       │  • Quiz scoring            │  • Manager notify│
│  • Team-specific modules     │  • Onboarding metrics      │  • Auto-promote  │
│                                                                             │
│  🖼️ VISUAL BUILDER          │  👨‍💼 MANAGER PORTAL        │  🔄 LIVE PREVIEW │
│  • In-context editing        │  • Team oversight          │  • Real-time    │
│  • Edit tags support         │  • User progress view      │  • Content sync │
│  • No-code updates           │  • Performance metrics     │  • Visual edit  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏢 Business Use Cases

### Use Case 1: **New Employee Onboarding**
> *"A new QA engineer joins the Launch team and needs team-specific training"*

| Stage | What Happens |
|-------|-------------|
| **Login** | Employee enters name and selects "Launch" team |
| **Personalization** | System loads Launch-specific modules and SOPs |
| **Learning** | Interactive modules with video and quizzes |
| **Tracking** | Progress automatically synced to Contentstack |
| **Completion** | Manager notified via Slack when onboarding completes |

---

### Use Case 2: **Struggling Employee Support**
> *"An employee fails a quiz and needs intervention"*

| Stage | What Happens |
|-------|-------------|
| **Quiz Fail** | User scores below 50% on a module quiz |
| **Segment Change** | Automatically moved to AT_RISK segment |
| **Notification** | Manager receives Slack alert |
| **Remedial Content** | System shows intervention card + support resources |
| **Recovery** | After completing remedial modules with 70%+, promoted back |

---

### Use Case 3: **High Performer Fast-Track**
> *"A talented employee excels and deserves advanced content"*

| Stage | What Happens |
|-------|-------------|
| **Completion** | User completes all mandatory modules |
| **High Score** | Maintains 90%+ average quiz score |
| **Auto-Promote** | System upgrades to HIGH_FLYER segment |
| **Advanced Access** | Unlocks advanced modules (Selenium, CI/CD, etc.) |
| **Recognition** | Celebration modal + manager notification |

---

### Use Case 4: **Manager Team Oversight**
> *"A manager wants to track their team's onboarding progress"*

| Stage | What Happens |
|-------|-------------|
| **Login** | Manager clicks "Manager Portal" |
| **Team View** | Dashboard shows all team members |
| **Progress** | Real-time stats: completion %, at-risk count |
| **Drill-Down** | Click any user to see detailed progress |
| **Auto-Refresh** | Data updates every 30 seconds |

---

### Use Case 5: **Content Team Updates**
> *"The L&D team needs to update training content without developers"*

| Stage | What Happens |
|-------|-------------|
| **Visual Builder** | Open any page in Contentstack Visual Builder |
| **In-Context Edit** | Click any text/image to edit directly |
| **Live Preview** | See changes in real-time before publishing |
| **Publish** | One-click publish to production |
| **No Deploy** | Changes appear instantly - no build required |

---

## ⭐ Key Features & Highlights

### 🎨 User Experience Features

```
┌───────────────────────────────────────────────────────────────────┐
│                     PERSONALIZED DASHBOARD                         │
├─────────────┬─────────────────────────────────────┬───────────────┤
│             │                                     │               │
│   SIDEBAR   │         MAIN CONTENT                │   ANALYTICS   │
│             │                                     │   PANEL       │
│ • Home      │  ┌─────────────────────────────┐   │               │
│ • Modules   │  │    Welcome, {Name}! 👋       │   │  Current:     │
│ • SOPs      │  │    {Team} Team Member        │   │  🟢 ROOKIE    │
│ • Tools     │  └─────────────────────────────┘   │               │
│ • Analytics │                                     │  Modules: 3/7 │
│             │  ┌─────────────────────────────┐   │  Score: 85%   │
│ ─────────── │  │  🚨 INTERVENTION CARD       │   │  Time: 2.5h   │
│             │  │  (Only if AT_RISK)          │   │               │
│ Quick Acts: │  └─────────────────────────────┘   │  ─────────────│
│ • Fail Quiz │                                     │               │
│ • Pass Quiz │  📚 MODULE CARDS                    │  📊 Charts    │
│ • Reset     │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │  • Quiz Score │
│             │  │ M1 │ │ M2 │ │ M3 │ │ M4 │       │  • Activity   │
│             │  └────┘ └────┘ └────┘ └────┘       │  • History    │
│             │                                     │               │
└─────────────┴─────────────────────────────────────┴───────────────┘
```

### 📊 Analytics & Tracking

| Metric | Description | Where Stored |
|--------|-------------|--------------|
| **Module Completion** | % of mandatory modules done | Contentstack CMS |
| **Quiz Scores** | Per-module and average scores | Contentstack CMS |
| **Time Spent** | Minutes spent on platform | Contentstack CMS |
| **Segment History** | Track transitions over time | Contentstack CMS |
| **SOP Completion** | Which SOPs have been read | Contentstack CMS |
| **Tool Exploration** | Which tools user explored | Contentstack CMS |

### 🔔 Slack Notifications

| Event | Slack Message |
|-------|---------------|
| **Onboarding Complete** | 🎉 User completed onboarding with X% score |
| **Quiz Failure** | ⚠️ User failed quiz on Module X (score: Y%) |
| **AT_RISK Recovery** | 🎊 User recovered from AT_RISK status |

---

## 🔧 Contentstack Products Utilized

### Product Usage Matrix

| Product | Usage | Implementation |
|---------|-------|----------------|
| **CMS (Headless)** | ✅ Core content storage | All modules, SOPs, tools, teams, users |
| **Delivery SDK** | ✅ Content fetching | TypeScript SDK for type-safe queries |
| **Management API** | ✅ User data CRUD | Create/update user profiles |
| **Taxonomies** | ✅ Content classification | Segment & Team filtering |
| **Variants** | ✅ Content personalization | Segment-specific content versions |
| **Live Preview** | ✅ Real-time editing | Edit before publish |
| **Visual Builder** | ✅ In-context editing | Edit directly on page |
| **Personalize SDK** | ✅ Analytics & impressions | Track user segments |
| **Launch** | ✅ Deployment | Deployed on Launch platform |

---

### Content Types Created

```
┌──────────────────────────────────────────────────────────────────┐
│                     CONTENTSTACK CONTENT TYPES                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📘 qa_training_module        │  📄 qa_sop                       │
│  ├─ module_id                 │  ├─ sop_id                       │
│  ├─ title                     │  ├─ title                        │
│  ├─ content (Rich Text)       │  ├─ criticality                  │
│  ├─ category                  │  ├─ steps (JSON)                 │
│  ├─ difficulty                │  ├─ mandatory                    │
│  ├─ video_url                 │  ├─ segment_taxonomy             │
│  ├─ quiz_items (Reference)    │  └─ team_taxonomy                │
│  ├─ mandatory                 │                                  │
│  ├─ segment_taxonomy          │  🛠️ qa_tool                       │
│  ├─ team_taxonomy             │  ├─ tool_id                      │
│  └─ skill_level_taxonomy      │  ├─ name                         │
│                                │  ├─ purpose                      │
│  ❓ quiz_item                  │  ├─ docs_link                    │
│  ├─ quiz_id                   │  ├─ category                     │
│  ├─ question                  │  ├─ is_generic                   │
│  ├─ answer_options (JSON)     │  └─ segment_taxonomy             │
│  ├─ correct_answer            │                                  │
│  └─ explanation               │  👤 user_profile                  │
│                                │  ├─ name                         │
│  📄 page                       │  ├─ team (Reference)             │
│  ├─ title                     │  ├─ segment                      │
│  └─ modular_blocks            │  ├─ completed_modules            │
│      ├─ hero_banner           │  ├─ quiz_scores (JSON)           │
│      ├─ teams                 │  ├─ onboarding_complete          │
│      └─ stats                 │  └─ time_spent                   │
│                                │                                  │
│  👥 team_config                │  ⚙️ manager_config                │
│  ├─ team                      │  ├─ team (Reference)             │
│  ├─ description               │  ├─ manager_name                 │
│  ├─ manager_name              │  └─ manager_email                │
│  ├─ manager_email             │                                  │
│  ├─ color                     │                                  │
│  └─ logo (Asset)              │                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### Taxonomies Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         TAXONOMIES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 User Segments                  │  👥 Product Teams            │
│  ├─ ROOKIE (Beginner)             │  ├─ Launch                   │
│  ├─ AT_RISK (Needs Support)       │  ├─ DAM                      │
│  └─ HIGH_FLYER (Advanced)         │  ├─ Data & Insights          │
│                                    │  └─ AutoDraft                │
│                                                                 │
│  📚 Skill Levels                   │                             │
│  ├─ Beginner                      │                             │
│  ├─ Intermediate                  │                             │
│  └─ Advanced                      │                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Application Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           SkillStream DXP Architecture                        │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js 14)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Login Page │  │  Dashboard  │  │  Modules    │  │  Manager    │          │
│  │  /login     │  │  /dashboard │  │  /modules   │  │  /manager   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘          │
│                              │                                                │
│                    ┌─────────▼─────────┐                                      │
│                    │   AppContext      │  ← Global State Management           │
│                    │   (React Context) │                                      │
│                    └─────────┬─────────┘                                      │
└──────────────────────────────┼───────────────────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   CONTENTSTACK  │  │     SLACK       │  │   PERSONALIZE   │
│      CMS        │  │   WEBHOOKS      │  │      SDK        │
│                 │  │                 │  │                 │
│ • Delivery SDK  │  │ • Onboarding    │  │ • User attrs    │
│ • Management API│  │ • Quiz Fail     │  │ • Impressions   │
│ • Live Preview  │  │ • Recovery      │  │ • Events        │
│ • Visual Builder│  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │
        ▼
┌─────────────────┐
│  CONTENTSTACK   │
│     LAUNCH      │
│                 │
│ • Deployment    │
│ • CDN           │
│ • SSL           │
└─────────────────┘
```

### Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                         │
└───────────────────────────────────────────────────────────────────────────────┘

User Action          Frontend                 Backend/API             Contentstack
    │                   │                        │                        │
    │ 1. Login          │                        │                        │
    ├──────────────────>│                        │                        │
    │                   │ 2. Check if user exists│                        │
    │                   ├───────────────────────>│                        │
    │                   │                        │ 3. Query user_profile  │
    │                   │                        ├───────────────────────>│
    │                   │                        │<───────────────────────┤
    │                   │                        │ 4. Return user data    │
    │                   │<───────────────────────┤                        │
    │                   │                        │                        │
    │                   │ 5. Fetch modules for   │                        │
    │                   │    user's team+segment │                        │
    │                   ├───────────────────────>│                        │
    │                   │                        │ 6. Filter by taxonomy  │
    │                   │                        ├───────────────────────>│
    │                   │                        │<───────────────────────┤
    │                   │                        │ 7. Return filtered     │
    │                   │<───────────────────────┤    modules             │
    │                   │                        │                        │
    │<──────────────────┤ 8. Render personalized │                        │
    │  See dashboard    │    dashboard           │                        │
    │                   │                        │                        │
    │ 9. Complete quiz  │                        │                        │
    ├──────────────────>│                        │                        │
    │                   │ 10. Update user profile│                        │
    │                   ├───────────────────────>│                        │
    │                   │                        │ 11. PUT to user entry  │
    │                   │                        ├───────────────────────>│
    │                   │                        │                        │
    │                   │ 12. Track event        │                        │
    │                   ├──────────────────────────────────────────────> Personalize
    │                   │                        │                        │
    │                   │ 13. Send Slack notif   │                        │
    │                   ├──────────────────────────────────────────────> Slack
    │                   │                        │                        │
```

---

## 🔄 User Flows & Journeys

### New User Onboarding Flow

```
┌─────────────┐
│   VISITOR   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN PAGE                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Enter Your Name: [________________]                       │  │
│  │                                                           │  │
│  │  Select Your Team:                                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │  │
│  │  │  Launch  │ │   DAM    │ │  Data &  │ │ AutoDraft│     │  │
│  │  │    🟣    │ │    🔵    │ │ Insights │ │    🟠    │     │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │  │
│  │                                                           │  │
│  │           [ Start Your Learning Journey → ]               │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Create/Load User│
                    │ in Contentstack │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Set Personalize │
                    │ Attributes      │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DASHBOARD                                   │
│                                                                  │
│  Welcome, {Name}! 👋                                             │
│  You've joined the {Team} team as a ROOKIE.                     │
│                                                                  │
│  📚 Your Learning Path:                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Module 1 │ Module 2 │ Module 3 │ Module 4 │ ... │ Module N │ │
│  │  ⭐ NEW  │  ⭐ NEW  │  ⭐ NEW  │  ⭐ NEW  │     │  🔒 LOCKED│ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Segment Transition Flow

```
                    ┌─────────────────┐
                    │     ROOKIE      │
                    │   (Starting)    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     Quiz Score < 50%              Onboarding Complete
              │                    + Score ≥ 70%
              ▼                             │
    ┌─────────────────┐                     │
    │    AT_RISK      │                     │
    │ (Needs Support) │                     │
    └────────┬────────┘                     │
             │                              │
    Complete remedial                       │
    modules + Score ≥ 70%                   │
             │                              │
             └──────────────┬───────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │   HIGH_FLYER    │
                  │   (Advanced)    │
                  └─────────────────┘
```

### Quiz & Module Completion Flow

```
┌──────────────┐
│ Click Module │
│    Card      │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│         MODULE VIEWER               │
│  ┌────────────────────────────────┐ │
│  │  Tab: Content │ Video │ Quiz  │ │
│  └────────────────────────────────┘ │
│                                     │
│  📖 Rich Content                    │
│  - Learning material               │
│  - Best practices                  │
│  - Examples                        │
│                                     │
│  🎥 Video (if available)           │
│                                     │
│  [ Start Quiz → ]                  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│           QUIZ MODAL                │
│  ┌────────────────────────────────┐ │
│  │ Question 1 of N                │ │
│  │                                │ │
│  │ What is the correct approach?  │ │
│  │                                │ │
│  │ ○ Option A                     │ │
│  │ ● Option B ← Selected          │ │
│  │ ○ Option C                     │ │
│  │ ○ Option D                     │ │
│  └────────────────────────────────┘ │
│                                     │
│  [ Previous ] [ Next Question → ]  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│         QUIZ RESULTS                │
│  ┌────────────────────────────────┐ │
│  │  🎉 Score: 85%                 │ │
│  │                                │ │
│  │  ✅ Question 1: Correct        │ │
│  │  ✅ Question 2: Correct        │ │
│  │  ❌ Question 3: Incorrect      │ │
│  │     Explanation: ...           │ │
│  │  ✅ Question 4: Correct        │ │
│  └────────────────────────────────┘ │
│                                     │
│  [ Close & Continue → ]            │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌──────────────────────┐
         │ Update Contentstack: │
         │ • Mark completed     │
         │ • Store score        │
         │ • Track analytics    │
         │ • Check segment      │
         └──────────────────────┘
```

---

## 📁 File Structure & Responsibilities

### Directory Overview

```
cs-qa-skillstream-dxp/
│
├── 📱 app/                          → Next.js App Router Pages
│   ├── layout.tsx                  → Root layout with providers
│   ├── page.tsx                    → Home page (redirects)
│   ├── globals.css                 → Global styles + Tailwind
│   │
│   ├── login/
│   │   └── page.tsx               → 🔐 Login with team selection
│   │
│   ├── dashboard/
│   │   ├── layout.tsx             → 📊 3-column dashboard layout
│   │   ├── page.tsx               → 🏠 Main personalized dashboard
│   │   ├── modules/page.tsx       → 📚 All modules view
│   │   ├── sops/page.tsx          → 📋 SOPs page
│   │   ├── tools/page.tsx         → 🔧 Tools page
│   │   └── analytics/page.tsx     → 📈 Analytics dashboard
│   │
│   ├── manager/
│   │   ├── layout.tsx             → Manager portal layout
│   │   ├── login/page.tsx         → Manager authentication
│   │   └── dashboard/page.tsx     → 👔 Team oversight dashboard
│   │
│   └── api/
│       ├── users/route.ts         → User CRUD operations
│       ├── users/team/route.ts    → Get users by team
│       ├── slack/notify/route.ts  → Slack webhook handler
│       └── variants/[entryUid]/route.ts → Fetch variants
│
├── 🧩 components/                   → Reusable UI Components
│   ├── cards/
│   │   ├── ModuleCard.tsx         → Learning module display
│   │   ├── SOPCard.tsx            → SOP display
│   │   ├── ToolCard.tsx           → Tool display
│   │   ├── InterventionCard.tsx   → AT_RISK user alert
│   │   └── AdvancedPathwayCard.tsx → HIGH_FLYER bonus
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx            → Left navigation
│   │   ├── Topbar.tsx             → Search + user info
│   │   └── AnalyticsPanel.tsx     → Right analytics panel
│   │
│   ├── modules/
│   │   └── ModuleViewer.tsx       → Full content viewer modal
│   │
│   ├── quiz/
│   │   └── QuizModal.tsx          → Interactive quiz
│   │
│   └── ui/                         → ShadCN/UI base components
│
├── 🧠 contexts/                     → React Context Providers
│   ├── AppContext.tsx             → Global state + user management
│   ├── LivePreviewContext.tsx     → Visual Builder integration
│   └── ManagerContext.tsx         → Manager portal state
│
├── 📚 lib/                          → Business Logic & Services
│   ├── contentstack.ts            → CMS content fetching
│   ├── contentstackSDK.ts         → SDK initialization
│   ├── userService.ts             → User API client
│   ├── teamService.ts             → Teams from Contentstack
│   ├── personalize.ts             → Personalize SDK
│   ├── livePreview.ts             → Live Preview config
│   ├── slackNotifications.ts      → Slack notification client
│   ├── onboarding.ts              → Onboarding calculation
│   └── managerConfig.ts           → Manager notifications
│
├── 📊 data/
│   └── mockData.ts                → Fallback mock content
│
├── 📝 types/
│   └── index.ts                   → TypeScript interfaces
│
└── 📜 scripts/                      → Setup & utility scripts
```

---

### Key File Responsibilities

#### 🔐 `lib/contentstack.ts` - CMS Service Layer
**Purpose**: Fetches all content from Contentstack using Delivery SDK

| Function | What It Does |
|----------|-------------|
| `getCsModules(team, segment)` | Fetches training modules filtered by user's team and segment |
| `fetchTools(team, segment)` | Fetches tools with taxonomy filtering |
| `fetchSOPs(team, segment)` | Fetches SOPs with team/segment filtering |
| `fetchVariantsForEntry(uid)` | Retrieves content variants for personalization |
| `findVariantForSegment()` | Matches variant to user's current segment |
| `normalizeSegment()` | Converts segment values to standard format |

---

#### 🧠 `contexts/AppContext.tsx` - Global State Management
**Purpose**: Manages user state, analytics, and all application actions

| Function | What It Does |
|----------|-------------|
| `setUser(user)` | Logs in user, creates in Contentstack if new |
| `completeModule(id, score)` | Marks module done, updates analytics, checks segment |
| `updateSegment(segment)` | Changes user segment, notifies manager if AT_RISK |
| `markSOPComplete(id)` | Tracks SOP reading for onboarding progress |
| `markToolExplored(id)` | Tracks tool exploration for onboarding |
| `checkOnboardingCompletion()` | Determines if user completed all requirements |

---

#### 🎯 `lib/personalize.ts` - Personalize SDK Integration
**Purpose**: Sends analytics to Contentstack Personalize

| Function | What It Does |
|----------|-------------|
| `initializePersonalize()` | Initializes SDK with project UID |
| `setPersonalizeAttributes()` | Sets QA_LEVEL and TEAM_NAME for user |
| `triggerImpression()` | Tracks when HIGH_FLYER content shown |
| `trackEvent()` | Sends events: quiz_pass, quiz_fail, module_complete |

---

#### 👁️ `lib/livePreview.ts` - Visual Builder Support
**Purpose**: Enables live editing in Contentstack Visual Builder

| Function | What It Does |
|----------|-------------|
| `initializeLivePreview()` | Sets up SDK with Visual Builder mode |
| `generateEditTagPath()` | Creates data-cslp attribute for edit tags |
| `getEditTagProps()` | Returns props object for editable elements |
| `getModularBlockEditTag()` | Generates edit tags for modular blocks |

---

#### 📢 `lib/slackNotifications.ts` - Slack Integration
**Purpose**: Sends notifications to Slack for key events

| Function | What It Does |
|----------|-------------|
| `notifyOnboardingComplete()` | Sends celebration message when user completes |
| `notifyQuizFailure()` | Alerts team when user fails a quiz |
| `notifyAtRiskRecovery()` | Notifies when user recovers from AT_RISK |

---

#### 👥 `lib/teamService.ts` - Dynamic Teams
**Purpose**: Fetches teams dynamically from Contentstack

| Function | What It Does |
|----------|-------------|
| `getLoginPageData()` | Fetches hero banner, teams, and stats |
| `getTeams()` | Returns all team configurations |
| `getManagerForTeam()` | Gets manager name/email for a team |
| `getDashboardPageContent()` | Fetches dashboard labels/headings |

---

## 🎬 Live Demo Scenarios

### Demo 1: New Rookie Journey (5 mins)

```
Step 1: Open login page → Show dynamic teams from Contentstack
Step 2: Enter name "Alex" → Select "Launch" team
Step 3: Click "Start Learning Journey" → Show personalized dashboard
Step 4: Point out: Team-specific modules, Analytics panel, ROOKIE badge
Step 5: Click on a module → Show Module Viewer with content + video
Step 6: Take the quiz → Get 85% score
Step 7: Show updated analytics → Module marked complete
```

### Demo 2: AT_RISK Intervention (3 mins)

```
Step 1: Use sidebar "Simulate Fail Quiz" button
Step 2: Show segment change: ROOKIE → AT_RISK (red badge)
Step 3: Point out: Intervention card appears with support message
Step 4: Show: Manager notification toast
Step 5: Show: Slack webhook sends alert to manager channel
Step 6: Complete remedial module with 75% → Recover to ROOKIE
```

### Demo 3: HIGH_FLYER Achievement (3 mins)

```
Step 1: Complete all mandatory modules (or use sidebar)
Step 2: Maintain 90%+ average score
Step 3: Watch: Celebration modal appears 🎉
Step 4: Show: GREEN HIGH_FLYER badge
Step 5: Point out: Advanced modules now unlocked
Step 6: Show: Onboarding Complete in analytics panel
```

### Demo 4: Manager Portal (3 mins)

```
Step 1: Click "Manager Portal" on login page
Step 2: Enter password → Select team
Step 3: Show: Real-time team stats (completion %, at-risk count)
Step 4: Point out: All team members with progress
Step 5: Click user → Show detailed progress modal
Step 6: Show: Auto-refresh every 30 seconds
```

### Demo 5: Visual Builder (2 mins)

```
Step 1: Open page in Contentstack Visual Builder
Step 2: Click any editable text → Show inline editor
Step 3: Make a change to heading
Step 4: Click Publish → Change appears instantly
Step 5: Point out: No developer needed, no rebuild required
```

---

## ⚠️ Integration Challenges & Solutions

### Challenge 1: SDK Instance vs Global Namespace
**Problem**: Personalize SDK v1.0.9+ changed from global `Personalize.set()` to instance-based `sdk.set()`

```typescript
// ❌ OLD WAY (v1.0.8 and earlier)
Personalize.set({ QA_LEVEL: 'HIGH_FLYER' });

// ✅ NEW WAY (v1.0.9+) - What we use
const sdk = await Personalize.init(PROJECT_UID);
await sdk.set({ QA_LEVEL: 'HIGH_FLYER' });
```

**Solution**: 
- Created singleton pattern to store SDK instance
- Added `getSDKInstance()` helper function
- All calls go through the instance, not global namespace

---

### Challenge 2: Taxonomy Case Sensitivity
**Problem**: Contentstack taxonomy terms came as "High Flyer" but app expected "HIGH_FLYER"

```typescript
// Values from Contentstack: "High Flyer", "At Risk", "Rookie"
// App expected: "HIGH_FLYER", "AT_RISK", "ROOKIE"
```

**Solution**: Created `normalizeSegment()` function
```typescript
function normalizeSegment(segment: string): UserSegment {
  const normalized = segment.toUpperCase().replace(/\s+/g, '_');
  // Maps: "High Flyer" → "HIGH_FLYER"
  // Maps: "at risk" → "AT_RISK"
  return normalized as UserSegment;
}
```

---

### Challenge 3: Server-Side vs Client-Side Rendering
**Problem**: Personalize SDK and Live Preview SDK only work in browser (client-side)

```typescript
// ❌ This fails on server
const sdk = Personalize.init(PROJECT_UID);  // window undefined!
```

**Solution**: Added SSR guards and dynamic imports
```typescript
export async function initializePersonalize(): Promise<boolean> {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.log('⏭️ Personalize: Skipping initialization (server-side)');
    return false;
  }
  
  // Dynamic import to avoid SSR issues
  const PersonalizeModule = await import('@contentstack/personalize-edge-sdk');
  // ... rest of initialization
}
```

---

### Challenge 4: Variant Fetching Requires Management API
**Problem**: Delivery SDK can't access content variants (only published base entries)

**Solution**: Created API route to use Management API server-side
```
Frontend → /api/variants/[entryUid] → Management API → Return variants
```

Benefits:
- Management token stays server-side (secure)
- Variants matched to user's segment
- Base entry merged with variant overrides

---

### Challenge 5: Content Cache Invalidation
**Problem**: After editing in Visual Builder, old content still showing

**Solution**: Implemented `contentVersion` state in LivePreviewContext
```typescript
// Provider increments version on each content change
const handleContentChange = () => {
  setContentVersion(prev => prev + 1);
};

// Components re-fetch when version changes
useEffect(() => {
  fetchData();
}, [contentVersion]);
```

---

### Challenge 6: Teams Must Be Dynamic (Not Hardcoded)
**Problem**: Initially teams were hardcoded. Need to add teams without code changes.

**Solution**: Fetch teams from Contentstack page entry
```typescript
// Teams are now references in a modular_blocks field
const teamsBlock = entry.modular_blocks.find(block => block.teams);
const teams = teamsBlock.teams.team_name.map(item => ({
  team: item.reference[0].team,
  managerName: item.reference[0].manager_name,
  // ... other fields
}));
```

---

### Challenge 7: User Data Persistence Across Sessions
**Problem**: How to identify returning users and restore their progress?

**Solution**: User profiles stored as Contentstack entries
- Query by name + team combination
- Full profile stored: completed modules, scores, segment, etc.
- Debounced auto-save (2 seconds after last change)

---

### Challenge 8: Quiz Score Impact on Segment
**Problem**: Need automatic segment transitions based on performance

**Solution**: Implemented in `completeModule()`:
```typescript
if (score < 50 && segment === 'ROOKIE') {
  updateSegment('AT_RISK');
  notifyManager();  // Slack notification
} else if (score >= 70 && segment === 'AT_RISK') {
  // Check if all remedial modules complete
  if (allRemedialComplete) {
    updateSegment('ROOKIE');  // Recovery!
  }
}
```

---

## 🏆 Technical Achievements

### What We Built

| Achievement | Details |
|-------------|---------|
| **Full CMS Integration** | All content managed in Contentstack, zero hardcoded content |
| **Real User Persistence** | User profiles stored in Contentstack, survives page refresh |
| **Dynamic Personalization** | Content filtered by team + segment automatically |
| **Variant Support** | Different content versions for different user segments |
| **Visual Builder Ready** | Edit tags on all components, live preview works |
| **Slack Integration** | Real notifications for onboarding, failures, recovery |
| **Manager Portal** | Separate authenticated view for team oversight |
| **Type-Safe SDK** | Full TypeScript with Delivery SDK |
| **Production Ready** | Deployed on Contentstack Launch |

### Performance Optimizations

```
✅ SDK singleton pattern (initialize once)
✅ Content caching with 5-minute TTL
✅ Debounced auto-save (2s delay)
✅ Lazy loading for modals
✅ Parallel API calls where possible
✅ Optimized re-renders with React Context
```

---

## 🚀 Future Roadmap

### Phase 2: Enhanced Personalization
- [ ] A/B testing with Personalize SDK
- [ ] ML-powered module recommendations
- [ ] Adaptive difficulty based on performance

### Phase 3: Extended Analytics
- [ ] Team leaderboards
- [ ] Completion time analysis
- [ ] Learning path optimization

### Phase 4: Automation Hub
- [ ] Email notifications
- [ ] JIRA ticket creation for support
- [ ] MS Teams integration

### Phase 5: Advanced Content
- [ ] Interactive simulations
- [ ] Peer review assignments
- [ ] Certification PDF generation

---

## 📞 Demo Support

### Quick Commands

```bash
# Start development server
npm run dev

# Open application
open http://localhost:3000

# View in Contentstack
# Dashboard → Visual Builder → Select environment
```

### Test Credentials

| Portal | Access |
|--------|--------|
| **User Portal** | Any name + select team |
| **Manager Portal** | Password: `Test@123` (or env var) |

### Key URLs

| Page | URL |
|------|-----|
| Login | `/login` |
| Dashboard | `/dashboard` |
| Modules | `/dashboard/modules` |
| Manager Login | `/manager/login` |
| Manager Dashboard | `/manager/dashboard` |

---

<div align="center">

### 🎉 Thank You!

**SkillStream QA Onboarding DXP**
*Demonstrating the Full Power of Contentstack's Digital Experience Platform*

---

*Built with ❤️ using Next.js 14, TypeScript, and Contentstack*

</div>

