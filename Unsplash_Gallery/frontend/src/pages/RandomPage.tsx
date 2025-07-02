import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ImageCard,
  PageHeader,
  Section,
  Grid,
  RandomControls,
  EmptyState
} from '../components';
import { generateRandomPhotos, setCount, setOrientation } from '../store/slices/randomSlice';
import type { RootState, AppDispatch } from '../store/types';

export const RandomPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { photos, count, orientation } = useSelector(
    (state: RootState) => state.random
  );

  // Check if specifically the random photos are loading
  const loading = useSelector((state: RootState) => 
    Object.keys(state.global.loading).some(key => 
      key.includes('random/generateRandomPhotos') && state.global.loading[key]
    )
  );

  const handleGenerateRandomPhotos = () => {
    const params: any = {count};
    if(orientation) {
      params.orientation = orientation;
    }
    dispatch(generateRandomPhotos(params));
  };

  const handleCountChange = (newCount: number) => {
    dispatch(setCount(newCount));
  };

  //orientation type
  type OrientationType = '' | 'landscape' | 'portrait' | 'squarish';

  const handleOrientationChange = (newOrientation: OrientationType) => {
    dispatch(setOrientation(newOrientation));
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

      {photos.length === 0 && !loading && (
        <EmptyState
          title="No photos generated yet"
          description="Click the 'Generate Random' button to get started!"
        />
      )}

      {photos.length > 0 && (
        <Grid cols={4}>
          {photos.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </Grid>
      )}
    </Section>
  );
};
