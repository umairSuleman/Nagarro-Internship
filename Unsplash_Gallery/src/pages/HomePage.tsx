
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { LoadingSpinner, ErrorAlert, ImageCard, Pagination } from '../components';
import { unsplashService } from '../services';
import type { UnsplashPhoto } from '../types';

export const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Editorial Photos</h2>
        <button
          onClick={() => loadPhotos(currentPage)}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <ImageCard key={photo.id} photo={photo} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={photos.length === perPage}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};