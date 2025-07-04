import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';

// 1. Define types with discriminants
type ProfileSection = {
  type: 'profile';
  title: string;
  fields: readonly {
    key: string;
    label: string;
    accessor: keyof { name: string; email: string; userID: string };
  }[];
};

type ProtectedContentSection = {
  type: 'protectedContent';
  title: string;
  description: string;
  statusBadge: {
    text: string;
    icon: React.ComponentType;
    bgColor: string;
    textColor: string;
    iconColor: string;
  };
};

type DashboardSections = {
  profile: ProfileSection;
  protectedContent: ProtectedContentSection;
};

// 2. Configuration with explicit types
const DASHBOARD_CONFIG = {
  navigation: {
    title: 'Dashboard',
    icon: Shield,
    iconColor: 'text-blue-600',
    welcomeText: 'Welcome',
    logoutText: 'Logout'
  },
  sections: {
    profile: {
      type: 'profile' as const,
      title: 'Profile Information',
      fields: [
        { key: 'name', label: 'Full Name', accessor: 'name' },
        { key: 'email', label: 'Email Address', accessor: 'email' },
        { key: 'userID', label: 'User ID', accessor: 'userID' }
      ] as const
    },
    protectedContent: {
      type: 'protectedContent' as const,
      title: 'Protected Content',
      description: 'This is a protected area that only authenticated users can access.',
      statusBadge: {
        text: 'Authentication Status: Verified',
        icon: Shield,
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      }
    }
  }
} as const;

const BUTTON_CONFIGS = {
  logout: {
    icon: LogOut,
    text: 'Logout',
    baseClasses: 'flex items-center text-sm transition-colors',
    colorClasses: 'text-red-600 hover:text-red-700',
    iconClasses: 'h-4 w-4 mr-1'
  } as const
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const renderButton = (buttonType: keyof typeof BUTTON_CONFIGS, onClick: () => void) => {
    const config = BUTTON_CONFIGS[buttonType];
    const Icon = config.icon;
    
    return (
      <button
        onClick={onClick}
        className={`${config.baseClasses} ${config.colorClasses}`}
        aria-label={config.text}
      >
        <Icon className={config.iconClasses} />
        {config.text}
      </button>
    );
  };

  const renderProfileField = (field: ProfileSection['fields'][number]) => {
    const value = user?.[field.accessor];
    
    return (
      <div key={field.key}>
        <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
      </div>
    );
  };

  const renderSection = (sectionKey: keyof DashboardSections) => {
    const section = DASHBOARD_CONFIG.sections[sectionKey];
    
    switch (section.type) {
      case 'profile':
        return (
          <div key={sectionKey} className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {section.fields.map(renderProfileField)}
              </dl>
            </div>
          </div>
        );
      
      case 'protectedContent':
        const StatusIcon = section.statusBadge.icon;
        return (
          <div key={sectionKey} className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">{section.description}</p>
              <div className={`mt-4 p-4 ${section.statusBadge.bgColor} rounded-lg`}>
                <div className="flex items-center">
                  <StatusIcon className={`h-5 w-5 ${section.statusBadge.iconColor} mr-2`} />
                  <span className={`${section.statusBadge.textColor} font-medium`}>
                    {section.statusBadge.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const NavIcon = DASHBOARD_CONFIG.navigation.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <NavIcon className={`h-8 w-8 ${DASHBOARD_CONFIG.navigation.iconColor} mr-2`} />
              <h1 className="text-xl font-semibold text-gray-900">
                {DASHBOARD_CONFIG.navigation.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {DASHBOARD_CONFIG.navigation.welcomeText}, {user?.name || 'User'}
              </span>
              {renderButton('logout', logout)}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {(Object.keys(DASHBOARD_CONFIG.sections) as Array<keyof DashboardSections>).map(sectionKey =>
            renderSection(sectionKey)
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;