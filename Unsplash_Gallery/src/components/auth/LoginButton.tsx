// src/components/auth/LoginButton.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, LogOut } from 'lucide-react';
import { authService } from '@/services/authService';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/buttons/Button';
import type { RootState, AppDispatch } from '@/store';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const LoginButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    authService.login();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return (
      <Button disabled variant="secondary" size="sm">
        <LoadingSpinner />
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <img
            src={user.profile_image.small}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-white">{user.name}</span>
        </div>
        <Button
          onClick={handleLogout}
          variant="secondary"
          size="sm"
          icon={LogOut}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      variant="secondary"
      size="sm"
      icon={LogIn}
    >
      Login with Unsplash
    </Button>
  );
};