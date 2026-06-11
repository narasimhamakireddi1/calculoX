function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
    </div>
  );
}

export function CalculatorSkeleton() {
  return (
    <div className="space-y-8 py-8">
      {/* Page header */}
      <div className="text-center space-y-3">
        <Shimmer className="h-10 w-72 mx-auto" />
        <Shimmer className="h-4 w-96 mx-auto" />
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Inputs panel */}
        <div className="card space-y-6 p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3.5 w-28" />
              <Shimmer className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Results panel */}
        <div className="card space-y-5 p-6">
          <Shimmer className="h-5 w-40" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-7 w-28" />
              </div>
            ))}
          </div>
          <Shimmer className="h-52 w-full mt-2" />
        </div>
      </div>
    </div>
  );
}
