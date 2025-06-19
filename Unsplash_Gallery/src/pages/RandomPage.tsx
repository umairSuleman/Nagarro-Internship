import React, { useState } from 'react';
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
import { generateRandomPhotos, setCount, setOrientation } from '../store/slices/randomSlice';
import type { RootState, AppDispatch } from '../store/types';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { clearError } from '@/store/slices/globalSlice';

export const RandomPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [currentRequestId, setCurrentRequestId] = useState('');

  const { photos, count, orientation } = useSelector(
    (state: RootState) => state.random
  );

  const { loading, error } = useAsyncOperation(currentRequestId);

  const handleGenerateRandomPhotos = () => {
    const params: any = {count};
    if(orientation) {
      params.orientation = orientation;
    }
    const action = dispatch(generateRandomPhotos(params));
    setCurrentRequestId(action.requestId);
  };

  const handleCountChange = (newCount: number) => {
    dispatch(setCount(newCount));
  };

  //orientation type
  type OrientationType = '' | 'landscape' | 'portrait' | 'squarish';

  const handleOrientationChange = (newOrientation: OrientationType) => {
    dispatch(setOrientation(newOrientation));
  };

  const handleClearError = () => {
    if (currentRequestId) {
      dispatch(clearError(currentRequestId));
    }
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