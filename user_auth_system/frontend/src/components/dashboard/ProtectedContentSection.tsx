import React from 'react';
import { StatusBadge } from '../../types/dashboardTypes';

interface ProtectedContentSectionProps {
  title: string;
  description: string;
  statusBadge: StatusBadge;
}

const ProtectedContentSection: React.FC<ProtectedContentSectionProps> = ({ 
  title, 
  description, 
  statusBadge 
}) => {
  const StatusIcon = statusBadge.icon;
  
  return (
    <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-4">
        <p className="text-gray-600">{description}</p>
        <div className={`mt-4 p-4 ${statusBadge.bgColor} rounded-lg`}>
          <div className="flex items-center">
            <StatusIcon className={`h-5 w-5 ${statusBadge.iconColor} mr-2`} />
            <span className={`${statusBadge.textColor} font-medium`}>
              {statusBadge.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedContentSection;