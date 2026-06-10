'use client';

import Link from 'next/link';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';

interface RelatedCalculator {
  title: string;
  description: string;
  icon: string;
  href: string;
}

interface RelatedCalculatorsProps {
  calculators: RelatedCalculator[];
}

export function RelatedCalculators({ calculators }: RelatedCalculatorsProps) {
  return (
    <nav aria-label="Related calculators" className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="flex items-center gap-3 mb-8">
        <span aria-hidden="true" className="text-3xl">🔗</span>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Related Calculators</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Explore complementary tools to enhance your calculations</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-105 transform"
          >
            <div className="flex items-start gap-3 h-full">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <CalculatorIcon idOrHref={calc.href} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </span>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    {calc.description}
                  </p>
                </div>
              </div>
              <span aria-hidden="true" className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 flex-shrink-0 text-lg group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
