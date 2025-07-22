import React from 'react';
import type { ButtonVariant } from '../../types/listTypes';
import { MoveRightButton } from '../TransferButtons/MoveRightButton';
import { MoveLeftButton } from '../TransferButtons/MoveLeftButton';
import { MoveAllRightButton } from '../TransferButtons/MoveAllRightButton';
import { MoveAllLeftButton } from '../TransferButtons/MoveAllLeftButton';
import { getButtonClasses } from '../../utils/buttonUtils'

interface TransferButtonsProps {
    moveToRight: () => void;
    moveToLeft: () => void;
    moveAllToRight: () => void;
    moveAllToLeft: () => void;
    leftSelectedCount: number;
    rightSelectedCount: number;
    leftEnabledCount: number;
    rightEnabledCount: number;
    buttonVariant: ButtonVariant;
}

const TransferButtons: React.FC<TransferButtonsProps> = ({
    moveToRight,
    moveToLeft,
    moveAllToRight,
    moveAllToLeft,
    leftSelectedCount,
    rightSelectedCount,
    leftEnabledCount,
    rightEnabledCount,
    buttonVariant,
}) => {
  const buttonClasses = getButtonClasses(buttonVariant);

  return (
    <div className="flex flex-col gap-2">
      <MoveRightButton
        onClick={moveToRight}
        disabled={leftSelectedCount === 0}
        className={buttonClasses}
      />
      <MoveLeftButton
        onClick={moveToLeft}
        disabled={rightSelectedCount === 0}
        className={buttonClasses}
      />
      <MoveAllRightButton
        onClick={moveAllToRight}
        disabled={leftEnabledCount === 0}
        className={buttonClasses}
      />
      <MoveAllLeftButton
        onClick={moveAllToLeft}
        disabled={rightEnabledCount === 0}
        className={buttonClasses}
      />
    </div>
  );
};

export default TransferButtons;