require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const API_KEY = process.env.CONTENTSTACK_STACK_API_KEY;
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
const API_BASE = 'https://api.contentstack.io'; // Fixed: Always use .io for NA region

console.log('\n🧪 Testing Contentstack User Creation\n');
console.log('Config:', {
  apiKey: API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET',
  token: MANAGEMENT_TOKEN ? MANAGEMENT_TOKEN.substring(0, 10) + '...' : 'NOT SET',
  apiBase: API_BASE
});

async function testCreateUser() {
  try {
    const userId = 'Direct_Test_User_Launch';
    const entryData = {
      entry: {
        title: 'Direct Test User',
        user_id: userId,
        name: 'Direct Test User',
        email: '',
        team: 'Launch',
        role: 'QA Engineer',
        segment: 'ROOKIE',
        join_date: new Date().toISOString(),
        completed_modules: '[]',
        quiz_scores: '{}',
        module_progress: '{}',
        completed_sops: '[]',
        explored_tools: '[]',
        time_spent: 0,
        interventions_received: 0,
        onboarding_complete: false,
        onboarding_completed_date: '',
        segment_history: '[]',
        last_activity: new Date().toISOString()
      }
    };

    console.log('\n📦 Creating user entry...');
    console.log('Entry data:', JSON.stringify(entryData, null, 2));

    const response = await axios.post(
      `${API_BASE}/v3/content_types/qa_user/entries`,
      entryData,
      {
        headers: {
          api_key: API_KEY,
          authorization: MANAGEMENT_TOKEN,
          'Content-Type': 'application/json'
        },
        params: {
          locale: 'en-us'
        }
      }
    );

    console.log('\n✅ User entry created successfully!');
    console.log('Entry UID:', response.data.entry.uid);
    console.log('Title:', response.data.entry.title);

    // Auto-publish
    const entryUid = response.data.entry.uid;
    console.log('\n📤 Publishing entry...');
    
    await axios.post(
      `${API_BASE}/v3/content_types/qa_user/entries/${entryUid}/publish`,
      {
        entry: {
          environments: ['dev'],
          locales: ['en-us']
        }
      },
      {
        headers: {
          api_key: API_KEY,
          authorization: MANAGEMENT_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Entry published to dev environment!');
    console.log('\n🎉 SUCCESS! Check Contentstack UI for the entry.');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testCreateUser();

