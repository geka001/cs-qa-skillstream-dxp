/**
 * Challenge Pro Feature
 * 
 * This module handles the "Challenge Pro" feature for HIGH_FLYER users.
 * When a HIGH_FLYER user clicks "Challenge Pro", they unlock advanced
 * variant content for their team's base module.
 * 
 * Flow:
 * 1. User clicks "Challenge Pro" button
 * 2. Check if experience exists for <team>-high-flyer-pro
 * 3. If not, create via Personalize Management API
 * 4. Create entry variant under base ROOKIE module
 * 5. Set user attribute: challenge_pro = true
 * 6. User receives variant content via Delivery API
 */

import { setPersonalizeAttributes } from './personalize';

// ============================================================
// CONFIGURATION
// ============================================================

const PERSONALIZE_PROJECT_UID = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID || '68a6ec844875734317267dcf';

// Team to Base Module mapping (ROOKIE modules that will have Challenge Pro variants)
export const TEAM_BASE_MODULES: Record<string, {
  entryUid: string;
  moduleId: string;
  title: string;
}> = {
  'DAM': {
    entryUid: 'bltd069d3450c3975ea',
    moduleId: 'mod-dam-001',
    title: 'Getting Started with DAM'
  },
  'AutoDraft': {
    entryUid: 'bltbd110fb0e89ede58',
    moduleId: 'mod-autodraft-001',
    title: 'Getting Started with AutoDraft'
  },
  'Data & Insights': {
    entryUid: 'bltb55135982e4662ed',
    moduleId: 'mod-data-001',
    title: 'Getting Started with Data & Insights'
  },
  'Launch': {
    entryUid: 'blt25efa166fab8cd74',
    moduleId: 'mod-launch-0001',
    title: 'Introduction to Contentstack Launch'
  },
  'Visual Builder': {
    // Visual Builder doesn't have a team-specific base module yet
    // Use a generic module - the Challenge Pro content will still be team-specific
    entryUid: 'blt8a6fc4a91658c84e', // API Testing Fundamentals (generic)
    moduleId: 'mod-testing-001',
    title: 'API Testing Fundamentals'
  }
};

// Existing HIGH_FLYER experiences (for reference)
export const EXISTING_HIGH_FLYER_EXPERIENCES: Record<string, {
  experienceUid: string;
  experienceShortUid: string;
  variantGroupUid: string;
}> = {
  'Launch': {
    experienceUid: '692eb55fe97e5a98f368d501',
    experienceShortUid: '9',
    variantGroupUid: 'cs473b29644b9967b9'
  },
  'DAM': {
    experienceUid: '69303ebf78ec0b5baa6d95f7',
    experienceShortUid: 'c',
    variantGroupUid: 'cs1a64519d3ef700a9'
  },
  'Data & Insights': {
    experienceUid: '69303f2b63bd604e8a083a9e',
    experienceShortUid: 'd',
    variantGroupUid: 'cs2b18613ac4229bf8'
  },
  'AutoDraft': {
    experienceUid: '69303f6e2a9f051bc9ddb4be',
    experienceShortUid: 'e',
    variantGroupUid: 'csa9aae8e27d4725e7'
  }
};

// ============================================================
// TYPES
// ============================================================

export interface ChallengeProStatus {
  enabled: boolean;
  acceptedAt?: string;
  teamName: string;
  experienceShortUid?: string;
}

export interface ChallengeProResult {
  success: boolean;
  message: string;
  experienceShortUid?: string;
  variantAlias?: string;
}

// ============================================================
// CHALLENGE PRO CONTENT TEMPLATES
// ============================================================

/**
 * Generate advanced Challenge Pro content based on team
 */
