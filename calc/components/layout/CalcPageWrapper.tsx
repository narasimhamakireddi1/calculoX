import type { ReactNode } from 'react';
import Link from 'next/link';
import { CalculatorDisclaimer } from '@/components/ui/CalculatorDisclaimer';

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

// Single source of truth for the "content reviewed" date shown across all
// calculator pages. Update this when calculator content/formulas are re-audited.
const CONTENT_REVIEWED = { iso: '2026-07-17', label: 'July 2026' };

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
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-1">
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
          <span>Written &amp; reviewed by</span>
          <Link
            href="/author/narasimha-makireddi"
            className="font-medium text-gray-700 dark:text-gray-300 underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
          >
            Narasimha Makireddi
          </Link>
          <span aria-hidden="true">·</span>
          <span>
            Last reviewed{' '}
            <time dateTime={CONTENT_REVIEWED.iso} className="font-medium text-gray-700 dark:text-gray-300">
              {CONTENT_REVIEWED.label}
            </time>
          </span>
          <span aria-hidden="true">·</span>
          <Link
            href="/verification-methodology"
            className="underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
          >
            How we verify
          </Link>
        </p>
      </div>
      <CalculatorDisclaimer category={category} />
      {children}
    </div>
  );
}
