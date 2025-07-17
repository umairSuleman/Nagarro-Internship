export interface CheckboxItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    children?: CheckboxItem[];
    disabled?: boolean;
    description?: string;
}

export interface CheckboxConfig {
    items: CheckboxItem[];
    allowPartialSelection?: boolean;
    expandable?: boolean;
    showIcons?: boolean;
    showDescriptions?: boolean;
    multiSelect?: boolean;
    onSelectionChange?: (selectedItems: string[]) => void;
    theme?: 'default' | 'dark' | 'minimal';
}

export interface CheckboxState {
    checked: boolean;
    indeterminate: boolean;
    expanded: boolean;
}

export interface CheckboxTheme {
    container: string;
    item: string;
    checkbox: string;
    label: string;
    description: string;
    icon: string;
    expandButton: string;
}

export type CheckboxThemes = {
    default: CheckboxTheme;
    dark: CheckboxTheme;
    minimal: CheckboxTheme;
};