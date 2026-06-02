'use client';

import { useRouter } from 'next/navigation';
import { getActiveCalculators } from '@/config/calculators.config';
import { MobileBottomSheet } from './MobileBottomSheet';

interface CalculatorBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorBottomSheet({ isOpen, onClose }: CalculatorBottomSheetProps) {
  const router = useRouter();
  const activeCalculators = getActiveCalculators();

  const handleNavigate = (href: string) => {
    onClose();
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  const navigationItems = [
    { href: '/', label: 'Home', icon: '🏠' },
  ];

  const bottomItems = [
    { href: '/blog', label: 'Blog', icon: '📖' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Navigation"
      maxHeight="95vh"
    >
      <div className="space-y-1 pb-4">
        {/* Home Link */}
        {navigationItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavigate(item.href)}
            className="w-full px-4 py-3 rounded-lg flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
          </button>
        ))}

        {/* Calculators Section */}
        <div className="pt-3 pb-2">
          <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Calculators
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {activeCalculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => handleNavigate(calc.href)}
                className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group text-center flex flex-col items-center gap-1"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {calc.icon}
                </div>
                <h4 className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-2">
                  {calc.title.replace(' Calculator', '')}
                </h4>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

        {/* Blog & About Links */}
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigate(item.href)}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </MobileBottomSheet>
  );
}
