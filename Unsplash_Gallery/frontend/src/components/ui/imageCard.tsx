
import React from 'react';
import type { UnsplashPhoto } from '../../types';

interface ImageCardProps {
  photo: UnsplashPhoto;
}

export const ImageCard: React.FC<ImageCardProps> = ({ photo }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <img
      src={photo.urls.small}
      alt={photo.alt_description || photo.description || 'Unsplash photo'}
      className="w-full h-48 object-cover"
    />
    <div className="p-3">
      <p className="text-sm text-gray-600 truncate">
        {photo.alt_description || photo.description || 'Untitled'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        by {photo.user.name}
      </p>
    </div>
  </div>
);