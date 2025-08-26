import React from 'react';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../../constants';

const Button = ({ 
  variant = BUTTON_VARIANTS.PRIMARY, 
  size = BUTTON_SIZES.MD, 
  className = '', 
  children, 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    [BUTTON_VARIANTS.PRIMARY]: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-purple-500 disabled:hover:scale-100 disabled:hover:from-purple-600 disabled:hover:to-indigo-600 transition-all duration-200',
    [BUTTON_VARIANTS.SECONDARY]: 'bg-gray-100 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 text-gray-700 focus:ring-gray-500 disabled:hover:bg-gray-100 transform hover:scale-105 hover:shadow-md transition-all duration-200',
    [BUTTON_VARIANTS.OUTLINE]: 'border-2 border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-indigo-600 focus:ring-purple-500 disabled:hover:bg-transparent transform hover:scale-105 transition-all duration-200'
  };
  
  const sizes = {
    [BUTTON_SIZES.SM]: 'py-2 px-4 text-sm',
    [BUTTON_SIZES.MD]: 'py-3 px-6',
    [BUTTON_SIZES.LG]: 'py-4 px-8 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === BUTTON_VARIANTS.PRIMARY && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 animate-progress-shimmer" />
      )}
      
      <div className="relative z-10">
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </button>
  );
};

export default Button;
