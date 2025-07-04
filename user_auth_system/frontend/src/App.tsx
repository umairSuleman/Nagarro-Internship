import React from 'react';
import { AuthProvider, useAuth } from './contexts/authContext';
import AuthPages from './components/auth/AuthPages';
import Dashboard from './components/dashboard/Dashboard';
import Loading from './components/ui/Loading';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  return user ? <Dashboard /> : <AuthPages />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;