# SkillStream: QA Onboarding DXP

A fully functional Next.js application demonstrating a personalized QA onboarding experience with segment-based content delivery, analytics, and interactive learning modules.

## 🌟 Features

### Core Functionality
- **Session-based Login**: Simple authentication with role selection (Rookie, At-Risk, High-Flyer)
- **Personalized Content Feed**: Dynamic content delivery based on user segment
- **Interactive Learning Modules**: 7+ comprehensive QA training modules with rich content
- **Interactive Quizzes**: Test knowledge with immediate feedback and detailed results
- **SOPs & Tools**: Standard operating procedures and tool documentation
- **Real-time Analytics**: Track progress, scores, and time spent with visual charts
- **Segment-based Personalization**: Content automatically adapts to user performance

### Segments & Personalization
1. **ROOKIE** (Beginner)
   - Foundation modules with mandatory content
   - Basic SOPs and essential tools
   - Guided learning path

2. **AT-RISK** (Needs Support)
   - Intervention card with manager notification simulation
   - Remedial content and support resources
   - Additional guidance materials

3. **HIGH-FLYER** (Advanced)
   - Advanced modules and expert content
   - Automation and CI/CD topics
   - Fast-track pathways

### Technical Highlights
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **ShadCN UI** components
- **Framer Motion** for smooth animations
- **Recharts** for analytics visualization
- **SSR-safe localStorage** for state persistence
- **Responsive design** for desktop and tablet

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
```bash
cd /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
cs-qa-skillstream-dxp/
├── app/
│   ├── dashboard/          # Dashboard pages
│   │   ├── layout.tsx      # Dashboard layout with sidebar & analytics
│   │   └── page.tsx        # Main dashboard with personalized feed
│   ├── login/
│   │   └── page.tsx        # Login page with role selection
│   ├── layout.tsx          # Root layout with AppProvider
│   ├── page.tsx            # Home page (redirects)
│   └── globals.css         # Global styles
├── components/
│   ├── cards/              # Content cards
│   │   ├── ModuleCard.tsx
│   │   ├── SOPCard.tsx
│   │   ├── ToolCard.tsx
│   │   ├── InterventionCard.tsx
│   │   └── AdvancedPathwayCard.tsx
│   ├── layout/             # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── AnalyticsPanel.tsx
│   ├── modules/
│   │   └── ModuleViewer.tsx
│   ├── quiz/
│   │   └── QuizModal.tsx
│   └── ui/                 # ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       └── progress.tsx
├── contexts/
│   └── AppContext.tsx      # Global state management
├── data/
│   └── mockData.ts         # Mock modules, SOPs, tools
├── lib/
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript interfaces
└── package.json
```

## 🎮 Using the Application

### Login
1. Enter your name
2. Select your starting role:
   - **Rookie**: Start from basics
   - **At-Risk**: See intervention features
   - **High-Flyer**: Access advanced content

### Dashboard Features
- **Personalized Feed**: View modules tailored to your segment
- **Module Cards**: Click to view content and take quizzes
- **Analytics Panel**: Track your progress in real-time
- **Quick Actions** (in sidebar):
  - Simulate Fail Quiz → Triggers AT-RISK state
  - Simulate Pass Quiz → Triggers HIGH-FLYER state
  - Reset Profile → Return to ROOKIE state

### Module Learning Flow
1. Click "Start Learning" on any module card
2. Read the content and watch videos
3. Click "Start Quiz" to test your knowledge
4. Answer all questions
5. Review your results and explanations
6. Module completion updates your analytics

### Segment Changes
- **Auto-triggered** based on quiz performance:
  - Score < 50% → AT-RISK
  - Score ≥ 90% + 50% completion → HIGH-FLYER
- **Manual simulation** via sidebar quick actions
- **Visual feedback** via toast notifications and intervention cards

## 🎨 Personalization Logic

The app demonstrates real-world personalization patterns:

1. **Content Filtering**: Only relevant modules shown per segment
2. **Dynamic Sorting**: Mandatory modules appear first
3. **Intervention Cards**: Appear for AT-RISK users
4. **Advanced Pathways**: Unlock for HIGH-FLYER users
5. **Manager Notifications**: Simulated for AT-RISK transitions

