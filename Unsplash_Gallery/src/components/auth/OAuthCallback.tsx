import React, { useEffect, useState } from 'react';
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
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent multiple processing attempts
    if (hasProcessed) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    console.log('OAuth Callback - Code:', code, 'Error:', errorParam);

    if (errorParam) {
      const errorMessage = errorDescription || `Authentication failed: ${errorParam}`;
      console.error('OAuth Error:', errorMessage);
      setHasProcessed(true);
      onError?.(errorMessage);
      return;
    }

    if (!code) {
      console.error('No authorization code received');
      setHasProcessed(true);
      onError?.('No authorization code received');
      return;
    }

    // Mark as processed to prevent multiple attempts
    setHasProcessed(true);

    // Dispatch the OAuth callback handler
    dispatch(handleOAuthCallback(code))
      .unwrap()
      .then(() => {
        console.log('OAuth callback successful');
        setTimeout(() => {
          onSuccess?.();
        }, 1000); // Small delay to show success message
      })
      .catch((error) => {
        console.error('OAuth callback failed:', error);
        onError?.(error.message || 'Authentication failed');
      });
  }, [dispatch, onSuccess, onError, hasProcessed]);

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="max-w-md w-full">
          <Alert 
            message={error} 
            type="error" 
            className="mb-4"
          />
          <div className="text-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (isAuthenticated && hasProcessed) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="max-w-md w-full text-center">
          <Alert 
            message="Authentication successful! Redirecting..." 
            type="success" 
            className="mb-4"
          />
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <LoadingSpinner />
      <p className="text-gray-600">Completing authentication...</p>
      <p className="text-sm text-gray-500">Please wait while we process your login</p>
    </div>
  );
};