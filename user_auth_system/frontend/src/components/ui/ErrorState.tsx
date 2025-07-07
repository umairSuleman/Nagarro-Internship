import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryText?: string;
    showRetry?: boolean;
    fullScreen?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Something went wrong',
    message = 'An error occurred while processing your request.',
    onRetry,
    retryText = 'Try again',
    showRetry = true,
    fullScreen = false,
}) => {
    const containerClasses = fullScreen 
        ? 'min-h-screen flex items-center justify-center bg-gray-50' 
        : 'flex items-center justify-center p-8';

    return (
        <div className={containerClasses}>
        <div className="text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            {showRetry && onRetry && (
            <Button
                onClick={onRetry}
                variant="primary"
                icon={RefreshCw}
                iconPosition="left"
            >
                {retryText}
            </Button>
            )}
        </div>
        </div>
    );
};

export default ErrorState;