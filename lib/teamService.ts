/**
 * Team Service - Fetches teams dynamically from Contentstack
 * 
 * Teams are fetched from the page content type entry that contains
 * modular_blocks with teams data including team_name references.
 */

import axios from 'axios';
import { TeamConfig } from '@/types';

// Contentstack API credentials for login page teams
const API_KEY = 'blt8202119c48319b1d';
const ACCESS_TOKEN = 'csdf941d70d6da13d4ae6265de';
const API_BASE = 'https://cdn.contentstack.io';
const PAGE_ENTRY_UID = 'bltc2d2d2a2faedf9d1';

// Hero banner data interface
export interface HeroBanner {
  heading: string;
  description: string;
}

// Login page data interface (combines hero banners and teams)
export interface LoginPageData {
  heroBanner: HeroBanner;       // Main section hero banner
  cardBanner: HeroBanner;       // Card/form section hero banner (Get Started)
  teams: TeamConfig[];
}

// Cache for login page data (avoid repeated API calls)
let loginPageCache: LoginPageData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch login page data from Contentstack (hero banner + teams)
 * Returns cached data if available and fresh
 */
export async function getLoginPageData(): Promise<LoginPageData> {
  // Return cached data if fresh
  if (loginPageCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return loginPageCache;
  }

  try {
    const response = await axios.get(
      `${API_BASE}/v3/content_types/page/entries/${PAGE_ENTRY_UID}`,
      {
        headers: {
          api_key: API_KEY,
          access_token: ACCESS_TOKEN,
        },
        params: {
          locale: 'en-us',
          'include[]': 'modular_blocks.teams.team_name.reference',
        },
      }
    );

    const entry = response.data.entry;
    let heroBanner: HeroBanner = getDefaultHeroBanner();
    let cardBanner: HeroBanner = getDefaultCardBanner();
    let teams: TeamConfig[] = getDefaultTeams();
    
    if (entry && entry.modular_blocks) {
      // Find all hero_banner blocks (first one is main, second is card)
      const heroBannerBlocks = entry.modular_blocks.filter(
        (block: any) => block.hero_banner
      );

      // First hero banner - main section
      if (heroBannerBlocks[0] && heroBannerBlocks[0].hero_banner) {
        heroBanner = {
          heading: heroBannerBlocks[0].hero_banner.heading || getDefaultHeroBanner().heading,
          description: heroBannerBlocks[0].hero_banner.description || getDefaultHeroBanner().description,
        };
      }

      // Second hero banner - card/form section (Get Started)
      if (heroBannerBlocks[1] && heroBannerBlocks[1].hero_banner) {
        cardBanner = {
          heading: heroBannerBlocks[1].hero_banner.heading || getDefaultCardBanner().heading,
          description: heroBannerBlocks[1].hero_banner.description || getDefaultCardBanner().description,
        };
      }

      // Find the teams block in modular_blocks
      const teamsBlock = entry.modular_blocks.find(
        (block: any) => block.teams
      );

      if (teamsBlock && teamsBlock.teams && teamsBlock.teams.team_name) {
        const teamNameArray = teamsBlock.teams.team_name;
        
        // Map team references to TeamConfig format
        // Each team_name item has a 'reference' array with the actual team data
        teams = teamNameArray
          .filter((item: any) => item.reference && item.reference.length > 0)
          .map((item: any) => {
            const teamData = item.reference[0]; // Get the first reference (the actual team data)
            return {
              team: teamData.team || 'Unknown Team',
              displayName: teamData.team || teamData.title || 'Unknown Team',
              description: teamData.description || '',
              managerName: teamData.manager_name || '',
              managerEmail: teamData.manager_email || '',
              isActive: true,
              uid: teamData.uid || '',
            };
          });
      }
    }

    loginPageCache = { heroBanner, cardBanner, teams };
    cacheTimestamp = Date.now();
    return loginPageCache;
  } catch (error) {
    console.error('Error fetching login page data from Contentstack:', error);
    return {
      heroBanner: getDefaultHeroBanner(),
      cardBanner: getDefaultCardBanner(),
      teams: getDefaultTeams(),
    };
  }
}

/**
 * Fetch all teams from Contentstack page entry
 * Returns cached data if available and fresh
 */
export async function getTeams(): Promise<TeamConfig[]> {
  const pageData = await getLoginPageData();
  return pageData.teams;
}

/**
 * Default hero banner fallback (main section)
 */
function getDefaultHeroBanner(): HeroBanner {
  return {
    heading: 'Welcome to Your Product Team Training',
    description: 'Get onboarded to your Contentstack product team with personalized QA training. Learn the tools, processes, and testing strategies specific to your product.',
  };
}

/**
 * Default card banner fallback (Get Started section)
 */
function getDefaultCardBanner(): HeroBanner {
  return {
    heading: 'Get Started',
    description: 'Enter your details to begin your team-specific QA training',
  };
}

