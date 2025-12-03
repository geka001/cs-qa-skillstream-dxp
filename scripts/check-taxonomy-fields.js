/**
 * Check if taxonomy fields exist in entries
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

async function checkTaxonomyFields() {
  console.log('\n🔍 Checking Taxonomy Fields in Entries\n');

  try {
    // Fetch one module entry
    const response = await axios({
      method: 'GET',
      url: `${API_BASE}/v3/content_types/qa_training_module/entries`,
      headers: {
        'api_key': CONFIG.apiKey,
        'access_token': CONFIG.deliveryToken,
      },
      params: {
        environment: CONFIG.environment,
        limit: 1
      }
    });

    if (response.data.entries && response.data.entries.length > 0) {
      const entry = response.data.entries[0];
      console.log('📋 Sample Module Entry Structure:\n');
      console.log(JSON.stringify(entry, null, 2));
      
      console.log('\n\n🔍 Checking for Taxonomy Fields:\n');
      
      const taxonomyFields = [
        'skill_level',
        'category',
        'segment',
        'team',
        'skill_level_taxonomy',
        'category_taxonomy',
        'segment_taxonomy',
        'team_taxonomy',
        'taxonomy'
      ];
      
      taxonomyFields.forEach(field => {
        if (entry.hasOwnProperty(field)) {
          console.log(`  ✅ ${field}: ${JSON.stringify(entry[field])}`);
        } else {
          console.log(`  ❌ ${field}: NOT FOUND`);
        }
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

checkTaxonomyFields();

