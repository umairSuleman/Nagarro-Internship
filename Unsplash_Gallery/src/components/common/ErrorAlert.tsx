
import React from 'react';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    <strong>Error:</strong> {message}
    {message.includes('API Error') && (
      <p className="mt-2 text-sm">
        Make sure to replace 'YOUR_ACCESS_KEY' with your actual Unsplash access key.
      </p>
    )}
  </div>
);