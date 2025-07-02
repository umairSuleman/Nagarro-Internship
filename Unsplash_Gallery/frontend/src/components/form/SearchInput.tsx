
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
    value:string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder ?: string;
    disabled ?: boolean;
    loading?: boolean;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onSubmit,
    placeholder = "Search...",
    disabled = false,
    loading = false,
    className = ''
}) => {

    const handleSubmit =(e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className={`flex space-x-3 ${className}`}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
                type="submit"
                disabled={disabled || loading || !value.trim()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                <Search size={20} />
                <span>Search</span>
            </button> 
        </form>
    );
};
