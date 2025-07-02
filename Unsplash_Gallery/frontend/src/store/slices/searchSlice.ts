import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unsplashService } from "@/services";
import type { UnsplashPhoto, SearchParams } from "@/types";

interface SearchState {
  photos: UnsplashPhoto[];
  query: string;
  total: number;
  totalPages: number;
  currentPage: number;
  hasSearched: boolean;
  hasMore: boolean;
  orderBy: 'relevant' | 'latest';
  orientation: '' | 'landscape' | 'portrait' | 'squarish';
  color: string;
  isInitialSearch: boolean;
}

const initialState: SearchState = {
  photos: [],
  query: '',
  total: 0,
  totalPages: 0,
  currentPage: 1,
  hasSearched: false,
  hasMore: false,
  orderBy: 'relevant',
  orientation: '',
  color: '',
  isInitialSearch: true,
};

export const searchPhotos = createAsyncThunk(
  'search/searchPhotos',
  async (params: SearchParams & { append?: boolean }) => {
    const response = await unsplashService.searchPhotos({
      ...params,
      content_filter: 'low',
    });
    return { ...response, append: params.append || false };
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setOrderBy: (state, action) => {
      state.orderBy = action.payload;
    },
    setOrientation: (state, action) => {
      state.orientation = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    resetSearch: (state) => {
      state.photos = [];
      state.total = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.hasSearched = false;
      state.hasMore = false;
      state.isInitialSearch = true;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPhotos.pending, (state, action) => {
        state.hasSearched = true;
        // Only reset photos if it's a new search (not append)
        if (!action.meta.arg.append) {
          state.photos = [];
          state.currentPage = 1;
          state.isInitialSearch = false;
        }
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        const { results, total, total_pages, append } = action.payload;
        
        state.total = total;
        state.totalPages = total_pages;
        
        if (append) {
          // Append new photos for infinite scroll
          const newPhotos = results.filter(
            newPhoto => !state.photos.some(existingPhoto => existingPhoto.id === newPhoto.id)
          );
          state.photos = [...state.photos, ...newPhotos];
        } else {
          // Replace photos for new search
          state.photos = results;
        }
        
        // Update hasMore based on current page vs total pages
        state.hasMore = state.currentPage < total_pages;
      });
  },
});

export const {
  setQuery,
  setCurrentPage,
  setOrderBy,
  setOrientation,
  setColor,
  resetSearch,
  setHasMore,
} = searchSlice.actions;