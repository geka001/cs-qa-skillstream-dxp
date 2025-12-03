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
      console.log('🔄 Personalize: Initializing SDK (v1.0.9+ instance-based)...');
      console.log(`   Project UID: ${PROJECT_UID}`);
      
      // Dynamic import to avoid SSR issues
      const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
      
      // Initialize and store the SDK INSTANCE (not global namespace)
      // As per v1.0.9 migration guide: const sdk = await Personalize.init('<project_uid>')
      personalizeInstance = await Personalize.init(PROJECT_UID);
      
      isInitialized = true;
      console.log('✅ Personalize: SDK instance created successfully');
      
      return personalizeInstance;
    } catch (error) {
      console.error('❌ Personalize: Failed to initialize SDK:', error);
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
      console.warn('⚠️ Personalize: SDK instance not available, skipping attribute set');
      return false;
    }

    console.log('📊 Personalize: Setting user attributes:', attributes);
    
    // Use instance method: sdk.set() instead of Personalize.set()
    await sdk.set(attributes);
    
    console.log('✅ Personalize: Attributes set successfully');
    
    // IMPORTANT: Trigger impressions for analytics
    try {
      console.log('📊 Personalize: Triggering variant evaluation for analytics...');
      console.log('   Attributes sent:', JSON.stringify(attributes));
      
      // Small delay to ensure attributes are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const variants = await sdk.getVariants();
      console.log('✅ Personalize: Variant evaluation complete');
      console.log('   Active variants:', JSON.stringify(variants, null, 2));
      
      // Check if any variant matched
      const hasMatch = Object.values(variants || {}).some(v => v !== null);
    //   if (hasMatch) {
    //     console.log('   ✅ At least one experience matched - impressions recorded!');
    //   } else {
    //     console.warn('   ⚠️ No experiences matched via getVariants()');
      
        // Try manually triggering impression for the known experience
        // Experience "Launch High Flyer" has short UID "0"
        if (attributes.QA_LEVEL === 'HIGH_FLYER' && attributes.TEAM_NAME === 'Launch') {
          console.log('   🔄 Manually triggering impression for "Launch High Flyer" (shortUid: 0)...');
          try {
            await sdk.triggerImpression('0');
            console.log('   ✅ Manual impression triggered for experience 0!');
            console.log('   📡 Check Network tab for requests to personalize-edge.contentstack.com');
          } catch (impError: any) {
            console.warn('   ⚠️ Manual impression failed:', impError?.message || impError);
          }
        
        
        // Also try triggering for experience 9 if it exists
        if (attributes.TEAM_NAME) {
          try {
            await sdk.triggerImpression('9');
            console.log('   ✅ Manual impression triggered for experience 9!');
          } catch (impError) {
            // Silently ignore - experience 9 might not be relevant
          }
        }
      }
    } catch (variantError) {
      console.warn('⚠️ Personalize: getVariants() failed:', variantError);
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

    console.log(`📊 Personalize: Triggering impression for "${experienceShortUid}"`);
    await sdk.triggerImpression(experienceShortUid);
    console.log('✅ Personalize: Impression triggered');
    return true;
  } catch (error) {
    console.error('❌ Personalize: Failed to trigger impression:', error);
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
      console.warn(`⚠️ Personalize: SDK not ready, skipping event "${eventName}"`);
      return false;
    }

    console.log(`📊 Personalize: Tracking event "${eventName}"`, eventData || '');
    
    // Use instance method: sdk.triggerEvent()
    if (typeof sdk.triggerEvent === 'function') {
      await sdk.triggerEvent(eventName);
      console.log(`✅ Personalize: Event "${eventName}" tracked successfully`);
      return true;
    }
    
    console.warn('⚠️ Personalize: triggerEvent method not available');
    return false;
  } catch (error) {
    console.error(`❌ Personalize: Failed to track event "${eventName}":`, error);
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

