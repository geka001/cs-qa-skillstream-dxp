#!/usr/bin/env node

/**
 * Tag Existing Contentstack Entries with Taxonomy Terms
 * Updates qa_module, sop, and qa_tool entries with appropriate taxonomy tags
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

// Mapping rules for automatic taxonomy tagging
const TAXONOMY_MAPPINGS = {
  // Map module IDs to taxonomy terms
  modules: {
    'mod-rookie-001': {
      qa_skills_taxonomy: ['manual_testing', 'test_case_design'],
      learning_path_taxonomy: ['fundamentals'],
      difficulty_taxonomy: ['beginner'],
      segment_taxonomy: ['rookie']
    },
    'mod-rookie-002': {
      qa_skills_taxonomy: ['defect_management', 'bug_reporting', 'jira_workflow'],
      learning_path_taxonomy: ['fundamentals'],
      difficulty_taxonomy: ['beginner'],
      segment_taxonomy: ['rookie']
    },
    'mod-rookie-003': {
      qa_skills_taxonomy: ['automation_testing', 'selenium'],
      learning_path_taxonomy: ['fundamentals', 'intermediate'],
      difficulty_taxonomy: ['beginner'],
      segment_taxonomy: ['rookie']
    },
    'mod-rookie-004': {
      qa_skills_taxonomy: ['api_testing', 'rest_api', 'postman'],
      learning_path_taxonomy: ['intermediate'],
      difficulty_taxonomy: ['intermediate'],
      segment_taxonomy: ['rookie']
    },
    'mod-remedial-001': {
      qa_skills_taxonomy: ['manual_testing', 'test_case_design'],
      learning_path_taxonomy: ['remedial', 'fundamentals'],
      difficulty_taxonomy: ['beginner'],
      segment_taxonomy: ['at_risk']
    },
    'mod-remedial-002': {
      qa_skills_taxonomy: ['defect_management', 'bug_reporting'],
      learning_path_taxonomy: ['remedial'],
      difficulty_taxonomy: ['beginner'],
      segment_taxonomy: ['at_risk']
    },
    'mod-remedial-003': {
      qa_skills_taxonomy: ['manual_testing', 'jira_workflow'],
      learning_path_taxonomy: ['remedial'],
      difficulty_taxonomy: ['beginner'],
      segment_taxonomy: ['at_risk']
    },
    'mod-highflyer-001': {
      qa_skills_taxonomy: ['automation_testing', 'cypress', 'playwright'],
      learning_path_taxonomy: ['advanced'],
      difficulty_taxonomy: ['advanced'],
      segment_taxonomy: ['high_flyer']
    },
    'mod-highflyer-002': {
      qa_skills_taxonomy: ['api_testing', 'rest_api', 'graphql'],
      learning_path_taxonomy: ['advanced'],
      difficulty_taxonomy: ['advanced'],
      segment_taxonomy: ['high_flyer']
    },
    'mod-highflyer-003': {
      qa_skills_taxonomy: ['performance_testing', 'load_testing', 'jmeter'],
      learning_path_taxonomy: ['advanced', 'expert'],
      difficulty_taxonomy: ['advanced'],
      segment_taxonomy: ['high_flyer']
    }
  },

  sops: {
    'sop-001': {
      skills_taxonomy: ['defect_management', 'bug_reporting'],
      segment_taxonomy: ['rookie', 'at_risk', 'high_flyer']
    },
    'sop-002': {
      skills_taxonomy: ['manual_testing', 'regression_testing'],
      segment_taxonomy: ['rookie', 'at_risk', 'high_flyer']
    }
  },

  tools: {
    'tool-001': {
      tool_category_taxonomy: ['test_management', 'jira'],
      segment_taxonomy: ['rookie', 'at_risk', 'high_flyer']
    },
    'tool-002': {
      tool_category_taxonomy: ['api_tools', 'postman_api'],
      segment_taxonomy: ['rookie', 'at_risk', 'high_flyer']
    },
    'tool-003': {
      tool_category_taxonomy: ['test_management', 'testrail'],
      segment_taxonomy: ['rookie', 'at_risk', 'high_flyer']
    },
    'tool-004': {
      tool_category_taxonomy: ['automation_frameworks', 'selenium_webdriver'],
      segment_taxonomy: ['rookie', 'high_flyer']
    },
    'tool-005': {
      tool_category_taxonomy: ['automation_frameworks', 'cypress_io'],
      segment_taxonomy: ['high_flyer']
    }
  }
};

async function getAllEntries(contentTypeUid) {
  try {
    const result = await makeRequest('GET', `/content_types/${contentTypeUid}/entries?include_count=true`);
    return result.entries || [];
  } catch (error) {
    console.error(`❌ Error fetching entries for ${contentTypeUid}:`, error.message);
    return [];
  }
}

async function updateEntry(contentTypeUid, entryUid, updateData) {
  try {
    // Get current entry
    const result = await makeRequest('GET', `/content_types/${contentTypeUid}/entries/${entryUid}`);
    const entry = result.entry;

    // Merge taxonomy data
    const updatedEntry = {
      ...entry,
      ...updateData
    };

    // Update entry
    await makeRequest('PUT', `/content_types/${contentTypeUid}/entries/${entryUid}`, {
      entry: updatedEntry
    });

    return true;
  } catch (error) {
    console.error(`❌ Error updating entry ${entryUid}:`, error.message);
    return false;
  }
}

async function tagEntries() {
  let totalTagged = 0;

  // Tag modules
  console.log('\n📚 Tagging Modules...\n');
  const modules = await getAllEntries('qa_module');
  
  for (const module of modules) {
    const moduleId = module.module_id;
    const taxonomyData = TAXONOMY_MAPPINGS.modules[moduleId];
    
    if (taxonomyData) {
      const success = await updateEntry('qa_module', module.uid, taxonomyData);
      if (success) {
        console.log(`✅ Tagged: ${module.title}`);
        totalTagged++;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`⚠️  No taxonomy mapping for: ${moduleId}`);
    }
  }

  // Tag SOPs
  console.log('\n📋 Tagging SOPs...\n');
  const sops = await getAllEntries('sop');
  
  for (const sop of sops) {
    const sopId = sop.sop_id || sop.uid;
    const taxonomyData = TAXONOMY_MAPPINGS.sops[sopId];
    
    if (taxonomyData) {
      const success = await updateEntry('sop', sop.uid, taxonomyData);
      if (success) {
        console.log(`✅ Tagged: ${sop.title}`);
        totalTagged++;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Tag Tools
  console.log('\n🔧 Tagging Tools...\n');
  const tools = await getAllEntries('qa_tool');
  
  for (const tool of tools) {
    const toolId = tool.tool_id;
    const taxonomyData = TAXONOMY_MAPPINGS.tools[toolId];
    
    if (taxonomyData) {
      const success = await updateEntry('qa_tool', tool.uid, taxonomyData);
      if (success) {
        console.log(`✅ Tagged: ${tool.name}`);
        totalTagged++;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return totalTagged;
}

async function main() {
  console.log('🏷️  TAG ENTRIES WITH TAXONOMY TERMS\n');
  console.log('Region:', CONFIG.region);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    const totalTagged = await tagEntries();

    console.log('\n✨ TAGGING COMPLETE!\n');
    console.log('Summary:');
    console.log(`  ✅ Total Entries Tagged: ${totalTagged}`);
    console.log('\n📝 Next Steps:');
    console.log('  1. Verify entries in Contentstack UI');
    console.log('  2. Update application to query by taxonomy');
    console.log('  3. Implement taxonomy-based filtering in UI');
    console.log('\n🔗 Contentstack Dashboard:');
    console.log(`  https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/entries\n`);

  } catch (error) {
    console.error('\n❌ Tagging failed:', error.message);
    process.exit(1);
  }
}

main();

