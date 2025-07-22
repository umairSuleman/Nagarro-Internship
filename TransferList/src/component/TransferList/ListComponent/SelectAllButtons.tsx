import React from 'react';

interface SelectAllButtonProps {
  onClick: () => void;
}

export const SelectAllButton: React.FC<SelectAllButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-xs text-blue-500 hover:text-blue-600 underline"
  >
    Select All
  </button>
);