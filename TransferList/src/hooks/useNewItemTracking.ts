import type { UseNewItemTrackingProps } from "../types/listTypes";
import { useState, useEffect } from "react";


export const useNewItemTracking = ({ leftItems, rightItems }: UseNewItemTrackingProps) => {
    const [newItems, setNewItems] = useState<Set<string | number>>(new Set());
    const [initialLeftIds, setInitialLeftIds] = useState<Set<string | number>>(new Set());
    const [initialRightIds, setInitialRightIds] = useState<Set<string | number>>(new Set());

    //Track initial items to identify new ones
    useEffect(() => {
        setInitialLeftIds(new Set(leftItems.map(item => item.id)));
        setInitialRightIds(new Set(rightItems.map(item => item.id)));
    }, []);

    //Update new items when lists change
    useEffect(() => {
        const newLeftItems = leftItems.filter(item => !initialLeftIds.has(item.id));
        const newRightItems = rightItems.filter(item => !initialRightIds.has(item.id));
        
        setNewItems(new Set([...newLeftItems.map(item => item.id), ...newRightItems.map(item => item.id)]));
    }, [leftItems, rightItems, initialLeftIds, initialRightIds]);

    return { newItems };
};

