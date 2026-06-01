import Link from 'next/link';

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
}

const categoryColors: Record<string, { badge: string; border: string; text: string }> = {
  Finance: {
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    border: 'group-hover:border-blue-400 dark:group-hover:border-blue-500',
    text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
  },
  Health: {
    badge: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800',
    border: 'group-hover:border-pink-400 dark:group-hover:border-pink-500',
    text: 'group-hover:text-pink-600 dark:group-hover:text-pink-400'
  },
  Utility: {
    badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
    border: 'group-hover:border-orange-400 dark:group-hover:border-orange-500',
    text: 'group-hover:text-orange-600 dark:group-hover:text-orange-400'
  },
  Conversion: {
    badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    border: 'group-hover:border-purple-400 dark:group-hover:border-purple-500',
    text: 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
  }
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
    <Link href={href}>
      <div className={`card h-full flex flex-col group relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 ${colors.border}`}>
        {/* Start Now Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold py-2 px-6 rounded-lg transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            Start Now →
          </button>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            {icon}
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${colors.badge}`}>
            {category}
          </span>
        </div>
        <h3 className={`text-lg font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-300 flex-grow ${colors.text}`}>
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
        <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300 ${colors.text}`}>
          Explore →
        </div>
      </div>
    </Link>
  );
}
