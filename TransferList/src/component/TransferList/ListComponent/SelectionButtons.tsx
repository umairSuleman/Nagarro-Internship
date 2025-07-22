import React from 'react';
import { SelectAllButton } from '../ListComponent/SelectAllButtons';
import { DeselectAllButton } from '../ListComponent/DeselectAllButton';

interface SelectionButtonsProps {
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showSelectAll: boolean;
}

export const SelectionButtons: React.FC<SelectionButtonsProps> = ({ 
  onSelectAll, 
  onDeselectAll, 
  showSelectAll 
}) => {
  if (!showSelectAll) return null;

  return (
    <div className="flex gap-2 p-2 border-t border-gray-200">
      <SelectAllButton onClick={onSelectAll} />
      <DeselectAllButton onClick={onDeselectAll} />
    </div>
  );
};