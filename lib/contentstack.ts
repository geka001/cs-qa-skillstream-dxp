/**
 * Contentstack Service Layer
 * Handles all API calls to Contentstack Delivery API using the TypeScript Delivery SDK
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
// VARIANT SUPPORT
// ============================================================

/**
 * Check if an entry has a single team (potential variant candidate)
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
 * Fetch variants for an entry from Management API
 * Uses API route to keep Management Token server-side
 */
async function fetchVariantsForEntry(entryUid: string): Promise<any[]> {
  try {
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? 'http://localhost:3000' : '';
    
    const response = await fetch(`${baseUrl}/api/variants/${entryUid}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.variants || [];
  } catch (error) {
    return [];
  }
}

/**
 * Find matching variant for user's segment
 */
function findVariantForSegment(variants: any[], userSegment: UserSegment): any | null {
  if (!variants || variants.length === 0) return null;
  
  const normalizedSegment = userSegment.toUpperCase().replace(/\s+/g, '_');
  
  for (const variant of variants) {
    const targetSegments = variant.target_segments;
    
    if (targetSegments) {
      try {
        const segments = typeof targetSegments === 'string' 
          ? JSON.parse(targetSegments) 
          : targetSegments;
        
        if (Array.isArray(segments)) {
          const match = segments.some((s: string) => {
            const normalizedS = s.toUpperCase().replace(/\s+/g, '_');
            return normalizedS === normalizedSegment;
          });
          if (match) return variant;
        }
      } catch (e) {
        // Skip invalid variant
      }
    }
  }
  
  return null;
}

/**
 * Merge variant data into base entry
 */
function mergeVariantIntoEntry(baseEntry: any, variant: any): any {
  if (!variant) return baseEntry;
  
  const changeSet = variant._variant?._change_set || [];
  const merged = { ...baseEntry };
  
  for (const field of changeSet) {
    if (variant[field] !== undefined) {
      merged[field] = variant[field];
    }
  }
  
  if (variant.title) merged.title = variant.title;
  
  merged._isVariant = true;
  merged._variantUid = variant._variant?._uid;
  
  return merged;
}

// Legacy functions (keeping for backwards compatibility)
function getVariantForSegment(segment: UserSegment): string {
  const variantMap: Record<UserSegment, string> = {
    'ROOKIE': 'rookie_version',
    'AT_RISK': 'at_risk_version',
    'HIGH_FLYER': 'high_flyer_version'
  };
  return variantMap[segment] || 'rookie_version';
}

function extractVariantContent(field: any, variantKey: string): string {
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    if (field[variantKey]) return field[variantKey];
    if (field._default) return field._default;
    if (field.rookie_version) return field.rookie_version;
  }
  if (typeof field === 'string') return field;
  return '';
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
}

interface QuizEntry {
  uid: string;
  quiz_id: string;
  question: string;
  answer_options: string;
  correct_answer: number;
  explanation: string;
}

export async function getCsModules(userTeam: Team, userSegment: UserSegment): Promise<Module[]> {
  if (!isSDKEnabled()) {
    return [];
  }

  const stack = getStack();
  if (!stack) {
    return [];
  }

  try {
    // Fetch modules using SDK
    const moduleResult = await stack
      .contentType('qa_training_module')
      .entry()
      .find<ModuleEntry>();

    const entries = (moduleResult as any).entries || [];

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

    // Process entries with variant checking
    const processedEntries: ModuleEntry[] = [];
    
    for (const entry of entries) {
      const targetTeams = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      const targetSegments = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const userTeamTerm = mapToTaxonomyTerm(userTeam);
      const userSegmentTerm = mapToTaxonomyTerm(userSegment);
      
      const teamMatch = targetTeams.length > 0 && taxonomyIncludes(targetTeams, userTeamTerm);
      if (!teamMatch) continue;
      
      const isSingleTeam = hasSingleTeam(entry);
      
      if (isSingleTeam) {
        const variants = await fetchVariantsForEntry(entry.uid);
        
        if (variants.length > 0) {
          const matchingVariant = findVariantForSegment(variants, userSegment);
          if (matchingVariant) {
            const mergedEntry = mergeVariantIntoEntry(entry, matchingVariant);
            processedEntries.push(mergedEntry);
            continue;
          }
        }
        
        const segmentMatch = targetSegments.length > 0 && taxonomyIncludes(targetSegments, userSegmentTerm);
        if (segmentMatch) {
          processedEntries.push(entry);
        }
      } else {
        const segmentMatch = targetSegments.length > 0 && taxonomyIncludes(targetSegments, userSegmentTerm);
        if (teamMatch && segmentMatch) {
          processedEntries.push(entry);
        }
      }
    }

    const modules = processedEntries.map(entry => {
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
        tags: safeJsonParse<string[]>(entry.module_tags, [])
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
