import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import Alert from '../ui/Alert';
import type { FormState } from '../../types/auth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

// Configuration map for form fields
const FORM_FIELDS = {
  email: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    icon: Mail,
    autoComplete: 'email',
    required: true
  },
  password: {
    id: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    icon: Lock,
    autoComplete: 'current-password',
    required: true
  }
} as const;

// Configuration for form styling and content
const FORM_CONFIG = {
  theme: {
    primary: 'blue',
    colors: {
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      focus: 'focus:ring-blue-500',
      link: 'text-blue-600 hover:text-blue-700'
    }
  },
  content: {
    title: 'Sign In',
    subtitle: 'Welcome back! Please sign in to your account.',
    buttonText: {
      default: 'Sign In',
      loading: 'Signing In...'
    },
    switchText: "Don't have an account?",
    switchLink: 'Sign up here'
  }
};

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
  });

  const { login } = useAuth();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormState({ loading: true, error: '' });

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setFormState({ loading: false, error: result.error || 'Login failed' });
    } else {
      setFormState({ loading: false, error: '' });
    }
  };

  const renderFormField = (fieldKey: keyof typeof FORM_FIELDS) => {
    const field = FORM_FIELDS[fieldKey];
    const Icon = field.icon;
    
    return (
      <div key={field.id}>
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id={field.id}
            type={field.type}
            value={formData[fieldKey]}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${FORM_CONFIG.theme.colors.focus} focus:border-transparent`}
            placeholder={field.placeholder}
            required={field.required}
            autoComplete={field.autoComplete}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <Lock className={`h-12 w-12 ${FORM_CONFIG.theme.colors.icon} mx-auto mb-2`} />
        <h2 className="text-2xl font-bold text-gray-900">{FORM_CONFIG.content.title}</h2>
        <p className="text-gray-600">{FORM_CONFIG.content.subtitle}</p>
      </div>

      {formState.error && <Alert type="error" message={formState.error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(FORM_FIELDS).map(fieldKey => 
          renderFormField(fieldKey as keyof typeof FORM_FIELDS)
        )}

        <button
          type="submit"
          disabled={formState.loading}
          className={`w-full ${FORM_CONFIG.theme.colors.button} text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {formState.loading ? FORM_CONFIG.content.buttonText.loading : FORM_CONFIG.content.buttonText.default}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {FORM_CONFIG.content.switchText}{' '}
        <button
          onClick={onSwitchToRegister}
          className={`${FORM_CONFIG.theme.colors.link} font-medium`}
        >
          {FORM_CONFIG.content.switchLink}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;