/**
 * Contentstack Service Layer
 * Handles all API calls to Contentstack Delivery API using the TypeScript Delivery SDK
 * 
 * Variant Delivery:
 * - Uses Personalize SDK to determine which variants to show based on user attributes
 * - Passes variant aliases to Delivery SDK for fetching personalized content
 */

import { getStack, isSDKEnabled, isContentstackEnabled, isSDKConfigured, ContentstackConfig } from './contentstackSDK';
import { Tool, SOP, Team, UserSegment, Module, QuizQuestion } from '@/types';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Safely parse JSON string, return default value if parsing fails
 */
function safeJsonParse<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString, error);
    return defaultValue;
  }
}

/**
 * Map app values to taxonomy term UIDs
 * Handles both lowercase UIDs and Title case display names from Contentstack
 */
function mapToTaxonomyTerm(value: string): string {
  return value;
}

/**
 * Check if a taxonomy array contains a value (case-insensitive)
 */
function taxonomyIncludes(taxonomyArray: string[], searchValue: string): boolean {
  if (!taxonomyArray || taxonomyArray.length === 0) return false;
  
  if (taxonomyArray.includes(searchValue)) return true;
  
  const searchLower = searchValue.toLowerCase();
  return taxonomyArray.some(term => term.toLowerCase() === searchLower);
}

/**
 * Normalize segment value to standard format
 * Handles various formats from Contentstack (Title case, lowercase, with spaces, etc.)
 */
function normalizeSegment(segment: string): UserSegment {
  const normalized = segment.toUpperCase().replace(/\s+/g, '_');
  
  // Map common variations to standard segment names
  if (normalized === 'ROOKIE' || normalized === 'ROOKIES') return 'ROOKIE';
  if (normalized === 'AT_RISK' || normalized === 'ATRISK' || normalized === 'AT-RISK') return 'AT_RISK';
  if (normalized === 'HIGH_FLYER' || normalized === 'HIGHFLYER' || normalized === 'HIGH-FLYER' || normalized === 'HIGH_FLYERS') return 'HIGH_FLYER';
  
  // Return as-is if no match (allows for future segment additions)
  return normalized as UserSegment;
}

// ============================================================
// VARIANT SUPPORT - 100% Dynamic from Personalize SDK
// ============================================================

/**
 * Variant delivery uses the Personalize SDK's getVariantAliases() method.
 * 
 * NO HARDCODED VALUES - everything comes from the SDK dynamically!
 * 
 * How it works:
 * 1. User attributes are set via setPersonalizeAttributes()
 * 2. Personalize SDK evaluates audience rules and determines active experiences
 * 3. getVariantAliases() returns aliases in format: cs_personalize_<exp_short_uid>_<variant_short_uid>
 * 4. These aliases work directly with the Delivery API x-cs-variant-uid header
 * 
 * If SDK doesn't return aliases on first try, we retry with reinitialization.
 */

/**
 * Get variant aliases from Personalize SDK with retry mechanism
 * 
 * The Personalize SDK's getVariantAliases() returns aliases in format:
 * cs_personalize_<experience_short_uid>_<variant_short_uid>
 * 
 * These aliases work DIRECTLY with the Delivery API's x-cs-variant-uid header!
 * 
 * @param team - User's team (for logging)
 * @param segment - User's segment (ROOKIE, AT_RISK, HIGH_FLYER)
 * @returns Promise<string> - Comma-separated variant aliases or empty string
 */
