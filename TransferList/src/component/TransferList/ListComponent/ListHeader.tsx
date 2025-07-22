import React from 'react';
import { ListTitle } from '../ListComponent/ListTitle';
import { SelectionButtons } from '../ListComponent/SelectionButtons';

interface ListHeaderProps {
  title: string;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showSelectAll: boolean;
}

export const ListHeader: React.FC<ListHeaderProps> = ({ 
  title, 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onDeselectAll, 
  showSelectAll 
}) => (
  <div className="flex flex-col bg-gray-50 border-b border-gray-300 rounded-t-lg">
    <ListTitle
      title={title}
      selectedCount={selectedCount}
      totalCount={totalCount}
    />
    <SelectionButtons
      onSelectAll={onSelectAll}
      onDeselectAll={onDeselectAll}
      showSelectAll={showSelectAll}
    />
  </div>
);