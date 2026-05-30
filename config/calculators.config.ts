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
  keywords?: string[];
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
    keywords: ['sip', 'systematic investment plan', 'mutual fund', 'monthly investment', 'investment plan', 'monthly savings', 'rupee cost averaging', 'nav', 'net asset value', 'investment returns', 'wealth creation', 'long term investment', 'portfolio growth', 'step up sip'],
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
    keywords: ['emi', 'equated monthly installment', 'loan', 'home loan', 'car loan', 'vehicle loan', 'personal loan', 'monthly payment', 'loan calculator', 'installment', 'loan repayment', 'mortgage calculator', 'auto loan', 'vehicle finance', 'car finance', 'monthly installment', 'principal', 'interest', 'amortization schedule', 'loan tenure', 'rate of interest'],
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
    keywords: ['bmi', 'body mass index', 'weight', 'height', 'health calculator', 'fitness calculator', 'obesity', 'health status', 'ideal weight', 'weight category', 'health assessment', 'body measurement', 'fitness tracker', 'health check', 'weight management', 'body weight'],
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
    keywords: ['income tax', 'tax calculator', 'tax deduction', 'tax slab', 'tax bracket', 'hra', 'lta', 'house rent allowance', 'leave travel allowance', '80c', 'tax planning', 'tax refund', 'income tax return', 'itr', 'tax liability', 'new tax regime', 'old tax regime', 'standard deduction', 'taxable income', 'rebate 87a'],
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
    keywords: ['fd', 'fixed deposit', 'savings calculator', 'bank deposit', 'interest calculator', 'maturity amount', 'fixed income', 'deposit interest', 'savings', 'rbi', 'cumulative deposit', 'quarterly payout', 'monthly payout', 'interest on savings', 'bank savings', 'senior citizen fd'],
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
    keywords: ['rd', 'recurring deposit', 'monthly savings', 'recurring investment', 'savings plan', 'deposit', 'monthly contribution', 'maturity', 'investment savings', 'savings deposit', 'compound interest'],
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
    keywords: ['simple interest', 'si', 'interest rate', 'principal', 'loan interest', 'savings interest', 'interest calculation', 'principal amount', 'tenure', 'rate of interest', 'si calculator'],
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
    keywords: ['gst', 'goods and services tax', 'tax calculator', 'tax add', 'tax remove', 'cgst', 'sgst', 'igst', 'tax rate', 'gst rate', '5% gst', '12% gst', '18% gst', '28% gst', 'tax breakdown', 'inclusive tax', 'exclusive tax'],
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
    keywords: ['percentage', 'discount', 'markup', 'profit margin', 'percentage increase', 'percentage decrease', 'discount calculator', 'percentage change', 'hike', 'off', 'percent off', 'percentage of', 'calculate percentage'],
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
    keywords: ['cagr', 'compound annual growth rate', 'growth rate', 'investment returns', 'annualized return', 'investment calculator', 'roi', 'return on investment', 'investment growth', 'annualized growth'],
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
    keywords: ['retirement', 'retirement planning', 'retirement corpus', 'retirement calculator', 'retirement age', 'pension', 'post retirement', 'nism', '25x rule', 'retirement fund', 'retirement savings', 'financial independence', 'early retirement', 'retirement income'],
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
    keywords: ['home loan', 'rent', 'buy vs rent', 'property', 'real estate', 'home purchase', 'renting vs buying', 'property investment', 'buying decision', 'rent vs buy', 'housing', 'property cost', 'down payment', 'property value', 'home ownership', 'home affordability'],
  },
  {
    id: 'profit-margin',
    title: 'Profit Margin & Markup Calculator',
    description: 'Calculate profit margins, markups, and GST impact. 4 modes: Markup→Margin, Margin→Markup, Cost&Revenue, GST Analysis.',
    slug: 'profit-margin-calculator',
    icon: '💹',
    category: 'Finance',
    href: '/profit-margin-calculator',
    status: 'active',
    tags: ['finance', 'profit', 'markup', 'margin', 'business', 'gst'],
    keywords: ['profit margin', 'markup', 'profit', 'cost price', 'selling price', 'margin calculator', 'business calculator', 'pricing', 'gst impact', 'cost analysis', 'profit analysis', 'business finance', 'gross profit', 'net profit', 'margin percentage', 'markup percentage', 'retail pricing', 'mrp'],
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
    keywords: ['scientific calculator', 'complex numbers', 'matrix calculator', 'statistics calculator', 'math calculator', 'casio calculator', 'trigonometry', 'logarithm', 'sin cos tan', 'statistical analysis', 'data analysis', 'engineering calculator', 'advanced math'],
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
