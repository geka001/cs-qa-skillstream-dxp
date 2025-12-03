#!/usr/bin/env node

/**
 * Add Remaining Modules to Contentstack
 * This script adds the remaining 14 modules from mockData.ts
 */

const https = require('https');

// Contentstack Configuration
const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY || 'blt8202119c48319b1d',
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || 'cs911496f76cbfb543bb764ae7',
  region: 'na',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
  apiHost: 'api.contentstack.io'
};

// Helper function to make API requests
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

// Helper function to prepare entry data
function prepareEntryData(entry) {
  const prepared = { ...entry };
  
  // Convert arrays to JSON strings
  if (prepared.module_tags && Array.isArray(prepared.module_tags)) {
    prepared.module_tags = JSON.stringify(prepared.module_tags);
  }
  if (prepared.tags && Array.isArray(prepared.tags)) {
    prepared.module_tags = JSON.stringify(prepared.tags);
    delete prepared.tags;
  }
  if (prepared.target_segments && Array.isArray(prepared.target_segments)) {
    prepared.target_segments = JSON.stringify(prepared.target_segments);
  }
  
  return prepared;
}

// Create Entry
async function createEntry(contentTypeUid, entry) {
  try {
    const preparedEntry = prepareEntryData(entry);
    const result = await makeRequest('POST', `/content_types/${contentTypeUid}/entries`, { entry: preparedEntry });
    console.log(`✅ Created: ${entry.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create ${entry.title}:`, error.message);
    return null;
  }
}

// Publish Entry
async function publishEntry(contentTypeUid, entryUid) {
  try {
    await makeRequest('POST', `/content_types/${contentTypeUid}/entries/${entryUid}/publish`, {
      entry: {
        environments: [CONFIG.environment],
        locales: ['en-us']
      }
    });
    console.log(`📤 Published: ${entryUid}`);
  } catch (error) {
    if (!error.message.includes('Environment')) {
      console.error(`❌ Failed to publish ${entryUid}:`, error.message);
    }
  }
}

