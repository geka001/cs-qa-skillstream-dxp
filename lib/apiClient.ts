/**
 * API Client Helper
 * 
 * Provides helper functions for API calls that automatically include OAuth tokens
 * from localStorage. Handles token refresh automatically if token expires during request.
 */

import { tokenManager, TokenData } from './tokenManager';

/**
 * Make an API request with automatic token injection
 * 
 * @param url - API endpoint URL
 * @param options - Fetch options (headers will be merged with auth headers)
 * @returns Response object
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const tokenData = await tokenManager.getTokenData();
  
  if (!tokenData) {
    throw new Error("No valid token available. Please authenticate first.");
  }

  // Merge headers with auth headers
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${tokenData.access_token}`);
  if (tokenData.organization_uid) {
    headers.set("organization_uid", tokenData.organization_uid);
  }

  // Make request with merged headers
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401, try refreshing token and retry once
  if (response.status === 401) {
    console.log("🔄 Got 401, refreshing token and retrying...");
    try {
      // Force refresh
      const refreshedTokenData = await tokenManager.getTokenData();
      if (refreshedTokenData) {
        // Update headers with new token
        headers.set("Authorization", `Bearer ${refreshedTokenData.access_token}`);
        if (refreshedTokenData.organization_uid) {
          headers.set("organization_uid", refreshedTokenData.organization_uid);
        }

        // Retry request
        response = await fetch(url, {
          ...options,
          headers,
        });
      }
    } catch (error) {
      console.error("Failed to refresh token on 401:", error);
    }
  }

  return response;
}

/**
 * Make a POST request with JSON body and automatic token injection
 */
export async function apiPost(
  url: string,
  body: any,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  return apiRequest(url, {
    ...options,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

/**
 * Make a GET request with automatic token injection
 */
export async function apiGet(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return apiRequest(url, {
    ...options,
    method: "GET",
  });
}

/**
 * Make a PUT request with JSON body and automatic token injection
 */
export async function apiPut(
  url: string,
  body: any,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  return apiRequest(url, {
    ...options,
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
}

/**
 * Make a DELETE request with automatic token injection
 */
export async function apiDelete(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return apiRequest(url, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Get token data for custom API calls
 */
export async function getTokenData(): Promise<TokenData | null> {
  return await tokenManager.getTokenData();
}

/**
 * Get access token string
 */
export async function getAccessToken(): Promise<string | null> {
  return await tokenManager.getAccessToken();
}

