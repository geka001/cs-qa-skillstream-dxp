/**
 * Add Missing product_team Taxonomy
 * This creates the product_team taxonomy with 5 team terms
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY,
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
  region: process.env.CONTENTSTACK_REGION || 'NA'
};

const API_BASE = 'https://api.contentstack.io';

// Helper function to make API requests
async function makeRequest(method, endpoint, data = null) {
  try {
    const response = await axios({
      method,
      url: `${API_BASE}/v3${endpoint}`,
      headers: {
        'api_key': CONFIG.apiKey,
        'authorization': CONFIG.managementToken,
        'Content-Type': 'application/json'
      },
      data
    });
    return response.data;
  } catch (error) {
    console.error(`❌ API Error (${error.response?.status}):`, error.response?.data || error.message);
    throw error;
  }
}

// Create taxonomy
async function createTaxonomy(taxonomy) {
  console.log(`\n📝 Creating taxonomy: ${taxonomy.name} (${taxonomy.uid})...`);
  
  try {
    const response = await makeRequest('POST', '/taxonomies', { taxonomy });
    console.log(`   ✅ Successfully created taxonomy: ${taxonomy.name}`);
    return response;
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.error_message?.includes('already exists')) {
      console.log(`   ⚠️  Taxonomy "${taxonomy.uid}" already exists. Skipping.`);
      return null;
    }
    throw error;
  }
}

// Create taxonomy terms
async function createTerms(taxonomyUid, terms, parentUid = null) {
  for (const term of terms) {
    console.log(`   📌 Creating term: ${term.name} (${term.uid})...`);
    
    try {
      const termData = {
        term: {
          uid: term.uid,
          name: term.name,
          parent_uid: parentUid || null
        }
      };
      
      await makeRequest('POST', `/taxonomies/${taxonomyUid}/terms`, termData);
      console.log(`      ✅ Created term: ${term.name}`);
      
      // Create child terms if any
      if (term.children) {
        await createTerms(taxonomyUid, term.children, term.uid);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        console.log(`      ⚠️  Term "${term.uid}" already exists. Skipping.`);
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  console.log('\n🚀 Creating Missing product_team Taxonomy\n');
  console.log('=' .repeat(60));
  
  const productTeamTaxonomy = {
    uid: 'product_team',
    name: 'Product Team',
    description: 'Contentstack product teams'
  };
  
  const productTeamTerms = [
    { uid: 'launch', name: 'Launch' },
    { uid: 'data_insights', name: 'Data & Insights' },
    { uid: 'visual_builder', name: 'Visual Builder' },
    { uid: 'autodraft', name: 'AutoDraft' },
    { uid: 'dam', name: 'DAM' }
  ];
  
  // Step 1: Create the taxonomy
  console.log('\n📚 Step 1: Create product_team taxonomy');
  await createTaxonomy(productTeamTaxonomy);
  
  // Step 2: Create the terms
  console.log('\n📚 Step 2: Create team terms');
  await createTerms('product_team', productTeamTerms);
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ TAXONOMY CREATION COMPLETE!\n');
  console.log('Created:');
  console.log('  ✅ product_team taxonomy');
  console.log('  ✅ 5 team terms: launch, data_insights, visual_builder, autodraft, dam');
  console.log('\nNext Steps:');
  console.log('  1. Verify in Contentstack UI: Settings → Taxonomies → product_team');
  console.log('  2. Add taxonomy fields to content types (manual UI work)');
  console.log('  3. Tag entries with taxonomy terms\n');
}

main().catch(error => {
  console.error('\n❌ Script failed:', error.message);
  process.exit(1);
});

