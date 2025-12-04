/**
 * Contentstack Personalize SDK Integration (v1.0.9+)
 * 
 * This module handles analytics tracking for Personalize.
 * It sends user attributes to Contentstack so analytics show in the UI.
 * 
 * NOTE: This is for ANALYTICS ONLY - variant delivery still uses Management API
 * 
 * Uses instance-based approach as per migration guide:
 * https://www.contentstack.com/docs/developers/sdks/personalize-edge-sdk/javascript/javascript-personalize-edge-v109-migration-guide
 */

// SDK instance (not global namespace)
let personalizeInstance: any = null;

// Track initialization state
let isInitialized = false;
let initializationPromise: Promise<any> | null = null;

// Project UID from Contentstack Personalize
const PROJECT_UID = '68a6ec844875734317267dcf';

// Experience short UIDs for HIGH_FLYER personalization by team
// These are the experience IDs from Contentstack Personalize
const HIGH_FLYER_EXPERIENCES: Record<string, string> = {
  'Launch': '9',
  'DAM': 'c',
  'Data & Insights': 'd',
  'AutoDraft': 'e',
};

/**
 * Initialize Personalize SDK (client-side only)
 * Returns the SDK instance for method calls
 * Safe to call multiple times - will only initialize once
 */
export async function initializePersonalize(): Promise<boolean> {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.log('⏭️ Personalize: Skipping initialization (server-side)');
    return false;
  }

  // Already initialized
  if (isInitialized && personalizeInstance) {
    return true;
  }

  // Already initializing
  if (initializationPromise) {
    await initializationPromise;
    return isInitialized;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      // Dynamic import to avoid SSR issues
      const PersonalizeModule = await import('@contentstack/personalize-edge-sdk');
      const Personalize = PersonalizeModule.default || PersonalizeModule;
      
      // Initialize and store the SDK INSTANCE (not global namespace)
      personalizeInstance = await Personalize.init(PROJECT_UID);
      isInitialized = true;
      
      return personalizeInstance;
    } catch (error) {
      // Silent fail - don't block the app if personalize fails
      console.warn('Personalize SDK initialization skipped:', error instanceof Error ? error.message : 'Unknown error');
      isInitialized = false;
      return null;
    }
  })();

  await initializationPromise;
  return isInitialized;
}

/**
 * Get the SDK instance (initialize if needed)
 */
async function getSDKInstance(): Promise<any> {
  if (personalizeInstance) {
    return personalizeInstance;
  }
  
  await initializePersonalize();
  return personalizeInstance;
}

/**
 * Set user attributes for Personalize analytics
 * 
 * @param attributes - User attributes to send
 * @example
 * setPersonalizeAttributes({
 *   QA_LEVEL: 'HIGH_FLYER',
 *   TEAM_NAME: 'Launch'
 * });
 */
export async function setPersonalizeAttributes(attributes: {
  QA_LEVEL: string;
  TEAM_NAME: string;
}): Promise<boolean> {
  // Only run on client side
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Get SDK instance
    const sdk = await getSDKInstance();
    if (!sdk) {
      return false;
    }
    
    // Use instance method: sdk.set() instead of Personalize.set()
    await sdk.set(attributes);
    
    // IMPORTANT: Trigger impressions for HIGH_FLYER analytics
    // This triggers when:
    // 1. User logs in as HIGH_FLYER (returning user)
    // 2. User transitions from ROOKIE to HIGH_FLYER (promotion)
    if (attributes.QA_LEVEL === 'HIGH_FLYER') {
      const experienceUid = HIGH_FLYER_EXPERIENCES[attributes.TEAM_NAME];
      if (experienceUid) {
        try {
          await sdk.triggerImpression(experienceUid);
          console.log(`✅ Personalize: Triggered impression for ${attributes.TEAM_NAME} HIGH_FLYER (exp: ${experienceUid})`);
        } catch {
          // Silently ignore impression errors
        }
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Personalize: Failed to set attributes:', error);
    return false;
  }
}

/**
 * Trigger an impression for analytics
 * 
 * @param experienceShortUid - The experience short UID
 */
export async function triggerImpression(experienceShortUid: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const sdk = await getSDKInstance();
    if (!sdk) return false;

    await sdk.triggerImpression(experienceShortUid);
    return true;
  } catch {
    return false;
  }
}

/**
 * Track a custom event for analytics
 * 
 * Supported events:
 * - click: User clicks on a module
 * - module_complete: User completes a module
 * - quiz_pass: User passes a quiz (score >= 70)
 * - quiz_fail: User fails a quiz (score < 50)
 * - onboarding_complete: User completes onboarding
 * 
 * @param eventName - Name of the event
 * @param eventData - Optional event data
 */
export async function trackEvent(
  eventName: 'click' | 'module_complete' | 'quiz_pass' | 'quiz_fail' | 'onboarding_complete' | string,
  eventData?: Record<string, any>
): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const sdk = await getSDKInstance();
    if (!sdk) {
      return false;
    }
    
    // Use instance method: sdk.triggerEvent()
    if (typeof sdk.triggerEvent === 'function') {
      await sdk.triggerEvent(eventName);
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

// Alias for backwards compatibility
export const trackPersonalizeEvent = trackEvent;

/**
 * Get active variants for current user
 */
export async function getVariants(): Promise<any> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const sdk = await getSDKInstance();
    if (!sdk) return null;

    return sdk.getVariants();
  } catch (error) {
    console.error('❌ Personalize: Failed to get variants:', error);
    return null;
  }
}

// Export for debugging
export function getPersonalizeState() {
  return {
    isInitialized,
    projectUid: PROJECT_UID,
    hasInstance: !!personalizeInstance
  };
}

