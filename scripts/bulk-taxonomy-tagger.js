// Bulk Taxonomy Tagger for QA Training Modules
// This script uses Contentstack Management SDK to tag all training modules with taxonomies

const contentstack = require('@contentstack/management');

// Configuration
const STACK_API_KEY = process.env.CS_API_KEY || 'YOUR_API_KEY_HERE';
const MANAGEMENT_TOKEN = process.env.CS_MANAGEMENT_TOKEN || 'YOUR_MANAGEMENT_TOKEN_HERE';
const BRANCH = 'main';
const CONTENT_TYPE_UID = 'qa_training_module';
const LOCALE = 'en-us';
const ENVIRONMENT = 'dev';

// Module to Taxonomy Mapping
const MODULE_TAXONOMY_MAP = [
  {
    uid: 'blta0422de3287e017b',
    title: 'DAM Advanced Asset Management',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'blt5a56a7f85fb53e6d',
    title: 'AutoDraft Advanced Content Generation',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'blt4eec1c0b7ef3ab42',
    title: 'Visual Builder Advanced Techniques',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'bltf516c7fb65de94e9',
    title: 'Data & Insights Advanced Analytics',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'blt89246703fb190931',
    title: 'Effective Bug Reporting',
    difficulty: 'beginner',
    target_segments: '["ROOKIE", "AT_RISK"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie', 'at_risk']
    }
  },
  {
    uid: 'bltce97a4705dad4af2',
    title: 'Introduction to Test Automation',
    difficulty: 'intermediate',
    target_segments: '["ROOKIE", "HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['rookie', 'high_flyer']
    }
  },
  {
    uid: 'bltbd110fb0e89ede58',
    title: 'AutoDraft AI Content Generation',
    difficulty: 'beginner',
    target_segments: '["ROOKIE"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie']
    }
  },
  {
    uid: 'bltb55135982e4662ed',
    title: 'Getting Started with Data & Insights',
    difficulty: 'beginner',
    target_segments: '["ROOKIE"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie']
    }
  },
  {
    uid: 'bltef5a9e2ea37d27a9',
    title: 'CI/CD for QA Engineers',
    difficulty: 'advanced',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['advanced'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'blt5c7072f231080039',
    title: 'Remedial Testing Fundamentals',
    difficulty: 'beginner',
    target_segments: '["AT_RISK"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['at_risk']
    }
  },
  {
    uid: 'bltaa0906a400bad173',
    title: 'Performance Testing Essentials',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'bltaa011bad732bdc92',
    title: 'Understanding Test Coverage',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'blt25efa166fab8cd74',
    title: 'Introduction to Contentstack Launch',
    difficulty: 'beginner',
    target_segments: '["ROOKIE"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie']
    }
  },
  {
    uid: 'blt10e699b314a0a311',
    title: 'Advanced Automation with Playwright',
    difficulty: 'advanced',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['advanced'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'bltf6a9d30c48b8c7d2',
    title: 'Test Strategy and Planning',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'bltb26ef099037ee104',
    title: 'Advanced Launch Personalization',
    difficulty: 'intermediate',
    target_segments: '["HIGH_FLYER"]',
    taxonomies: {
      skill_level: ['intermediate'],
      user_segment: ['high_flyer']
    }
  },
  {
    uid: 'blt92bcab4daaffbe7b',
    title: 'QA Tools Overview',
    difficulty: 'beginner',
    target_segments: '["ROOKIE"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie']
    }
  },
  {
    uid: 'blt8a6fc4a91658c84e',
    title: 'API Testing Fundamentals',
    difficulty: 'beginner',
    target_segments: '["ROOKIE", "AT_RISK"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie', 'at_risk']
    }
  },
  {
    uid: 'bltd069d3450c3975ea',
    title: 'Digital Asset Management Basics',
    difficulty: 'beginner',
    target_segments: '["ROOKIE"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie']
    }
  },
  {
    uid: 'bltdc0b90e604cc7374',
    title: 'Visual Builder Fundamentals',
    difficulty: 'beginner',
    target_segments: '["ROOKIE"]',
    taxonomies: {
      skill_level: ['beginner'],
      user_segment: ['rookie']
    }
  }
];

// Initialize Contentstack client
async function initializeClient() {
  const client = contentstack.client();
  await client.login({ email: process.env.CS_EMAIL, password: process.env.CS_PASSWORD });
  return client;
}

// Tag a single entry
async function tagEntry(stack, moduleData) {
  try {
    console.log(`\nTagging: ${moduleData.title} (${moduleData.uid})`);
    
    const entry = await stack.contentType(CONTENT_TYPE_UID)
      .entry(moduleData.uid)
      .fetch({ locale: LOCALE });
    
    // Update with taxonomies
    entry.taxonomies = moduleData.taxonomies;
    
    await entry.update({ locale: LOCALE });
    console.log(`✅ Successfully tagged: ${moduleData.title}`);
    
    // Publish to dev environment
    await entry.publish({
      publishDetails: {
        environments: [ENVIRONMENT],
        locales: [LOCALE]
      },
      locale: LOCALE
    });
    console.log(`✅ Published to ${ENVIRONMENT}: ${moduleData.title}`);
    
    return { success: true, module: moduleData.title };
  } catch (error) {
    console.error(`❌ Failed to tag ${moduleData.title}:`, error.message);
    return { success: false, module: moduleData.title, error: error.message };
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting Bulk Taxonomy Tagging...\n');
    console.log(`Stack API Key: ${STACK_API_KEY.substring(0, 10)}...`);
    console.log(`Content Type: ${CONTENT_TYPE_UID}`);
    console.log(`Total Modules: ${MODULE_TAXONOMY_MAP.length}\n`);
    
    const client = await initializeClient();
    const stack = client.stack({ api_key: STACK_API_KEY, management_token: MANAGEMENT_TOKEN, branch_uid: BRANCH });
    
    const results = [];
    
    // Process each module
    for (const moduleData of MODULE_TAXONOMY_MAP) {
      const result = await tagEntry(stack, moduleData);
      results.push(result);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TAGGING SUMMARY');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Successfully tagged: ${successful}/${MODULE_TAXONOMY_MAP.length}`);
    console.log(`❌ Failed: ${failed}/${MODULE_TAXONOMY_MAP.length}`);
    
    if (failed > 0) {
      console.log('\n❌ Failed modules:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.module}: ${r.error}`);
      });
    }
    
    console.log('\n✅ Bulk tagging complete!');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { tagEntry, MODULE_TAXONOMY_MAP };

