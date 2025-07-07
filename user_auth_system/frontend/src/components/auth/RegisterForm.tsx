import React, { useState, useEffect } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';
import Alert from '../ui/Alert';
import Input from '../ui/Input';
import Button from '../ui/Button';

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
  
  const [validationError, setValidationError] = useState<string>('');

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user types
    if (validationError) {
      setValidationError('');
    }
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
    
    const clientValidationError = validateForm();
    if (clientValidationError) {
      setValidationError(clientValidationError);
      return;
    }

    // Dispatch register action with Redux
    dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password
    }));
  };

  const renderFormField = (fieldKey: keyof typeof FORM_FIELDS) => {
    const field = FORM_FIELDS[fieldKey];
    
    return (
      <Input
        key={field.id}
        id={field.id}
        type={field.type}
        label={field.label}
        placeholder={field.placeholder}
        value={formData[fieldKey]}
        onChange={(value) => handleInputChange(fieldKey, value)}
        icon={field.icon}
        required={field.required}
        autoComplete={field.autoComplete}
        className={`focus:ring-2 ${FORM_CONFIG.theme.colors.focus}`}
      />
    );
  };

  // Display validation error or Redux error
  const displayError = validationError || error;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <User className={`h-12 w-12 ${FORM_CONFIG.theme.colors.icon} mx-auto mb-2`} />
        <h2 className="text-2xl font-bold text-gray-900">{FORM_CONFIG.content.title}</h2>
        <p className="text-gray-600">{FORM_CONFIG.content.subtitle}</p>
      </div>

      {displayError && (
        <Alert 
          type="error" 
          message={displayError} 
          onClose={() => {
            setValidationError('');
            dispatch(clearError());
          }} 
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(FORM_FIELDS).map(fieldKey => 
          renderFormField(fieldKey as keyof typeof FORM_FIELDS)
        )}

        <Button
          type="submit"
          variant="success"
          size="md"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {loading ? FORM_CONFIG.content.buttonText.loading : FORM_CONFIG.content.buttonText.default}
        </Button>
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