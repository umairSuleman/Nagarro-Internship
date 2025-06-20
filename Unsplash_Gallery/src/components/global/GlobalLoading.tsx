import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const GlobalLoading: React.FC = () => {
  const hasAnyLoading = useSelector((state: RootState) => 
    Object.values(state.global.loading).some(Boolean)
  );

  if (!hasAnyLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};