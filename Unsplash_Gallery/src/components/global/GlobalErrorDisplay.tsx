import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from '../feedback/Alert';
import { clearAllErrors } from '@/store/slices/globalSlice';
import type { RootState, AppDispatch } from '@/store';

export const GlobalError: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const errors = useSelector((state: RootState) => state.global.errors);
  
  // Get the first error (you could also show all errors)
  const firstError = Object.values(errors).find(Boolean);
  
  if (!firstError) return null;

  const handleDismiss = () => {
    dispatch(clearAllErrors());
  };

  return (
    <div className="fixed top-4 right-4 z-40 max-w-md">
      <Alert
        message={firstError}
        type="error"
        dismissible
        onDismiss={handleDismiss}
        className="shadow-lg"
      />
    </div>
  );
};