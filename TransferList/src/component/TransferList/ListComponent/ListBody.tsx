import React from 'react';
import type { TransferListItem } from '../../../types/listTypes';
import { ListItem } from '../ListComponent/ListItem';

interface ListBodyProps {
  items: TransferListItem[];
  selected: Set<string | number>;
  onToggle: (id: string | number) => void;
  getItemClasses: (item: TransferListItem, isSelected: boolean) => string;
  dense: boolean;
  height: string;
  width: string;
}

export const ListBody: React.FC<ListBodyProps> = ({ 
  items, 
  selected, 
  onToggle, 
  getItemClasses, 
  dense, 
  height, 
  width 
}) => (
  <div 
    className="flex-1 overflow-y-auto"
    style={{ height, width }}
  >
    {items.map((item) => (
      <ListItem
        key={item.id}
        item={item}
        isSelected={selected.has(item.id)}
        onToggle={onToggle}
        itemClasses={getItemClasses(item, selected.has(item.id))}
        dense={dense}
      />
    ))}
  </div>
);