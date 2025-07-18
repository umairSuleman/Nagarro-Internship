import React from 'react';
import type { CheckboxConfig, CheckboxThemes } from '../types/checkboxTypes';
import { useNestedCheckbox } from '../hooks/useNestedCheckbox';
import CheckboxItemComponent from './CheckboxItem';

const themes: CheckboxThemes = {
    default: {
        container: 'bg-white border border-gray-200 rounded-lg p-4',
        item: 'hover:bg-gray-50 rounded-md transition-colors duration-150',
        checkbox: 'border-gray-300 text-blue-600 focus:ring-blue-500',
        label: 'text-gray-900',
        description: 'text-gray-500',
        icon: 'text-gray-400',
        expandButton: 'text-gray-400 hover:text-gray-600',
    },
    dark: {
        container: 'bg-gray-800 border border-gray-700 rounded-lg p-4',
        item: 'hover:bg-gray-700 rounded-md transition-colors duration-150',
        checkbox: 'border-gray-600 text-blue-500 focus:ring-blue-400 bg-gray-700',
        label: 'text-gray-100',
        description: 'text-gray-400',
        icon: 'text-gray-500',
        expandButton: 'text-gray-500 hover:text-gray-300',
    },
    minimal: {
        container: 'bg-transparent border-0 p-2',
        item: 'hover:bg-gray-100 rounded transition-colors duration-150',
        checkbox: 'border-gray-400 text-gray-600 focus:ring-gray-400',
        label: 'text-gray-800',
        description: 'text-gray-600',
        icon: 'text-gray-500',
        expandButton: 'text-gray-500 hover:text-gray-700',
    },
};

const NestedCheckbox: React.FC<{ config: CheckboxConfig }> = ({ config }) => {
    const {
        itemStates,
        selectedItems,
        handleCheckboxChange,
        toggleExpansion,
        clearAll
    } = useNestedCheckbox(config);

    const theme = themes[config.theme || 'default'];

    return (
        <div data-testid="checkbox-container" className={theme.container}>
            <div className="space-y-1">
                {config.items.map(item => (
                    <CheckboxItemComponent
                        key={item.id}
                        item={item}
                        state={itemStates[item.id] || { checked: false, indeterminate: false, expanded: false }}
                        theme={theme}
                        level={0}
                        expandable={config.expandable}
                        showIcons={config.showIcons}
                        showDescriptions={config.showDescriptions}
                        onCheckboxChange={handleCheckboxChange}
                        onToggleExpansion={toggleExpansion}
                    />
                ))}
            </div>
            
            {/* Selection summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Selected items: {selectedItems.size}</span>
                    <button
                        onClick={clearAll}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NestedCheckbox;