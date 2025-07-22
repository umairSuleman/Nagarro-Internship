export interface TransferListItem {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export interface TransferListProps {
  leftItems: TransferListItem[];
  rightItems: TransferListItem[];
  onItemsChange: (leftItems: TransferListItem[], rightItems: TransferListItem[]) => void;
  leftTitle?: string;
  rightTitle?: string;
  height?: string;
  width?: string;
  showSelectAll?: boolean;
  newItemColor?: string;
  normalItemColor?: string;
  selectedItemColor?: string;
  disabledItemColor?: string;
  buttonVariant?: ButtonVariant;
  dense?: boolean;
}

export interface ListComponentProps {
  items: TransferListItem[];
  selected: Set<string | number>;
  onToggle: (id: string | number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  title: string;
  isLeft?: boolean;
  height: string;
  width: string;
  showSelectAll: boolean;
  dense: boolean;
  newItems?: Set<string | number>;
  getItemClasses: (item: TransferListItem, isSelected: boolean) => string;
}

export interface UseTransferListSelectionProps {
  leftItems: TransferListItem[];
  rightItems: TransferListItem[];
  onItemsChange: (leftItems: TransferListItem[], rightItems: TransferListItem[]) => void;
}

export interface UseNewItemTrackingProps {
  leftItems: TransferListItem[];
  rightItems: TransferListItem[];
}

export type ButtonVariant = 'contained' | 'outlined' | 'text';