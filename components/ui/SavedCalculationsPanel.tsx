'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSavedCalculations, type SavedCalculation } from '@/lib/hooks/useSavedCalculations';

export function SavedCalculationsPanel() {
  const router = useRouter();
  const { getSavedCalculations, deleteCalculation, clearAllCalculations } = useSavedCalculations();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const saved = getSavedCalculations();
    setCalculations(saved);
  }, [getSavedCalculations]);

  if (calculations.length === 0) {
    return null;
  }

  const handleLoad = (calc: SavedCalculation) => {
    sessionStorage.setItem(`restore_${calc.calculatorType}`, JSON.stringify(calc.inputs));
    router.push(`/${calc.calculatorType}-calculator`);
  };

  const handleDelete = (id: string) => {
    deleteCalculation(id);
    setCalculations(prev => prev.filter(c => c.id !== id));
  };

  const handleClearAll = () => {
    clearAllCalculations();
    setCalculations([]);
    setShowClearConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800/50 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>💾</span>
            Your Saved Calculations
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Quick access to your recent calculations ({calculations.length}/{10})
          </p>
        </div>
        {calculations.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs px-3 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {calculations.map((calc) => (
          <div
            key={calc.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between border border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {calc.customName || calc.calculatorName}
                </p>
                {calc.customName && (
                  <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full truncate">
                    {calc.calculatorName}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Saved {formatDate(calc.savedAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => handleLoad(calc)}
                className="px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all active:scale-95"
              >
                Load
              </button>
              <button
                onClick={() => handleDelete(calc.id)}
                className="px-2 py-1.5 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {showClearConfirm && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400 mb-3">
            Clear all {calculations.length} saved calculations? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Yes, Clear All
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded text-sm font-semibold border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
