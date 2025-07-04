import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

// Configuration map for loading component sizes
const LOADING_CONFIG = {
  sizes: {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  },
  containers: {
    fullScreen: 'min-h-screen flex items-center justify-center',
    default: 'flex items-center justify-center p-4'
  },
  spinner: {
    baseClasses: 'animate-spin rounded-full border-b-2 border-blue-600',
    srText: 'Loading...'
  }
} as const;

const Loading: React.FC<LoadingProps> = ({ size = 'md', fullScreen = false }) => {
  const sizeClass = LOADING_CONFIG.sizes[size];
  const containerClass = fullScreen 
    ? LOADING_CONFIG.containers.fullScreen 
    : LOADING_CONFIG.containers.default;

  return (
    <div className={containerClass}>
      <div className={`${LOADING_CONFIG.spinner.baseClasses} ${sizeClass}`}>
        <span className="sr-only">{LOADING_CONFIG.spinner.srText}</span>
      </div>
    </div>
  );
};

export default Loading;