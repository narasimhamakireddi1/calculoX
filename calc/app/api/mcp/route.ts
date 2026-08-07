import { createMcpHandler } from 'mcp-handler';
import {
  EMIInputSchemaV4,
  SIPInputSchemaV4,
  BMIInputSchemaV4,
  IncomeTaxInputSchemaV4,
  FDInputSchemaV4,
  RDInputSchemaV4,
  GSTInputSchemaV4,
  CAGRInputSchemaV4,
  SimpleInterestInputSchemaV4,
  PercentageInputSchemaV4,
  ProfitMarginInputSchemaV4,
  RetirementInputSchemaV4,
  BuyVsRentInputSchemaV4,
  ScientificExpressionInputSchemaV4,
} from './schemas';
import {
  handleCalculateEmi,
  handleCalculateSip,
  handleCalculateBmi,
  handleCalculateIncomeTax,
  handleCalculateFd,
  handleCalculateRd,
  handleCalculateGst,
  handleCalculateCagr,
  handleCalculateSimpleInterest,
  handleCalculatePercentage,
  handleCalculateProfitMargin,
  handleCalculateRetirement,
  handleCalculateHomeLoanVsRent,
  handleCalculateExpression,
} from './handlers';
import { uiMeta, registerUiResources } from './ui-resources';
import { registerBlogResources } from './blog-resources';

