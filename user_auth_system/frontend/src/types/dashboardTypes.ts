import { User } from './auth'

export type ProfileField = {
  key: string;
  label: string;
  accessor: keyof User;
};

export type StatusBadge = {
  text: string;
  icon: React.ComponentType<{ className ?: string}>;
  bgColor: string;
  textColor: string;
  iconColor: string;
};