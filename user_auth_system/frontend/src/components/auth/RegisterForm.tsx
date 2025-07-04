import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import Alert from '../ui/Alert';
import type { FormState } from '../../types/auth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

// Configuration map for form fields
const FORM_FIELDS = {
  name: {
    id: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    icon: User,
    autoComplete: 'name',
    required: true
  },
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
    placeholder: 'Create a password',
    icon: Lock,
    autoComplete: 'new-password',
    required: true
  },
  confirmPassword: {
    id: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
    icon: Lock,
    autoComplete: 'new-password',
    required: true
  }
} as const;

// Configuration for form styling and content
const FORM_CONFIG = {
  theme: {
    primary: 'green',
    colors: {
      icon: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      focus: 'focus:ring-green-500',
      link: 'text-green-600 hover:text-green-700'
    }
  },
  content: {
    title: 'Create Account',
    subtitle: 'Join us today! Create your new account.',
    buttonText: {
      default: 'Create Account',
      loading: 'Creating Account...'
    },
    switchText: 'Already have an account?',
    switchLink: 'Sign in here'
  },
  validation: {
    passwordMismatch: 'Passwords do not match',
    passwordLength: 'Password must be at least 6 characters',
    minPasswordLength: 6
  }
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
  });

  const { register } = useAuth();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    const { password, confirmPassword } = formData;
    const { validation } = FORM_CONFIG;
    
    if (password !== confirmPassword) {
      return validation.passwordMismatch;
    }
    if (password.length < validation.minPasswordLength) {
      return validation.passwordLength;
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

    const result = await register(formData.name, formData.email, formData.password);
    
    if (!result.success) {
      setFormState({ loading: false, error: result.error || 'Registration failed' });
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
        <User className={`h-12 w-12 ${FORM_CONFIG.theme.colors.icon} mx-auto mb-2`} />
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
          onClick={onSwitchToLogin}
          className={`${FORM_CONFIG.theme.colors.link} font-medium`}
        >
          {FORM_CONFIG.content.switchLink}
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;