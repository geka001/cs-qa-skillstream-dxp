require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const API_KEY = process.env.CONTENTSTACK_STACK_API_KEY;
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
const API_BASE = 'https://api.contentstack.io';

async function checkAllContentTypes() {
  const contentTypes = [
    { uid: 'manager_config', name: 'Manager Configs', idField: 'team' },
    { uid: 'qa_tool', name: 'QA Tools', idField: 'tool_id' },
    { uid: 'qa_sop', name: 'QA SOPs', idField: 'sop_id' },
    { uid: 'quiz_item', name: 'Quiz Items', idField: 'quiz_id' },
    { uid: 'qa_training_module', name: 'Training Modules', idField: 'module_id' }
  ];

  console.log('\n🔍 VERIFYING ALL CONTENTSTACK ENTRIES\n');

  for (const ct of contentTypes) {
    try {
      const response = await axios.get(`${API_BASE}/v3/content_types/${ct.uid}/entries`, {
        headers: {
          api_key: API_KEY,
          authorization: MANAGEMENT_TOKEN,
        },
        params: {
          limit: 100,
          include_count: true
        }
      });
      
      const entries = response.data.entries;
      const publishedCount = entries.filter(e => e.publish_details).length;
      
      console.log('='.repeat(70));
      console.log(`📦 ${ct.name.toUpperCase()} (${ct.uid})`);
      console.log('='.repeat(70));
      console.log(`Total Entries: ${entries.length}`);
      console.log(`Published: ${publishedCount} | Draft: ${entries.length - publishedCount}`);
      console.log(`\nAll entries:`);
      
      entries.forEach((entry, index) => {
        const title = entry.title || entry.name || entry.question || 'Untitled';
        const id = entry[ct.idField] || entry.uid;
        const published = entry.publish_details ? '✅ Published' : '⏳ Draft';
        console.log(`  ${index + 1}. [${published}] ${title}`);
        console.log(`     ID: ${id}`);
      });
      
      console.log('\n');
    } catch (error) {
      console.error(`❌ Error fetching ${ct.name}:`, error.response?.data || error.message);
    }
  }
}

checkAllContentTypes();

