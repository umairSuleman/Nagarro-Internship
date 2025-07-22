import React from 'react';

interface ListTitleProps {
  title: string;
  selectedCount: number;
  totalCount: number;
}

export const ListTitle: React.FC<ListTitleProps> = ({ 
  title, 
  selectedCount, 
  totalCount 
}) => (
  <div className="flex items-center justify-between p-3">
    <span className="font-medium text-gray-700">{title}</span>
    <span className="text-sm text-gray-500">
      {selectedCount}/{totalCount}
    </span>
  </div>
);