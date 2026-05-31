import Link from 'next/link';

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
}

export function CalculatorCard({
  title,
  description,
  href,
  icon,
  category,
}: CalculatorCardProps) {
  return (
    <Link href={href}>
      <div className="card h-full flex flex-col group">
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
            {category}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 flex-grow">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
          Explore →
        </div>
      </div>
    </Link>
  );
}
