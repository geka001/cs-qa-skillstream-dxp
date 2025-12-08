/**
 * Get Challenge Pro Variant Alias
 * 
 * GET /api/challenge-pro/get-alias?team=DAM
 * 
 * Returns the variant alias for a team's Challenge Pro experience
 * Looks up variant groups with "-challenge-pro" in the name
 */

import { NextResponse } from 'next/server';

const CMS_API_BASE = 'https://api.contentstack.io/v3';
const CONTENTSTACK_API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const CONTENTSTACK_MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';

// Cache for variant aliases
let aliasCache: Record<string, string> = {};
let aliasCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');
    
    if (!team) {
      return NextResponse.json({ error: 'Team parameter required' }, { status: 400 });
    }
    
    // Check cache first
    if (aliasCache[team] && Date.now() - aliasCacheTime < CACHE_TTL) {
      return NextResponse.json({ 
        success: true,
        variantAlias: aliasCache[team] 
      });
    }
    
    // Fetch variant groups from CMS
    console.log(`🔍 Fetching Challenge Pro variant alias for team: ${team}`);
    
    const response = await fetch(`${CMS_API_BASE}/variant_groups`, {
      headers: {
        'api_key': CONTENTSTACK_API_KEY,
        'authorization': CONTENTSTACK_MANAGEMENT_TOKEN,
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch variant groups:', response.status);
      return NextResponse.json({ error: 'Failed to fetch variant groups' }, { status: 500 });
    }
    
    const data = await response.json();
    
    // Update cache with all challenge-pro aliases
    aliasCache = {};
    aliasCacheTime = Date.now();
    
    for (const vg of data.variant_groups || []) {
      const name = vg.name || '';
      if (name.toLowerCase().includes('challenge-pro')) {
        const expShortUid = vg.personalize_metadata?.experience_short_uid;
        if (expShortUid) {
          // Extract team name from variant group name
          const vgTeam = name.split('-challenge-pro')[0].split('-Challenge-Pro')[0];
          const alias = `cs_personalize_${expShortUid}_0`;
          aliasCache[vgTeam] = alias;
          console.log(`✅ Found Challenge Pro for ${vgTeam}: ${alias}`);
        }
      }
    }
    
    const variantAlias = aliasCache[team];
    
    if (variantAlias) {
      return NextResponse.json({ 
        success: true,
        variantAlias 
      });
    } else {
      return NextResponse.json({ 
        success: false,
        message: `No Challenge Pro found for team: ${team}` 
      });
    }
    
  } catch (error) {
    console.error('Error fetching Challenge Pro alias:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

