import React, { useState } from 'react';
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
import { unsplashService } from '../services';
import type { UnsplashPhoto, SearchParams } from '../types';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState<'relevant' | 'latest'>('relevant');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'squarish' | ''>('');
  const [color, setColor] = useState<string>('');

  const handleSearch = async (page: number = 1) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const params: SearchParams = {
        query: query.trim(),
        page,
        per_page: 12,
        order_by: orderBy,
        content_filter: 'low'
      };
      
      if (orientation) params.orientation = orientation;
      if (color) params.color = color as any;
      
      const data = await unsplashService.searchPhotos(params);
      setPhotos(data.results);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search photos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    handleSearch(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  };

  return (
    <Section>
      <PageHeader title="Search Photos" />
      
      <FormCard>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSearchSubmit}
          placeholder="Search for photos..."
          disabled={loading}
          loading={loading}
        />
        
        <SearchFilters
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
          orientation={orientation}
          onOrientationChange={setOrientation}
          color={color}
          onColorChange={setColor}
        />
      </FormCard>

      {error && <Alert message={error} type="error" />}

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