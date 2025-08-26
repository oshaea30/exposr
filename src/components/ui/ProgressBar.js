import React from 'react';

const ProgressBar = ({ value, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-red-600'
  };
  
  const getVariant = () => {
    if (value > 80) return 'success';
    if (value > 60) return 'warning';
    return 'danger';
  };
  
  const colorClass = variants[variant === 'default' ? getVariant() : variant];
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner ${className}`}>
      <div 
        className={`h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${colorClass}`}
        style={{ 
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          transformOrigin: 'left'
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        
        {/* Moving highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress-shimmer" />
      </div>
    </div>
  );
};

export default ProgressBar;
