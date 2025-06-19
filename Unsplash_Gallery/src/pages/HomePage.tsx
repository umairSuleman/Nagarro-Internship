import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshCw } from 'lucide-react';

import { LoadingSpinner, ImageCard, Pagination, PageHeader, Section, Grid, Button, Alert } from '../components';
import { fetchHomePhotos, setCurrentPage, clearError } from '../store/slices/homeSlice';
import type { RootState, AppDispatch } from '../store/types';

export const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { photos, loading, error, currentPage, perPage } = useSelector(
    (state: RootState) => state.home
  );

  const loadPhotos = (page: number = 1) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchHomePhotos({
      page,
      per_page: perPage,
    }));
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      loadPhotos(newPage);
    }
  };

  const handleRefresh = () => {
    loadPhotos(currentPage);
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const refreshAction = (
    <Button
      onClick={handleRefresh}
      disabled={loading}
      icon={RefreshCw}
      loading={loading}
    >
      Refresh
    </Button>
  );

  return (
    <Section>
      <PageHeader
        title="Editorial Photos"
        action={refreshAction}
      />

      {error && (
        <Alert 
          message={error} 
          type="error" 
          dismissible 
          onDismiss={handleClearError}
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Section>
          <Grid cols={4}>
            {photos.map((photo) => (
              <ImageCard key={photo.id} photo={photo} />
            ))}
          </Grid>

          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={photos.length === perPage}
            loading={loading}
          />
        </Section>
      )}
    </Section>
  );
};