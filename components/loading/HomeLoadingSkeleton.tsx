import React from 'react';

const HomeLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Navigation skeleton */}
      <div className="w-full bg-white">
        <div className="flex w-full max-w-[1400px] mx-auto bg-white h-16">
          <div className="flex items-center justify-between w-full px-4">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            <div className="flex space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms section skeleton */}
      <div className="flex w-full border-t border-b border-gray-200">
        <div className="flex flex-row flex-wrap items-center justify-center w-full px-4 py-2 gap-x-8 gap-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-32 bg-gray-200 rounded border-2"></div>
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="flex flex-col items-center justify-start min-h-screen">
        {/* Hero section skeleton */}
        <section className="w-full overflow-hidden pt-16 pb-28">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <div className="h-16 bg-gray-200 rounded-lg mb-4 mx-auto max-w-lg"></div>
              <div className="h-6 bg-gray-200 rounded-lg mb-10 mx-auto max-w-md"></div>
              <div className="h-12 w-32 bg-gray-200 rounded-lg mx-auto mb-6"></div>
            </div>
            <div className="max-w-6xl mx-auto mt-16">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </section>

        {/* Features skeleton */}
        <section className="py-24 w-full">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeLoadingSkeleton;

