'use client';

import { useState, useEffect } from 'react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

interface StickyCalculatorHeaderProps {
  calculatorName: string;
  calculatorIcon: string;
  onBack?: () => void;
}

export function StickyCalculatorHeader({
  calculatorName,
  calculatorIcon,
  onBack
}: StickyCalculatorHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <>
      {/* Sticky Header - Mobile Only */}
      <div
        className={`fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl z-30 transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Header Content */}
        <div className="flex items-center justify-between h-14 px-4 gap-2">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            title="Go back"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Calculator Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{calculatorIcon}</span>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {calculatorName}
            </h2>
          </div>

          {/* Theme Switcher */}
          <div className="flex-shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Spacing for sticky header when visible */}
      {isVisible && <div className="h-14 md:hidden" />}
    </>
  );
}
