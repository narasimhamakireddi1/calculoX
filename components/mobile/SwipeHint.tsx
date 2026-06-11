'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SwipeHintProps {
  hasLeft: boolean;
  hasRight: boolean;
  calculatorName: string;
}

export function SwipeHint({ hasLeft, hasRight, calculatorName }: SwipeHintProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already seen hint for this calculator
    const hintKey = `swipe-hint-${calculatorName}`;
    const wasDismissed = localStorage.getItem(hintKey) === 'true';
    setDismissed(wasDismissed);
    setIsVisible(!wasDismissed);

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [calculatorName]);

  const handleDismiss = () => {
    const hintKey = `swipe-hint-${calculatorName}`;
    localStorage.setItem(hintKey, 'true');
    setIsVisible(false);
    setDismissed(true);
  };

  if (dismissed || !isVisible) return null;

  if (!hasLeft && !hasRight) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-4 duration-300"
      onClick={handleDismiss}
      role="status"
      aria-live="polite"
      aria-label="Swipe hint"
    >
      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 whitespace-nowrap">
        {hasLeft && <ArrowLeft className="w-4 h-4 animate-pulse" aria-hidden="true" />}
        <span>Swipe for more calculators</span>
        {hasRight && <ArrowRight className="w-4 h-4 animate-pulse" aria-hidden="true" />}
      </div>
    </div>
  );
}
