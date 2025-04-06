// components/skeletons/LoadingSummaryCardSkeleton.tsx
import React from "react";

const LoadingSummaryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card p-6 rounded-2xl mt-6 drop-shadow-lg animate-pulse">
      <div className="flex-1 flex gap-3 mb-2">
        <div className="h-4 w-40 bg-gray-300 rounded"></div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSummaryCardSkeleton;
