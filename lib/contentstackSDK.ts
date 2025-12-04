/**
 * Contentstack Delivery SDK Configuration
 * 
 * This module initializes and exports the Contentstack Delivery SDK stack instance.
 * Use this for all read operations from Contentstack.
 * 
 * Note: Management API operations (create, update, delete, publish) still require
 * direct HTTP calls as the Delivery SDK only supports reading published content.
 */

import contentstack, { Region } from '@contentstack/delivery-sdk';

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_STACK_API_KEY || '',
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || process.env.CONTENTSTACK_ENVIRONMENT || 'dev',
  region: (process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || process.env.CONTENTSTACK_REGION || 'NA').toUpperCase(),
  enabled: process.env.NEXT_PUBLIC_USE_CONTENTSTACK === 'true'
};

// Map region string to SDK Region enum
function getRegion(regionStr: string): Region {
  const regionMap: Record<string, Region> = {
    'NA': Region.US,
    'EU': Region.EU,
    'AZURE_NA': Region.AZURE_NA,
    'AZURE_EU': Region.AZURE_EU,
    'GCP_NA': Region.GCP_NA,
  };
  return regionMap[regionStr] || Region.US;
}

// ============================================================
// SDK STACK INSTANCE
// ============================================================

let stackInstance: ReturnType<typeof contentstack.stack> | null = null;

/**
 * Get the Contentstack SDK stack instance
 * Creates a singleton instance on first call
 */
export function getStack() {
  if (!stackInstance && CONFIG.apiKey && CONFIG.deliveryToken) {
    stackInstance = contentstack.stack({
      apiKey: CONFIG.apiKey,
      deliveryToken: CONFIG.deliveryToken,
      environment: CONFIG.environment,
      region: getRegion(CONFIG.region),
    });
  }
  return stackInstance;
}

/**
 * Check if Contentstack SDK is properly configured
 */
export function isSDKConfigured(): boolean {
  return !!(CONFIG.apiKey && CONFIG.deliveryToken && CONFIG.enabled);
}

/**
 * Check if Contentstack is enabled (as a function)
 */
export function isSDKEnabled(): boolean {
  return CONFIG.enabled;
}

/**
 * Check if Contentstack is enabled (as a boolean for backward compatibility)
 */
export const isContentstackEnabled = CONFIG.enabled;

// Export configuration for reference
export { CONFIG as ContentstackConfig };

// Export the stack directly for convenience (will be null if not configured)
export const stack = getStack();

