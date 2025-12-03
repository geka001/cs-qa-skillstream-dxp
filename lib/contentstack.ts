/**
 * Contentstack Service Layer
 * Handles all API calls to Contentstack Delivery API
 */

import axios from 'axios';
import { Tool, SOP, Team, UserSegment, Module, QuizQuestion } from '@/types';

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_STACK_API_KEY,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || process.env.CONTENTSTACK_REGION || 'NA',
  enabled: process.env.NEXT_PUBLIC_USE_CONTENTSTACK === 'true'
};

const REGIONS: Record<string, string> = {
  NA: 'https://cdn.contentstack.io',
  EU: 'https://eu-cdn.contentstack.com',
  AZURE_NA: 'https://azure-na-cdn.contentstack.com',
  AZURE_EU: 'https://azure-eu-cdn.contentstack.com'
};

const API_BASE = REGIONS[CONFIG.region] || REGIONS.NA;

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
 * Examples:
 * - "ROOKIE" → "rookie" (or matches "Rookie")
 * - "Launch" → "launch" (or matches "Launch")
 * - "Data & Insights" → "data_insights" (or matches "Data & Insights")
 * - "AT_RISK" → "at_risk" (or matches "AT Risk")
 */
function mapToTaxonomyTerm(value: string): string {
  // Don't transform - return as-is
  // Contentstack taxonomy can store either:
  // - UIDs: "ROOKIE", "AT_RISK", "HIGH_FLYER"
  // - Display names: "Rookie", "AT Risk", "High flyer"
  // taxonomyIncludes() handles case-insensitive matching
  return value;
}

/**
 * Check if a taxonomy array contains a value (case-insensitive)
 */
function taxonomyIncludes(taxonomyArray: string[], searchValue: string): boolean {
  if (!taxonomyArray || taxonomyArray.length === 0) return false;
  
  // Try exact match first
  if (taxonomyArray.includes(searchValue)) return true;
  
  // Try case-insensitive match
  const searchLower = searchValue.toLowerCase();
  return taxonomyArray.some(term => term.toLowerCase() === searchLower);
}

// ============================================================
// VARIANT SUPPORT
// ============================================================

/**
 * Check if an entry has a single team (potential variant candidate)
 * Single-team entries can have variants for different user segments
 */
