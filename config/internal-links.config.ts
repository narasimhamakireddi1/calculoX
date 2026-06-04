/**
 * Internal Linking Strategy for CalculoX
 *
 * Strategic cross-calculator linking based on:
 * 1. Financial/mathematical relationships
 * 2. User journey (what users need next)
 * 3. SEO impact (distributing page authority)
 * 4. Authority transfer (high-traffic to mid-traffic calculators)
 *
 * Expected impact: +1000-2000 monthly visitors from improved navigation & internal authority
 */

export interface InternalLink {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface CalculatorLinks {
  [key: string]: InternalLink[];
}

export const internalLinks: CalculatorLinks = {
  // EMI Calculator - Loan calculations hub
  'emi-calculator': [
    {
      title: 'Home Loan vs Rent',
      description: 'Compare buying vs renting with break-even analysis',
      icon: '🏠',
      href: '/home-loan-vs-rent',
    },
    {
      title: 'Simple Interest Calculator',
      description: 'Understand basic interest calculations on loans',
      icon: '📝',
      href: '/simple-interest-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'Plan retirement with loan payoff timeline',
      icon: '🎯',
      href: '/retirement-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Calculate interest rates and loan percentages',
      icon: '📈',
      href: '/percentage-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Invest the difference between rent and EMI',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'Account for loan interest tax deductions',
      icon: '📋',
      href: '/tax-calculator',
    },
  ],

  // SIP Calculator - Investment hub
  'sip-calculator': [
    {
      title: 'CAGR Calculator',
      description: 'Measure your SIP investment growth rate',
      icon: '🚀',
      href: '/cagr-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'Build retirement corpus through SIP',
      icon: '🎯',
      href: '/retirement-calculator',
    },
    {
      title: 'FD Calculator',
      description: 'Compare SIP vs Fixed Deposit returns',
      icon: '🔐',
      href: '/fd-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'Tax-efficient investing with 80C benefits',
      icon: '📋',
      href: '/tax-calculator',
    },
    {
      title: 'RD Calculator',
      description: 'Alternative: Recurring Deposits vs SIP',
      icon: '📊',
      href: '/rd-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Understand returns and percentage growth',
      icon: '📈',
      href: '/percentage-calculator',
    },
  ],

  // Tax Calculator - Tax planning hub
  'tax-calculator': [
    {
      title: 'SIP Calculator',
      description: 'Plan tax-efficient SIP investments (80C)',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'Tax planning for retirement income',
      icon: '🎯',
      href: '/retirement-calculator',
    },
    {
      title: 'Home Loan vs Rent',
      description: 'Section 24(b) interest deduction benefits',
      icon: '🏠',
      href: '/home-loan-vs-rent',
    },
    {
      title: 'Profit Margin Calculator',
      description: 'Business tax & GST impact on margins',
      icon: '💹',
      href: '/profit-margin-calculator',
    },
    {
      title: 'EMI Calculator',
      description: 'Loan interest deduction planning',
      icon: '🏦',
      href: '/emi-calculator',
    },
    {
      title: 'FD Calculator',
      description: 'TDS on Fixed Deposit interest income',
      icon: '🔐',
      href: '/fd-calculator',
    },
  ],

  // BMI Calculator - Health & general tools
  'bmi-calculator': [
    {
      title: 'Percentage Calculator',
      description: 'Body composition percentage calculations',
      icon: '📈',
      href: '/percentage-calculator',
    },
    {
      title: 'Scientific Calculator',
      description: 'Health & fitness calculations',
      icon: '🔬',
      href: '/scientific-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Save for fitness & wellness goals',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'EMI Calculator',
      description: 'Health insurance loan EMI',
      icon: '🏦',
      href: '/emi-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'Health insurance tax deductions (80D)',
      icon: '📋',
      href: '/tax-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'Health expenses in retirement planning',
      icon: '🎯',
      href: '/retirement-calculator',
    },
  ],

  // FD Calculator - Savings hub
  'fd-calculator': [
    {
      title: 'RD Calculator',
      description: 'Recurring deposit alternative to FD',
      icon: '📊',
      href: '/rd-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Higher returns with SIP vs FD',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'CAGR Calculator',
      description: 'Measure FD returns over time',
      icon: '🚀',
      href: '/cagr-calculator',
    },
    {
      title: 'Simple Interest Calculator',
      description: 'Understand FD interest calculations',
      icon: '📝',
      href: '/simple-interest-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'FD as retirement corpus source',
      icon: '🎯',
      href: '/retirement-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'TDS implications on FD interest',
      icon: '📋',
      href: '/tax-calculator',
    },
  ],

  // GST Calculator - Business tools
  'gst-calculator': [
    {
      title: 'Profit Margin Calculator',
      description: 'GST impact on product pricing & margins',
      icon: '💹',
      href: '/profit-margin-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Tax rate and percentage calculations',
      icon: '📈',
      href: '/percentage-calculator',
    },
    {
      title: 'Scientific Calculator',
      description: 'Business calculation needs',
      icon: '🔬',
      href: '/scientific-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'GST vs income tax filing',
      icon: '📋',
      href: '/tax-calculator',
    },
    {
      title: 'EMI Calculator',
      description: 'Business loan financing',
      icon: '🏦',
      href: '/emi-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Business owner investment planning',
      icon: '🔄',
      href: '/sip-calculator',
    },
  ],

  // RD Calculator - Savings hub
  'rd-calculator': [
    {
      title: 'FD Calculator',
      description: 'Fixed deposit comparison',
      icon: '🔐',
      href: '/fd-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Higher returns with mutual funds',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'Simple Interest Calculator',
      description: 'Understand RD interest calculations',
      icon: '📝',
      href: '/simple-interest-calculator',
    },
    {
      title: 'CAGR Calculator',
      description: 'Measure RD investment returns',
      icon: '🚀',
      href: '/cagr-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'RD as retirement savings source',
      icon: '🎯',
      href: '/retirement-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Interest rate calculations',
      icon: '📈',
      href: '/percentage-calculator',
    },
  ],

  // Simple Interest Calculator - Interest foundation
  'simple-interest-calculator': [
    {
      title: 'FD Calculator',
      description: 'Fixed deposit compound interest',
      icon: '🔐',
      href: '/fd-calculator',
    },
    {
      title: 'RD Calculator',
      description: 'Recurring deposit calculations',
      icon: '📊',
      href: '/rd-calculator',
    },
    {
      title: 'EMI Calculator',
      description: 'Loan interest vs simple interest',
      icon: '🏦',
      href: '/emi-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Interest rate percentages',
      icon: '📈',
      href: '/percentage-calculator',
    },
    {
      title: 'CAGR Calculator',
      description: 'Measuring investment growth',
      icon: '🚀',
      href: '/cagr-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Investment returns calculation',
      icon: '🔄',
      href: '/sip-calculator',
    },
  ],

  // CAGR Calculator - Growth measurement hub
  'cagr-calculator': [
    {
      title: 'SIP Calculator',
      description: 'Measure mutual fund SIP growth',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'FD Calculator',
      description: 'Measure fixed deposit returns',
      icon: '🔐',
      href: '/fd-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'Investment growth to retirement goal',
      icon: '🎯',
      href: '/retirement-calculator',
    },
    {
      title: 'Home Loan vs Rent',
      description: 'Property appreciation CAGR',
      icon: '🏠',
      href: '/home-loan-vs-rent',
    },
    {
      title: 'RD Calculator',
      description: 'Recurring deposit growth rate',
      icon: '📊',
      href: '/rd-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Growth percentage calculations',
      icon: '📈',
      href: '/percentage-calculator',
    },
  ],

  // Percentage Calculator - Utility hub
  'percentage-calculator': [
    {
      title: 'GST Calculator',
      description: 'Tax percentage calculations',
      icon: '🧮',
      href: '/gst-calculator',
    },
    {
      title: 'Profit Margin Calculator',
      description: 'Profit and margin percentages',
      icon: '💹',
      href: '/profit-margin-calculator',
    },
    {
      title: 'EMI Calculator',
      description: 'Interest rate percentages',
      icon: '🏦',
      href: '/emi-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'Tax slab percentages',
      icon: '📋',
      href: '/tax-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Return percentage calculations',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'Scientific Calculator',
      description: 'Advanced mathematical calculations',
      icon: '🔬',
      href: '/scientific-calculator',
    },
  ],

  // Home Loan vs Rent - Buying decision hub
  'home-loan-vs-rent': [
    {
      title: 'EMI Calculator',
      description: 'Calculate home loan monthly EMI',
      icon: '🏦',
      href: '/emi-calculator',
    },
    {
      title: 'Retirement Calculator',
      description: 'Long-term financial impact',
      icon: '🎯',
      href: '/retirement-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Affordability percentage calculations',
      icon: '📈',
      href: '/percentage-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Invest the difference wisely',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'Section 24(b) interest deductions',
      icon: '📋',
      href: '/tax-calculator',
    },
    {
      title: 'CAGR Calculator',
      description: 'Property appreciation measurement',
      icon: '🚀',
      href: '/cagr-calculator',
    },
  ],

  // Profit Margin Calculator - Business hub
  'profit-margin-calculator': [
    {
      title: 'GST Calculator',
      description: 'GST impact on product pricing',
      icon: '🧮',
      href: '/gst-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Profit margin percentages',
      icon: '📈',
      href: '/percentage-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'Business tax implications',
      icon: '📋',
      href: '/tax-calculator',
    },
    {
      title: 'Scientific Calculator',
      description: 'Advanced business calculations',
      icon: '🔬',
      href: '/scientific-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Business owner investment planning',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'EMI Calculator',
      description: 'Business loan financing',
      icon: '🏦',
      href: '/emi-calculator',
    },
  ],

  // Retirement Calculator - Life planning hub
  'retirement-calculator': [
    {
      title: 'SIP Calculator',
      description: 'Build retirement corpus via SIP',
      icon: '🔄',
      href: '/sip-calculator',
    },
    {
      title: 'FD Calculator',
      description: 'Fixed deposit retirement income',
      icon: '🔐',
      href: '/fd-calculator',
    },
    {
      title: 'Tax Calculator',
      description: 'Retirement income tax planning',
      icon: '📋',
      href: '/tax-calculator',
    },
    {
      title: 'Home Loan vs Rent',
      description: 'Retirement housing decision',
      icon: '🏠',
      href: '/home-loan-vs-rent',
    },
    {
      title: 'CAGR Calculator',
      description: 'Investment growth to goal',
      icon: '🚀',
      href: '/cagr-calculator',
    },
    {
      title: 'Percentage Calculator',
      description: 'Retirement planning percentages',
      icon: '📈',
      href: '/percentage-calculator',
    },
  ],

  // Scientific Calculator - Advanced calculations hub
  'scientific-calculator': [
    {
      title: 'Percentage Calculator',
      description: 'Advanced percentage operations',
      icon: '📈',
      href: '/percentage-calculator',
    },
    {
      title: 'BMI Calculator',
      description: 'Health and fitness calculations',
      icon: '💪',
      href: '/bmi-calculator',
    },
    {
      title: 'GST Calculator',
      description: 'Tax and business calculations',
      icon: '🧮',
      href: '/gst-calculator',
    },
    {
      title: 'Profit Margin Calculator',
      description: 'Business margin calculations',
      icon: '💹',
      href: '/profit-margin-calculator',
    },
    {
      title: 'CAGR Calculator',
      description: 'Investment growth calculations',
      icon: '🚀',
      href: '/cagr-calculator',
    },
    {
      title: 'SIP Calculator',
      description: 'Financial growth projections',
      icon: '🔄',
      href: '/sip-calculator',
    },
  ],
};

/**
 * Get internal links for a specific calculator
 * @param calculatorId - The calculator slug (e.g., 'emi-calculator')
 * @returns Array of related calculator links
 */
export function getInternalLinks(calculatorId: string): InternalLink[] {
  return internalLinks[calculatorId] || [];
}
