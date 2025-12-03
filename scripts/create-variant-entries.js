#!/usr/bin/env node

/**
 * Create Variant Entries for QA Modules
 * Creates ROOKIE, AT_RISK, and HIGH_FLYER variants for modules
 */

const https = require('https');

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY || 'blt8202119c48319b1d',
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || 'cs911496f76cbfb543bb764ae7',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
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

async function createEntry(contentTypeUid, entryData) {
  try {
    const result = await makeRequest('POST', `/content_types/${contentTypeUid}/entries`, {
      entry: entryData
    });
    return result;
  } catch (error) {
    console.error(`❌ Error creating entry:`, error.message);
    return null;
  }
}

async function publishEntry(contentTypeUid, entryUid) {
  try {
    await makeRequest('POST', `/content_types/${contentTypeUid}/entries/${entryUid}/publish`, {
      entry: {
        environments: [CONFIG.environment],
        locales: ['en-us']
      }
    });
    console.log(`   ✅ Published`);
  } catch (error) {
    console.log(`   ⚠️  Publishing skipped: ${error.message}`);
  }
}

// Base module for creating variants
const BASE_MODULE = {
  title: 'Test Automation Fundamentals',
  module_id: 'automation-base',
  category: 'Automation',
  difficulty: 'intermediate',
  content: '<h2>Test Automation Fundamentals</h2><p>Learn the basics of test automation.</p>',
  video_url: 'https://www.youtube.com/embed/HbpK9AkZdj0',
  estimated_time: 45,
  mandatory: false,
  is_variant: false
};

// Variant definitions
const VARIANT_MODULES = [
  {
    title: 'Test Automation Fundamentals - Beginner Friendly',
    module_id: 'automation-rookie',
    category: 'Automation',
    difficulty: 'beginner',
    content: `
      <h2>Test Automation - Let's Start Simple!</h2>
      <p>Don't worry if automation sounds complicated - we'll take it step by step.</p>
      
      <h3>What is Test Automation?</h3>
      <p>Think of test automation like a robot that helps you test your software. Instead of clicking buttons manually every time, you write instructions once, and the robot does the clicking for you!</p>
      
      <h3>Why Should We Automate?</h3>
      <ul>
        <li><strong>Saves Time:</strong> Run tests while you sleep!</li>
        <li><strong>Fewer Mistakes:</strong> Robots don't get tired or bored</li>
        <li><strong>More Testing:</strong> Test things hundreds of times without effort</li>
      </ul>
      
      <h3>Your First Automation Test</h3>
      <p>We'll start with something super simple - automating a login test. You'll learn:</p>
      <ol>
        <li>How to set up your automation tool</li>
        <li>How to write your first test script</li>
        <li>How to run the test and see results</li>
      </ol>
      
      <p><em>Remember: Everyone starts as a beginner. Take your time and practice!</em></p>
    `,
    video_url: 'https://www.youtube.com/embed/HbpK9AkZdj0',
    estimated_time: 90,
    mandatory: false,
    is_variant: true,
    variant_for_segment: 'ROOKIE',
    variant_type: 'simplified'
  },
  {
    title: 'Test Automation Fundamentals - Remedial',
    module_id: 'automation-remedial',
    category: 'Remedial',
    difficulty: 'beginner',
    content: `
      <h2>Test Automation Review - Let's Get Back on Track</h2>
      <p>Let's review the fundamentals and reinforce your understanding.</p>
      
      <h3>🎯 Key Concepts Review</h3>
      
      <h4>1. What is Test Automation?</h4>
      <p><strong>Simple Definition:</strong> Using software tools to run tests automatically instead of doing them manually.</p>
      <p><strong>Real Example:</strong> Like setting a reminder on your phone - you set it once, it reminds you automatically.</p>
      
      <h4>2. Common Mistakes to Avoid</h4>
      <ul>
        <li>❌ Trying to automate everything at once</li>
        <li>✅ Start with simple, repetitive tests</li>
        <li>❌ Skipping manual testing completely</li>
        <li>✅ Use automation to support manual testing</li>
      </ul>
      
      <h4>3. Step-by-Step Practice</h4>
      <p>Let's practice with a guided exercise:</p>
      <ol>
        <li>Open the automation tool</li>
        <li>Record a simple action (like clicking a button)</li>
        <li>Play it back and watch it work</li>
        <li>Modify the script slightly</li>
        <li>Run it again</li>
      </ol>
      
      <h3>📝 Practice Checklist</h3>
      <p>Complete these exercises before moving on:</p>
      <ul>
        <li>☐ Successfully run the sample test</li>
        <li>☐ Modify one test step</li>
        <li>☐ Create a new test from scratch</li>
      </ul>
      
      <p><strong>Need Help?</strong> Don't hesitate to ask your mentor or team lead!</p>
    `,
    video_url: 'https://www.youtube.com/embed/HbpK9AkZdj0',
    estimated_time: 60,
    mandatory: true,
    is_variant: true,
    variant_for_segment: 'AT_RISK',
    variant_type: 'remedial'
  },
  {
    title: 'Test Automation Fundamentals - Advanced Track',
    module_id: 'automation-highflyer',
    category: 'Advanced Automation',
    difficulty: 'advanced',
    content: `
      <h2>Test Automation - Advanced Concepts</h2>
      <p>Let's dive into enterprise-grade automation patterns and best practices.</p>
      
      <h3>🚀 Advanced Automation Architecture</h3>
      
      <h4>1. Design Patterns</h4>
      <ul>
        <li><strong>Page Object Model (POM):</strong> Separating page logic from test logic</li>
        <li><strong>Screenplay Pattern:</strong> Actor-centric, behavior-driven approach</li>
        <li><strong>Factory Pattern:</strong> Creating test data dynamically</li>
      </ul>
      
      <h4>2. Framework Architecture</h4>
      <pre><code>
tests/
├── pages/          # Page objects
├── components/     # Reusable components
├── fixtures/       # Test data
├── helpers/        # Utility functions
└── specs/          # Test specifications
      </code></pre>
      
      <h4>3. CI/CD Integration</h4>
      <p>Running automation in continuous integration pipelines:</p>
      <ul>
        <li>Jenkins pipeline configuration</li>
        <li>GitHub Actions workflows</li>
        <li>Docker containerization for tests</li>
        <li>Parallel execution strategies</li>
      </ul>
      
      <h4>4. Advanced Techniques</h4>
      <ul>
        <li>Visual regression testing</li>
        <li>API mocking and stubbing</li>
        <li>Cross-browser testing strategies</li>
        <li>Test flakiness prevention</li>
      </ul>
      
      <h3>💡 Best Practices</h3>
      <ol>
        <li>Keep tests independent and idempotent</li>
        <li>Use explicit waits, avoid Thread.sleep()</li>
        <li>Implement proper test data management</li>
        <li>Follow DRY (Don't Repeat Yourself) principle</li>
        <li>Write self-documenting test code</li>
      </ol>
      
      <h3>🔬 Challenge Exercise</h3>
      <p>Build a complete test framework from scratch implementing POM, incorporating CI/CD, and handling cross-browser scenarios.</p>
    `,
    video_url: 'https://www.youtube.com/embed/HbpK9AkZdj0',
    estimated_time: 30,
    mandatory: false,
    is_variant: true,
    variant_for_segment: 'HIGH_FLYER',
    variant_type: 'advanced'
  }
];

