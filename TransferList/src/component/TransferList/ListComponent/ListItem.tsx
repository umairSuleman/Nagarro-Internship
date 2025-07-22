import React from 'react';
import type { TransferListItem } from '../../../types/listTypes';
import { ItemCheckbox } from '../ListComponent/ItemCheckbox';
import { ItemLabel } from '../ListComponent/ItemLabel';

interface ListItemProps {
  item: TransferListItem;
  isSelected: boolean;
  onToggle: (id: string | number) => void;
  itemClasses: string;
  dense: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({ 
  item, 
  isSelected, 
  onToggle, 
  itemClasses, 
  dense 
}) => (
  <div
    className={`p-2 m-1 border rounded ${dense ? 'py-1' : 'py-2'} ${itemClasses}`}
    onClick={() => !item.disabled && onToggle(item.id)}
  >
    <div className="flex items-center">
      <ItemCheckbox
        checked={isSelected}
        disabled={item.disabled}
        onChange={() => !item.disabled && onToggle(item.id)}
      />
      <ItemLabel
        label={item.label}
        disabled={item.disabled}
      />
    </div>
  </div>
);