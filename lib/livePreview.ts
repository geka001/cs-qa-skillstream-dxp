/**
 * Contentstack Live Preview & Visual Builder Configuration
 * 
 * This module initializes the Contentstack Live Preview SDK with Visual Builder mode.
 * It provides utilities for edit tags and real-time content editing.
 * 
 * Reference: https://www.contentstack.com/docs/developers/set-up-visual-builder/set-up-visual-builder-for-your-website
 */

import ContentstackLivePreview from '@contentstack/live-preview-utils';

// Configuration from environment
// Note: The preview_token is configured in contentstackSDK.ts for the Delivery SDK,
// not here in the Live Preview Utils SDK. This SDK only handles UI features (edit buttons, etc.)
const CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '',
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev',
  branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH || 'main',
  enabled: process.env.NEXT_PUBLIC_USE_CONTENTSTACK === 'true',
};

// Track initialization state
let isInitialized = false;

// Edit button enabled state - change this to control edit button visibility
const EDIT_BUTTON_ENABLED = false;

/**
 * Reset Live Preview initialization state
 * Call this to force re-initialization with new settings
 */
export function resetLivePreview(): void {
  isInitialized = false;
  console.log('🔄 Live Preview: Reset - will re-initialize on next call');
}

/**
 * Initialize Live Preview SDK with Visual Builder mode
 * Call this once on client-side (e.g., in a provider component)
 */
export function initializeLivePreview(): void {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }

  // Only initialize once
  if (isInitialized) {
    return;
  }

  // Skip if Contentstack is not enabled or preview token is missing
  if (!CONFIG.enabled || !CONFIG.apiKey) {
    console.log('Live Preview: Skipping initialization (Contentstack not enabled)');
    return;
  }

  try {
    ContentstackLivePreview.init({
      stackDetails: {
        apiKey: CONFIG.apiKey,
        environment: CONFIG.environment,
        branch: CONFIG.branch,
      },
      // Enable Visual Builder mode for advanced editing capabilities
      mode: 'builder',
      // Required for Next.js client-side rendering
      ssr: false,
      // Enable edit button on hover for better UX
      editButton: {
        enable: EDIT_BUTTON_ENABLED,
        exclude: ["outsideLivePreviewPortal"],
        includeByQueryParameter: true,
        position: "bottom",
      },
      editInVisualBuilderButton: {
        enable: false
        },
      // Client URL configuration for proper communication
      clientUrlParams: {
        protocol: typeof window !== 'undefined' ? window.location.protocol.replace(':', '') as 'http' | 'https' : 'https',
        host: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
        port: typeof window !== 'undefined' ? parseInt(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80) : 3000,
      },
    });

    isInitialized = true;
    console.log(`✅ Live Preview: Visual Builder initialized (editButton: ${EDIT_BUTTON_ENABLED})`);
  } catch (error) {
    console.error('❌ Live Preview: Failed to initialize:', error);
  }
}

/**
 * Check if Live Preview is initialized
 */
export function isLivePreviewInitialized(): boolean {
  return isInitialized;
}

/**
 * Get Live Preview SDK instance (for advanced usage)
 */
export function getLivePreviewSDK(): typeof ContentstackLivePreview {
  return ContentstackLivePreview;
}

/**
 * Generate the data-cslp attribute value for Visual Builder edit tags
 * Format: content_type_uid.entry_uid.locale.field_path
 * 
 * @param contentTypeUid - The content type UID (e.g., 'page')
 * @param entryUid - The entry UID (e.g., 'blt123456789')
 * @param fieldPath - Dot-notation path to the field (e.g., 'title', 'modular_blocks.0.hero_banner.heading')
 * @param locale - The locale code (default: 'en-us')
 * @returns The data-cslp attribute value
 */
export function generateEditTagPath(
  contentTypeUid: string,
  entryUid: string,
  fieldPath: string,
  locale: string = 'en-us'
): string {
  return `${contentTypeUid}.${entryUid}.${locale}.${fieldPath}`;
}

/**
 * Helper to create edit tag props for an entry field
 * Generates the proper data-cslp attribute for Visual Builder
 * 
 * @param entry - The entry object with uid property
 * @param contentTypeUid - The content type UID
 * @param fieldPath - Dot-notation path to the field
 * @param locale - The locale code (default: 'en-us')
 * @returns Props object with data-cslp attribute to spread on the element
 * 
 * @example
 * <h1 {...getEditTagProps(entry, 'page', 'title')}>{entry.title}</h1>
 */
export function getEditTagProps(
  entry: any, 
  contentTypeUid: string,
  fieldPath: string,
  locale: string = 'en-us'
): Record<string, any> {
  if (!entry || !entry.uid) {
    return {};
  }

  return {
    'data-cslp': generateEditTagPath(contentTypeUid, entry.uid, fieldPath, locale)
  };
}

/**
 * Helper to create edit tag for modular blocks
 * Generates the proper data-cslp attribute for Visual Builder
 * 
 * @param entry - The entry object with uid property
 * @param contentTypeUid - The content type UID (default: 'page')
 * @param blockIndex - Index of the block in modular_blocks array
 * @param blockType - Type of the block (e.g., 'hero_banner', 'teams')
 * @param fieldPath - Optional field path within the block
 * @param locale - The locale code (default: 'en-us')
 * @returns Props object with data-cslp attribute to spread on the element
 * 
 * @example
 * <h2 {...getModularBlockEditTag(entry, 'page', 0, 'hero_banner', 'heading')}>{block.heading}</h2>
 */
export function getModularBlockEditTag(
  entry: any,
  contentTypeUid: string,
  blockIndex: number,
  blockType: string,
  fieldPath?: string,
  locale: string = 'en-us'
): Record<string, any> {
  if (!entry || !entry.uid) {
    return {};
  }

  const basePath = `modular_blocks.${blockIndex}.${blockType}`;
  const fullPath = fieldPath ? `${basePath}.${fieldPath}` : basePath;
  
  return {
    'data-cslp': generateEditTagPath(contentTypeUid, entry.uid, fullPath, locale)
  };
}

// Re-export the VB_EmptyBlockParentClass for empty modular blocks placeholder
export { VB_EmptyBlockParentClass } from '@contentstack/live-preview-utils';


