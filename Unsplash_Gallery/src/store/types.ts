import type { AsyncThunkAction } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./index";

export type { RootState, AppDispatch };

export type ThunkReturnType<T> = ReturnType<AsyncThunkAction<T, any, any>>;

