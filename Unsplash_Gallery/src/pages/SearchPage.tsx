import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ImageCard, 
  PageHeader,
  Section,
  Grid,
  SearchInput,
  FormCard,
  SearchFilters,
  Alert,
  StatusMessage
} from '../components';
import { InfiniteScrollLoader } from '../components/common/InfiniteScrollLoader';
import { 
  searchPhotos,
  setQuery,
  setCurrentPage,
  setOrderBy,
  setOrientation,
  setColor,
  resetSearch,
} from '../store/slices/searchSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { RootState, AppDispatch } from '../store/types';
import type { SearchParams } from '../types';

export const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => 
    Object.keys(state.global.loading).some(key => 
      key.includes('search/searchPhotos') && state.global.loading[key]
    )
  );

  const error = useSelector((state: RootState) => 
    Object.entries(state.global.errors).find(([key]) => 
      key.includes('search/searchPhotos')
    )?.[1] || null
  );

  const {
    photos,
    query,
    total,
    totalPages,
    currentPage,
    hasSearched,
    hasMore,
    orderBy,
    orientation,
    color,
    isInitialSearch
  } = useSelector((state: RootState) => state.search);

  const handleSearch = useCallback((page: number = 1, append: boolean = false) => {
    if (!query.trim() || loading) return;

    if (append) {
      dispatch(setCurrentPage(page));
    }
    
    const params: SearchParams & { append?: boolean } = {
      query: query.trim(),
      page,
      per_page: 12,
      order_by: orderBy,
      append
    };
    
    if (orientation) params.orientation = orientation;
    if (color) params.color = color as any;
    
    dispatch(searchPhotos(params));
  }, [query, loading, orderBy, orientation, color, dispatch]);

  const loadMorePhotos = useCallback(() => {
    if (hasMore && !loading && query.trim() && currentPage) {
      const nextPage = currentPage + 1;
      handleSearch(nextPage, true);
    }
  }, [hasMore, loading, query, currentPage, handleSearch]);

  // Infinite scroll hook with memoized options
  const infiniteScrollOptions = useMemo(() => ({
    hasMore,
    loading,
    threshold: 0.1,
    rootMargin: '200px'
  }), [hasMore, loading]);

  const { loadMoreRef, isIntersecting } = useInfiniteScroll(infiniteScrollOptions);

  // Load more when intersecting - add debouncing
  useEffect(() => {
    if (isIntersecting && !isInitialSearch && hasSearched && !loading) {
      const timeoutId = setTimeout(() => {
        loadMorePhotos();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isIntersecting, loadMorePhotos, isInitialSearch, hasSearched, loading]);

  const handleSearchSubmit = useCallback(() => {
    dispatch(resetSearch());
    dispatch(setCurrentPage(1));
    handleSearch(1, false);
  }, [dispatch, handleSearch]);

  const handleQueryChange = useCallback((newQuery: string) => {
    dispatch(setQuery(newQuery));
  }, [dispatch]);

  const handleOrderByChange = useCallback((newOrderBy: 'relevant' | 'latest') => {
    dispatch(setOrderBy(newOrderBy));
    if (hasSearched && query.trim()) {
      dispatch(resetSearch());
      setTimeout(() => handleSearch(1, false), 0);
    }
  }, [dispatch, hasSearched, query, handleSearch]);

  const handleOrientationChange = useCallback((newOrientation: '' | 'landscape' | 'portrait' | 'squarish') => {
    dispatch(setOrientation(newOrientation));
    if (hasSearched && query.trim()) {
      dispatch(resetSearch());
      setTimeout(() => handleSearch(1, false), 0);
    }
  }, [dispatch, hasSearched, query, handleSearch]);

  const handleColorChange = useCallback((newColor: string) => {
    dispatch(setColor(newColor));
    if (hasSearched && query.trim()) {
      dispatch(resetSearch());
      setTimeout(() => handleSearch(1, false), 0);
    }
  }, [dispatch, hasSearched, query, handleSearch]);

  return (
    <Section>
      <PageHeader title="Search Photos" />
      
      <FormCard>
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          onSubmit={handleSearchSubmit}
          placeholder="Search for photos..."
          disabled={loading}
          loading={loading}
        />
        
        <SearchFilters
          orderBy={orderBy}
          onOrderByChange={handleOrderByChange}
          orientation={orientation}
          onOrientationChange={handleOrientationChange}
          color={color}
          onColorChange={handleColorChange}
        />
      </FormCard>

      {hasSearched && !loading && photos.length === 0 && !error && (
        <Alert 
          message={`No photos found for "${query}". Try a different search term or adjust your filters.`}
          type="info"
        />
      )}

      {photos.length > 0 && (
        <Section>
          <StatusMessage
            query={query}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
          />
          
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
      )}
    </Section>
  );
};