async function getVariantAliasesFromPersonalize(team: string, segment: string): Promise<string> {
  // Only HIGH_FLYER users get variant content
  if (segment !== 'HIGH_FLYER') {
    console.log(`📦 Skipping variants for ${segment} user (not HIGH_FLYER)`);
    return '';
  }

  // Try Personalize SDK first (client-side only)
  if (typeof window !== 'undefined') {
    try {
      const { getVariantAliases, reinitializeAndGetAliases } = await import('./personalize');
      
      // First attempt: Get aliases from SDK
      let aliases = await getVariantAliases();
      
      if (aliases && aliases.length > 0) {
        console.log(`✅ Got variant aliases from Personalize SDK for ${team}: ${aliases.join(', ')}`);
        return aliases.join(',');
      }
      
      // Second attempt: Reinitialize SDK and try again
      console.log(`📦 No aliases on first try, reinitializing Personalize SDK for ${team}...`);
      aliases = await reinitializeAndGetAliases();
      
      if (aliases && aliases.length > 0) {
        console.log(`✅ Got variant aliases after reinit for ${team}: ${aliases.join(', ')}`);
        return aliases.join(',');
      }
      
      console.log(`📦 No variant aliases from SDK for ${team} ${segment}, trying fallback...`);
      
    } catch (error) {
      console.warn('⚠️ Could not get variants from Personalize SDK, trying fallback:', error);
    }
  }
  
  // FALLBACK: Fetch HIGH_FLYER variant alias directly from CMS variant groups
  // This ensures HIGH_FLYER users always get variant content even if SDK fails
  try {
    const highFlyerAliases = await fetchHighFlyerAliases();
    const teamAlias = highFlyerAliases[team];
    if (teamAlias) {
      console.log(`✅ Using fallback HIGH_FLYER alias for ${team}: ${teamAlias}`);
      return teamAlias;
    }
    console.log(`📦 No fallback HIGH_FLYER alias found for ${team}`);
  } catch (error) {
    console.warn('⚠️ Fallback alias fetch failed:', error);
  }
  
  return '';
}

// Cache for variant state
let cachedVariantUids: string | null = null;
let cachedTeam: string | null = null;
let cachedSegment: string | null = null;

/**
 * Clear the variant cache (call when user attributes change)
 */
export function clearVariantAliasCache(): void {
  cachedVariantUids = null;
  cachedTeam = null;
  cachedSegment = null;
  console.log('🔄 Variant cache cleared');
}

/**
 * Cache for HIGH_FLYER variant aliases (fetched dynamically from variant groups API)
 * Key: team name, Value: variant alias (cs_personalize_<exp>_0)
 */
let highFlyerAliasCache: Record<string, string> | null = null;
let highFlyerAliasCacheTime: number = 0;

/**
 * Cache for Challenge Pro variant aliases (fetched dynamically from variant groups API)
 * Key: team name, Value: variant alias (cs_personalize_<exp>_0)
 */
let challengeProAliasCache: Record<string, string> | null = null;
let challengeProAliasCacheTime: number = 0;
const VARIANT_ALIAS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch HIGH_FLYER variant aliases dynamically from variant groups API
 * Looks for variant groups with "High Flyer" in the name (but not "challenge-pro")
 * This is a FALLBACK when the Personalize SDK doesn't return aliases
 */
