import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import Alert from '../ui/Alert';
import type { FormState } from '../../types/auth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
  });

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormState({ loading: true, error: '' });

    const result = await login(email, password);
    
    if (!result.success) {
      setFormState({ loading: false, error: result.error || 'Login failed' });
    } else {
      setFormState({ loading: false, error: '' });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <Lock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
      </div>

      {formState.error && <Alert type="error" message={formState.error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={formState.loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {formState.loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign up here
        </button>
      </p>
    </div>
  );
};

export default LoginForm;