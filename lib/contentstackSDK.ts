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
  previewToken: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN || '',
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

// Get the preview host URL based on region
// Reference: https://www.contentstack.com/docs/developers/set-up-live-preview/get-started-with-live-preview-utils-sdk-v3
function getPreviewHost(regionStr: string): string {
  const hostMap: Record<string, string> = {
    'NA': 'rest-preview.contentstack.com',
    'EU': 'eu-rest-preview.contentstack.com',
    'AZURE_NA': 'azure-na-rest-preview.contentstack.com',
    'AZURE_EU': 'azure-eu-rest-preview.contentstack.com',
    'GCP_NA': 'gcp-na-rest-preview.contentstack.com',
  };
  return hostMap[regionStr] || 'rest-preview.contentstack.com';
}

// ============================================================
// SDK STACK INSTANCE
// ============================================================

let stackInstance: ReturnType<typeof contentstack.stack> | null = null;

/**
 * Get the Contentstack SDK stack instance
 * Creates a singleton instance on first call
 * Includes Live Preview configuration when preview token is available
 */
export function getStack() {
  if (!stackInstance && CONFIG.apiKey && CONFIG.deliveryToken) {
    const stackConfig: Parameters<typeof contentstack.stack>[0] = {
      apiKey: CONFIG.apiKey,
      deliveryToken: CONFIG.deliveryToken,
      environment: CONFIG.environment,
      region: getRegion(CONFIG.region),
    };

    // Add Live Preview configuration if preview token is available
    // This enables fetching draft/preview content during Live Preview sessions
    if (CONFIG.previewToken) {
      stackConfig.live_preview = {
        enable: true,
        preview_token: CONFIG.previewToken,
        host: getPreviewHost(CONFIG.region),
      };
      console.log('✅ Contentstack SDK: Live Preview enabled with preview token');
    }

    stackInstance = contentstack.stack(stackConfig);
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

