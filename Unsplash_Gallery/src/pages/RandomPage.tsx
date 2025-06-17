import React, { useState } from 'react';
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
import { unsplashService } from '../services';
import type { UnsplashPhoto, RandomParams } from '../types';

export const RandomPage: React.FC = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'squarish' | ''>('');

  const generateRandomPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: RandomParams = {
        count,
        content_filter: 'low'
      };
      
      if (orientation) {
        params.orientation = orientation;
      }
      
      const data = await unsplashService.getRandomPhotos(params);
      setPhotos(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate random photos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <PageHeader title="Random Photos" />
      
      <RandomControls
        count={count}
        onCountChange={setCount}
        orientation={orientation}
        onOrientationChange={setOrientation}
        onGenerate={generateRandomPhotos}
        loading={loading}
      />

      {error && <Alert message={error} type="error" />}

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