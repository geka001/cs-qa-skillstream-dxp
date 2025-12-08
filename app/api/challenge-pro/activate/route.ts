/**
 * Challenge Pro Activation API
 * 
 * POST /api/challenge-pro/activate
 * 
 * Complete flow:
 * 1. Use CONTENTSTACK_ACCESS_TOKEN for Personalize API (with auto-refresh)
 * 2. Create Audience in Personalize
 * 3. Create Experience in Personalize  
 * 4. Add Variant & Activate Experience
 * 5. Link Content Type to Variant Group in CMS
 * 6. Create Entry Variant with dynamic content
 * 7. Publish Entry Variant
 */

import { NextResponse } from 'next/server';
import { TEAM_BASE_MODULES, generateChallengeProContent } from '@/lib/challengePro';

// Environment variables
const PERSONALIZE_PROJECT_UID = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID || 
                                 process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID || '';
const ORG_UID = process.env.CONTENTSTACK_ORG_ID || '';
const CONTENTSTACK_API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const CONTENTSTACK_MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';
const CONTENTSTACK_ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';

// Access token for Personalize API (from env)
const CONTENTSTACK_ACCESS_TOKEN = process.env.CONTENTSTACK_ACCESS_TOKEN || '';
const CONTENTSTACK_REFRESH_TOKEN = process.env.CONTENTSTACK_REFRESH_TOKEN || '';

// OAuth credentials for token refresh (optional - used when access token expires)
const CLIENT_ID = process.env.CONTENTSTACK_CLIENT_ID || '';
const CLIENT_SECRET = process.env.CONTENTSTACK_CLIENT_SECRET || '';

// API Endpoints
const PERSONALIZE_API_BASE = 'https://personalize-api.contentstack.com';
const CMS_API_BASE = 'https://api.contentstack.io/v3';
const AUTH_TOKEN_URL = 'https://app.contentstack.com/apps-api/apps/token';

// Attribute UIDs (discovered from GET /attributes)
const ATTRIBUTE_UIDS: Record<string, string> = {
  'QA_LEVEL': '692eb41d2a9f051bc9dd9e69',
  'TEAM_NAME': '692e8160e97e5a98f368cee7',
};

// Token cache for refreshed tokens (in-memory, resets on server restart)
interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

// Cache for environment UID (fetched once from API)
let environmentUidCache: string | null = null;

// Cache for created experiences
const challengeProExperiences: Record<string, {
  audienceUid: string;
  experienceUid: string;
  experienceShortUid: string;
  variantGroupUid?: string;
  cmsVariantUid?: string;
}> = {};

// ============================================================
// MAIN API HANDLER
// ============================================================

