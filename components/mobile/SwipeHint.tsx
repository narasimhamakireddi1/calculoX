'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SwipeHintProps {
  hasLeft: boolean;
  hasRight: boolean;
  calculatorName: string;
  leftCalcName?: string;
  rightCalcName?: string;
}

export function SwipeHint({ hasLeft, hasRight, calculatorName, leftCalcName, rightCalcName }: SwipeHintProps) {
  if (!hasLeft && !hasRight) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30"
      role="navigation"
      aria-label="Swipe to navigate between calculators"
    >
      <div className="bg-gray-950/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 px-4 py-2 rounded-full text-xs font-semibold shadow-lg shadow-black/30 border border-white/10 dark:border-gray-200 flex items-center gap-1.5 whitespace-nowrap select-none">
        {hasLeft && (
          <>
            <ArrowLeft className="w-3 h-3 shrink-0 text-blue-400 dark:text-blue-600" aria-hidden="true" />
            <span className="text-blue-300 dark:text-blue-600">{leftCalcName ?? 'Prev'}</span>
            <span className="text-gray-600 dark:text-gray-400 mx-0.5">|</span>
          </>
        )}
        <span className="text-white dark:text-gray-900 font-bold">{calculatorName}</span>
        {hasRight && (
          <>
            <span className="text-gray-600 dark:text-gray-400 mx-0.5">|</span>
            <span className="text-blue-300 dark:text-blue-600">{rightCalcName ?? 'Next'}</span>
            <ArrowRight className="w-3 h-3 shrink-0 text-blue-400 dark:text-blue-600" aria-hidden="true" />
          </>
        )}
      </div>
    </div>
  );
}
