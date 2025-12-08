/**
 * Contentstack User Service
 * 
 * Handles user data operations:
 * - READ operations use the Delivery SDK (for reading published content)
 * - WRITE operations use Management API (create, update, delete, publish)
 */

import axios from 'axios';
import contentstack, { Region } from '@contentstack/delivery-sdk';
import { UserProfile, UserSegment, Team } from '@/types';

// Contentstack Configuration
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';
const REGION = (process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'NA').toUpperCase();

// Management API still uses direct HTTP calls
const MANAGEMENT_API_HOST = 'https://api.contentstack.io';

// SDK stack instance for read operations
let userServiceStack: ReturnType<typeof contentstack.stack> | null = null;

function getSDKStack() {
  if (!userServiceStack && API_KEY && DELIVERY_TOKEN) {
    const regionMap: Record<string, Region> = {
      'NA': Region.US,
      'EU': Region.EU,
      'AZURE_NA': Region.AZURE_NA,
      'AZURE_EU': Region.AZURE_EU,
    };
    
    userServiceStack = contentstack.stack({
      apiKey: API_KEY,
      deliveryToken: DELIVERY_TOKEN,
      environment: ENVIRONMENT,
      region: regionMap[REGION] || Region.US,
    });
  }
  return userServiceStack;
}

// Always use Contentstack on server-side (API routes)
const useContentstack = true;

// User entry interface for SDK
interface UserEntry {
  uid: string;
  title: string;
  user_id: string;
  name: string;
  email?: string;
  team: string;
  role: string;
  segment: string;
  join_date: string;
  completed_modules: string;
  quiz_scores: string;
  module_progress: string;
  completed_sops: string;
  explored_tools: string;
  time_spent: number;
  interventions_received: number;
  onboarding_complete: boolean;
  onboarding_completed_date?: string;
  // Challenge Pro fields (CMS field names are lowercase without underscores)
  challengeprounlocked?: boolean;
  challengeproenabled?: boolean;
  challengeprovariantalias?: string;
}

// Helper to safely parse JSON strings from Contentstack fields
function parseJsonField<T>(field: string | undefined, defaultValue: T): T {
  if (!field) return defaultValue;
  try {
    return JSON.parse(field) as T;
  } catch (e) {
    console.error('Error parsing JSON field:', field, e);
    return defaultValue;
  }
}

// Helper to convert Contentstack entry to UserProfile
function csEntryToUserProfile(entry: UserEntry): UserProfile {
  return {
    name: entry.name,
    role: entry.role || 'QA Engineer',
    team: entry.team as Team,
    segment: entry.segment as UserSegment,
    joinDate: entry.join_date,
    completedModules: parseJsonField(entry.completed_modules, []),
    quizScores: parseJsonField(entry.quiz_scores, {}),
    timeSpent: entry.time_spent || 0,
    interventionsReceived: entry.interventions_received || 0,
    moduleProgress: parseJsonField(entry.module_progress, {}),
    completedSOPs: parseJsonField(entry.completed_sops, []),
    exploredTools: parseJsonField(entry.explored_tools, []),
    onboardingComplete: entry.onboarding_complete || false,
    onboardingCompletedDate: entry.onboarding_completed_date,
    // Challenge Pro fields
    challengeProUnlocked: entry.challengeprounlocked || false,
    challengeProEnabled: entry.challengeproenabled || false,
    challengeProVariantAlias: entry.challengeprovariantalias
  };
}

// Helper to convert UserProfile to Contentstack entry format
function userProfileToCsEntry(user: UserProfile) {
  const userId = `${user.name}_${user.team}`.replace(/\s+/g, '_');
  
  return {
    title: user.name,
    user_id: userId,
    name: user.name,
    email: '',
    team: user.team,
    role: user.role,
    segment: user.segment,
    join_date: user.joinDate,
    completed_modules: JSON.stringify(user.completedModules),
    quiz_scores: JSON.stringify(user.quizScores),
    module_progress: JSON.stringify(user.moduleProgress || {}),
    completed_sops: JSON.stringify(user.completedSOPs),
    explored_tools: JSON.stringify(user.exploredTools),
    time_spent: user.timeSpent,
    interventions_received: user.interventionsReceived,
    onboarding_complete: user.onboardingComplete,
    onboarding_completed_date: user.onboardingCompletedDate || '',
    segment_history: JSON.stringify([]),
    last_activity: new Date().toISOString(),
    // Challenge Pro fields
    challengeprounlocked: user.challengeProUnlocked || false,
    challengeproenabled: user.challengeProEnabled || false,
    challengeprovariantalias: user.challengeProVariantAlias || ''
  };
}

/**
 * Get user by name and team from Contentstack using SDK
 */
