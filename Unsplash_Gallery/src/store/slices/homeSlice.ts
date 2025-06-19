import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unsplashService } from "@/services";
import type { UnsplashPhoto, CommonParams } from "@/types";
import type { BaseState } from "../types";

interface HomeState extends BaseState {
  photos: UnsplashPhoto[];
  currentPage: number;
  perPage: number;
}

const initialState: HomeState= {
  photos: [],
  loading : false,
  error : null,
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
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePhotos.pending, (state) => {
        state.loading = true;
        state.error= null;
      })
      .addCase(fetchHomePhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchHomePhotos.rejected, (state, action) => {
        state.loading= false;
        state.error= action.error.message || 'Failed to load photos';
      });
  },
});

export const { setCurrentPage, clearError }= homeSlice.actions;