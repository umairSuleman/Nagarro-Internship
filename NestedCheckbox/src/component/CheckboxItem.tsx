import React, { memo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CheckboxItem as CheckboxItemType, CheckboxState, CheckboxTheme } from '../types/checkboxTypes';

interface CheckboxItemProps {
    item: CheckboxItemType;
    state: CheckboxState;
    theme: CheckboxTheme;
    level: number;
    expandable?: boolean;
    showIcons?: boolean;
    showDescriptions?: boolean;
    onCheckboxChange: (itemId: string, checked: boolean) => void;
    onToggleExpansion: (itemId: string) => void;
}

const CheckboxItemComponent: React.FC<CheckboxItemProps> = memo(({
    item,
    state,
    theme,
    level,
    expandable,
    showIcons,
    showDescriptions,
    onCheckboxChange,
    onToggleExpansion
}) => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = level * 20;

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(item.id, e.target.checked);
    };

    const handleToggleExpansion = () => {
        onToggleExpansion(item.id);
    };

    const setIndeterminate = (el: HTMLInputElement | null) => {
        if (el) {
            el.indeterminate = state.indeterminate;
        }
    };

    return (
        <div className="select-none">
            <div
                className={`flex items-center py-2 px-3 ${theme.item}`}
                style={{ paddingLeft: `${paddingLeft + 12}px` }}
            >
                {/* Expansion toggle */}
                {expandable && hasChildren && (
                    <button
                        onClick={handleToggleExpansion}
                        className={`mr-2 p-1 rounded hover:bg-gray-200 ${theme.expandButton}`}
                        aria-label={state.expanded ? 'Collapse' : 'Expand'}
                    >
                        {state.expanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                )}

                {/* Checkbox */}
                <input
                    type="checkbox"
                    id={item.id}
                    checked={state.checked}
                    ref={setIndeterminate}
                    onChange={handleCheckboxChange}
                    disabled={item.disabled}
                    className={`mr-3 h-4 w-4 rounded focus:ring-2 focus:ring-offset-2 ${theme.checkbox} ${
                        item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                />

                {/* Icon */}
                {showIcons && item.icon && (
                    <item.icon className={`h-4 w-4 mr-2 ${theme.icon}`} />
                )}

                {/* Label and description */}
                <div className="flex-1 min-w-0">
                    <label
                        htmlFor={item.id}
                        className={`block text-sm font-medium ${theme.label} ${
                            item.disabled ? 'opacity-50' : 'cursor-pointer'
                        }`}
                    >
                        {item.label}
                    </label>
                    {showDescriptions && item.description && (
                        <p className={`text-xs ${theme.description} mt-1`}>
                            {item.description}
                        </p>
                    )}
                </div>

                {/* Selection indicator */}
                {state.checked && (
                    <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        Selected
                    </span>
                )}
            </div>

            {/* Children */}
            {hasChildren && (!expandable || state.expanded) && (
                <div className="ml-4 border-l-2 border-gray-200">
                    {item.children!.map(child => (
                        <CheckboxItemComponent
                            key={child.id}
                            item={child}
                            state={state}
                            theme={theme}
                            level={level + 1}
                            expandable={expandable}
                            showIcons={showIcons}
                            showDescriptions={showDescriptions}
                            onCheckboxChange={onCheckboxChange}
                            onToggleExpansion={onToggleExpansion}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

CheckboxItemComponent.displayName = 'CheckboxItemComponent';

export default CheckboxItemComponent;