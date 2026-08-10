'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { IndianRupee, Heart, Wrench, ArrowLeftRight } from 'lucide-react';
import { CalculatorCard } from "@/components/ui/CalculatorCard";
import { CategoryTabs, type CalculatorCategory } from "@/components/ui/CategoryTabs";

interface CalcEntry {
  title: string;
  description: string;
  href: string;
  category: string;
  sampleResult?: string;
}

const categoryConfig: Record<string, { label: string; Icon: LucideIcon }> = {
  finance:    { label: 'Finance',    Icon: IndianRupee },
  health:     { label: 'Health',     Icon: Heart },
  utility:    { label: 'Utility',    Icon: Wrench },
  conversion: { label: 'Conversion', Icon: ArrowLeftRight },
};

export function CalculatorGrid({ calculators }: { calculators: CalcEntry[] }) {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | null>(null);

  const filteredCalculators = selectedCategory
    ? calculators.filter(c => c.category.toLowerCase() === selectedCategory)
    : calculators;

  const groupedByCategory: Record<string, CalcEntry[]> = {};
  (selectedCategory ? filteredCalculators : calculators).forEach(calc => {
    const k = calc.category.toLowerCase();
    if (!groupedByCategory[k]) groupedByCategory[k] = [];
    groupedByCategory[k].push(calc);
  });

  return (
    <section className="space-y-8">
      <div className="space-y-2 mb-8">
        <p className="section-eyebrow">Explore</p>
        <h2 className="text-4xl font-bold">Popular Calculators</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {selectedCategory
            ? `Explore our ${categoryConfig[selectedCategory]?.label ?? selectedCategory} calculators`
            : 'Choose from our collection of powerful financial and health calculators'}
        </p>
      </div>

      <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      {selectedCategory ? (
        <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {filteredCalculators.map(calc => <CalculatorCard key={calc.href} {...calc} />)}
        </div>
      ) : (
        <div key="all" className="space-y-12 animate-fade-in">
          {Object.entries(groupedByCategory).map(([category, calcs]) => {
            const cfg = categoryConfig[category];
            const CategoryIcon = cfg?.Icon;
            return (
              <div key={category} className="space-y-4 relative">
                {category === 'finance' && (
                  <div className="absolute -inset-x-4 -top-4 h-28 bg-gradient-to-b from-blue-100/60 via-blue-50/30 to-transparent dark:from-blue-500/10 dark:via-blue-950/5 rounded-t-2xl pointer-events-none" aria-hidden="true" />
                )}
                <div className="relative flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                  <h3 className={`text-2xl font-bold flex items-center gap-2 ${
                    category === 'finance' ? 'text-blue-600 dark:text-blue-400' :
                    category === 'health'  ? 'text-rose-600 dark:text-rose-400' :
                    category === 'utility' ? 'text-violet-600 dark:text-violet-400' :
                    'text-teal-600 dark:text-teal-400'
                  }`}>
                    {CategoryIcon && <CategoryIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />}
                    {cfg?.label ?? category}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    category === 'finance' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    category === 'health'  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                    category === 'utility' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                  }`}>
                    {calcs.length} {calcs.length === 1 ? 'Calculator' : 'Calculators'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {calcs.map(calc => <CalculatorCard key={calc.href} {...calc} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
