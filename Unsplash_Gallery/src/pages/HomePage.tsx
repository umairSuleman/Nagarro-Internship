import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import { LoadingSpinner, ImageCard, Pagination, PageHeader, Section, Grid, Button, Alert } from '../components';
import { fetchHomePhotos, setCurrentPage } from '../store/slices/homeSlice';
import { clearError } from '../store/slices/globalSlice';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
import type { RootState, AppDispatch} from '../store/types';

export const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentRequestId, setCurrentRequestId] = useState('');
  
  const { photos, currentPage, perPage } = useSelector(
    (state: RootState) => state.home
  );
  
  const { loading, error } = useAsyncOperation(currentRequestId);

  const loadPhotos =  (page: number = 1) => {
    dispatch(setCurrentPage(page));
    const action =  dispatch(fetchHomePhotos({
      page,
      per_page: perPage,
    }));
    // Store the requestId for tracking this specific operation
    setCurrentRequestId(action.requestId);
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
    if (currentRequestId) {
      dispatch(clearError(currentRequestId));
    }
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