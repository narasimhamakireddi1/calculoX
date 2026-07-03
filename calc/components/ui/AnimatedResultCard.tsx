'use client';

import { ReactNode } from 'react';
import { useAnimatedNumber } from '@/lib/hooks/useAnimatedNumber';
import { formatCurrency } from '@/lib/utils/format';
import { LucideIcon } from 'lucide-react';

interface AnimatedResultCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  format?: 'currency' | 'number' | 'percentage';
  gradient?: string;
  borderColor?: string;
  textColor?: string;
  bgColor?: string;
  isPrimary?: boolean;
  subLabel?: string;
  children?: ReactNode;
}

export function AnimatedResultCard({
  label,
  value,
  icon: Icon,
  format = 'currency',
  gradient = 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
  borderColor = 'border-blue-300 dark:border-blue-700',
  textColor = 'text-blue-700 dark:text-blue-400',
  bgColor = 'bg-gradient-to-br',
  isPrimary = false,
  subLabel,
  children,
}: AnimatedResultCardProps) {
  const animatedValue = useAnimatedNumber(value, isPrimary ? 800 : 600);

  const formatValue = (num: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(num);
      case 'percentage':
        return `${num.toFixed(1)}%`;
      case 'number':
      default:
        return num.toLocaleString('en-IN');
    }
  };

  if (isPrimary) {
    return (
      <div className={`${bgColor} ${gradient} p-6 sm:p-8 rounded-xl border-2 ${borderColor} shadow-lg
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02] result-card-primary animate-scale-in`}
      >
        <p className={`${textColor} text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5`}>
          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />}
          {label}
        </p>
        <p className={`text-[clamp(1.5rem,7.5vw,3.75rem)] font-black ${textColor} whitespace-nowrap leading-tight
          transition-transform duration-300 number-flip`}
        >
          {formatValue(animatedValue)}
        </p>
        {subLabel && <p className={`text-xs ${textColor} mt-2 font-medium`}>{subLabel}</p>}
        {children}
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${gradient} p-3 sm:p-4 rounded-lg border ${borderColor} shadow-sm
      min-w-0 transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-default`}
    >
      <p className={`${textColor} text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-0.5`}>
        {Icon && <Icon className="w-3 h-3 flex-shrink-0" strokeWidth={2} aria-hidden="true" />}
        {label}
      </p>
      <p className={`text-sm sm:text-lg font-bold ${textColor} whitespace-nowrap`}>
        {formatValue(animatedValue)}
      </p>
      {children}
    </div>
  );
}
