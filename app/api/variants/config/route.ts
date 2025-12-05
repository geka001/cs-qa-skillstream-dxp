import { NextResponse } from 'next/server';

/**
 * @deprecated This API route is NO LONGER NEEDED!
 * 
 * The Personalize SDK's getVariantAliases() method returns auto-generated aliases
 * in format: cs_personalize_<experience_short_uid>_<variant_short_uid>
 * 
 * These aliases work DIRECTLY with the Delivery API's x-cs-variant-uid header!
 * No Management API or dynamic config fetching needed.
 * 
 * See: https://www.contentstack.com/docs/personalize/dynamically-track-variant-impressions
 * 
 * This endpoint is kept for backwards compatibility but should not be used.
 * Use getVariantAliases() from lib/personalize.ts instead.
 * 
 * ---
 * 
 * ORIGINAL DESCRIPTION:
 * API Route: Get variant configuration dynamically from Contentstack
 * 
 * GET /api/variants/config
 * 
 * Returns the mapping of teams to variant UIDs by querying Contentstack's
 * variant groups and their Personalize metadata.
 */

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';
const CONTENT_TYPE = 'qa_training_module';

// Cache for variant config (refreshed every 5 minutes)
let cachedConfig: VariantConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface VariantMapping {
  experienceShortUid: string;
  experienceUid: string;
  variantGroupUid: string;
  variantUid: string;
  team: string;
  name: string;
}

export interface VariantConfig {
  teamVariantUids: Record<string, string>;
  experienceToVariant: Record<string, VariantMapping>;
  lastUpdated: string;
}

/**
 * Fetch variant groups from Contentstack Management API
 */
async function fetchVariantGroups(): Promise<any[]> {
  // Use the correct endpoint: /v3/variant_groups
  const url = `https://api.contentstack.io/v3/variant_groups`;
  
  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch variant groups: ${response.status}`);
  }

  const data = await response.json();
  
  // Filter to only include variant groups linked to our content type
  const groups = data.variant_groups || [];
  return groups.filter((g: any) => 
    g.content_types?.some((ct: any) => ct.uid === CONTENT_TYPE && ct.status === 'linked')
  );
}

/**
 * Fetch variants for a specific entry to get the actual variant UIDs
 */
async function fetchEntryVariants(entryUid: string): Promise<any[]> {
  const url = `https://api.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${entryUid}/variants?locale=en-us`;
  
  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.entries || [];
}

/**
 * Get the first entry for each team to find their variant UIDs
 * Uses Management API to access entry variants
 */
async function fetchTeamEntries(): Promise<Record<string, string>> {
  const url = `https://api.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries?locale=en-us&limit=100`;
  
  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    console.error('Failed to fetch team entries:', response.status);
    return {};
  }

  const data = await response.json();
  const entries = data.entries || [];
  
  // Map teams to their first entry UID
  const teamEntries: Record<string, string> = {};
  
  for (const entry of entries) {
    let targetTeams: string[] = [];
    
    // Try to parse target_teams field
    if (entry.target_teams) {
      try {
        targetTeams = JSON.parse(entry.target_teams);
      } catch {
        // If not JSON, might be a single string
        targetTeams = [entry.target_teams];
      }
    }
    
    // Also check taxonomies for team info
    if (entry.taxonomies) {
      for (const tax of entry.taxonomies) {
        if (tax.taxonomy_uid === 'product_team' && tax.term_uid) {
          // Map taxonomy term to team name
          const termToTeam: Record<string, string> = {
            'launch': 'Launch',
            'dam': 'DAM',
            'data_insights': 'Data & Insights',
            'autodraft': 'AutoDraft'
          };
          const teamName = termToTeam[tax.term_uid.toLowerCase()] || tax.term_uid;
          if (!targetTeams.includes(teamName)) {
            targetTeams.push(teamName);
          }
        }
      }
    }
    
    for (const team of targetTeams) {
      if (!teamEntries[team]) {
        teamEntries[team] = entry.uid;
      }
    }
  }
  
  return teamEntries;
}

/**
 * Build the complete variant configuration
 */
