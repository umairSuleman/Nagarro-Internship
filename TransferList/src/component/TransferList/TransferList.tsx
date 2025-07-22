import React from 'react';
import type { TransferListProps } from '../../types/listTypes';
import  ListComponent  from '../TransferList/ListComponent/ListComponent';
import  TransferButtons  from '../TransferButtons/TransferButtons';
import { useNewItemTracking } from '../../hooks/useNewItemTracking';
import { useTransferListSelection } from '../../hooks/useTransferList';
import { createItemClassesGetter } from '../../utils/itemClassGetter';

const TransferList: React.FC<TransferListProps> = ({
  leftItems,
  rightItems,
  onItemsChange,
  leftTitle = "Choices",
  rightTitle = "Chosen",
  height = "400px",
  width = "200px",
  showSelectAll = true,
  newItemColor = "bg-blue-100 border-blue-300",
  normalItemColor = "bg-white border-gray-300",
  selectedItemColor = "bg-blue-50 border-blue-500",
  disabledItemColor = "bg-gray-100 border-gray-200 text-gray-400",
  buttonVariant = "contained",
  dense = false,
}) => {
  const { newItems } = useNewItemTracking({ leftItems, rightItems });
  
  const {
    leftSelected,
    rightSelected,
    handleToggle,
    handleSelectAll,
    handleDeselectAll,
    moveToRight,
    moveToLeft,
    moveAllToRight,
    moveAllToLeft,
  } = useTransferListSelection({ leftItems, rightItems, onItemsChange });

  const getItemClasses = createItemClassesGetter(
    newItemColor,
    normalItemColor,
    selectedItemColor,
    disabledItemColor,
    newItems
  );

  const leftEnabledCount = leftItems.filter(item => !item.disabled).length;
  const rightEnabledCount = rightItems.filter(item => !item.disabled).length;

  return (
    <div className="flex items-center gap-4 p-4">
      <ListComponent
        items={leftItems}
        selected={leftSelected}
        onToggle={(id) => handleToggle(id, true)}
        onSelectAll={() => handleSelectAll(true)}
        onDeselectAll={() => handleDeselectAll(true)}
        title={leftTitle}
        height={height}
        width={width}
        showSelectAll={showSelectAll}
        dense={dense}
        getItemClasses={getItemClasses}
      />
      
      <TransferButtons
        moveToRight={moveToRight}
        moveToLeft={moveToLeft}
        moveAllToRight={moveAllToRight}
        moveAllToLeft={moveAllToLeft}
        leftSelectedCount={leftSelected.size}
        rightSelectedCount={rightSelected.size}
        leftEnabledCount={leftEnabledCount}
        rightEnabledCount={rightEnabledCount}
        buttonVariant={buttonVariant}
      />
      
      <ListComponent
        items={rightItems}
        selected={rightSelected}
        onToggle={(id) => handleToggle(id, false)}
        onSelectAll={() => handleSelectAll(false)}
        onDeselectAll={() => handleDeselectAll(false)}
        title={rightTitle}
        height={height}
        width={width}
        showSelectAll={showSelectAll}
        dense={dense}
        getItemClasses={getItemClasses}
      />
    </div>
  );
};

export default TransferList;