async function createVariants() {
  let created = 0;

  console.log('\n📝 Creating base module...\n');
  
  // Create base module first
  const baseResult = await createEntry('qa_module', BASE_MODULE);
  if (baseResult) {
    console.log(`✅ Created base module: ${BASE_MODULE.title}`);
    await publishEntry('qa_module', baseResult.entry.uid);
    created++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎨 Creating variant modules...\n');

  // Create variant modules
  for (const variant of VARIANT_MODULES) {
    // Add reference to base module if we have it
    const variantData = baseResult ? {
      ...variant,
      base_entry_ref: [{ uid: baseResult.entry.uid }]
    } : variant;

    const result = await createEntry('qa_module', variantData);
    if (result) {
      console.log(`✅ Created variant: ${variant.title}`);
      console.log(`   Segment: ${variant.variant_for_segment}`);
      console.log(`   Type: ${variant.variant_type}`);
      await publishEntry('qa_module', result.entry.uid);
      created++;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return created;
}

async function main() {
  console.log('🎨 CREATE VARIANT ENTRIES\n');
  console.log('Region:', CONFIG.region);
  console.log('Environment:', CONFIG.environment);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    const created = await createVariants();

    console.log('\n✨ VARIANT CREATION COMPLETE!\n');
    console.log('Summary:');
    console.log(`  ✅ Total Variants Created: ${created}`);
    console.log('\n📝 Variants Created:');
    console.log('  • Base Module (automation-base)');
    console.log('  • ROOKIE Variant (simplified, 90 min)');
    console.log('  • AT_RISK Variant (remedial, 60 min)');
    console.log('  • HIGH_FLYER Variant (advanced, 30 min)');
    console.log('\n📊 Next Steps:');
    console.log('  1. Verify variants in Contentstack UI');
    console.log('  2. Update application to fetch variants by segment');
    console.log('  3. Test variant delivery for each user segment');
    console.log('\n🔗 Contentstack Dashboard:');
    console.log(`  https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/entries\n`);

  } catch (error) {
    console.error('\n❌ Variant creation failed:', error.message);
    process.exit(1);
  }
}

main();

