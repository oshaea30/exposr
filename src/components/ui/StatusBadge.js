import React from 'react';
import { BADGE_VARIANTS } from '../../constants';

const StatusBadge = ({ variant = BADGE_VARIANTS.DEFAULT, children, className = '' }) => {
  const variants = {
    [BADGE_VARIANTS.DEFAULT]: 'bg-gray-100 text-gray-800',
    [BADGE_VARIANTS.SUCCESS]: 'bg-green-100 text-green-800',
    [BADGE_VARIANTS.WARNING]: 'bg-yellow-100 text-yellow-800',
    [BADGE_VARIANTS.DANGER]: 'bg-red-100 text-red-800',
    [BADGE_VARIANTS.INFO]: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
