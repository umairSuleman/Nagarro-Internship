import { jwtService } from './jwtService';
import type { AuthTokens, AuthUser, OAuthConfig } from '@/types/auth';

interface TokenExchangeRequest {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  code: string;
  grant_type: 'authorization_code';
}

interface AuthError {
  error: string;
  error_description?: string;
}

class AuthService {
  private config: OAuthConfig;
  private readonly UNSPLASH_API_BASE = import.meta.env.VITE_BASE_URL;
  private readonly UNSPLASH_OAUTH_BASE = import.meta.env.VITE_OAUTH_URL;
  private processingCode: string | null = null;
  private cachedAccessToken: string | null = null;
  private tokenFetchPromise: Promise<string | null> | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_API_KEY,
      redirectUri: import.meta.env.VITE_REDIRECT_URI,
      scope: 'public read_user write_user',
      responseType: 'code'
    };

    this.validateConfig();
  }

  private validateConfig(): void {
    const missing: string[] = [];
    
    if (!this.config.clientId) missing.push('VITE_API_KEY');
    if (!this.config.redirectUri) missing.push('VITE_REDIRECT_URI');
    if (!import.meta.env.VITE_ACCESS_SECRET) missing.push('VITE_ACCESS_SECRET');

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    try {
      new URL(this.config.redirectUri);
    } catch (error) {
      throw new Error(`Invalid redirect URI format: ${this.config.redirectUri}`);
    }
  }

  getAuthorizationUrl(): string {
    const state = this.generateRandomState();
    
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('used_oauth_codes');
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: this.config.responseType,
      scope: this.config.scope,
      state: state,
    });

    return `${this.UNSPLASH_OAUTH_BASE}/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, state?: string): Promise<AuthTokens> {
    if (this.processingCode === code) {
      throw new Error('Authorization code is already being processed. Please wait.');
    }

    if (this.isCodeAlreadyUsed(code)) {
      throw new Error('Authorization code has already been used. Please try logging in again.');
    }

    this.processingCode = code;

    try {
      if (state) {
        const storedState = sessionStorage.getItem('oauth_state');
        if (!storedState || storedState !== state) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }
      }

      if (!code?.trim()) {
        throw new Error('Authorization code is required');
      }

      this.markCodeAsUsed(code);

      const requestBody: TokenExchangeRequest = {
        client_id: this.config.clientId,
        client_secret: import.meta.env.VITE_ACCESS_SECRET,
        redirect_uri: this.config.redirectUri,
        code: code.trim(),
        grant_type: 'authorization_code',
      };

      const response = await fetch(`${this.UNSPLASH_OAUTH_BASE}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const authError = responseData as AuthError;
        throw new Error(this.getHumanReadableError(authError));
      }

      const tokens = responseData as AuthTokens;
      
      // Get user data and store in JWT
      const user = await this.fetchUserWithToken(tokens.access_token);
      await jwtService.storeTokens(tokens, user);
      
      sessionStorage.removeItem('oauth_state');
      
      return tokens;

    } finally {
      this.processingCode = null;
    }
  }

  /**
   * Fetch user data directly with Unsplash token (used during initial auth)
   */
  private async fetchUserWithToken(token: string): Promise<AuthUser> {
    const response = await fetch(`${this.UNSPLASH_API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    return await response.json();
  }

  private isCodeAlreadyUsed(code: string): boolean {
    const usedCodes = JSON.parse(sessionStorage.getItem('used_oauth_codes') || '[]');
    return usedCodes.includes(code);
  }

  private markCodeAsUsed(code: string): void {
    const usedCodes = JSON.parse(sessionStorage.getItem('used_oauth_codes') || '[]');
    usedCodes.push(code);
    const recentCodes = usedCodes.slice(-10);
    sessionStorage.setItem('used_oauth_codes', JSON.stringify(recentCodes));
  }

  async handleCallback(): Promise<AuthUser | null> {
    const urlParams = new URLSearchParams(window.location.search);
    
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      throw new Error(`Authentication failed: ${error} - ${errorDescription || 'Unknown error'}`);
    }

    if (!code) {
      return null;
    }

    await this.exchangeCodeForToken(code, state || undefined);
    return await this.getCurrentUser();
  }

  async getCurrentUser(): Promise<AuthUser> {
    try {
      const jwtResponse = await jwtService.getCurrentUser();
      return jwtResponse.user;
    } catch (error) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        throw new Error('UNAUTHORIZED');
      }
      throw error;
    }
  }

  /**
   * Get Unsplash access token for API calls
   * This method is used by the UnsplashService
   */
  async getAccessToken(): Promise<string | null> {
    // Return cached token if available
    if (this.cachedAccessToken) {
      return this.cachedAccessToken;
    }

    // Prevent multiple simultaneous fetches
    if (this.tokenFetchPromise) {
      return await this.tokenFetchPromise;
    }

    this.tokenFetchPromise = this.fetchAccessToken();
    const token = await this.tokenFetchPromise;
    this.tokenFetchPromise = null;

    return token;
  }

  private async fetchAccessToken(): Promise<string | null> {
    try {
      const token = await jwtService.getUnsplashAccessToken();
      this.cachedAccessToken = token;
      
      // Cache for 10 minutes
      if (token) {
        setTimeout(() => {
          this.cachedAccessToken = null;
        }, 10 * 60 * 1000);
      }
      
      return token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  private generateRandomState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private getHumanReadableError(authError: AuthError): string {
    switch (authError.error) {
      case 'invalid_grant':
        return 'Authorization code is invalid, expired, or has already been used. Please try logging in again.';
      case 'invalid_client':
        return 'Invalid client credentials. Please check your API configuration.';
      case 'invalid_request':
        return 'Invalid request format. Please contact support if this persists.';
      case 'unauthorized_client':
        return 'This application is not authorized to use this grant type.';
      case 'unsupported_grant_type':
        return 'The authorization grant type is not supported.';
      case 'invalid_scope':
        return 'The requested scope is invalid or not supported.';
      default:
        return authError.error_description || `Authentication failed: ${authError.error}`;
    }
  }

  login(): void {
    this.clearUsedCodes();
    const authUrl = this.getAuthorizationUrl();
    window.location.href = authUrl;
  }

  async logout(): Promise<void> {
    await jwtService.logout();
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('used_oauth_codes');
    this.processingCode = null;
    this.cachedAccessToken = null;
  }

  async isAuthenticated(): Promise<boolean> {
    return await jwtService.isAuthenticated();
  }

  private clearUsedCodes(): void {
    sessionStorage.removeItem('used_oauth_codes');
    this.processingCode = null;
  }
}

export const authService = new AuthService();