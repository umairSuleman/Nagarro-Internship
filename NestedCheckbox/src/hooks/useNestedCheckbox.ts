import { useState, useEffect, useCallback } from 'react';
import type { CheckboxItem, CheckboxConfig, CheckboxState } from '../types/checkboxTypes';

export const useNestedCheckbox = (config: CheckboxConfig) => {
    const [itemStates, setItemStates] = useState<Record<string, CheckboxState>>({});
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

    //Update parent states based on children
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
            } else {
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
                } else {
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

    //Clear all selections
    const clearAll = useCallback(() => {
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
    }, []);

    //Notify parent component of selection changes
    useEffect(() => {
        if (config.onSelectionChange) {
            config.onSelectionChange(Array.from(selectedItems));
        }
    }, [selectedItems, config.onSelectionChange]);

    return { itemStates, selectedItems, handleCheckboxChange, toggleExpansion, clearAll };
};