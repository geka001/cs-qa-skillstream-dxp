#!/usr/bin/env node

/**
 * Alternative Contentstack Setup using official SDK
 * Install: npm install @contentstack/management
 */

console.log('\n⚠️  SSL Certificate Error Workaround\n');
console.log('The setup script encountered an SSL certificate error.');
console.log('This is common in corporate environments.\n');

console.log('📋 ALTERNATIVE SETUP OPTIONS:\n');

console.log('══════════════════════════════════════════════════════════════');
console.log('OPTION 1: Use Contentstack CLI (Recommended)');
console.log('══════════════════════════════════════════════════════════════\n');

console.log('1. Install Contentstack CLI:');
console.log('   npm install -g @contentstack/cli\n');

console.log('2. Login to Contentstack:');
console.log('   csdx auth:login\n');

console.log('3. Create content types manually in Contentstack UI:');
console.log('   https://app.contentstack.com/#!/stack/blt8202119c48319b1d/content-types\n');

console.log('══════════════════════════════════════════════════════════════');
console.log('OPTION 2: Use Contentstack UI (Easiest)');
console.log('══════════════════════════════════════════════════════════════\n');

console.log('Follow the step-by-step guide in CONTENTSTACK_SETUP.md\n');
console.log('OR use the quick setup below:\n');

console.log('1. Log into Contentstack:');
console.log('   https://app.contentstack.com\n');

console.log('2. Navigate to your stack:');
console.log('   Stack API Key: blt8202119c48319b1d\n');

console.log('3. Go to Content Models → Create Content Type\n');

console.log('4. Create these 5 content types:\n');

console.log('   ✓ quiz_item');
console.log('     - question_id (Single Line Text, unique)');
console.log('     - question (Multi-line Text)');
console.log('     - options (JSON)');
console.log('     - correct_answer (Number)');
console.log('     - explanation (Multi-line Text)\n');

console.log('   ✓ qa_tool');
console.log('     - tool_id (Single Line Text, unique)');
console.log('     - name (Single Line Text)');
console.log('     - purpose (Multi-line Text)');
console.log('     - docs_link (Single Line Text)');
console.log('     - integrations (JSON)');
console.log('     - category (Single Line Text)');
console.log('     - target_segments (JSON)\n');

console.log('   ✓ sop');
console.log('     - sop_id (Single Line Text, unique)');
console.log('     - title (Single Line Text)');
console.log('     - criticality (Single Line Text)');
console.log('     - steps (JSON)');
console.log('     - related_tools (Reference → qa_tool, multiple)');
console.log('     - target_segments (JSON)\n');

console.log('   ✓ qa_module (ENABLE PERSONALIZE)');
console.log('     - module_id (Single Line Text, unique)');
console.log('     - title (Single Line Text)');
console.log('     - category (Single Line Text)');
console.log('     - difficulty (Single Line Text)');
console.log('     - content (Rich Text Editor)');
console.log('     - video_url (Single Line Text)');
console.log('     - quiz (Reference → quiz_item, multiple)');
console.log('     - tags (JSON)');
console.log('     - estimated_time (Number)');
console.log('     - target_segments (JSON)');
console.log('     - mandatory (Boolean)');
console.log('     - related_tools (Reference → qa_tool, multiple)\n');

console.log('   ✓ personalization_config');
console.log('     - segment_type (Single Line Text, unique)');
console.log('     - welcome_message (Multi-line Text)');
console.log('     - intervention_config (JSON)');
console.log('     - badge_color (Single Line Text)');
console.log('     - description (Multi-line Text)\n');

console.log('5. Create sample entries using data from:');
console.log('   /Users/geethanjali.kandasamy/Desktop/cs-qa-skillstream-dxp/data/mockData.ts\n');

console.log('══════════════════════════════════════════════════════════════');
console.log('OPTION 3: Skip SSL Verification (Development Only)');
console.log('══════════════════════════════════════════════════════════════\n');

console.log('⚠️  WARNING: Only use in development, never in production!\n');
console.log('Run:');
console.log('   NODE_TLS_REJECT_UNAUTHORIZED=0 npm run setup:contentstack\n');

console.log('══════════════════════════════════════════════════════════════');
console.log('OPTION 4: Use Mock Data (Continue Development)');
console.log('══════════════════════════════════════════════════════════════\n');

console.log('You can continue developing with mock data:');
console.log('1. Keep NEXT_PUBLIC_USE_CONTENTSTACK=false in .env.local');
console.log('2. The app will use data from mockData.ts');
console.log('3. Set up Contentstack later when ready\n');

console.log('══════════════════════════════════════════════════════════════\n');
console.log('📚 For more details, see:');
console.log('   - CONTENTSTACK_SETUP.md');
console.log('   - CONTENTSTACK_GUIDE.md');
console.log('   - CONTENTSTACK_IMPLEMENTATION.md\n');

console.log('💡 Tip: Most users find Option 2 (UI) the easiest!\n');

