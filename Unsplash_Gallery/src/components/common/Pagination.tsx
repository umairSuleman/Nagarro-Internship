import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
  loading: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  onPageChange, 
  hasMore, 
  loading 
}) => (
  <div className="flex justify-center items-center space-x-4 mt-6">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || loading}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <ChevronLeft size={20} />
      <span>Previous</span>
    </button>
    
    <span className="text-gray-600">Page {currentPage}</span>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={!hasMore || loading}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <span>Next</span>
      <ChevronRight size={20} />
    </button>
  </div>
);