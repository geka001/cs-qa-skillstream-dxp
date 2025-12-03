import axios from 'axios';
import { UserProfile, UserSegment, Team } from '@/types';

// Contentstack Configuration - use NEXT_PUBLIC_ vars (available on both client and server)
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';
const REGION = (process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'NA').toUpperCase();

const DELIVERY_API_HOST = `https://cdn.contentstack.io`;
const MANAGEMENT_API_HOST = 'https://api.contentstack.io';

// Always use Contentstack on server-side (API routes)
const useContentstack = true;

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
function csEntryToUserProfile(entry: any): UserProfile {
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
    onboardingCompletedDate: entry.onboarding_completed_date
  };
}

// Helper to convert UserProfile to Contentstack entry format
function userProfileToCsEntry(user: UserProfile) {
  const userId = `${user.name}_${user.team}`.replace(/\s+/g, '_');
  
  return {
    title: user.name,
    user_id: userId,
    name: user.name,
    email: '', // Optional field
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
    segment_history: JSON.stringify([]), // Will be populated by analytics
    last_activity: new Date().toISOString()
  };
}

/**
 * Get user by name and team from Contentstack
 */
export async function getUserByNameAndTeam(name: string, team: Team): Promise<UserProfile | null> {
  if (!useContentstack || !API_KEY || !DELIVERY_TOKEN) {
    return null;
  }

  try {
    const userId = `${name}_${team}`.replace(/\s+/g, '_');
    
    const response = await axios.get(`${DELIVERY_API_HOST}/v3/content_types/qa_user/entries`, {
      headers: {
        api_key: API_KEY,
        access_token: DELIVERY_TOKEN,
      },
      params: {
        environment: ENVIRONMENT,
        query: JSON.stringify({
          user_id: userId
        })
      },
    });

    if (response.data.entries && response.data.entries.length > 0) {
      return csEntryToUserProfile(response.data.entries[0]);
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Create new user in Contentstack
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
 * Update existing user in Contentstack
 */
export async function updateUser(name: string, team: Team, updates: Partial<UserProfile>): Promise<void> {
  if (!useContentstack || !API_KEY || !MANAGEMENT_TOKEN) return;

  try {
    const userId = `${name}_${team}`.replace(/\s+/g, '_');
    
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
      onboardingCompletedDate: updates.onboardingCompletedDate || currentEntry.onboarding_completed_date
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
 * Publish user entry to dev environment
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
 * Get all users for a specific team (for manager dashboard)
 */
export async function getUsersByTeam(team: Team): Promise<UserProfile[]> {
  if (!useContentstack || !API_KEY || !DELIVERY_TOKEN) return [];

  try {
    const response = await axios.get(`${DELIVERY_API_HOST}/v3/content_types/qa_user/entries`, {
      headers: { api_key: API_KEY, access_token: DELIVERY_TOKEN },
      params: { environment: ENVIRONMENT, query: JSON.stringify({ team }), limit: 100 },
    });

    if (response.data.entries && response.data.entries.length > 0) {
      return response.data.entries.map(csEntryToUserProfile);
    }
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Delete user from Contentstack (admin function)
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

