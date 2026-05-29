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

  // Phase 2: Batch 1 - Simple Formula Calculators (Coming Soon - Under Development)
  {
    id: 'fd',
    title: 'FD Calculator',
    description: 'Calculate Fixed Deposit maturity with RBI-compliant modes (Cumulative, Quarterly, Monthly payouts).',
    slug: 'fd-calculator',
    icon: '🏦',
    category: 'Finance',
    href: '/fd-calculator',
    status: 'active',
    tags: ['investment', 'finance', 'fixed-deposit'],
  },
  {
    id: 'rd',
    title: 'RD Calculator',
    description: 'Calculate Recurring Deposit maturity and interest.',
    slug: 'rd-calculator',
    icon: '💳',
    category: 'Finance',
    href: '/rd-calculator',
    status: 'active',
    tags: ['investment', 'finance', 'recurring-deposit'],
  },
  {
    id: 'simple-interest',
    title: 'Simple Interest Calculator',
    description: 'Calculate SI with Years, Months, or Days. Automatic leap year detection.',
    slug: 'simple-interest-calculator',
    icon: '📊',
    category: 'Finance',
    href: '/simple-interest-calculator',
    status: 'active',
    tags: ['finance', 'interest', 'investment'],
  },
  {
    id: 'gst',
    title: 'GST Calculator',
    description: 'Add or remove GST at 5%, 12%, 18%, or 28% rates.',
    slug: 'gst-calculator',
    icon: '🧮',
    category: 'Finance',
    href: '/gst-calculator',
    status: 'active',
    tags: ['tax', 'finance', 'india', 'gst'],
  },
  {
    id: 'percentage',
    title: 'Percentage Calculator',
    description: '6 calculation modes: Hike/Discount, X% of Y, What %, % Change, Reverse %, Sequential',
    slug: 'percentage-calculator',
    icon: '📈',
    category: 'Utility',
    href: '/percentage-calculator',
    status: 'active',
    tags: ['math', 'utility', 'calculation', 'percentage'],
  },
  {
    id: 'cagr',
    title: 'CAGR Calculator',
    description: 'Calculate Compound Annual Growth Rate for your investments.',
    slug: 'cagr-calculator',
    icon: '📊',
    category: 'Finance',
    href: '/cagr-calculator',
    status: 'active',
    tags: ['investment', 'finance', 'growth-rate'],
  },

  // Phase 2: Batch 2 - Multi-input Calculators (Coming Soon)
  {
    id: 'inflation',
    title: 'Inflation Calculator',
    description: 'Calculate the real value of money after accounting for inflation.',
    slug: 'inflation-calculator',
    icon: '💵',
    category: 'Finance',
    href: '/inflation-calculator',
    status: 'coming-soon',
    tags: ['finance', 'inflation', 'economics'],
  },
  {
    id: 'ppf',
    title: 'PPF Calculator',
    description: 'Calculate Public Provident Fund maturity over 15 years.',
    slug: 'ppf-calculator',
    icon: '🏛️',
    category: 'Finance',
    href: '/ppf-calculator',
    status: 'coming-soon',
    tags: ['investment', 'finance', 'retirement'],
  },
  {
    id: 'hra',
    title: 'HRA Calculator',
    description: 'Calculate House Rent Allowance exemption for income tax.',
    slug: 'hra-calculator',
    icon: '🏠',
    category: 'Finance',
    href: '/hra-calculator',
    status: 'coming-soon',
    tags: ['tax', 'finance', 'india'],
  },
  {
    id: 'loan-eligibility',
    title: 'Loan Eligibility Calculator',
    description: 'Calculate maximum loan you can get based on your income.',
    slug: 'loan-eligibility-calculator',
    icon: '💰',
    category: 'Finance',
    href: '/loan-eligibility-calculator',
    status: 'coming-soon',
    tags: ['loan', 'finance', 'eligibility'],
  },
  {
    id: 'retirement',
    title: 'Retirement Calculator',
    description: 'Calculate the corpus needed to retire comfortably using the 25x rule. Plan your retirement with inflation-adjusted expenses.',
    slug: 'retirement-calculator',
    icon: '🎯',
    category: 'Finance',
    href: '/retirement-calculator',
    status: 'active',
    tags: ['finance', 'retirement', 'planning', 'corpus'],
  },
  {
    id: 'home-loan-vs-rent',
    title: 'Home Loan vs Rent Calculator',
    description: 'Compare buying vs renting with EMI, cost analysis, and break-even point calculation.',
    slug: 'home-loan-vs-rent',
    icon: '🏠',
    category: 'Finance',
    href: '/home-loan-vs-rent',
    status: 'active',
    tags: ['finance', 'home-loan', 'real-estate', 'buying', 'renting'],
  },

  // Phase 2: Batch 3 - Utility Calculators (Coming Soon)
  {
    id: 'scientific',
    title: 'Scientific Calculator',
    description: 'Casio ClassWiz-style calculator with complex numbers, matrices, and statistics.',
    slug: 'scientific-calculator',
    icon: '🔬',
    category: 'Utility',
    href: '/scientific-calculator',
    status: 'active',
    tags: ['scientific', 'math', 'calculator', 'complex', 'matrix', 'statistics'],
  },
  {
    id: 'age',
    title: 'Age Calculator',
    description: 'Calculate exact age from date of birth in years, months, days.',
    slug: 'age-calculator',
    icon: '🎂',
    category: 'Utility',
    href: '/age-calculator',
    status: 'coming-soon',
    tags: ['utility', 'date', 'calculation'],
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, weight, temperature, and area units.',
    slug: 'unit-converter',
    icon: '⚖️',
    category: 'Conversion',
    href: '/unit-converter',
    status: 'coming-soon',
    tags: ['conversion', 'utility', 'measurement'],
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert Indian Rupees to USD, EUR, GBP and other currencies.',
    slug: 'currency-converter',
    icon: '💱',
    category: 'Conversion',
    href: '/currency-converter',
    status: 'coming-soon',
    tags: ['conversion', 'finance', 'currency'],
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
