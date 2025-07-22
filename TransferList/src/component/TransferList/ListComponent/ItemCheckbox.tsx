import React from 'react';

interface ItemCheckboxProps {
  checked: boolean;
  disabled: boolean | undefined;
  onChange: () => void;
}

export const ItemCheckbox: React.FC<ItemCheckboxProps> = ({ 
  checked, 
  disabled, 
  onChange 
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    className="mr-2"
  />
);