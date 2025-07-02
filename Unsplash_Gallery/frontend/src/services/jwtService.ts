import type { AuthUser, AuthTokens } from '@/types/auth';

interface JWTResponse {
  user: AuthUser;
  unsplashAccessToken?: string;
}

interface AuthStatusResponse {
  isAuthenticated: boolean;
  user?: AuthUser;
  unsplashAccessToken?: string;
  needsRefresh?: boolean;
}

class JWTService {
  private readonly API_BASE_URL: string;

  constructor() {
    this.API_BASE_URL = import.meta.env.VITE_JWT_SERVER_URL || 'http://localhost:3001';
  }

  /**
   * Store Unsplash tokens in JWT cookies
   */
  async storeTokens(tokens: AuthTokens, user: AuthUser): Promise<void> {
    const response = await fetch(`${this.API_BASE_URL}/api/auth/store-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to store tokens');
    }
  }

  /**
   * Get current user from JWT
   */
  async getCurrentUser(): Promise<JWTResponse> {
    const response = await fetch(`${this.API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user');
    }

    return await response.json();
  }

  /**
   * Refresh JWT tokens
   */
  async refreshTokens(): Promise<JWTResponse> {
    const response = await fetch(`${this.API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to refresh tokens');
    }

    return await response.json();
  }

  /**
   * Logout and clear JWT cookies
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${this.API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with logout even if request fails
    }
  }

  /**
   * Check authentication status
   */
  async checkAuthStatus(): Promise<AuthStatusResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/auth/status`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return { isAuthenticated: false };
      }

      return await response.json();
    } catch (error) {
      console.error('Auth status check failed:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Get Unsplash access token for API calls
   */
  async getUnsplashAccessToken(): Promise<string | null> {
    try {
      const response = await this.getCurrentUser();
      return response.unsplashAccessToken || null;
    } catch (error) {
      // Try to refresh if unauthorized
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        try {
          const refreshResponse = await this.refreshTokens();
          return refreshResponse.unsplashAccessToken || null;
        } catch (refreshError) {
          return null;
        }
      }
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const status = await this.checkAuthStatus();
    return status.isAuthenticated;
  }
}

export const jwtService = new JWTService();