// Must run on Node, not Edge — @modelcontextprotocol/server is not guaranteed edge-safe,
// unlike the existing edge-runtime app/api/og/route.tsx.
export const runtime = 'nodejs';

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'calculate_emi',
      {
        title: 'EMI Calculator',
        description:
          'Calculate EMI (equated monthly instalment), total interest and total payable for a loan given principal, annual interest rate and tenure in years. Uses the same reducing-balance formula as calculox.in/emi-calculator.',
        inputSchema: EMIInputSchemaV4,
        _meta: uiMeta('ui://calculox/emi-calculator'),
      },
      async (args) => handleCalculateEmi(args)
    );

    server.registerTool(
      'calculate_sip',
      {
        title: 'SIP Calculator',
        description:
          'Project the future value of a monthly SIP (systematic investment plan) given monthly investment amount, expected annual return, tenure in years, and an optional annual step-up percentage. Uses the same calculation as calculox.in/sip-calculator.',
        inputSchema: SIPInputSchemaV4,
        _meta: uiMeta('ui://calculox/sip-calculator'),
      },
      async (args) => handleCalculateSip(args)
    );

    server.registerTool(
      'calculate_bmi',
      {
        title: 'BMI Calculator',
        description:
          'Calculate Body Mass Index and weight category (underweight/normal/overweight/obese) from height and weight. Uses the same calculation as calculox.in/bmi-calculator.',
        inputSchema: BMIInputSchemaV4,
        _meta: uiMeta('ui://calculox/bmi-calculator'),
      },
      async (args) => handleCalculateBmi(args)
    );

    server.registerTool(
      'calculate_income_tax',
      {
        title: 'India Income Tax Calculator (FY 2025-26)',
        description:
          'Calculate Indian income tax liability for FY 2025-26 under both the old and new tax regimes, compare them, and recommend the better one, given salary details and itemized deductions (80C, 80D, HRA, home loan interest, etc.). Uses the same engine as calculox.in/tax-calculator. Fields you are unsure about can be set to 0.',
        inputSchema: IncomeTaxInputSchemaV4,
        _meta: uiMeta('ui://calculox/tax-calculator'),
      },
      async (args) => handleCalculateIncomeTax(args)
    );

    server.registerTool(
      'calculate_fd',
      {
        title: 'Fixed Deposit (FD) Calculator',
        description:
          'Calculate FD maturity value and interest earned given principal, annual interest rate, tenure, payout type (cumulative/quarterly/monthly), and senior citizen status. Uses the same calculation as calculox.in/fd-calculator.',
        inputSchema: FDInputSchemaV4,
      },
      async (args) => handleCalculateFd(args)
    );

    server.registerTool(
      'calculate_rd',
      {
        title: 'Recurring Deposit (RD) Calculator',
        description:
          'Calculate RD maturity value and interest earned given monthly deposit amount, annual interest rate, and tenure in months. Uses the same calculation as calculox.in/rd-calculator.',
        inputSchema: RDInputSchemaV4,
      },
      async (args) => handleCalculateRd(args)
    );

    server.registerTool(
      'calculate_gst',
      {
        title: 'GST Calculator',
        description:
          'Add or remove GST (5/12/18/28%) from an amount and get the CGST/SGST/IGST breakdown. Uses the same calculation as calculox.in/gst-calculator.',
        inputSchema: GSTInputSchemaV4,
      },
      async (args) => handleCalculateGst(args)
    );

    server.registerTool(
      'calculate_cagr',
      {
        title: 'CAGR Calculator',
        description:
          'Calculate Compound Annual Growth Rate (CAGR) given a beginning value, ending value, and number of years. Uses the same calculation as calculox.in/cagr-calculator.',
        inputSchema: CAGRInputSchemaV4,
      },
      async (args) => handleCalculateCagr(args)
    );

    server.registerTool(
      'calculate_simple_interest',
      {
        title: 'Simple Interest Calculator',
        description:
          'Calculate simple interest and total payable given principal, annual interest rate, and tenure (in years, months, or days). Uses the same calculation as calculox.in/simple-interest-calculator.',
        inputSchema: SimpleInterestInputSchemaV4,
      },
      async (args) => handleCalculateSimpleInterest(args)
    );

    server.registerTool(
      'calculate_percentage',
      {
        title: 'Percentage Calculator',
        description:
          'Six percentage calculation modes: percent-of, what-percent, percent-change, hike-discount, reverse-percent, and sequential (compound) percentage changes. Uses the same calculation as calculox.in/percentage-calculator.',
        inputSchema: PercentageInputSchemaV4,
      },
      async (args) => handleCalculatePercentage(args)
    );

    server.registerTool(
      'calculate_profit_margin',
      {
        title: 'Profit Margin Calculator',
        description:
          'Calculate selling price, GST, and profit margin/markup for a product given cost price and a target margin or markup percentage (or work backward from a known selling price). Uses the same calculation as calculox.in/profit-margin-calculator.',
        inputSchema: ProfitMarginInputSchemaV4,
      },
      async (args) => handleCalculateProfitMargin(args)
    );

    server.registerTool(
      'calculate_retirement_corpus',
      {
        title: 'Retirement Corpus Calculator',
        description:
          'Calculate the retirement corpus required and the monthly SIP needed to reach it, using the NISM 4-step inflation-adjusted framework, given age, expenses, savings, and expected returns. Uses the same calculation as calculox.in/retirement-calculator.',
        inputSchema: RetirementInputSchemaV4,
      },
      async (args) => handleCalculateRetirement(args)
    );

    server.registerTool(
      'calculate_home_loan_vs_rent',
      {
        title: 'Home Loan vs Rent Calculator',
        description:
          'Compare buying a home (with a loan) against renting and investing the difference, given property price, loan terms, rent, and expected investment returns. Returns the recommended option, projected net worth for each, and the break-even year. Uses the same calculation as calculox.in/home-loan-vs-rent.',
        inputSchema: BuyVsRentInputSchemaV4,
      },
      async (args) => handleCalculateHomeLoanVsRent(args)
    );

    server.registerTool(
      'calculate_expression',
      {
        title: 'Scientific Calculator',
        description:
          'Evaluate a math expression: standard arithmetic, trigonometry (sin/cos/tan and inverses), logarithms, roots, and factorial via fact(n). Uses the same evaluator as calculox.in/scientific-calculator (expression-evaluation mode only — matrix, statistics, and multi-argument functions like nCr/nPr are not exposed here; see the input schema description for why).',
        inputSchema: ScientificExpressionInputSchemaV4,
      },
      async (args) => handleCalculateExpression(args)
    );

    registerUiResources(server);
    registerBlogResources(server);
  },
  {
    serverInfo: { name: 'calculox', version: '1.0.0' },
  }
);

export { handler as GET, handler as POST };
