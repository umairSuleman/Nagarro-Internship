// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import Alert from '../ui/Alert';
import type { FormState } from '../../types/auth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
  });

  const { register } = useAuth();

  const validateForm = (): string | null => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setFormState({ loading: false, error: validationError });
      return;
    }

    setFormState({ loading: true, error: '' });

    const result = await register(name, email, password);
    
    if (!result.success) {
      setFormState({ loading: false, error: result.error || 'Registration failed' });
    } else {
      setFormState({ loading: false, error: '' });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <User className="h-12 w-12 text-green-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600">Join us today! Create your new account.</p>
      </div>

      {formState.error && <Alert type="error" message={formState.error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Create a password"
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={formState.loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {formState.loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Sign in here
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;