import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LoadingSpinner,
  ImageCard,
  PageHeader,
  Section,
  Grid,
  RandomControls,
  Alert,
  EmptyState
} from '../components';
import { 
  generateRandomPhotos, 
  setCount, 
  setOrientation, 
  clearError 
} from '../store/slices/randomSlice';
import type { RootState, AppDispatch } from '../store/types';

export const RandomPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { photos, loading, error, count, orientation } = useSelector(
    (state: RootState) => state.random
  );

  const handleGenerateRandomPhotos = () => {
    const params: any = { count };
    if (orientation) {
      params.orientation = orientation;
    }
    dispatch(generateRandomPhotos(params));
  };

  const handleCountChange = (newCount: number) => {
    dispatch(setCount(newCount));
  };

  const handleOrientationChange = (newOrientation: '' | 'landscape' | 'portrait' | 'squarish') => {
    dispatch(setOrientation(newOrientation));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <Section>
      <PageHeader title="Random Photos" />
      
      <RandomControls
        count={count}
        onCountChange={handleCountChange}
        orientation={orientation}
        onOrientationChange={handleOrientationChange}
        onGenerate={handleGenerateRandomPhotos}
        loading={loading}
      />

      {error && (
        <Alert 
          message={error} 
          type="error" 
          dismissible 
          onDismiss={handleClearError}
        />
      )}

      {loading && <LoadingSpinner />}

      {photos.length === 0 && !loading && !error && (
        <EmptyState
          title="No photos generated yet"
          description="Click the 'Generate Random' button to get started!"
        />
      )}

      {photos.length > 0 && !loading && (
        <Grid cols={4}>
          {photos.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </Grid>
      )}
    </Section>
  );
};