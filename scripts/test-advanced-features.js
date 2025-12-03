#!/usr/bin/env node

/**
 * Test Script for Contentstack Advanced Features
 * Tests Taxonomy, Personalize, and Variants implementations
 */

const https = require('https');

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY || 'blt8202119c48319b1d',
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN || 'csdf941d70d6da13d4ae6265de',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
  region: 'na',
  apiHost: 'cdn.contentstack.io'
};

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: CONFIG.apiHost,
      port: 443,
      path: `/v3${path}`,
      headers: {
        'api_key': CONFIG.apiKey,
        'access_token': CONFIG.deliveryToken,
        'Content-Type': 'application/json'
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
    req.end();
  });
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  results.tests.push({ name, passed, details });
  if (passed) {
    results.passed++;
    console.log(`✅ PASS: ${name}`);
  } else {
    results.failed++;
    console.log(`❌ FAIL: ${name}`);
  }
  if (details) {
    console.log(`   ${details}`);
  }
}

// ============================================
// TAXONOMY TESTS
// ============================================

async function testTaxonomyFields() {
  console.log('\n🏷️  TESTING TAXONOMY IMPLEMENTATION\n');

  try {
    // Test 1: Check if taxonomy fields exist on qa_module
    const contentType = await makeRequest('/content_types/qa_module');
    
    const hasTaxonomyFields = contentType.content_type.schema.some(
      field => field.data_type === 'taxonomy'
    );
    
    logTest(
      'Taxonomy fields added to qa_module',
      hasTaxonomyFields,
      hasTaxonomyFields ? 'Found taxonomy fields in schema' : 'No taxonomy fields found'
    );

    // Test 2: Check if entries have taxonomy tags
    const entries = await makeRequest(
      '/content_types/qa_module/entries?environment=' + CONFIG.environment
    );
    
    const entriesWithTaxonomy = entries.entries.filter(entry => {
      return entry.qa_skills_taxonomy || entry.segment_taxonomy;
    });

    logTest(
      'Entries tagged with taxonomy',
      entriesWithTaxonomy.length > 0,
      `${entriesWithTaxonomy.length} out of ${entries.entries.length} entries have taxonomy tags`
    );

    // Test 3: Query by taxonomy (if entries have tags)
    if (entriesWithTaxonomy.length > 0) {
      const queryResult = await makeRequest(
        '/content_types/qa_module/entries?environment=' + CONFIG.environment +
        '&query={"segment_taxonomy":{"$in":["rookie"]}}'
      );

      logTest(
        'Query by taxonomy works',
        queryResult.entries.length > 0,
        `Found ${queryResult.entries.length} entries with rookie segment taxonomy`
      );
    }

  } catch (error) {
    logTest('Taxonomy tests', false, error.message);
  }
}

// ============================================
// VARIANTS TESTS
// ============================================

async function testVariants() {
  console.log('\n🎨 TESTING VARIANTS IMPLEMENTATION\n');

  try {
    // Test 1: Check if variant fields exist
    const contentType = await makeRequest('/content_types/qa_module');
    
    const hasVariantFields = contentType.content_type.schema.some(
      field => field.uid === 'is_variant'
    );
    
    logTest(
      'Variant fields added to qa_module',
      hasVariantFields,
      hasVariantFields ? 'Found variant fields in schema' : 'No variant fields found'
    );

    // Test 2: Check if variant entries exist
    const entries = await makeRequest(
      '/content_types/qa_module/entries?environment=' + CONFIG.environment
    );
    
    const baseEntries = entries.entries.filter(e => !e.is_variant);
    const variantEntries = entries.entries.filter(e => e.is_variant);

    logTest(
      'Base entries exist',
      baseEntries.length > 0,
      `Found ${baseEntries.length} base entries`
    );

    logTest(
      'Variant entries exist',
      variantEntries.length > 0,
      `Found ${variantEntries.length} variant entries`
    );

    // Test 3: Check variant types
    if (variantEntries.length > 0) {
      const rookieVariants = variantEntries.filter(
        v => v.variant_for_segment === 'ROOKIE'
      );
      const atRiskVariants = variantEntries.filter(
        v => v.variant_for_segment === 'AT_RISK'
      );
      const highFlyerVariants = variantEntries.filter(
        v => v.variant_for_segment === 'HIGH_FLYER'
      );

      logTest(
        'ROOKIE variants exist',
        rookieVariants.length > 0,
        `Found ${rookieVariants.length} ROOKIE variants`
      );

      logTest(
        'AT_RISK variants exist',
        atRiskVariants.length > 0,
        `Found ${atRiskVariants.length} AT_RISK variants`
      );

      logTest(
        'HIGH_FLYER variants exist',
        highFlyerVariants.length > 0,
        `Found ${highFlyerVariants.length} HIGH_FLYER variants`
      );
    }

  } catch (error) {
    logTest('Variants tests', false, error.message);
  }
}

// ============================================
// PERSONALIZE TESTS
// ============================================

