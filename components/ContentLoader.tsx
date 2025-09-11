"use client";

import LoadingSpinner from "./LoadingSpinner";

interface ContentLoaderProps {
  message?: string;
  minHeightClass?: string;
}

export default function ContentLoader({
  message = "Laster…",
  minHeightClass = "min-h-[300px]",
}: ContentLoaderProps) {
  return (
    <div className={`w-full flex items-center justify-center ${minHeightClass}`}>
      <div className="flex items-center gap-3 text-gray-600">
        <LoadingSpinner size="md" />
        <span>{message}</span>
      </div>
    </div>
  );
}


