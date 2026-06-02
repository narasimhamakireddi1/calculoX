'use client';

import { useRouter } from 'next/navigation';
import { getActiveCalculators } from '@/config/calculators.config';

interface CalculatorBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorBottomSheet({ isOpen, onClose }: CalculatorBottomSheetProps) {
  const router = useRouter();
  const activeCalculators = getActiveCalculators();

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[70] md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-[80] w-[85vw] max-w-full bg-white dark:bg-gray-900 shadow-2xl md:hidden overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Menu Content */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Home Link */}
          <button
            onClick={() => handleNavigate('/')}
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <span className="text-2xl">🏠</span>
            <span className="font-semibold text-gray-900 dark:text-white">Home</span>
          </button>

          {/* Calculators Section */}
          <div className="px-4 py-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Calculators
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {activeCalculators.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => handleNavigate(calc.href)}
                  className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
                  title={calc.title}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{calc.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-1 text-center">
                    {calc.title.replace(' Calculator', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Blog Link */}
          <button
            onClick={() => handleNavigate('/blog')}
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <span className="text-2xl">📖</span>
            <span className="font-semibold text-gray-900 dark:text-white">Blog</span>
          </button>

          {/* About Link */}
          <button
            onClick={() => handleNavigate('/about')}
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <span className="text-2xl">ℹ️</span>
            <span className="font-semibold text-gray-900 dark:text-white">About</span>
          </button>
        </div>
      </div>
    </>
  );
}
