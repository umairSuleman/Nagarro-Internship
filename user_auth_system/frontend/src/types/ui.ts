export interface BaseInputField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  icon: React.ComponentType<any>;
  autoComplete?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
}

export interface ButtonConfig {
  id: string;
  text: string;
  loadingText?: string;
  variant: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface FormConfig {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  fields: BaseInputField[];
  buttons: ButtonConfig[];
  footerText?: string;
  footerLink?: {
    text: string;
    onClick: () => void;
  };
}
