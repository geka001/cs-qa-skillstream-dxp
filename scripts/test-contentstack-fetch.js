/**
 * Test Contentstack Data Fetching
 * Tests if we can fetch Tools and SOPs from Contentstack
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY,
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
  region: (process.env.CONTENTSTACK_REGION || 'NA').toUpperCase()
};

const REGIONS = {
  NA: 'https://cdn.contentstack.io',
  EU: 'https://eu-cdn.contentstack.com',
  AZURE_NA: 'https://azure-na-cdn.contentstack.com',
  AZURE_EU: 'https://azure-eu-cdn.contentstack.com'
};

const API_BASE = REGIONS[CONFIG.region] || REGIONS.NA;

async function testFetch(contentTypeUid, name) {
  console.log(`\n🔍 Testing ${name} (${contentTypeUid})...`);
  
  try {
    const url = `${API_BASE}/v3/content_types/${contentTypeUid}/entries`;
    console.log(`   URL: ${url}`);
    console.log(`   Environment: ${CONFIG.environment}`);
    
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'api_key': CONFIG.apiKey,
        'access_token': CONFIG.deliveryToken,
        'Content-Type': 'application/json'
      },
      params: {
        environment: CONFIG.environment
      }
    });

    const count = response.data.entries?.length || 0;
    console.log(`   ✅ Success! Found ${count} entries`);
    
    if (count > 0) {
      console.log(`   First entry:`, JSON.stringify(response.data.entries[0], null, 2).substring(0, 500));
    }
    
    return response.data.entries || [];
  } catch (error) {
    console.log(`   ❌ Error:`, error.response?.data || error.message);
    return [];
  }
}

async function main() {
  console.log('\n🧪 Testing Contentstack Data Fetching\n');
  console.log('Configuration:');
  console.log(`  API Base: ${API_BASE}`);
  console.log(`  Region: ${CONFIG.region}`);
  console.log(`  Environment: ${CONFIG.environment}`);
  console.log(`  API Key: ${CONFIG.apiKey ? CONFIG.apiKey.substring(0, 10) + '...' : 'NOT SET'}`);
  console.log(`  Delivery Token: ${CONFIG.deliveryToken ? CONFIG.deliveryToken.substring(0, 10) + '...' : 'NOT SET'}`);

  // Test each content type
  await testFetch('qa_tool', 'QA Tools');
  await testFetch('qa_sop', 'QA SOPs');
  await testFetch('manager_config', 'Manager Configs');
  await testFetch('quiz_item', 'Quiz Items');
  await testFetch('qa_training_module', 'Training Modules');

  console.log('\n✅ Test complete!\n');
}

main();

