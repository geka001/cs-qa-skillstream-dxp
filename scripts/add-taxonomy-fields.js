/**
 * Add Missing Taxonomy Fields to Existing Content Types
 * This script adds team_taxonomy and segment_taxonomy fields where missing
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

// Taxonomy field template
function createTaxonomyField(displayName, uid, taxonomyUid) {
  return {
    display_name: displayName,
    uid: uid,
    data_type: 'taxonomy',
    taxonomies: [
      {
        taxonomy_uid: taxonomyUid
      }
    ],
    multiple: true,
    mandatory: false
  };
}

async function addFieldToContentType(contentTypeUid, fieldConfig) {
  console.log(`\n📝 Adding field "${fieldConfig.uid}" to ${contentTypeUid}...`);
  
  try {
    // Step 1: Fetch current content type schema
    console.log(`   1. Fetching current schema...`);
    const ctResponse = await makeRequest('GET', `/content_types/${contentTypeUid}`);
    const contentType = ctResponse.content_type;
    
    // Step 2: Check if field already exists
    const fieldExists = contentType.schema.some(field => field.uid === fieldConfig.uid);
    if (fieldExists) {
      console.log(`   ⚠️  Field "${fieldConfig.uid}" already exists. Skipping.`);
      return;
    }
    
    // Step 3: Add new field to schema
    console.log(`   2. Adding field to schema...`);
    contentType.schema.push(fieldConfig);
    
    // Step 4: Update content type
    console.log(`   3. Updating content type...`);
    await makeRequest('PUT', `/content_types/${contentTypeUid}`, {
      content_type: contentType
    });
    
    console.log(`   ✅ Successfully added "${fieldConfig.uid}" to ${contentTypeUid}`);
  } catch (error) {
    console.error(`   ❌ Failed to add field to ${contentTypeUid}`);
    throw error;
  }
}

async function main() {
  console.log('\n🚀 Adding Missing Taxonomy Fields to Content Types\n');
  console.log('=' .repeat(60));
  
  // STEP 1: Add team_taxonomy to qa_training_module
  console.log('\n📚 STEP 1: qa_training_module');
  await addFieldToContentType(
    'qa_training_module',
    createTaxonomyField('Team Taxonomy', 'team_taxonomy', 'product_team')
  );
  
  // STEP 2: Add segment_taxonomy and team_taxonomy to qa_sop
  console.log('\n📋 STEP 2: qa_sop');
  await addFieldToContentType(
    'qa_sop',
    createTaxonomyField('Segment Taxonomy', 'segment_taxonomy', 'learner_segment')
  );
  await addFieldToContentType(
    'qa_sop',
    createTaxonomyField('Team Taxonomy', 'team_taxonomy', 'product_team')
  );
  
  // STEP 3: Add segment_taxonomy and team_taxonomy to qa_tool
  console.log('\n🛠️  STEP 3: qa_tool');
  await addFieldToContentType(
    'qa_tool',
    createTaxonomyField('Segment Taxonomy', 'segment_taxonomy', 'learner_segment')
  );
  await addFieldToContentType(
    'qa_tool',
    createTaxonomyField('Team Taxonomy', 'team_taxonomy', 'product_team')
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ PHASE 1 COMPLETE!\n');
  console.log('Summary:');
  console.log('  ✅ Added team_taxonomy to qa_training_module');
  console.log('  ✅ Added segment_taxonomy to qa_sop');
  console.log('  ✅ Added team_taxonomy to qa_sop');
  console.log('  ✅ Added segment_taxonomy to qa_tool');
  console.log('  ✅ Added team_taxonomy to qa_tool');
  console.log('\nNext Steps:');
  console.log('  1. Verify fields in Contentstack UI');
  console.log('  2. Proceed to Phase 2: Tag entries with new taxonomy values');
  console.log('  3. Run: npm run taxonomy:phase2\n');
}

main().catch(error => {
  console.error('\n❌ Script failed:', error.message);
  process.exit(1);
});

