/**
 * Get Challenge Pro Variant Details
 * 
 * GET /api/challenge-pro/get-variant?team=<teamName>&entryUid=<entryUid>&variantUid=<variantUid>
 * 
 * Fetches Challenge Pro variant details directly from Management API
 * This is a workaround for when variants aren't published to Delivery API
 */

import { NextResponse } from 'next/server';
import { TEAM_BASE_MODULES } from '@/lib/challengePro';

const CMS_API_BASE = 'https://api.contentstack.io/v3';
const CONTENTSTACK_API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const CONTENTSTACK_MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';

function getCmsHeaders(accessToken?: string): Record<string, string> {
  return {
    'api_key': CONTENTSTACK_API_KEY,
    'authorization': accessToken || CONTENTSTACK_MANAGEMENT_TOKEN,
    'Content-Type': 'application/json',
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');
    const entryUid = searchParams.get('entryUid');
    const variantUid = searchParams.get('variantUid');
    const locale = searchParams.get('locale') || 'en-us';
    
    // Extract token from request headers if provided by client
    const authHeader = request.headers.get('authorization');
    const accessTokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.headers.get('x-access-token');
    
    if (!CONTENTSTACK_API_KEY || (!CONTENTSTACK_MANAGEMENT_TOKEN && !accessTokenFromHeader)) {
      return NextResponse.json({ 
        error: 'CMS credentials not configured or token not provided' 
      }, { status: 401 });
    }
    
    // If variantUid is provided, fetch specific variant
    if (variantUid && entryUid) {
      console.log(`🔍 Fetching specific variant: ${variantUid} for entry: ${entryUid}`);
      
      const response = await fetch(
        `${CMS_API_BASE}/content_types/qa_training_module/entries/${entryUid}/variants/${variantUid}?locale=${locale}`,
        {
          method: 'GET',
          headers: getCmsHeaders(accessTokenFromHeader || undefined),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch variant:', response.status, errorText);
        return NextResponse.json({
          error: 'Failed to fetch variant',
          details: errorText
        }, { status: response.status });
      }
      
      const data = await response.json();
      return NextResponse.json({
        success: true,
        variant: data.entry
      });
    }
    
    // If team is provided, fetch all Challenge Pro variants for that team
    if (team) {
      const baseModule = TEAM_BASE_MODULES[team];
      if (!baseModule) {
        return NextResponse.json({
          error: `No base module configured for team: ${team}`
        }, { status: 404 });
      }
      
      console.log(`🔍 Fetching Challenge Pro variants for team: ${team}, entry: ${baseModule.entryUid}`);
      
      const response = await fetch(
        `${CMS_API_BASE}/content_types/qa_training_module/entries/${baseModule.entryUid}/variants?locale=${locale}`,
        {
          method: 'GET',
          headers: getCmsHeaders(accessTokenFromHeader || undefined),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch variants:', response.status, errorText);
        return NextResponse.json({
          error: 'Failed to fetch variants',
          details: errorText
        }, { status: response.status });
      }
      
      const data = await response.json();
      const variants = data.entries || [];
      
      // Filter for Challenge Pro variants
      const teamKey = team.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
      const challengeProPattern = new RegExp(`${teamKey}.*challenge.*pro|pro:.*${teamKey}|challenge.*pro.*${teamKey}`, 'i');
      
      const challengeProVariants = variants.filter((variant: any) => {
        const title = variant.title || '';
        return challengeProPattern.test(title) || 
               title.toLowerCase().includes('pro:') ||
               title.toLowerCase().includes('challenge pro') ||
               title.toLowerCase().includes('enterprise architecture');
      });
      
      return NextResponse.json({
        success: true,
        team,
        baseEntryUid: baseModule.entryUid,
        variants: challengeProVariants,
        count: challengeProVariants.length
      });
    }
    
    return NextResponse.json({
      error: 'Either team or both entryUid and variantUid must be provided'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error fetching Challenge Pro variant:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

