import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import { ImageCard, PageHeader, Section, Grid, Button } from '../components';
import { InfiniteScrollLoader } from '../components/common/InfiniteScrollLoader';
import { fetchHomePhotos, setCurrentPage, resetPhotos } from '../store/slices/homeSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { RootState, AppDispatch } from '../store/types';

export const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { photos, currentPage, perPage, hasMore, isInitialLoad } = useSelector(
    (state: RootState) => state.home
  );
  
  const loading = useSelector((state: RootState) => 
    Object.keys(state.global.loading).some(key => 
      key.includes('home/fetchPhotos') && state.global.loading[key]
    )
  );

  const error = useSelector((state: RootState) => 
    Object.entries(state.global.errors).find(([key]) => 
      key.includes('home/fetchPhotos')
    )?.[1] || null
  );

  //memoize the loadPhotos function to prevent unnecessary recreations
  const loadPhotos = useCallback((page: number = 1, append: boolean = false) => {
    // Clear any pending timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    if (append) {
      dispatch(setCurrentPage(page));
    }
    dispatch(fetchHomePhotos({
      page,
      per_page: perPage,
      append
    }));
  }, [dispatch, perPage]);

  //memoize loadMorePhotos with better loading check
  const loadMorePhotos = useCallback(() => {
    if (hasMore && !loading && currentPage && !isInitialLoad) {
      const nextPage = currentPage + 1;
      console.log('Loading more photos - page:', nextPage);
      loadPhotos(nextPage, true);
    }
  }, [hasMore, loading, currentPage, loadPhotos, isInitialLoad]);

  //infinite scroll hook with stable options
  const infiniteScrollOptions = useMemo(() => ({
    hasMore: hasMore && !isInitialLoad, 
    loading,
    threshold: 0.1,
    rootMargin: '200px'
  }), [hasMore, loading, isInitialLoad]);

  const { loadMoreRef, isIntersecting } = useInfiniteScroll(infiniteScrollOptions);

  //handle intersection with better debouncing and condition checking
  useEffect(() => {
    if (isIntersecting && !isInitialLoad && !loading && hasMore) {
      console.log('Intersection detected, loading more photos...');
      
      //add debouncing to prevent rapid firing
      loadingTimeoutRef.current = setTimeout(() => {
        loadMorePhotos();
      }, 150);
      
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }
  }, [isIntersecting, loadMorePhotos, isInitialLoad, loading, hasMore]);

  //initial load - only runs once on mount
  useEffect(() => {
    if (photos.length === 0 && !loading && isInitialLoad) {
      console.log('Initial load of home photos...');
      loadPhotos();
    }
  }, []); 

  const handleRefresh = useCallback(() => {
    console.log('Refreshing home photos...');
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

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

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

        {photos.length > 0 && !isInitialLoad && (
          <InfiniteScrollLoader
            loading={loading}
            hasMore={hasMore}
            loadMoreRef={loadMoreRef}
            error={error}
            onRetry={loadMorePhotos}
          />
        )}
      </Section>
    </Section>
  );
};