function hasSingleTeam(entry: { target_teams?: string; team_taxonomy?: string[] }): boolean {
  // Check taxonomy field first
  if (Array.isArray(entry.team_taxonomy) && entry.team_taxonomy.length === 1) {
    return true;
  }
  // Check legacy JSON field
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
 * Returns array of variant entries with their segment info
 */
async function fetchVariantsForEntry(entryUid: string): Promise<any[]> {
  try {
    // Determine base URL for API route
    // In browser: use relative URL
    // In server: use absolute URL with localhost
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? 'http://localhost:3000' : '';
    
    console.log(`📡 Fetching variants for ${entryUid} via API route...`);
    
    const response = await fetch(`${baseUrl}/api/variants/${entryUid}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Response status: ${response.status}`);
    
    if (!response.ok) {
      // 404 or error is expected for entries without variants
      if (response.status === 404) {
        console.log(`   No variants found (404)`);
        return [];
      }
      const errorText = await response.text();
      console.warn(`⚠️ Failed to fetch variants for ${entryUid}:`, response.status, errorText);
      return [];
    }
    
    const data = await response.json();
    console.log(`   ✅ Received ${data.variants?.length || 0} variants`);
    if (data.variants?.length > 0) {
      console.log(`   Variants:`, data.variants.map((v: any) => ({ title: v.title, target_segments: v.target_segments })));
    }
    return data.variants || [];
  } catch (error) {
    console.error(`❌ Error fetching variants for ${entryUid}:`, error);
    return [];
  }
}

/**
 * Find matching variant for user's segment
 * Returns the variant data if found, null otherwise
 */
function findVariantForSegment(variants: any[], userSegment: UserSegment): any | null {
  console.log(`🔍 findVariantForSegment: Looking for segment "${userSegment}" in ${variants?.length || 0} variants`);
  
  if (!variants || variants.length === 0) {
    console.log(`   ❌ No variants provided`);
    return null;
  }
  
  // Normalize segment for comparison
  const normalizedSegment = userSegment.toUpperCase().replace(/\s+/g, '_');
  console.log(`   Normalized segment: "${normalizedSegment}"`);
  
  for (const variant of variants) {
    // Check target_segments field in variant
    const targetSegments = variant.target_segments;
    console.log(`   Checking variant "${variant.title}": target_segments = ${targetSegments}`);
    
    if (targetSegments) {
      try {
        const segments = typeof targetSegments === 'string' 
          ? JSON.parse(targetSegments) 
          : targetSegments;
        
        console.log(`   Parsed segments:`, segments);
        
        if (Array.isArray(segments)) {
          const match = segments.some((s: string) => {
            const normalizedS = s.toUpperCase().replace(/\s+/g, '_');
            console.log(`      Comparing: "${normalizedS}" === "${normalizedSegment}" → ${normalizedS === normalizedSegment}`);
            return normalizedS === normalizedSegment;
          });
          if (match) {
            console.log(`   ✅ Found matching variant for segment ${userSegment}:`, variant.title);
            return variant;
          }
        }
      } catch (e) {
        console.warn('Failed to parse target_segments:', targetSegments, e);
      }
    }
  }
  
  console.log(`   ❌ No matching variant found for segment "${userSegment}"`);
  return null;
}

/**
 * Merge variant data into base entry
 * Variant only contains changed fields, so we merge with base entry
 */
function mergeVariantIntoEntry(baseEntry: any, variant: any): any {
  if (!variant) return baseEntry;
  
  // Get the list of changed fields from variant metadata
  const changeSet = variant._variant?._change_set || [];
  
  console.log(`🔄 Merging variant. Changed fields: ${changeSet.join(', ')}`);
  
  // Create merged entry: start with base, override with variant's changed fields
  const merged = { ...baseEntry };
  
  for (const field of changeSet) {
    if (variant[field] !== undefined) {
      merged[field] = variant[field];
      console.log(`   → Overriding field: ${field}`);
    }
  }
  
  // Always copy title if variant has it (common change)
  if (variant.title) {
    merged.title = variant.title;
  }
  
  // Mark as variant for debugging
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
  // If field is an object (variant-enabled)
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    if (field[variantKey]) return field[variantKey];
    if (field._default) return field._default;
    if (field.rookie_version) return field.rookie_version;
  }
  
  // If field is a string (non-variant entry), return as-is
  if (typeof field === 'string') {
    return field;
  }
  
  // Default empty string
  console.log('❌ No content found');
  return '';
}

/**
 * Make a request to Contentstack Delivery API
 */
async function fetchFromContentstack<T>(contentTypeUid: string, query: any = {}): Promise<T[]> {
  if (!CONFIG.enabled) {
    throw new Error('Contentstack is not enabled');
  }

  if (!CONFIG.apiKey || !CONFIG.deliveryToken) {
    console.error('Contentstack credentials missing');
    throw new Error('Contentstack credentials not configured');
  }

  try {
    const url = `${API_BASE}/v3/content_types/${contentTypeUid}/entries`;
    
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'api_key': CONFIG.apiKey,
        'access_token': CONFIG.deliveryToken,
        'Content-Type': 'application/json'
      },
      params: {
        environment: CONFIG.environment,
        ...query
      }
    });

    return response.data.entries || [];
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
    const entries = await fetchFromContentstack<ManagerConfigEntry>('manager_config', {
      query: JSON.stringify({ team })
    });

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
  integrations: string; // JSON string
  category: string;
  segment_taxonomy?: string[]; // Taxonomy array
  team_taxonomy?: string[]; // Taxonomy array
  is_generic: boolean;
  // Legacy fields (fallback)
  target_segments?: string; // JSON string
  target_teams?: string; // JSON string
}

