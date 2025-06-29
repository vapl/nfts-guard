import React from "react";

const LoadingCardSkeleton: React.FC = () => {
  return (
    <div className="w-full py-8 px-4 lg:px-16 xl:px-24">
      <div className="w-full bg-gradient-to-r bg-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg animate-pulse">
        <div className="flex w-full sm:w-auto items-center justify-between">
          <div className="relative w-32 h-32 rounded-xl bg-gray-300"></div>
          <div className="flex sm:hidden flex-col justify-center items-center">
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="rounded-full bg-gray-300 w-20 h-20"></div>
            <div className="mt-3 h-4 w-16 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 flex-col w-full">
          <div className="flex-1 flex h-6 bg-gray-300 rounded mb-4 w-1/6"></div>
          <ul className="grid grid-cols-3 gap-2 text-sm opacity-80">
            <li className="bg-gray-300 shadow-md p-2 rounded-lg h-8"></li>
            <li className="bg-gray-300 shadow-md p-2 rounded-lg h-8"></li>
            <li className="bg-gray-300 shadow-md p-2 rounded-lg h-8"></li>
            <li className="bg-gray-300 shadow-md p-2 rounded-lg h-8"></li>
            <li className="bg-gray-300 shadow-md p-2 rounded-lg h-8"></li>
          </ul>
        </div>

        <div className="hidden sm:flex flex-col justify-center items-center">
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="rounded-full bg-gray-300 w-20 h-20"></div>
          <div className="mt-3 h-4 w-16 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCardSkeleton;
