import React from 'react';
import { ChevronsRight } from 'lucide-react';

interface MoveAllRightButtonProps {
  onClick: () => void;
  disabled: boolean;
  className: string;
}

export const MoveAllRightButton: React.FC<MoveAllRightButtonProps> = ({ 
  onClick, 
  disabled, 
  className 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    title="Move all to right"
  >
    <ChevronsRight size={20} />
  </button>
);
