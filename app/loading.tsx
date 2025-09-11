import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation placeholder */}
      <div className="w-full bg-white">
        <div className="flex w-full max-w-[1400px] mx-auto bg-white h-16">
          <div className="flex items-center justify-between w-full px-4">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>

      {/* Rooms section placeholder */}
      <div className="flex w-full">
        <div className="flex items-center justify-center w-full py-12">
          <LoadingSpinner size="md" />
        </div>
      </div>

      {/* Main content placeholder */}
      <main className="flex flex-col items-center justify-start min-h-screen">
        <div className="w-full max-w-6xl px-4 py-12">
          <div className="space-y-8">
            <div className="h-12 bg-gray-200 animate-pulse rounded-lg mx-auto max-w-md"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded-lg mx-auto max-w-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
