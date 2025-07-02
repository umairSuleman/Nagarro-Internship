
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
    children : React.ReactNode;
    onClick ?: () => void;
    disabled ?: boolean;
    variant ?: 'primary' | 'secondary' | 'success' | 'danger';
    size ?: 'sm' | 'md' | 'lg';
    icon ?: LucideIcon;
    iconSize ?: number;
    loading ?: boolean;
    type ?: 'button' | 'submit' | 'reset';
    className ?: string;
}

export const Button: React.FC<ButtonProps> =({
    children,
    onClick,
    disabled=false,
    variant='primary',
    size='md',
    icon: Icon,
    iconSize =20,
    loading = false,
    type = 'button',
    className= ''
}) => {
    const baseClasses = 'flex items-center space-x-2 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses ={
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };

    const sizeClasses = {
        sm:'px-3 py-1.5 text-sm',
        md:'px-4 py-2',
        lg:'px-6 py-3 text-lg'
    };

    const classes =`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
        >
            {Icon && (
                <Icon
                    size={iconSize}
                    className={loading ? 'animate-spin' : ''}
                />
            )}
            <span>{children}</span>
        </button>
    );
};