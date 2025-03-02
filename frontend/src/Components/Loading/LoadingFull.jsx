import React from 'react';

const LoadingFull = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-lg z-50">
      <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingFull;