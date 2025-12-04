/**
 * Team Service - Fetches teams dynamically from Contentstack using Delivery SDK
 * 
 * Teams are fetched from the page content type entry that contains
 * modular_blocks with teams data including team_name references.
 */

import contentstack, { Region } from '@contentstack/delivery-sdk';
import { TeamConfig } from '@/types';

// Contentstack API credentials - from environment variables with fallback
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || 'blt8202119c48319b1d';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || 'csdf941d70d6da13d4ae6265de';
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';

// Page titles in Contentstack (used to find entries dynamically)
const LOGIN_PAGE_TITLE = 'login';
const DASHBOARD_PAGE_TITLE = 'dashboard';

// Get region from environment
const REGION = (process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'NA').toUpperCase();
const regionMap: Record<string, Region> = {
  'NA': Region.US,
  'EU': Region.EU,
  'AZURE_NA': Region.AZURE_NA,
  'AZURE_EU': Region.AZURE_EU,
};

// Initialize SDK stack instance for team service
const teamServiceStack = contentstack.stack({
  apiKey: API_KEY,
  deliveryToken: ACCESS_TOKEN,
  environment: ENVIRONMENT,
  region: regionMap[REGION] || Region.US,
});

// Hero banner data interface
export interface HeroBanner {
  heading: string;
  description: string;
}

// Stats block data interface
export interface StatsData {
  teamCountLabel: string;       // e.g., "Product Teams"
  moduleCountValue: string;     // e.g., "15+" or "20"
  moduleCountLabel: string;     // e.g., "Training Modules"
  managerStatValue: string;     // e.g., "Real-time"
  managerStatLabel: string;     // e.g., "Progress Tracking"
}

// Login page data interface (combines hero banners, teams, and stats)
export interface LoginPageData {
  heroBanner: HeroBanner;       // Main section hero banner
  cardBanner: HeroBanner;       // Card/form section hero banner (Get Started)
  teams: TeamConfig[];
  stats: StatsData;             // Stats section data
}

// Cache for login page data (avoid repeated API calls)
let loginPageCache: LoginPageData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for page UIDs (fetched by title)
let pageUidCache: Record<string, string> = {};

/**
 * Fetch page entry UID by title from Contentstack
 * Caches the result to avoid repeated lookups
 */
