import React from 'react';
import { ProfileField } from '../../types/dashboardTypes';
import { User } from '../../types/auth'

interface ProfileSectionProps {
  title: string;
  fields: readonly ProfileField[];
  user: User | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, fields, user }) => {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          {fields.map((field) => {
            const value = user?.[field.accessor];
            return (
              <div key={field.key}>
                <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
};

export default ProfileSection;