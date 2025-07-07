import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  globalLoading: boolean;
  globalError: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>;
}

const initialState: UIState = {
  globalLoading: false,
  globalError: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'info' | 'warning';
      message: string;
      duration?: number;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
    setGlobalLoading,
    setGlobalError,
    addNotification,
    removeNotification,
    clearAllNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;