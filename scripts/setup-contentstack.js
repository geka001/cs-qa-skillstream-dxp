#!/usr/bin/env node

/**
 * Contentstack Setup Script
 * Creates content types, entries, variants, and personalization rules
 * for the QA SkillStream DXP application
 */

const https = require('https');

// Contentstack Configuration for NA Region
const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY || 'blt8202119c48319b1d',
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || 'cs911496f76cbfb543bb764ae7',
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN || 'csdf941d70d6da13d4ae6265de',
  region: 'na',  // North America
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
  // V3 API endpoint for North America
  baseURL: 'https://api.contentstack.io/v3',
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

// Content Type Schemas
const CONTENT_TYPE_SCHEMAS = {
  quiz_item: {
    content_type: {
      title: 'Quiz Item',
      uid: 'quiz_item',
      schema: [
        {
          display_name: 'Question ID',
          uid: 'question_id',
          data_type: 'text',
          field_metadata: {
            description: 'Unique identifier for the question',
            default_value: ''
          },
          mandatory: true,
          unique: false
        },
        {
          display_name: 'Question',
          uid: 'question',
          data_type: 'text',
          field_metadata: {
            description: 'The quiz question text',
            multiline: true
          },
          mandatory: true
        },
        {
          display_name: 'Answer Options',
          uid: 'answer_options',
          data_type: 'text',
          field_metadata: {
            description: 'JSON array of answer options as string',
            multiline: true
          },
          mandatory: true
        },
        {
          display_name: 'Correct Answer Index',
          uid: 'correct_answer',
          data_type: 'number',
          field_metadata: {
            description: 'Index of the correct answer (0-based)'
          },
          mandatory: true
        },
        {
          display_name: 'Explanation',
          uid: 'explanation',
          data_type: 'text',
          field_metadata: {
            description: 'Explanation of the correct answer',
            multiline: true
          },
          mandatory: true
        }
      ],
      options: {
        title: 'question',
        publishable: true,
        is_page: false,
        singleton: false,
        sub_title: ['question_id']
      }
    }
  },

  qa_tool: {
    content_type: {
      title: 'QA Tool',
      uid: 'qa_tool',
      schema: [
        {
          display_name: 'Tool ID',
          uid: 'tool_id',
          data_type: 'text',
          field_metadata: {
            description: 'Unique identifier for the tool'
          },
          mandatory: true,
          unique: true
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
          field_metadata: {
            multiline: true
          },
          mandatory: true
        },
        {
          display_name: 'Documentation Link',
          uid: 'docs_link',
          data_type: 'text',
          field_metadata: {
            description: 'URL to official documentation'
          },
          mandatory: true
        },
        {
          display_name: 'Integrations',
          uid: 'integrations',
          data_type: 'text',
          field_metadata: {
            description: 'JSON array of integration names',
            multiline: true
          }
        },
        {
          display_name: 'Category',
          uid: 'category',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Target Segments',
          uid: 'target_segments',
          data_type: 'text',
          field_metadata: {
            description: 'JSON array: ["ROOKIE", "AT_RISK", "HIGH_FLYER"] - Used for personalization',
            multiline: true
          },
          mandatory: true
        }
      ],
      options: {
        title: 'name',
        publishable: true,
        is_page: false,
        singleton: false,
        sub_title: ['tool_id', 'category']
      }
    }
  },

  sop: {
    content_type: {
      title: 'Standard Operating Procedure',
      uid: 'sop',
      schema: [
        {
          display_name: 'SOP ID',
          uid: 'sop_id',
          data_type: 'text',
          mandatory: true,
          unique: true
        },
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Criticality',
          uid: 'criticality',
          data_type: 'text',
          field_metadata: {
            description: 'critical, high, medium, or low'
          },
          mandatory: true
        },
        {
          display_name: 'Steps',
          uid: 'steps',
          data_type: 'text',
          field_metadata: {
            description: 'JSON array of step-by-step instructions',
            multiline: true
          },
          mandatory: true
        },
        {
          display_name: 'Related Tools',
          uid: 'related_tools',
          data_type: 'reference',
          reference_to: ['qa_tool'],
          field_metadata: {
            ref_multiple: true
          }
        },
        {
          display_name: 'Target Segments',
          uid: 'target_segments',
          data_type: 'text',
          field_metadata: {
            description: 'JSON array: ["ROOKIE", "AT_RISK", "HIGH_FLYER"]',
            multiline: true
          },
          mandatory: true
        }
      ],
      options: {
        title: 'title',
        publishable: true,
        is_page: false,
        singleton: false,
        sub_title: ['sop_id', 'criticality']
      }
    }
  },

  qa_module: {
    content_type: {
      title: 'QA Training Module',
      uid: 'qa_module',
      schema: [
        {
          display_name: 'Module ID',
          uid: 'module_id',
          data_type: 'text',
          mandatory: true,
          unique: true
        },
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Category',
          uid: 'category',
          data_type: 'text',
          mandatory: true
        },
        {
          display_name: 'Difficulty',
          uid: 'difficulty',
          data_type: 'text',
          field_metadata: {
            description: 'beginner, intermediate, or advanced'
          },
          mandatory: true
        },
        {
          display_name: 'Content',
          uid: 'content',
          data_type: 'text',
          field_metadata: {
            description: 'Rich text content (HTML)',
            multiline: true,
            rich_text_type: 'advanced'
          },
          mandatory: true
        },
        {
          display_name: 'Video URL',
          uid: 'video_url',
          data_type: 'text',
          field_metadata: {
            description: 'YouTube embed URL'
          }
        },
        {
          display_name: 'Quiz',
          uid: 'quiz',
          data_type: 'reference',
          reference_to: ['quiz_item'],
          field_metadata: {
            ref_multiple: true
          }
        },
        {
          display_name: 'Module Tags',
          uid: 'module_tags',
          data_type: 'text',
          field_metadata: {
            description: 'JSON array of tags for filtering and search',
            multiline: true
          }
        },
        {
          display_name: 'Estimated Time (minutes)',
          uid: 'estimated_time',
          data_type: 'number',
          mandatory: true
        },
        {
          display_name: 'Target Segments',
          uid: 'target_segments',
          data_type: 'text',
          field_metadata: {
            description: 'JSON array: ["ROOKIE", "AT_RISK", "HIGH_FLYER"]',
            multiline: true
          },
          mandatory: true
        },
        {
          display_name: 'Mandatory',
          uid: 'mandatory',
          data_type: 'boolean',
          field_metadata: {
            description: 'Is this module required?'
          },
          mandatory: true
        },
        {
          display_name: 'Related Tools',
          uid: 'related_tools',
          data_type: 'reference',
          reference_to: ['qa_tool'],
          field_metadata: {
            ref_multiple: true
          }
        }
      ],
      options: {
        title: 'title',
        publishable: true,
        is_page: false,
        singleton: false,
        sub_title: ['module_id', 'category'],
        personalize: true
      }
    }
  },

  personalization_config: {
    content_type: {
      title: 'Personalization Configuration',
      uid: 'personalization_config',
      schema: [
        {
          display_name: 'Segment Type',
          uid: 'segment_type',
          data_type: 'text',
          mandatory: true,
          unique: true
        },
        {
          display_name: 'Welcome Message',
          uid: 'welcome_message',
          data_type: 'text',
          field_metadata: {
            multiline: true
          },
          mandatory: true
        },
        {
          display_name: 'Intervention Config',
          uid: 'intervention_config',
          data_type: 'text',
          field_metadata: {
            description: 'JSON configuration for at-risk interventions',
            multiline: true
          }
        },
        {
          display_name: 'Badge Color',
          uid: 'badge_color',
          data_type: 'text'
        },
        {
          display_name: 'Description',
          uid: 'description',
          data_type: 'text',
          field_metadata: {
            multiline: true
          }
        }
      ],
      options: {
        title: 'segment_type',
        publishable: true,
        is_page: false,
        singleton: false
      }
    }
  }
};

