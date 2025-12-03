/**
 * Test Contentstack Credentials
 * Verifies that your API key and management token are valid
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const apiKey = process.env.CONTENTSTACK_STACK_API_KEY;
const managementToken = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
const region = process.env.CONTENTSTACK_REGION || 'NA';

const REGIONS = {
  NA: 'https://api.contentstack.io',
  EU: 'https://eu-api.contentstack.com',
  AZURE_NA: 'https://azure-na-api.contentstack.com',
  AZURE_EU: 'https://azure-eu-api.contentstack.com'
};

const API_BASE = REGIONS[region] || REGIONS.NA;

async function testCredentials() {
  console.log('\n🔐 Testing Contentstack Credentials\n');
  console.log('Configuration:');
  console.log(`  Region: ${region}`);
  console.log(`  API Base: ${API_BASE}`);
  console.log(`  API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : '❌ NOT SET'}`);
  console.log(`  Management Token: ${managementToken ? managementToken.substring(0, 10) + '...' : '❌ NOT SET'}`);
  console.log('');

  if (!apiKey || !managementToken) {
    console.error('❌ Missing credentials in .env.local file!');
    console.error('\nYour .env.local should have:');
    console.error('  CONTENTSTACK_STACK_API_KEY=blt...');
    console.error('  CONTENTSTACK_MANAGEMENT_TOKEN=cs...');
    console.error('  CONTENTSTACK_REGION=NA');
    process.exit(1);
  }

  try {
    console.log('Testing API connection...');
    
    const response = await axios({
      method: 'GET',
      url: `${API_BASE}/v3/content_types`,
      headers: {
        'api_key': apiKey,
        'authorization': managementToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Credentials are valid!');
    console.log(`\nFound ${response.data.content_types?.length || 0} existing content types in your stack.`);
    
    if (response.data.content_types && response.data.content_types.length > 0) {
      console.log('\nExisting content types:');
      response.data.content_types.forEach(ct => {
        console.log(`  - ${ct.title} (${ct.uid})`);
      });
    }

    console.log('\n✅ Ready to run Phase 1 setup!\n');
    console.log('Run: npm run cs:phase1\n');

  } catch (error) {
    console.error('\n❌ Credential test failed!\n');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 401) {
        console.error('\n💡 This means your management token is invalid or expired.');
        console.error('   Go to Contentstack → Settings → Tokens → Management Tokens');
        console.error('   Generate a new token and update CONTENTSTACK_MANAGEMENT_TOKEN in .env.local');
      } else if (error.response.status === 403) {
        console.error('\n💡 This means your token doesn\'t have sufficient permissions.');
        console.error('   Ensure your management token has "Content Management" permissions.');
      }
    } else {
      console.error(`Error: ${error.message}`);
    }
    
    process.exit(1);
  }
}

testCredentials();

