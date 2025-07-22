import React from 'react';
import type { ListComponentProps } from '../../../types/listTypes';
import { ListHeader } from '../ListComponent/ListHeader';
import { ListBody } from '../ListComponent/ListBody';

const ListComponent: React.FC<ListComponentProps> = ({
  items,
  selected,
  onToggle,
  onSelectAll,
  onDeselectAll,
  title,
  height,
  width,
  showSelectAll,
  dense,
  getItemClasses,
}) => {
  const enabledItems = items.filter(item => !item.disabled);
  
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg bg-white">
      <ListHeader
        title={title}
        selectedCount={selected.size}
        totalCount={enabledItems.length}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        showSelectAll={showSelectAll}
      />
      <ListBody
        items={items}
        selected={selected}
        onToggle={onToggle}
        getItemClasses={getItemClasses}
        dense={dense}
        height={height}
        width={width}
      />
    </div>
  );
};

export default ListComponent;