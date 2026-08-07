/**
 * MCP Tools Configuration
 * Single source of truth for tool name/title/description, imported by both the MCP
 * server (app/api/mcp/route.ts) and the discoverability page (app/mcp/page.tsx) so the
 * two can never drift apart. Mirrors the config/calculators.config.ts pattern.
 */

export interface McpToolConfig {
  name: string;
  title: string;
  description: string;
  /** The calculator page this tool's numbers match, for the discoverability page's links. */
  href: string;
  /** True if this tool also has an MCP Apps visual widget (see app/api/mcp/ui-resources.ts). */
  hasWidget: boolean;
}

export const mcpTools: McpToolConfig[] = [
  {
    name: 'calculate_emi',
    title: 'EMI Calculator',
    description:
      'Calculate EMI (equated monthly instalment), total interest and total payable for a loan given principal, annual interest rate and tenure in years. Uses the same reducing-balance formula as calculox.in/emi-calculator.',
    href: '/emi-calculator',
    hasWidget: true,
  },
  {
    name: 'calculate_sip',
    title: 'SIP Calculator',
    description:
      'Project the future value of a monthly SIP (systematic investment plan) given monthly investment amount, expected annual return, tenure in years, and an optional annual step-up percentage. Uses the same calculation as calculox.in/sip-calculator.',
    href: '/sip-calculator',
    hasWidget: true,
  },
  {
    name: 'calculate_bmi',
    title: 'BMI Calculator',
    description:
      'Calculate Body Mass Index and weight category (underweight/normal/overweight/obese) from height and weight. Uses the same calculation as calculox.in/bmi-calculator.',
    href: '/bmi-calculator',
    hasWidget: true,
  },
  {
    name: 'calculate_income_tax',
    title: 'India Income Tax Calculator (FY 2025-26)',
    description:
      'Calculate Indian income tax liability for FY 2025-26 under both the old and new tax regimes, compare them, and recommend the better one, given salary details and itemized deductions (80C, 80D, HRA, home loan interest, etc.). Uses the same engine as calculox.in/tax-calculator. Fields you are unsure about can be set to 0.',
    href: '/tax-calculator',
    hasWidget: true,
  },
  {
    name: 'calculate_fd',
    title: 'Fixed Deposit (FD) Calculator',
    description:
      'Calculate FD maturity value and interest earned given principal, annual interest rate, tenure, payout type (cumulative/quarterly/monthly), and senior citizen status. Uses the same calculation as calculox.in/fd-calculator.',
    href: '/fd-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_rd',
    title: 'Recurring Deposit (RD) Calculator',
    description:
      'Calculate RD maturity value and interest earned given monthly deposit amount, annual interest rate, and tenure in months. Uses the same calculation as calculox.in/rd-calculator.',
    href: '/rd-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_gst',
    title: 'GST Calculator',
    description:
      'Add or remove GST (5/12/18/28%) from an amount and get the CGST/SGST/IGST breakdown. Uses the same calculation as calculox.in/gst-calculator.',
    href: '/gst-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_cagr',
    title: 'CAGR Calculator',
    description:
      'Calculate Compound Annual Growth Rate (CAGR) given a beginning value, ending value, and number of years. Uses the same calculation as calculox.in/cagr-calculator.',
    href: '/cagr-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_simple_interest',
    title: 'Simple Interest Calculator',
    description:
      'Calculate simple interest and total payable given principal, annual interest rate, and tenure (in years, months, or days). Uses the same calculation as calculox.in/simple-interest-calculator.',
    href: '/simple-interest-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_percentage',
    title: 'Percentage Calculator',
    description:
      'Six percentage calculation modes: percent-of, what-percent, percent-change, hike-discount, reverse-percent, and sequential (compound) percentage changes. Uses the same calculation as calculox.in/percentage-calculator.',
    href: '/percentage-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_profit_margin',
    title: 'Profit Margin Calculator',
    description:
      'Calculate selling price, GST, and profit margin/markup for a product given cost price and a target margin or markup percentage (or work backward from a known selling price). Uses the same calculation as calculox.in/profit-margin-calculator.',
    href: '/profit-margin-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_retirement_corpus',
    title: 'Retirement Corpus Calculator',
    description:
      'Calculate the retirement corpus required and the monthly SIP needed to reach it, using the NISM 4-step inflation-adjusted framework, given age, expenses, savings, and expected returns. Uses the same calculation as calculox.in/retirement-calculator.',
    href: '/retirement-calculator',
    hasWidget: false,
  },
  {
    name: 'calculate_home_loan_vs_rent',
    title: 'Home Loan vs Rent Calculator',
    description:
      'Compare buying a home (with a loan) against renting and investing the difference, given property price, loan terms, rent, and expected investment returns. Returns the recommended option, projected net worth for each, and the break-even year. Uses the same calculation as calculox.in/home-loan-vs-rent.',
    href: '/home-loan-vs-rent',
    hasWidget: false,
  },
  {
    name: 'calculate_expression',
    title: 'Scientific Calculator',
    description:
      'Evaluate a math expression: standard arithmetic, trigonometry (sin/cos/tan and inverses), logarithms, roots, and factorial via fact(n). Uses the same evaluator as calculox.in/scientific-calculator (expression-evaluation mode only — matrix, statistics, and multi-argument functions like nCr/nPr are not exposed here).',
    href: '/scientific-calculator',
    hasWidget: false,
  },
];

export function getMcpTool(name: string): McpToolConfig {
  const tool = mcpTools.find((t) => t.name === name);
  if (!tool) throw new Error(`Unknown MCP tool: ${name}`);
  return tool;
}
