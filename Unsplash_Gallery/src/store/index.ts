import { configureStore } from '@reduxjs/toolkit'
import { homeSlice } from './slices/homeSlice';
import { searchSlice } from './slices/searchSlice';
import { randomSlice } from './slices/randomSlice';
import { globalSlice } from './slices/globalSlice';
import { authSlice } from './slices/authSlice';

export const store = configureStore ({
    reducer: {
        home: homeSlice.reducer,
        random: randomSlice.reducer,
        search: searchSlice.reducer,
        global: globalSlice.reducer,
        auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
 });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



