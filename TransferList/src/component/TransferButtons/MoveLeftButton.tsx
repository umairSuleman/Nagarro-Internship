import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface MoveLeftButtonProps {
  onClick: () => void;
  disabled: boolean;
  className: string;
}

export const MoveLeftButton: React.FC<MoveLeftButtonProps> = ({ 
  onClick, 
  disabled, 
  className 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    title="Move selected to left"
  >
    <ChevronLeft size={20} />
  </button>
);