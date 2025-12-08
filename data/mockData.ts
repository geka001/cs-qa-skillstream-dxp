import { Module, SOP, Tool, UserSegment, Team } from '@/types';
import { getCsModules, getCsQuizItems } from '@/lib/contentstack';
import { sortModulesByOrder } from '@/lib/prerequisites';

// ============================================================
// TEAM-SPECIFIC TRAINING MODULES
// Modules specific to each Contentstack product team
// ============================================================

export const mockModules: Module[] = [
  
  // ========== LAUNCH TEAM MODULES ==========
  {
    id: 'mod-launch-001',
    title: 'Introduction to Contentstack Launch',
    category: 'Product Knowledge',
    difficulty: 'beginner',
    content: `
      <h2>Introduction to Contentstack Launch</h2>
      <p>Contentstack Launch is an experience optimization and personalization platform that allows marketers to create, test, and deliver personalized content experiences.</p>
      
      <h3>What is Launch?</h3>
      <p>Launch enables teams to:</p>
      <ul>
        <li><strong>Personalize Content:</strong> Deliver tailored experiences based on user attributes, behavior, and context</li>
        <li><strong>A/B Testing:</strong> Run experiments to optimize content performance</li>
        <li><strong>Audience Segmentation:</strong> Target specific user groups with relevant content</li>
        <li><strong>Experience Rules:</strong> Define logic-based content delivery rules</li>
      </ul>
      
      <h3>Key QA Focus Areas:</h3>
      <ul>
        <li>Testing personalization rule logic</li>
        <li>Validating A/B test variant delivery</li>
        <li>Verifying audience segmentation accuracy</li>
        <li>Cross-browser and device testing for experiences</li>
        <li>Performance impact of personalization</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary purpose of Contentstack Launch?',
        options: [
          'Content creation and editing',
          'Experience optimization and personalization',
          'Asset management',
          'Content workflow automation'
        ],
        correctAnswer: 1,
        explanation: 'Launch is specifically designed for experience optimization and personalization, allowing teams to deliver tailored content to different audiences.'
      },
      {
        id: 'q2',
        question: 'Which of these is NOT a core feature of Launch?',
        options: [
          'A/B Testing',
          'Audience Segmentation',
          'Image Compression',
          'Personalization Rules'
        ],
        correctAnswer: 2,
        explanation: 'Image compression is a DAM feature. Launch focuses on experience optimization, not asset processing.'
      }
    ],
    tags: ['launch', 'personalization', 'product-knowledge'],
    estimatedTime: 30,
    targetSegments: ['ROOKIE'],
    targetTeams: ['Launch'],
    mandatory: true,
    order: 1,
    prerequisites: []
  },

  {
    id: 'mod-launch-002',
    title: 'Testing Personalization Rules',
    category: 'Testing Strategy',
    difficulty: 'intermediate',
    content: `
      <h2>Testing Personalization Rules in Launch</h2>
      <p>Learn how to systematically test personalization rules and ensure content is delivered correctly to targeted audiences.</p>
      
      <h3>Personalization Rule Components:</h3>
      <ul>
        <li><strong>Conditions:</strong> User attributes, behavior, location, device</li>
        <li><strong>Logic Operators:</strong> AND, OR, NOT combinations</li>
        <li><strong>Content Variants:</strong> Different versions for different audiences</li>
        <li><strong>Fallback Content:</strong> Default when no rules match</li>
      </ul>
      
      <h3>Testing Checklist:</h3>
      <ol>
        <li>Test each condition individually</li>
        <li>Test combined conditions (AND/OR logic)</li>
        <li>Verify priority/precedence of rules</li>
        <li>Test edge cases and boundary conditions</li>
        <li>Validate fallback behavior</li>
        <li>Cross-browser and device testing</li>
      </ol>
      
      <h3>Common Issues to Watch For:</h3>
      <ul>
        <li>Rule logic errors (incorrect AND/OR combinations)</li>
        <li>Missing fallback content</li>
        <li>Performance degradation with complex rules</li>
        <li>Cache-related delivery issues</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What should always be tested when validating personalization rules?',
        options: [
          'Only the happy path',
          'Individual conditions, combined logic, and fallback behavior',
          'Just the UI appearance',
          'Only on desktop browsers'
        ],
        correctAnswer: 1,
        explanation: 'Comprehensive testing includes individual conditions, combined logic (AND/OR), edge cases, and fallback behavior to ensure robust personalization.'
      }
    ],
    tags: ['launch', 'personalization', 'testing-strategy'],
    estimatedTime: 45,
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['Launch'],
    mandatory: true,
    order: 2,
    prerequisites: ['mod-launch-001']
  },

  {
    id: 'mod-launch-003',
    title: 'A/B Testing Validation',
    category: 'Testing Strategy',
    difficulty: 'intermediate',
    content: `
      <h2>A/B Testing Validation in Launch</h2>
      <p>Master the art of testing A/B experiments to ensure accurate variant delivery and data collection.</p>
      
      <h3>A/B Test Components:</h3>
      <ul>
        <li><strong>Control:</strong> Original/baseline version</li>
        <li><strong>Variants:</strong> Alternative versions being tested</li>
        <li><strong>Traffic Split:</strong> Percentage distribution (e.g., 50/50)</li>
        <li><strong>Success Metrics:</strong> KPIs being measured</li>
      </ul>
      
      <h3>QA Validation Steps:</h3>
      <ol>
        <li><strong>Variant Delivery:</strong> Verify correct distribution of traffic</li>
        <li><strong>Consistency:</strong> Users see same variant across sessions</li>
        <li><strong>Analytics Tracking:</strong> Ensure events fire correctly</li>
        <li><strong>Goal Tracking:</strong> Validate conversion tracking</li>
        <li><strong>Edge Cases:</strong> New users, returning users, bots</li>
      </ol>
      
      <h3>Testing Tools:</h3>
      <ul>
        <li>Browser DevTools for variant inspection</li>
        <li>Network tab for tracking calls</li>
        <li>Cookie/localStorage inspection</li>
        <li>Analytics debugging tools</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'Why is consistency important in A/B testing?',
        options: [
          'It makes testing easier',
          'Users should see the same variant across sessions for accurate results',
          'It reduces server load',
          'It improves page performance'
        ],
        correctAnswer: 1,
        explanation: 'Consistency ensures that users experience the same variant throughout the test period, which is critical for accurate measurement and preventing confusion.'
      }
    ],
    tags: ['launch', 'ab-testing', 'analytics'],
    estimatedTime: 40,
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['Launch'],
    mandatory: true,
    order: 3,
    prerequisites: ['mod-launch-002']
  },

  // ========== DATA & INSIGHTS TEAM MODULES ==========
  {
    id: 'mod-insights-001',
    title: 'Introduction to Data & Insights',
    category: 'Product Knowledge',
    difficulty: 'beginner',
    content: `
      <h2>Introduction to Contentstack Data & Insights</h2>
      <p>Data & Insights is Contentstack's analytics and intelligence platform that provides visibility into content performance and user behavior.</p>
      
      <h3>What is Data & Insights?</h3>
      <p>The platform enables teams to:</p>
      <ul>
        <li><strong>Content Analytics:</strong> Track content performance metrics</li>
        <li><strong>User Behavior:</strong> Understand how users interact with content</li>
        <li><strong>Custom Dashboards:</strong> Create tailored analytics views</li>
        <li><strong>Data Visualization:</strong> Charts, graphs, and reports</li>
        <li><strong>Real-time Monitoring:</strong> Live data feeds and alerts</li>
      </ul>
      
      <h3>Key QA Focus Areas:</h3>
      <ul>
        <li>Dashboard accuracy and data integrity</li>
        <li>Report generation and export functionality</li>
        <li>Data pipeline testing and validation</li>
        <li>Performance with large datasets</li>
        <li>Real-time data updates</li>
        <li>Visualization rendering and responsiveness</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary purpose of Data & Insights?',
        options: [
          'Content creation',
          'Analytics and intelligence for content performance',
          'User authentication',
          'Asset storage'
        ],
        correctAnswer: 1,
        explanation: 'Data & Insights focuses on providing analytics and intelligence about content performance and user behavior.'
      }
    ],
    tags: ['data-insights', 'analytics', 'product-knowledge'],
    estimatedTime: 30,
    targetSegments: ['ROOKIE'],
    targetTeams: ['Data & Insights'],
    mandatory: true,
    order: 1,
    prerequisites: []
  },

  {
    id: 'mod-insights-002',
    title: 'Dashboard Testing & Validation',
    category: 'Testing Strategy',
    difficulty: 'intermediate',
    content: `
      <h2>Dashboard Testing & Validation</h2>
      <p>Learn comprehensive testing strategies for analytics dashboards and data visualizations.</p>
      
      <h3>Dashboard Components to Test:</h3>
      <ul>
        <li><strong>Data Accuracy:</strong> Verify metrics match source data</li>
        <li><strong>Visualizations:</strong> Charts, graphs, tables render correctly</li>
        <li><strong>Filters:</strong> Date ranges, segments, custom filters work</li>
        <li><strong>Exports:</strong> PDF, CSV, Excel generation</li>
        <li><strong>Performance:</strong> Load times with various data volumes</li>
      </ul>
      
      <h3>Testing Approach:</h3>
      <ol>
        <li><strong>Baseline Testing:</strong> Establish known dataset with expected results</li>
        <li><strong>Comparison:</strong> Cross-reference with source data or alternative tools</li>
        <li><strong>Edge Cases:</strong> Empty data, large datasets, null values</li>
        <li><strong>Refresh/Real-time:</strong> Validate auto-refresh and live updates</li>
        <li><strong>Responsiveness:</strong> Test on different screen sizes</li>
      </ol>
      
      <h3>Common Issues:</h3>
      <ul>
        <li>Calculation errors in aggregations (sum, average, count)</li>
        <li>Time zone handling for date-based metrics</li>
        <li>Performance degradation with large data</li>
        <li>Visualization rendering bugs (overlapping labels, truncated text)</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What is the most critical aspect of dashboard testing?',
        options: [
          'Visual appearance',
          'Data accuracy and integrity',
          'Loading speed',
          'Export formats'
        ],
        correctAnswer: 1,
        explanation: 'While all aspects are important, data accuracy is paramount. Incorrect data can lead to wrong business decisions.'
      }
    ],
    tags: ['data-insights', 'dashboard-testing', 'data-validation'],
    estimatedTime: 45,
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['Data & Insights'],
    mandatory: true,
    order: 2,
    prerequisites: ['mod-insights-001']
  },

  // ========== AUTODRAFT TEAM MODULES ==========
  {
    id: 'mod-autodraft-001',
    title: 'Introduction to AutoDraft',
    category: 'Product Knowledge',
    difficulty: 'beginner',
    content: `
      <h2>Introduction to Contentstack AutoDraft</h2>
      <p>AutoDraft is an AI-powered content generation tool that helps content creators produce high-quality content faster.</p>
      
      <h3>What is AutoDraft?</h3>
      <p>AutoDraft enables teams to:</p>
      <ul>
        <li><strong>AI Content Generation:</strong> Generate blog posts, descriptions, summaries</li>
        <li><strong>Content Enhancement:</strong> Improve existing content with AI suggestions</li>
        <li><strong>Multi-language Support:</strong> Generate content in multiple languages</li>
        <li><strong>Tone & Style Control:</strong> Customize output based on brand voice</li>
        <li><strong>API Integration:</strong> Programmatic content generation</li>
      </ul>
      
      <h3>Key QA Focus Areas:</h3>
      <ul>
        <li>AI output quality and relevance</li>
        <li>Content accuracy and factual correctness</li>
        <li>Tone and style consistency</li>
        <li>API endpoint functionality (REST Assured testing)</li>
        <li>Error handling for edge cases</li>
        <li>Performance and response times</li>
        <li>Multi-language output validation</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary purpose of AutoDraft?',
        options: [
          'Image editing',
          'AI-powered content generation',
          'User authentication',
          'Data analytics'
        ],
        correctAnswer: 1,
        explanation: 'AutoDraft uses AI to generate and enhance content, helping content creators work more efficiently.'
      }
    ],
    tags: ['autodraft', 'ai-content', 'product-knowledge'],
    estimatedTime: 30,
    targetSegments: ['ROOKIE'],
    targetTeams: ['AutoDraft'],
    mandatory: true,
    order: 1,
    prerequisites: []
  },

  {
    id: 'mod-autodraft-002',
    title: 'API Testing with REST Assured',
    category: 'Testing Strategy',
    difficulty: 'intermediate',
    content: `
      <h2>API Testing for AutoDraft with REST Assured</h2>
      <p>Learn how to test AutoDraft APIs effectively using REST Assured, a powerful Java library for API testing.</p>
      
      <h3>Why REST Assured?</h3>
      <p>REST Assured simplifies API testing with:</p>
      <ul>
        <li>Readable, BDD-style syntax</li>
        <li>Built-in JSON/XML validation</li>
        <li>Easy authentication handling</li>
        <li>Request/response logging</li>
        <li>Schema validation</li>
      </ul>
      
      <h3>Key Testing Scenarios:</h3>
      <ol>
        <li><strong>Content Generation:</strong> Test AI generation endpoints</li>
        <li><strong>Input Validation:</strong> Test various input formats and edge cases</li>
        <li><strong>Response Validation:</strong> Verify structure, format, and content quality</li>
        <li><strong>Error Handling:</strong> Test invalid inputs, rate limits, timeouts</li>
        <li><strong>Performance:</strong> Measure response times under load</li>
      </ol>
      
      <h3>Test Structure:</h3>
      <ul>
        <li>Setup: Authentication, base URL, headers</li>
        <li>Given: Request parameters and body</li>
        <li>When: Execute API call</li>
        <li>Then: Validate response (status, body, schema)</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What testing framework does AutoDraft team use for API testing?',
        options: [
          'Selenium',
          'JUnit only',
          'REST Assured',
          'Cypress'
        ],
        correctAnswer: 2,
        explanation: 'AutoDraft team uses REST Assured for comprehensive API testing, which is designed specifically for REST API validation.'
      }
    ],
    tags: ['autodraft', 'api-testing', 'rest-assured'],
    estimatedTime: 60,
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['AutoDraft'],
    mandatory: true,
    order: 2,
    prerequisites: ['mod-autodraft-001']
  },

  {
    id: 'mod-autodraft-003',
    title: 'AI Output Validation',
    category: 'Testing Strategy',
    difficulty: 'advanced',
    content: `
      <h2>Validating AI-Generated Content</h2>
      <p>Learn specialized techniques for testing AI-generated content quality, accuracy, and consistency.</p>
      
      <h3>Challenges of AI Testing:</h3>
      <ul>
        <li><strong>Non-deterministic Output:</strong> Same input may produce different results</li>
        <li><strong>Quality Metrics:</strong> Subjective evaluation of "good" content</li>
        <li><strong>Edge Cases:</strong> Unusual or adversarial inputs</li>
        <li><strong>Bias Detection:</strong> Identifying problematic content</li>
      </ul>
      
      <h3>Testing Strategies:</h3>
      <ol>
        <li><strong>Structural Validation:</strong> Check format, length, required elements</li>
        <li><strong>Content Rules:</strong> Verify keyword presence, tone, style guidelines</li>
        <li><strong>Factual Accuracy:</strong> Cross-reference with source material</li>
        <li><strong>Consistency Testing:</strong> Multiple runs with same input</li>
        <li><strong>Boundary Testing:</strong> Min/max input lengths, special characters</li>
        <li><strong>Adversarial Testing:</strong> Prompts designed to produce poor output</li>
      </ol>
      
      <h3>Quality Metrics:</h3>
      <ul>
        <li>Relevance to prompt</li>
        <li>Readability scores</li>
        <li>Grammar and spelling</li>
        <li>Tone consistency</li>
        <li>Plagiarism checks</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'Why is AI content testing challenging?',
        options: [
          'AI is too fast',
          'Output is non-deterministic and quality is subjective',
          'APIs are unreliable',
          'Testing tools are limited'
        ],
        correctAnswer: 1,
        explanation: 'AI-generated content is non-deterministic (same input can produce different outputs) and quality assessment is often subjective, making traditional testing approaches insufficient.'
      }
    ],
    tags: ['autodraft', 'ai-testing', 'content-quality'],
    estimatedTime: 55,
    targetSegments: ['HIGH_FLYER'],
    targetTeams: ['AutoDraft'],
    mandatory: false,
    order: 3,
    prerequisites: ['mod-autodraft-002']
  },

  // ========== DAM TEAM MODULES ==========
  {
    id: 'mod-dam-001',
    title: 'Introduction to DAM',
    category: 'Product Knowledge',
    difficulty: 'beginner',
    content: `
      <h2>Introduction to Contentstack DAM</h2>
      <p>Digital Asset Management (DAM) is Contentstack's solution for storing, organizing, and delivering digital assets at scale.</p>
      
      <h3>What is DAM?</h3>
      <p>DAM enables teams to:</p>
      <ul>
        <li><strong>Asset Storage:</strong> Centralized repository for images, videos, documents</li>
        <li><strong>Organization:</strong> Folders, tags, metadata for easy discovery</li>
        <li><strong>Transformations:</strong> On-the-fly image resizing, cropping, format conversion</li>
        <li><strong>CDN Delivery:</strong> Global, fast asset delivery</li>
        <li><strong>API Access:</strong> Programmatic asset management</li>
      </ul>
      
      <h3>Key QA Focus Areas:</h3>
      <ul>
        <li>Asset upload/download functionality</li>
        <li>Metadata management and search</li>
        <li>Image transformation accuracy</li>
        <li>CDN delivery and caching</li>
        <li>API endpoint testing (REST Assured)</li>
        <li>Performance with large files</li>
        <li>Access control and permissions</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What does DAM stand for?',
        options: [
          'Data Analysis Module',
          'Digital Asset Management',
          'Dynamic API Manager',
          'Database Access Module'
        ],
        correctAnswer: 1,
        explanation: 'DAM stands for Digital Asset Management - a system for storing, organizing, and delivering digital assets like images and videos.'
      }
    ],
    tags: ['dam', 'asset-management', 'product-knowledge'],
    estimatedTime: 30,
    targetSegments: ['ROOKIE'],
    targetTeams: ['DAM'],
    mandatory: true,
    order: 1,
    prerequisites: []
  },

  {
    id: 'mod-dam-002',
    title: 'Asset Upload & Management Testing',
    category: 'Testing Strategy',
    difficulty: 'intermediate',
    content: `
      <h2>Testing Asset Upload & Management</h2>
      <p>Learn comprehensive testing strategies for file uploads, metadata management, and asset organization in DAM.</p>
      
      <h3>Upload Testing Scenarios:</h3>
      <ul>
        <li><strong>File Types:</strong> Images (JPEG, PNG, GIF, WebP), Videos (MP4, MOV), Documents (PDF, DOC)</li>
        <li><strong>File Sizes:</strong> Small (< 1MB), Medium (1-10MB), Large (> 10MB), Edge (max allowed)</li>
        <li><strong>Batch Uploads:</strong> Multiple files simultaneously</li>
        <li><strong>Error Handling:</strong> Invalid formats, oversized files, network interruptions</li>
      </ul>
      
      <h3>Metadata Testing:</h3>
      <ol>
        <li>Add/edit/delete metadata fields</li>
        <li>Search and filter by metadata</li>
        <li>Bulk metadata updates</li>
        <li>Metadata validation rules</li>
      </ol>
      
      <h3>Organization Features:</h3>
      <ul>
        <li>Folder creation and hierarchy</li>
        <li>Move/copy assets between folders</li>
        <li>Tagging and categorization</li>
        <li>Asset versioning</li>
      </ul>
      
      <h3>Performance Considerations:</h3>
      <ul>
        <li>Upload speed with large files</li>
        <li>UI responsiveness with thousands of assets</li>
        <li>Search performance</li>
        <li>Thumbnail generation time</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What should be tested when validating file uploads?',
        options: [
          'Only successful uploads',
          'File types, sizes, batch uploads, and error scenarios',
          'Just the UI',
          'Only image files'
        ],
        correctAnswer: 1,
        explanation: 'Comprehensive upload testing includes various file types, sizes, batch operations, and error handling scenarios to ensure robustness.'
      }
    ],
    tags: ['dam', 'file-upload', 'asset-management'],
    estimatedTime: 45,
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['DAM'],
    mandatory: true,
    order: 2,
    prerequisites: ['mod-dam-001']
  },

  {
    id: 'mod-dam-003',
    title: 'Image Transformation Testing',
    category: 'Testing Strategy',
    difficulty: 'intermediate',
    content: `
      <h2>Testing Image Transformations & CDN Delivery</h2>
      <p>Master testing of on-the-fly image transformations and CDN-based asset delivery.</p>
      
      <h3>Transformation Types:</h3>
      <ul>
        <li><strong>Resize:</strong> Width, height, aspect ratio</li>
        <li><strong>Crop:</strong> Manual, smart crop, focal point</li>
        <li><strong>Format:</strong> JPEG, PNG, WebP, AVIF</li>
        <li><strong>Quality:</strong> Compression levels</li>
        <li><strong>Effects:</strong> Blur, sharpen, filters, overlays</li>
      </ul>
      
      <h3>Testing Approach:</h3>
      <ol>
        <li><strong>URL Parameters:</strong> Test transformation query strings</li>
        <li><strong>Visual Validation:</strong> Verify output matches expected transformation</li>
        <li><strong>File Size:</strong> Check compression effectiveness</li>
        <li><strong>Format Conversion:</strong> Validate correct format output</li>
        <li><strong>Error Handling:</strong> Invalid parameters, unsupported operations</li>
      </ol>
      
      <h3>CDN Testing:</h3>
      <ul>
        <li>Cache behavior (HIT/MISS headers)</li>
        <li>Geographic distribution</li>
        <li>Cache invalidation</li>
        <li>Performance metrics (TTFB, download time)</li>
        <li>HTTPS delivery</li>
      </ul>
      
      <h3>API Testing (REST Assured):</h3>
      <ul>
        <li>Asset upload via API</li>
        <li>Metadata retrieval and updates</li>
        <li>Transformation parameter validation</li>
        <li>Error responses and status codes</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        id: 'q1',
        question: 'What indicates a CDN cache hit?',
        options: [
          'Slow response time',
          'Presence of cache headers indicating HIT status',
          'Large file size',
          'Error message'
        ],
        correctAnswer: 1,
        explanation: 'CDN cache hits are indicated by specific response headers (like X-Cache: HIT) showing the content was served from cache rather than origin.'
      }
    ],
    tags: ['dam', 'image-transformation', 'cdn', 'api-testing'],
    estimatedTime: 50,
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['DAM'],
    mandatory: true,
    order: 3,
    prerequisites: ['mod-dam-002']
  },

  // ========== GENERAL QA MODULES (All Teams) ==========
  // ROOKIE MODULE 1
  {
    id: 'mod-rookie-001',
    title: 'QA Foundations 103',
    category: 'Fundamentals',
    difficulty: 'beginner',
    content: `
      <h2>QA Foundations 101</h2>
      <p>Introduction to the fundamentals of software testing, QA roles, and the importance of quality in SDLC.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>QA Terminology:</strong> Understand test case, defect, severity, priority</li>
        <li><strong>SDLC & STLC:</strong> Explain the Software Development Life Cycle and Software Testing Life Cycle</li>
        <li><strong>Defect Origins:</strong> Understand why defects occur and how to prevent them</li>
        <li><strong>Quality Mindset:</strong> Develop a quality-first approach to software development</li>
      </ul>
      <h3>Key Concepts:</h3>
      <p>Quality Assurance is not just about finding bugs—it's about preventing them. Learn the foundational concepts that every QA professional needs to succeed.</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/H7Qf0yQUNzI',
    quiz: [
      {
        id: 'q1',
        question: 'What does SDLC stand for?',
        options: [
          'Software Design Life Cycle',
          'Software Development Life Cycle',
          'System Development Logic Chain',
          'Software Deployment Launch Cycle'
        ],
        correctAnswer: 1,
        explanation: 'SDLC stands for Software Development Life Cycle, which encompasses all phases of software development from planning to maintenance.'
      },
      {
        id: 'q2',
        question: 'What is the difference between Severity and Priority?',
        options: [
          'They mean the same thing',
          'Severity is impact on system, Priority is urgency to fix',
          'Severity is set by developers, Priority by testers',
          'Priority is always higher than Severity'
        ],
        correctAnswer: 1,
        explanation: 'Severity measures the impact of a defect on the system, while Priority indicates how urgently it needs to be fixed.'
      },
      {
        id: 'q3',
        question: 'In which phase of STLC are test cases executed?',
        options: [
          'Test Planning',
          'Test Design',
          'Test Execution',
          'Test Closure'
        ],
        correctAnswer: 2,
        explanation: 'Test Execution is the phase where test cases are actually run against the application under test.'
      }
    ],
    tags: ['fundamentals', 'beginner', 'sdlc', 'stlc', 'rookie'],
    estimatedTime: 45,
    targetSegments: ['ROOKIE'],
    mandatory: true,
    order: 1,
    prerequisites: []
  },

  // ROOKIE MODULE 2
  {
    id: 'mod-rookie-002',
    title: 'Defect Management & Reporting',
    category: 'Defect Management',
    difficulty: 'beginner',
    content: `
      <h2>Defect Management & Reporting</h2>
      <p>Learn how to write effective defects, classify them, and manage the defect lifecycle in Jira.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>Log High-Quality Defects:</strong> Write clear, actionable bug reports</li>
        <li><strong>Provide Reproduction Steps:</strong> Create detailed steps to reproduce issues</li>
        <li><strong>Use Jira Workflow Correctly:</strong> Navigate and utilize Jira effectively</li>
        <li><strong>Classify Defects:</strong> Understand severity and priority levels</li>
      </ul>
      <h3>Essential Elements of a Good Defect Report:</h3>
      <ul>
        <li>Clear, concise summary</li>
        <li>Detailed reproduction steps</li>
        <li>Expected vs Actual results</li>
        <li>Environment details (browser, OS, version)</li>
        <li>Supporting evidence (screenshots, logs, videos)</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/QJdD-OiVfXY',
    quiz: [
      {
        id: 'q1',
        question: 'What is the MOST critical component of a defect report?',
        options: [
          'A catchy title',
          'Clear steps to reproduce',
          'Your opinion on severity',
          'The developer assignment'
        ],
        correctAnswer: 1,
        explanation: 'Clear reproduction steps are essential—they allow developers to quickly reproduce, diagnose, and fix the issue.'
      },
      {
        id: 'q2',
        question: 'A critical UI bug appears only on one browser but doesn\'t block core functionality. What\'s the appropriate classification?',
        options: [
          'High Severity, High Priority',
          'High Severity, Low Priority',
          'Low Severity, High Priority',
          'Low Severity, Low Priority'
        ],
        correctAnswer: 1,
        explanation: 'Browser-specific issues that don\'t block core functionality have high severity (significant impact) but may have lower priority depending on browser usage statistics.'
      }
    ],
    tags: ['defect-management', 'jira', 'bug-reporting', 'rookie'],
    estimatedTime: 50,
    targetSegments: ['ROOKIE'],
    mandatory: true,
    order: 2,
    prerequisites: ['mod-rookie-001']
  },

  // ROOKIE MODULE 3
  {
    id: 'mod-rookie-003',
    title: 'Essential QA Tooling',
    category: 'Tools & Technologies',
    difficulty: 'beginner',
    content: `
      <h2>Essential QA Tooling</h2>
      <p>Overview of critical QA tools including Jira, TestRail, BrowserStack, and automation environments.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>Navigate TestRail:</strong> Create and execute test cases in TestRail</li>
        <li><strong>Version Control Basics:</strong> Understand Git fundamentals for QA</li>
        <li><strong>Cross-Environment Testing:</strong> Execute tests across different environments</li>
        <li><strong>Tool Integration:</strong> Understand how QA tools work together</li>
      </ul>
      <h3>Key Tools:</h3>
      <ul>
        <li><strong>Jira:</strong> Issue tracking and project management</li>
        <li><strong>TestRail:</strong> Test case management and reporting</li>
        <li><strong>BrowserStack:</strong> Cross-browser and device testing</li>
        <li><strong>Git/GitHub:</strong> Version control for test scripts</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/T5lzLMzQq5A',
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary purpose of TestRail?',
        options: [
          'Writing automated tests',
          'Managing test cases and test execution',
          'Tracking defects',
          'Performance testing'
        ],
        correctAnswer: 1,
        explanation: 'TestRail is a test case management tool used to organize, track, and manage test cases and test runs.'
      },
      {
        id: 'q2',
        question: 'Why is version control important for QA teams?',
        options: [
          'It\'s only for developers',
          'To track changes in test scripts and collaborate effectively',
          'To create defects faster',
          'To replace test management tools'
        ],
        correctAnswer: 1,
        explanation: 'Version control helps QA teams track changes in test automation scripts, collaborate with team members, and maintain test code history.'
      }
    ],
    tags: ['tools', 'jira', 'testrail', 'browserstack', 'rookie'],
    estimatedTime: 55,
    targetSegments: ['ROOKIE'],
    mandatory: true
  },

  // ROOKIE MODULE 4
  {
    id: 'mod-rookie-004',
    title: 'Critical QA Procedures & SOPs',
    category: 'Processes & Standards',
    difficulty: 'beginner',
    content: `
      <h2>Critical QA Procedures & SOPs</h2>
      <p>Mandatory process documentation covering bug triage, regression cycles, communication standards, and test readiness reviews.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>Participate in Bug Triages:</strong> Understand the bug triage process and your role</li>
        <li><strong>Sprint QA Entry/Exit Criteria:</strong> Follow sprint QA entry and exit criteria</li>
        <li><strong>Test Case Review SOPs:</strong> Apply test case review standard operating procedures</li>
        <li><strong>Communication Standards:</strong> Communicate effectively with stakeholders</li>
      </ul>
      <h3>Key Procedures:</h3>
      <ul>
        <li><strong>Bug Triage:</strong> Daily review and prioritization of reported defects</li>
        <li><strong>Regression Testing:</strong> Systematic re-testing of existing functionality</li>
        <li><strong>Test Readiness Review:</strong> Ensuring quality gates before testing begins</li>
        <li><strong>Sign-off Process:</strong> Formal approval before production deployment</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/S-eApeKAFnQ',
    quiz: [
      {
        id: 'q1',
        question: 'What is the purpose of a bug triage meeting?',
        options: [
          'To write test cases',
          'To review, prioritize, and assign defects',
          'To deploy to production',
          'To celebrate completed sprints'
        ],
        correctAnswer: 1,
        explanation: 'Bug triage meetings are held to review newly reported defects, verify them, assign priority/severity, and assign them to developers.'
      },
      {
        id: 'q2',
        question: 'What is an "exit criteria" in QA?',
        options: [
          'When testers leave for the day',
          'Conditions that must be met before moving to the next phase',
          'The last test case in a suite',
          'When developers finish coding'
        ],
        correctAnswer: 1,
        explanation: 'Exit criteria are predefined conditions (like "all critical bugs fixed" or "95% test pass rate") that must be met before proceeding to the next phase.'
      }
    ],
    tags: ['sop', 'processes', 'bug-triage', 'regression', 'rookie'],
    estimatedTime: 60,
    targetSegments: ['ROOKIE'],
    mandatory: true
  },

  // ============================================================
  // REMEDIAL MODULES - Triggered When Quizzes Fail Twice
  // ============================================================

  // REMEDIAL MODULE 1
  {
    id: 'mod-remedial-001',
    title: 'Remedial: QA Foundations Booster',
    category: 'Remedial',
    difficulty: 'beginner',
    order: 1, // Must be completed first
    content: `
      <h2>QA Foundations Booster</h2>
      <p>A simple, instructor-led video plus micro-learning exercises to reinforce QA basics.</p>
      <h3>What's Included:</h3>
      <ul>
        <li><strong>5-minute Recap Video:</strong> Quick review of core concepts</li>
        <li><strong>Flashcard Core Concepts:</strong> Interactive learning cards</li>
        <li><strong>3 Sample Defects:</strong> Real-world examples to study</li>
        <li><strong>Guided Practice:</strong> Step-by-step exercises</li>
      </ul>
      <h3>Focus Areas:</h3>
      <p>This module reinforces fundamental QA terminology, SDLC/STLC phases, and the role of QA in software development. Take your time and practice with the examples provided.</p>
      <h3>Practice Defects:</h3>
      <ul>
        <li><strong>Example 1:</strong> Login button not responding on mobile Safari</li>
        <li><strong>Example 2:</strong> Incorrect calculation in checkout total</li>
        <li><strong>Example 3:</strong> Profile image not uploading with special characters in filename</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/YDTp3G0X1Jw',
    quiz: [
      {
        id: 'q1',
        question: 'What is a test case?',
        options: [
          'A bug report',
          'A set of conditions to verify a specific functionality',
          'A development task',
          'A project timeline'
        ],
        correctAnswer: 1,
        explanation: 'A test case is a set of conditions or variables used to determine if a system under test satisfies requirements.'
      },
      {
        id: 'q2',
        question: 'In STLC, which comes first?',
        options: [
          'Test Execution',
          'Test Planning',
          'Test Closure',
          'Test Design'
        ],
        correctAnswer: 1,
        explanation: 'Test Planning is the first phase where test strategy and objectives are defined.'
      }
    ],
    tags: ['remedial', 'foundations', 'review', 'beginner'],
    estimatedTime: 30,
    targetSegments: ['AT_RISK'],
    mandatory: true
  },

  // REMEDIAL MODULE 2
  {
    id: 'mod-remedial-002',
    title: 'Remedial: Defect Reporting Deep-Dive',
    category: 'Remedial',
    difficulty: 'beginner',
    order: 2, // Second remedial module
    content: `
      <h2>Defect Reporting Deep-Dive</h2>
      <p>Focuses on writing high-quality bugs, correct severity/priority, and understanding Jira statuses.</p>
      <h3>What's Included:</h3>
      <ul>
        <li><strong>Examples of Excellent Defects:</strong> Study well-written bug reports</li>
        <li><strong>"Bad vs Good" Comparisons:</strong> Learn what makes a defect report effective</li>
        <li><strong>Hands-on Exercise:</strong> Practice writing your own defect reports</li>
        <li><strong>Jira Status Flow:</strong> Understand the complete defect lifecycle</li>
      </ul>
      <h3>Bad vs Good Examples:</h3>
      <p><strong>❌ Bad:</strong> "Login doesn't work"</p>
      <p><strong>✅ Good:</strong> "Login button unresponsive on Chrome 120 when email contains special characters (+, .)"</p>
      <h3>Defect Lifecycle:</h3>
      <p>Open → In Progress → Resolved → Verified → Closed (or Reopened if issue persists)</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/1z12QJ2nX98',
    quiz: [
      {
        id: 'q1',
        question: 'Which defect title is BEST?',
        options: [
          'Button broken',
          'Checkout page has issues',
          'Submit Order button throws 500 error when cart contains >50 items',
          'Error in production'
        ],
        correctAnswer: 2,
        explanation: 'The best title is specific, includes the action, the result, and the conditions that trigger it.'
      },
      {
        id: 'q2',
        question: 'When should a defect status be "Reopened"?',
        options: [
          'When you want to annoy developers',
          'When the fix didn\'t resolve the issue or caused a regression',
          'Immediately after it\'s marked Resolved',
          'Never'
        ],
        correctAnswer: 1,
        explanation: 'A defect should be reopened only when verification confirms the issue still exists or the fix introduced a new problem.'
      }
    ],
    tags: ['remedial', 'defect-reporting', 'jira', 'beginner'],
    estimatedTime: 35,
    targetSegments: ['AT_RISK'],
    mandatory: true
  },

  // REMEDIAL MODULE 3
  {
    id: 'mod-remedial-003',
    title: 'Remedial: Jira & TestRail Practical Workshop',
    category: 'Remedial',
    difficulty: 'beginner',
    order: 3, // Third remedial module
    content: `
      <h2>Jira & TestRail Practical Workshop</h2>
      <p>A hands-on guide showing step-by-step Jira issue creation and TestRail execution.</p>
      <h3>Workshop Contents:</h3>
      <ul>
        <li><strong>Jira Navigation:</strong> Finding your way around the interface</li>
        <li><strong>Creating Issues:</strong> Step-by-step defect creation</li>
        <li><strong>TestRail Basics:</strong> Running test cases and recording results</li>
        <li><strong>Integration:</strong> How Jira and TestRail work together</li>
      </ul>
      <h3>Jira Best Practices:</h3>
      <ul>
        <li>Always fill required fields (Summary, Description, Severity, Priority)</li>
        <li>Use consistent naming conventions</li>
        <li>Attach evidence (screenshots, videos, logs)</li>
        <li>Update status as work progresses</li>
      </ul>
      <h3>TestRail Workflow:</h3>
      <p>Select Test Run → Execute Test Case → Record Result (Pass/Fail/Blocked) → Add Comments → Create Defect if Failed</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/Qx5eC4X-XoE',
    quiz: [
      {
        id: 'q1',
        question: 'In TestRail, what should you do when a test case fails?',
        options: [
          'Mark it as Passed and move on',
          'Mark it as Failed and create a defect in Jira with details',
          'Skip it',
          'Delete the test case'
        ],
        correctAnswer: 1,
        explanation: 'When a test fails, mark it as Failed in TestRail and create a corresponding defect in Jira with reproduction steps.'
      },
      {
        id: 'q2',
        question: 'What is a "Test Run" in TestRail?',
        options: [
          'Running fast',
          'An instance of executing a group of test cases',
          'A type of defect',
          'A report format'
        ],
        correctAnswer: 1,
        explanation: 'A Test Run is a collection of test cases selected for execution in a specific testing cycle or sprint.'
      }
    ],
    tags: ['remedial', 'jira', 'testrail', 'tools', 'beginner'],
    estimatedTime: 40,
    targetSegments: ['AT_RISK'],
    mandatory: true
  },

  // ============================================================
  // AT-RISK PERSONALIZE VARIANT CONTENT
  // ============================================================

  // AT-RISK MODULE 1
  {
    id: 'mod-atrisk-001',
    title: 'Bug Reproduction: Step-by-Step',
    category: 'At-Risk Support',
    difficulty: 'beginner',
    content: `
      <h2>Bug Reproduction: Step-by-Step</h2>
      <p>Teaches clear reproduction steps using real examples.</p>
      <h3>Why Reproduction Steps Matter:</h3>
      <p>Without clear steps, developers cannot reproduce the bug, which means they cannot fix it. Your reproduction steps are the roadmap to resolution.</p>
      <h3>The 5 W's of Reproduction:</h3>
      <ul>
        <li><strong>Where:</strong> Which page/screen/feature?</li>
        <li><strong>What:</strong> What action did you take?</li>
        <li><strong>When:</strong> Under what conditions (logged in, specific data)?</li>
        <li><strong>Which:</strong> Which environment, browser, device?</li>
        <li><strong>Why:</strong> What was the expected result?</li>
      </ul>
      <h3>Example Template:</h3>
      <p><strong>Steps to Reproduce:</strong></p>
      <ol>
        <li>Navigate to https://example.com/login</li>
        <li>Enter email: test@example.com</li>
        <li>Enter password: Test@123</li>
        <li>Click "Login" button</li>
        <li>Observe error message</li>
      </ol>
      <p><strong>Expected Result:</strong> User successfully logs in and is redirected to dashboard</p>
      <p><strong>Actual Result:</strong> Error message "Invalid credentials" appears despite correct credentials</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/yVYw0p7Zf8g',
    quiz: [
      {
        id: 'q1',
        question: 'What makes reproduction steps effective?',
        options: [
          'Being as brief as possible',
          'Being numbered, detailed, and easy to follow',
          'Including your personal opinions',
          'Using technical jargon'
        ],
        correctAnswer: 1,
        explanation: 'Effective reproduction steps are numbered, detailed, and written in a way that anyone can follow them exactly to reproduce the issue.'
      }
    ],
    tags: ['at-risk', 'bug-reproduction', 'defect-reporting'],
    estimatedTime: 25,
    targetSegments: ['AT_RISK'],
    mandatory: true
  },

  // AT-RISK MODULE 2
  {
    id: 'mod-atrisk-002',
    title: 'Severity vs Priority Mastery',
    category: 'At-Risk Support',
    difficulty: 'beginner',
    content: `
      <h2>Severity vs Priority Mastery</h2>
      <p>Short, animated explanation ensuring conceptual clarity.</p>
      <h3>Severity: Impact on the System</h3>
      <ul>
        <li><strong>Critical:</strong> System crash, data loss, security breach</li>
        <li><strong>High:</strong> Major functionality broken, no workaround</li>
        <li><strong>Medium:</strong> Feature not working as expected, workaround exists</li>
        <li><strong>Low:</strong> Cosmetic issues, minor inconveniences</li>
      </ul>
      <h3>Priority: Urgency to Fix</h3>
      <ul>
        <li><strong>Urgent:</strong> Must be fixed immediately</li>
        <li><strong>High:</strong> Should be fixed in current sprint</li>
        <li><strong>Medium:</strong> Can be fixed in upcoming sprints</li>
        <li><strong>Low:</strong> Fix when time permits</li>
      </ul>
      <h3>Real-World Example:</h3>
      <p><strong>Scenario:</strong> Company logo misspelled on homepage</p>
      <ul>
        <li><strong>Severity:</strong> Low (cosmetic issue)</li>
        <li><strong>Priority:</strong> High (brand reputation)</li>
      </ul>
      <p><strong>Scenario:</strong> Admin panel rare feature crashes</p>
      <ul>
        <li><strong>Severity:</strong> High (functionality broken)</li>
        <li><strong>Priority:</strong> Low (rarely used feature, few users affected)</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/9-CTP6tzP3k',
    quiz: [
      {
        id: 'q1',
        question: 'A spelling error on the homepage launch banner. What severity and priority?',
        options: [
          'High Severity, High Priority',
          'Low Severity, High Priority',
          'High Severity, Low Priority',
          'Low Severity, Low Priority'
        ],
        correctAnswer: 1,
        explanation: 'It\'s a cosmetic issue (low severity) but visible to all users and affects brand perception (high priority).'
      },
      {
        id: 'q2',
        question: 'Database connection failure affecting all users. What severity and priority?',
        options: [
          'Critical Severity, Urgent Priority',
          'Low Severity, Low Priority',
          'Medium Severity, Medium Priority',
          'High Severity, Low Priority'
        ],
        correctAnswer: 0,
        explanation: 'Complete system failure affecting all users is both critical in severity and urgent in priority.'
      }
    ],
    tags: ['at-risk', 'severity', 'priority', 'classification'],
    estimatedTime: 20,
    targetSegments: ['AT_RISK'],
    mandatory: true
  },

  // AT-RISK MODULE 3
  {
    id: 'mod-atrisk-003',
    title: 'Jira Workflow Survival Guide',
    category: 'At-Risk Support',
    difficulty: 'beginner',
    content: `
      <h2>Jira Workflow Survival Guide</h2>
      <p>Shows how defects move from Open → Triage → Fix → Verification.</p>
      <h3>Complete Defect Lifecycle:</h3>
      <ul>
        <li><strong>Open/New:</strong> Defect is logged by QA</li>
        <li><strong>Triage:</strong> Team reviews and assigns severity/priority</li>
        <li><strong>In Progress:</strong> Developer is actively working on fix</li>
        <li><strong>Resolved/Fixed:</strong> Developer completes fix, ready for testing</li>
        <li><strong>Verification:</strong> QA tests the fix</li>
        <li><strong>Closed:</strong> Fix verified, defect resolved</li>
        <li><strong>Reopened:</strong> Issue persists or regression found</li>
      </ul>
      <h3>QA Responsibilities by Status:</h3>
      <ul>
        <li><strong>Open:</strong> Provide complete information</li>
        <li><strong>Triage:</strong> Answer questions, provide additional details</li>
        <li><strong>In Progress:</strong> Monitor for dev questions</li>
        <li><strong>Resolved:</strong> Verify the fix thoroughly</li>
        <li><strong>Closed:</strong> Include in regression suite if needed</li>
      </ul>
      <h3>Best Practices:</h3>
      <ul>
        <li>Update comments when status changes</li>
        <li>Respond to developer questions quickly</li>
        <li>Test thoroughly before closing</li>
        <li>Document your verification steps</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/tP1gG4c9B0E',
    quiz: [
      {
        id: 'q1',
        question: 'What should QA do when a defect status changes to "Resolved"?',
        options: [
          'Immediately close it',
          'Ignore it',
          'Verify the fix and test for regressions',
          'Reassign it to another developer'
        ],
        correctAnswer: 2,
        explanation: 'When a defect is marked Resolved, QA should verify the fix works as expected and check for any regressions before closing.'
      },
      {
        id: 'q2',
        question: 'When should you Reopen a defect?',
        options: [
          'When you feel like it',
          'When the fix didn\'t work or caused new issues',
          'Never',
          'Every time to double-check'
        ],
        correctAnswer: 1,
        explanation: 'Reopen a defect only when verification confirms the original issue persists or the fix introduced new problems.'
      }
    ],
    tags: ['at-risk', 'jira', 'workflow', 'process'],
    estimatedTime: 30,
    targetSegments: ['AT_RISK'],
    mandatory: true
  },

  // ============================================================
  // HIGH-FLYER (ADVANCED PATH) CONTENT
  // ============================================================

  // HIGH-FLYER MODULE 1
  {
    id: 'mod-highflyer-001',
    title: 'Selenium Advanced — Building a Mini Framework',
    category: 'Advanced Automation',
    difficulty: 'advanced',
    content: `
      <h2>Selenium Advanced — Building a Mini Framework</h2>
      <p>Design patterns, page object model, matrix execution.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>Page Object Model (POM):</strong> Implement maintainable test architecture</li>
        <li><strong>Design Patterns:</strong> Apply Factory, Singleton, and Strategy patterns</li>
        <li><strong>Data-Driven Testing:</strong> Parameterize tests with external data sources</li>
        <li><strong>Cross-Browser Execution:</strong> Run tests across multiple browsers simultaneously</li>
      </ul>
      <h3>Framework Components:</h3>
      <ul>
        <li><strong>Base Classes:</strong> Common functionality and setup/teardown</li>
        <li><strong>Page Objects:</strong> Encapsulate page elements and actions</li>
        <li><strong>Test Classes:</strong> Business logic and test scenarios</li>
        <li><strong>Utilities:</strong> Helper functions for waits, screenshots, reporting</li>
        <li><strong>Configuration:</strong> Environment settings and test data</li>
      </ul>
      <h3>Best Practices:</h3>
      <ul>
        <li>Keep page objects independent and reusable</li>
        <li>Implement explicit waits for reliability</li>
        <li>Use descriptive naming conventions</li>
        <li>Handle exceptions gracefully</li>
        <li>Generate comprehensive reports</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/FRn5J31eAMw',
    quiz: [
      {
        id: 'q1',
        question: 'What is the main benefit of Page Object Model?',
        options: [
          'Faster test execution',
          'Maintainability and reusability of test code',
          'Automatic bug detection',
          'No need for test data'
        ],
        correctAnswer: 1,
        explanation: 'POM improves maintainability by separating page elements from test logic, making updates easier when UI changes.'
      },
      {
        id: 'q2',
        question: 'Which wait strategy is generally BEST for dynamic web applications?',
        options: [
          'Thread.sleep()',
          'Implicit waits',
          'Explicit waits with expected conditions',
          'No waits needed'
        ],
        correctAnswer: 2,
        explanation: 'Explicit waits with expected conditions are most reliable as they wait for specific conditions to be met.'
      }
    ],
    tags: ['high-flyer', 'selenium', 'automation', 'framework', 'advanced'],
    estimatedTime: 90,
    targetSegments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER MODULE 2
  {
    id: 'mod-highflyer-002',
    title: 'API Testing for Professionals (Postman + Newman)',
    category: 'Advanced API Testing',
    difficulty: 'advanced',
    content: `
      <h2>API Testing for Professionals</h2>
      <p>Hands-on API automation plus CI integration.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>Advanced Postman:</strong> Collections, environments, pre-request scripts, tests</li>
        <li><strong>Newman CLI:</strong> Run Postman collections from command line</li>
        <li><strong>CI/CD Integration:</strong> Integrate API tests into Jenkins/GitLab pipelines</li>
        <li><strong>API Test Strategy:</strong> Design comprehensive API test suites</li>
      </ul>
      <h3>Advanced Topics:</h3>
      <ul>
        <li><strong>Authentication:</strong> OAuth, JWT, API keys, session management</li>
        <li><strong>Chaining Requests:</strong> Use response data in subsequent requests</li>
        <li><strong>Data-Driven Testing:</strong> CSV and JSON data files</li>
        <li><strong>Schema Validation:</strong> Validate response structure with JSON Schema</li>
        <li><strong>Performance:</strong> Monitor response times and set thresholds</li>
      </ul>
      <h3>Newman CI/CD Integration:</h3>
      <pre>newman run collection.json -e environment.json --reporters cli,html</pre>
    `,
    videoUrl: 'https://www.youtube.com/embed/t5n07Ybz7yI',
    quiz: [
      {
        id: 'q1',
        question: 'What is Newman?',
        options: [
          'A new Postman competitor',
          'A command-line collection runner for Postman',
          'An API framework',
          'A type of authentication'
        ],
        correctAnswer: 1,
        explanation: 'Newman is the command-line collection runner for Postman, enabling CI/CD integration.'
      },
      {
        id: 'q2',
        question: 'Which HTTP status code indicates successful resource creation?',
        options: [
          '200 OK',
          '201 Created',
          '204 No Content',
          '301 Moved Permanently'
        ],
        correctAnswer: 1,
        explanation: '201 Created indicates that a request has succeeded and a new resource has been created as a result.'
      }
    ],
    tags: ['high-flyer', 'api-testing', 'postman', 'newman', 'ci-cd', 'advanced'],
    estimatedTime: 75,
    targetSegments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER MODULE 3
  {
    id: 'mod-highflyer-003',
    title: 'Performance Engineering Basics',
    category: 'Performance Testing',
    difficulty: 'advanced',
    content: `
      <h2>Performance Engineering Basics</h2>
      <p>Using JMeter to build a performance test plan.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>Performance Concepts:</strong> Load, stress, spike, soak testing</li>
        <li><strong>JMeter Essentials:</strong> Thread groups, samplers, listeners, assertions</li>
        <li><strong>Test Planning:</strong> Design realistic performance test scenarios</li>
        <li><strong>Analysis:</strong> Interpret results and identify bottlenecks</li>
      </ul>
      <h3>Key Metrics:</h3>
      <ul>
        <li><strong>Response Time:</strong> How long requests take (average, median, 90th percentile)</li>
        <li><strong>Throughput:</strong> Requests per second the system can handle</li>
        <li><strong>Error Rate:</strong> Percentage of failed requests</li>
        <li><strong>Resource Utilization:</strong> CPU, memory, network usage</li>
      </ul>
      <h3>Types of Performance Tests:</h3>
      <ul>
        <li><strong>Load Testing:</strong> Validate system behavior under expected load</li>
        <li><strong>Stress Testing:</strong> Find breaking point by exceeding normal load</li>
        <li><strong>Spike Testing:</strong> Test sudden traffic increases</li>
        <li><strong>Soak Testing:</strong> Sustained load over extended period (memory leaks)</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/TG6XSFeOT3g',
    quiz: [
      {
        id: 'q1',
        question: 'What is the difference between load testing and stress testing?',
        options: [
          'No difference, they\'re the same',
          'Load tests expected load, stress tests beyond capacity to find limits',
          'Load is manual, stress is automated',
          'Stress is faster than load'
        ],
        correctAnswer: 1,
        explanation: 'Load testing validates system behavior under expected conditions, while stress testing pushes beyond normal load to find breaking points.'
      },
      {
        id: 'q2',
        question: 'What is a "thread" in JMeter?',
        options: [
          'A type of assertion',
          'A virtual user simulating real user behavior',
          'A test result',
          'A configuration file'
        ],
        correctAnswer: 1,
        explanation: 'In JMeter, a thread represents a virtual user that simulates real user actions and load on the system.'
      }
    ],
    tags: ['high-flyer', 'performance', 'jmeter', 'load-testing', 'advanced'],
    estimatedTime: 80,
    targetSegments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER MODULE 4
  {
    id: 'mod-highflyer-004',
    title: 'Test Strategy & Risk-Based Testing',
    category: 'Test Leadership',
    difficulty: 'advanced',
    content: `
      <h2>Test Strategy & Risk-Based Testing</h2>
      <p>Covers planning, risk prioritization, and leadership skills in QA.</p>
      <h3>Learning Outcomes:</h3>
      <ul>
        <li><strong>Test Strategy Development:</strong> Create comprehensive test strategies</li>
        <li><strong>Risk Assessment:</strong> Identify and prioritize testing based on risk</li>
        <li><strong>Resource Planning:</strong> Allocate time and resources effectively</li>
        <li><strong>Stakeholder Communication:</strong> Present test plans to leadership</li>
      </ul>
      <h3>Test Strategy Components:</h3>
      <ul>
        <li><strong>Scope:</strong> What will and won't be tested</li>
        <li><strong>Approach:</strong> Manual, automated, or hybrid testing</li>
        <li><strong>Resources:</strong> Team, tools, environments needed</li>
        <li><strong>Schedule:</strong> Timelines and milestones</li>
        <li><strong>Risk Management:</strong> Identified risks and mitigation plans</li>
        <li><strong>Entry/Exit Criteria:</strong> When to start/stop testing</li>
      </ul>
      <h3>Risk-Based Testing:</h3>
      <p>Prioritize testing efforts based on:</p>
      <ul>
        <li><strong>Business Impact:</strong> Revenue, compliance, user experience</li>
        <li><strong>Likelihood of Failure:</strong> Complexity, change frequency, history</li>
        <li><strong>Visibility:</strong> Customer-facing vs internal features</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/zjXbuc9utQM',
    quiz: [
      {
        id: 'q1',
        question: 'What is risk-based testing?',
        options: [
          'Testing without a plan',
          'Prioritizing testing based on potential impact and likelihood of failure',
          'Only testing high-risk features',
          'Automated testing only'
        ],
        correctAnswer: 1,
        explanation: 'Risk-based testing focuses efforts on areas with highest risk (combination of impact and likelihood of failure).'
      },
      {
        id: 'q2',
        question: 'What should a test strategy include?',
        options: [
          'Only test cases',
          'Just the testing schedule',
          'Scope, approach, resources, schedule, risks, and entry/exit criteria',
          'Only automation scripts'
        ],
        correctAnswer: 2,
        explanation: 'A comprehensive test strategy covers scope, approach, resources, schedule, risk management, and quality gates.'
      }
    ],
    tags: ['high-flyer', 'test-strategy', 'risk-based', 'leadership', 'advanced'],
    estimatedTime: 70,
    targetSegments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER BONUS MODULE 1
  {
    id: 'mod-bonus-001',
    title: 'Career Accelerator: How to Become a QA Lead',
    category: 'Career Development',
    difficulty: 'advanced',
    content: `
      <h2>Career Accelerator: How to Become a QA Lead</h2>
      <p>Develop the leadership skills needed to advance your QA career.</p>
      <h3>QA Lead Responsibilities:</h3>
      <ul>
        <li><strong>Team Leadership:</strong> Mentoring, coaching, and developing QA engineers</li>
        <li><strong>Strategic Planning:</strong> Define test strategy and quality roadmap</li>
        <li><strong>Stakeholder Management:</strong> Communicate with product, dev, and executives</li>
        <li><strong>Process Improvement:</strong> Continuously improve QA processes</li>
        <li><strong>Tool Selection:</strong> Evaluate and implement QA tools</li>
      </ul>
      <h3>Essential Skills:</h3>
      <ul>
        <li><strong>Technical:</strong> Deep testing knowledge, automation expertise</li>
        <li><strong>Leadership:</strong> Team management, conflict resolution, motivation</li>
        <li><strong>Communication:</strong> Clear reporting, presentations, documentation</li>
        <li><strong>Business Acumen:</strong> Understanding product goals and user needs</li>
        <li><strong>Analytical:</strong> Metrics, reporting, data-driven decisions</li>
      </ul>
      <h3>Career Path:</h3>
      <p>QA Engineer → Senior QA → QA Lead → QA Manager → Director of QA → VP of Quality</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/OtP8IUgKPfs',
    quiz: [
      {
        id: 'q1',
        question: 'What distinguishes a QA Lead from a Senior QA Engineer?',
        options: [
          'Only title',
          'Leadership, team management, and strategic responsibilities',
          'Higher salary only',
          'More testing experience'
        ],
        correctAnswer: 1,
        explanation: 'A QA Lead takes on leadership responsibilities including team management, strategy, and stakeholder communication beyond individual contribution.'
      }
    ],
    tags: ['high-flyer', 'career', 'leadership', 'bonus'],
    estimatedTime: 45,
    targetSegments: ['HIGH_FLYER'],
    mandatory: false
  },

  // HIGH-FLYER BONUS MODULE 2
  {
    id: 'mod-bonus-002',
    title: 'Automation Framework Design Patterns',
    category: 'Advanced Automation',
    difficulty: 'advanced',
    content: `
      <h2>Automation Framework Design Patterns</h2>
      <p>Master advanced design patterns for scalable test automation.</p>
      <h3>Essential Design Patterns:</h3>
      <ul>
        <li><strong>Page Object Model:</strong> Separate page structure from test logic</li>
        <li><strong>Factory Pattern:</strong> Create objects without specifying exact class</li>
        <li><strong>Singleton Pattern:</strong> Single instance of driver/configuration</li>
        <li><strong>Strategy Pattern:</strong> Select algorithm at runtime (browser selection)</li>
        <li><strong>Fluent Interface:</strong> Chainable method calls for readability</li>
      </ul>
      <h3>Framework Architecture:</h3>
      <ul>
        <li><strong>Modular:</strong> Independent, reusable components</li>
        <li><strong>Data-Driven:</strong> External data sources for test inputs</li>
        <li><strong>Keyword-Driven:</strong> Abstract test steps into keywords</li>
        <li><strong>Hybrid:</strong> Combination of multiple approaches</li>
      </ul>
      <h3>Best Practices:</h3>
      <ul>
        <li>Follow SOLID principles</li>
        <li>Implement proper error handling and logging</li>
        <li>Use dependency injection</li>
        <li>Maintain clear separation of concerns</li>
        <li>Write self-documenting code</li>
      </ul>
    `,
    videoUrl: 'https://www.youtube.com/embed/O9eVBx8h2fI',
    quiz: [
      {
        id: 'q1',
        question: 'What problem does the Singleton pattern solve in test automation?',
        options: [
          'Faster test execution',
          'Ensures only one instance of driver/config exists',
          'Better reporting',
          'Cross-browser testing'
        ],
        correctAnswer: 1,
        explanation: 'Singleton pattern ensures only one instance of an object (like WebDriver or configuration) exists, preventing resource conflicts.'
      },
      {
        id: 'q2',
        question: 'What is the main benefit of a data-driven framework?',
        options: [
          'No code needed',
          'Run same test with different data sets without code changes',
          'Automatic bug detection',
          'No maintenance required'
        ],
        correctAnswer: 1,
        explanation: 'Data-driven frameworks allow testing multiple scenarios with different data sets by separating test logic from test data.'
      }
    ],
    tags: ['high-flyer', 'automation', 'design-patterns', 'framework', 'bonus'],
    estimatedTime: 60,
    targetSegments: ['HIGH_FLYER'],
    mandatory: false
  }
];

// ============================================================
// STANDARD OPERATING PROCEDURES (SOPs)
// ============================================================

export const mockSOPs: SOP[] = [
  {
    id: 'sop-001',
    title: 'Production Bug Escalation Process',
    criticality: 'critical',
    mandatory: true,
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
    relatedTools: ['tool-001', 'tool-003', 'tool-005'],
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
  },
  {
    id: 'sop-002',
    title: 'Sprint Testing Workflow',
    criticality: 'high',
    mandatory: true,
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
    relatedTools: ['tool-001', 'tool-005', 'tool-003'],
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
  },
  {
    id: 'sop-003',
    title: 'Test Environment Setup & Configuration',
    criticality: 'medium',
    steps: [
      'Submit access request via IT Service Portal',
      'Verify VPN access and credentials work correctly',
      'Install required browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)',
      'Install testing tools: Postman, TestRail, BrowserStack, screen recording software',
      'Configure database connections and verify connectivity',
      'Set up test data sets for different user roles and scenarios',
      'Validate API endpoints are accessible (ping, basic health checks)',
      'Document environment URLs, credentials, and configuration',
      'Run sample end-to-end test to validate complete setup',
      'Bookmark essential resources and documentation'
    ],
    relatedTools: ['tool-002', 'tool-004', 'tool-005'],
    targetSegments: ['ROOKIE']
  },
  {
    id: 'sop-004',
    title: 'Automation Script Code Review Process',
    criticality: 'high',
    steps: [
      'Create feature branch from main: git checkout -b feature/test-name',
      'Write automation scripts following framework standards',
      'Run tests locally and ensure 100% pass rate',
      'Commit with clear message: "Add: Login page test suite"',
      'Push branch to remote: git push origin feature/test-name',
      'Create Pull Request with description, test coverage, and screenshots',
      'Request review from senior automation engineer or QA lead',
      'Address review comments and update code',
      'Re-run tests after changes',
      'Merge to main branch after approval',
      'Verify CI/CD pipeline execution succeeds',
      'Update automation documentation and framework README'
    ],
    relatedTools: ['tool-006', 'tool-007', 'tool-004'],
    targetSegments: ['HIGH_FLYER']
  },
  {
    id: 'sop-005',
    title: 'Bug Triage Meeting Protocol',
    criticality: 'high',
    steps: [
      'Review all new bugs logged since last triage (daily or twice-weekly)',
      'Verify each bug is reproducible with provided steps',
      'Validate severity and priority assignments',
      'Assign bugs to appropriate development team/individual',
      'Identify any duplicate or related issues',
      'Flag blockers and critical issues for immediate attention',
      'Defer low-priority bugs to backlog if needed',
      'Estimate fix effort with development team',
      'Update bug status and add triage notes',
      'Create action items for follow-up or missing information'
    ],
    relatedTools: ['tool-001', 'tool-003'],
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
  },
  {
    id: 'sop-006',
    title: 'Test Case Design & Review',
    criticality: 'medium',
    steps: [
      'Review requirements and acceptance criteria thoroughly',
      'Identify positive, negative, and edge test scenarios',
      'Write test cases in TestRail with clear preconditions',
      'Include detailed step-by-step instructions',
      'Define expected results for each step',
      'Add test data requirements and environment prerequisites',
      'Tag test cases with appropriate labels (smoke, regression, etc.)',
      'Submit test cases for peer review',
      'Address review feedback and update test cases',
      'Get approval from QA lead or senior QA',
      'Link test cases to user stories in Jira',
      'Add to appropriate test suites for execution'
    ],
    relatedTools: ['tool-005', 'tool-001'],
    targetSegments: ['ROOKIE', 'HIGH_FLYER']
  },
  {
    id: 'sop-007',
    title: 'Regression Testing Execution',
    criticality: 'high',
    steps: [
      'Identify scope: full regression vs targeted regression',
      'Create test run in TestRail with appropriate test suite',
      'Assign test cases to QA team members',
      'Execute smoke tests first to validate build stability',
      'Run automated regression suite if available',
      'Execute manual regression test cases',
      'Log any new defects discovered during regression',
      'Retest previously fixed bugs to confirm no regression',
      'Track progress and report daily status',
      'Generate test execution report',
      'Provide summary and go/no-go recommendation',
      'Archive test run results for future reference'
    ],
    relatedTools: ['tool-005', 'tool-001', 'tool-004'],
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER']
  }
];

// ============================================================
// QA TOOLS & TECHNOLOGIES
// ============================================================

export const mockTools: Tool[] = [
  // Generic tools (shown to all teams)
  {
    id: 'tool-001',
    name: 'Jira',
    purpose: 'Project management, issue tracking, and agile workflow management for software teams',
    docsLink: 'https://www.atlassian.com/software/jira/guides',
    integrations: ['Confluence', 'Slack', 'GitHub', 'Jenkins', 'TestRail'],
    category: 'Project Management',
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER'],
    isGeneric: true
  },
  {
    id: 'tool-002',
    name: 'Postman',
    purpose: 'API development, testing, and documentation platform with automation capabilities',
    docsLink: 'https://learning.postman.com/',
    integrations: ['Newman', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
    category: 'API Testing',
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    isGeneric: true
  },
  {
    id: 'tool-003',
    name: 'Slack',
    purpose: 'Team communication, collaboration, and real-time notifications',
    docsLink: 'https://slack.com/help',
    integrations: ['Jira', 'GitHub', 'PagerDuty', 'Jenkins', 'TestRail'],
    category: 'Communication',
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER'],
    isGeneric: true
  },
  {
    id: 'tool-004',
    name: 'TestRail',
    purpose: 'Comprehensive test case management, test execution tracking, and reporting platform',
    docsLink: 'https://www.gurock.com/testrail/docs',
    integrations: ['Jira', 'Jenkins', 'Selenium', 'Slack'],
    category: 'Test Management',
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER'],
    isGeneric: true
  },
  {
    id: 'tool-005',
    name: 'Browser DevTools',
    purpose: 'Built-in browser tools for debugging, inspecting, and testing web applications',
    docsLink: 'https://developer.chrome.com/docs/devtools/',
    integrations: ['N/A - Built into browsers'],
    category: 'Development',
    targetSegments: ['ROOKIE', 'AT_RISK', 'HIGH_FLYER'],
    isGeneric: true
  },
  {
    id: 'tool-006',
    name: 'BrowserStack',
    purpose: 'Cloud-based cross-browser and device testing platform',
    docsLink: 'https://www.browserstack.com/docs',
    integrations: ['Selenium', 'Jenkins', 'Jira', 'GitHub', 'TestRail'],
    category: 'Cross-Browser Testing',
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    isGeneric: true
  },

  // Team-specific tools (NOT shown on Tools page, but used in training)
  {
    id: 'tool-playwright',
    name: 'Playwright',
    purpose: 'Modern end-to-end testing framework for web applications',
    docsLink: 'https://playwright.dev/',
    integrations: ['GitHub Actions', 'Jenkins', 'Azure DevOps'],
    category: 'Automation',
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['Launch', 'Data & Insights', 'AutoDraft', 'DAM'],
    isGeneric: false // Not shown on generic tools page
  },
  {
    id: 'tool-rest-assured',
    name: 'REST Assured',
    purpose: 'Java library for testing REST APIs with BDD-style syntax',
    docsLink: 'https://rest-assured.io/',
    integrations: ['JUnit', 'TestNG', 'Maven', 'Jenkins'],
    category: 'API Testing',
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['AutoDraft', 'DAM'], // Only these teams use REST Assured
    isGeneric: false
  },
  {
    id: 'tool-gocd',
    name: 'GoCD',
    purpose: 'Continuous delivery and deployment orchestration platform',
    docsLink: 'https://docs.gocd.org/',
    integrations: ['GitHub', 'Docker', 'Kubernetes'],
    category: 'CI/CD',
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['Launch', 'Data & Insights', 'AutoDraft', 'DAM'], // High-level understanding for all
    isGeneric: false
  },
  {
    id: 'tool-jenkins',
    name: 'Jenkins',
    purpose: 'Continuous integration and continuous deployment (CI/CD) automation server',
    docsLink: 'https://www.jenkins.io/doc/',
    integrations: ['GitHub', 'Selenium', 'Docker', 'Jira', 'TestRail'],
    category: 'CI/CD',
    targetSegments: ['ROOKIE', 'HIGH_FLYER'],
    targetTeams: ['Launch', 'Data & Insights', 'AutoDraft', 'DAM'], // High-level understanding for all
    isGeneric: false
  },

  // Additional team-specific tools
  {
    id: 'tool-percy',
    name: 'Percy',
    purpose: 'Visual testing and review platform for catching visual regressions',
    docsLink: 'https://docs.percy.io/',
    integrations: ['Playwright', 'Cypress', 'GitHub', 'CI/CD'],
    category: 'Visual Testing',
    targetSegments: ['HIGH_FLYER'],
    targetTeams: ['Launch'],
    isGeneric: false
  },
  {
    id: 'tool-lighthouse',
    name: 'Lighthouse',
    purpose: 'Automated tool for improving web page quality (performance, accessibility, SEO)',
    docsLink: 'https://developer.chrome.com/docs/lighthouse/',
    integrations: ['Chrome DevTools', 'CI/CD', 'Node.js'],
    category: 'Performance',
    targetSegments: ['HIGH_FLYER'],
    targetTeams: ['Launch'],
    isGeneric: false
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// ============================================================
// CONTENTSTACK CACHE for synchronous access
// ============================================================

// Global cache for Contentstack content (modules, SOPs, tools)
let contentstackContentCache: { [key: string]: { modules: Module[], sops: SOP[], tools: Tool[] } } = {};

// Helper to create cache key
const getCacheKey = (team: Team, segment: UserSegment) => `${team}_${segment}`;

// Helper to apply segment-specific logic to modules
// IMPORTANT: Always include completed modules so user's journey is preserved
function applySegmentLogic(
  segment: UserSegment, 
  modules: Module[], 
  completedModules: string[]
): { modules: Module[], tools: Tool[], sops: SOP[] } {
  let processedModules = modules;
  
  // Get all completed modules (preserve user's full journey)
  const completedModuleObjects = modules.filter(m => completedModules.includes(m.id));
  
  // Apply segment-specific logic
  if (segment === 'AT_RISK') {
    // Get all AT_RISK remedial modules
    const remedialModules = modules.filter(m => 
      m.targetSegments.includes('AT_RISK') || 
      m.category === 'Remedial' || 
      m.category === 'At-Risk Support'
    );
    
    // Check if all remedial modules are completed
    const allRemedialComplete = remedialModules.every(m => completedModules.includes(m.id));
    
    if (!allRemedialComplete) {
      // Only show remedial modules + previously completed modules
      // AT_RISK users must complete remedial content first
      processedModules = modules.filter(m => {
        const isRemedial = m.category === 'Remedial' || 
                          m.category === 'At-Risk Support' || 
                          m.targetSegments.includes('AT_RISK');
        const wasCompleted = completedModules.includes(m.id);
        return isRemedial || wasCompleted;
      });
    } else {
      // All remedial complete - show all available content INCLUDING completed remedial
      processedModules = modules.filter(m => 
        m.targetSegments.includes('AT_RISK') || 
        m.targetSegments.includes('ROOKIE') ||
        completedModules.includes(m.id) // Include all completed modules
      );
    }
  } else if (segment === 'HIGH_FLYER') {
    // HIGH_FLYER sees: HIGH_FLYER content + ROOKIE content + ALL completed modules (including remedial)
    processedModules = modules.filter(m => 
      m.targetSegments.includes('HIGH_FLYER') || 
      m.targetSegments.includes('ROOKIE') ||
      completedModules.includes(m.id) // Include all completed modules (remedial, at-risk, etc.)
    );
  } else {
    // ROOKIE: see ROOKIE content + all completed modules (in case they recovered from AT_RISK)
    processedModules = modules.filter(m => 
      m.targetSegments.includes(segment) ||
      completedModules.includes(m.id) // Include all completed modules
    );
  }
  
  // Remove duplicates and sort
  const uniqueModules = Array.from(new Map(processedModules.map(m => [m.id, m])).values());
  const sortedModules = sortModulesByOrder(uniqueModules);
  
  // Return with empty tools and sops (they're fetched separately)
  return {
    modules: sortedModules,
    tools: [],
    sops: []
  };
}

// ============================================================
// ASYNC PERSONALIZED CONTENT (PREFERRED)
// ============================================================

// Async function to get personalized content from Contentstack (PREFERRED)
export async function getPersonalizedContentAsync(
  segment: UserSegment, 
  completedModules: string[] = [],
  team?: Team,
  challengeProVariantAlias?: string // Stored alias from user profile (e.g., "cs_personalize_l_0")
) {
  // Try to fetch from Contentstack first
  let modules: Module[] = [];
  
  try {
    // Fetch modules from Contentstack
    // Pass challengeProVariantAlias to fetch Challenge Pro variants when applicable
    const csModules = await getCsModules(team || 'Launch', segment, challengeProVariantAlias);
    
    if (csModules.length > 0) {
      modules = csModules;
    } else {
      // Fallback to mockData if Contentstack returns empty
      modules = mockModules.filter(m => 
        (!team || !m.targetTeams || m.targetTeams.includes(team)) &&
        m.targetSegments.includes(segment)
      );
    }
  } catch (error) {
    // Fallback to mockData on error
    modules = mockModules.filter(m => 
      (!team || !m.targetTeams || m.targetTeams.includes(team)) &&
      m.targetSegments.includes(segment)
    );
  }
  
  // Apply segment-specific logic using helper
  const result = applySegmentLogic(segment, modules, completedModules);

  // Get SOPs and Tools (already async in getSOPs/getTools)
  const sops = await getSOPs(team || 'Launch', segment);
  const tools = await getTools(team || 'Launch', segment);

  // Store complete content in cache for synchronous access
  if (team) {
    contentstackContentCache[getCacheKey(team, segment)] = {
      modules: result.modules,
      sops,
      tools
    };
  }

  return { modules: result.modules, sops, tools };
}

// Synchronous function for backwards compatibility (uses mockData only)
// ============================================================
// SYNC PERSONALIZED CONTENT (with Contentstack cache)
// ============================================================

export function getPersonalizedContent(
  segment: UserSegment, 
  completedModules: string[] = [],
  team?: Team
) {
  // Check Contentstack cache first
  if (team) {
    const cacheKey = getCacheKey(team, segment);
    if (contentstackContentCache[cacheKey]) {
      return contentstackContentCache[cacheKey];
    }
  }
  
  // Fallback to mockData if cache is empty
  let modules: Module[] = [];
  
  // Filter modules based on team first (if provided)
  let availableModules = mockModules;
  if (team) {
    availableModules = mockModules.filter(m => 
      !m.targetTeams || // No team restriction (general modules)
      m.targetTeams.includes(team) // Or module is for this team
    );
  }
  
  // Content access rules based on segment
  // IMPORTANT: Always include completed modules to preserve user's learning journey
  if (segment === 'AT_RISK') {
    // Get all AT_RISK remedial modules
    const remedialModules = availableModules.filter(m => 
      (m.targetSegments.includes('AT_RISK') || m.category === 'Remedial' || m.category === 'At-Risk Support')
    );
    
    // Check if all remedial modules are completed
    const allRemedialComplete = remedialModules.every(m => completedModules.includes(m.id));
    
    if (!allRemedialComplete) {
      // Only show remedial modules + previously completed modules
      // AT_RISK users must complete remedial content first
      modules = availableModules.filter(m => {
        const isRemedial = m.category === 'Remedial' || m.category === 'At-Risk Support' || 
                          m.targetSegments.includes('AT_RISK');
        const wasCompleted = completedModules.includes(m.id);
        return isRemedial || wasCompleted;
      });
    } else {
      // All remedial complete - show ROOKIE content + all completed modules
      modules = availableModules.filter(m => 
        m.targetSegments.includes('AT_RISK') || 
        m.targetSegments.includes('ROOKIE') ||
        completedModules.includes(m.id) // Include all completed
      );
    }
  } else if (segment === 'HIGH_FLYER') {
    // HIGH_FLYER: HIGH_FLYER + ROOKIE + all completed (including remedial they may have done)
    modules = availableModules.filter(m => 
      m.targetSegments.includes('HIGH_FLYER') || 
      m.targetSegments.includes('ROOKIE') ||
      completedModules.includes(m.id) // Include all completed modules
    );
  } else {
    // ROOKIE: ROOKIE content + all completed (in case they recovered from AT_RISK)
    modules = availableModules.filter(m => 
      m.targetSegments.includes(segment) ||
      completedModules.includes(m.id)
    );
  }
  
  // Remove duplicates
  modules = Array.from(new Map(modules.map(m => [m.id, m])).values());

  const sops = mockSOPs.filter(s => s.targetSegments.includes(segment));
  
  // Filter tools based on team
  let tools = mockTools.filter(t => t.targetSegments.includes(segment));
  if (team) {
    tools = tools.filter(t => 
      t.isGeneric || // Generic tools shown to all
      (t.targetTeams && t.targetTeams.includes(team)) // Or tool is for this team
    );
  }

  return { modules, sops, tools };
}

// Welcome messages based on segment
export const welcomeMessages: Record<UserSegment, string> = {
  ROOKIE: 'Welcome to your QA journey! Let\'s start with the fundamentals and build a strong foundation.',
  AT_RISK: 'We\'ve noticed you need some extra support. These focused resources will help you get back on track and succeed.',
  HIGH_FLYER: 'Outstanding progress! Here are advanced modules and career-accelerating content to take your expertise to the next level.'
};

// Intervention message for At-Risk users
export const atRiskIntervention = {
  title: '⚠️ Performance Gap Detected',
  message: 'We\'ve identified some areas where you need additional support. Don\'t worry—we\'ve curated specific resources to help you succeed.',
  actions: [
    'Review the remedial modules below',
    'Complete the quick practice exercises',
    'Retake the assessment quiz',
    'Reach out to your mentor if you need help'
  ],
  encouragement: 'Remember: Every expert was once a beginner. You\'ve got this! 💪'
};

// Module categories for filtering
export const moduleCategories = [
  'Fundamentals',
  'Defect Management',
  'Tools & Technologies',
  'Processes & Standards',
  'Remedial',
  'At-Risk Support',
  'Advanced Automation',
  'Advanced API Testing',
  'Performance Testing',
  'Test Leadership',
  'Career Development'
];

// Get modules by difficulty
export function getModulesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced') {
  return mockModules.filter(m => m.difficulty === difficulty);
}

// Get mandatory modules for a segment
export function getMandatoryModules(segment: UserSegment) {
  return mockModules.filter(m => m.mandatory && m.targetSegments.includes(segment));
}

// Get remedial modules (for failed quizzes)
export function getRemedialModules() {
  return mockModules.filter(m => m.category === 'Remedial');
}

// Get high-flyer bonus modules
export function getBonusModules() {
  return mockModules.filter(m => m.tags.includes('bonus'));
}

// ============================================================
// CONTENTSTACK INTEGRATION (HYBRID APPROACH)
// ============================================================

import { 
  fetchTools, 
  fetchSOPs, 
  fetchManagerConfig,
  isContentstackEnabled 
} from '@/lib/contentstack';
import { getManagerForTeam } from '@/lib/managerConfig';

/**
 * Get Tools - Fetches from Contentstack if enabled, falls back to mockData
 */
export async function getTools(team?: Team, segment?: UserSegment): Promise<Tool[]> {
  if (isContentstackEnabled) {
    try {
      const tools = await fetchTools(team, segment);
      return tools;
    } catch (error) {
      // Fallback to mockData on error
    }
  }
  
  return mockTools.filter(tool => {
    // Filter by team
    if (team && !tool.isGeneric) {
      // Tool has no target teams = shown to all
      // Tool has target teams = only shown to those teams
      const hasTeamRestriction = 'targetTeams' in tool;
      if (hasTeamRestriction) {
        const targetTeams = (tool as any).targetTeams as Team[] | undefined;
        if (targetTeams && targetTeams.length > 0 && !targetTeams.includes(team)) {
          return false;
        }
      }
    }
    
    // Filter by segment
    if (segment && tool.targetSegments.length > 0) {
      if (!tool.targetSegments.includes(segment)) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Get SOPs - Fetches from Contentstack if enabled, falls back to mockData
 */
export async function getSOPs(team?: Team, segment?: UserSegment): Promise<SOP[]> {
  if (isContentstackEnabled) {
    try {
      const sops = await fetchSOPs(team, segment);
      return sops;
    } catch (error) {
      // Fallback to mockData on error
    }
  }
  
  return mockSOPs.filter(sop => {
    // Filter by team
    if (team) {
      const hasTeamRestriction = 'targetTeams' in sop;
      if (hasTeamRestriction) {
        const targetTeams = (sop as any).targetTeams as Team[] | undefined;
        if (targetTeams && targetTeams.length > 0 && !targetTeams.includes(team)) {
          return false;
        }
      }
    }
    
    // Filter by segment
    if (segment && sop.targetSegments.length > 0) {
      if (!sop.targetSegments.includes(segment)) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Get Manager Config - Fetches from Contentstack if enabled, falls back to mockData
 */
export async function getManagerConfigForTeam(team: Team): Promise<{ name: string; email: string }> {
  if (isContentstackEnabled) {
    try {
      const config = await fetchManagerConfig(team);
      if (config) return config;
    } catch (error) {
      // Fallback to mockData on error
    }
  }
  
  const managerConfig = getManagerForTeam(team);
  return managerConfig ? { name: managerConfig.managerName, email: managerConfig.managerEmail } : { name: 'Manager', email: 'manager@example.com' };
}

// Note: mockModules, mockSOPs, mockTools are already exported above
// No need to re-export them here

