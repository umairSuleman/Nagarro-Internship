import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unsplashService } from "@/services";
import type { UnsplashPhoto, SearchParams } from "@/types";
import type { BaseState } from "../types";

interface SearchState extends BaseState {
  photos: UnsplashPhoto[];
  query: string;
  total: number;
  totalPages: number;
  currentPage: number;
  hasSearched: boolean;
  orderBy: 'relevant' | 'latest';
  orientation: '' | 'landscape' | 'portrait' | 'squarish';
  color: string;
}

const initialState: SearchState = {
  photos: [],
  loading: false,
  error: null,
  query: '',
  total:0,
  totalPages: 0,
  currentPage: 1,
  hasSearched: false,
  orderBy: 'relevant',
  orientation: '',
  color: '',
};

export const searchPhotos = createAsyncThunk(
  'search/searchPhotos',
  async (params: SearchParams) => {
    const response = await unsplashService.searchPhotos({
      ...params,
      content_filter:'low',
    });
    return response;
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
    clearError: (state) => {
      state.error = null;
    },
    resetSearch: (state) => {
      state.photos= [];
      state.total=0;
      state.totalPages=0;
      state.currentPage=1;
      state.hasSearched=false;
      state.error=null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasSearched = true;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos= action.payload.results;
        state.total = action.payload.total;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(searchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to Search Photos';
      });
  },
});

export const {
  setQuery,
  setCurrentPage,
  setOrderBy,
  setOrientation,
  setColor,
  clearError,
  resetSearch,
} = searchSlice.actions;