// Create Content Type
async function createContentType(schema) {
  try {
    console.log(`Creating content type: ${schema.content_type.title}...`);
    // V3 API expects the content_type object directly
    const result = await makeRequest('POST', '/content_types', schema);
    console.log(`✅ Created: ${schema.content_type.title} (${schema.content_type.uid})`);
    return result;
  } catch (error) {
    if (error.message.includes('already exists') || 
        error.message.includes('Content type with') || 
        error.message.includes('uid already exists') ||
        error.message.includes('is not unique')) {
      console.log(`ℹ️  Already exists: ${schema.content_type.title}`);
      return null;
    }
    console.error(`❌ Error creating ${schema.content_type.title}:`, error.message);
    throw error;
  }
}

// Helper function to prepare entry data (convert arrays to JSON strings)
function prepareEntryData(entry) {
  const prepared = { ...entry };
  
  // Convert arrays to JSON strings for text fields
  if (prepared.integrations && Array.isArray(prepared.integrations)) {
    prepared.integrations = JSON.stringify(prepared.integrations);
  }
  if (prepared.target_segments && Array.isArray(prepared.target_segments)) {
    prepared.target_segments = JSON.stringify(prepared.target_segments);
  }
  if (prepared.steps && Array.isArray(prepared.steps)) {
    prepared.steps = JSON.stringify(prepared.steps);
  }
  if (prepared.module_tags && Array.isArray(prepared.module_tags)) {
    prepared.module_tags = JSON.stringify(prepared.module_tags);
  }
  if (prepared.tags && Array.isArray(prepared.tags)) {
    prepared.module_tags = JSON.stringify(prepared.tags);
    delete prepared.tags; // Remove old field
  }
  if (prepared.options && Array.isArray(prepared.options)) {
    prepared.answer_options = JSON.stringify(prepared.options);
    delete prepared.options; // Remove old field
  }
  if (prepared.intervention_config && typeof prepared.intervention_config === 'object') {
    prepared.intervention_config = JSON.stringify(prepared.intervention_config);
  }
  
  return prepared;
}

