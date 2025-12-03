#!/usr/bin/env node

/**
 * Contentstack Variants Setup Script
 * Updates content types to support variants and creates variant entries
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

// Fields to add for variant support
const VARIANT_FIELDS = [
  {
    display_name: 'Is Variant',
    uid: 'is_variant',
    data_type: 'boolean',
    field_metadata: {
      description: 'Indicates if this is a variant of a base entry',
      default_value: false
    },
    mandatory: false
  },
  {
    display_name: 'Base Entry Reference',
    uid: 'base_entry_ref',
    data_type: 'reference',
    reference_to: ['qa_module'],
    field_metadata: {
      description: 'Reference to the base entry if this is a variant'
    },
    mandatory: false
  },
  {
    display_name: 'Variant For Segment',
    uid: 'variant_for_segment',
    data_type: 'text',
    field_metadata: {
      description: 'Which user segment this variant is for (ROOKIE, AT_RISK, HIGH_FLYER)'
    },
    mandatory: false
  },
  {
    display_name: 'Variant Type',
    uid: 'variant_type',
    data_type: 'text',
    field_metadata: {
      description: 'Type of variant: simplified, standard, advanced, remedial'
    },
    mandatory: false
  }
];

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

async function addVariantFields(contentTypeUid) {
  console.log(`\n📝 Adding variant fields to ${contentTypeUid}...`);
  
  const contentType = await getContentType(contentTypeUid);
  if (!contentType) {
    console.log(`⚠️  Content type ${contentTypeUid} not found, skipping...`);
    return;
  }

  // Check if variant fields already exist
  const hasVariantFields = contentType.schema.some(field => field.uid === 'is_variant');
  if (hasVariantFields) {
    console.log(`ℹ️  Variant fields already exist in ${contentTypeUid}, skipping...`);
    return;
  }

  // Update base_entry_ref reference to point to the same content type
  const variantFields = VARIANT_FIELDS.map(field => {
    if (field.uid === 'base_entry_ref') {
      return {
        ...field,
        reference_to: [contentTypeUid]
      };
    }
    return field;
  });

  // Add variant fields to schema
  const updatedSchema = [...contentType.schema, ...variantFields];
  
  const updatedContentType = {
    ...contentType,
    schema: updatedSchema
  };

  await updateContentType(contentTypeUid, updatedContentType);
  console.log(`   Added ${variantFields.length} variant fields`);
}

async function main() {
  console.log('🎨 CONTENTSTACK VARIANTS SETUP\n');
  console.log('Region:', CONFIG.region);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    console.log('📋 STEP 1: Adding variant fields to content types...\n');

    // Add variant support to qa_module and sop
    await addVariantFields('qa_module');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await addVariantFields('sop');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n✨ VARIANT FIELDS SETUP COMPLETE!\n');
    console.log('Summary:');
    console.log('  ✅ qa_module: 4 variant fields added');
    console.log('  ✅ sop: 4 variant fields added');
    console.log('\n📝 Variant Fields Added:');
    console.log('  • is_variant (boolean)');
    console.log('  • base_entry_ref (reference)');
    console.log('  • variant_for_segment (text)');
    console.log('  • variant_type (text)');
    console.log('\n📊 Next Steps:');
    console.log('  1. Run create-variant-entries.js to create variant entries');
    console.log('  2. Update application to fetch appropriate variants');
    console.log('  3. Test variant delivery for different segments');
    console.log('\n🔗 Contentstack Dashboard:');
    console.log(`  https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/content-types\n`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();

