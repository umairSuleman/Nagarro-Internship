import { useState, useCallback } from "react";
import type { UseTransferListSelectionProps } from "../types/listTypes";

export const useTransferListSelection = ({ leftItems, rightItems, onItemsChange }: UseTransferListSelectionProps) => {
    const [leftSelected, setLeftSelected] = useState<Set<string | number>>(new Set());
    const [rightSelected, setRightSelected] = useState<Set<string | number>>(new Set());

    const handleToggle = useCallback((itemId: string | number, isLeft: boolean) => {
        if (isLeft) {
        setLeftSelected(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
            } else {
            newSelected.add(itemId);
            }
            return newSelected;
        });
        } else {
        setRightSelected(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
            } else {
            newSelected.add(itemId);
            }
            return newSelected;
        });
        }
    }, []);

    const handleSelectAll = useCallback((isLeft: boolean) => {
        if (isLeft) {
        const allIds = leftItems.filter(item => !item.disabled).map(item => item.id);
        setLeftSelected(new Set(allIds));
        } else {
        const allIds = rightItems.filter(item => !item.disabled).map(item => item.id);
        setRightSelected(new Set(allIds));
        }
    }, [leftItems, rightItems]);

    const handleDeselectAll = useCallback((isLeft: boolean) => {
        if (isLeft) {
        setLeftSelected(new Set());
        } else {
        setRightSelected(new Set());
        }
    }, []);

    const moveToRight = useCallback(() => {
        const itemsToMove = leftItems.filter(item => leftSelected.has(item.id));
        const newLeftItems = leftItems.filter(item => !leftSelected.has(item.id));
        const newRightItems = [...rightItems, ...itemsToMove];
        
        setLeftSelected(new Set());
        onItemsChange(newLeftItems, newRightItems);
    }, [leftItems, rightItems, leftSelected, onItemsChange]);

    const moveToLeft = useCallback(() => {
        const itemsToMove = rightItems.filter(item => rightSelected.has(item.id));
        const newRightItems = rightItems.filter(item => !rightSelected.has(item.id));
        const newLeftItems = [...leftItems, ...itemsToMove];
        
        setRightSelected(new Set());
        onItemsChange(newLeftItems, newRightItems);
    }, [leftItems, rightItems, rightSelected, onItemsChange]);

    const moveAllToRight = useCallback(() => {
        const enabledItems = leftItems.filter(item => !item.disabled);
        const newRightItems = [...rightItems, ...enabledItems];
        const newLeftItems = leftItems.filter(item => item.disabled);
        
        setLeftSelected(new Set());
        onItemsChange(newLeftItems, newRightItems);
    }, [leftItems, rightItems, onItemsChange]);

    const moveAllToLeft = useCallback(() => {
        const enabledItems = rightItems.filter(item => !item.disabled);
        const newLeftItems = [...leftItems, ...enabledItems];
        const newRightItems = rightItems.filter(item => item.disabled);
        
        setRightSelected(new Set());
        onItemsChange(newLeftItems, newRightItems);
    }, [leftItems, rightItems, onItemsChange]);

    return {
        leftSelected,
        rightSelected,
        handleToggle,
        handleSelectAll,
        handleDeselectAll,
        moveToRight,
        moveToLeft,
        moveAllToRight,
        moveAllToLeft,
    };
};