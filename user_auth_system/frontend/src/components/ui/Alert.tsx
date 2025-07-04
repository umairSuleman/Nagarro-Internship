import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import type { AlertProps } from '../../types/auth';

// Configuration map for alert types
const ALERT_CONFIG = {
  error: {
    container: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: AlertCircle,
  },
  success: {
    container: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    icon: CheckCircle,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertTriangle,
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: Info,
  }
} as const;

// Default alert configuration
const DEFAULT_ALERT_CONFIG = {
  container: 'bg-gray-50 border-gray-200',
  text: 'text-gray-800',
  icon: Info,
};

// Base classes for alert components
const BASE_CLASSES = {
  container: 'border rounded-lg p-4 mb-4',
  content: 'flex items-center justify-between',
  iconContainer: 'flex items-center',
  icon: 'h-5 w-5 mr-2',
  closeButton: 'ml-2 hover:opacity-70',
  closeButtonText: '×'
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getAlertConfig = (alertType: AlertProps['type']) => {
    return ALERT_CONFIG[alertType] || DEFAULT_ALERT_CONFIG;
  };

  const { container, text, icon: Icon } = getAlertConfig(type);

  return (
    <div className={`${BASE_CLASSES.container} ${container}`}>
      <div className={BASE_CLASSES.content}>
        <div className={BASE_CLASSES.iconContainer}>
          <Icon className={`${BASE_CLASSES.icon} ${text}`} />
          <span className={text}>{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${BASE_CLASSES.closeButton} ${text}`}
            aria-label="Close alert"
          >
            {BASE_CLASSES.closeButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;