import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import DashboardNavigation from './DashboardNavigation';
import ProfileSection from './ProfileSection';
import ProtectedContentSection from './ProtectedContentSection';
import { DASHBOARD_CONFIG } from './config';
import { logoutUser } from '../../store/slices/authSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation
        title={DASHBOARD_CONFIG.navigation.title}
        icon={DASHBOARD_CONFIG.navigation.icon}
        iconColor={DASHBOARD_CONFIG.navigation.iconColor}
        welcomeText={DASHBOARD_CONFIG.navigation.welcomeText}
        userName={user?.name}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ProfileSection
            title={DASHBOARD_CONFIG.sections.profile.title}
            fields={DASHBOARD_CONFIG.sections.profile.fields}
            user={user}
          />
          
          <ProtectedContentSection
            title={DASHBOARD_CONFIG.sections.protectedContent.title}
            description={DASHBOARD_CONFIG.sections.protectedContent.description}
            statusBadge={DASHBOARD_CONFIG.sections.protectedContent.statusBadge}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;