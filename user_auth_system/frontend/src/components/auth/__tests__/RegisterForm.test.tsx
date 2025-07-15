import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../RegisterForm';

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

// Mock the UI components (same as LoginForm)
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
        data-testid="register-button"
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

describe('RegisterForm', () => {
  const mockOnSwitchToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders register form with all elements', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    expect(screen.getByRole('heading', { name: 'Create Account'})).toBeInTheDocument();
    expect(screen.getByText('Join us today! Create your new account.')).toBeInTheDocument();
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirmPassword')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    expect(screen.getByText('Sign in here')).toBeInTheDocument();
  });

  test('handles name input change', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput).toHaveValue('John Doe');
  });

  test('handles email input change', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(emailInput).toHaveValue('john@example.com');
  });

  test('handles password input change', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const passwordInput = screen.getByPlaceholderText('Create a password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput).toHaveValue('password123');
  });

  test('handles confirm password input change', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  test('calls onSwitchToLogin when sign in link is clicked', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const signInLink = screen.getByText('Sign in here');
    fireEvent.click(signInLink);
    
    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  test('shows validation error for password mismatch', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    // Fill form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'differentpassword' } });
    
    // Submit form
    const form = screen.getByTestId('register-button').closest('form');
    fireEvent.submit(form!);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  test('shows validation error for short password', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    // Fill form with short password
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: '123' } });
    
    // Submit form
    const form = screen.getByTestId('register-button').closest('form');
    fireEvent.submit(form!);
    
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  test('clears validation error when user types', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    // Create validation error first
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'different' } });
    
    const form = screen.getByTestId('register-button').closest('form');
    fireEvent.submit(form!);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    
    // Type in any field to clear error
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John' } });
    
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });

  test('successful form submission with valid data', () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    
    // Fill form with valid data
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password123' } });
    
    // Submit form
    const form = screen.getByTestId('register-button').closest('form');
    fireEvent.submit(form!);
    
    // Should not show any validation errors
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
  });
});