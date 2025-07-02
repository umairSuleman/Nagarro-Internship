import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import { Navigation, LoadingSpinner, Alert } from './components';
import { HomePage, SearchPage, RandomPage } from './pages';
import { OAuthCallback } from './components/auth/OAuthCallback';
import { clearAllErrors } from './store/slices/globalSlice';
import { checkAuthStatus } from './store/slices/authSlice';
import type { RootState, AppDispatch } from './store/types';
import './styles/index.css';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  //Global loading and error state
  const globalLoading = useSelector((state: RootState) => 
    Object.values(state.global.loading).some(Boolean)
  );
  
  const globalErrors = useSelector((state: RootState) => 
    Object.values(state.global.errors).filter(Boolean)
  );

  //check for OAuth callback
  const isOAuthCallback = window.location.search.includes('code=') || window.location.search.includes('error=');
  console.log('App render:', {
    currentURL: window.location.href,
    searchParams: window.location.search,
    isOAuthCallback,
    activeTab
  });
  
  //only check auth status once on app load, and not during OAuth callback
  useEffect(() => {
    if (!isOAuthCallback && !authChecked) {
      console.log('Checking auth status on app load...');
      dispatch(checkAuthStatus()).finally(() => {
        setAuthChecked(true);
      });
    } else if (isOAuthCallback) {
      setAuthChecked(true);
    }
  }, [dispatch, isOAuthCallback, authChecked]);

  const renderContent = () => {
    //handle OAuth callback
    if (isOAuthCallback) {
      return (
        <OAuthCallback
          onSuccess={() => {
            setActiveTab('home');
            dispatch(checkAuthStatus());
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
          onError={(error) => {
            console.error('OAuth error:', error);
            setActiveTab('home');
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        />
      );
    }
    switch(activeTab) {
      case 'home':
        return <HomePage />;
      case 'random':
        return <RandomPage />;
      case 'search':
        return <SearchPage />;
      default:
        return <HomePage />;
    }
  };

  const handleClearAllErrors = () => {
    dispatch(clearAllErrors());
  };

  return (  
    <div className="min-h-screen bg-gray-100 relative">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {globalLoading && ( <LoadingSpinner /> )}
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {globalErrors.length > 0 && (
          <div className="mb-6 space-y-2">
            {globalErrors.map((error, index) => (
              <Alert
                key={index}
                message={error || 'An error has occurred'}
                type="error"
                dismissible
                onDismiss={handleClearAllErrors}
              />
            ))}
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;