/**
 * Verify Taxonomy Setup
 * Check if all required taxonomies and fields exist
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY,
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
  region: process.env.CONTENTSTACK_REGION || 'NA'
};

const API_BASE = 'https://api.contentstack.io';

async function makeRequest(endpoint) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_BASE}/v3${endpoint}`,
      headers: {
        'api_key': CONFIG.apiKey,
        'authorization': CONFIG.managementToken,
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return null;
  }
}

async function checkTaxonomies() {
  console.log('\n📚 Checking Taxonomies...\n');
  
  const requiredTaxonomies = [
    'skill_level',
    'content_category',
    'sop_category',
    'tool_category',
    'user_segment',
    'product_team'
  ];
  
  const response = await makeRequest('/taxonomies');
  const taxonomies = response?.taxonomies || [];
  
  console.log(`Found ${taxonomies.length} taxonomies:\n`);
  
  requiredTaxonomies.forEach(required => {
    const found = taxonomies.find(t => t.uid === required);
    if (found) {
      console.log(`  ✅ ${required} (${found.name})`);
    } else {
      console.log(`  ❌ ${required} - MISSING!`);
    }
  });
}

async function checkContentTypeFields() {
  console.log('\n\n📋 Checking Content Type Fields...\n');
  
  const contentTypes = [
    {
      uid: 'qa_training_module',
      name: 'Training Modules',
      requiredFields: ['skill_level_taxonomy', 'segment_taxonomy', 'team_taxonomy']
    },
    {
      uid: 'qa_sop',
      name: 'SOPs',
      requiredFields: ['sop_category', 'segment_taxonomy', 'team_taxonomy']
    },
    {
      uid: 'qa_tool',
      name: 'Tools',
      requiredFields: ['tool_category', 'segment_taxonomy', 'team_taxonomy']
    }
  ];
  
  for (const ct of contentTypes) {
    console.log(`\n🔍 ${ct.name} (${ct.uid}):`);
    
    const response = await makeRequest(`/content_types/${ct.uid}`);
    const schema = response?.content_type?.schema || [];
    
    ct.requiredFields.forEach(field => {
      const found = schema.find(f => f.uid === field);
      if (found) {
        const taxRef = found.taxonomies?.[0]?.taxonomy_uid || 'unknown';
        console.log(`  ✅ ${field} → ${taxRef}`);
      } else {
        console.log(`  ❌ ${field} - MISSING!`);
      }
    });
  }
}

async function main() {
  console.log('\n🔍 TAXONOMY SETUP VERIFICATION\n');
  console.log('='.repeat(60));
  
  await checkTaxonomies();
  await checkContentTypeFields();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Verification complete!\n');
  console.log('If all items show ✅, you\'re ready for Phase 2: Tagging entries!\n');
}

main();

