import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unsplashService } from "@/services";
import type { UnsplashPhoto, RandomParams } from "@/types";
import type { BaseState } from "../types";

interface RandomState extends BaseState {
  photos: UnsplashPhoto[];
  count: number;
  orientation: '' | 'landscape' | 'portrait' | 'squarish';
}

const initialState : RandomState = {
  photos: [],
  count: 1,
  loading: false,
  error: null,
  orientation:'',
};


//async thunk for generating the random photo(s)
export const generateRandomPhotos = createAsyncThunk(
  'random/generateRandomPhotos',
  async (params: RandomParams= {}) => {
    const response = await unsplashService.getRandomPhotos({
      ...params,
      content_filter: 'low',
    });
    return Array.isArray(response) ? response : [response];
  }
);

export const randomSlice = createSlice({
  name: 'random',
  initialState,
  reducers: {
    setCount: (state, action) => {
      state.count= action.payload;
    },
    setOrientation: (state, action) => {
      state.orientation= action.payload;
    },
    clearError: (state) => {
      state.error= null;
    },
    clearPhotos: (state) => {
      state.photos= [];
    }
  },

  extraReducers:(builder) => {
    builder
      .addCase(generateRandomPhotos.pending, (state) =>{
        state.loading=true;
        state.error= null;
      })
      .addCase(generateRandomPhotos.fulfilled, (state, action) => {
        state.loading= false;
        state.photos= action.payload;
      })
      .addCase(generateRandomPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load Random Photo';
      });
  },
});

export const { setCount, setOrientation, clearError, clearPhotos }= randomSlice.actions;
