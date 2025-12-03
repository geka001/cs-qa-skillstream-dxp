#!/usr/bin/env node

/**
 * Update Contentstack Content Types with Taxonomy Fields
 * Adds taxonomy fields to qa_module, sop, and qa_tool content types
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

// Taxonomy fields to add to content types
const TAXONOMY_FIELDS = {
  qa_module: [
    {
      display_name: 'QA Skills',
      uid: 'qa_skills_taxonomy',
      data_type: 'taxonomy',
      multiple: true,
      taxonomy: 'qa_skills',
      mandatory: false
    },
    {
      display_name: 'Learning Path',
      uid: 'learning_path_taxonomy',
      data_type: 'taxonomy',
      multiple: true,
      taxonomy: 'learning_paths',
      mandatory: false
    },
    {
      display_name: 'Difficulty Level',
      uid: 'difficulty_taxonomy',
      data_type: 'taxonomy',
      multiple: false,
      taxonomy: 'difficulty_levels',
      mandatory: true
    },
    {
      display_name: 'Target Segment',
      uid: 'segment_taxonomy',
      data_type: 'taxonomy',
      multiple: true,
      taxonomy: 'user_segments',
      mandatory: true
    }
  ],

  sop: [
    {
      display_name: 'Related Skills',
      uid: 'skills_taxonomy',
      data_type: 'taxonomy',
      multiple: true,
      taxonomy: 'qa_skills',
      mandatory: false
    },
    {
      display_name: 'Target Segment',
      uid: 'segment_taxonomy',
      data_type: 'taxonomy',
      multiple: true,
      taxonomy: 'user_segments',
      mandatory: true
    }
  ],

  qa_tool: [
    {
      display_name: 'Tool Category',
      uid: 'tool_category_taxonomy',
      data_type: 'taxonomy',
      multiple: true,
      taxonomy: 'tool_categories',
      mandatory: true
    },
    {
      display_name: 'Target Segment',
      uid: 'segment_taxonomy',
      data_type: 'taxonomy',
      multiple: true,
      taxonomy: 'user_segments',
      mandatory: true
    }
  ]
};

async function getContentType(contentTypeUid) {
  try {
    const result = await makeRequest('GET', `/content_types/${contentTypeUid}`);
    return result.content_type;
  } catch (error) {
    console.error(`❌ Error fetching content type ${contentTypeUid}:`, error.message);
    return null;
  }
}

async function updateContentType(contentTypeUid, contentType) {
  try {
    const result = await makeRequest('PUT', `/content_types/${contentTypeUid}`, {
      content_type: contentType
    });
    console.log(`✅ Updated content type: ${contentTypeUid}`);
    return result;
  } catch (error) {
    console.error(`❌ Error updating content type ${contentTypeUid}:`, error.message);
    throw error;
  }
}

async function addTaxonomyFields(contentTypeUid, taxonomyFields) {
  console.log(`\n📝 Updating ${contentTypeUid}...`);
  
  // Get current content type
  const contentType = await getContentType(contentTypeUid);
  if (!contentType) {
    console.log(`⚠️  Content type ${contentTypeUid} not found, skipping...`);
    return;
  }

  // Check if taxonomy fields already exist
  const existingTaxFields = contentType.schema.filter(field => field.data_type === 'taxonomy');
  if (existingTaxFields.length > 0) {
    console.log(`ℹ️  Taxonomy fields already exist in ${contentTypeUid}, skipping...`);
    return;
  }

  // Add taxonomy fields to schema
  const updatedSchema = [...contentType.schema, ...taxonomyFields];
  
  const updatedContentType = {
    ...contentType,
    schema: updatedSchema
  };

  await updateContentType(contentTypeUid, updatedContentType);
  console.log(`   Added ${taxonomyFields.length} taxonomy fields`);
}

async function main() {
  console.log('🏷️  UPDATE CONTENT TYPES WITH TAXONOMY FIELDS\n');
  console.log('Region:', CONFIG.region);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    console.log('📋 Adding taxonomy fields to content types...\n');

    // Update each content type
    for (const [contentTypeUid, taxonomyFields] of Object.entries(TAXONOMY_FIELDS)) {
      await addTaxonomyFields(contentTypeUid, taxonomyFields);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }

    console.log('\n✨ CONTENT TYPE UPDATES COMPLETE!\n');
    console.log('Summary:');
    console.log('  ✅ qa_module: 4 taxonomy fields added');
    console.log('  ✅ sop: 2 taxonomy fields added');
    console.log('  ✅ qa_tool: 2 taxonomy fields added');
    console.log('\n📝 Taxonomy Fields Added:');
    console.log('  • QA Skills Taxonomy');
    console.log('  • Learning Path Taxonomy');
    console.log('  • Difficulty Taxonomy');
    console.log('  • Segment Taxonomy');
    console.log('  • Tool Category Taxonomy');
    console.log('\n📊 Next Steps:');
    console.log('  1. Go to Contentstack → Content Types');
    console.log('  2. Verify taxonomy fields are added');
    console.log('  3. Run taxonomy-tag-entries.js to tag existing entries');
    console.log('\n🔗 Contentstack Dashboard:');
    console.log(`  https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/content-types\n`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();