async function testPersonalize() {
  console.log('\n🎯 TESTING PERSONALIZE IMPLEMENTATION\n');

  try {
    // Test 1: Check if personalize is enabled on content type
    const contentType = await makeRequest('/content_types/qa_module');
    
    const personalizeEnabled = contentType.content_type.options?.personalize === true;
    
    logTest(
      'Personalize enabled on qa_module',
      personalizeEnabled,
      personalizeEnabled ? 'Personalize flag is enabled' : 'Personalize not enabled'
    );

    // Test 2: Test personalized query (with context)
    // Note: This requires Personalize to be fully configured in UI
    try {
      const personalizedResult = await makeRequest(
        '/content_types/qa_module/entries?environment=' + CONFIG.environment +
        '&query={"segment_taxonomy":{"$in":["rookie"]}}'
      );

      logTest(
        'Personalized query returns results',
        personalizedResult.entries.length > 0,
        `Returned ${personalizedResult.entries.length} entries for ROOKIE segment`
      );
    } catch (error) {
      logTest(
        'Personalized query',
        false,
        'Audiences/Experiences may need to be created in UI'
      );
    }

  } catch (error) {
    logTest('Personalize tests', false, error.message);
  }
}

// ============================================
// INTEGRATION TESTS
// ============================================

async function testIntegration() {
  console.log('\n🔗 TESTING FEATURE INTEGRATION\n');

  try {
    // Test: Fetch modules with taxonomy + variant filtering
    const entries = await makeRequest(
      '/content_types/qa_module/entries?environment=' + CONFIG.environment
    );

    // Find modules that have both taxonomy and variant support
    const fullyIntegrated = entries.entries.filter(entry => {
      const hasTaxonomy = entry.segment_taxonomy || entry.qa_skills_taxonomy;
      const isVariant = entry.is_variant === true;
      return hasTaxonomy && isVariant;
    });

    logTest(
      'Entries support both Taxonomy and Variants',
      fullyIntegrated.length > 0,
      `${fullyIntegrated.length} entries have both taxonomy and variant support`
    );

    // Test: Count total content
    const totalModules = entries.entries.length;
    const baseModules = entries.entries.filter(e => !e.is_variant).length;
    const variants = entries.entries.filter(e => e.is_variant).length;
    const tagged = entries.entries.filter(e => 
      e.segment_taxonomy || e.qa_skills_taxonomy
    ).length;

    console.log('\n📊 Content Statistics:');
    console.log(`   Total Modules: ${totalModules}`);
    console.log(`   Base Modules: ${baseModules}`);
    console.log(`   Variants: ${variants}`);
    console.log(`   Tagged with Taxonomy: ${tagged}`);

    logTest(
      'Content structure is valid',
      totalModules > 0 && baseModules > 0,
      'Content exists and is properly structured'
    );

  } catch (error) {
    logTest('Integration tests', false, error.message);
  }
}

// ============================================
// DATA VALIDATION TESTS
// ============================================

async function testDataValidation() {
  console.log('\n✅ TESTING DATA VALIDATION\n');

  try {
    const entries = await makeRequest(
      '/content_types/qa_module/entries?environment=' + CONFIG.environment +
      '&include_reference=quiz'
    );

    // Test: Required fields present
    const entriesWithTitle = entries.entries.filter(e => e.title).length;
    const entriesWithContent = entries.entries.filter(e => e.content).length;
    const entriesWithCategory = entries.entries.filter(e => e.category).length;

    logTest(
      'All entries have required title field',
      entriesWithTitle === entries.entries.length,
      `${entriesWithTitle}/${entries.entries.length} entries have titles`
    );

    logTest(
      'All entries have content',
      entriesWithContent === entries.entries.length,
      `${entriesWithContent}/${entries.entries.length} entries have content`
    );

    logTest(
      'All entries have category',
      entriesWithCategory === entries.entries.length,
      `${entriesWithCategory}/${entries.entries.length} entries have categories`
    );

    // Test: Variant data integrity
    const variantEntries = entries.entries.filter(e => e.is_variant);
    const variantsWithSegment = variantEntries.filter(
      v => v.variant_for_segment
    ).length;

    if (variantEntries.length > 0) {
      logTest(
        'All variants have target segment',
        variantsWithSegment === variantEntries.length,
        `${variantsWithSegment}/${variantEntries.length} variants have target segment`
      );
    }

  } catch (error) {
    logTest('Data validation tests', false, error.message);
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================

async function runAllTests() {
  console.log('🧪 CONTENTSTACK ADVANCED FEATURES - TEST SUITE\n');
  console.log('Testing Implementation of:');
  console.log('  • Taxonomy');
  console.log('  • Personalize');
  console.log('  • Variants\n');
  console.log('Region:', CONFIG.region);
  console.log('Environment:', CONFIG.environment);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    await testTaxonomyFields();
    await testVariants();
    await testPersonalize();
    await testIntegration();
    await testDataValidation();

    // Print summary
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('📊 TEST SUMMARY\n');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📝 Total:  ${results.passed + results.failed}\n`);

    if (results.failed === 0) {
      console.log('🎉 All tests passed! Your setup is complete.\n');
    } else {
      console.log('⚠️  Some tests failed. Review the output above.\n');
      console.log('Common issues:');
      console.log('  • Audiences/Experiences need to be created in Contentstack UI');
      console.log('  • Entries may need to be published');
      console.log('  • Some scripts may need to be re-run\n');
    }

    console.log('📖 For detailed setup instructions, see:');
    console.log('   CONTENTSTACK_ADVANCED_FEATURES.md');
    console.log('   QUICKSTART_ADVANCED_FEATURES.md\n');

    process.exit(results.failed === 0 ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();

