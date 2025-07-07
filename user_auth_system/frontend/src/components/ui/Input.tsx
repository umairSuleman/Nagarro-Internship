import React from "react";
import { LucideIcon } from 'lucide-react'

interface InputProps {
    id: string;
    type: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    icon?: LucideIcon;
    required?: boolean;
    autoComplete?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    id,
    type,
    label,
    placeholder,
    value,
    onChange,
    icon: Icon,
    required = false,
    autoComplete,
    error,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`space-y-1 ${className}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            )}
            <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`
                w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 
                border ${error ? 'border-red-300' : 'border-gray-300'} 
                rounded-lg focus:outline-none focus:ring-2 
                ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
                focus:border-transparent
                disabled:bg-gray-50 disabled:text-gray-500
                ${disabled ? 'cursor-not-allowed' : ''}
            `}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            disabled={disabled}
            />
        </div>
        {error && (
            <p className="text-sm text-red-600">{error}</p>
        )}
        </div>
    );
};

export default Input;