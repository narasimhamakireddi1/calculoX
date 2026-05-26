/**
 * Calculators Configuration
 * Metadata and routing for all calculators
 */

export interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  category: 'Finance' | 'Health' | 'Conversion' | 'Utility';
  href: string;
  status: 'active' | 'coming-soon' | 'beta';
  tags: string[];
}

export const calculators: CalculatorConfig[] = [
  // Phase 1: MVP
  {
    id: 'sip',
    title: 'SIP Calculator',
    description: 'Calculate your Systematic Investment Plan returns and projected wealth.',
    slug: 'sip-calculator',
    icon: '📊',
    category: 'Finance',
    href: '/sip-calculator',
    status: 'active',
    tags: ['investment', 'finance', 'mutual-fund'],
  },
  {
    id: 'emi',
    title: 'EMI Calculator',
    description: 'Calculate your loan EMI, total interest, and amortization schedule.',
    slug: 'emi-calculator',
    icon: '🏦',
    category: 'Finance',
    href: '/emi-calculator',
    status: 'active',
    tags: ['loan', 'finance', 'mortgage'],
  },
  {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and check your health status.',
    slug: 'bmi-calculator',
    icon: '⚖️',
    category: 'Health',
    href: '/bmi-calculator',
    status: 'active',
    tags: ['health', 'fitness', 'wellness'],
  },
  {
    id: 'tax',
    title: 'Income Tax Calculator',
    description: 'Calculate your income tax liability and tax deductions.',
    slug: 'tax-calculator',
    icon: '💰',
    category: 'Finance',
    href: '/tax-calculator',
    status: 'active',
    tags: ['tax', 'finance', 'india'],
  },

  // Phase 2: Additional Calculators (Coming Soon)
  {
    id: 'fd',
    title: 'FD Calculator',
    description: 'Calculate Fixed Deposit returns.',
    slug: 'fd-calculator',
    icon: '🏦',
    category: 'Finance',
    href: '/fd-calculator',
    status: 'coming-soon',
    tags: ['investment', 'finance'],
  },
  {
    id: 'gst',
    title: 'GST Calculator',
    description: 'Calculate GST and net amounts.',
    slug: 'gst-calculator',
    icon: '🧮',
    category: 'Finance',
    href: '/gst-calculator',
    status: 'coming-soon',
    tags: ['tax', 'finance', 'india'],
  },
];

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return calculators.find((calc) => calc.slug === slug);
}

export function getCalculatorsByCategory(category: CalculatorConfig['category']): CalculatorConfig[] {
  return calculators.filter((calc) => calc.category === category);
}

export function getActiveCalculators(): CalculatorConfig[] {
  return calculators.filter((calc) => calc.status === 'active');
}
