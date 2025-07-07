import { createSlice, createAsyncThunk, PayloadAction, isRejectedWithValue } from "@reduxjs/toolkit";
import type { User, LoginRequest, RegisterRequest } from '../../types/auth';
import { authAPI } from '../../services/authAPI';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

//Async Thunks
export const loginUser = createAsyncThunk('auth/login',
    async ( credentials: LoginRequest, {rejectWithValue}) => {
        try{
            const response = await authAPI.login(credentials);
            return response.user;
        }
        catch(error){
            return rejectWithValue( error instanceof Error ? error.message: 'Login Failed');
        }
    }
);

export const registerUser = createAsyncThunk('auth/register',
    async ( userData: RegisterRequest, {rejectWithValue}) => {
        try{
            const response = await authAPI.register(userData);
            return response.user;
        }
        catch(error){
            return rejectWithValue( error instanceof Error ? error.message: 'Registration Failed');
        }
    }
);

export const verifyToken = createAsyncThunk('auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyToken();
      return response.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Token verification failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', 
    async (_, { rejectWithValue }) => {
        try{
            await authAPI.logout();
            return true;
        }
        catch(error){
            return rejectWithValue( error instanceof Error ? error.message: 'Logout Failed');

        }
    }
);

const authSlice = createSlice({
    name: 'auth', 
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        resetAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: ( builder) => {
        builder
            //login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading= false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error= null;
            })
            .addCase(loginUser.rejected, (state, action)=> {
                state.loading = false;
                state.error= action.payload as string;
                state.isAuthenticated = false;
            })

            //register
            .addCase(registerUser.pending, (state)=> {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading= false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error= null;
            })
            .addCase(registerUser.rejected, (state, action)=> {
                state.loading = false;
                state.error= action.payload as string;
                state.isAuthenticated = false;
            })

            //verify token
            .addCase(verifyToken.pending, (state)=> {
                state.loading = true;
            })
            .addCase(verifyToken.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading= false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error= null;
            })
            .addCase(verifyToken.rejected, (state)=> {
                state.loading = false;
                state.isAuthenticated= false;
                state.user = null;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;




