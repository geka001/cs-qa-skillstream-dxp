/**
 * Challenge Pro Check API
 * 
 * GET /api/challenge-pro/check?team=<teamName>
 * 
 * Checks if a Challenge Pro experience exists for a team
 */

import { NextResponse } from 'next/server';

const PERSONALIZE_PROJECT_UID = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID || process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID || '';
const CLIENT_ID = process.env.CONTENTSTACK_CLIENT_ID || '';
const CLIENT_SECRET = process.env.CONTENTSTACK_CLIENT_SECRET || '';
const ORG_UID = process.env.CONTENTSTACK_ORG_ID || '';

const AUTH_TOKEN_URL = 'https://app.contentstack.com/apps-api/apps/token';
const PERSONALIZE_API_BASE = 'https://personalize-api.contentstack.com';  // No /v1!

// Cache for auth token
let cachedAuthToken: { token: string; expiresAt: number } | null = null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamName = searchParams.get('team');
    
    if (!teamName) {
      return NextResponse.json(
        { exists: false, message: 'Team name is required' },
        { status: 400 }
      );
    }
    
    // Extract token and org_uid from request headers if provided by client
    const authHeader = request.headers.get('authorization');
    const accessTokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.headers.get('x-access-token');
    const orgUidFromHeader = request.headers.get('organization-uid') || request.headers.get('x-organization-uid');
    
    // Check if credentials are configured
    if (!CLIENT_ID || !CLIENT_SECRET || (!ORG_UID && !orgUidFromHeader) || !PERSONALIZE_PROJECT_UID) {
      console.warn('⚠️ Personalize credentials not configured');
      return NextResponse.json({
        exists: false,
        message: 'Personalize credentials not configured'
      });
    }
    
    const teamKey = teamName.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
    const experienceName = `${teamKey}-high-flyer-pro`;
    
    // Get auth token - prefer token from headers, fall back to client credentials
    let authToken: string | null = null;
    if (accessTokenFromHeader) {
      console.log('✅ Using access token from request headers');
      authToken = accessTokenFromHeader;
    } else {
      authToken = await getAuthToken();
    }
    
    if (!authToken) {
      return NextResponse.json({
        exists: false,
        message: 'Failed to authenticate'
      });
    }
    
    // Use org_uid from headers if available, otherwise use env var
    const orgUid = orgUidFromHeader || ORG_UID;
    
    // Search for existing experience - CORRECT endpoint format
    const response = await fetch(
      `${PERSONALIZE_API_BASE}/experiences`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'organization_uid': orgUid,
          'x-project-uid': PERSONALIZE_PROJECT_UID,
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch experiences:', response.status, errorText);
      return NextResponse.json({
        exists: false,
        message: 'Failed to check experiences'
      });
    }
    
    // Response is an array directly
    const experiences = await response.json();
    
    const found = experiences.find((exp: any) => 
      exp.name?.toLowerCase() === experienceName.toLowerCase()
    );
    
    if (found) {
      return NextResponse.json({
        exists: true,
        experienceShortUid: found.shortUid || found.short_uid || found.uid.substring(0, 8),
        experienceUid: found.uid
      });
    }
    
    return NextResponse.json({
      exists: false
    });
    
  } catch (error) {
    console.error('Error checking Challenge Pro:', error);
    return NextResponse.json(
      { exists: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getAuthToken(): Promise<string | null> {
  try {
    // Check if we have a valid cached token
    if (cachedAuthToken && cachedAuthToken.expiresAt > Date.now()) {
      return cachedAuthToken.token;
    }
    
    // Generate new token using client credentials
    const response = await fetch(AUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to get auth token:', response.status, error);
      return null;
    }
    
    const data = await response.json();
    const token = data.access_token;
    
    // Cache token (expires in ~1 hour, we'll refresh at 50 minutes)
    cachedAuthToken = {
      token,
      expiresAt: Date.now() + (50 * 60 * 1000),
    };
    
    return token;
    
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}
