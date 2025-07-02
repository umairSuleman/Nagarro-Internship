import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface InfiniteScrollLoaderProps {
  loading: boolean;
  hasMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  error?: string | null;
  onRetry?: () => void;
}

export const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  loading,
  hasMore,
  loadMoreRef,
  error,
  onRetry
}) => {
  if (!hasMore && !loading && !error) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No more photos to load</p>
      </div>
    );
  }

  return (
    <div 
      ref={loadMoreRef} 
      className="py-8 flex justify-center items-center min-h-[120px]"
    >
      {loading && <LoadingSpinner />}
      
      {error && !loading && (
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load more photos</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      )}
      
      {!loading && !error && hasMore && (
        <div className="text-gray-500">
          <p>Loading more photos...</p>
        </div>
      )}
    </div>
  );
};