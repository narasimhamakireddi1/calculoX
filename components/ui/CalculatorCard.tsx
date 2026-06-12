import Link from 'next/link';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  category: string;
  sampleResult?: string;
}

const categoryColors: Record<
  string,
  { badge: string; border: string; text: string; iconBg: string; iconColor: string; accent: string }
> = {
  Finance: {
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    border: 'group-hover:border-blue-300 dark:group-hover:border-blue-600/70',
    text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    accent: 'from-blue-500 to-blue-600',
  },
  Health: {
    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    border: 'group-hover:border-rose-300 dark:group-hover:border-rose-600/70',
    text: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-100 dark:ring-rose-900/60',
    iconColor: 'text-rose-600 dark:text-rose-400',
    accent: 'from-rose-500 to-rose-400',
  },
  Utility: {
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800',
    border: 'group-hover:border-violet-300 dark:group-hover:border-violet-600/70',
    text: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-100 dark:ring-violet-900/60',
    iconColor: 'text-violet-600 dark:text-violet-400',
    accent: 'from-violet-500 to-violet-400',
  },
  Conversion: {
    badge: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
    border: 'group-hover:border-teal-300 dark:group-hover:border-teal-600/70',
    text: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-100 dark:ring-teal-900/60',
    iconColor: 'text-teal-600 dark:text-teal-400',
    accent: 'from-teal-500 to-teal-400',
  },
};

export function CalculatorCard({
  title,
  description,
  href,
  category,
  sampleResult,
}: CalculatorCardProps) {
  const colors = categoryColors[category] || categoryColors['Finance'];

  return (
    <Link href={href} className="block h-full">
      <div
        className={`card h-full flex flex-col group relative overflow-hidden border border-gray-200/70 dark:border-gray-800 transition-all duration-300 ${colors.border}`}
      >
        {/* Subtle category accent bar that grows on hover */}
        <span
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors.accent} scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300`}
        />

        <div className="flex items-start justify-between mb-4">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl ${colors.iconBg} transition-transform duration-300 group-hover:scale-105`}
          >
            <CalculatorIcon idOrHref={href} className={`w-7 h-7 ${colors.iconColor}`} />
          </div>
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${colors.badge}`}
          >
            {category}
          </span>
        </div>

        <h3
          className={`text-lg font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-300 ${colors.text}`}
        >
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
          {description}
        </p>
        {sampleResult && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700/50 font-mono text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            {sampleResult}
          </div>
        )}
        <div
          className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/80 font-semibold text-sm inline-flex items-center gap-1.5 ${colors.text}`}
        >
          Explore
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
