import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, LogOut } from 'lucide-react';
import { authService } from '@/services/authService';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/buttons/Button';
import type { RootState, AppDispatch } from '@/store';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { selectIsLoading } from '@/store/slices/globalSlice';

export const LoginButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  //global loading selectors
  const isCheckingAuth = useSelector((state: RootState) => 
    selectIsLoading(state, 'auth/checkAuthStatus')
  );
  const isHandlingCallback = useSelector ((state : RootState) => 
    selectIsLoading(state, 'auth/handleOAuthCallback')
  );
  const isGettingUser = useSelector((state : RootState) => 
    selectIsLoading(state, 'auth/getCurrentUser')
  );

  //check if any auth operation is in progress  
  const isLoading = isCheckingAuth || isHandlingCallback || isGettingUser;

  const handleLogin = () => {
    console.log('Login button clicked');
    console.log('Current auth state:', { isAuthenticated, user, isLoading });
    try {
      authService.login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    dispatch(logout());
  };

  console.log('LoginButton render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  if (isLoading) {
    return (
      <Button disabled variant="secondary" size="sm">
        <LoadingSpinner />
        <span>Loading...</span>
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
            className="w-8 h=8 rounded-full"
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