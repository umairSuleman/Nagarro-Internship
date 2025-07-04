import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

// Define proper types for the components and their props
type AuthMode = 'login' | 'register';

type AuthConfig = {
  [key in AuthMode]: {
    component: React.ComponentType<any>;
    props: (switchHandler: () => void) => Record<string, () => void>;
  };
};

// Configuration map with proper typing
const AUTH_CONFIG: AuthConfig = {
  login: {
    component: LoginForm,
    props: (switchHandler) => ({ onSwitchToRegister: switchHandler })
  },
  register: {
    component: RegisterForm,
    props: (switchHandler) => ({ onSwitchToLogin: switchHandler })
  }
} as const;

const AuthPages: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const currentMode: AuthMode = isLogin ? 'login' : 'register';
  const switchHandler = () => setIsLogin(!isLogin);
  
  const { component: CurrentComponent, props } = AUTH_CONFIG[currentMode];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <CurrentComponent {...props(switchHandler)} />
    </div>
  );
};

export default AuthPages;