async function fetchHighFlyerAliases(): Promise<Record<string, string>> {
  // Return cached if still valid
  if (highFlyerAliasCache && Date.now() - highFlyerAliasCacheTime < VARIANT_ALIAS_CACHE_TTL) {
    return highFlyerAliasCache;
  }
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
    const mgmtToken = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';
    
    if (!apiKey || !mgmtToken) {
      console.warn('⚠️ Missing API credentials for HIGH_FLYER alias lookup');
      return {};
    }
    
    console.log('🔍 Fetching HIGH_FLYER variant groups (fallback)...');
    
    const response = await fetch('https://api.contentstack.io/v3/variant_groups', {
      headers: {
        'api_key': apiKey,
        'authorization': mgmtToken,
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch variant groups:', response.status);
      return highFlyerAliasCache || {};
    }
    
    const data = await response.json();
    const aliases: Record<string, string> = {};
    
    for (const vg of data.variant_groups || []) {
      const name = vg.name || '';
      // Look for HIGH_FLYER variant groups (e.g., "DAM High Flyer") but NOT challenge-pro
      if (name.toLowerCase().includes('high flyer') && !name.toLowerCase().includes('challenge-pro')) {
        const expShortUid = vg.personalize_metadata?.experience_short_uid;
        if (expShortUid) {
          // Extract team name from variant group name (e.g., 'DAM High Flyer' -> 'DAM')
          const team = name.replace(/\s*High\s*Flyer\s*/i, '').trim();
          const alias = `cs_personalize_${expShortUid}_0`;
          aliases[team] = alias;
          console.log(`🎯 Found HIGH_FLYER alias for ${team}: ${alias}`);
        }
      }
    }
    
    // Cache the results
    highFlyerAliasCache = aliases;
    highFlyerAliasCacheTime = Date.now();
    
    console.log(`✅ Discovered ${Object.keys(aliases).length} HIGH_FLYER variant aliases`);
    return aliases;
    
  } catch (error) {
    console.error('Error fetching HIGH_FLYER aliases:', error);
    return highFlyerAliasCache || {};
  }
}

/**
 * Fetch Challenge Pro variant aliases dynamically from variant groups API
 * Looks for variant groups with "-challenge-pro" in the name
 * NO HARDCODING - discovers all Challenge Pro experiences automatically
 */
async function fetchChallengeProAliases(): Promise<Record<string, string>> {
  // Return cached if still valid
  if (challengeProAliasCache && Date.now() - challengeProAliasCacheTime < VARIANT_ALIAS_CACHE_TTL) {
    return challengeProAliasCache;
  }
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
    const mgmtToken = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';
    
    if (!apiKey || !mgmtToken) {
      console.warn('⚠️ Missing API credentials for Challenge Pro lookup');
      return {};
    }
    
    console.log('🔍 Fetching Challenge Pro variant groups...');
    
    const response = await fetch('https://api.contentstack.io/v3/variant_groups', {
      headers: {
        'api_key': apiKey,
        'authorization': mgmtToken,
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch variant groups:', response.status);
      return challengeProAliasCache || {};
    }
    
    const data = await response.json();
    const aliases: Record<string, string> = {};
    
    for (const vg of data.variant_groups || []) {
      const name = vg.name || '';
      // Look for variant groups with "-challenge-pro" in the name
      if (name.toLowerCase().includes('challenge-pro')) {
        const expShortUid = vg.personalize_metadata?.experience_short_uid;
        if (expShortUid) {
          // Extract team name from variant group name (e.g., 'DAM-challenge-pro' -> 'DAM')
          const team = name.split('-challenge-pro')[0].split('-Challenge-Pro')[0];
          const alias = `cs_personalize_${expShortUid}_0`;
          aliases[team] = alias;
          console.log(`🎯 Found Challenge Pro for ${team}: ${alias}`);
        }
      }
    }
    
    // Cache the results
    challengeProAliasCache = aliases;
    challengeProAliasCacheTime = Date.now();
    
    console.log(`✅ Discovered ${Object.keys(aliases).length} Challenge Pro variant aliases`);
    return aliases;
    
  } catch (error) {
    console.error('Error fetching Challenge Pro aliases:', error);
    return challengeProAliasCache || {};
  }
}

/**
 * Get Challenge Pro variant alias for a team (dynamic lookup)
 * Returns the alias in format: cs_personalize_<exp>_0
 */
async function getChallengeProVariantAlias(team: string): Promise<string | null> {
  const aliases = await fetchChallengeProAliases();
  const alias = aliases[team];
  if (alias) {
    console.log(`🔥 Challenge Pro alias for ${team}: ${alias}`);
    return alias;
  }
  console.log(`📦 No Challenge Pro found for team: ${team}`);
  return null;
}

// REST API configuration for variant fetching
const REST_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '',
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev',
  baseUrl: 'https://cdn.contentstack.io/v3'
};

/**
 * Fetch entries using REST API with x-cs-variant-uid header
 * This is needed because the SDK's .variants() method only works with single entry .fetch()
 * For .find() queries with variants, we must use the REST API directly
 */
async function fetchEntriesWithVariants<T>(contentTypeUid: string, variantAliases: string): Promise<T[]> {
  try {
    const url = `${REST_CONFIG.baseUrl}/content_types/${contentTypeUid}/entries?environment=${REST_CONFIG.environment}`;
    
    const response = await fetch(url, {
      headers: {
        'api_key': REST_CONFIG.apiKey,
        'access_token': REST_CONFIG.deliveryToken,
        'x-cs-variant-uid': variantAliases,  // THIS is the key header for variants!
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`❌ REST API error fetching ${contentTypeUid}:`, response.status);
      return [];
    }

    const data = await response.json();
    const entries = data.entries || [];
    
    // Log variant info if present
    entries.forEach((entry: any) => {
      if (entry._variant) {
        console.log(`✨ Entry "${entry.title}" returned with variant: ${entry._variant._uid}`);
      }
    });
    
    return entries;
  } catch (error) {
    console.error('Error in fetchEntriesWithVariants:', error);
    return [];
  }
}

/**
 * Check if an entry has a single team (used for filtering)
 */
function hasSingleTeam(entry: { target_teams?: string; team_taxonomy?: string[] }): boolean {
  if (Array.isArray(entry.team_taxonomy) && entry.team_taxonomy.length === 1) {
    return true;
  }
  if (entry.target_teams) {
    try {
      const teams = JSON.parse(entry.target_teams);
      return Array.isArray(teams) && teams.length === 1;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Get team from entry (from taxonomy or legacy field)
 */
function getTeamFromEntry(entry: { target_teams?: string; team_taxonomy?: string[] }): string | null {
  if (Array.isArray(entry.team_taxonomy) && entry.team_taxonomy.length > 0) {
    return entry.team_taxonomy[0];
  }
  if (entry.target_teams) {
    try {
      const teams = JSON.parse(entry.target_teams);
      return teams[0] || null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * @deprecated Use getVariantAliasesForDelivery() instead
 * Kept for backwards compatibility - will be removed in future version
 */
async function fetchVariantsForEntry(entryUid: string): Promise<any[]> {
  console.warn('⚠️ fetchVariantsForEntry is deprecated. Using Personalize SDK for variants.');
  return [];
}

/**
 * @deprecated Variant matching is now handled by Personalize SDK
 */
function findVariantForSegment(variants: any[], userSegment: UserSegment): any | null {
  console.warn('⚠️ findVariantForSegment is deprecated. Personalize SDK handles variant matching.');
  return null;
}

/**
 * @deprecated Variant merging is now handled by Delivery SDK
 */
function mergeVariantIntoEntry(baseEntry: any, variant: any): any {
  console.warn('⚠️ mergeVariantIntoEntry is deprecated. Delivery SDK handles variant content.');
  return baseEntry;
}

// ============================================================
// SDK-BASED FETCH FUNCTIONS
// ============================================================

/**
 * Fetch entries from a content type using the SDK
 */
async function fetchFromContentstack<T>(contentTypeUid: string, queryParams: Record<string, any> = {}): Promise<T[]> {
  if (!isSDKEnabled()) {
    throw new Error('Contentstack is not enabled');
  }

  const stack = getStack();
  if (!stack) {
    console.error('Contentstack SDK not initialized');
    throw new Error('Contentstack credentials not configured');
  }

  try {
    const query = stack.contentType(contentTypeUid).entry();
    
    // Apply query parameters if provided
    if (queryParams.query) {
      const parsedQuery = typeof queryParams.query === 'string' 
        ? JSON.parse(queryParams.query) 
        : queryParams.query;
      query.query(parsedQuery);
    }
    
    // Apply limit if provided
    if (queryParams.limit) {
      query.limit(queryParams.limit);
    }

    const result = await query.find<T>();
    return (result as any).entries || [];
  } catch (error) {
    console.error(`Error fetching ${contentTypeUid} from Contentstack:`, error);
    throw error;
  }
}

// ============================================================
// MANAGER CONFIGS
// ============================================================

export interface ManagerConfigEntry {
  uid: string;
  title: string;
  team: Team;
  manager_name: string;
  manager_email: string;
}

export async function fetchManagerConfig(team: Team): Promise<{ name: string; email: string } | null> {
  try {
    const stack = getStack();
    if (!stack) return null;

    const result = await stack
      .contentType('manager_config')
      .entry()
      .query({ team })
      .find<ManagerConfigEntry>();

    const entries = (result as any).entries || [];
    
    if (entries.length > 0) {
      const config = entries[0];
      return {
        name: config.manager_name,
        email: config.manager_email
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching manager config:', error);
    return null;
  }
}

// ============================================================
// TOOLS
// ============================================================

interface ToolEntry {
  uid: string;
  title: string;
  tool_id: string;
  name: string;
  purpose: string;
  docs_link: string;
  integrations: string;
  category: string;
  segment_taxonomy?: string[];
  team_taxonomy?: string[];
  is_generic: boolean;
  target_segments?: string;
  target_teams?: string;
}

export async function fetchTools(team?: Team, segment?: UserSegment): Promise<Tool[]> {
  try {
    const stack = getStack();
    if (!stack) {
      throw new Error('Contentstack SDK not initialized');
    }

    const result = await stack
      .contentType('qa_tool')
      .entry()
      .find<ToolEntry>();

    const entries = (result as any).entries || [];

    return entries.map((entry: ToolEntry) => {
      const targetSegmentTerms = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const targetTeamTerms = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      const integrations = safeJsonParse<string[]>(entry.integrations, []);
      
      // Normalize segment values (dynamic - no hardcoded mappings)
      const targetSegments = targetSegmentTerms.map(s => 
        normalizeSegment(s)
      ) as UserSegment[];
      
      // Use team names directly from Contentstack (no hardcoded mappings)
      const targetTeams = targetTeamTerms as Team[];

      return {
        id: entry.tool_id,
        name: entry.name,
        purpose: entry.purpose || '',
        docsLink: entry.docs_link || '',
        integrations,
        category: entry.category || '',
        targetSegments,
        targetTeams,
        isGeneric: entry.is_generic || false
      };
    }).filter((tool: Tool) => {
      if (team && !tool.isGeneric && tool.targetTeams && tool.targetTeams.length > 0) {
        if (!tool.targetTeams.includes(team)) {
          return false;
        }
      }

      if (segment && tool.targetSegments.length > 0) {
        if (!tool.targetSegments.includes(segment)) {
          return false;
        }
      }

      return true;
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
}

// ============================================================
// SOPS
// ============================================================

interface SOPEntry {
  uid: string;
  title: string;
  sop_id: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  mandatory: boolean;
  steps: string;
  related_tools: string;
  segment_taxonomy?: string[];
  team_taxonomy?: string[];
  target_segments?: string;
  target_teams?: string;
}

export async function fetchSOPs(team?: Team, segment?: UserSegment): Promise<SOP[]> {
  try {
    const stack = getStack();
    if (!stack) {
      throw new Error('Contentstack SDK not initialized');
    }

    const result = await stack
      .contentType('qa_sop')
      .entry()
      .find<SOPEntry>();

    const entries = (result as any).entries || [];

    return entries.map((entry: SOPEntry) => {
      const steps = safeJsonParse<string[]>(entry.steps, []);
      const relatedTools = safeJsonParse<string[]>(entry.related_tools, []);
      
      const targetSegmentTerms = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const targetTeamTerms = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      
      // Normalize segment values (dynamic - no hardcoded mappings)
      const targetSegments = targetSegmentTerms.map(s => 
        normalizeSegment(s)
      ) as UserSegment[];
      
      // Use team names directly from Contentstack (no hardcoded mappings)
      const targetTeams = targetTeamTerms as Team[];

      return {
        id: entry.sop_id,
        title: entry.title,
        criticality: entry.criticality || 'medium',
        mandatory: entry.mandatory || false,
        steps,
        relatedTools,
        targetSegments,
        targetTeams
      };
    }).filter((sop: SOP) => {
      if (team && sop.targetTeams && sop.targetTeams.length > 0) {
        if (!sop.targetTeams.includes(team)) {
          return false;
        }
      }

      if (segment && sop.targetSegments.length > 0) {
        if (!sop.targetSegments.includes(segment)) {
          return false;
        }
      }

      return true;
    });
  } catch (error) {
    console.error('Error fetching SOPs:', error);
    throw error;
  }
}

// ============================================================
// HEALTH CHECK
// ============================================================

export async function checkContentstackConnection(): Promise<boolean> {
  try {
    const stack = getStack();
    if (!stack) return false;

    const result = await stack
      .contentType('qa_tool')
      .entry()
      .limit(1)
      .find();

    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================
// TRAINING MODULES
// ============================================================

interface ModuleEntry {
  uid: string;
  title: string;
  module_id: string;
  category: string;
  content: string;
  video_url?: string;
  skill_level_taxonomy?: string[];
  segment_taxonomy?: string[];
  team_taxonomy?: string[];
  estimated_time: number;
  mandatory: boolean;
  order: number;
  prerequisites: string;
  quiz_items: string;
  module_tags: string;
  difficulty?: string;
  target_teams?: string;
  target_segments?: string;
  unlocks_challenge_pro?: boolean; // If true, completing this module unlocks Challenge Pro
  // Variant information (added by Delivery SDK when variant aliases are used)
  _variant?: {
    _uid: string;
    _change_set?: string[];
  };
}

interface QuizEntry {
  uid: string;
  quiz_id: string;
  question: string;
  answer_options: string;
  correct_answer: number;
  explanation: string;
}

export async function getCsModules(
  userTeam: Team, 
  userSegment: UserSegment,
  challengeProVariantAlias?: string // Stored alias from user profile (e.g., "cs_personalize_l_0")
): Promise<Module[]> {
  if (!isSDKEnabled()) {
    return [];
  }

  const stack = getStack();
  if (!stack) {
    return [];
  }

  try {
    // Get variant aliases from Personalize SDK (format: cs_personalize_<exp>_<variant>)
    // HIGH_FLYER users get personalized variant content based on their experience
    let variantAliases = await getVariantAliasesFromPersonalize(userTeam, userSegment);
    
    // If Challenge Pro variant alias is provided (from user profile), use it
    // IMPORTANT: Put Challenge Pro alias FIRST so it takes priority over regular High Flyer variants
    // (both may modify the same base entry, and the first matching alias wins)
    if (challengeProVariantAlias && userSegment === 'HIGH_FLYER') {
      if (variantAliases) {
        // Put Challenge Pro FIRST to take priority
        variantAliases = `${challengeProVariantAlias},${variantAliases}`;
      } else {
        variantAliases = challengeProVariantAlias;
      }
      console.log(`🔥 Challenge Pro enabled - using stored alias: ${challengeProVariantAlias} (priority)`);
    }
    
    let entries: ModuleEntry[] = [];
    
    if (variantAliases) {
      // Use REST API with x-cs-variant-uid header to fetch variant content
      // The alias format cs_personalize_X_Y works directly with Delivery API!
      console.log(`📦 Fetching modules for ${userTeam} ${userSegment} with variant aliases: ${variantAliases}`);
      entries = await fetchEntriesWithVariants('qa_training_module', variantAliases);
      console.log(`📚 Fetched ${entries.length} module entries (with variant content)`);
    } else {
      // Regular users (ROOKIE, AT_RISK) - fetch via SDK without variants
      console.log(`📦 Fetching modules for ${userTeam} ${userSegment} (no variants)`);
      const moduleResult = await stack
        .contentType('qa_training_module')
        .entry()
        .find<ModuleEntry>();
      entries = (moduleResult as any).entries || [];
      console.log(`📚 Fetched ${entries.length} module entries`);
    }

    // Fetch ALL quiz items using SDK
    const quizResult = await stack
      .contentType('quiz_item')
      .entry()
      .find<QuizEntry>();

    const quizEntries = (quizResult as any).entries || [];
    
    // Create a map of quiz_id -> QuizQuestion for fast lookup
    const quizMap: { [quizId: string]: QuizQuestion } = {};
    quizEntries.forEach((entry: QuizEntry) => {
      quizMap[entry.quiz_id] = {
        id: entry.quiz_id,
        question: entry.question,
        options: safeJsonParse<string[]>(entry.answer_options, []),
        correctAnswer: entry.correct_answer,
        explanation: entry.explanation
      };
    });

    // Filter entries by team and segment
    const filteredEntries: ModuleEntry[] = [];
    
    for (const entry of entries) {
      const targetTeams = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      const targetSegments = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const userTeamTerm = mapToTaxonomyTerm(userTeam);
      const userSegmentTerm = mapToTaxonomyTerm(userSegment);
      
      // Check team match
      const teamMatch = targetTeams.length === 0 || taxonomyIncludes(targetTeams, userTeamTerm);
      if (!teamMatch) continue;
      
      // Check segment match
      // When variant content is returned, the entry's target_segments will be updated
      // to match the variant (e.g., HIGH_FLYER instead of ROOKIE)
      const segmentMatch = targetSegments.length === 0 || taxonomyIncludes(targetSegments, userSegmentTerm);
      
      if (teamMatch && segmentMatch) {
        // Log if this entry has variant content applied
        if (entry._variant) {
          console.log(`✨ Module "${entry.title}" has variant: ${entry._variant._uid}`);
        }
        filteredEntries.push(entry);
      }
    }

    const modules = filteredEntries.map(entry => {
      const quizItemIds = safeJsonParse<string[]>(entry.quiz_items, []);
      
      const quiz = quizItemIds
        .map(quizId => quizMap[quizId])
        .filter(q => q !== undefined);
      
      const content = entry.content || '';
      
      const difficulty = (entry.skill_level_taxonomy?.[0] || entry.difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced';
      const targetSegmentTerms = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const targetTeamTerms = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      
      // Normalize segment values (dynamic - no hardcoded mappings)
      const targetSegments = targetSegmentTerms.map((s: string) => 
        normalizeSegment(s)
      ) as UserSegment[];
      
      // Use team names directly from Contentstack (no hardcoded mappings)
      const targetTeams = targetTeamTerms as Team[];
      
      return {
        id: entry.module_id || entry.uid,
        title: entry.title,
        content: content,
        category: entry.category,
        videoUrl: entry.video_url || '',
        difficulty: difficulty,
        estimatedTime: entry.estimated_time || 30,
        mandatory: entry.mandatory || false,
        order: entry.order || 0,
        prerequisites: safeJsonParse<string[]>(entry.prerequisites, []),
        quiz: quiz,
        targetSegments: targetSegments,
        targetTeams: targetTeams,
        tags: safeJsonParse<string[]>(entry.module_tags, []),
        unlocksChallengePro: entry.unlocks_challenge_pro || false,
        // Include variant info if available
        ...(entry._variant && { _isVariant: true, _variantUid: entry._variant._uid })
      };
    });
    
    return modules;
  } catch (error) {
    console.error('Error fetching modules from Contentstack:', error);
    return [];
  }
}

// ============================================================
// QUIZ ITEMS
// ============================================================

export async function getCsQuizItems(): Promise<{ [key: string]: QuizQuestion[] }> {
  if (!isSDKEnabled()) {
    return {};
  }

  const stack = getStack();
  if (!stack) {
    return {};
  }

  try {
    const result = await stack
      .contentType('quiz_item')
      .entry()
      .find<QuizEntry>();

    const entries = (result as any).entries || [];

    const quizMap: { [key: string]: QuizQuestion[] } = {};
    
    entries.forEach((entry: QuizEntry) => {
      const options = safeJsonParse<string[]>(entry.answer_options, []);
      
      const quizQuestion: QuizQuestion = {
        id: entry.uid,
        question: entry.question,
        options: options,
        correctAnswer: entry.correct_answer,
        explanation: entry.explanation
      };

      const quizId = entry.quiz_id || entry.uid;
      if (!quizMap[quizId]) {
        quizMap[quizId] = [];
      }
      quizMap[quizId].push(quizQuestion);
    });
    
    return quizMap;
  } catch (error) {
    console.error('Error fetching quiz items from Contentstack:', error);
    return {};
  }
}

// ============================================================
// EXPORT CONFIG
// ============================================================

export { isContentstackEnabled, ContentstackConfig };
