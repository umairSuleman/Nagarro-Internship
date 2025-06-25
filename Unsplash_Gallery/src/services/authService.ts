// src/services/authService.ts

import { tokenStorage } from '@/utils/tokenStorage';
import type { AuthTokens, AuthUser, OAuthConfig } from '@/types/auth';

class AuthService {
  private config: OAuthConfig;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_API_KEY,
      redirectUri: import.meta.env.VITE_REDIRECT_URI,
      scope: 'public read_user write_user',
      responseType: 'code'
    };
  }

  /**
   * Step 1: Generate OAuth authorization URL
   * Redirects user to Unsplash for authentication
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: this.config.responseType,
      scope: this.config.scope,
    });

    return `https://unsplash.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Step 2: Exchange authorization code for access token
   * Called after user returns from Unsplash authorization
   */
  async exchangeCodeForToken(code: string): Promise<AuthTokens> {
    try {
      // In production, this should go through your backend for security
      const response = await fetch('https://unsplash.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: import.meta.env.VITE_UNSPLASH_CLIENT_SECRET, // Should be on backend
          redirect_uri: this.config.redirectUri,
          code,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokens: AuthTokens = await response.json();
      
      // Store tokens securely
      tokenStorage.setAccessToken(tokens.access_token);
      if (tokens.refresh_token) {
        await tokenStorage.setRefreshTokenCookie(tokens.refresh_token);
      }

      return tokens;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  /**
   * Step 3: Get current user profile using access token
   */
  async getCurrentUser(): Promise<AuthUser> {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch('https://api.unsplash.com/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          await this.refreshAccessToken();
          return this.getCurrentUser(); // Retry with new token
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('https://unsplash.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: import.meta.env.VITE_UNSPLASH_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokens: AuthTokens = await response.json();
      tokenStorage.setAccessToken(tokens.access_token);
      
      if (tokens.refresh_token) {
        await tokenStorage.setRefreshTokenCookie(tokens.refresh_token);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens and force re-login
      tokenStorage.clearTokens();
      throw new Error('Token refresh failed - please login again');
    }
  }

  /**
   * Initiate login flow
   */
  login(): void {
    const authUrl = this.getAuthorizationUrl();
    window.location.href = authUrl;
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    tokenStorage.clearTokens();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.hasValidToken();
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }
}

export const authService = new AuthService();