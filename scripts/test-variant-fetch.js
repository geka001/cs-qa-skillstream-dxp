/**
 * Test Script: Fetch Variants from Contentstack Management API
 * 
 * This script tests:
 * 1. Fetching a base entry
 * 2. Fetching all variants for that entry
 * 3. Understanding the data structure
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || 'blt8202119c48319b1d';
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || 'cs911496f76cbfb543bb764ae7';
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || 'csdf941d70d6da13d4ae6265de';

const CONTENT_TYPE = 'qa_training_module';
const TEST_ENTRY_UID = 'blt25efa166fab8cd74'; // Introduction to Contentstack Launch

async function fetchBaseEntry() {
  console.log('\n📦 1. FETCHING BASE ENTRY (Delivery API)');
  console.log('=' .repeat(50));
  
  // Include all fields and taxonomies
  const url = `https://cdn.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${TEST_ENTRY_UID}?environment=dev&include_fallback_locale=true`;
  
  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'access_token': DELIVERY_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    console.error('❌ Failed to fetch base entry:', response.status, response.statusText);
    const text = await response.text();
    console.error('Response:', text);
    return null;
  }
  
  const data = await response.json();
  const entry = data.entry;
  
  console.log('✅ Base Entry Details:');
  console.log('   UID:', entry.uid);
  console.log('   Title:', entry.title);
  console.log('   Team Taxonomy:', JSON.stringify(entry.team_taxonomy));
  console.log('   Segment Taxonomy:', JSON.stringify(entry.segment_taxonomy));
  console.log('   target_teams (legacy):', entry.target_teams);
  console.log('   target_segments (legacy):', entry.target_segments);
  console.log('   Has single team?:', Array.isArray(entry.team_taxonomy) && entry.team_taxonomy.length === 1);
  console.log('\n   📋 ALL FIELDS:', Object.keys(entry).join(', '));
  
  return entry;
}

async function fetchAllVariantsForEntry() {
  console.log('\n📦 2. FETCHING ALL VARIANTS FOR ENTRY (Management API)');
  console.log('=' .repeat(50));
  
  const url = `https://api.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${TEST_ENTRY_UID}/variants?locale=en-us`;
  
  console.log('URL:', url);
  
  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    console.error('❌ Failed to fetch variants:', response.status, response.statusText);
    const text = await response.text();
    console.error('Response:', text);
    return [];
  }
  
  const data = await response.json();
  
  console.log('✅ Response structure:', Object.keys(data));
  console.log('✅ Number of variants:', data.entries?.length || 0);
  
  if (data.entries && data.entries.length > 0) {
    data.entries.forEach((variant, index) => {
      console.log(`\n   Variant ${index + 1}:`);
      console.log('   - UID:', variant.uid);
      console.log('   - Title:', variant.title);
      console.log('   - Segment Taxonomy:', JSON.stringify(variant.segment_taxonomy));
      console.log('   - Team Taxonomy:', JSON.stringify(variant.team_taxonomy));
      console.log('   - target_segments (legacy):', variant.target_segments);
      console.log('   - _variant:', JSON.stringify(variant._variant));
      console.log('   - Content (first 100 chars):', variant.content?.substring(0, 100));
      console.log('   - 📋 ALL FIELDS:', Object.keys(variant).join(', '));
    });
  }
  
  return data.entries || [];
}

async function fetchSpecificVariant(variantUid) {
  console.log('\n📦 3. FETCHING SPECIFIC VARIANT (Management API)');
  console.log('=' .repeat(50));
  
  const url = `https://api.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${TEST_ENTRY_UID}/variants/${variantUid}?locale=en-us`;
  
  console.log('URL:', url);
  
  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    console.error('❌ Failed to fetch specific variant:', response.status, response.statusText);
    const text = await response.text();
    console.error('Response:', text);
    return null;
  }
  
  const data = await response.json();
  const entry = data.entry;
  
  console.log('✅ Specific Variant Details:');
  console.log('   UID:', entry.uid);
  console.log('   Title:', entry.title);
  console.log('   Segment Taxonomy:', JSON.stringify(entry.segment_taxonomy));
  console.log('   Team Taxonomy:', JSON.stringify(entry.team_taxonomy));
  console.log('   _variant:', JSON.stringify(entry._variant));
  console.log('   Content (first 200 chars):', entry.content?.substring(0, 200));
  console.log('   Video URL:', entry.video_url);
  
  return entry;
}

async function testDynamicVariantLogic() {
  console.log('\n📦 4. TESTING DYNAMIC VARIANT LOGIC');
  console.log('=' .repeat(50));
  console.log('Logic: If entry has single team in team_taxonomy → check for variants');
  
  // First, fetch all modules
  const url = `https://cdn.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries?environment=dev`;
  
  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'access_token': DELIVERY_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  const entries = data.entries || [];
  
  console.log(`\n📋 Total modules: ${entries.length}`);
  console.log('\nChecking team_taxonomy and target_teams fields...');
  
  // Check what fields are available
  if (entries.length > 0) {
    console.log('Sample entry fields:', Object.keys(entries[0]).join(', '));
  }
  
  console.log('\nModules with SINGLE team (potential variants):');
  
  // Check both taxonomy field and legacy JSON field
  const singleTeamEntries = entries.filter(e => {
    // Try taxonomy field first
    if (Array.isArray(e.team_taxonomy) && e.team_taxonomy.length === 1) {
      return true;
    }
    // Try legacy JSON field
    if (e.target_teams) {
      try {
        const teams = JSON.parse(e.target_teams);
        return Array.isArray(teams) && teams.length === 1;
      } catch {
        return false;
      }
    }
    return false;
  });
  
  for (const entry of singleTeamEntries) {
    // Get team from either source
    let team = entry.team_taxonomy?.[0];
    if (!team && entry.target_teams) {
      try {
        const teams = JSON.parse(entry.target_teams);
        team = teams[0];
      } catch {}
    }
    
    console.log(`\n   📌 "${entry.title}"`);
    console.log(`      UID: ${entry.uid}`);
    console.log(`      Team: ${team}`);
    console.log(`      team_taxonomy: ${JSON.stringify(entry.team_taxonomy)}`);
    console.log(`      target_teams: ${entry.target_teams}`);
    console.log(`      Segment: ${JSON.stringify(entry.segment_taxonomy || entry.target_segments)}`);
    
    // Check if this entry has variants
    const variantUrl = `https://api.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${entry.uid}/variants?locale=en-us`;
    
    const variantResponse = await fetch(variantUrl, {
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (variantResponse.ok) {
      const variantData = await variantResponse.json();
      const variantCount = variantData.entries?.length || 0;
      console.log(`      Has Variants: ${variantCount > 0 ? '✅ YES (' + variantCount + ')' : '❌ NO'}`);
      
      if (variantData.entries?.length > 0) {
        variantData.entries.forEach(v => {
          console.log(`         → Variant: "${v.title}" (Segment: ${JSON.stringify(v.segment_taxonomy)})`);
        });
      }
    }
  }
}

async function testVariantMerging() {
  console.log('\n📦 5. TESTING VARIANT MERGING LOGIC');
  console.log('=' .repeat(50));
  
  // Fetch base entry
  const baseUrl = `https://cdn.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${TEST_ENTRY_UID}?environment=dev`;
  const baseResponse = await fetch(baseUrl, {
    headers: {
      'api_key': API_KEY,
      'access_token': DELIVERY_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  const baseData = await baseResponse.json();
  const baseEntry = baseData.entry;
  
  // Fetch variant
  const variantUrl = `https://api.contentstack.io/v3/content_types/${CONTENT_TYPE}/entries/${TEST_ENTRY_UID}/variants?locale=en-us`;
  const variantResponse = await fetch(variantUrl, {
    headers: {
      'api_key': API_KEY,
      'authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  const variantData = await variantResponse.json();
  const variant = variantData.entries?.[0];
  
  if (!variant) {
    console.log('❌ No variant found to test merging');
    return;
  }
  
  console.log('\n📋 BASE ENTRY:');
  console.log('   Title:', baseEntry.title);
  console.log('   Content (first 100):', baseEntry.content?.substring(0, 100));
  console.log('   Video URL:', baseEntry.video_url);
  console.log('   target_segments:', baseEntry.target_segments);
  
  console.log('\n📋 VARIANT:');
  console.log('   Title:', variant.title);
  console.log('   Content:', variant.content);
  console.log('   Video URL:', variant.video_url);
  console.log('   target_segments:', variant.target_segments);
  console.log('   _change_set:', variant._variant?._change_set);
  
  // Simulate merging
  const changeSet = variant._variant?._change_set || [];
  const merged = { ...baseEntry };
  
  for (const field of changeSet) {
    if (variant[field] !== undefined) {
      merged[field] = variant[field];
    }
  }
  
  console.log('\n📋 MERGED RESULT:');
  console.log('   Title:', merged.title, merged.title !== baseEntry.title ? '(from variant)' : '(from base)');
  console.log('   Content (first 100):', merged.content?.substring(0, 100), merged.content !== baseEntry.content ? '(from variant)' : '(from base)');
  console.log('   Video URL:', merged.video_url, merged.video_url !== baseEntry.video_url ? '(from variant)' : '(from base)');
  console.log('   target_segments:', merged.target_segments);
}

async function main() {
  console.log('🚀 CONTENTSTACK VARIANT FETCH TEST');
  console.log('=' .repeat(50));
  console.log('API Key:', API_KEY);
  console.log('Management Token:', MANAGEMENT_TOKEN.substring(0, 10) + '...');
  console.log('Test Entry:', TEST_ENTRY_UID);
  
  try {
    // Test 1: Fetch base entry
    await fetchBaseEntry();
    
    // Test 2: Fetch all variants for the entry
    const variants = await fetchAllVariantsForEntry();
    
    // Test 3: Fetch specific variant (if any found)
    if (variants.length > 0) {
      const variantUid = variants[0]._variant?._uid;
      if (variantUid) {
        await fetchSpecificVariant(variantUid);
      }
    }
    
    // Test 4: Dynamic variant logic
    await testDynamicVariantLogic();
    
    // Test 5: Variant merging
    await testVariantMerging();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ TEST COMPLETE');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

main();

