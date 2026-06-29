'use client';

import { useMemo } from 'react';
import { getActiveCalculators } from '@/config/calculators.config';

export type CalculatorCategory = 'finance' | 'health' | 'utility' | 'conversion';

interface CategoryTabsProps {
  onCategoryChange: (category: CalculatorCategory | null) => void;
  selectedCategory: CalculatorCategory | null;
}

const baseConfig = {
  finance: {
    label: 'Finance',
    color: 'from-blue-600 to-blue-400',
    shadow: 'shadow-blue-600/25',
    description: 'Loans, Investments & Wealth'
  },
  health: {
    label: 'Health',
    color: 'from-rose-600 to-rose-400',
    shadow: 'shadow-rose-600/25',
    description: 'Body & Fitness'
  },
  utility: {
    label: 'Utility',
    color: 'from-violet-600 to-violet-400',
    shadow: 'shadow-violet-600/25',
    description: 'Percentage, Hike & More'
  },
  conversion: {
    label: 'Conversion',
    color: 'from-teal-600 to-teal-400',
    shadow: 'shadow-teal-600/25',
    description: 'Unit & Value Conversion'
  }
};

export function CategoryTabs({ onCategoryChange, selectedCategory }: CategoryTabsProps) {
  // Dynamically calculate category counts using useMemo
  const categoryConfig = useMemo(() => {
    const active = getActiveCalculators();
    const counts = {
      finance: active.filter(c => c.category === 'Finance').length,
      health: active.filter(c => c.category === 'Health').length,
      utility: active.filter(c => c.category === 'Utility').length,
      conversion: active.filter(c => c.category === 'Conversion').length,
    };

    return {
      finance: { ...baseConfig.finance, count: counts.finance },
      health: { ...baseConfig.health, count: counts.health },
      utility: { ...baseConfig.utility, count: counts.utility },
      conversion: { ...baseConfig.conversion, count: counts.conversion },
    };
  }, []);

  const handleTabClick = (category: CalculatorCategory) => {
    onCategoryChange(selectedCategory === category ? null : category);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {(Object.keys(categoryConfig) as CalculatorCategory[]).map((category) => {
        const config = categoryConfig[category];
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => handleTabClick(category)}
            className={`relative px-6 py-3 rounded-xl transition-all duration-300 transform group ${
              isSelected
                ? `bg-gradient-to-r ${config.color} text-white shadow-md ${config.shadow} -translate-y-0.5`
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/70 hover:-translate-y-0.5'
            }`}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="font-bold text-sm">{config.label}</span>
              <span className="text-xs opacity-75">{config.count} Calculators</span>
            </div>

            {/* Sliding underline for active state */}
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white via-white to-transparent rounded-full animate-slide-underline" />
            )}
          </button>
        );
      })}

      {/* Show All button */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-6 py-3 rounded-xl transition-all duration-300 transform ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md shadow-blue-600/25 -translate-y-0.5'
            : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/70 hover:-translate-y-0.5'
        }`}
      >
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-sm">All</span>
          <span className="text-xs opacity-75">14 Calculators</span>
        </div>
      </button>
    </div>
  );
}
