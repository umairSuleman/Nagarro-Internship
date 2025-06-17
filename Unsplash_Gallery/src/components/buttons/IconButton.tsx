import type { LucideIcon } from "lucide-react";

interface IconButtonnProps {
    icon: LucideIcon;
    onClick ?: () => void;
    disabled ?: boolean;
    variant ?: 'primary' | 'secondary' | 'success' | 'danger';
    size ?: 'sm' | 'md' | 'lg';
    loading ?: boolean;
    className ?: string;
    'aria-label' : string;
}


export const IconButton: React.FC<IconButtonnProps> = ({
    icon: Icon,
    onClick,
    disabled = false,
    variant= 'primary',
    size='md',
    loading=false,
    className='',
    'aria-label': ariaLabel
}) => {
    const baseClasses ='flex items-center justify-center rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };

    const sizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3'
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24
    };

    const classes =`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return ( 
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
            aria-label={ariaLabel}
        >
            <Icon
                size={iconSizes[size]}
                className={loading ? 'animate-spin': ''}
            />
        </button>
    );
};