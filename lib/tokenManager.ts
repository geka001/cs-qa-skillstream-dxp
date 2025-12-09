/**
 * OAuth Token Manager
 * 
 * Manages OAuth tokens stored in localStorage (key: "auth")
 * Validates token expiry and automatically refreshes when near expiry (within 5 minutes)
 * Hardcoded for AWS NA region only
 */

interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  location: string;
  region: string;
  organization_uid: string;
  authorization_type: string;
  user_uid: string;
  stack_api_key: string;
  token_issued_at: number;
}

const TOKEN_STORAGE_KEY = "auth";

// Hardcoded AWS NA endpoints
const DEV_HUB_URL = "https://developerhub-api.contentstack.com";
const UI_HOST = "https://app.contentstack.com";

class TokenManager {
  private clientId: string;
  private redirectUri: string;
  private devHubUrl: string;

  constructor() {
    // Use clientId from env or default from oauth.ts
    this.clientId = "cGQZujH3Y_oYkf59";
    this.redirectUri = "http://localhost:8184";
    this.devHubUrl = `${DEV_HUB_URL}/apps`;
  }

  /**
   * Load token from localStorage
   */
  private loadToken(): TokenData | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) {
        return null;
      }
      return JSON.parse(stored) as TokenData;
    } catch (error) {
      console.error("Error loading token from localStorage:", error);
      return null;
    }
  }

  /**
   * Save token to localStorage
   */
  private saveToken(tokenData: TokenData): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
    }
  }

  /**
   * Ensure token is valid, refresh if needed
   * Checks if token expires within 5 minutes and refreshes if so
   */
  async ensureValidToken(): Promise<TokenData | null> {
    const config = this.loadToken();
    if (!config || !config.access_token || !config.refresh_token) {
      return null;
    }

    const now = Date.now();
    let tokenIssuedAt = config.token_issued_at;

    // If token_issued_at is missing or invalid, assume token was just issued
    if (!tokenIssuedAt || tokenIssuedAt <= 0) {
      tokenIssuedAt = now;
      const updatedConfig: TokenData = {
        ...config,
        token_issued_at: tokenIssuedAt,
      };
      this.saveToken(updatedConfig);
      return updatedConfig;
    }

    const expiresInMs = config.expires_in * 1000;
    const expiryTime = tokenIssuedAt + expiresInMs;
    const timeUntilExpiry = expiryTime - now;

    // Refresh if token is expired or expires within 5 minutes
    if (timeUntilExpiry <= 5 * 60 * 1000) {
      try {
        console.log("🔄 Token expires soon, refreshing...");
        const refreshedToken = await this.refreshToken(config.refresh_token);
        return refreshedToken;
      } catch (error) {
        console.error("Failed to refresh token, using existing token:", error);
        // If refresh fails, return existing token (might still be valid)
        return config;
      }
    }

    return config;
  }

  /**
   * Refresh the access token using refresh_token
   */
  private async refreshToken(refreshToken: string): Promise<TokenData> {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: refreshToken,
      redirect_uri: this.redirectUri,
    });

    try {
      const response = await fetch(`${this.devHubUrl}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
      }

      const tokenData = await response.json();
      if (!tokenData.access_token) {
        throw new Error("Invalid token response");
      }

      const existingConfig = this.loadToken();
      const updatedConfig: TokenData = {
        ...(existingConfig as TokenData),
        ...tokenData,
        refresh_token: tokenData.refresh_token ?? (existingConfig?.refresh_token as string),
        token_issued_at: Date.now(),
      };

      this.saveToken(updatedConfig);
      console.log("✅ Token refreshed successfully");
      return updatedConfig;
    } catch (error: any) {
      console.error("Token refresh failed:", error.message || error);
      throw new Error("Failed to refresh access token");
    }
  }

  /**
   * Get current valid access token
   */
  async getAccessToken(): Promise<string | null> {
    const tokenData = await this.ensureValidToken();
    return tokenData?.access_token || null;
  }

  /**
   * Get full token data (for API calls that need organization_uid, etc.)
   */
  async getTokenData(): Promise<TokenData | null> {
    return await this.ensureValidToken();
  }

  /**
   * Check if token exists in localStorage
   */
  hasToken(): boolean {
    return this.loadToken() !== null;
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
export type { TokenData };