async function buildVariantConfig(): Promise<VariantConfig> {
  // Fetch variant groups (contains experience metadata)
  const variantGroups = await fetchVariantGroups();
  
  // Build experience to variant group mapping
  const experienceToVariant: Record<string, VariantMapping> = {};
  const teamToVariantGroup: Record<string, { variantGroupUid: string; experienceShortUid: string }> = {};
  
  for (const group of variantGroups) {
    const metadata = group.personalize_metadata;
    if (!metadata?.experience_short_uid) continue;
    
    // Extract team name from variant group name
    // Supports formats like: "Launch High Flyer", "DAM High Flyer", "D&I High Flyer", etc.
    const name = group.name || '';
    let team = '';
    
    // Try to extract team from the name before "High Flyer" or similar suffix
    const match = name.match(/^(.+?)\s+(High\s*Flyer|Advanced|Variant)/i);
    if (match) {
      team = match[1].trim();
      // Normalize common variations
      if (team === 'D&I') team = 'Data & Insights';
    } else {
      // Fallback: use known patterns
      if (name.includes('Launch')) team = 'Launch';
      else if (name.includes('DAM')) team = 'DAM';
      else if (name.includes('D&I') || name.includes('Data')) team = 'Data & Insights';
      else if (name.includes('AutoDraft')) team = 'AutoDraft';
      else team = name; // Use the full name as team if no pattern matches
    }
    
    if (team) {
      teamToVariantGroup[team] = {
        variantGroupUid: group.uid,
        experienceShortUid: metadata.experience_short_uid
      };
      
      experienceToVariant[metadata.experience_short_uid] = {
        experienceShortUid: metadata.experience_short_uid,
        experienceUid: metadata.experience_uid || '',
        variantGroupUid: group.uid,
        variantUid: '', // Will be filled in below
        team,
        name
      };
    }
  }
  
  // Now fetch actual variant UIDs from entries
  const teamEntries = await fetchTeamEntries();
  const teamVariantUids: Record<string, string> = {};
  
  for (const [team, entryUid] of Object.entries(teamEntries)) {
    const variants = await fetchEntryVariants(entryUid);
    
    for (const variant of variants) {
      const variantUid = variant._variant?._uid;
      if (!variantUid) continue;
      
      // Check if this variant's target_segments includes HIGH_FLYER
      const targetSegments = variant.target_segments ? JSON.parse(variant.target_segments) : [];
      if (targetSegments.includes('HIGH_FLYER')) {
        teamVariantUids[team] = variantUid;
        
        // Update the experience mapping with the actual variant UID
        const groupInfo = teamToVariantGroup[team];
        if (groupInfo && experienceToVariant[groupInfo.experienceShortUid]) {
          experienceToVariant[groupInfo.experienceShortUid].variantUid = variantUid;
        }
        break;
      }
    }
  }
  
  return {
    teamVariantUids,
    experienceToVariant,
    lastUpdated: new Date().toISOString()
  };
}

export async function GET() {
  // DEPRECATION WARNING
  console.warn('⚠️ DEPRECATED: /api/variants/config is no longer needed!');
  console.warn('   Use getVariantAliases() from Personalize SDK instead.');
  console.warn('   Aliases work directly with Delivery API x-cs-variant-uid header.');
  
  // Check credentials
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    return NextResponse.json({ 
      error: 'Contentstack credentials not configured',
      deprecated: true,
      message: 'This endpoint is deprecated. Use getVariantAliases() from Personalize SDK instead.'
    }, { status: 500 });
  }

  try {
    // Return cached config if still valid
    const now = Date.now();
    if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL) {
      return NextResponse.json({
        ...cachedConfig,
        cached: true
      });
    }

    // Build fresh config
    const config = await buildVariantConfig();
    
    // Update cache
    cachedConfig = config;
    cacheTimestamp = now;

    return NextResponse.json({
      ...config,
      cached: false
    });

  } catch (error) {
    console.error('Error building variant config:', error);
    
    // Return cached config if available, even if stale
    if (cachedConfig) {
      return NextResponse.json({
        ...cachedConfig,
        cached: true,
        stale: true,
        error: 'Failed to refresh config'
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to build variant config',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