export async function getUserByNameAndTeam(name: string, team: Team): Promise<UserProfile | null> {
  if (!useContentstack || !API_KEY || !DELIVERY_TOKEN) {
    return null;
  }

  const stack = getSDKStack();
  if (!stack) return null;

  try {
    const userId = `${name}_${team}`.replace(/\s+/g, '_');
    
    // Use SDK query to find user
    const result = await stack
      .contentType('qa_user')
      .entry()
      .query({ user_id: userId })
      .find<UserEntry>();

    const entries = (result as any).entries || [];

    if (entries.length > 0) {
      return csEntryToUserProfile(entries[0]);
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Create new user in Contentstack (Management API - cannot use SDK)
 */
export async function createUser(user: UserProfile): Promise<UserProfile> {
  if (!useContentstack || !API_KEY || !MANAGEMENT_TOKEN) {
    return user;
  }

  try {
    const entryData = userProfileToCsEntry(user);
    
    const response = await axios.post(
      `${MANAGEMENT_API_HOST}/v3/content_types/qa_user/entries`,
      { entry: entryData },
      {
        headers: {
          api_key: API_KEY,
          authorization: MANAGEMENT_TOKEN,
          'Content-Type': 'application/json'
        },
        params: { locale: 'en-us' }
      }
    );

    await publishUserEntry(response.data.entry.uid);
    return user;
  } catch (error: any) {
    return user;
  }
}

/**
 * Update existing user in Contentstack (Management API - cannot use SDK)
 */
export async function updateUser(name: string, team: Team, updates: Partial<UserProfile>): Promise<void> {
  if (!useContentstack || !API_KEY || !MANAGEMENT_TOKEN) return;

  try {
    const userId = `${name}_${team}`.replace(/\s+/g, '_');
    
    // Use Management API to get entry for update
    const getResponse = await axios.get(`${MANAGEMENT_API_HOST}/v3/content_types/qa_user/entries`, {
      headers: { api_key: API_KEY, authorization: MANAGEMENT_TOKEN },
      params: { query: JSON.stringify({ user_id: userId }) }
    });

    if (!getResponse.data.entries || getResponse.data.entries.length === 0) return;

    const entryUid = getResponse.data.entries[0].uid;
    const currentEntry = getResponse.data.entries[0];
    
    const mergedUser: UserProfile = {
      name: updates.name || currentEntry.name,
      role: updates.role || currentEntry.role,
      team: (updates.team || currentEntry.team) as Team,
      segment: (updates.segment || currentEntry.segment) as UserSegment,
      joinDate: updates.joinDate || currentEntry.join_date,
      completedModules: updates.completedModules || parseJsonField(currentEntry.completed_modules, []),
      quizScores: updates.quizScores || parseJsonField(currentEntry.quiz_scores, {}),
      timeSpent: updates.timeSpent !== undefined ? updates.timeSpent : currentEntry.time_spent,
      interventionsReceived: updates.interventionsReceived !== undefined ? updates.interventionsReceived : currentEntry.interventions_received,
      moduleProgress: updates.moduleProgress || parseJsonField(currentEntry.module_progress, {}),
      completedSOPs: updates.completedSOPs || parseJsonField(currentEntry.completed_sops, []),
      exploredTools: updates.exploredTools || parseJsonField(currentEntry.explored_tools, []),
      onboardingComplete: updates.onboardingComplete !== undefined ? updates.onboardingComplete : currentEntry.onboarding_complete,
      onboardingCompletedDate: updates.onboardingCompletedDate || currentEntry.onboarding_completed_date,
      // Challenge Pro fields
      challengeProUnlocked: updates.challengeProUnlocked !== undefined ? updates.challengeProUnlocked : currentEntry.challengeprounlocked,
      challengeProEnabled: updates.challengeProEnabled !== undefined ? updates.challengeProEnabled : currentEntry.challengeproenabled,
      challengeProVariantAlias: updates.challengeProVariantAlias || currentEntry.challengeprovariantalias
    };
    
    const entryData = userProfileToCsEntry(mergedUser);
    
    await axios.put(
      `${MANAGEMENT_API_HOST}/v3/content_types/qa_user/entries/${entryUid}`,
      { entry: entryData },
      {
        headers: { api_key: API_KEY, authorization: MANAGEMENT_TOKEN, 'Content-Type': 'application/json' },
        params: { locale: 'en-us' }
      }
    );

    await publishUserEntry(entryUid);
  } catch (error: any) {
    // Silent fail - user update errors are not critical
  }
}

/**
 * Publish user entry to dev environment (Management API - cannot use SDK)
 */
async function publishUserEntry(entryUid: string): Promise<void> {
  try {
    await axios.post(
      `${MANAGEMENT_API_HOST}/v3/content_types/qa_user/entries/${entryUid}/publish`,
      { entry: { environments: [ENVIRONMENT], locales: ['en-us'] } },
      { headers: { api_key: API_KEY, authorization: MANAGEMENT_TOKEN, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // Silent fail - publish errors are retried on next save
  }
}

/**
 * Get all users for a specific team using SDK (for manager dashboard)
 */
export async function getUsersByTeam(team: Team): Promise<UserProfile[]> {
  if (!useContentstack || !API_KEY || !DELIVERY_TOKEN) return [];

  const stack = getSDKStack();
  if (!stack) return [];

  try {
    // Use SDK query with team filter and limit
    const result = await stack
      .contentType('qa_user')
      .entry()
      .query({ team })
      .limit(100)
      .find<UserEntry>();

    const entries = (result as any).entries || [];

    if (entries.length > 0) {
      return entries.map(csEntryToUserProfile);
    }
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Delete user from Contentstack (Management API - cannot use SDK)
 */
export async function deleteUser(name: string, team: Team): Promise<boolean> {
  if (!useContentstack || !API_KEY || !MANAGEMENT_TOKEN) return false;

  try {
    const userId = `${name}_${team}`.replace(/\s+/g, '_');
    
    const getResponse = await axios.get(`${MANAGEMENT_API_HOST}/v3/content_types/qa_user/entries`, {
      headers: { api_key: API_KEY, authorization: MANAGEMENT_TOKEN },
      params: { query: JSON.stringify({ user_id: userId }) }
    });

    if (!getResponse.data.entries || getResponse.data.entries.length === 0) return false;

    const entryUid = getResponse.data.entries[0].uid;
    
    await axios.delete(
      `${MANAGEMENT_API_HOST}/v3/content_types/qa_user/entries/${entryUid}`,
      { headers: { api_key: API_KEY, authorization: MANAGEMENT_TOKEN } }
    );

    return true;
  } catch (error: any) {
    return false;
  }
}
