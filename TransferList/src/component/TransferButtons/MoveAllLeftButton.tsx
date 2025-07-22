import React from 'react';
import { ChevronsLeft } from 'lucide-react';

interface MoveAllLeftButtonProps {
  onClick: () => void;
  disabled: boolean;
  className: string;
}

export const MoveAllLeftButton: React.FC<MoveAllLeftButtonProps> = ({ 
  onClick, 
  disabled, 
  className 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    title="Move all to left"
  >
    <ChevronsLeft size={20} />
  </button>
);