async function getPageUidByTitle(title: string): Promise<string | null> {
  // Return cached UID if available
  if (pageUidCache[title]) {
    return pageUidCache[title];
  }

  try {
    // Query for page entries with matching title (case-insensitive)
    const result = await teamServiceStack
      .contentType('page')
      .entry()
      .query({ title: { $regex: `^${title}$`, $options: 'i' } })
      .find();

    const entries = (result as any).entries || [];
    
    if (entries.length > 0) {
      const uid = entries[0].uid;
      pageUidCache[title] = uid;
      return uid;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching page UID for title "${title}":`, error);
    return null;
  }
}

// Page entry interface for SDK typing
interface PageEntry {
  uid: string;
  title: string;
  modular_blocks?: Array<{
    hero_banner?: {
      heading?: string;
      description?: string;
    };
    teams?: {
      team_name?: Array<{
        reference?: Array<{
          uid?: string;
          team?: string;
          title?: string;
          description?: string;
          manager_name?: string;
          manager_email?: string;
          color?: string;      // Team color from Contentstack
          icon?: string;       // Team icon from Contentstack
        }>;
      }>;
    };
    stats?: {
      team_count_label?: string;      // e.g., "Product Teams"
      module_count_value?: string;    // e.g., "15+"
      module_count_label?: string;    // e.g., "Training Modules"
      manager_stat_value?: string;    // e.g., "Real-time"
      manager_stat_label?: string;    // e.g., "Progress Tracking"
    };
  }>;
}

/**
 * Fetch login page data from Contentstack using SDK (hero banner + teams)
 * Finds the page entry by title "login" dynamically
 * Returns cached data if available and fresh
 */
export async function getLoginPageData(): Promise<LoginPageData> {
  // Return cached data if fresh
  if (loginPageCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return loginPageCache;
  }

  try {
    // Get the login page UID by title
    const pageUid = await getPageUidByTitle(LOGIN_PAGE_TITLE);
    
    if (!pageUid) {
      console.warn(`Page with title "${LOGIN_PAGE_TITLE}" not found in Contentstack`);
      return {
        heroBanner: getDefaultHeroBanner(),
        cardBanner: getDefaultCardBanner(),
        teams: getDefaultTeams(),
        stats: getDefaultStats(),
      };
    }

    // Fetch single entry using SDK with reference inclusion
    const result = await teamServiceStack
      .contentType('page')
      .entry(pageUid)
      .locale('en-us')
      .addParams({ 'include[]': 'modular_blocks.teams.team_name.reference' })
      .fetch<PageEntry>();

    const entry = result as PageEntry;
    let heroBanner: HeroBanner = getDefaultHeroBanner();
    let cardBanner: HeroBanner = getDefaultCardBanner();
    let teams: TeamConfig[] = getDefaultTeams();
    let stats: StatsData = getDefaultStats();
    
    if (entry && entry.modular_blocks) {
      // Find all hero_banner blocks (first one is main, second is card)
      const heroBannerBlocks = entry.modular_blocks.filter(
        (block) => block.hero_banner
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
        (block) => block.teams
      );

      if (teamsBlock && teamsBlock.teams && teamsBlock.teams.team_name) {
        const teamNameArray = teamsBlock.teams.team_name;
        
        // Map team references to TeamConfig format
        teams = teamNameArray
          .filter((item) => item.reference && item.reference.length > 0)
          .map((item) => {
            const teamData = item.reference![0];
            return {
              team: teamData.team || 'Unknown Team',
              displayName: teamData.team || teamData.title || 'Unknown Team',
              description: teamData.description || '',
              managerName: teamData.manager_name || '',
              managerEmail: teamData.manager_email || '',
              isActive: true,
              uid: teamData.uid || '',
              color: teamData.color || '',  // Color from Contentstack
              icon: teamData.icon || '',     // Icon from Contentstack
            };
          });
      }

      // Find the stats block in modular_blocks
      const statsBlock = entry.modular_blocks.find(
        (block) => block.stats
      );

      if (statsBlock && statsBlock.stats) {
        const defaultStats = getDefaultStats();
        stats = {
          teamCountLabel: statsBlock.stats.team_count_label || defaultStats.teamCountLabel,
          moduleCountValue: statsBlock.stats.module_count_value || defaultStats.moduleCountValue,
          moduleCountLabel: statsBlock.stats.module_count_label || defaultStats.moduleCountLabel,
          managerStatValue: statsBlock.stats.manager_stat_value || defaultStats.managerStatValue,
          managerStatLabel: statsBlock.stats.manager_stat_label || defaultStats.managerStatLabel,
        };
      }
    }

    loginPageCache = { heroBanner, cardBanner, teams, stats };
    cacheTimestamp = Date.now();
    return loginPageCache;
  } catch (error) {
    console.error('Error fetching login page data from Contentstack:', error);
    return {
      heroBanner: getDefaultHeroBanner(),
      cardBanner: getDefaultCardBanner(),
      teams: getDefaultTeams(),
      stats: getDefaultStats(),
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
 * Default stats fallback
 */
function getDefaultStats(): StatsData {
  return {
    teamCountLabel: 'Product Teams',
    moduleCountValue: '15+',
    moduleCountLabel: 'Training Modules',
    managerStatValue: 'Real-time',
    managerStatLabel: 'Progress Tracking',
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
 * Colors are included as Tailwind classes for consistency
 */
function getDefaultTeams(): TeamConfig[] {
  return [
    { team: 'Launch', displayName: 'Launch', description: 'Experience optimization and personalization platform', managerName: 'Sarah Chen', managerEmail: 'sarah.chen@contentstack.com', isActive: true, color: 'bg-purple-500' },
    { team: 'Data & Insights', displayName: 'Data & Insights', description: 'Analytics and intelligence platform', managerName: 'Michael Rodriguez', managerEmail: 'michael.rodriguez@contentstack.com', isActive: true, color: 'bg-blue-500' },
    { team: 'AutoDraft', displayName: 'AutoDraft', description: 'AI-powered content generation', managerName: 'James Kim', managerEmail: 'james.kim@contentstack.com', isActive: true, color: 'bg-orange-500' },
    { team: 'DAM', displayName: 'DAM', description: 'Digital Asset Management system', managerName: 'Emily Thompson', managerEmail: 'emily.thompson@contentstack.com', isActive: true, color: 'bg-cyan-500' },
  ];
}

/**
 * Clear login page cache (call after adding/updating teams in Contentstack)
 */
export function clearTeamsCache(): void {
  loginPageCache = null;
  cacheTimestamp = 0;
}

/**
 * Clear all page caches (including page UID lookup cache)
 */
export function clearAllPageCaches(): void {
  loginPageCache = null;
  cacheTimestamp = 0;
  dashboardPageCache = null;
  dashboardCacheTimestamp = 0;
  pageUidCache = {};
}

// ==================== DASHBOARD PAGE ====================

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
 * Fetch dashboard page content from Contentstack using SDK
 * Finds the page entry by title "dashboard" dynamically
 * Returns cached data if available and fresh
 */
export async function getDashboardPageContent(): Promise<DashboardPageContent> {
  // Return cached data if fresh
  if (dashboardPageCache && Date.now() - dashboardCacheTimestamp < CACHE_DURATION) {
    return dashboardPageCache;
  }

  try {
    // Get the dashboard page UID by title
    const pageUid = await getPageUidByTitle(DASHBOARD_PAGE_TITLE);
    
    if (!pageUid) {
      console.warn(`Page with title "${DASHBOARD_PAGE_TITLE}" not found in Contentstack`);
      return getDefaultDashboardContent();
    }

    // Fetch single entry using SDK
    const result = await teamServiceStack
      .contentType('page')
      .entry(pageUid)
      .locale('en-us')
      .fetch<PageEntry>();

    const entry = result as PageEntry;
    let content: DashboardPageContent = getDefaultDashboardContent();
    
    if (entry && entry.modular_blocks) {
      // Get all hero_banner blocks
      const heroBannerBlocks = entry.modular_blocks.filter(
        (block) => block.hero_banner
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
