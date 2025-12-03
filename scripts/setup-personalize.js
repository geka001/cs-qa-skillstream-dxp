#!/usr/bin/env node

/**
 * Contentstack Personalize Setup Script
 * Creates audiences and experiences for QA SkillStream DXP
 * 
 * Note: This script provides the configuration. 
 * Actual implementation requires using Contentstack UI or Personalize API
 */

const https = require('https');

const CONFIG = {
  apiKey: process.env.CONTENTSTACK_STACK_API_KEY || 'blt8202119c48319b1d',
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || 'cs911496f76cbfb543bb764ae7',
  region: 'na',
  apiHost: 'api.contentstack.io'
};

console.log('🎯 CONTENTSTACK PERSONALIZE SETUP GUIDE\n');
console.log('=' .repeat(60) + '\n');

console.log('📋 OVERVIEW\n');
console.log('Personalize allows you to deliver different content experiences');
console.log('based on user attributes, behavior, and context.\n');

console.log('For QA SkillStream, we have 3 user segments:\n');
console.log('  1. ROOKIE - New QA professionals');
console.log('  2. AT_RISK - Learners needing extra support');
console.log('  3. HIGH_FLYER - Advanced learners\n');

console.log('=' .repeat(60) + '\n');

console.log('🎯 STEP 1: CREATE AUDIENCES IN CONTENTSTACK UI\n');
console.log('Go to: Contentstack → Personalize → Audiences → Create New\n');

console.log('📌 Audience 1: Rookie Learners');
console.log('  Name: Rookie Learners');
console.log('  UID: rookie_learners');
console.log('  Conditions:');
console.log('    - Attribute: segment');
console.log('    - Operator: equals');
console.log('    - Value: "ROOKIE"');
console.log('  Description: New QA professionals in onboarding\n');

console.log('📌 Audience 2: At-Risk Learners');
console.log('  Name: At-Risk Learners');
console.log('  UID: at_risk_learners');
console.log('  Conditions:');
console.log('    - Attribute: segment');
console.log('    - Operator: equals');
console.log('    - Value: "AT_RISK"');
console.log('  Description: Learners who need remedial support\n');

console.log('📌 Audience 3: High-Flyer Learners');
console.log('  Name: High-Flyer Learners');
console.log('  UID: high_flyer_learners');
console.log('  Conditions:');
console.log('    - Attribute: segment');
console.log('    - Operator: equals');
console.log('    - Value: "HIGH_FLYER"');
console.log('  Description: Advanced learners ready for complex topics\n');

console.log('=' .repeat(60) + '\n');

console.log('🎯 STEP 2: CREATE EXPERIENCES IN CONTENTSTACK UI\n');
console.log('Go to: Contentstack → Personalize → Experiences → Create New\n');

console.log('📌 Experience 1: Rookie Onboarding');
console.log('  Name: Rookie Onboarding Experience');
console.log('  UID: rookie_onboarding');
console.log('  Audience: Rookie Learners');
console.log('  Content Rules:');
console.log('    - Show modules with segment_taxonomy: "rookie"');
console.log('    - Show modules with difficulty_taxonomy: "beginner"');
console.log('    - Show modules with learning_path_taxonomy: "fundamentals"');
console.log('    - Show all mandatory modules');
console.log('  Priority: Medium\n');

console.log('📌 Experience 2: Remedial Support');
console.log('  Name: Remedial Support Experience');
console.log('  UID: remedial_support');
console.log('  Audience: At-Risk Learners');
console.log('  Content Rules:');
console.log('    - Show modules with learning_path_taxonomy: "remedial"');
console.log('    - Show modules with segment_taxonomy: "at_risk"');
console.log('    - Show simplified SOPs');
console.log('    - Show all ROOKIE modules (for catch-up)');
console.log('  Priority: High (overrides default)\n');

console.log('📌 Experience 3: Advanced Learning');
console.log('  Name: Advanced Learning Experience');
console.log('  UID: advanced_learning');
console.log('  Audience: High-Flyer Learners');
console.log('  Content Rules:');
console.log('    - Show modules with segment_taxonomy: "high_flyer"');
console.log('    - Show modules with difficulty_taxonomy: "advanced"');
console.log('    - Show modules with learning_path_taxonomy: "advanced", "expert"');
console.log('    - Show performance testing modules');
console.log('  Priority: Medium\n');

console.log('📌 Experience 4: Default Experience');
console.log('  Name: Default Learning Experience');
console.log('  UID: default_experience');
console.log('  Audience: All Users (fallback)');
console.log('  Content Rules:');
console.log('    - Show all published content');
console.log('    - No special filtering');
console.log('  Priority: Low (default fallback)\n');

