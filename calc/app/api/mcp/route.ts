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
import { getMcpTool } from '@/config/mcp-tools.config';

// Must run on Node, not Edge — @modelcontextprotocol/server is not guaranteed edge-safe,
// unlike the existing edge-runtime app/api/og/route.tsx.
export const runtime = 'nodejs';

const handler = createMcpHandler(
  (server) => {
    const emi = getMcpTool('calculate_emi');
    server.registerTool(
      emi.name,
      { title: emi.title, description: emi.description, inputSchema: EMIInputSchemaV4, _meta: uiMeta('ui://calculox/emi-calculator') },
      async (args) => handleCalculateEmi(args)
    );

    const sip = getMcpTool('calculate_sip');
    server.registerTool(
      sip.name,
      { title: sip.title, description: sip.description, inputSchema: SIPInputSchemaV4, _meta: uiMeta('ui://calculox/sip-calculator') },
      async (args) => handleCalculateSip(args)
    );

    const bmi = getMcpTool('calculate_bmi');
    server.registerTool(
      bmi.name,
      { title: bmi.title, description: bmi.description, inputSchema: BMIInputSchemaV4, _meta: uiMeta('ui://calculox/bmi-calculator') },
      async (args) => handleCalculateBmi(args)
    );

    const tax = getMcpTool('calculate_income_tax');
    server.registerTool(
      tax.name,
      { title: tax.title, description: tax.description, inputSchema: IncomeTaxInputSchemaV4, _meta: uiMeta('ui://calculox/tax-calculator') },
      async (args) => handleCalculateIncomeTax(args)
    );

    const fd = getMcpTool('calculate_fd');
    server.registerTool(
      fd.name,
      { title: fd.title, description: fd.description, inputSchema: FDInputSchemaV4 },
      async (args) => handleCalculateFd(args)
    );

    const rd = getMcpTool('calculate_rd');
    server.registerTool(
      rd.name,
      { title: rd.title, description: rd.description, inputSchema: RDInputSchemaV4 },
      async (args) => handleCalculateRd(args)
    );

    const gst = getMcpTool('calculate_gst');
    server.registerTool(
      gst.name,
      { title: gst.title, description: gst.description, inputSchema: GSTInputSchemaV4 },
      async (args) => handleCalculateGst(args)
    );

    const cagr = getMcpTool('calculate_cagr');
    server.registerTool(
      cagr.name,
      { title: cagr.title, description: cagr.description, inputSchema: CAGRInputSchemaV4 },
      async (args) => handleCalculateCagr(args)
    );

    const si = getMcpTool('calculate_simple_interest');
    server.registerTool(
      si.name,
      { title: si.title, description: si.description, inputSchema: SimpleInterestInputSchemaV4 },
      async (args) => handleCalculateSimpleInterest(args)
    );

    const pct = getMcpTool('calculate_percentage');
    server.registerTool(
      pct.name,
      { title: pct.title, description: pct.description, inputSchema: PercentageInputSchemaV4 },
      async (args) => handleCalculatePercentage(args)
    );

    const pm = getMcpTool('calculate_profit_margin');
    server.registerTool(
      pm.name,
      { title: pm.title, description: pm.description, inputSchema: ProfitMarginInputSchemaV4 },
      async (args) => handleCalculateProfitMargin(args)
    );

    const retirement = getMcpTool('calculate_retirement_corpus');
    server.registerTool(
      retirement.name,
      { title: retirement.title, description: retirement.description, inputSchema: RetirementInputSchemaV4 },
      async (args) => handleCalculateRetirement(args)
    );

    const hlvr = getMcpTool('calculate_home_loan_vs_rent');
    server.registerTool(
      hlvr.name,
      { title: hlvr.title, description: hlvr.description, inputSchema: BuyVsRentInputSchemaV4 },
      async (args) => handleCalculateHomeLoanVsRent(args)
    );

    const sci = getMcpTool('calculate_expression');
    server.registerTool(
      sci.name,
      { title: sci.title, description: sci.description, inputSchema: ScientificExpressionInputSchemaV4 },
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
