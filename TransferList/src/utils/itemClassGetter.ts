import type { TransferListItem } from "../types/listTypes";

export const createItemClassesGetter = (
    newItemColor: string,
    normalItemColor: string,
    selectedItemColor: string,
    disabledItemColor: string,
    newItems: Set<string | number>
) => {
    return (item: TransferListItem, isSelected: boolean): string => {
        if (item.disabled) return `${disabledItemColor} cursor-not-allowed`;
        if (isSelected) return `${selectedItemColor} cursor-pointer`;
        if (newItems.has(item.id)) return `${newItemColor} cursor-pointer`;
        return `${normalItemColor} cursor-pointer hover:bg-gray-50`;
    };
};