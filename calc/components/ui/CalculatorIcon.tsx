import type { LucideIcon } from 'lucide-react';
import {
  Repeat,
  Landmark,
  Scale,
  ReceiptText,
  Lock,
  PiggyBank,
  FileText,
  Calculator,
  Percent,
  TrendingUp,
  Target,
  Home,
  LineChart,
  FlaskConical,
} from 'lucide-react';
import { getCalculatorBySlug } from '@/config/calculators.config';

/**
 * Single source of truth for calculator icons.
 * Keyed by calculator `id` (see config/calculators.config.ts).
 * Lucide icons are monochrome and inherit `currentColor`, so they adapt to
 * light/dark automatically and can be tinted per-context.
 */
const ICONS: Record<string, LucideIcon> = {
  sip: Repeat,
  emi: Landmark,
  bmi: Scale,
  tax: ReceiptText,
  fd: Lock,
  rd: PiggyBank,
  'simple-interest': FileText,
  gst: Calculator,
  percentage: Percent,
  cagr: TrendingUp,
  retirement: Target,
  'home-loan-vs-rent': Home,
  'profit-margin': LineChart,
  scientific: FlaskConical,
};

/** Resolve a Lucide icon from a calculator id, slug, or href ("/fd-calculator"). */
export function getCalculatorIcon(idOrHrefOrSlug: string): LucideIcon | null {
  const key = idOrHrefOrSlug.startsWith('/')
    ? idOrHrefOrSlug.slice(1)
    : idOrHrefOrSlug;
  if (ICONS[key]) return ICONS[key];
  const calc = getCalculatorBySlug(key);
  return calc ? ICONS[calc.id] ?? null : null;
}

interface CalculatorIconProps {
  /** Calculator id ("fd"), slug ("fd-calculator"), or href ("/fd-calculator"). */
  idOrHref: string;
  className?: string;
  strokeWidth?: number;
}

export function CalculatorIcon({
  idOrHref,
  className,
  strokeWidth = 2,
}: CalculatorIconProps) {
  const Icon = getCalculatorIcon(idOrHref);
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