export async function POST(request: Request) {
  try {
    const { teamName, userName } = await request.json();
    
    if (!teamName || !userName) {
      return NextResponse.json(
        { success: false, message: 'Team name and user name are required' },
        { status: 400 }
      );
    }
    
    // Check required credentials
    if (!CONTENTSTACK_MANAGEMENT_TOKEN || !CONTENTSTACK_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'CMS credentials not configured. Set NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN and NEXT_PUBLIC_CONTENTSTACK_API_KEY'
      }, { status: 500 });
    }
    
    const teamKey = teamName.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
    const experienceName = `${teamName}-challenge-pro`;
    
    console.log(`🚀 Activating Challenge Pro for ${userName} on team ${teamName}`);
    
    // Check cache first
    if (challengeProExperiences[teamName]) {
      console.log(`✅ Using cached Challenge Pro experience for ${teamName}`);
      return NextResponse.json({
        success: true,
        message: 'Challenge Pro already activated',
        experienceShortUid: challengeProExperiences[teamName].experienceShortUid,
        variantAlias: `cs_personalize_${challengeProExperiences[teamName].experienceShortUid}_0`
      });
    }
    
    // Step 0: Check if Challenge Pro variant already exists in CMS
    // This avoids going through Personalize API if variant is already created
    console.log('🔍 Checking for existing Challenge Pro variant in CMS...');
    const existingCmsVariant = await findExistingCmsVariant(teamName);
    
    if (existingCmsVariant?.found) {
      console.log(`✅ Challenge Pro variant already exists in CMS for ${teamName}`);
      
      // Try to find the corresponding Personalize experience to get the alias
      const authToken = await getPersonalizeAuthToken();
      if (authToken) {
        const existingExp = await findExistingExperience(authToken, experienceName);
        if (existingExp) {
          // Cache the result
          challengeProExperiences[teamName] = {
            audienceUid: '',
            experienceUid: existingExp.uid,
            experienceShortUid: existingExp.shortUid,
            variantGroupUid: existingExp.variantGroupUid,
            cmsVariantUid: existingCmsVariant.variantUid
          };
          
          return NextResponse.json({
            success: true,
            message: 'Challenge Pro already activated (variant exists)',
            experienceShortUid: existingExp.shortUid,
            variantAlias: `cs_personalize_${existingExp.shortUid}_0`
          });
        }
      }
      
      // If we can't find the Personalize experience with exact name, try to find any challenge-pro experience for this team
      console.log('🔍 Searching for any challenge-pro experience for team...');
      const authToken2 = await getPersonalizeAuthToken();
      if (authToken2) {
        // Search all experiences for one matching this team
        const allExperiences = await findExistingExperience(authToken2, `${teamName.toLowerCase()}-challenge-pro`);
        if (allExperiences) {
          challengeProExperiences[teamName] = {
            audienceUid: '',
            experienceUid: allExperiences.uid,
            experienceShortUid: allExperiences.shortUid,
            variantGroupUid: allExperiences.variantGroupUid,
            cmsVariantUid: existingCmsVariant.variantUid
          };
          
          return NextResponse.json({
            success: true,
            message: 'Challenge Pro already activated (found existing experience)',
            experienceShortUid: allExperiences.shortUid,
            variantAlias: `cs_personalize_${allExperiences.shortUid}_0`
          });
        }
      }
      
      // Last resort - CMS variant exists but no Personalize experience found
      // The user may need to trigger a full activation to create the experience
      console.log('⚠️ CMS variant exists but no Personalize experience found');
      return NextResponse.json({
        success: true,
        message: 'Challenge Pro variant exists in CMS. Content will be available on next login.',
        variantAlias: '' // Content exists but delivery may require re-login
      });
    }
    
    // Step 1: Get Personalize Auth Token (with refresh logic)
    console.log('🔑 Getting Personalize auth token...');
    console.log('   ENV Check - ACCESS_TOKEN:', CONTENTSTACK_ACCESS_TOKEN ? `${CONTENTSTACK_ACCESS_TOKEN.substring(0, 20)}...` : 'NOT SET');
    console.log('   ENV Check - ORG_UID:', ORG_UID || 'NOT SET');
    console.log('   ENV Check - PROJECT_UID:', PERSONALIZE_PROJECT_UID || 'NOT SET');
    
    const authToken = await getPersonalizeAuthToken();
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Failed to get Personalize auth token. Check CONTENTSTACK_ACCESS_TOKEN in .env.local' },
        { status: 500 }
      );
    }
    
    console.log('✅ Auth token obtained:', authToken.substring(0, 20) + '...');
    
    // Step 2: Validate token by checking experiences (quick test)
    console.log('🔍 Validating token...');
    const tokenValid = await validateToken(authToken);
    if (!tokenValid) {
      return NextResponse.json({
        success: false,
        message: 'Access token is invalid or expired. Please update CONTENTSTACK_ACCESS_TOKEN in .env.local with a fresh token.'
      }, { status: 401 });
    }
    
    // Step 3: Check if experience already exists
    let existingExperience = await findExistingExperience(authToken, experienceName);
    
    if (existingExperience) {
      console.log(`✅ Found existing experience: ${existingExperience.uid}`);
      challengeProExperiences[teamName] = {
        audienceUid: '',
        experienceUid: existingExperience.uid,
        experienceShortUid: existingExperience.shortUid,
        variantGroupUid: existingExperience.variantGroupUid,
        cmsVariantUid: existingExperience.cmsVariantUid
      };
      
      return NextResponse.json({
        success: true,
        message: 'Challenge Pro experience exists',
        experienceShortUid: existingExperience.shortUid,
        variantAlias: `cs_personalize_${existingExperience.shortUid}_0`
      });
    }
    
    // Step 4: Create Audience
    console.log(`📝 Creating audience: ${experienceName}`);
    const audience = await createAudience(authToken, teamName, experienceName);
    if (!audience) {
      return NextResponse.json({ success: false, message: 'Failed to create audience. Check server logs for details.' }, { status: 500 });
    }
    console.log(`✅ Audience created: ${audience.uid}`);
    
    // Step 5: Create Experience & Activate with Variant
    console.log(`📝 Creating experience: ${experienceName}`);
    const experience = await createExperienceWithVariant(authToken, experienceName, teamName, audience.uid);
    if (!experience) {
      return NextResponse.json({ success: false, message: 'Failed to create experience' }, { status: 500 });
    }
    console.log(`✅ Experience created: ${experience.uid} (short: ${experience.shortUid})`);
    
    // Step 6: Wait for CMS sync then get variant group details
    await new Promise(resolve => setTimeout(resolve, 2000));
    const expDetails = await getExperienceDetails(authToken, experience.uid);
    const variantGroupUid = expDetails?.variantGroupUid;
    const cmsVariantUid = expDetails?.cmsVariantUid;
    
    if (!variantGroupUid || !cmsVariantUid) {
      console.warn('⚠️ CMS variant not ready yet, skipping entry variant creation');
    } else {
      // Step 7: Link Content Type to Variant Group
      console.log(`📝 Linking content type to variant group: ${variantGroupUid}`);
      await linkContentTypeToVariantGroup(variantGroupUid, experienceName);
      
      // Step 8: Create Entry Variant
      const baseModule = TEAM_BASE_MODULES[teamName];
      if (baseModule) {
        console.log(`📝 Creating entry variant for ${teamName}`);
        await createEntryVariant(teamName, baseModule.entryUid, cmsVariantUid);
        
        // Step 9: Publish Entry Variant
        console.log(`📤 Publishing entry variant...`);
        await publishEntryVariant(baseModule.entryUid, cmsVariantUid);
      }
    }
    
    // Cache result
    challengeProExperiences[teamName] = {
      audienceUid: audience.uid,
      experienceUid: experience.uid,
      experienceShortUid: experience.shortUid,
      variantGroupUid,
      cmsVariantUid
    };
    
    console.log(`✅ Challenge Pro activated successfully for ${teamName}`);
    
    return NextResponse.json({
      success: true,
      message: 'Challenge Pro activated! New advanced content unlocked.',
      experienceShortUid: experience.shortUid,
      variantAlias: `cs_personalize_${experience.shortUid}_0`
    });
    
  } catch (error) {
    console.error('❌ Error in Challenge Pro activation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

async function getPersonalizeAuthToken(): Promise<string | null> {
  try {
    // Option 1: Use cached refreshed token if available
    if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) {
      console.log('✅ Using cached refreshed token');
      return tokenCache.accessToken;
    }
    
    // Option 2: Use CONTENTSTACK_ACCESS_TOKEN from env
    if (CONTENTSTACK_ACCESS_TOKEN) {
      console.log('✅ Using CONTENTSTACK_ACCESS_TOKEN from environment');
      return CONTENTSTACK_ACCESS_TOKEN;
    }
    
    // Option 3: Try to get new token via refresh token
    if (CONTENTSTACK_REFRESH_TOKEN && CLIENT_ID && CLIENT_SECRET) {
      console.log('🔄 Access token not set, trying refresh token...');
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        return refreshedToken;
      }
    }
    
    // Option 4: Try client credentials grant
    if (CLIENT_ID && CLIENT_SECRET) {
      console.log('🔑 Getting token via client credentials...');
      return await getNewAccessToken();
    }
    
    console.error('❌ No CONTENTSTACK_ACCESS_TOKEN set and cannot refresh');
    console.error('   Please set CONTENTSTACK_ACCESS_TOKEN in .env.local');
    return null;
    
  } catch (error) {
    console.error('Error getting Personalize auth token:', error);
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    if (!CONTENTSTACK_REFRESH_TOKEN || !CLIENT_ID || !CLIENT_SECRET) {
      console.log('⚠️ Refresh token or client credentials not configured');
      return null;
    }
    
    console.log('🔄 Refreshing access token...');
    
    const response = await fetch(AUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: CONTENTSTACK_REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Token refresh failed:', response.status, error);
      return null;
    }
    
    const data = await response.json();
    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    const expiresAt = Date.now() + (expiresIn * 1000);
    
    // Cache the refreshed token in memory
    tokenCache = {
      accessToken: newAccessToken,
      expiresAt,
    };
    
    console.log('✅ Token refreshed successfully');
    console.log(`   New token expires at: ${new Date(expiresAt).toISOString()}`);
    console.log('   💡 Update CONTENTSTACK_ACCESS_TOKEN in .env.local with new token');
    
    return newAccessToken;
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

async function getNewAccessToken(): Promise<string | null> {
  try {
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
      console.error('❌ Failed to get new token:', response.status, error);
      return null;
    }
    
    const data = await response.json();
    const accessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    const expiresAt = Date.now() + (expiresIn * 1000);
    
    // Cache in memory
    tokenCache = {
      accessToken,
      expiresAt,
    };
    
    console.log('✅ New token obtained via client credentials');
    console.log(`   Token expires at: ${new Date(expiresAt).toISOString()}`);
    
    return accessToken;
    
  } catch (error) {
    console.error('Error getting new token:', error);
    return null;
  }
}

// ============================================================
// PERSONALIZE API FUNCTIONS
// ============================================================

function getPersonalizeHeaders(authToken: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
    'organization_uid': ORG_UID,
    'x-project-uid': PERSONALIZE_PROJECT_UID,
  };
}

