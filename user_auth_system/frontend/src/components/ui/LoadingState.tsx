import React from 'react';

interface LoadingStateProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    message?: string;
    overlay?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
    size = 'md',
    fullScreen = false,
    message = 'Loading...',
    overlay = false,
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    const containerClasses = fullScreen 
        ? 'min-h-screen flex items-center justify-center bg-gray-50' 
        : 'flex items-center justify-center p-8';

    const overlayClasses = overlay 
        ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' 
        : '';

    const spinnerClasses = `animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`;

    const content = (
        <div className={overlay ? 'bg-white rounded-lg p-8' : ''}>
        <div className="text-center">
            <div className={spinnerClasses}>
            <span className="sr-only">{message}</span>
            </div>
            {message && (
            <p className="mt-4 text-gray-600 text-sm">{message}</p>
            )}
        </div>
        </div>
    );

    if (overlay) {
        return (
        <div className={overlayClasses}>
            {content}
        </div>
        );
    }

    return (
        <div className={containerClasses}>
        {content}
        </div>
    );
};

export default LoadingState;