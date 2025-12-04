/**
 * Team Service - Fetches teams dynamically from Contentstack
 * 
 * Teams are managed in the `manager_config` content type in Contentstack.
 * To add a new team: Create a new entry in manager_config with:
 * - team: Team identifier (e.g., "Launch", "NewTeam")
 * - manager_name: Manager's full name
 * - manager_email: Manager's email address
 */

import axios from 'axios';
import { TeamConfig } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';
const API_BASE = 'https://cdn.contentstack.io';

// Cache for teams (avoid repeated API calls)
let teamsCache: TeamConfig[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all teams from Contentstack
 * Returns cached data if available and fresh
 */
export async function getTeams(): Promise<TeamConfig[]> {
  // Return cached data if fresh
  if (teamsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return teamsCache;
  }

  if (!API_KEY || !DELIVERY_TOKEN) {
    // Fallback to default teams if Contentstack not configured
    return getDefaultTeams();
  }

  try {
    const response = await axios.get(`${API_BASE}/v3/content_types/manager_config/entries`, {
      headers: {
        api_key: API_KEY,
        access_token: DELIVERY_TOKEN,
      },
      params: {
        environment: ENVIRONMENT,
        limit: 100,
      },
    });

    if (response.data.entries && response.data.entries.length > 0) {
      const teams: TeamConfig[] = response.data.entries.map((entry: any) => ({
        team: entry.team,
        displayName: entry.team, // Use team name as display name
        managerName: entry.manager_name,
        managerEmail: entry.manager_email,
        isActive: true,
      }));
      teamsCache = teams;
      cacheTimestamp = Date.now();
      return teams;
    }

    return getDefaultTeams();
  } catch (error) {
    return getDefaultTeams();
  }
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
    { team: 'Launch', displayName: 'Launch', managerName: 'Sarah Chen', managerEmail: 'sarah.chen@contentstack.com', isActive: true },
    { team: 'Data & Insights', displayName: 'Data & Insights', managerName: 'Michael Rodriguez', managerEmail: 'michael.rodriguez@contentstack.com', isActive: true },
    { team: 'AutoDraft', displayName: 'AutoDraft', managerName: 'James Kim', managerEmail: 'james.kim@contentstack.com', isActive: true },
    { team: 'DAM', displayName: 'DAM', managerName: 'Emily Thompson', managerEmail: 'emily.thompson@contentstack.com', isActive: true },
  ];
}

/**
 * Clear teams cache (call after adding/updating teams in Contentstack)
 */
export function clearTeamsCache(): void {
  teamsCache = null;
  cacheTimestamp = 0;
}

