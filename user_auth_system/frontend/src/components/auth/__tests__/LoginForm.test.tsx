import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

//mock the authAPI
jest.mock('../../../services/authAPI', () => ({
  login: jest.fn(() => Promise.resolve({ success: true })),
  register: jest.fn(),
  logout: jest.fn(),
}));

// Mock the Redux hooks
jest.mock('../../../store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => ({
    loading: false,
    error: null
  })
}));

// Mock the UI components
jest.mock('../../ui/Alert', () => {
  return function MockAlert({ type, message, onClose }: { type: string; message: string; onClose: () => void }) {
    return (
      <div data-testid="alert" data-type={type}>
        {message}
        <button onClick={onClose} data-testid="alert-close">Close</button>
      </div>
    );
  };
});

jest.mock('../../ui/Input', () => {
  return function MockInput({ 
    id, 
    type, 
    label, 
    placeholder, 
    value, 
    onChange, 
    required 
  }: { 
    id: string; 
    type: string; 
    label: string; 
    placeholder: string; 
    value: string; 
    onChange: (value: string) => void; 
    required: boolean;
  }) {
    return (
      <div data-testid={`input-${id}`}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      </div>
    );
  };
});

jest.mock('../../ui/Button', () => {
  return function MockButton({ 
    type, 
    variant, 
    size, 
    fullWidth, 
    loading, 
    disabled, 
    children 
  }: { 
    type?: "button" | "reset" | "submit"; 
    variant: string; 
    size: string; 
    fullWidth: boolean; 
    loading: boolean; 
    disabled: boolean; 
    children: React.ReactNode;
  }) {
    return (
      <button
        type={type} 
        data-testid="login-button"
        data-variant={variant}
        data-size={size}
        data-fullwidth={fullWidth.toString()}
        disabled={disabled}
        data-loading={loading.toString()}
      >
        {children}
      </button>
    );
  };
});

describe('LoginForm', () => {
  const mockOnSwitchToRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all elements', () => {
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    expect(screen.getByRole('heading', { name: 'Sign In'})).toBeInTheDocument();
    expect(screen.getByText('Welcome back! Please sign in to your account.')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByText('Sign up here')).toBeInTheDocument();
  });

  test('handles email input change', () => {
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const emailInput = screen.getByTestId('input-email').querySelector('input')!;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('handles password input change', () => {
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput).toHaveValue('password123');
  });

  test('calls onSwitchToRegister when sign up link is clicked', () => {
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const signUpLink = screen.getByText('Sign up here');
    fireEvent.click(signUpLink);
    
    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });
});