import Link from 'next/link';

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
}

const categoryColors: Record<
  string,
  { badge: string; border: string; text: string; iconBg: string; accent: string }
> = {
  Finance: {
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    border: 'group-hover:border-blue-300 dark:group-hover:border-blue-600/70',
    text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900/60',
    accent: 'from-blue-500 to-blue-600',
  },
  Health: {
    badge: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800',
    border: 'group-hover:border-pink-300 dark:group-hover:border-pink-600/70',
    text: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
    iconBg: 'bg-pink-50 dark:bg-pink-950/40 ring-1 ring-pink-100 dark:ring-pink-900/60',
    accent: 'from-pink-500 to-rose-500',
  },
  Utility: {
    badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
    border: 'group-hover:border-orange-300 dark:group-hover:border-orange-600/70',
    text: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-950/40 ring-1 ring-orange-100 dark:ring-orange-900/60',
    accent: 'from-orange-500 to-amber-500',
  },
  Conversion: {
    badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    border: 'group-hover:border-purple-300 dark:group-hover:border-purple-600/70',
    text: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 ring-1 ring-purple-100 dark:ring-purple-900/60',
    accent: 'from-purple-500 to-indigo-500',
  },
};

export function CalculatorCard({
  title,
  description,
  href,
  icon,
  category,
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
            className={`flex items-center justify-center w-14 h-14 rounded-2xl text-3xl ${colors.iconBg} transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}
          >
            {icon}
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
