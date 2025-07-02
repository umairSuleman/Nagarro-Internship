const ACCESS_TOKEN_KEY = 'unsplash_access_token';
const REFRESH_TOKEN_KEY = 'unsplash_refresh_token';

interface StoredTokenData {
  token: string;
  expiresAt: number;
}

export class SecureTokenStorage {
  private static instance: SecureTokenStorage;
  private memoryToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  private constructor() {
    // Initialize memory token from storage on startup
    this.initializeFromStorage();
    
    // Cleanup tokens on page unload for security
    window.addEventListener('beforeunload', this.cleanup.bind(this));
  }

  public static getInstance(): SecureTokenStorage {
    if (!SecureTokenStorage.instance) {
      SecureTokenStorage.instance = new SecureTokenStorage();
    }
    return SecureTokenStorage.instance;
  }

  /**
   * Initialize tokens from persistent storage on app startup
   */
  private initializeFromStorage(): void {
    const accessToken = this.getStoredAccessToken();
    if (accessToken && !this.isTokenExpired(ACCESS_TOKEN_KEY)) {
      this.memoryToken = accessToken;
      console.log('Access token restored from storage');
    } else {
      this.clearAccessToken();
    }
  }

  /**
   * Store access token in both memory and storage
   * Memory for performance, storage for persistence across refreshes
   */
  setAccessToken(token: string, expiresIn?: number): void {
    this.memoryToken = token;
    
    // Store in localStorage for persistence
    try {
      const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : Date.now() + (60 * 60 * 1000); // Default 1 hour
      this.tokenExpiresAt = expiresAt;
      
      const data: StoredTokenData = {
        token: token,
        expiresAt
      };

      localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  getAccessToken(): string | null {
    // First check memory (fastest)
    if (this.memoryToken) {
      return this.memoryToken;
    }

    // Fallback to storage if memory is cleared
    const storedToken = this.getStoredAccessToken();
    if (storedToken && !this.isTokenExpired(ACCESS_TOKEN_KEY)) {
      this.memoryToken = storedToken; // Restore to memory
      return storedToken;
    }

    return null;
  }

  private getStoredAccessToken(): string | null {
    try {
      const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!stored) return null;

      const data: StoredTokenData = JSON.parse(stored);
      
      // Check expiration
      if (Date.now() > data.expiresAt) {
        this.clearAccessToken();
        return null;
      }

      return data.token;
    } catch (error) {
      console.error('Failed to retrieve stored access token:', error);
      return null;
    }
  }

  private clearAccessToken(): void {
    this.memoryToken = null;
    this.tokenExpiresAt = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Store refresh token
   */
  setRefreshToken(token: string, expiresIn: number): void {
    try {
      const expiresAt = Date.now() + (expiresIn * 1000);
      
      const data: StoredTokenData = {
        token: token,
        expiresAt
      };

      localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  getRefreshToken(): string | null {
    try {
      const stored = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!stored) return null;

      const data: StoredTokenData = JSON.parse(stored);
      
      // Check expiration
      if (Date.now() > data.expiresAt) {
        this.clearRefreshToken();
        return null;
      }

      return data.token;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Preferred method: Set refresh token as HTTP-only cookie
   */
  async setRefreshTokenCookie(token: string): Promise<void> {
    try {
      // This would typically be handled by your backend
      await fetch('/api/auth/set-refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: token })
      });
    } catch (error) {
      console.error('Failed to set refresh token cookie:', error);
      // Fallback to localStorage
      this.setRefreshToken(token, 7 * 24 * 60 * 60); // 7 days
    }
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    this.memoryToken = null;
    this.tokenExpiresAt = null;
    this.clearAccessToken();
    this.clearRefreshToken();
    
    // Clear HTTP-only cookie (backend call)
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error);
  }

  private clearRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private isTokenExpired(key: string): boolean {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return true;

      const data: StoredTokenData = JSON.parse(stored);
      return Date.now() > data.expiresAt;
    } catch {
      return true;
    }
  }

  private cleanup(): void {
    // Keep persistent storage, only clear memory
    this.memoryToken = null;
  }

  /**
   * Check if any valid token exists
   */
  hasValidToken(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const hasToken = accessToken !== null || refreshToken !== null;
    
    console.log('Token check:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      overall: hasToken
    });
    
    return hasToken;
  }

  /**
   * Get token expiration info
   */
  getTokenExpirationInfo(): { isExpired: boolean; expiresAt: number | null } {
    return {
      isExpired: this.isTokenExpired(ACCESS_TOKEN_KEY),
      expiresAt: this.tokenExpiresAt
    };
  }
}

export const tokenStorage = SecureTokenStorage.getInstance();