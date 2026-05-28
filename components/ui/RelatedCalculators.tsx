'use client';

import Link from 'next/link';

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
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">🔗 Related Calculators</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{calc.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {calc.description}
                </p>
              </div>
              <span className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
