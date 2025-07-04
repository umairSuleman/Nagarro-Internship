import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import type { AlertProps } from '../../types/auth';

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getAlertStyles = (type: AlertProps['type']) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: AlertCircle,
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: CheckCircle,
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: AlertTriangle,
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: Info,
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: Info,
        };
    }
  };

  const { container, text, icon: Icon } = getAlertStyles(type);

  return (
    <div className={`border rounded-lg p-4 mb-4 ${container}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 mr-2 ${text}`} />
          <span className={text}>{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-2 ${text} hover:opacity-70`}
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;