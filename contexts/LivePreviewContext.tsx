'use client';

/**
 * Live Preview Provider for Visual Builder
 * 
 * This provider initializes the Contentstack Live Preview SDK with Visual Builder mode.
 * Place it high in the component tree (e.g., in root layout) to enable Visual Builder
 * across all pages.
 * 
 * Features:
 * - Initializes Live Preview SDK with Visual Builder mode
 * - Detects when page is loaded inside Visual Builder iframe
 * - Listens for content changes and triggers re-render via onEntryChange
 * - Provides hooks for components to subscribe to content updates
 * 
 * Reference: https://www.contentstack.com/docs/developers/set-up-visual-builder/set-up-visual-builder-for-your-website
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { initializeLivePreview, isLivePreviewInitialized, getLivePreviewSDK } from '@/lib/livePreview';

interface LivePreviewContextType {
  isInitialized: boolean;
  isVisualBuilderMode: boolean;
  // Counter that increments on each content change - use in dependency arrays to trigger re-fetch
  contentVersion: number;
  // Subscribe to content changes
  onContentChange: (callback: () => void) => () => void;
}

const LivePreviewContext = createContext<LivePreviewContextType>({
  isInitialized: false,
  isVisualBuilderMode: false,
  contentVersion: 0,
  onContentChange: () => () => {},
});

export const useLivePreview = () => useContext(LivePreviewContext);

interface LivePreviewProviderProps {
  children: ReactNode;
}

// Store for content change subscribers
const contentChangeSubscribers = new Set<() => void>();

export function LivePreviewProvider({ children }: LivePreviewProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisualBuilderMode, setIsVisualBuilderMode] = useState(false);
  const [contentVersion, setContentVersion] = useState(0);

  // Handler for content changes
  const handleContentChange = useCallback(() => {
    console.log('📝 Live Preview: Content changed, triggering update...');
    
    // Increment version to trigger re-renders in subscribed components
    setContentVersion(prev => prev + 1);
    
    // Notify all subscribers
    contentChangeSubscribers.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in content change subscriber:', error);
      }
    });
  }, []);

  // Subscribe to content changes
  const onContentChange = useCallback((callback: () => void) => {
    contentChangeSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      contentChangeSubscribers.delete(callback);
    };
  }, []);

  useEffect(() => {
    // Initialize Live Preview SDK on mount
    initializeLivePreview();
    setIsInitialized(isLivePreviewInitialized());

    // Check if we're in Visual Builder mode (inside Contentstack iframe)
    const checkVisualBuilderMode = () => {
      if (typeof window !== 'undefined') {
        // Check if page is loaded inside Contentstack Visual Builder iframe
        const isInIframe = window !== window.parent;
        const hasCSParams = window.location.search.includes('live_preview') || 
                           window.location.search.includes('content_type_uid');
        setIsVisualBuilderMode(isInIframe || hasCSParams);
        
        if (isInIframe || hasCSParams) {
          console.log('✅ Visual Builder mode detected');
        }
      }
    };

    checkVisualBuilderMode();

    // Listen for Live Preview SDK events for real-time updates
    try {
      const sdk = getLivePreviewSDK();
      
      if (sdk && typeof sdk.onEntryChange === 'function') {
        // Register the onEntryChange listener
        // Note: onEntryChange returns undefined or a listener ID, not an unsubscribe function
        sdk.onEntryChange(handleContentChange);
        console.log('✅ Live Preview: onEntryChange listener registered');
      }
      
      // Also listen for onLiveEdit if available (for inline editing)
      if (sdk && typeof sdk.onLiveEdit === 'function') {
        sdk.onLiveEdit(handleContentChange);
        console.log('✅ Live Preview: onLiveEdit listener registered');
      }
    } catch (error) {
      // SDK may not support these methods - that's okay
      console.log('Live Preview: Could not register entry change listeners');
    }

    // Cleanup on unmount
    return () => {
      contentChangeSubscribers.clear();
    };
  }, [handleContentChange]);

  return (
    <LivePreviewContext.Provider value={{ 
      isInitialized, 
      isVisualBuilderMode,
      contentVersion,
      onContentChange 
    }}>
      {children}
    </LivePreviewContext.Provider>
  );
}

/**
 * Hook to trigger re-fetch when content changes in Visual Builder
 * 
 * @example
 * const { contentVersion } = useLivePreview();
 * 
 * useEffect(() => {
 *   fetchData();
 * }, [contentVersion]); // Re-fetch when content changes
 */
export function useContentVersion() {
  const { contentVersion } = useLivePreview();
  return contentVersion;
}

/**
 * Hook to subscribe to content changes
 * 
 * @example
 * useContentChangeEffect(() => {
 *   // This runs when content changes in Visual Builder
 *   refetchData();
 * });
 */
export function useContentChangeEffect(callback: () => void) {
  const { onContentChange, isVisualBuilderMode } = useLivePreview();
  
  useEffect(() => {
    if (!isVisualBuilderMode) return;
    
    return onContentChange(callback);
  }, [onContentChange, callback, isVisualBuilderMode]);
}
