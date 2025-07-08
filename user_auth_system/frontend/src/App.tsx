import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { verifyToken } from './store/slices/authSlice';
import AuthPages from './components/auth/AuthPages';
import Dashboard from './components/dashboard/Dashboard';
import LoadingState from './components/ui/LoadingState';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading} = useAppSelector((state) => state.auth);
  const [initializing, setInitializing] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to verify token from HTTP-only cookie
        await dispatch(verifyToken()).unwrap();
      } catch (error) {
        // If token verification fails, user remains unauthenticated
        console.log('No valid session found');
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading state while initializing
  if (initializing) {
    return (
      <LoadingState 
        fullScreen 
        message="Initializing application..." 
      />
    );
  }

  // Show loading state during auth operations
  if (loading) {
    return (
      <LoadingState 
        fullScreen 
        message="Processing..." 
      />
    );
  }

  // Show dashboard if authenticated, otherwise show auth pages
  return isAuthenticated ? <Dashboard /> : <AuthPages />;
};

export default App;