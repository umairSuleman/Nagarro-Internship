import { configureStore } from '@reduxjs/toolkit'
import { homeSlice } from '@/store/slices/homeSlice';
import { searchSlice } from '@/store/slices/searchSlice';
import { randomSlice } from '@/store/slices/randomSlice';

export const store = configureStore ({
    reducer: {
        home: homeSlice.reducer,
        random: randomSlice.reducer,
        search: searchSlice.reducer,
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



