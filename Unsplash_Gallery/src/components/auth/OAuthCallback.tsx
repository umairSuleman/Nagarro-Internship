
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleOAuthCallback } from '@/store/slices/authSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert } from '@/components/feedback/Alert';
import type { RootState, AppDispatch } from '@/store';

interface OAuthCallbackProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const OAuthCallback: React.FC<OAuthCallbackProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      const errorMessage = `Authentication failed: ${errorParam}`;
      onError?.(errorMessage);
      return;
    }

    if (code) {
      dispatch(handleOAuthCallback(code))
        .unwrap() // Add this to properly handle the promise
        .then(() => {
          onSuccess?.();
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((error) => {
          onError?.(error.message || 'Authentication failed');
        });
    } else {
      onError?.('No authorization code received');
    }
  }, [dispatch, onSuccess, onError]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Alert 
          message={error} 
          type="error" 
          className="max-w-md"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Alert 
          message="Authentication successful! Redirecting..." 
          type="success" 
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <LoadingSpinner />
      <p className="text-gray-600">Completing authentication...</p>
    </div>
  );
};