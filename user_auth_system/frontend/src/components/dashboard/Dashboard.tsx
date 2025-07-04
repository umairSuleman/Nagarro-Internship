// src/components/dashboard/Dashboard.tsx
import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.userID}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Protected Content</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">
                This is a protected area that only authenticated users can access. 
                Your JWT token is being used to verify your identity for all protected routes.
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Authentication Status: Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;