/**
 * Get team names only (for dropdowns)
 */
export async function getTeamNames(): Promise<string[]> {
  const teams = await getTeams();
  return teams.map(t => t.team);
}

/**
 * Get manager details for a specific team
 */
export async function getManagerForTeam(team: string): Promise<{ name: string; email: string } | null> {
  const teams = await getTeams();
  const teamConfig = teams.find(t => t.team === team);
  
  if (teamConfig) {
    return {
      name: teamConfig.managerName,
      email: teamConfig.managerEmail,
    };
  }
  
  return null;
}

/**
 * Check if a team exists
 */
export async function isValidTeam(team: string): Promise<boolean> {
  const teams = await getTeams();
  return teams.some(t => t.team === team);
}

/**
 * Default teams fallback (when Contentstack is not available)
 */
function getDefaultTeams(): TeamConfig[] {
  return [
    { team: 'Launch', displayName: 'Launch', description: 'Experience optimization and personalization platform', managerName: 'Sarah Chen', managerEmail: 'sarah.chen@contentstack.com', isActive: true },
    { team: 'Data & Insights', displayName: 'Data & Insights', description: 'Analytics and intelligence platform', managerName: 'Michael Rodriguez', managerEmail: 'michael.rodriguez@contentstack.com', isActive: true },
    { team: 'AutoDraft', displayName: 'AutoDraft', description: 'AI-powered content generation', managerName: 'James Kim', managerEmail: 'james.kim@contentstack.com', isActive: true },
    { team: 'DAM', displayName: 'DAM', description: 'Digital Asset Management system', managerName: 'Emily Thompson', managerEmail: 'emily.thompson@contentstack.com', isActive: true },
  ];
}

/**
 * Clear login page cache (call after adding/updating teams in Contentstack)
 */
export function clearTeamsCache(): void {
  loginPageCache = null;
  cacheTimestamp = 0;
}

// ==================== DASHBOARD PAGE ====================

const DASHBOARD_PAGE_ENTRY_UID = 'blt005577990856a678';

// Dashboard page content interface
export interface DashboardPageContent {
  welcomeHeading: string;
  modulesCompletedLabel: string;
  onboardingStatusLabel: string;
  continueLearningHeading: string;
}

// Cache for dashboard page data
let dashboardPageCache: DashboardPageContent | null = null;
let dashboardCacheTimestamp: number = 0;

/**
 * Fetch dashboard page content from Contentstack
 * Returns cached data if available and fresh
 */
export async function getDashboardPageContent(): Promise<DashboardPageContent> {
  // Return cached data if fresh
  if (dashboardPageCache && Date.now() - dashboardCacheTimestamp < CACHE_DURATION) {
    return dashboardPageCache;
  }

  try {
    const response = await axios.get(
      `${API_BASE}/v3/content_types/page/entries/${DASHBOARD_PAGE_ENTRY_UID}`,
      {
        headers: {
          api_key: API_KEY,
          access_token: ACCESS_TOKEN,
        },
        params: {
          locale: 'en-us',
        },
      }
    );

    const entry = response.data.entry;
    let content: DashboardPageContent = getDefaultDashboardContent();
    
    if (entry && entry.modular_blocks) {
      // Get all hero_banner blocks
      const heroBannerBlocks = entry.modular_blocks.filter(
        (block: any) => block.hero_banner
      );

      // Map hero banners by order:
      // 0: Welcome, 1: Modules Completed, 2: Onboarding Status, 3: Continue Learning
      if (heroBannerBlocks[0]?.hero_banner?.heading) {
        content.welcomeHeading = heroBannerBlocks[0].hero_banner.heading;
      }
      if (heroBannerBlocks[1]?.hero_banner?.heading) {
        content.modulesCompletedLabel = heroBannerBlocks[1].hero_banner.heading;
      }
      if (heroBannerBlocks[2]?.hero_banner?.heading) {
        content.onboardingStatusLabel = heroBannerBlocks[2].hero_banner.heading;
      }
      if (heroBannerBlocks[3]?.hero_banner?.heading) {
        content.continueLearningHeading = heroBannerBlocks[3].hero_banner.heading;
      }
    }

    dashboardPageCache = content;
    dashboardCacheTimestamp = Date.now();
    return content;
  } catch (error) {
    console.error('Error fetching dashboard page content from Contentstack:', error);
    return getDefaultDashboardContent();
  }
}

/**
 * Default dashboard content fallback
 */
function getDefaultDashboardContent(): DashboardPageContent {
  return {
    welcomeHeading: 'Welcome',
    modulesCompletedLabel: 'Modules Completed',
    onboardingStatusLabel: 'Onboarding Status',
    continueLearningHeading: 'Continue Learning',
  };
}

/**
 * Clear dashboard page cache
 */
export function clearDashboardCache(): void {
  dashboardPageCache = null;
  dashboardCacheTimestamp = 0;
}

