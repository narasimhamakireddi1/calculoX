'use client';

export function SkeletonCard() {
  return (
    <div className="card space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="space-y-3">
        <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card h-80 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
      <div className="w-full h-64 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
    </div>
  );
}

export function SkeletonInput() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}
