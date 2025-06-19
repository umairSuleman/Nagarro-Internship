import type { RootState, AppDispatch } from "./index";

export type { RootState, AppDispatch };

export interface BaseState {
    loading : boolean;
    error: string | null;
}