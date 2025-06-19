import { createSlice, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";

interface GlobalState {
  loading: Record<string, boolean>; 
  errors: Record<string, string | null>; 
}

const initialState: GlobalState = {
  loading: {},
  errors: {}
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // Clear specific error by requestId
    clearError: (state, action) => {
      const requestId = action.payload;
      delete state.errors[requestId];
    },
    clearAllErrors: (state) => {
      state.errors ={};
    }
  },
  extraReducers: (builder) => {
    builder
    .addMatcher(
      isPending,
      (state, action) => {
        const requestId = action.meta.requestId;
        state.loading[requestId] = true;
        delete state.errors[requestId];
      }
    )

    // Handle all fulfilled states
    .addMatcher(
      isFulfilled,
      (state, action) => {
        const requestId = action.meta.requestId;
        state.loading[requestId] = false;
        delete state.errors[requestId];
      }
    )

    // Handle all rejected states
    .addMatcher(
      isRejected,
      (state, action) => {
        const requestId = action.meta.requestId;
        state.loading[requestId] = false;
        state.errors[requestId] = action.error?.message || 'An error occurred';
      }
    );
  }
});

export const { clearError } = globalSlice.actions;

// Selector hooks for easy access in components
export const selectIsLoading = (state: { global: GlobalState }, requestId: string) => 
  state.global.loading[requestId] || false;

export const selectError = (state: { global: GlobalState }, requestId: string) => 
  state.global.errors[requestId] || null;
