# SkillStream QA Onboarding DXP - Quick Setup Guide

## Prerequisites
- Node.js 18 or higher
- npm or yarn

## Installation Steps

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## First Time Setup

1. You'll be redirected to the login page
2. Enter your name
3. Choose a role:
   - **Rookie**: Start with foundational modules
   - **At-Risk**: See intervention features and support
   - **High-Flyer**: Access advanced content

4. Explore the dashboard and start learning!

## Key Features to Try

### Quick Actions (in Sidebar)
- **Simulate Fail Quiz**: See the AT-RISK intervention flow
- **Simulate Pass Quiz**: Upgrade to HIGH-FLYER status  
- **Reset Profile**: Start fresh as a ROOKIE

### Learning Flow
1. Click on any module card
2. Read the content
3. Take the quiz
4. Watch your segment and analytics update

### Analytics
- Right panel shows real-time metrics
- Visit the Analytics page for detailed charts
- Track your progress over time

## Building for Production

```bash
npm run build
npm start
```

## Deployment to Contentstack Launch

This app is ready for Contentstack Launch deployment:
- All dependencies are production-ready
- SSR-safe localStorage implementation
- Optimized build configuration
- No external API dependencies (uses mock data)

Simply connect your Git repository to Launch and deploy!

## Need Help?

Check the main README.md for detailed documentation.

Happy Learning! 🚀

