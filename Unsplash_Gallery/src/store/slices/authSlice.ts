import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk for handling OAuth callback
export const handleOAuthCallback = createAsyncThunk(
  'auth/handleOAuthCallback',
  async (code: string) => {
    const tokens = await authService.exchangeCodeForToken(code);
    const user = await authService.getCurrentUser();
    return { tokens, user };
  }
);

// Async thunk for getting current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    return await authService.getCurrentUser();
  }
);

// Async thunk for checking authentication status on app load
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async () => {
    if (authService.isAuthenticated()) {
      const user = await authService.getCurrentUser();
      return {
        user,
        accessToken: authService.getAccessToken(),
      };
    }
    return null;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Logout
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Set access token directly (for manual token updates)
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle OAuth callback
      .addCase(handleOAuthCallback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleOAuthCallback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(handleOAuthCallback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Authentication failed';
        state.isAuthenticated = false;
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get user';
      })
      
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, logout, setAccessToken } = authSlice.actions;