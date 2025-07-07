import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import Alert from '../ui/Alert';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <Lock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => dispatch(clearError())} 
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          icon={Mail}
          required
          autoComplete="email"
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          icon={Lock}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
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