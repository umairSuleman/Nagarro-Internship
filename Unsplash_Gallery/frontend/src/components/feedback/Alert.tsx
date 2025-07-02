import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  type = 'info',
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const configs = {
    info: {
      icon: Info,
      classes: 'bg-blue-100 border-blue-400 text-blue-700'
    },
    success: {
      icon: CheckCircle,
      classes: 'bg-green-100 border-green-400 text-green-700'
    },
    warning: {
      icon: AlertCircle,
      classes: 'bg-yellow-100 border-yellow-400 text-yellow-700'
    },
    error: {
      icon: XCircle,
      classes: 'bg-red-100 border-red-400 text-red-700'
    }
  };
  
  const config = configs[type];
  const Icon = config.icon;
  
  return (
    <div className={`border px-4 py-3 rounded flex items-center justify-between ${config.classes} ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon size={18} />
        <span>{message}</span>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 hover:opacity-70 transition-opacity"
          aria-label="Dismiss alert"
        >
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};