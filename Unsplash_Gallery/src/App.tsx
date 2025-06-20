import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { Navigation, LoadingSpinner, Alert } from './components';
import { HomePage, SearchPage, RandomPage } from './pages';
import { clearAllErrors } from './store/slices/globalSlice';
import { useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store/types';
import './styles/index.css';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const dispatch = useDispatch<AppDispatch>();
  
  //Global loading and error state
  const globalLoading = useSelector((state: RootState) => 
    Object.values(state.global.loading).some(Boolean)
  );
  
  const globalErrors = useSelector((state: RootState) => 
    Object.values(state.global.errors).filter(Boolean)
  );

  const renderContent = () => {
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
      
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <LoadingSpinner />
            <p className="text-center mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
      
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