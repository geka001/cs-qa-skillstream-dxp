#!/usr/bin/env node

/**
 * Contentstack Taxonomy Setup Script
 * Creates taxonomies for QA SkillStream DXP
 */

const https = require('https');

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY || 'blt8202119c48319b1d',
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || 'cs911496f76cbfb543bb764ae7',
  region: 'na',
  apiHost: 'api.contentstack.io'
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      hostname: CONFIG.apiHost,
      port: 443,
      path: `/v3${path}`,
      headers: {
        'Content-Type': 'application/json',
        'api_key': CONFIG.apiKey,
        'authorization': CONFIG.managementToken
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error (${res.statusCode}): ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${body}`));
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Taxonomy definitions
const TAXONOMIES = {
  qa_skills: {
    taxonomy: {
      uid: 'qa_skills',
      name: 'QA Skills',
      description: 'Quality Assurance skills and competencies taxonomy',
      terms: [
        {
          uid: 'manual_testing',
          name: 'Manual Testing',
          children: [
            { uid: 'test_case_design', name: 'Test Case Design' },
            { uid: 'exploratory_testing', name: 'Exploratory Testing' },
            { uid: 'regression_testing', name: 'Regression Testing' }
          ]
        },
        {
          uid: 'automation_testing',
          name: 'Automation Testing',
          children: [
            { uid: 'selenium', name: 'Selenium' },
            { uid: 'cypress', name: 'Cypress' },
            { uid: 'playwright', name: 'Playwright' }
          ]
        },
        {
          uid: 'api_testing',
          name: 'API Testing',
          children: [
            { uid: 'rest_api', name: 'REST API' },
            { uid: 'graphql', name: 'GraphQL' },
            { uid: 'postman', name: 'Postman' }
          ]
        },
        {
          uid: 'performance_testing',
          name: 'Performance Testing',
          children: [
            { uid: 'load_testing', name: 'Load Testing' },
            { uid: 'stress_testing', name: 'Stress Testing' },
            { uid: 'jmeter', name: 'JMeter' }
          ]
        },
        {
          uid: 'defect_management',
          name: 'Defect Management',
          children: [
            { uid: 'bug_reporting', name: 'Bug Reporting' },
            { uid: 'jira_workflow', name: 'Jira Workflow' },
            { uid: 'severity_priority', name: 'Severity & Priority' }
          ]
        }
      ]
    }
  },

  learning_paths: {
    taxonomy: {
      uid: 'learning_paths',
      name: 'Learning Paths',
      description: 'Structured learning progression taxonomy',
      terms: [
        { uid: 'fundamentals', name: 'Fundamentals' },
        { uid: 'intermediate', name: 'Intermediate Concepts' },
        { uid: 'advanced', name: 'Advanced Topics' },
        { uid: 'remedial', name: 'Remedial Content' },
        { uid: 'expert', name: 'Expert Certifications' }
      ]
    }
  },

  tool_categories: {
    taxonomy: {
      uid: 'tool_categories',
      name: 'Tool Categories',
      description: 'QA tools and technologies taxonomy',
      terms: [
        {
          uid: 'test_management',
          name: 'Test Management',
          children: [
            { uid: 'jira', name: 'Jira' },
            { uid: 'testrail', name: 'TestRail' },
            { uid: 'zephyr', name: 'Zephyr' }
          ]
        },
        {
          uid: 'automation_frameworks',
          name: 'Automation Frameworks',
          children: [
            { uid: 'selenium_webdriver', name: 'Selenium WebDriver' },
            { uid: 'cypress_io', name: 'Cypress.io' },
            { uid: 'playwright_fw', name: 'Playwright' }
          ]
        },
        {
          uid: 'api_tools',
          name: 'API Testing Tools',
          children: [
            { uid: 'postman_api', name: 'Postman' },
            { uid: 'rest_assured', name: 'REST Assured' },
            { uid: 'soapui', name: 'SoapUI' }
          ]
        },
        {
          uid: 'performance_tools',
          name: 'Performance Tools',
          children: [
            { uid: 'jmeter_perf', name: 'JMeter' },
            { uid: 'gatling', name: 'Gatling' },
            { uid: 'loadrunner', name: 'LoadRunner' }
          ]
        }
      ]
    }
  },

  difficulty_levels: {
    taxonomy: {
      uid: 'difficulty_levels',
      name: 'Difficulty Levels',
      description: 'Content difficulty classification',
      terms: [
        { uid: 'beginner', name: 'Beginner' },
        { uid: 'intermediate', name: 'Intermediate' },
        { uid: 'advanced', name: 'Advanced' },
        { uid: 'expert', name: 'Expert' }
      ]
    }
  },

  user_segments: {
    taxonomy: {
      uid: 'user_segments',
      name: 'User Segments',
      description: 'Learner segmentation taxonomy',
      terms: [
        { uid: 'rookie', name: 'ROOKIE', description: 'New QA professionals' },
        { uid: 'at_risk', name: 'AT_RISK', description: 'Learners needing support' },
        { uid: 'high_flyer', name: 'HIGH_FLYER', description: 'Advanced learners' }
      ]
    }
  }
};

async function createTaxonomy(taxonomyData) {
  try {
    // Check if taxonomy already exists
    try {
      const existing = await makeRequest('GET', `/taxonomies/${taxonomyData.taxonomy.uid}`);
      if (existing && existing.taxonomy) {
        console.log(`ℹ️  Taxonomy already exists: ${taxonomyData.taxonomy.name}`);
        return existing.taxonomy;
      }
    } catch (error) {
      // Taxonomy doesn't exist, proceed to create
    }

    const result = await makeRequest('POST', '/taxonomies', taxonomyData);
    console.log(`✅ Created taxonomy: ${taxonomyData.taxonomy.name} (${taxonomyData.taxonomy.uid})`);
    return result.taxonomy;
  } catch (error) {
    console.error(`❌ Error creating taxonomy ${taxonomyData.taxonomy.name}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🏷️  CONTENTSTACK TAXONOMY SETUP\n');
  console.log('Region:', CONFIG.region);
  console.log('Environment:', process.env.CONTENTSTACK_ENVIRONMENT || 'dev');
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    console.log('📋 STEP 1: Creating Taxonomies\n');

    // Create all taxonomies
    for (const [key, taxonomyData] of Object.entries(TAXONOMIES)) {
      await createTaxonomy(taxonomyData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }

    console.log('\n✨ TAXONOMY SETUP COMPLETE!\n');
    console.log('Summary:');
    console.log(`  ✅ Taxonomies Created: ${Object.keys(TAXONOMIES).length}`);
    console.log('\n📊 Taxonomies:');
    console.log('  • QA Skills (manual, automation, API, performance, defect mgmt)');
    console.log('  • Learning Paths (fundamentals, intermediate, advanced, remedial, expert)');
    console.log('  • Tool Categories (test mgmt, automation, API, performance)');
    console.log('  • Difficulty Levels (beginner, intermediate, advanced, expert)');
    console.log('  • User Segments (ROOKIE, AT_RISK, HIGH_FLYER)');
    console.log('\n📝 Next Steps:');
    console.log('  1. Go to Contentstack UI → Settings → Taxonomies');
    console.log('  2. Verify all taxonomies are created');
    console.log('  3. Run taxonomy-update-content-types.js to add taxonomy fields');
    console.log('  4. Update entries with taxonomy terms');
    console.log('\n🔗 Contentstack Dashboard:');
    console.log(`  https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/taxonomies\n`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();