export function generateChallengeProContent(teamName: string): {
  title: string;
  content: string;
  moduleId: string;
  quizItems: string[];
} {
  const teamLower = teamName.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
  const moduleId = `mod-${teamLower}-pro-001`;
  
  const contentTemplates: Record<string, { title: string; content: string; quizItems: string[] }> = {
    'DAM': {
      title: 'DAM Pro: Enterprise Architecture & Advanced Workflows',
      content: `<h2>🚀 DAM Pro Challenge: Enterprise Architecture</h2>
<p><strong>Congratulations!</strong> You've accepted the Challenge Pro and unlocked our most advanced DAM training.</p>

<h3>🏗️ Enterprise DAM Architecture</h3>
<ul>
  <li><strong>Multi-Region Active-Active Architecture</strong>: Design systems serving assets from nearest location</li>
  <li><strong>CDN Edge Optimization</strong>: Intelligent edge caching with cache invalidation patterns</li>
  <li><strong>Failover & Disaster Recovery</strong>: Resilient systems with automatic failover</li>
</ul>

<h3>⚡ Advanced Transformation Pipelines</h3>
<ul>
  <li><strong>Queue-Based Processing</strong>: Rate-limited batch processing with priority queues</li>
  <li><strong>ML-Powered Transformations</strong>: AI for smart cropping, background removal</li>
  <li><strong>Format Negotiation</strong>: Automatic format selection (WebP, AVIF, HEIC)</li>
</ul>

<h3>🔐 Enterprise Compliance</h3>
<ul>
  <li><strong>Immutable Versioning</strong>: Cryptographic hashing for audit trails</li>
  <li><strong>Retention Policies</strong>: Automated lifecycle management</li>
  <li><strong>Access Control</strong>: Attribute-based access control (ABAC)</li>
</ul>

<h3>🎯 Challenge Exercise</h3>
<p>Design a DAM architecture for a global platform with 5M daily users, 10TB assets, 99.99% availability.</p>`,
      quizItems: ['q-dam-pro-001', 'q-dam-pro-002', 'q-dam-pro-003']
    },
    'Launch': {
      title: 'Launch Pro: Advanced Deployment Strategies',
      content: `<h2>🚀 Launch Pro Challenge: Advanced Deployment Strategies</h2>
<p><strong>Congratulations!</strong> You've accepted the Challenge Pro and unlocked advanced Launch training.</p>

<h3>🏗️ Multi-Environment Architecture</h3>
<ul>
  <li><strong>Blue-Green Deployments</strong>: Zero-downtime deployment strategies</li>
  <li><strong>Canary Releases</strong>: Gradual rollout with real-time monitoring</li>
  <li><strong>Feature Flags</strong>: Dynamic feature control without redeployment</li>
</ul>

<h3>⚡ Performance Optimization</h3>
<ul>
  <li><strong>Edge Caching Strategies</strong>: CDN configuration for global performance</li>
  <li><strong>Build Optimization</strong>: Reduce build times with incremental builds</li>
  <li><strong>Asset Optimization</strong>: Image compression and lazy loading</li>
</ul>

<h3>🔐 Security & Compliance</h3>
<ul>
  <li><strong>Environment Variables</strong>: Secure secrets management</li>
  <li><strong>Access Control</strong>: Role-based deployment permissions</li>
  <li><strong>Audit Logging</strong>: Complete deployment history</li>
</ul>

<h3>🎯 Challenge Exercise</h3>
<p>Design a CI/CD pipeline with blue-green deployment for a high-traffic e-commerce site.</p>`,
      quizItems: ['q-launch-pro-001', 'q-launch-pro-002', 'q-launch-pro-003']
    },
    'AutoDraft': {
      title: 'AutoDraft Pro: AI-Powered Content Mastery',
      content: `<h2>🚀 AutoDraft Pro Challenge: AI-Powered Content Mastery</h2>
<p><strong>Congratulations!</strong> You've accepted the Challenge Pro and unlocked advanced AutoDraft training.</p>

<h3>🤖 Advanced Prompt Engineering</h3>
<ul>
  <li><strong>Context Windows</strong>: Maximize AI understanding with structured prompts</li>
  <li><strong>Chain-of-Thought</strong>: Guide AI through complex reasoning</li>
  <li><strong>Few-Shot Learning</strong>: Provide examples for consistent output</li>
</ul>

<h3>⚡ Content Pipeline Automation</h3>
<ul>
  <li><strong>Batch Processing</strong>: Generate content at scale</li>
  <li><strong>Quality Gates</strong>: Automated content validation</li>
  <li><strong>Brand Voice Enforcement</strong>: Consistent tone across content</li>
</ul>

<h3>🔐 Enterprise AI Governance</h3>
<ul>
  <li><strong>Content Auditing</strong>: Track AI-generated vs human content</li>
  <li><strong>Compliance Checks</strong>: Ensure regulatory compliance</li>
  <li><strong>Bias Detection</strong>: Identify and mitigate content bias</li>
</ul>

<h3>🎯 Challenge Exercise</h3>
<p>Create an automated content pipeline that generates, validates, and publishes 100 product descriptions.</p>`,
      quizItems: ['q-autodraft-pro-001', 'q-autodraft-pro-002', 'q-autodraft-pro-003']
    },
    'Data & Insights': {
      title: 'Data & Insights Pro: Advanced Analytics Architecture',
      content: `<h2>🚀 Data & Insights Pro Challenge: Advanced Analytics</h2>
<p><strong>Congratulations!</strong> You've accepted the Challenge Pro and unlocked advanced analytics training.</p>

<h3>📊 Advanced Data Architecture</h3>
<ul>
  <li><strong>Data Lake Design</strong>: Scalable data storage patterns</li>
  <li><strong>Real-time Streaming</strong>: Process events as they happen</li>
  <li><strong>Data Governance</strong>: Ensure data quality and compliance</li>
</ul>

<h3>⚡ Machine Learning Integration</h3>
<ul>
  <li><strong>Predictive Analytics</strong>: Forecast user behavior</li>
  <li><strong>Anomaly Detection</strong>: Identify unusual patterns automatically</li>
  <li><strong>Personalization Models</strong>: ML-driven content recommendations</li>
</ul>

<h3>🔐 Privacy & Compliance</h3>
<ul>
  <li><strong>GDPR Compliance</strong>: Data protection implementation</li>
  <li><strong>Consent Management</strong>: Track and honor user preferences</li>
  <li><strong>Data Anonymization</strong>: Protect PII in analytics</li>
</ul>

<h3>🎯 Challenge Exercise</h3>
<p>Design a real-time analytics pipeline that processes 1M events/day with GDPR compliance.</p>`,
      quizItems: ['q-data-pro-001', 'q-data-pro-002', 'q-data-pro-003']
    },
    'Visual Builder': {
      title: 'Visual Builder Pro: Enterprise Component Architecture',
      content: `<h2>🚀 Visual Builder Pro Challenge: Enterprise Component Architecture</h2>
<p><strong>Congratulations!</strong> You've accepted the Challenge Pro and unlocked advanced Visual Builder training.</p>

<h3>🏗️ Component Architecture</h3>
<ul>
  <li><strong>Design System Integration</strong>: Connect with enterprise design systems</li>
  <li><strong>Component Composition</strong>: Build complex layouts from atomic components</li>
  <li><strong>Variant Management</strong>: Handle multi-brand component variations</li>
</ul>

<h3>⚡ Performance Optimization</h3>
<ul>
  <li><strong>Lazy Loading Strategies</strong>: Optimize initial page load</li>
  <li><strong>Bundle Analysis</strong>: Reduce component bundle sizes</li>
  <li><strong>Caching Patterns</strong>: Efficient component state caching</li>
</ul>

<h3>🔐 Enterprise Governance</h3>
<ul>
  <li><strong>Component Versioning</strong>: Manage component lifecycle</li>
  <li><strong>Access Control</strong>: Role-based editing permissions</li>
  <li><strong>Audit Trails</strong>: Track all visual changes</li>
</ul>

<h3>🎯 Challenge Exercise</h3>
<p>Build a component library with 20+ components, theme support, and design token integration.</p>`,
      quizItems: ['q-vb-pro-001', 'q-vb-pro-002', 'q-vb-pro-003']
    }
  };
  
  const teamContent = contentTemplates[teamName];
  if (teamContent) {
    return {
      ...teamContent,
      moduleId
    };
  }
  
  return {
    title: `${teamName} Pro: Advanced Mastery`,
    content: `<h2>🚀 ${teamName} Pro Challenge</h2><p>Advanced training content for ${teamName} team.</p>`,
    moduleId,
    quizItems: []
  };
}

