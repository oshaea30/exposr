import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow ${className}`}>
    <div className="flex items-center space-x-3 mb-3">
      <Icon className="w-6 h-6 text-purple-600" />
      <span className="font-semibold text-gray-900">{title}</span>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;
