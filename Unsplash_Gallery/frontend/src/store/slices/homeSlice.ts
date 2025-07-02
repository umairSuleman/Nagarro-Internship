import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unsplashService } from "@/services";
import type { UnsplashPhoto, CommonParams } from "@/types";

interface HomeState {
  photos: UnsplashPhoto[];
  currentPage: number;
  perPage: number;
  hasMore: boolean;
  isInitialLoad: boolean;
}

const initialState: HomeState = {
  photos: [],
  currentPage: 1,
  perPage: 12, 
  hasMore: true,
  isInitialLoad: true
};

export const fetchHomePhotos = createAsyncThunk(
  'home/fetchPhotos',
  async (params: CommonParams & { append?: boolean } = {}) => {
    const response = await unsplashService.listPhotos({
      ...params,
      content_filter: 'low',
    });
    return { photos: response, append: params.append || false };
  }
);

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetPhotos: (state) => {
      state.photos = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.isInitialLoad = true;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder 
      .addCase(fetchHomePhotos.fulfilled, (state, action) => {
        const { photos, append } = action.payload;
        
        if (append) {
          const newPhotos = photos.filter(
            newPhoto => !state.photos.some(existingPhoto => existingPhoto.id === newPhoto.id)
          );
          state.photos = [...state.photos, ...newPhotos];
        } else {
          state.photos = photos;
          state.isInitialLoad = false;
        }
        
        state.hasMore = photos.length === state.perPage;
      });
  }
});

export const { setCurrentPage, resetPhotos, setHasMore } = homeSlice.actions;