// Remaining 14 modules from mockData.ts
const remainingModules = [
  // ROOKIE MODULE 3
  {
    title: 'Essential QA Tooling',
    module_id: 'mod-rookie-003',
    category: 'Tools & Technologies',
    difficulty: 'beginner',
    content: `<h2>Essential QA Tooling</h2>
<p>Overview of critical QA tools including Jira, TestRail, BrowserStack, and automation environments.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>Navigate TestRail:</strong> Create and execute test cases in TestRail</li>
  <li><strong>Version Control Basics:</strong> Understand Git fundamentals for QA</li>
  <li><strong>Cross-Environment Testing:</strong> Execute tests across different environments</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/T5lzLMzQq5A',
    tags: ['tools', 'jira', 'testrail', 'browserstack', 'rookie'],
    estimated_time: 55,
    target_segments: ['ROOKIE'],
    mandatory: true
  },

  // ROOKIE MODULE 4
  {
    title: 'Critical QA Procedures & SOPs',
    module_id: 'mod-rookie-004',
    category: 'Processes & Standards',
    difficulty: 'beginner',
    content: `<h2>Critical QA Procedures & SOPs</h2>
<p>Mandatory process documentation covering bug triage, regression cycles, communication standards, and test readiness reviews.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>Participate in Bug Triages:</strong> Understand the bug triage process and your role</li>
  <li><strong>Sprint QA Entry/Exit Criteria:</strong> Follow sprint QA entry and exit criteria</li>
  <li><strong>Test Case Review SOPs:</strong> Apply test case review standard operating procedures</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/S-eApeKAFnQ',
    tags: ['sop', 'processes', 'bug-triage', 'regression', 'rookie'],
    estimated_time: 60,
    target_segments: ['ROOKIE'],
    mandatory: true
  },

  // REMEDIAL MODULE 2
  {
    title: 'Remedial: Defect Reporting Deep-Dive',
    module_id: 'mod-remedial-002',
    category: 'Remedial',
    difficulty: 'beginner',
    content: `<h2>Defect Reporting Deep-Dive</h2>
<p>Focuses on writing high-quality bugs, correct severity/priority, and understanding Jira statuses.</p>
<h3>What's Included:</h3>
<ul>
  <li><strong>Examples of Excellent Defects:</strong> Study well-written bug reports</li>
  <li><strong>"Bad vs Good" Comparisons:</strong> Learn what makes a defect report effective</li>
  <li><strong>Hands-on Exercise:</strong> Practice writing your own defect reports</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/1z12QJ2nX98',
    tags: ['remedial', 'defect-reporting', 'jira', 'beginner'],
    estimated_time: 35,
    target_segments: ['AT_RISK'],
    mandatory: true
  },

  // REMEDIAL MODULE 3
  {
    title: 'Remedial: Jira & TestRail Practical Workshop',
    module_id: 'mod-remedial-003',
    category: 'Remedial',
    difficulty: 'beginner',
    content: `<h2>Jira & TestRail Practical Workshop</h2>
<p>A hands-on guide showing step-by-step Jira issue creation and TestRail execution.</p>
<h3>Workshop Contents:</h3>
<ul>
  <li><strong>Jira Navigation:</strong> Finding your way around the interface</li>
  <li><strong>Creating Issues:</strong> Step-by-step defect creation</li>
  <li><strong>TestRail Basics:</strong> Running test cases and recording results</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/Qx5eC4X-XoE',
    tags: ['remedial', 'jira', 'testrail', 'tools', 'beginner'],
    estimated_time: 40,
    target_segments: ['AT_RISK'],
    mandatory: true
  },

  // AT-RISK MODULE 1
  {
    title: 'Bug Reproduction: Step-by-Step',
    module_id: 'mod-atrisk-001',
    category: 'At-Risk Support',
    difficulty: 'beginner',
    content: `<h2>Bug Reproduction: Step-by-Step</h2>
<p>Teaches clear reproduction steps using real examples.</p>
<h3>Why Reproduction Steps Matter:</h3>
<p>Without clear steps, developers cannot reproduce the bug, which means they cannot fix it.</p>`,
    video_url: 'https://www.youtube.com/embed/yVYw0p7Zf8g',
    tags: ['at-risk', 'bug-reproduction', 'defect-reporting'],
    estimated_time: 25,
    target_segments: ['AT_RISK'],
    mandatory: true
  },

  // AT-RISK MODULE 2
  {
    title: 'Severity vs Priority Mastery',
    module_id: 'mod-atrisk-002',
    category: 'At-Risk Support',
    difficulty: 'beginner',
    content: `<h2>Severity vs Priority Mastery</h2>
<p>Short, animated explanation ensuring conceptual clarity.</p>
<h3>Severity: Impact on the System</h3>
<ul>
  <li><strong>Critical:</strong> System crash, data loss, security breach</li>
  <li><strong>High:</strong> Major functionality broken, no workaround</li>
  <li><strong>Medium:</strong> Feature not working as expected, workaround exists</li>
  <li><strong>Low:</strong> Cosmetic issues, minor inconveniences</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/9-CTP6tzP3k',
    tags: ['at-risk', 'severity', 'priority', 'classification'],
    estimated_time: 20,
    target_segments: ['AT_RISK'],
    mandatory: true
  },

  // AT-RISK MODULE 3
  {
    title: 'Jira Workflow Survival Guide',
    module_id: 'mod-atrisk-003',
    category: 'At-Risk Support',
    difficulty: 'beginner',
    content: `<h2>Jira Workflow Survival Guide</h2>
<p>Shows how defects move from Open → Triage → Fix → Verification.</p>
<h3>Complete Defect Lifecycle:</h3>
<ul>
  <li><strong>Open/New:</strong> Defect is logged by QA</li>
  <li><strong>Triage:</strong> Team reviews and assigns severity/priority</li>
  <li><strong>In Progress:</strong> Developer is actively working on fix</li>
  <li><strong>Resolved/Fixed:</strong> Developer completes fix, ready for testing</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/tP1gG4c9B0E',
    tags: ['at-risk', 'jira', 'workflow', 'process'],
    estimated_time: 30,
    target_segments: ['AT_RISK'],
    mandatory: true
  },

  // HIGH-FLYER MODULE 2
  {
    title: 'API Testing for Professionals (Postman + Newman)',
    module_id: 'mod-highflyer-002',
    category: 'Advanced API Testing',
    difficulty: 'advanced',
    content: `<h2>API Testing for Professionals</h2>
<p>Hands-on API automation plus CI integration.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>Advanced Postman:</strong> Collections, environments, pre-request scripts, tests</li>
  <li><strong>Newman CLI:</strong> Run Postman collections from command line</li>
  <li><strong>CI/CD Integration:</strong> Integrate API tests into Jenkins/GitLab pipelines</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/t5n07Ybz7yI',
    tags: ['high-flyer', 'api-testing', 'postman', 'newman', 'ci-cd', 'advanced'],
    estimated_time: 75,
    target_segments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER MODULE 3
  {
    title: 'Performance Engineering Basics',
    module_id: 'mod-highflyer-003',
    category: 'Performance Testing',
    difficulty: 'advanced',
    content: `<h2>Performance Engineering Basics</h2>
<p>Using JMeter to build a performance test plan.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>Performance Concepts:</strong> Load, stress, spike, soak testing</li>
  <li><strong>JMeter Essentials:</strong> Thread groups, samplers, listeners, assertions</li>
  <li><strong>Test Planning:</strong> Design realistic performance test scenarios</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/TG6XSFeOT3g',
    tags: ['high-flyer', 'performance', 'jmeter', 'load-testing', 'advanced'],
    estimated_time: 80,
    target_segments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER MODULE 4
  {
    title: 'Test Strategy & Risk-Based Testing',
    module_id: 'mod-highflyer-004',
    category: 'Test Leadership',
    difficulty: 'advanced',
    content: `<h2>Test Strategy & Risk-Based Testing</h2>
<p>Covers planning, risk prioritization, and leadership skills in QA.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>Test Strategy Development:</strong> Create comprehensive test strategies</li>
  <li><strong>Risk Assessment:</strong> Identify and prioritize testing based on risk</li>
  <li><strong>Resource Planning:</strong> Allocate time and resources effectively</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/zjXbuc9utQM',
    tags: ['high-flyer', 'test-strategy', 'risk-based', 'leadership', 'advanced'],
    estimated_time: 70,
    target_segments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER BONUS MODULE 1
  {
    title: 'Career Accelerator: How to Become a QA Lead',
    module_id: 'mod-bonus-001',
    category: 'Career Development',
    difficulty: 'advanced',
    content: `<h2>Career Accelerator: How to Become a QA Lead</h2>
<p>Develop the leadership skills needed to advance your QA career.</p>
<h3>QA Lead Responsibilities:</h3>
<ul>
  <li><strong>Team Leadership:</strong> Mentoring, coaching, and developing QA engineers</li>
  <li><strong>Strategic Planning:</strong> Define test strategy and quality roadmap</li>
  <li><strong>Stakeholder Management:</strong> Communicate with product, dev, and executives</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/OtP8IUgKPfs',
    tags: ['high-flyer', 'career', 'leadership', 'bonus'],
    estimated_time: 45,
    target_segments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER BONUS MODULE 2
  {
    title: 'Automation Framework Design Patterns',
    module_id: 'mod-bonus-002',
    category: 'Advanced Automation',
    difficulty: 'advanced',
    content: `<h2>Automation Framework Design Patterns</h2>
<p>Master advanced design patterns for scalable test automation.</p>
<h3>Essential Design Patterns:</h3>
<ul>
  <li><strong>Page Object Model:</strong> Separate page structure from test logic</li>
  <li><strong>Factory Pattern:</strong> Create objects without specifying exact class</li>
  <li><strong>Singleton Pattern:</strong> Single instance of driver/configuration</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/O9eVBx8h2fI',
    tags: ['high-flyer', 'automation', 'design-patterns', 'framework', 'bonus'],
    estimated_time: 60,
    target_segments: ['HIGH_FLYER'],
    mandatory: false
  },

  // ROOKIE MODULE 2 (Manual Testing)
  {
    title: 'Manual Testing Best Practices',
    module_id: 'mod-rookie-005',
    category: 'Testing Techniques',
    difficulty: 'beginner',
    content: `<h2>Manual Testing Essentials</h2>
<p>Manual testing is the foundation of QA. Learn how to effectively test software without automation.</p>
<h3>Testing Approach:</h3>
<ul>
  <li><strong>Exploratory Testing:</strong> Unscripted testing to find unexpected issues</li>
  <li><strong>Test Case Execution:</strong> Following predefined test scenarios</li>
  <li><strong>Boundary Testing:</strong> Testing edge cases and limits</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['manual-testing', 'best-practices', 'beginner', 'rookie'],
    estimated_time: 45,
    target_segments: ['ROOKIE'],
    mandatory: true
  },

  // Bug Reporting (ROOKIE)
  {
    title: 'Bug Reporting & JIRA Workflow',
    module_id: 'mod-rookie-006',
    category: 'Tools & Process',
    difficulty: 'beginner',
    content: `<h2>Effective Bug Reporting</h2>
<p>Learn how to write clear, actionable bug reports that developers love.</p>
<h3>Essential Elements:</h3>
<ul>
  <li><strong>Title:</strong> Clear, concise summary of the issue</li>
  <li><strong>Steps to Reproduce:</strong> Numbered, detailed instructions</li>
  <li><strong>Expected vs Actual:</strong> What should happen vs what does happen</li>
</ul>`,
    video_url: 'https://www.youtube.com/embed/QJdD-OiVfXY',
    tags: ['bug-reporting', 'jira', 'process', 'beginner'],
    estimated_time: 35,
    target_segments: ['ROOKIE', 'AT_RISK'],
    mandatory: true
  }
];

// Main function
async function addRemainingModules() {
  console.log('\n🚀 Adding Remaining Modules to Contentstack\n');
  console.log(`Total modules to add: ${remainingModules.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const module of remainingModules) {
    const result = await createEntry('qa_module', module);
    if (result) {
      successCount++;
      await publishEntry('qa_module', result.entry.uid);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    } else {
      failCount++;
    }
  }

  console.log('\n✨ COMPLETE!\n');
  console.log(`✅ Successfully created: ${successCount} modules`);
  console.log(`❌ Failed: ${failCount} modules`);
  console.log('\n📊 Total modules in Contentstack: ' + (4 + successCount));
  console.log('\n🔗 View in Contentstack:');
  console.log(`https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/content-type/qa_module\n`);
}

// Run the script
if (require.main === module) {
  addRemainingModules().catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
}