/**
 * Validate token by making a simple API call
 */
async function validateToken(authToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${PERSONALIZE_API_BASE}/experiences`, {
      method: 'GET',
      headers: getPersonalizeHeaders(authToken),
    });
    
    if (response.status === 401 || response.status === 403) {
      console.error('❌ Token validation failed - token is invalid or expired');
      console.error('');
      console.error('🔑 TO FIX: Get a new access token and update .env.local:');
      console.error('   1. Use Contentstack CLI: csk auth:login');
      console.error('   2. Copy the access_token from the response');
      console.error('   3. Update CONTENTSTACK_ACCESS_TOKEN in .env.local');
      console.error('   4. Restart the dev server');
      console.error('');
      return false;
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

async function findExistingExperience(authToken: string, experienceName: string): Promise<{
  uid: string;
  shortUid: string;
  variantGroupUid?: string;
  cmsVariantUid?: string;
} | null> {
  try {
    const response = await fetch(`${PERSONALIZE_API_BASE}/experiences`, {
      headers: getPersonalizeHeaders(authToken),
    });
    
    if (!response.ok) return null;
    
    const experiences = await response.json();
    const found = experiences.find((exp: any) => 
      exp.name?.toLowerCase() === experienceName.toLowerCase()
    );
    
    if (found) {
      const cmsVariants = found._cms?.variants || {};
      const firstVariantUid = Object.values(cmsVariants)[0] as string | undefined;
      
      return {
        uid: found.uid,
        shortUid: found.shortUid,
        variantGroupUid: found._cms?.variantGroup,
        cmsVariantUid: firstVariantUid
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error finding experience:', error);
    return null;
  }
}

async function createAudience(authToken: string, teamName: string, audienceName: string): Promise<{ uid: string } | null> {
  try {
    const payload = {
      name: audienceName,
      description: `${teamName} HIGH_FLYER users who accepted Challenge Pro`,
      definition: {
        combinationType: 'AND',
        rules: [
          {
            __type: 'Rule',
            attribute: { __type: 'CustomAttributeReference', ref: ATTRIBUTE_UIDS['QA_LEVEL'] },
            attributeMatchCondition: 'STRING_EQUALS',
            attributeMatchOptions: { __type: 'StringMatchOptions', value: 'HIGH_FLYER' },
            invertCondition: false
          },
          {
            __type: 'Rule',
            attribute: { __type: 'CustomAttributeReference', ref: ATTRIBUTE_UIDS['TEAM_NAME'] },
            attributeMatchCondition: 'STRING_EQUALS',
            attributeMatchOptions: { __type: 'StringMatchOptions', value: teamName },
            invertCondition: false
          }
        ]
      }
    };
    
    const url = `${PERSONALIZE_API_BASE}/audiences`;
    const headers = getPersonalizeHeaders(authToken);
    
    console.log('📤 Creating audience...');
    console.log('   URL:', url);
    console.log('   Headers:', JSON.stringify({
      ...headers,
      Authorization: headers.Authorization.substring(0, 30) + '...'
    }, null, 2));
    console.log('   Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    const responseText = await response.text();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response body:', responseText);
    
    if (!response.ok) {
      console.error('❌ Failed to create audience:', response.status, responseText);
      
      // Check for token expiry
      if (response.status === 401) {
        console.error('');
        console.error('🔑 ACCESS TOKEN EXPIRED!');
        console.error('   Please get a new access token and update CONTENTSTACK_ACCESS_TOKEN in .env.local');
        console.error('   You can use: csk auth:login (Contentstack CLI)');
        console.error('');
      }
      
      return null;
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ Audience created with UID:', data.uid);
    return { uid: data.uid };
    
  } catch (error) {
    console.error('❌ Error creating audience:', error);
    return null;
  }
}

async function createExperienceWithVariant(
  authToken: string,
  experienceName: string,
  teamName: string,
  audienceUid: string
): Promise<{ uid: string; shortUid: string } | null> {
  try {
    // Create experience
    const createResponse = await fetch(`${PERSONALIZE_API_BASE}/experiences`, {
      method: 'POST',
      headers: getPersonalizeHeaders(authToken),
      body: JSON.stringify({
        name: experienceName,
        description: `Challenge Pro for ${teamName} HIGH_FLYER users`,
        __type: 'SEGMENTED'
      }),
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('Failed to create experience:', error);
      return null;
    }
    
    const createData = await createResponse.json();
    const experienceUid = createData.uid;
    const shortUid = createData.shortUid;
    const latestVersion = createData.latestVersion;
    
    // Add variant and activate
    const variantName = `${teamName.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}-challenge-pro`;
    
    const versionResponse = await fetch(
      `${PERSONALIZE_API_BASE}/experiences/${experienceUid}/versions/${latestVersion}`,
      {
        method: 'PUT',
        headers: getPersonalizeHeaders(authToken),
        body: JSON.stringify({
          status: 'ACTIVE',
          variants: [{
            __type: 'SegmentedVariant',
            name: variantName,
            audiences: [audienceUid],
            audienceCombinationType: 'AND'
          }]
        }),
      }
    );
    
    if (!versionResponse.ok) {
      const error = await versionResponse.text();
      console.warn('Failed to activate experience:', error);
    } else {
      console.log('✅ Experience activated with variant:', variantName);
    }
    
    return { uid: experienceUid, shortUid };
    
  } catch (error) {
    console.error('Error creating experience:', error);
    return null;
  }
}

async function getExperienceDetails(authToken: string, experienceUid: string): Promise<{
  variantGroupUid?: string;
  cmsVariantUid?: string;
} | null> {
  try {
    const response = await fetch(`${PERSONALIZE_API_BASE}/experiences/${experienceUid}`, {
      headers: getPersonalizeHeaders(authToken),
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const cmsVariants = data._cms?.variants || {};
    const firstVariantUid = Object.values(cmsVariants)[0] as string | undefined;
    
    return {
      variantGroupUid: data._cms?.variantGroup,
      cmsVariantUid: firstVariantUid
    };
    
  } catch (error) {
    console.error('Error getting experience details:', error);
    return null;
  }
}

// ============================================================
// CMS API FUNCTIONS
// ============================================================

function getCmsHeaders(): Record<string, string> {
  return {
    'api_key': CONTENTSTACK_API_KEY,
    'authorization': CONTENTSTACK_MANAGEMENT_TOKEN,
    'Content-Type': 'application/json',
  };
}

/**
 * Check if a Challenge Pro variant already exists in CMS for the team
 * Returns variant alias if found, null otherwise
 */
async function findExistingCmsVariant(teamName: string): Promise<{
  found: boolean;
  variantAlias?: string;
  baseEntryUid?: string;
  variantUid?: string;
} | null> {
  try {
    const baseModule = TEAM_BASE_MODULES[teamName];
    if (!baseModule) {
      console.log(`⚠️ No base module configured for team: ${teamName}`);
      return null;
    }
    
    console.log(`🔍 Checking for existing Challenge Pro variant for ${teamName}...`);
    
    // Get all variants for the base entry
    const response = await fetch(
      `${CMS_API_BASE}/content_types/qa_training_module/entries/${baseModule.entryUid}/variants`,
      {
        method: 'GET',
        headers: getCmsHeaders(),
      }
    );
    
    if (!response.ok) {
      console.log('Could not fetch variants:', response.status);
      return null;
    }
    
    const data = await response.json();
    const variants = data.entries || [];
    
    // Look for a variant with "-challenge-pro" in the title or matching pattern
    const teamKey = teamName.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
    const challengeProPattern = new RegExp(`${teamKey}.*challenge.*pro|pro:.*${teamKey}|challenge.*pro.*${teamKey}`, 'i');
    
    for (const variant of variants) {
      const title = variant.title || '';
      const variantUid = variant._variant?._uid;
      
      // Check if title matches Challenge Pro pattern
      if (challengeProPattern.test(title) || 
          title.toLowerCase().includes('pro:') ||
          title.toLowerCase().includes('challenge pro') ||
          title.toLowerCase().includes('enterprise architecture')) {
        
        console.log(`✅ Found existing Challenge Pro variant: "${title}" (${variantUid})`);
        
        // Get the variant group UID from the variant
        const variantGroupUid = variant._variant?._variant_group;
        
        // Construct variant alias - we need to find the experience short UID
        // For now, return without alias and let the caller handle it
        return {
          found: true,
          baseEntryUid: baseModule.entryUid,
          variantUid: variantUid
        };
      }
    }
    
    console.log(`📭 No existing Challenge Pro variant found for ${teamName}`);
    return { found: false };
    
  } catch (error) {
    console.error('Error checking for existing variant:', error);
    return null;
  }
}

/**
 * Fetch environment UID from API using environment name
 * Caches the result to avoid repeated API calls
 */
async function getEnvironmentUid(): Promise<string | null> {
  // Return cached value if available
  if (environmentUidCache) {
    return environmentUidCache;
  }
  
  try {
    console.log(`🔍 Fetching environment UID for: ${CONTENTSTACK_ENVIRONMENT}`);
    
    const response = await fetch(`${CMS_API_BASE}/environments`, {
      method: 'GET',
      headers: {
        'api_key': CONTENTSTACK_API_KEY,
        'authorization': CONTENTSTACK_MANAGEMENT_TOKEN,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to fetch environments:', error);
      return null;
    }
    
    const data = await response.json();
    const environments = data.environments || [];
    
    // Find environment by name (case-insensitive)
    const env = environments.find((e: { name: string; uid: string }) => 
      e.name.toLowerCase() === CONTENTSTACK_ENVIRONMENT.toLowerCase()
    );
    
    if (!env) {
      console.error(`Environment "${CONTENTSTACK_ENVIRONMENT}" not found`);
      console.log('Available environments:', environments.map((e: { name: string }) => e.name).join(', '));
      return null;
    }
    
    // Cache the UID
    environmentUidCache = env.uid;
    console.log(`✅ Found environment UID: ${env.uid}`);
    
    return env.uid;
    
  } catch (error) {
    console.error('Error fetching environment UID:', error);
    return null;
  }
}

async function linkContentTypeToVariantGroup(variantGroupUid: string, name: string): Promise<boolean> {
  try {
    // Link qa_training_module content type to variant group
    const response = await fetch(`${CMS_API_BASE}/variant_groups/${variantGroupUid}`, {
      method: 'PUT',
      headers: getCmsHeaders(),
      body: JSON.stringify({
        name: name,
        content_types: [{ uid: 'qa_training_module', status: 'linked' }]
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to link content type:', error);
      return false;
    }
    
    console.log('✅ Content type linked to variant group');
    return true;
    
  } catch (error) {
    console.error('Error linking content type:', error);
    return false;
  }
}

async function createEntryVariant(teamName: string, baseEntryUid: string, cmsVariantUid: string): Promise<boolean> {
  try {
    const proContent = generateChallengeProContent(teamName);
    
    // Build taxonomies array with proper structure
    // Taxonomy term UIDs should match what's defined in Contentstack
    // Map team names to their taxonomy term UIDs
    const teamTermMap: Record<string, string> = {
      'DAM': 'dam',
      'Launch': 'launch',
      'AutoDraft': 'autodraft',
      'Data & Insights': 'data_insights',
      'Visual Builder': 'visual_builder'
    };
    const teamTermUid = teamTermMap[teamName] || teamName.toLowerCase().replace(/\s+/g, '_');
    
    const taxonomies = [
      { taxonomy_uid: 'skill_level', term_uid: 'advanced' },
      { taxonomy_uid: 'user_segment', term_uid: 'high_flyer' },
      { taxonomy_uid: 'user_segment', term_uid: 'high_flyer_pro' },
      { taxonomy_uid: 'product_team', term_uid: teamTermUid }
    ];
    
    const response = await fetch(
      `${CMS_API_BASE}/content_types/qa_training_module/entries/${baseEntryUid}/variants/${cmsVariantUid}`,
      {
        method: 'PUT',
        headers: getCmsHeaders(),
        body: JSON.stringify({
          entry: {
            title: proContent.title,
            module_id: proContent.moduleId,
            difficulty: 'advanced',
            content: proContent.content,
            estimated_time: 75,
            order: 0,
            target_segments: '["HIGH_FLYER"]',
            target_teams: JSON.stringify([teamName]),
            quiz_items: JSON.stringify(proContent.quizItems),
            module_tags: JSON.stringify([teamName.toLowerCase(), 'challenge-pro', 'enterprise', 'advanced']),
            unlocks_challenge_pro: false,
            taxonomies: taxonomies,
            _variant: {
              _change_set: ['title', 'module_id', 'difficulty', 'content', 'estimated_time', 'order', 'target_segments', 'target_teams', 'quiz_items', 'module_tags', 'unlocks_challenge_pro', 'taxonomies']
            }
          }
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to create entry variant:', error);
      return false;
    }
    
    console.log('✅ Entry variant created with taxonomies');
    return true;
    
  } catch (error) {
    console.error('Error creating entry variant:', error);
    return false;
  }
}

async function publishEntryVariant(baseEntryUid: string, cmsVariantUid: string): Promise<boolean> {
  try {
    // Publish the entire base entry (which publishes all its variants too)
    console.log(`📤 Publishing base entry ${baseEntryUid} with all variants...`);
    
    const response = await fetch(
      `${CMS_API_BASE}/content_types/qa_training_module/entries/${baseEntryUid}/publish`,
      {
        method: "POST",
        headers: getCmsHeaders(),
        body: JSON.stringify({
          entry: {
            environments: [CONTENTSTACK_ENVIRONMENT],
            locales: ["en-us"]
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Entry publish failed:", err);
      
      // Try alternative: bulk publish
      console.log("📤 Trying bulk publish...");
      const bulkResponse = await fetch(`${CMS_API_BASE}/bulk/publish`, {
        method: "POST",
        headers: getCmsHeaders(),
        body: JSON.stringify({
          entries: [{
            uid: baseEntryUid,
            content_type: "qa_training_module",
            locale: "en-us"
          }],
          locales: ["en-us"],
          environments: [CONTENTSTACK_ENVIRONMENT]
        })
      });
      
      if (!bulkResponse.ok) {
        const bulkErr = await bulkResponse.text();
        console.error("❌ Bulk publish also failed:", bulkErr);
        console.log("📋 Please publish the entry manually in CMS");
        return false;
      }
      
      console.log("✅ Entry published via bulk publish");
    } else {
      console.log("✅ Entry published successfully with all variants");
    }
    
    // Wait for publish to propagate
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return true;

  } catch (error) {
    console.error("Error publishing entry:", error);
    return false;
  }
}


