import React from 'react';
import { LogOut } from 'lucide-react';

interface DashboardNavigationProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  welcomeText: string;
  userName: string | undefined;
  onLogout: () => void;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  title,
  icon: NavIcon,
  iconColor,
  welcomeText,
  userName,
  onLogout
}) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavIcon className={`h-8 w-8 ${iconColor} mr-2`} />
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {welcomeText}, {userName || 'User'}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center text-sm transition-colors text-red-600 hover:text-red-700"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;