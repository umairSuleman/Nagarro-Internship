import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@/services/authService';
import { jwtService } from '@/services/jwtService';
import type { AuthState, AuthUser } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser; accessToken: string | null } }
  | { type: 'LOGOUT' }
  | { type: 'SET_ACCESS_TOKEN'; payload: string | null };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.payload,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Global loading will be handled by async thunks if you convert authService calls to RTK Query
        // For now, you could dispatch a custom loading action if needed
        
        const authStatus = await jwtService.checkAuthStatus();
        
        if (authStatus.isAuthenticated) {
          if (authStatus.needsRefresh) {
            // Token needs refresh
            try {
              const refreshResponse = await jwtService.refreshTokens();
              const accessToken = await authService.getAccessToken();
              dispatch({ 
                type: 'LOGIN_SUCCESS', 
                payload: { 
                  user: refreshResponse.user, 
                  accessToken: accessToken 
                } 
              });
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // Error will be handled by global error system
            }
          } else {
            // Valid token exists
            const accessToken = await authService.getAccessToken();
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { 
                user: authStatus.user!, 
                accessToken: accessToken 
              } 
            });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Error will be handled by global error system
      }
    };

    checkAuth();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        // Error will be handled by global error system
        return;
      }

      if (code) {
        try {
          const user = await authService.handleCallback();
          if (user) {
            const accessToken = await authService.getAccessToken();
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user, accessToken } 
            });
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('OAuth callback failed:', error);
          // Error will be handled by global error system
        }
      }
    };

    handleCallback();
  }, []);

  const login = () => {
    authService.login();
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  const setUser = (user: AuthUser) => {
    const asyncSetUser = async () => {
      const accessToken = await authService.getAccessToken();
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, accessToken } 
      });
    };
    asyncSetUser();
  };

  const refreshAuth = async () => {
    try {
      const refreshResponse = await jwtService.refreshTokens();
      const accessToken = await authService.getAccessToken();
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: refreshResponse.user, 
          accessToken: accessToken 
        } 
      });
    } catch (error) {
      console.error('Auth refresh failed:', error);
      // Error will be handled by global error system
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    setUser,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};