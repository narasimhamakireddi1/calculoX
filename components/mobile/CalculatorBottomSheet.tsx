'use client';

import { useRouter } from 'next/navigation';
import { getActiveCalculators } from '@/config/calculators.config';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

interface CalculatorBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorBottomSheet({ isOpen, onClose }: CalculatorBottomSheetProps) {
  const router = useRouter();
  const activeCalculators = getActiveCalculators();

  if (!isOpen) return null;

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div className="fixed top-0 right-0 h-screen z-50 w-4/5 bg-white dark:bg-gray-900 shadow-2xl md:hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Home */}
          <button
            onClick={() => handleNavigate('/')}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 flex items-center gap-3"
          >
            <span className="text-2xl">🏠</span>
            <span className="font-semibold text-gray-900 dark:text-white">Home</span>
          </button>

          {/* Calculators Header */}
          <div className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            Calculators
          </div>

          {/* Calculators Grid */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-3">
              {activeCalculators && activeCalculators.length > 0 ? (
                activeCalculators.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => handleNavigate(calc.href)}
                    className="flex flex-col items-center gap-1 p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    title={calc.title}
                  >
                    <span className="text-2xl">{calc.icon}</span>
                    <span className="text-xs text-center text-gray-700 dark:text-gray-300 line-clamp-2">
                      {calc.title.replace(' Calculator', '')}
                    </span>
                  </button>
                ))
              ) : (
                <div className="col-span-4 text-center text-gray-500">Loading...</div>
              )}
            </div>
          </div>

          {/* Blog */}
          <button
            onClick={() => handleNavigate('/blog')}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 flex items-center gap-3"
          >
            <span className="text-2xl">📖</span>
            <span className="font-semibold text-gray-900 dark:text-white">Blog</span>
          </button>

          {/* About */}
          <button
            onClick={() => handleNavigate('/about')}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 flex items-center gap-3"
          >
            <span className="text-2xl">ℹ️</span>
            <span className="font-semibold text-gray-900 dark:text-white">About</span>
          </button>
        </div>

        {/* Theme Switcher - Mobile */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</span>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
}