## 📊 Analytics Dashboard

Right panel shows:
- Current segment with color coding
- Modules completed
- Time spent learning
- Module completion percentage
- Average quiz score with chart
- Weekly activity timeline
- Segment history

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Future Contentstack integration
CONTENTSTACK_API_KEY=your_key
CONTENTSTACK_DELIVERY_TOKEN=your_token
CONTENTSTACK_ENVIRONMENT=production
CONTENTSTACK_REGION=us

# Application settings
NEXT_PUBLIC_APP_NAME=SkillStream QA Onboarding DXP
```

## 🚢 Deployment to Contentstack Launch

This app is fully compatible with Contentstack Launch:

1. **Build the application**
```bash
npm run build
```

2. **Deploy to Launch**
   - Push to your Git repository
   - Connect repository in Contentstack Launch
   - Launch will auto-detect Next.js and deploy

### Launch Compatibility Features
- ✅ Static asset optimization
- ✅ SSR-safe localStorage with fallbacks
- ✅ Standalone output mode
- ✅ Optimized images (unoptimized flag for compatibility)
- ✅ Environment variable support

## 🎯 Key Features Demo Flow

### Demo Scenario 1: Rookie Journey
1. Login as Rookie
2. Complete "Introduction to QA Testing"
3. Pass quiz with 95%
4. Watch segment upgrade to High-Flyer
5. See advanced modules unlock

### Demo Scenario 2: At-Risk Intervention
1. Login as At-Risk or use "Simulate Fail Quiz"
2. See red intervention card
3. Manager notification toast appears
4. Access remedial content
5. Complete recovery module

### Demo Scenario 3: High-Flyer Path
1. Login as High-Flyer
2. See green advanced pathway card
3. Access Selenium and API testing modules
4. View advanced tools (Jenkins, GitHub)

## 🛠️ Tech Stack Details

- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5.5.4
- **Styling**: TailwindCSS 3.4.1
- **UI Components**: Custom ShadCN components
- **Animations**: Framer Motion 11.3
- **Charts**: Recharts 2.12
- **Icons**: Lucide React 0.424
- **Notifications**: Sonner 1.5
- **State**: React Context API + localStorage

## 🔮 Future Integration Points

### Contentstack CMS
- Replace mock data with Contentstack Content Types
- Use Delivery API for content fetching
- Implement Live Preview
- Add content management workflows

### Lytics CDP
- Track user interactions
- Send segment events
- Receive real-time audience updates
- Sync with Contentstack Personalize

### AWS Personalize
- ML-powered recommendations
- Predictive module suggestions
- Dynamic difficulty adjustment

### Automation Hub
- Real Slack notifications
- Email alerts to managers
- JIRA ticket creation
- MS Teams integration

## 📝 Mock Data

All content is currently mock data including:
- 7 QA learning modules
- 4 SOPs (Standard Operating Procedures)
- 7 tools with documentation links
- Quiz questions with explanations

Ready to be replaced with real Contentstack content!

## 🐛 Troubleshooting

**Issue**: Blank screen after login
- **Solution**: Check browser console, ensure localStorage is enabled

**Issue**: Animations not working
- **Solution**: Ensure Framer Motion is installed: `npm install framer-motion`

**Issue**: Charts not displaying
- **Solution**: Verify Recharts installation: `npm install recharts`

## 📄 License

This is a demo application for Contentstack integration.

## 👥 Support

For questions or issues:
- Review the code comments for implementation details
- Check console logs for debugging information
- Ensure all dependencies are properly installed

## 🎉 What Makes This Special

1. **Production-Ready**: Fully functional, not just a prototype
2. **Real UX Patterns**: Mimics actual enterprise applications
3. **Complete Flows**: Login → Learning → Testing → Analytics
4. **Smart Personalization**: Demonstrates real CDP/Personalize patterns
5. **Professional UI**: Modern, responsive, accessible design
6. **Well-Documented**: Extensive code comments and documentation

---

Built with ❤️ for demonstrating Contentstack's powerful DXP capabilities.

