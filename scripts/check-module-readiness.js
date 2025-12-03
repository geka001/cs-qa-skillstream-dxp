require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const API_KEY = process.env.CONTENTSTACK_STACK_API_KEY;
const DELIVERY_TOKEN = process.env.CONTENTSTACK_DELIVERY_TOKEN;
const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || 'dev';
const API_BASE = 'https://cdn.contentstack.io';

console.log('\n🔍 Checking Contentstack Readiness for Module Migration\n');

async function checkContentstackStatus() {
  try {
    // Check Training Modules
    console.log('📦 Checking Training Modules...');
    const modulesResponse = await axios.get(
      `${API_BASE}/v3/content_types/qa_training_module/entries`,
      {
        headers: {
          api_key: API_KEY,
          access_token: DELIVERY_TOKEN,
        },
        params: {
          environment: ENVIRONMENT,
        },
      }
    );
    
    const modules = modulesResponse.data.entries || [];
    const publishedModules = modules.length;
    
    console.log(`✅ Found ${publishedModules} published training modules`);
    
    if (publishedModules > 0) {
      console.log('\nSample module:');
      console.log(JSON.stringify(modules[0], null, 2));
    }
    
    // Check Quiz Items
    console.log('\n📦 Checking Quiz Items...');
    const quizResponse = await axios.get(
      `${API_BASE}/v3/content_types/quiz_item/entries`,
      {
        headers: {
          api_key: API_KEY,
          access_token: DELIVERY_TOKEN,
        },
        params: {
          environment: ENVIRONMENT,
        },
      }
    );
    
    const quizItems = quizResponse.data.entries || [];
    const publishedQuizItems = quizItems.length;
    
    console.log(`✅ Found ${publishedQuizItems} published quiz items`);
    
    if (publishedQuizItems > 0) {
      console.log('\nSample quiz item:');
      console.log(JSON.stringify(quizItems[0], null, 2));
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION READINESS SUMMARY');
    console.log('='.repeat(60));
    
    const modulesReady = publishedModules >= 10; // At least 10 modules to be useful
    const quizReady = publishedQuizItems >= 20; // At least 20 quiz items to be useful
    
    console.log(`\n🎯 Training Modules: ${publishedModules}/60 expected`);
    console.log(`   Status: ${modulesReady ? '✅ READY' : '⏳ NOT READY (need at least 10)'}`);
    
    console.log(`\n🎯 Quiz Items: ${publishedQuizItems}/150 expected`);
    console.log(`   Status: ${quizReady ? '✅ READY' : '⏳ NOT READY (need at least 20)'}`);
    
    console.log('\n' + '='.repeat(60));
    
    if (modulesReady) {
      console.log('\n✅ MODULES ARE READY FOR MIGRATION!');
      console.log('   Run: npm run migrate:modules');
    } else {
      console.log('\n⏳ NOT READY YET');
      console.log(`   Need ${10 - publishedModules} more modules to start migration`);
      console.log('   Ask MCP to continue creating entries');
    }
    
    if (quizReady) {
      console.log('\n✅ QUIZ ITEMS ARE READY FOR MIGRATION!');
    } else {
      console.log(`\n⏳ Quiz items not ready (${publishedQuizItems}/20 minimum)`);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    console.error('\nMake sure:');
    console.error('1. CONTENTSTACK_STACK_API_KEY is set');
    console.error('2. CONTENTSTACK_DELIVERY_TOKEN is set');
    console.error('3. Entries are published to dev environment');
  }
}

checkContentstackStatus();


