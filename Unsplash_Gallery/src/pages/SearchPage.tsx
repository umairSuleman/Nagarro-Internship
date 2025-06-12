import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { LoadingSpinner, ErrorAlert, ImageCard, Pagination } from '../components';
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Search Photos</h2>
      
      <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search for photos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevant">Relevant</option>
              <option value="latest">Latest</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Orientation:</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="squarish">Squarish</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Color:</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="black_and_white">Black & White</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
              <option value="purple">Purple</option>
              <option value="magenta">Magenta</option>
              <option value="green">Green</option>
              <option value="teal">Teal</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>
      </form>

      {error && <ErrorAlert message={error} />}

      {loading && <LoadingSpinner />}

      {hasSearched && !loading && photos.length === 0 && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No photos found for "{query}". Try a different search term or adjust your filters.
        </div>
      )}

      {photos.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-700">
              "{query}" ({total.toLocaleString()} photos)
            </h3>
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <ImageCard key={photo.id} photo={photo} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={currentPage < totalPages}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};