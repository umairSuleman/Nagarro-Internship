import React, { useEffect, useCallback, useMemo, useRef } from 'react';
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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) {
      console.log('Search skipped:', { query: trimmedQuery, loading });
      return;
    }

    //clear any pending timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (append) {
      dispatch(setCurrentPage(page));
    }
    
    const params: SearchParams & { append?: boolean } = {
      query: trimmedQuery,
      page,
      per_page: 12,
      order_by: orderBy,
      append
    };
    
    if (orientation) params.orientation = orientation;
    if (color) params.color = color as any;
    
    console.log('Searching with params:', params);
    dispatch(searchPhotos(params));
  }, [query, loading, orderBy, orientation, color, dispatch]);

  const loadMorePhotos = useCallback(() => {
    const trimmedQuery = query.trim();
    if (hasMore && !loading && trimmedQuery && currentPage && !isInitialSearch) {
      const nextPage = currentPage + 1;
      console.log('Loading more search results - page:', nextPage);
      handleSearch(nextPage, true);
    }
  }, [hasMore, loading, query, currentPage, handleSearch, isInitialSearch]);

  const infiniteScrollOptions = useMemo(() => ({
    hasMore: hasMore && hasSearched && !isInitialSearch,
    loading,
    threshold: 0.8,
    rootMargin: '50px'
  }), [hasMore, hasSearched, loading, isInitialSearch]);

  const { loadMoreRef, isIntersecting } = useInfiniteScroll(infiniteScrollOptions);

  //handle intersection with better debouncing
  useEffect(() => {
    if (isIntersecting && !isInitialSearch && hasSearched && !loading && hasMore && query.trim()) {
      console.log('Search intersection detected, loading more results...');
      
      //add debouncing to prevent rapid firing
      loadingTimeoutRef.current = setTimeout(() => {
        loadMorePhotos();
      }, 300);
      
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }
  }, [isIntersecting, loadMorePhotos, isInitialSearch, hasSearched, loading, hasMore, query]);

  const handleSearchSubmit = useCallback(() => {
    if (!query.trim()) return;
    
    console.log('Search submitted:', query.trim());
    dispatch(resetSearch());
    dispatch(setCurrentPage(1));
    
    //small delay to ensure state is reset before search
    setTimeout(() => {
      handleSearch(1, false);
    }, 50);
  }, [dispatch, handleSearch, query]);

  const handleQueryChange = useCallback((newQuery: string) => {
    dispatch(setQuery(newQuery));
  }, [dispatch]);

  const handleFilterChange = useCallback((filterAction: any) => {
    dispatch(filterAction);
    
    //if user has already searched, perform new search with updated filters
    if (hasSearched && query.trim()) {
      dispatch(resetSearch());
      
      //use timeout to ensure filter state is updated before search
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(1, false);
      }, 100);
    }
  }, [dispatch, hasSearched, query, handleSearch]);

  const handleOrderByChange = useCallback((newOrderBy: 'relevant' | 'latest') => {
    handleFilterChange(setOrderBy(newOrderBy));
  }, [handleFilterChange]);

  const handleOrientationChange = useCallback((newOrientation: '' | 'landscape' | 'portrait' | 'squarish') => {
    handleFilterChange(setOrientation(newOrientation));
  }, [handleFilterChange]);

  const handleColorChange = useCallback((newColor: string) => {
    handleFilterChange(setColor(newColor));
  }, [handleFilterChange]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

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
          
          {hasSearched && !isInitialSearch && (
            <InfiniteScrollLoader
              loading={loading}
              hasMore={hasMore}
              loadMoreRef={loadMoreRef}
              error={error}
              onRetry={loadMorePhotos}
            />
          )}
        </Section>
      )}
    </Section>
  );
};