import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MoveRightButtonProps {
  onClick: () => void;
  disabled: boolean;
  className: string;
}

export const MoveRightButton: React.FC<MoveRightButtonProps> = ({ 
  onClick, 
  disabled, 
  className 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    title="Move selected to right"
  >
    <ChevronRight size={20} />
  </button>
);