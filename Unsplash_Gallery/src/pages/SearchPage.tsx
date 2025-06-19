import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LoadingSpinner, 
  ImageCard, 
  Pagination,
  PageHeader,
  Section,
  Grid,
  SearchInput,
  FormCard,
  SearchFilters,
  Alert,
  StatusMessage
} from '../components';
import { 
  searchPhotos,
  setQuery,
  setCurrentPage,
  setOrderBy,
  setOrientation,
  setColor,
} from '../store/slices/searchSlice';
import type { RootState, AppDispatch } from '../store/types';
import type { SearchParams } from '../types';
import { clearError } from '@/store/slices/globalSlice';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';


export const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentRequestId, setCurrentRequestId] = useState('');

  const {loading, error } = useAsyncOperation(currentRequestId);

  const {
    photos,
    query,
    total,
    totalPages,
    currentPage,
    hasSearched,
    orderBy,
    orientation,
    color
  } = useSelector((state: RootState) => state.search);

  const handleSearch = (page: number = 1) => {
    if (!query.trim() || loading) return;

    dispatch(setCurrentPage(page));
    
    const params: SearchParams = {
      query: query.trim(),
      page,
      per_page: 12,
      order_by: orderBy,
    };
    
    if (orientation) params.orientation = orientation;
    if (color) params.color = color as any;
    
    const action = dispatch(searchPhotos(params));

    setCurrentRequestId(action.requestId);
  };

  const handleSearchSubmit = () => {
    dispatch(setCurrentPage(1));
    handleSearch(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  };

  const handleQueryChange = (newQuery: string) => {
    dispatch(setQuery(newQuery));
  };

  const handleOrderByChange = (newOrderBy: 'relevant' | 'latest') => {
    dispatch(setOrderBy(newOrderBy));
  };

  const handleOrientationChange = (newOrientation: '' | 'landscape' | 'portrait' | 'squarish') => {
    dispatch(setOrientation(newOrientation));
  };

  const handleColorChange = (newColor: string) => {
    dispatch(setColor(newColor));
  };

  const handleClearError = () => {
    if(currentRequestId){
      dispatch(clearError(currentRequestId));
    }
  };

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

      {error && (
        <Alert 
          message={error} 
          type="error" 
          dismissible 
          onDismiss={handleClearError}
        />
      )}

      {loading && <LoadingSpinner />}

      {hasSearched && !loading && photos.length === 0 && (
        <Alert 
          message={`No photos found for "${query}". Try a different search term or adjust your filters.`}
          type="info"
        />
      )}

      {photos.length > 0 && !loading && (
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
          
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={currentPage < totalPages}
            loading={loading}
          />
        </Section>
      )}
    </Section>
  );
};