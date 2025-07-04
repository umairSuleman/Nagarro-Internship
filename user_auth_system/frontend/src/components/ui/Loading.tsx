import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const container = fullScreen 
    ? 'min-h-screen flex items-center justify-center' 
    : 'flex items-center justify-center p-4';

  return (
    <div className={container}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;