// ============================================================
// CLIENT-SIDE FUNCTIONS
// ============================================================

/**
 * Activate Challenge Pro for a user
 * This is called when user clicks the "Challenge Pro" button
 */
export async function activateChallengePro(
  teamName: string,
  userName: string
): Promise<ChallengeProResult> {
  try {
    // Get token from localStorage for API call
    const { tokenManager } = await import('@/lib/tokenManager');
    const tokenData = await tokenManager.getTokenData();
    
    // Build headers with token if available
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (tokenData) {
      headers['Authorization'] = `Bearer ${tokenData.access_token}`;
      if (tokenData.organization_uid) {
        headers['organization-uid'] = tokenData.organization_uid;
      }
    }
    
    // Call the API route to handle server-side operations
    const response = await fetch('/api/challenge-pro/activate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        teamName,
        userName
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to activate Challenge Pro'
      };
    }
    
    const result = await response.json();
    
    // Set Personalize attributes on client-side
    // The user stays HIGH_FLYER but gets challenge_pro attribute
    await setPersonalizeAttributes({
      QA_LEVEL: 'HIGH_FLYER',
      TEAM_NAME: teamName
    });
    
    // Set challenge_pro attribute separately if SDK supports it
    // This will be handled via custom attribute
    
    return {
      success: true,
      message: 'Challenge Pro activated! New advanced content unlocked.',
      experienceShortUid: result.experienceShortUid,
      variantAlias: result.variantAlias
    };
    
  } catch (error) {
    console.error('Error activating Challenge Pro:', error);
    return {
      success: false,
      message: 'An error occurred while activating Challenge Pro'
    };
  }
}

/**
 * Check if Challenge Pro experience exists for a team
 */
export async function checkChallengeProExists(teamName: string): Promise<{
  exists: boolean;
  experienceShortUid?: string;
}> {
  try {
    // Get token from localStorage for API call
    const { tokenManager } = await import('@/lib/tokenManager');
    const tokenData = await tokenManager.getTokenData();
    
    // Build headers with token if available
    const headers: HeadersInit = {};
    
    if (tokenData) {
      headers['Authorization'] = `Bearer ${tokenData.access_token}`;
      if (tokenData.organization_uid) {
        headers['organization-uid'] = tokenData.organization_uid;
      }
    }
    
    const response = await fetch(`/api/challenge-pro/check?team=${encodeURIComponent(teamName)}`, {
      headers
    });
    
    if (!response.ok) {
      return { exists: false };
    }
    
    const result = await response.json();
    return {
      exists: result.exists,
      experienceShortUid: result.experienceShortUid
    };
    
  } catch (error) {
    console.error('Error checking Challenge Pro:', error);
    return { exists: false };
  }
}

/**
 * Get Challenge Pro variant alias for delivery
 */
export function getChallengeProVariantAlias(experienceShortUid: string): string {
  return `cs_personalize_${experienceShortUid}_0`;
}

