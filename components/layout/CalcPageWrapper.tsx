import type { ReactNode } from 'react';
import Link from 'next/link';
import { AdUnit, AD_SLOTS } from '@/components/ui/AdUnit';

type Category = 'Finance' | 'Health' | 'Utility';

// Full class strings must be static so Tailwind JIT picks them up at build time.
const gradients: Record<Category, string> = {
  Finance:
    'from-blue-100/40 via-blue-50/20 to-transparent dark:from-blue-500/[0.10] dark:via-blue-950/[0.05] dark:to-transparent',
  Health:
    'from-rose-100/40 via-rose-50/20 to-transparent dark:from-rose-500/[0.10] dark:via-rose-950/[0.05] dark:to-transparent',
  Utility:
    'from-violet-100/40 via-violet-50/20 to-transparent dark:from-violet-500/[0.10] dark:via-violet-950/[0.05] dark:to-transparent',
};

interface CalcPageWrapperProps {
  category: Category;
  title: string;
  children: ReactNode;
}

export function CalcPageWrapper({ category, title, children }: CalcPageWrapperProps) {
  return (
    <div className="relative">
      {/* Category ambient gradient — fades into the neutral body background by ~320px */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b ${gradients[category]}`}
      />
      <nav aria-label="Breadcrumb" className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-1">
        <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="select-none">/</li>
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Calculators
            </Link>
          </li>
          <li aria-hidden="true" className="select-none">/</li>
          <li className="text-gray-900 dark:text-white font-medium" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>
      {children}
      {/* In-content ad: natural pause between the interactive widget and the static article below */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <AdUnit slot={AD_SLOTS.calcBelowResult} format="horizontal" />
      </div>
    </div>
  );
}