console.log('=' .repeat(60) + '\n');

console.log('🎯 STEP 3: CONFIGURE PERSONALIZATION RULES\n');

console.log('📌 Rule 1: Show Remedial Modules to At-Risk Users');
console.log('  IF: User segment = "AT_RISK"');
console.log('  THEN: Show modules WHERE learning_path_taxonomy contains "remedial"');
console.log('  AND: Hide advanced modules\n');

console.log('📌 Rule 2: Show Advanced Modules to High-Flyers');
console.log('  IF: User segment = "HIGH_FLYER"');
console.log('  AND: User completed 4+ modules');
console.log('  THEN: Show modules WHERE difficulty_taxonomy = "advanced"\n');

console.log('📌 Rule 3: Progressive Unlocking for Rookies');
console.log('  IF: User segment = "ROOKIE"');
console.log('  THEN: Show modules in order (fundamentals → intermediate)');
console.log('  AND: Lock advanced modules until fundamentals complete\n');

console.log('=' .repeat(60) + '\n');

console.log('🎯 STEP 4: IMPLEMENTATION IN APPLICATION\n');

console.log('📝 Update your application code:\n');

console.log('```javascript');
console.log('// In lib/contentstack.ts - Add personalize headers');
console.log('');
console.log('async function fetchWithPersonalize(contentType, userContext) {');
console.log('  const url = buildUrl(contentType);');
console.log('  ');
console.log('  const response = await fetch(url, {');
console.log('    method: "GET",');
console.log('    headers: {');
console.log('      "api_key": CONTENTSTACK_CONFIG.apiKey,');
console.log('      "access_token": CONTENTSTACK_CONFIG.deliveryToken,');
console.log('      "Content-Type": "application/json",');
console.log('      // Add personalization context');
console.log('      "x-cs-personalize": JSON.stringify({');
console.log('        segment: userContext.segment,');
console.log('        completedModules: userContext.completedModules,');
console.log('        averageScore: userContext.avgScore');
console.log('      })');
console.log('    }');
console.log('  });');
console.log('  ');
console.log('  return await response.json();');
console.log('}');
console.log('```\n');

console.log('=' .repeat(60) + '\n');

console.log('🎯 STEP 5: TESTING YOUR PERSONALIZATION\n');

console.log('1. Create test users with different segments');
console.log('2. Verify each user sees appropriate content');
console.log('3. Check that experiences are applied correctly');
console.log('4. Validate fallback to default experience\n');

console.log('Test scenarios:');
console.log('  ✅ ROOKIE user sees only beginner modules');
console.log('  ✅ AT_RISK user sees remedial + rookie modules');
console.log('  ✅ HIGH_FLYER user sees advanced modules');
console.log('  ✅ Content changes dynamically when segment changes\n');

console.log('=' .repeat(60) + '\n');

console.log('📊 BENEFITS OF PERSONALIZE\n');
console.log('  ✅ No hardcoded filtering in application');
console.log('  ✅ Business users can manage experiences');
console.log('  ✅ A/B testing capabilities');
console.log('  ✅ Real-time experience optimization');
console.log('  ✅ Analytics on experience performance');
console.log('  ✅ Easy to add new segments/experiences\n');

console.log('=' .repeat(60) + '\n');

console.log('🔗 USEFUL LINKS\n');
console.log(`  Contentstack Dashboard: https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/dashboard`);
console.log(`  Personalize: https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/personalize`);
console.log(`  Audiences: https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/personalize/audiences`);
console.log(`  Experiences: https://app.contentstack.com/#!/stack/${CONFIG.apiKey}/personalize/experiences\n`);

console.log('=' .repeat(60) + '\n');

console.log('📝 NEXT STEPS:\n');
console.log('  1. ✅ Create audiences in Contentstack UI (follow Step 1 above)');
console.log('  2. ✅ Create experiences in Contentstack UI (follow Step 2 above)');
console.log('  3. ✅ Set up personalization rules (follow Step 3 above)');
console.log('  4. ✅ Update application code (see setup-personalize-app.js)');
console.log('  5. ✅ Test with different user segments');
console.log('  6. ✅ Monitor analytics and optimize\n');

console.log('=' .repeat(60) + '\n');

console.log('💡 TIP: Start with just 2 experiences (ROOKIE and AT_RISK)');
console.log('and add more as you validate the approach.\n');

console.log('✨ Setup guide complete! Follow the steps above in Contentstack UI.\n');

