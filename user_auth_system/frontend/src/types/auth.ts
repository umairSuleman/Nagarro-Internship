export interface User {
    userID : string;
    name: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<AuthResult>;
    register:(name: string, email: string, password: string) => Promise<AuthResult>;
    logout: () => void;
    loading: boolean;
}

export interface AuthResult {
    success: boolean;
    error?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

export interface AlertProps {
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

export interface FormState {
  loading: boolean;
  error: string;
}