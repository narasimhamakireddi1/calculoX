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
      <div className="card hover:shadow-xl cursor-pointer group h-full">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-sm text-primary-600 font-semibold mb-2">{category}</div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}
