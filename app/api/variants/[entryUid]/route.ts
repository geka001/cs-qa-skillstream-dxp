import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses dynamic params
export const dynamic = 'force-dynamic';

/**
 * @deprecated This API route is deprecated. Use Personalize SDK for variant delivery instead.
 * 
 * The app now uses:
 * 1. Personalize SDK's getVariantAliases() to determine which variants to show
 * 2. Delivery SDK's .variants() method to fetch personalized content
 * 
 * This route is kept for backwards compatibility and debugging purposes only.
 * See lib/personalize.ts and lib/contentstack.ts for the new implementation.
 * 
 * ---
 * 
 * API Route: Fetch variants for a specific entry
 * 
 * GET /api/variants/[entryUid]
 * 
 * Returns all variants for the given entry from Contentstack Management API
 * This runs server-side, so it has access to all environment variables
 */

// Use NEXT_PUBLIC_ prefix since they're defined that way in .env.local
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_STACK_API_KEY || '';
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || process.env.CONTENTSTACK_MANAGEMENT_TOKEN || '';
const CONTENT_TYPE = 'qa_training_module';

export async function GET(
  request: NextRequest,
  { params }: { params: { entryUid: string } }
) {
  const { entryUid } = params;

  // Deprecation warning
  console.warn('⚠️ DEPRECATED: /api/variants/[entryUid] route is deprecated.');
  console.warn('   Use Personalize SDK getVariantAliases() + Delivery SDK .variants() instead.');
  console.warn('   See lib/personalize.ts and lib/contentstack.ts for the new implementation.');
  
  console.log(`📡 API Route: Fetching variants for entry ${entryUid}`);
  console.log(`   API_KEY present: ${!!API_KEY}`);
  console.log(`   MANAGEMENT_TOKEN present: ${!!MANAGEMENT_TOKEN}`);

  if (!entryUid) {
    return NextResponse.json({ error: 'Entry UID is required' }, { status: 400 });
  }

  if (!API_KEY || !MANAGEMENT_TOKEN) {
    console.error('❌ Contentstack credentials not configured');
    console.error(`   API_KEY: ${API_KEY ? 'present' : 'missing'}`);
    console.error(`   MANAGEMENT_TOKEN: ${MANAGEMENT_TOKEN ? 'present' : 'missing'}`);
    return NextResponse.json({ error: 'Contentstack credentials not configured' }, { status: 500 });
  }

  try {
    // Fetch all variants for this entry from Management API
    const url = `https://api.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${entryUid}/variants?locale=en-us`;
    
    const response = await fetch(url, {
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Don't cache Management API responses
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch variants for ${entryUid}:`, response.status, errorText);
      return NextResponse.json({ 
        error: 'Failed to fetch variants',
        status: response.status,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({
      entryUid,
      variants: data.entries || [],
      count: data.entries?.length || 0
    });

  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

