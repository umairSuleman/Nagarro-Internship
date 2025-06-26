
/**
 * Secure Token Storage Utility
 * 
 * SECURITY IMPLEMENTATION:
 * 1. Access tokens stored in memory only (React state) - immune to XSS attacks on storage
 * 2. Refresh tokens stored in HTTP-only cookies (handled by backend)
 * 3. Encrypted storage fallback for development/testing
 * 4. Automatic cleanup on page unload
 */

import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'unsplash_refresh_token';
const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_CODE; 

interface StoredTokenData {
  token: string;
  expiresAt: number;
  encrypted: boolean;
}

export class SecureTokenStorage {
  private static instance: SecureTokenStorage;
  private memoryToken: string | null = null;

  private constructor() {
    //cleanup tokens on page unload for security
    window.addEventListener('beforeunload', this.cleanup.bind(this));
  }

  public static getInstance(): SecureTokenStorage {
    if (!SecureTokenStorage.instance) {
      SecureTokenStorage.instance = new SecureTokenStorage();
    }
    return SecureTokenStorage.instance;
  }

  /**
   * Store access token in memory (MOST SECURE)
   * Attack Vector: None - cleared on page refresh
   * Use Case: Short-lived access tokens
   */
  setAccessToken(token: string): void {
    this.memoryToken = token;
  }

  getAccessToken(): string | null {
    return this.memoryToken;
  }

  /**
   * Store refresh token with encryption (FALLBACK ONLY)
   * Attack Vector: XSS can still access if malicious script gains access
   * Security Solution: Encryption + CSP headers + input sanitization
   * Use Case: When HTTP-only cookies aren't available
   */
  setRefreshToken(token: string, expiresIn: number): void {
    try {
      const expiresAt = Date.now() + (expiresIn * 1000);
      const encryptedToken = this.encrypt(token);
      
      const data: StoredTokenData = {
        token: encryptedToken,
        expiresAt,
        encrypted: true
      };

      // Store in localStorage as encrypted fallback
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  getRefreshToken(): string | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data: StoredTokenData = JSON.parse(stored);
      
      // Check expiration
      if (Date.now() > data.expiresAt) {
        this.clearRefreshToken();
        return null;
      }

      return data.encrypted ? this.decrypt(data.token) : data.token;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Preferred method: Set refresh token as HTTP-only cookie
   * Attack Vector: CSRF attacks
   * Security Solution: SameSite=Strict, Secure flag, CSRF tokens
   */
  async setRefreshTokenCookie(token: string): Promise<void> {
    try {
      // This would typically be handled by your backend
      // Backend sets HTTP-only cookie after successful OAuth
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
      // Fallback to encrypted localStorage
      this.setRefreshToken(token, 7 * 24 * 60 * 60); // 7 days
    }
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    this.memoryToken = null;
    this.clearRefreshToken();
    
    // Clear HTTP-only cookie (backend call)
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error);
  }

  private clearRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET).toString();
  }

  private decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private cleanup(): void {
    // Clear memory token on page unload for security
    this.memoryToken = null;
  }

  /**
   * Check if any valid token exists
   */
  hasValidToken(): boolean {
    const memoryToken = this.memoryToken;
    const refreshToken = this.getRefreshToken();
    const hasToken = memoryToken !== null || refreshToken !== null;
    
    console.log('Token check:', {
      hasMemoryToken: !!memoryToken,
      hasRefreshToken: !!refreshToken,
      overall: hasToken
    });
    
    return hasToken;
  }
}

export const tokenStorage = SecureTokenStorage.getInstance();