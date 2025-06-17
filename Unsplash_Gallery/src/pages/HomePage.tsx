
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

import { LoadingSpinner, ImageCard, Pagination, PageHeader, Section, Grid, Button, Alert } from '../components';
import { unsplashService } from '../services';
import type { UnsplashPhoto } from '../types';

export const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const loadPhotos = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await unsplashService.listPhotos({
        page,
        per_page: perPage,
        content_filter: 'low'
      });
      setPhotos(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      loadPhotos(newPage);
    }
  };

  const refreshAction = (
    <Button
      onClick={() => loadPhotos(currentPage)}
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

      {error && <Alert message={error} type="error"/>}

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