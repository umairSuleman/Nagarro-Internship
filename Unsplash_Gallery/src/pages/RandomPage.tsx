
import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { LoadingSpinner, ErrorAlert, ImageCard } from '../components';
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

  useEffect(() => {
    generateRandomPhotos();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Random Photos</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Count:</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
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
          
          <button
            onClick={generateRandomPhotos}
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Shuffle size={20} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Generating...' : 'Generate Random'}</span>
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading && <LoadingSpinner />}

      {photos.length > 0 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
};