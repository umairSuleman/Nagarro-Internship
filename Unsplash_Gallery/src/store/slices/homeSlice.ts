import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unsplashService } from "@/services";
import type { UnsplashPhoto, CommonParams } from "@/types";

interface HomeState {
  photos: UnsplashPhoto[];
  currentPage: number;
  perPage: number;
}

const initialState: HomeState= {
  photos: [],
  currentPage: 1,
  perPage: 10
};


//async thunk for fetching photos
export const fetchHomePhotos = createAsyncThunk(
  'home/fetchPhotos',
  async ( params: CommonParams = {}) => {
    const response = await unsplashService.listPhotos({
      ...params,
      content_filter: 'low',
    });
    return response;
  }
);


export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder 
      .addCase(fetchHomePhotos.fulfilled, (state, action) => {
        state.photos = action.payload;
      });
  }
});

export const { setCurrentPage }= homeSlice.actions;