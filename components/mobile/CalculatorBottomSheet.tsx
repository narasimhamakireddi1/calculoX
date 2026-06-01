'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { getActiveCalculators } from '@/config/calculators.config';
import { CategoryTabs, type CalculatorCategory } from '@/components/ui/CategoryTabs';
import { MobileBottomSheet } from './MobileBottomSheet';

interface CalculatorBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorBottomSheet({ isOpen, onClose }: CalculatorBottomSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | null>(null);
  const activeCalculators = getActiveCalculators();

  const filteredCalculators = useMemo(() => {
    if (!selectedCategory) return activeCalculators;
    // Convert selectedCategory to match capitalized category in config
    const categoryCapitalized = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    return activeCalculators.filter(calc => calc.category === categoryCapitalized);
  }, [selectedCategory, activeCalculators]);

  const handleNavigate = () => {
    onClose();
  };

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="All Calculators"
      maxHeight="90vh"
    >
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 -mx-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 z-10">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredCalculators.map((calc) => (
            <Link
              key={calc.id}
              href={calc.href}
              onClick={handleNavigate}
              className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                {calc.icon}
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                {calc.title.replace(' Calculator', '')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {calc.category}
              </p>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCalculators.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No calculators in this category
            </p>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          {filteredCalculators.length} calculator{filteredCalculators.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </MobileBottomSheet>
  );
}
