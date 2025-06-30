import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

//async thunk for handling OAuth callback
export const handleOAuthCallback = createAsyncThunk(
  'auth/handleOAuthCallback',
  async (code: string) => {
    const tokens = await authService.exchangeCodeForToken(code);
    const user = await authService.getCurrentUser();
    return { tokens, user };
  }
);

//async thunk for getting current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    return await authService.getCurrentUser();
  }
);

//async thunk for checking authentication status on app load
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Checking auth status...');
      if (authService.isAuthenticated()) {
        console.log('User appears to be authenticated, fetching user data...');
        const user = await authService.getCurrentUser();
        const accessToken = authService.getAccessToken();
        console.log('Auth check successful:', { user: user.username, tokenExists: !!accessToken });
        return { user, accessToken };
      }
      console.log('User not authenticated');
      return null;
    } catch (error) {
      console.error('Auth check failed:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Auth check failed');
    }
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    //set access token directly (for manual token updates)
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      //handle OAuth callback
      .addCase(handleOAuthCallback.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access_token;
        state.isAuthenticated = true;
      })
      
      //get current user
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      
      //check auth status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
  },
});

export const { logout, setAccessToken } = authSlice.actions;