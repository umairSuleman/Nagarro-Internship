import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const GlobalLoading: React.FC = () => {
  const hasAnyLoading = useSelector((state: RootState) => 
    Object.values(state.global.loading).some(Boolean)
  );

  if (!hasAnyLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-40 bg-white rounded-full shadow-lg border p-3">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
    </div>
  );
};