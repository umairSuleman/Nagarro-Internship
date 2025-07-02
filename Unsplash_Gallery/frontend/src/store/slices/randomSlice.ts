import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unsplashService } from "@/services";
import type { UnsplashPhoto, RandomParams } from "@/types";

interface RandomState {
  photos: UnsplashPhoto[];
  count: number;
  orientation: '' | 'landscape' | 'portrait' | 'squarish';
}

const initialState : RandomState = {
  photos: [],
  count: 1,
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
    clearPhotos: (state) => {
      state.photos= [];
    }
  },

  extraReducers:(builder) => {
    builder
      .addCase(generateRandomPhotos.fulfilled, (state, action) => {
        state.photos= action.payload;
      });
  },
});

export const { setCount, setOrientation, clearPhotos }= randomSlice.actions;
