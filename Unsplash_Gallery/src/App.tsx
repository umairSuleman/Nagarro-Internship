import React, {useState} from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navigation } from './components';
import { HomePage, SearchPage, RandomPage} from './pages';
import './styles/index.css';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <HomePage />;
      case  'random':
        return <RandomPage />;
      case 'search':
        return <SearchPage />;
      default:
        return <HomePage />;
    }
  };

  return (  
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-8">
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