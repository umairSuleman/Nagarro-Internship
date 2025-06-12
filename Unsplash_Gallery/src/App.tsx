import React, { useState } from 'react';
import { Navigation } from './components';
import { HomePage, RandomPage, SearchPage } from './pages';
import './styles/index.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;