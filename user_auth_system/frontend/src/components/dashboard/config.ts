import { Shield } from 'lucide-react';

export const DASHBOARD_CONFIG = {
  navigation: {
    title: 'Dashboard',
    icon: Shield,
    iconColor: 'text-blue-600',
    welcomeText: 'Welcome',
    logoutText: 'Logout'
  },
  sections: {
    profile: {
      title: 'Profile Information',
      fields: [
        { key: 'name', label: 'Full Name', accessor: 'name' as const },
        { key: 'email', label: 'Email Address', accessor: 'email' as const },
        { key: 'userID', label: 'User ID', accessor: 'userID' as const }
      ]
    },
    protectedContent: {
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