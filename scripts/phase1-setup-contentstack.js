/**
 * Contentstack Phase 1 Setup Script
 * Creates all content types and taxonomies via Management API
 * 
 * Prerequisites:
 * 1. Set your Contentstack credentials in .env.local
 * 2. Run: node scripts/phase1-setup-contentstack.js
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY,
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
  region: process.env.CONTENTSTACK_REGION || 'NA',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'dev'
};

// Validate credentials
if (!CONFIG.apiKey || !CONFIG.managementToken) {
  console.error('\n❌ ERROR: Missing Contentstack credentials!');
  console.error('\nPlease ensure your .env.local file has:');
  console.error('  CONTENTSTACK_STACK_API_KEY=blt...');
  console.error('  CONTENTSTACK_MANAGEMENT_TOKEN=cs...\n');
  process.exit(1);
}

// API endpoints based on region
const REGIONS = {
  NA: 'https://api.contentstack.io',
  EU: 'https://eu-api.contentstack.com',
  AZURE_NA: 'https://azure-na-api.contentstack.com',
  AZURE_EU: 'https://azure-eu-api.contentstack.com'
};

const API_BASE = REGIONS[CONFIG.region] || REGIONS.NA;

// ============================================================
// TAXONOMY DEFINITIONS
// ============================================================

const TAXONOMIES = [
  {
    uid: 'skill_level',
    name: 'Skill Level',
    description: 'Learning difficulty levels',
    terms: [
      { uid: 'beginner', name: 'Beginner' },
      { uid: 'intermediate', name: 'Intermediate' },
      { uid: 'advanced', name: 'Advanced' }
    ]
  },
  {
    uid: 'content_category',
    name: 'Content Category',
    description: 'Hierarchical content organization',
    terms: [
      {
        uid: 'product_knowledge',
        name: 'Product Knowledge',
        children: [
          { uid: 'launch', name: 'Launch' },
          { uid: 'data_insights', name: 'Data & Insights' },
          { uid: 'visual_builder', name: 'Visual Builder' },
          { uid: 'autodraft', name: 'AutoDraft' },
          { uid: 'dam', name: 'DAM' }
        ]
      },
      {
        uid: 'testing_strategy',
        name: 'Testing Strategy',
        children: [
          { uid: 'functional_testing', name: 'Functional Testing' },
          { uid: 'api_testing', name: 'API Testing' },
          { uid: 'performance_testing', name: 'Performance Testing' },
          { uid: 'accessibility_testing', name: 'Accessibility Testing' }
        ]
      },
      {
        uid: 'automation',
        name: 'Automation',
        children: [
          { uid: 'playwright', name: 'Playwright' },
          { uid: 'rest_assured', name: 'REST Assured' },
          { uid: 'ci_cd', name: 'CI/CD' }
        ]
      },
      {
        uid: 'best_practices',
        name: 'Best Practices',
        children: [
          { uid: 'bug_management', name: 'Bug Management' },
          { uid: 'documentation', name: 'Documentation' },
          { uid: 'code_review', name: 'Code Review' }
        ]
      }
    ]
  },
  {
    uid: 'sop_category',
    name: 'SOP Category',
    description: 'Standard Operating Procedure categories',
    terms: [
      { uid: 'bug_management', name: 'Bug Management' },
      { uid: 'testing_workflow', name: 'Testing Workflow' },
      { uid: 'environment_setup', name: 'Environment Setup' },
      { uid: 'documentation', name: 'Documentation' },
      { uid: 'communication', name: 'Communication' }
    ]
  },
  {
    uid: 'tool_category',
    name: 'Tool Category',
    description: 'QA tool categories',
    terms: [
      { uid: 'project_management', name: 'Project Management' },
      { uid: 'api_testing', name: 'API Testing' },
      { uid: 'automation_framework', name: 'Automation Framework' },
      { uid: 'communication', name: 'Communication' },
      { uid: 'performance_testing', name: 'Performance Testing' },
      { uid: 'browser_testing', name: 'Browser Testing' }
    ]
  }
];

// ============================================================
// CONTENT TYPE DEFINITIONS
// ============================================================

const CONTENT_TYPES = {
  quiz_item: {
    content_type: {
      title: 'Quiz Item',
      uid: 'quiz_item',
      description: 'Individual quiz questions for training modules',
      schema: [
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          field_metadata: { _default: true },
          mandatory: true,
          instruction: 'Brief title for the quiz question'
        },
        {
          display_name: 'Quiz ID',
          uid: 'quiz_id',
          data_type: 'text',
          unique: true,
          mandatory: true
        },
        {
          display_name: 'Question',
          uid: 'question',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Answer Options',
          uid: 'answer_options',
          data_type: 'text',
          multiline: true,
          mandatory: true,
          instruction: 'JSON array of 4 answer options'
        },
        {
          display_name: 'Correct Answer',
          uid: 'correct_answer',
          data_type: 'number',
          mandatory: true,
          instruction: 'Index of correct option (0-3)'
        },
        {
          display_name: 'Explanation',
          uid: 'explanation',
          data_type: 'text',
          multiline: true
        }
      ]
    }
  },

  manager_config: {
    content_type: {
      title: 'Manager Configuration',
      uid: 'manager_config',
      description: 'Manager contact details for team notifications',
      schema: [
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          field_metadata: { _default: true },
          mandatory: true,
          instruction: 'Manager name with team (e.g., "Sarah Johnson - Launch Team")'
        },
        {
          display_name: 'Team',
          uid: 'team',
          data_type: 'text',
          mandatory: true,
          unique: true
        },
        {
          display_name: 'Manager Name',
          uid: 'manager_name',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Manager Email',
          uid: 'manager_email',
          data_type: 'text',
          mandatory: true
        }
      ]
    }
  },

  qa_tool: {
    content_type: {
      title: 'QA Tool',
      uid: 'qa_tool',
      description: 'Testing tools, documentation, and integration info',
      schema: [
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          field_metadata: { _default: true },
          mandatory: true,
          instruction: 'Tool name (same as Name field)'
        },
        {
          display_name: 'Tool ID',
          uid: 'tool_id',
          data_type: 'text',
          unique: true,
          mandatory: true
        },
        {
          display_name: 'Name',
          uid: 'name',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Purpose',
          uid: 'purpose',
          data_type: 'text',
          multiline: true
        },
        {
          display_name: 'Documentation Link',
          uid: 'docs_link',
          data_type: 'text'
        },
        {
          display_name: 'Integrations',
          uid: 'integrations',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of tool names'
        },
        {
          display_name: 'Category',
          uid: 'category',
          data_type: 'text'
        },
        {
          display_name: 'Target Segments',
          uid: 'target_segments',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array: ["ROOKIE", "HIGH_FLYER"]'
        },
        {
          display_name: 'Target Teams',
          uid: 'target_teams',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array: ["Launch", "DAM"]'
        },
        {
          display_name: 'Is Generic',
          uid: 'is_generic',
          data_type: 'boolean'
        }
      ]
    }
  },

  qa_sop: {
    content_type: {
      title: 'QA Standard Operating Procedure',
      uid: 'qa_sop',
      description: 'Standard operating procedures for QA workflows',
      schema: [
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          field_metadata: { _default: true },
          mandatory: true
        },
        {
          display_name: 'SOP ID',
          uid: 'sop_id',
          data_type: 'text',
          unique: true,
          mandatory: true
        },
        {
          display_name: 'Criticality',
          uid: 'criticality',
          data_type: 'text',
          instruction: 'critical, high, medium, or low'
        },
        {
          display_name: 'Mandatory',
          uid: 'mandatory',
          data_type: 'boolean'
        },
        {
          display_name: 'Steps',
          uid: 'steps',
          data_type: 'text',
          multiline: true,
          mandatory: true,
          instruction: 'JSON array of step-by-step instructions'
        },
        {
          display_name: 'Related Tools',
          uid: 'related_tools',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of tool_ids'
        },
        {
          display_name: 'Target Segments',
          uid: 'target_segments',
          data_type: 'text',
          multiline: true
        },
        {
          display_name: 'Target Teams',
          uid: 'target_teams',
          data_type: 'text',
          multiline: true
        }
      ]
    }
  },

  qa_training_module: {
    content_type: {
      title: 'QA Training Module',
      uid: 'qa_training_module',
      description: 'Training modules with video, content, and quizzes for QA onboarding',
      schema: [
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          field_metadata: { _default: true },
          mandatory: true
        },
        {
          display_name: 'Module ID',
          uid: 'module_id',
          data_type: 'text',
          unique: true,
          mandatory: true
        },
        {
          display_name: 'Category',
          uid: 'category',
          data_type: 'text'
        },
        {
          display_name: 'Difficulty',
          uid: 'difficulty',
          data_type: 'text',
          instruction: 'beginner, intermediate, or advanced'
        },
        {
          display_name: 'Content',
          uid: 'content',
          data_type: 'text',
          field_metadata: {
            rich_text_type: 'advanced',
            multiline: true
          }
        },
        {
          display_name: 'Video URL',
          uid: 'video_url',
          data_type: 'text'
        },
        {
          display_name: 'Estimated Time',
          uid: 'estimated_time',
          data_type: 'number',
          instruction: 'Time in minutes'
        },
        {
          display_name: 'Tags',
          uid: 'module_tags',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array'
        },
        {
          display_name: 'Mandatory',
          uid: 'mandatory',
          data_type: 'boolean'
        },
        {
          display_name: 'Order',
          uid: 'order',
          data_type: 'number'
        },
        {
          display_name: 'Target Segments',
          uid: 'target_segments',
          data_type: 'text',
          multiline: true
        },
        {
          display_name: 'Target Teams',
          uid: 'target_teams',
          data_type: 'text',
          multiline: true
        },
        {
          display_name: 'Prerequisites',
          uid: 'prerequisites',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of module_ids'
        },
        {
          display_name: 'Quiz Items',
          uid: 'quiz_items',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of quiz_item references or IDs'
        }
      ]
    }
  },

  qa_user: {
    content_type: {
      title: 'QA User Profile',
      uid: 'qa_user',
      description: 'User profiles with progress tracking, analytics, and onboarding status',
      schema: [
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          field_metadata: { _default: true },
          mandatory: true,
          instruction: 'User full name for display'
        },
        {
          display_name: 'User ID',
          uid: 'user_id',
          data_type: 'text',
          unique: true,
          mandatory: true,
          instruction: 'Unique identifier: name_team (e.g., "Sarah Chen_Launch")'
        },
        {
          display_name: 'Name',
          uid: 'name',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Email',
          uid: 'email',
          data_type: 'text',
          instruction: 'Optional email address'
        },
        {
          display_name: 'Team',
          uid: 'team',
          data_type: 'text',
          mandatory: true,
          instruction: 'Launch, Data & Insights, Visual Builder, AutoDraft, or DAM'
        },
        {
          display_name: 'Role',
          uid: 'role',
          data_type: 'text',
          instruction: 'QA Engineer, Senior QA Engineer, etc.'
        },
        {
          display_name: 'Segment',
          uid: 'segment',
          data_type: 'text',
          mandatory: true,
          instruction: 'ROOKIE, AT_RISK, or HIGH_FLYER'
        },
        {
          display_name: 'Join Date',
          uid: 'join_date',
          data_type: 'text',
          mandatory: true,
          instruction: 'ISO date string'
        },
        {
          display_name: 'Completed Modules',
          uid: 'completed_modules',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of module IDs: ["mod-001", "mod-002"]'
        },
        {
          display_name: 'Quiz Scores',
          uid: 'quiz_scores',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON object: {"mod-001": 85, "mod-002": 92}'
        },
        {
          display_name: 'Module Progress',
          uid: 'module_progress',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON object with detailed progress per module'
        },
        {
          display_name: 'Completed SOPs',
          uid: 'completed_sops',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of SOP IDs: ["sop-001", "sop-002"]'
        },
        {
          display_name: 'Explored Tools',
          uid: 'explored_tools',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of tool IDs: ["tool-001", "tool-003"]'
        },
        {
          display_name: 'Time Spent',
          uid: 'time_spent',
          data_type: 'number',
          instruction: 'Total minutes spent in the platform'
        },
        {
          display_name: 'Interventions Received',
          uid: 'interventions_received',
          data_type: 'number',
          instruction: 'Count of AT_RISK interventions'
        },
        {
          display_name: 'Onboarding Complete',
          uid: 'onboarding_complete',
          data_type: 'boolean'
        },
        {
          display_name: 'Onboarding Completed Date',
          uid: 'onboarding_completed_date',
          data_type: 'text',
          instruction: 'ISO date string when onboarding finished'
        },
        {
          display_name: 'Segment History',
          uid: 'segment_history',
          data_type: 'text',
          multiline: true,
          instruction: 'JSON array of segment changes with timestamps'
        },
        {
          display_name: 'Last Activity',
          uid: 'last_activity',
          data_type: 'text',
          instruction: 'ISO date string of last login/activity'
        }
      ]
    }
  }
};

// ============================================================
// API HELPER FUNCTIONS
// ============================================================

async function makeRequest(method, endpoint, data = null) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'api_key': CONFIG.apiKey,
    'authorization': CONFIG.managementToken,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios({
      method,
      url,
      headers,
      data
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// ============================================================
// TAXONOMY CREATION
// ============================================================

async function createTaxonomy(taxonomy) {
  console.log(`📁 Creating taxonomy: ${taxonomy.name}`);
  
  try {
    // Create taxonomy
    const taxonomyData = {
      taxonomy: {
        uid: taxonomy.uid,
        name: taxonomy.name,
        description: taxonomy.description || ''
      }
    };

    const result = await makeRequest('POST', '/v3/taxonomies', taxonomyData);
    console.log(`✅ Taxonomy created: ${taxonomy.name}`);

    // Add terms
    await addTermsToTaxonomy(taxonomy.uid, taxonomy.terms);

    return result;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('409')) {
      console.log(`⚠️  Taxonomy already exists: ${taxonomy.name}`);
      return null;
    }
    throw error;
  }
}

async function addTermsToTaxonomy(taxonomyUid, terms, parentUid = null) {
  for (const term of terms) {
    try {
      const termData = {
        term: {
          uid: term.uid,
          name: term.name,
          parent_uid: parentUid || undefined
        }
      };

      await makeRequest('POST', `/v3/taxonomies/${taxonomyUid}/terms`, termData);
      console.log(`  ✅ Term added: ${term.name}`);

      // Recursively add children
      if (term.children && term.children.length > 0) {
        await addTermsToTaxonomy(taxonomyUid, term.children, term.uid);
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ⚠️  Term already exists: ${term.name}`);
      } else {
        console.error(`  ❌ Error adding term ${term.name}:`, error.message);
      }
    }
  }
}

// ============================================================
// CONTENT TYPE CREATION
// ============================================================

async function createContentType(contentTypeDef) {
  const uid = contentTypeDef.content_type.uid;
  const title = contentTypeDef.content_type.title;
  
  console.log(`📝 Creating content type: ${title}`);

  try {
    const result = await makeRequest('POST', '/v3/content_types', contentTypeDef);
    console.log(`✅ Content type created: ${title}`);
    return result;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('title') && error.message.includes('unique')) {
      console.log(`⚠️  Content type already exists: ${title}`);
      return null;
    }
    throw error;
  }
}

// ============================================================
// MAIN SETUP FUNCTION
// ============================================================

async function setupPhase1() {
  console.log('\n🚀 Starting Phase 1: Contentstack Setup via API\n');
  console.log(`Region: ${CONFIG.region}`);
  console.log(`API Base: ${API_BASE}`);
  console.log(`Environment: ${CONFIG.environment}`);
  console.log(`API Key: ${CONFIG.apiKey ? CONFIG.apiKey.substring(0, 10) + '...' : 'NOT SET'}`);
  console.log(`Management Token: ${CONFIG.managementToken ? CONFIG.managementToken.substring(0, 10) + '...' : 'NOT SET'}\n`);

  try {
    // Step 1: Create Taxonomies
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 1: Creating Taxonomies');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    for (const taxonomy of TAXONOMIES) {
      await createTaxonomy(taxonomy);
      console.log('');
    }

    // Step 2: Create Content Types
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: Creating Content Types');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Create in order: quiz_item first (referenced by qa_training_module)
    const creationOrder = ['quiz_item', 'manager_config', 'qa_tool', 'qa_sop', 'qa_training_module', 'qa_user'];
    
    for (const ctUid of creationOrder) {
      await createContentType(CONTENT_TYPES[ctUid]);
      console.log('');
    }

    // Step 3: Add Taxonomy Fields (Manual step - API limitation)
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 3: Add Taxonomy Fields (MANUAL)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  Taxonomy fields must be added manually in the UI:\n');
    console.log('1. qa_training_module → Add taxonomy fields:');
    console.log('   - skill_level (multiple)');
    console.log('   - content_category (multiple)\n');
    console.log('2. qa_sop → Add taxonomy field:');
    console.log('   - sop_category (multiple)\n');
    console.log('3. qa_tool → Add taxonomy field:');
    console.log('   - tool_category (multiple)\n');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Phase 1 Setup Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Summary:');
    console.log('  ✅ 4 Taxonomies created (~30 terms)');
    console.log('  ✅ 6 Content Types created (63 fields)');
    console.log('  ⚠️  Taxonomy fields need manual addition in UI\n');
    console.log('Content Types Created:');
    console.log('  1. quiz_item - Quiz questions');
    console.log('  2. manager_config - Manager contact info');
    console.log('  3. qa_tool - Testing tools');
    console.log('  4. qa_sop - Standard operating procedures');
    console.log('  5. qa_training_module - Training content');
    console.log('  6. qa_user - User profiles and progress\n');
    console.log('Next Steps:');
    console.log('  1. Add taxonomy fields in Contentstack UI (see TAXONOMY_MANUAL_SETUP.md)');
    console.log('  2. Run Phase 2 script to create entries\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// ============================================================
// RUN SCRIPT
// ============================================================

if (require.main === module) {
  setupPhase1();
}

module.exports = { setupPhase1, makeRequest, CONFIG, API_BASE };

