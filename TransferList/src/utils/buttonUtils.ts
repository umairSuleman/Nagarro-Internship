import type { ButtonVariant } from "../types/listTypes";

export const getButtonClasses = (variant: ButtonVariant): string => {
    const baseClasses = "px-3 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
        case 'contained':
        return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300`;
        case 'outlined':
        return `${baseClasses} border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300`;
        case 'text':
        return `${baseClasses} text-blue-500 hover:bg-blue-50 disabled:text-gray-300`;
        default:
        return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300`;
    }
};

