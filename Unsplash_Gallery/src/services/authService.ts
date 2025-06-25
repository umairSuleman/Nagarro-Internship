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

    console.log('AuthService initialized with config:', {
      clientId: this.config.clientId ? 'Set' : 'Missing',
      redirectUri: this.config.redirectUri,
      scope: this.config.scope
    });
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

    const authUrl = `https://unsplash.com/oauth/authorize?${params.toString()}`;
    console.log('Generated auth URL:', authUrl);
    return authUrl;
  }

  /**
   * Step 2: Exchange authorization code for access token
   * Called after user returns from Unsplash authorization
   */
  async exchangeCodeForToken(code: string): Promise<AuthTokens> {
    console.log('Exchanging code for token:', code);
    
    try {
      const requestBody = {
        client_id: this.config.clientId,
        client_secret: import.meta.env.VITE_ACCESS_SECRET,
        redirect_uri: this.config.redirectUri,
        code,
        grant_type: 'authorization_code',
      };

      console.log('Token exchange request:', {
        ...requestBody,
        client_secret: requestBody.client_secret ? 'Set' : 'Missing'
      });

      const response = await fetch('https://unsplash.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Token exchange response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token exchange failed:', response.status, errorText);
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const tokens: AuthTokens = await response.json();
      console.log('Tokens received:', {
        access_token: tokens.access_token ? 'Set' : 'Missing',
        refresh_token: tokens.refresh_token ? 'Set' : 'Missing',
        token_type: tokens.token_type,
        scope: tokens.scope
      });
      
      // Store tokens securely
      tokenStorage.setAccessToken(tokens.access_token);
      if (tokens.refresh_token) {
        await tokenStorage.setRefreshTokenCookie(tokens.refresh_token);
      }

      return tokens;
    } catch (error) {
      console.error('Token exchange error:', error);
      if (error instanceof Error) {
        throw error;
      }
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

    console.log('Fetching current user with token');

    try {
      const response = await fetch('https://api.unsplash.com/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Get user response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired, attempting refresh...');
          // Token expired, try to refresh
          await this.refreshAccessToken();
          return this.getCurrentUser(); // Retry with new token
        }
        const errorText = await response.text();
        console.error('Failed to fetch user:', response.status, errorText);
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      }

      const user = await response.json();
      console.log('User fetched successfully:', user.username);
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      if (error instanceof Error) {
        throw error;
      }
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
          client_secret: import.meta.env.VITE_ACCESS_SECRET,
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
    console.log('Initiating login flow...');
    const authUrl = this.getAuthorizationUrl();
    window.location.href = authUrl;
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    console.log('Logging out user...');
    tokenStorage.clearTokens();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const hasToken = tokenStorage.hasValidToken();
    console.log('Is authenticated:', hasToken);
    return hasToken;
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }
}

export const authService = new AuthService();