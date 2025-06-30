import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import { ImageCard, PageHeader, Section, Grid, Button } from '../components';
import { InfiniteScrollLoader } from '../components/common/InfiniteScrollLoader';
import { fetchHomePhotos, setCurrentPage, resetPhotos } from '../store/slices/homeSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { RootState, AppDispatch } from '../store/types';

export const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { photos, currentPage, perPage, hasMore, isInitialLoad } = useSelector(
    (state: RootState) => state.home
  );
  
  // Check if specifically the home photos are loading
  const loading = useSelector((state: RootState) => 
    Object.keys(state.global.loading).some(key => 
      key.includes('home/fetchPhotos') && state.global.loading[key]
    )
  );

  // Get loading error if any
  const error = useSelector((state: RootState) => 
    Object.entries(state.global.errors).find(([key]) => 
      key.includes('home/fetchPhotos')
    )?.[1] || null
  );

  // Memoize the loadPhotos function to prevent unnecessary recreations
  const loadPhotos = useCallback((page: number = 1, append: boolean = false) => {
    if (append) {
      dispatch(setCurrentPage(page));
    }
    dispatch(fetchHomePhotos({
      page,
      per_page: perPage,
      append
    }));
  }, [dispatch, perPage]);

  // Memoize loadMorePhotos and add loading check
  const loadMorePhotos = useCallback(() => {
    if (hasMore && !loading && currentPage) {
      const nextPage = currentPage + 1;
      loadPhotos(nextPage, true);
    }
  }, [hasMore, loading, currentPage, loadPhotos]);

  // Infinite scroll hook with stable options
  const infiniteScrollOptions = useMemo(() => ({
    hasMore,
    loading,
    threshold: 0.1,
    rootMargin: '200px'
  }), [hasMore, loading]);

  const { loadMoreRef, isIntersecting } = useInfiniteScroll(infiniteScrollOptions);

  // Load more when intersecting - add debouncing
  useEffect(() => {
    if (isIntersecting && !isInitialLoad && !loading) {
      // Add a small delay to prevent rapid firing
      const timeoutId = setTimeout(() => {
        loadMorePhotos();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isIntersecting, loadMorePhotos, isInitialLoad, loading]);

  // Initial load - only run once
  useEffect(() => {
    if (photos.length === 0 && !loading) {
      loadPhotos();
    }
  }, []); // Remove dependencies to run only once

  const handleRefresh = useCallback(() => {
    dispatch(resetPhotos());
    loadPhotos(1, false);
  }, [dispatch, loadPhotos]);

  const refreshAction = useMemo(() => (
    <Button
      onClick={handleRefresh}
      disabled={loading}
      icon={RefreshCw}
      loading={loading}
    >
      Refresh
    </Button>
  ), [handleRefresh, loading]);

  return (
    <Section>
      <PageHeader
        title="Editorial Photos"
        action={refreshAction}
      />

      <Section>
        <Grid cols={4}>
          {photos.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </Grid>

        {/* Infinite scroll loader */}
        <InfiniteScrollLoader
          loading={loading}
          hasMore={hasMore}
          loadMoreRef={loadMoreRef}
          error={error}
          onRetry={loadMorePhotos}
        />
      </Section>
    </Section>
  );
};