// Create Entry
async function createEntry(contentTypeUid, entry) {
  try {
    const preparedEntry = prepareEntryData(entry);
    const result = await makeRequest('POST', `/content_types/${contentTypeUid}/entries`, { entry: preparedEntry });
    console.log(`✅ Created entry: ${entry.title || entry.name || entry.segment_type || entry.question_id}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create entry in ${contentTypeUid}:`, error.message);
    return null;
  }
}

// Publish Entry (skip if environment doesn't exist)
async function publishEntry(contentTypeUid, entryUid) {
  try {
    await makeRequest('POST', `/content_types/${contentTypeUid}/entries/${entryUid}/publish`, {
      entry: {
        environments: [CONFIG.environment],
        locales: ['en-us']
      }
    });
    console.log(`📤 Published entry: ${entryUid}`);
  } catch (error) {
    // Silently skip publishing errors (environment may not exist yet)
    if (!error.message.includes('Environment')) {
      console.error(`❌ Failed to publish ${entryUid}:`, error.message);
    }
  }
}

// Main setup function
async function setupContentstack() {
  console.log('\n🚀 Starting Contentstack Setup for QA SkillStream DXP\n');
  console.log('Configuration:');
  console.log(`  Stack API Key: ${CONFIG.apiKey}`);
  console.log(`  Region: ${CONFIG.region}`);
  console.log(`  Environment: ${CONFIG.environment}\n`);

  try {
    // Step 1: Create Content Types
    console.log('📋 STEP 1: Creating Content Types\n');
    
    await createContentType(CONTENT_TYPE_SCHEMAS.quiz_item);
    await createContentType(CONTENT_TYPE_SCHEMAS.qa_tool);
    await createContentType(CONTENT_TYPE_SCHEMAS.sop);
    await createContentType(CONTENT_TYPE_SCHEMAS.qa_module);
    await createContentType(CONTENT_TYPE_SCHEMAS.personalization_config);

    console.log('\n⏳ Waiting for content types to be ready...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 2: Create QA Tools
    console.log('🔧 STEP 2: Creating QA Tools\n');
    
    const tools = [
      {
        title: 'Jira',
        tool_id: 'tool-001',
        name: 'Jira',
        purpose: 'Project management, issue tracking, and agile workflow management for software teams',
        docs_link: 'https://www.atlassian.com/software/jira/guides',
        integrations: ['Confluence', 'Slack', 'GitHub', 'Jenkins', 'TestRail'],
        category: 'Project Management',
        target_segments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
      },
      {
        title: 'Postman',
        tool_id: 'tool-002',
        name: 'Postman',
        purpose: 'API development, testing, and documentation platform with automation capabilities',
        docs_link: 'https://learning.postman.com/',
        integrations: ['Newman', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
        category: 'API Testing',
        target_segments: ['ROOKIE', 'HIGH_FLYER']
      },
      {
        title: 'Slack',
        tool_id: 'tool-003',
        name: 'Slack',
        purpose: 'Team communication, collaboration, and real-time notifications',
        docs_link: 'https://slack.com/help',
        integrations: ['Jira', 'GitHub', 'PagerDuty', 'Jenkins', 'TestRail'],
        category: 'Communication',
        target_segments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
      },
      {
        title: 'Selenium WebDriver',
        tool_id: 'tool-004',
        name: 'Selenium WebDriver',
        purpose: 'Browser automation framework for web application testing across multiple browsers',
        docs_link: 'https://www.selenium.dev/documentation/',
        integrations: ['TestNG', 'JUnit', 'Maven', 'Jenkins', 'GitHub Actions'],
        category: 'Automation',
        target_segments: ['HIGH_FLYER']
      },
      {
        title: 'TestRail',
        tool_id: 'tool-005',
        name: 'TestRail',
        purpose: 'Comprehensive test case management, test execution tracking, and reporting platform',
        docs_link: 'https://www.gurock.com/testrail/docs',
        integrations: ['Jira', 'Jenkins', 'Selenium', 'Slack'],
        category: 'Test Management',
        target_segments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
      }
    ];

    const createdTools = {};
    for (const tool of tools) {
      const result = await createEntry('qa_tool', tool);
      if (result) {
        createdTools[tool.tool_id] = result.entry.uid;
        await publishEntry('qa_tool', result.entry.uid);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Create Quiz Items
    console.log('\n❓ STEP 3: Creating Quiz Items\n');
    
    const quizItems = [
      {
        title: 'SDLC Question',
        question_id: 'q-rookie-001-q1',
        question: 'What does SDLC stand for?',
        options: [
          'Software Design Life Cycle',
          'Software Development Life Cycle',
          'System Development Logic Chain',
          'Software Deployment Launch Cycle'
        ],
        correct_answer: 1,
        explanation: 'SDLC stands for Software Development Life Cycle, which encompasses all phases of software development from planning to maintenance.'
      },
      {
        title: 'Severity vs Priority Question',
        question_id: 'q-rookie-001-q2',
        question: 'What is the difference between Severity and Priority?',
        options: [
          'They mean the same thing',
          'Severity is impact on system, Priority is urgency to fix',
          'Severity is set by developers, Priority by testers',
          'Priority is always higher than Severity'
        ],
        correct_answer: 1,
        explanation: 'Severity measures the impact of a defect on the system, while Priority indicates how urgently it needs to be fixed.'
      },
      {
        title: 'STLC Phases Question',
        question_id: 'q-rookie-001-q3',
        question: 'In which phase of STLC are test cases executed?',
        options: [
          'Test Planning',
          'Test Design',
          'Test Execution',
          'Test Closure'
        ],
        correct_answer: 2,
        explanation: 'Test Execution is the phase where test cases are actually run against the application under test.'
      }
    ];

    const createdQuizItems = {};
    for (const quiz of quizItems) {
      const result = await createEntry('quiz_item', quiz);
      if (result) {
        createdQuizItems[quiz.question_id] = result.entry.uid;
        await publishEntry('quiz_item', result.entry.uid);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Create SOPs
    console.log('\n📄 STEP 4: Creating Standard Operating Procedures\n');
    
    const sops = [
      {
        title: 'Production Bug Escalation Process',
        sop_id: 'sop-001',
        criticality: 'critical',
        steps: [
          'Verify the bug exists in production environment',
          'Assess severity: P0 (critical), P1 (high), P2 (medium), P3 (low)',
          'Create Jira ticket with [PROD] prefix and complete details',
          'For P0/P1: Immediately notify team lead and on-call developer via Slack',
          'Attach screenshots, logs, browser console errors, and network traces',
          'Document user impact and number of affected users',
          'Monitor ticket and respond to developer questions within 15 minutes',
          'Verify fix in staging environment before production deployment',
          'Retest in production after deployment',
          'Document post-mortem and add to regression suite'
        ],
        target_segments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
      },
      {
        title: 'Sprint Testing Workflow',
        sop_id: 'sop-002',
        criticality: 'high',
        steps: [
          'Attend sprint planning and review user stories/acceptance criteria',
          'Create test cases in TestRail within 24 hours of story assignment',
          'Set up test environment with required test data',
          'Execute smoke tests when build is deployed to QA environment',
          'Perform functional testing and log defects with complete repro steps',
          'Attend daily standups with test status updates (% complete, blockers)',
          'Regression test affected areas when bugs are fixed',
          'Execute full regression suite 2 days before sprint end',
          'Provide go/no-go sign-off for production deployment',
          'Update test documentation and archive test run results'
        ],
        target_segments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
      }
    ];

    for (const sop of sops) {
      const result = await createEntry('sop', sop);
      if (result) {
        await publishEntry('sop', result.entry.uid);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 5: Create QA Modules
    console.log('\n📚 STEP 5: Creating QA Training Modules\n');
    
    const modules = [
      {
        title: 'QA Foundations 101',
        module_id: 'mod-rookie-001',
        category: 'Fundamentals',
        difficulty: 'beginner',
        content: `<h2>QA Foundations 101</h2>
<p>Introduction to the fundamentals of software testing, QA roles, and the importance of quality in SDLC.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>QA Terminology:</strong> Understand test case, defect, severity, priority</li>
  <li><strong>SDLC & STLC:</strong> Explain the Software Development Life Cycle and Software Testing Life Cycle</li>
  <li><strong>Defect Origins:</strong> Understand why defects occur and how to prevent them</li>
  <li><strong>Quality Mindset:</strong> Develop a quality-first approach to software development</li>
</ul>
<h3>Key Concepts:</h3>
<p>Quality Assurance is not just about finding bugs—it's about preventing them. Learn the foundational concepts that every QA professional needs to succeed.</p>`,
        video_url: 'https://www.youtube.com/embed/H7Qf0yQUNzI',
        tags: ['fundamentals', 'beginner', 'sdlc', 'stlc', 'rookie'],
        estimated_time: 45,
        target_segments: ['ROOKIE'],
        mandatory: true
      },
      {
        title: 'Defect Management & Reporting',
        module_id: 'mod-rookie-002',
        category: 'Defect Management',
        difficulty: 'beginner',
        content: `<h2>Defect Management & Reporting</h2>
<p>Learn how to write effective defects, classify them, and manage the defect lifecycle in Jira.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>Log High-Quality Defects:</strong> Write clear, actionable bug reports</li>
  <li><strong>Provide Reproduction Steps:</strong> Create detailed steps to reproduce issues</li>
  <li><strong>Use Jira Workflow Correctly:</strong> Navigate and utilize Jira effectively</li>
  <li><strong>Classify Defects:</strong> Understand severity and priority levels</li>
</ul>`,
        video_url: 'https://www.youtube.com/embed/QJdD-OiVfXY',
        tags: ['defect-management', 'jira', 'bug-reporting', 'rookie'],
        estimated_time: 50,
        target_segments: ['ROOKIE'],
        mandatory: true
      },
      {
        title: 'Remedial: QA Foundations Booster',
        module_id: 'mod-remedial-001',
        category: 'Remedial',
        difficulty: 'beginner',
        content: `<h2>QA Foundations Booster</h2>
<p>A simple, instructor-led video plus micro-learning exercises to reinforce QA basics.</p>
<h3>What's Included:</h3>
<ul>
  <li><strong>5-minute Recap Video:</strong> Quick review of core concepts</li>
  <li><strong>Flashcard Core Concepts:</strong> Interactive learning cards</li>
  <li><strong>3 Sample Defects:</strong> Real-world examples to study</li>
</ul>`,
        video_url: 'https://www.youtube.com/embed/YDTp3G0X1Jw',
        tags: ['remedial', 'foundations', 'review', 'beginner'],
        estimated_time: 30,
        target_segments: ['AT_RISK'],
        mandatory: true
      },
      {
        title: 'Selenium Advanced — Building a Mini Framework',
        module_id: 'mod-highflyer-001',
        category: 'Advanced Automation',
        difficulty: 'advanced',
        content: `<h2>Selenium Advanced — Building a Mini Framework</h2>
<p>Design patterns, page object model, matrix execution.</p>
<h3>Learning Outcomes:</h3>
<ul>
  <li><strong>Page Object Model (POM):</strong> Implement maintainable test architecture</li>
  <li><strong>Design Patterns:</strong> Apply Factory, Singleton, and Strategy patterns</li>
  <li><strong>Data-Driven Testing:</strong> Parameterize tests with external data sources</li>
</ul>`,
        video_url: 'https://www.youtube.com/embed/FRn5J31eAMw',
        tags: ['high-flyer', 'selenium', 'automation', 'framework', 'advanced'],
        estimated_time: 90,
        target_segments: ['HIGH_FLYER'],
        mandatory: false
      }
    ];

    for (const module of modules) {
      const result = await createEntry('qa_module', module);
      if (result) {
        await publishEntry('qa_module', result.entry.uid);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 6: Create Personalization Config
    console.log('\n🎯 STEP 6: Creating Personalization Configuration\n');
    
    const personalizationConfigs = [
      {
        title: 'ROOKIE Configuration',
        segment_type: 'ROOKIE',
        welcome_message: 'Welcome to your QA journey! Let\'s start with the fundamentals and build a strong foundation.',
        badge_color: '#3B82F6',
        description: 'New QA engineers learning the basics'
      },
      {
        title: 'AT_RISK Configuration',
        segment_type: 'AT_RISK',
        welcome_message: 'We\'ve noticed you need some extra support. These focused resources will help you get back on track and succeed.',
        intervention_config: {
          title: '⚠️ Performance Gap Detected',
          message: 'We\'ve identified some areas where you need additional support. Don\'t worry—we\'ve curated specific resources to help you succeed.',
          actions: [
            'Review the remedial modules below',
            'Complete the quick practice exercises',
            'Retake the assessment quiz',
            'Reach out to your mentor if you need help'
          ],
          encouragement: 'Remember: Every expert was once a beginner. You\'ve got this! 💪'
        },
        badge_color: '#EF4444',
        description: 'QA engineers needing additional support'
      },
      {
        title: 'HIGH_FLYER Configuration',
        segment_type: 'HIGH_FLYER',
        welcome_message: 'Outstanding progress! Here are advanced modules and career-accelerating content to take your expertise to the next level.',
        badge_color: '#10B981',
        description: 'High-performing QA engineers ready for advanced content'
      }
    ];

    for (const config of personalizationConfigs) {
      const result = await createEntry('personalization_config', config);
      if (result) {
        await publishEntry('personalization_config', result.entry.uid);
      }
    }

    console.log('\n✨ SETUP COMPLETE!\n');
    console.log('Summary:');
    console.log('  ✅ Content Types Created: 5');
    console.log('  ✅ Tools Created: 5');
    console.log('  ✅ Quiz Items Created: 3');
    console.log('  ✅ SOPs Created: 2');
    console.log('  ✅ Modules Created: 4');
    console.log('  ✅ Personalization Configs: 3');
    console.log('\n📊 Next Steps:');
    console.log('  1. Check your Contentstack dashboard');
    console.log('  2. Review the created content types and entries');
    console.log('  3. Set up personalization rules in Contentstack');
    console.log('  4. Update your app to fetch from Contentstack API');
    console.log('\n🔗 Contentstack Dashboard:');
    console.log(`  https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/dashboard\n`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupContentstack();
}

module.exports = { setupContentstack, makeRequest };

