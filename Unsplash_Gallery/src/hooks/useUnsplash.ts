
import { useState, useCallback } from 'react';
import { unsplashService } from '../services';
import type { 
  UnsplashPhoto, 
  SearchResponse, 
  CommonParams, 
  SearchParams, 
  RandomParams 
} from '../types';

interface UseUnsplashReturn {
  photos: UnsplashPhoto[];
  loading: boolean;
  error: string | null;
  total?: number;
  totalPages?: number;
  listPhotos: (params?: CommonParams) => Promise<void>;
  searchPhotos: (params: SearchParams) => Promise<SearchResponse | null>;
  getRandomPhotos: (params?: RandomParams) => Promise<void>;
  clearError: () => void;
}

export const useUnsplash = (): UseUnsplashReturn => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const listPhotos = useCallback(async (params?: CommonParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await unsplashService.listPhotos(params);
      setPhotos(data);
      setTotal(undefined);
      setTotalPages(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPhotos = useCallback(async (params: SearchParams): Promise<SearchResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await unsplashService.searchPhotos(params);
      setPhotos(data.results);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search photos');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRandomPhotos = useCallback(async (params?: RandomParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await unsplashService.getRandomPhotos(params);
      setPhotos(Array.isArray(data) ? data : [data]);
      setTotal(undefined);
      setTotalPages(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate random photos');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    photos,
    loading,
    error,
    total,
    totalPages,
    listPhotos,
    searchPhotos,
    getRandomPhotos,
    clearError
  };
};