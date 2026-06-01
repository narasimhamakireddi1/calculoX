'use client';

export type CalculatorCategory = 'finance' | 'health' | 'business' | 'advanced';

interface CategoryTabsProps {
  onCategoryChange: (category: CalculatorCategory | null) => void;
  selectedCategory: CalculatorCategory | null;
}

const categoryConfig = {
  finance: {
    label: 'Finance',
    color: 'from-blue-600 to-blue-400',
    count: 7,
    description: 'Loans, Investments & Wealth'
  },
  health: {
    label: 'Health',
    color: 'from-pink-600 to-rose-400',
    count: 1,
    description: 'Body & Fitness'
  },
  business: {
    label: 'Business',
    color: 'from-orange-600 to-amber-400',
    count: 3,
    description: 'Taxes, Margins & Pricing'
  },
  advanced: {
    label: 'Advanced',
    color: 'from-purple-600 to-indigo-400',
    count: 3,
    description: 'Complex Calculations'
  }
};

export function CategoryTabs({ onCategoryChange, selectedCategory }: CategoryTabsProps) {
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
            className={`relative px-6 py-3 rounded-xl transition-all duration-300 group ${
              isSelected
                ? `bg-gradient-to-r ${config.color} text-white shadow-lg shadow-blue-500/30 scale-105`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
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
        className={`px-6 py-3 rounded-xl transition-all duration-300 ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-green-600 to-emerald-400 text-white shadow-lg shadow-green-500/30 scale-105'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500'
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
