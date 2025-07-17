import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

//Types for the config
interface CheckboxItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: CheckboxItem[];
  disabled?: boolean;
  description?: string;
}

interface CheckboxConfig {
  items: CheckboxItem[];
  allowPartialSelection?: boolean;
  expandable?: boolean;
  showIcons?: boolean;
  showDescriptions?: boolean;
  multiSelect?: boolean;
  onSelectionChange?: (selectedItems: string[]) => void;
  theme?: 'default' | 'dark' | 'minimal';
}

interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
  expanded?: boolean;
}

//Theme config
const themes = {
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
    const [itemStates, setItemStates] = useState<Record<string, CheckboxState>>({});
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const theme = themes[config.theme || 'default'];

    //Initialize item states
    useEffect(() => {
        const initializeStates = (items: CheckboxItem[]): Record<string, CheckboxState> => {
        const states: Record<string, CheckboxState> = {};
        
        const processItem = (item: CheckboxItem) => {
            states[item.id] = {
            checked: false,
            indeterminate: false,
            expanded: false,
            };
            
            if (item.children) {
            item.children.forEach(processItem);
            }
        };
        
        items.forEach(processItem);
        return states;
        };

        setItemStates(initializeStates(config.items));
    }, [config.items]);

    //Get all child IDs recursively
    const getAllChildIds = useCallback((item: CheckboxItem): string[] => {
        if (!item.children) return [];
        
        const childIds: string[] = [];
        item.children.forEach(child => {
            childIds.push(child.id);
            childIds.push(...getAllChildIds(child));
        });
        
        return childIds;
    }, []);

    //Get parent ID for a given item
    const getParentId = useCallback((targetId: string, items: CheckboxItem[], parentId?: string): string | null => {
        for (const item of items) {
            if (item.id === targetId) {
                return parentId || null;
            }
            if (item.children) {
                const found = getParentId(targetId, item.children, item.id);
                if (found !== null) return found;
            }
        }
        return null;
    }, []);

    // Update parent states based on children
    const updateParentStates = useCallback((parentId: string, items: CheckboxItem[]) => {
        const findItem = (id: string, itemList: CheckboxItem[]): CheckboxItem | null => {
            for (const item of itemList) {
                if (item.id === id) return item;
                if (item.children) {
                    const found = findItem(id, item.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const parentItem = findItem(parentId, items);
        if (!parentItem || !parentItem.children) return;

        const childStates = parentItem.children.map(child => itemStates[child.id]);
        const checkedChildren = childStates.filter(state => state?.checked).length;
        const totalChildren = childStates.length;

        setItemStates(prev => ({
            ...prev,
            [parentId]: {
                ...prev[parentId],
                checked: checkedChildren === totalChildren,
                indeterminate: checkedChildren > 0 && checkedChildren < totalChildren,
            }
        }));

        //Recursively update grandparent
        const grandParentId = getParentId(parentId, items);
        if (grandParentId) {
            updateParentStates(grandParentId, items);
        }
    }, [itemStates, getParentId]);

    //Handle checkbox change
    const handleCheckboxChange = useCallback((itemId: string, checked: boolean) => {
        const findItem = (id: string, items: CheckboxItem[]): CheckboxItem | null => {
            for (const item of items) {
                if (item.id === id) return item;
                if (item.children) {
                    const found = findItem(id, item.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const item = findItem(itemId, config.items);
        if (!item || item.disabled) return;

        //Update current item
        setItemStates(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                checked,
                indeterminate: false,
            }
        }));

        //Update selected items
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (checked) {
                newSelected.add(itemId);
            } 
            else {
                newSelected.delete(itemId);
            }
            return newSelected;
        });

        //Update all children
        const childIds = getAllChildIds(item);
        childIds.forEach(childId => {
            setItemStates(prev => ({
                ...prev,
                [childId]: {
                ...prev[childId],
                checked,
                indeterminate: false,
                }
            }));

            setSelectedItems(prev => {
                const newSelected = new Set(prev);
                if (checked) {
                    newSelected.add(childId);
                } 
                else {
                    newSelected.delete(childId);
                }
                return newSelected;
            });
        });

        //Update parent states
        const parentId = getParentId(itemId, config.items);
        if (parentId) {
            setTimeout(() => updateParentStates(parentId, config.items), 0);
        }
    }, [config.items, getAllChildIds, getParentId, updateParentStates]);

    //Toggle expansion
    const toggleExpansion = useCallback((itemId: string) => {
        if (!config.expandable) return;
        
        setItemStates(prev => {
            const prevItem = prev[itemId] ?? { 
            checked: false, 
            indeterminate: false, 
            expanded: false 
            };
            
            return {
            ...prev,
            [itemId]: {
                ...prevItem,
                expanded: !prevItem.expanded,
            }
            };
        });
        }, [config.expandable]);

    //Notify parent component of selection changes
    useEffect(() => {
        if (config.onSelectionChange) {
            config.onSelectionChange(Array.from(selectedItems));
        }
    }, [selectedItems, config.onSelectionChange]);

    //Render checkbox item
    const renderCheckboxItem = (item: CheckboxItem, level: number = 0) => {
        const state = itemStates[item.id] || { checked: false, indeterminate: false, expanded: false };
        const hasChildren = item.children && item.children.length > 0;
        const paddingLeft = level * 20;

        return (
        <div key={item.id} className="select-none">
            <div
            className={`flex items-center py-2 px-3 ${theme.item}`}
            style={{ paddingLeft: `${paddingLeft + 12}px` }}
            >
            {/* Expansion toggle */}
            {config.expandable && hasChildren && (
                <button
                onClick={() => toggleExpansion(item.id)}
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
                ref={(el) => {
                if (el) {
                    el.indeterminate = state.indeterminate;
                }
                }}
                onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                disabled={item.disabled}
                className={`mr-3 h-4 w-4 rounded focus:ring-2 focus:ring-offset-2 ${theme.checkbox} ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
            />

            {/* Icon */}
            {config.showIcons && item.icon && (
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
                {config.showDescriptions && item.description && (
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
            {hasChildren && (!config.expandable || state.expanded) && (
            <div className="ml-4 border-l-2 border-gray-200">
                {item.children!.map(child => renderCheckboxItem(child, level + 1))}
            </div>
            )}
        </div>
        );
    };

    return (
        <div data-testid="checkbox-container" className={theme.container}>
        <div className="space-y-1">
            {config.items.map(item => renderCheckboxItem(item))}
        </div>
        
        {/* Selection summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Selected items: {selectedItems.size}</span>
            <button
                onClick={() => {
                setSelectedItems(new Set());
                setItemStates(prev => {
                    const newStates = { ...prev };
                    Object.keys(newStates).forEach(key => {
                    newStates[key] = {
                        ...newStates[key],
                        checked: false,
                        indeterminate: false,
                    };
                    });
                    return newStates;
                });
                }}
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