export async function fetchTools(team?: Team, segment?: UserSegment): Promise<Tool[]> {
  try {
    const entries = await fetchFromContentstack<ToolEntry>('qa_tool');

    return entries.map(entry => {
      // Use taxonomy fields (primary) or fallback to JSON strings (legacy)
      const targetSegmentTerms = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const targetTeamTerms = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      const integrations = safeJsonParse<string[]>(entry.integrations, []);
      
      // Convert taxonomy terms back to app values (handle both Title case and lowercase)
      const targetSegments = targetSegmentTerms.map(s => {
        const upperS = s.toUpperCase().replace(/\s+/g, '_');
        if (upperS === 'ROOKIE' || s === 'Rookie') return 'ROOKIE';
        if (upperS === 'AT_RISK' || s === 'AT Risk') return 'AT_RISK';
        if (upperS === 'HIGH_FLYER' || s === 'High flyer') return 'HIGH_FLYER';
        return s.toUpperCase() as UserSegment;
      }) as UserSegment[];
      
      const targetTeams = targetTeamTerms.map(t => {
        if (t === 'Launch') return 'Launch';
        if (t === 'Data & Insights') return 'Data & Insights';
        if (t === 'Visual Builder') return 'Visual Builder';
        if (t === 'AutoDraft') return 'AutoDraft';
        if (t === 'DAM') return 'DAM';
        const teamMap: Record<string, Team> = {
          'launch': 'Launch',
          'data_insights': 'Data & Insights',
          'visual_builder': 'Visual Builder',
          'autodraft': 'AutoDraft',
          'dam': 'DAM'
        };
        return teamMap[t.toLowerCase()] || t as Team;
      }) as Team[];

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
    }).filter(tool => {
      // Filter by team if provided
      if (team && !tool.isGeneric && tool.targetTeams && tool.targetTeams.length > 0) {
        if (!tool.targetTeams.includes(team)) {
          return false;
        }
      }

      // Filter by segment if provided
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
  steps: string; // JSON string
  related_tools: string; // JSON string
  segment_taxonomy?: string[]; // Taxonomy array
  team_taxonomy?: string[]; // Taxonomy array
  // Legacy fields (fallback)
  target_segments?: string; // JSON string
  target_teams?: string; // JSON string
}

export async function fetchSOPs(team?: Team, segment?: UserSegment): Promise<SOP[]> {
  try {
    const entries = await fetchFromContentstack<SOPEntry>('qa_sop');

    return entries.map(entry => {
      const steps = safeJsonParse<string[]>(entry.steps, []);
      const relatedTools = safeJsonParse<string[]>(entry.related_tools, []);
      
      // Use taxonomy fields (primary) or fallback to JSON strings (legacy)
      const targetSegmentTerms = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const targetTeamTerms = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      
      // Convert taxonomy terms back to app values (handle both Title case and lowercase)
      const targetSegments = targetSegmentTerms.map(s => {
        const upperS = s.toUpperCase().replace(/\s+/g, '_');
        if (upperS === 'ROOKIE' || s === 'Rookie') return 'ROOKIE';
        if (upperS === 'AT_RISK' || s === 'AT Risk') return 'AT_RISK';
        if (upperS === 'HIGH_FLYER' || s === 'High flyer') return 'HIGH_FLYER';
        return s.toUpperCase() as UserSegment;
      }) as UserSegment[];
      
      const targetTeams = targetTeamTerms.map(t => {
        if (t === 'Launch') return 'Launch';
        if (t === 'Data & Insights') return 'Data & Insights';
        if (t === 'Visual Builder') return 'Visual Builder';
        if (t === 'AutoDraft') return 'AutoDraft';
        if (t === 'DAM') return 'DAM';
        const teamMap: Record<string, Team> = {
          'launch': 'Launch',
          'data_insights': 'Data & Insights',
          'visual_builder': 'Visual Builder',
          'autodraft': 'AutoDraft',
          'dam': 'DAM'
        };
        return teamMap[t.toLowerCase()] || t as Team;
      }) as Team[];

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
    }).filter(sop => {
      // Filter by team if provided
      if (team && sop.targetTeams && sop.targetTeams.length > 0) {
        if (!sop.targetTeams.includes(team)) {
          return false;
        }
      }

      // Filter by segment if provided
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
    await fetchFromContentstack('qa_tool', { limit: 1 });
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================
// TRAINING MODULES
// ============================================================

export async function getCsModules(userTeam: Team, userSegment: UserSegment): Promise<Module[]> {
  if (!CONFIG.enabled) {
    return [];
  }

  try {
    console.log(`🔍 getCsModules called with: { team: "${userTeam}", segment: "${userSegment}" }`);
    console.log(`📦 Fetching modules from Contentstack for team: ${userTeam}, segment: ${userSegment}...`);

    // Fetch modules
    const entries = await fetchFromContentstack<{
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
    }>('qa_training_module');

    // Fetch ALL quiz items once
    const quizEntries = await fetchFromContentstack<{
      uid: string;
      quiz_id: string;
      question: string;
      answer_options: string; // JSON string
      correct_answer: number;
      explanation: string;
    }>('quiz_item');
    
    // Create a map of quiz_id -> QuizQuestion for fast lookup
    const quizMap: { [quizId: string]: QuizQuestion } = {};
    quizEntries.forEach(entry => {
      quizMap[entry.quiz_id] = {
        id: entry.quiz_id,
        question: entry.question,
        options: safeJsonParse<string[]>(entry.answer_options, []),
        correctAnswer: entry.correct_answer,
        explanation: entry.explanation
      };
    });

    // ============================================================
    // VARIANT SUPPORT: Process entries with variant checking
    // ============================================================
    
    const processedEntries: any[] = [];
    
    for (const entry of entries) {
      const targetTeams = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      const targetSegments = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const userTeamTerm = mapToTaxonomyTerm(userTeam);
      const userSegmentTerm = mapToTaxonomyTerm(userSegment);
      
      // Check if team matches
      const teamMatch = targetTeams.length > 0 && taxonomyIncludes(targetTeams, userTeamTerm);
      
      if (!teamMatch) {
        console.log(`🔍 Skipping "${entry.title}": team doesn't match (${JSON.stringify(targetTeams)} vs ${userTeamTerm})`);
        continue;
      }
      
      // Check if this is a SINGLE-TEAM module (potential variant candidate)
      const isSingleTeam = hasSingleTeam(entry);
      
      if (isSingleTeam) {
        console.log(`🎯 Single-team module detected: "${entry.title}" (Team: ${getTeamFromEntry(entry)})`);
        
        // Fetch variants for this entry
        const variants = await fetchVariantsForEntry(entry.uid);
        
        if (variants.length > 0) {
          console.log(`   📋 Found ${variants.length} variant(s) for this module`);
          
          // Check if any variant matches user's segment
          const matchingVariant = findVariantForSegment(variants, userSegment);
          
          if (matchingVariant) {
            // Use variant data merged with base entry
            const mergedEntry = mergeVariantIntoEntry(entry, matchingVariant);
            console.log(`   ✅ Using VARIANT for segment ${userSegment}: "${mergedEntry.title}"`);
            processedEntries.push(mergedEntry);
            continue;
          }
        }
        
        // No variant found - check if base entry segment matches
        const segmentMatch = targetSegments.length > 0 && taxonomyIncludes(targetSegments, userSegmentTerm);
        if (segmentMatch) {
          console.log(`   ✅ Using BASE entry (segment matches): "${entry.title}"`);
          processedEntries.push(entry);
        } else {
          console.log(`   ❌ Skipping: No matching variant and base segment doesn't match`);
        }
      } else {
        // Multi-team module: use standard filtering
        const segmentMatch = targetSegments.length > 0 && taxonomyIncludes(targetSegments, userSegmentTerm);
        
        if (teamMatch && segmentMatch) {
          console.log(`🔍 Including multi-team module: "${entry.title}"`);
          processedEntries.push(entry);
        } else {
          console.log(`🔍 Skipping "${entry.title}": segment doesn't match (${JSON.stringify(targetSegments)} vs ${userSegmentTerm})`);
        }
      }
    }

    console.log(`📊 Processed ${processedEntries.length} modules after variant resolution`);

    const modules = processedEntries.map(entry => {
      // Parse quiz item IDs from the module
      const quizItemIds = safeJsonParse<string[]>(entry.quiz_items, []);
      
      // Map quiz item IDs to actual QuizQuestion objects
      const quiz = quizItemIds
        .map(quizId => quizMap[quizId])
        .filter(q => q !== undefined); // Filter out any missing quiz items
      
      // Get content (already resolved via variant merge if applicable)
      const content = entry.content || '';
      
      // Use taxonomy fields (primary) or fallback to legacy fields
      const difficulty = (entry.skill_level_taxonomy?.[0] || entry.difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced';
      const targetSegmentTerms = entry.segment_taxonomy || safeJsonParse<string[]>(entry.target_segments, []);
      const targetTeamTerms = entry.team_taxonomy || safeJsonParse<string[]>(entry.target_teams, []);
      
      // Convert taxonomy terms to app values (preserve case or map)
      const targetSegments = targetSegmentTerms.map(s => {
        // Handle both lowercase UIDs and Title case display names
        const upperS = s.toUpperCase().replace(/\s+/g, '_');
        if (upperS === 'ROOKIE' || s === 'Rookie') return 'ROOKIE';
        if (upperS === 'AT_RISK' || s === 'AT Risk') return 'AT_RISK';
        if (upperS === 'HIGH_FLYER' || s === 'High flyer') return 'HIGH_FLYER';
        return s.toUpperCase() as UserSegment;
      }) as UserSegment[];
      
      const targetTeams = targetTeamTerms.map(t => {
        // Exact match for known teams
        if (t === 'Launch') return 'Launch';
        if (t === 'Data & Insights') return 'Data & Insights';
        if (t === 'Visual Builder') return 'Visual Builder';
        if (t === 'AutoDraft') return 'AutoDraft';
        if (t === 'DAM') return 'DAM';
        
        // Fallback: try lowercase UID mapping
        const teamMap: Record<string, Team> = {
          'launch': 'Launch',
          'data_insights': 'Data & Insights',
          'visual_builder': 'Visual Builder',
          'autodraft': 'AutoDraft',
          'dam': 'DAM'
        };
        return teamMap[t.toLowerCase()] || t as Team;
      }) as Team[];
      
      return {
        id: entry.module_id || entry.uid,
        title: entry.title,
        content: content, // Extracted variant content
        category: entry.category,
        videoUrl: entry.video_url || '',
        difficulty: difficulty,
        estimatedTime: entry.estimated_time || 30,
        mandatory: entry.mandatory || false,
        order: entry.order || 0,
        prerequisites: safeJsonParse<string[]>(entry.prerequisites, []),
        quiz: quiz, // Populated with actual quiz questions!
        targetSegments: targetSegments,
        targetTeams: targetTeams,
        tags: safeJsonParse<string[]>(entry.module_tags, [])
      };
    });
    
    console.log(`✅ Returning ${modules.length} modules for ${userTeam}/${userSegment}:`, modules.map(m => `${m.title} (${m.id})`));
    
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
  if (!CONFIG.enabled) {
    return {};
  }

  try {
    const entries = await fetchFromContentstack<{
      uid: string;
      quiz_id: string;
      question: string;
      answer_options: string; // JSON string
      correct_answer: number;
      explanation: string;
    }>('quiz_item');

    // Group quiz items by quiz_id
    const quizMap: { [key: string]: QuizQuestion[] } = {};
    
    entries.forEach(entry => {
      const options = safeJsonParse<string[]>(entry.answer_options, []);
      
      const quizQuestion: QuizQuestion = {
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

export const isContentstackEnabled = CONFIG.enabled;

export { CONFIG as ContentstackConfig };
