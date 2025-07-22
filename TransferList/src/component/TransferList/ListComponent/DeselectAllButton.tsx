import React from 'react';

interface DeselectAllButtonProps {
  onClick: () => void;
}

export const DeselectAllButton: React.FC<DeselectAllButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-xs text-blue-500 hover:text-blue-600 underline"
  >
    Deselect All
  </button>
);