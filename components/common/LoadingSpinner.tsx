import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* 스피너 */}
        <div className="relative h-16 w-16">
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-200"></div>
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-orange-500"></div>
        </div>
        {/* 로딩 텍스트 */}
        <p className="text-lg font-medium text-gray-600">로딩중...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
