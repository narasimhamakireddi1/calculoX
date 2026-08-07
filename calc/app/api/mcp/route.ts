import { createMcpHandler } from 'mcp-handler';
import {
  EMIInputSchemaV4,
  SIPInputSchemaV4,
  BMIInputSchemaV4,
  IncomeTaxInputSchemaV4,
} from './schemas';
import {
  handleCalculateEmi,
  handleCalculateSip,
  handleCalculateBmi,
  handleCalculateIncomeTax,
} from './handlers';
import { uiMeta, registerUiResources } from './ui-resources';

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

    registerUiResources(server);
  },
  {
    serverInfo: { name: 'calculox', version: '1.0.0' },
  }
);

export { handler as GET, handler as POST };
