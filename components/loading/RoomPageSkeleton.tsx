import React from 'react';

const RoomPageSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="py-3 pb-3">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Calendar/Scheduler skeleton */}
      <div className="relative w-full">
        <div className="bg-white border rounded-lg p-6">
          {/* Toolbar skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>

          {/* Calendar grid skeleton */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Header row */}
            {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map((day) => (
              <div key={day} className="h-8 bg-gray-100 rounded flex items-center justify-center">
                <div className="h-3 w-6 bg-gray-200 rounded"></div>
              </div>
            ))}
            {/* Calendar days */}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 rounded border">
                <div className="p-1">
                  <div className="h-4 w-6 bg-gray-200 rounded mb-1"></div>
                  {Math.random() > 0.7 && (
                    <div className="h-3 bg-blue-200 rounded mb-1"></div>
                  )}
                  {Math.random() > 0.8 && (
                    <div className="h-3 bg-green-200 rounded"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reservations list skeleton */}
          <div className="mt-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPageSkeleton;

