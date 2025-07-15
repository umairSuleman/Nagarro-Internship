import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthPages from '../AuthPages';

// Mock the child components
jest.mock('../LoginForm', () => {
  return function MockLoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
    return (
      <div data-testid="login-form">
        <h2>Login Form</h2>
        <button onClick={onSwitchToRegister} data-testid="switch-to-register">
          Switch to Register
        </button>
      </div>
    );
  };
});

jest.mock('../RegisterForm', () => {
  return function MockRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
    return (
      <div data-testid="register-form">
        <h2>Register Form</h2>
        <button onClick={onSwitchToLogin} data-testid="switch-to-login">
          Switch to Login
        </button>
      </div>
    );
  };
});

describe('AuthPages', () => {
  test('renders login form by default', () => {
    render(<AuthPages />);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('Login Form')).toBeInTheDocument();
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
  });

  test('switches to register form when switch handler is called', () => {
    render(<AuthPages />);
    
    // Initially shows login form
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    
    // Click switch to register
    fireEvent.click(screen.getByTestId('switch-to-register'));
    
    // Now shows register form
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByText('Register Form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  test('switches back to login form from register form', () => {
    render(<AuthPages />);
    
    // Switch to register
    fireEvent.click(screen.getByTestId('switch-to-register'));
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    
    // Switch back to login
    fireEvent.click(screen.getByTestId('switch-to-login'));
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
  });
});