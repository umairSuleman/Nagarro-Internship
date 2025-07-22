import React from 'react';

interface ItemLabelProps {
  label: string;
  disabled: boolean | undefined;
}

export const ItemLabel: React.FC<ItemLabelProps> = ({ label, disabled }) => (
  <span className={disabled ? 'text-gray-400' : ''}>
    {label}
  </span>
);