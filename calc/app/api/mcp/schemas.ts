// mcp-handler's registerTool requires a schema implementing the full Standard Schema
// "WithJSON" interface (~standard.validate + ~standard.jsonSchema) so it can advertise
// the tool's argument shape in tools/list. The app's root `zod` is v3, which only
// implements the validate half — JSON Schema conversion via ~standard was added in v4.
// So these schemas exist purely for MCP protocol advertisement/parsing, using the
// `zod4` package alias (installed as `npm:zod@^4`, scoped to this directory only).
//
// The actual authoritative validation (the real business-rule bounds, e.g. the ₹1.5
// crore EMI cap) still happens in handlers.ts via the real v3 schemas in
// `lib/validators/index.ts` — these v4 schemas mirror the same fields/bounds so the
// tool description the calling model sees is accurate, but lib/validators remains the
// single source of truth for enforcement.
import { z } from 'zod4';

export const EMIInputSchemaV4 = z.object({
  principal: z.number().positive().max(15000000).describe('Loan principal amount in INR (max ₹1.5 crore)'),
  annualRate: z.number().min(0).max(50).describe('Annual interest rate as a percentage, e.g. 8.5'),
  years: z.number().int().min(1).max(50).describe('Loan tenure in years'),
});

export const SIPInputSchemaV4 = z.object({
  monthlyInvestment: z.number().positive().max(100000000).describe('Monthly SIP investment amount in INR'),
  years: z.number().int().min(1).max(50).describe('Investment tenure in years'),
  annualReturn: z.number().min(0).max(100).describe('Expected annual return percentage, e.g. 12'),
  stepUpPercent: z.number().min(0).max(50).optional().describe('Optional annual step-up percentage (default 0)'),
});

export const BMIInputSchemaV4 = z.object({
  weight: z.number().positive().max(1102).describe('Weight in kilograms'),
  height: z.number().positive().max(300).describe('Height in centimeters'),
});

export const FDInputSchemaV4 = z.object({
  principal: z.number().positive().max(100000000).describe('FD principal amount in INR'),
  annualRate: z.number().min(0).max(20).describe('Annual interest rate as a percentage'),
  years: z.number().int().min(0).max(30).describe('Tenure — whole years'),
  months: z.number().int().min(0).max(11).optional().describe('Tenure — additional months (default 0)'),
  days: z.number().int().min(0).max(31).optional().describe('Tenure — additional days (default 0)'),
  payoutType: z.enum(['cumulative', 'quarterly', 'monthly']).optional().describe('Interest payout mode (default cumulative)'),
  seniorCitizen: z.boolean().optional().describe('Senior citizen rate bonus (default false)'),
});

export const RDInputSchemaV4 = z.object({
  monthlyDeposit: z.number().positive().max(10000000).describe('Monthly RD deposit amount in INR'),
  annualRate: z.number().min(0).max(20).describe('Annual interest rate as a percentage'),
  months: z.number().int().min(1).max(600).describe('Tenure in months'),
});

export const GSTInputSchemaV4 = z.object({
  amount: z.number().positive().max(100000000).describe('Amount in INR'),
  gstRate: z.enum(['5', '12', '18', '28']).describe('GST rate percentage'),
  calculationType: z.enum(['add', 'remove']).describe("'add' to add GST on top, 'remove' to extract GST from an inclusive amount"),
});

export const CAGRInputSchemaV4 = z.object({
  beginningValue: z.number().positive().describe('Initial investment value in INR'),
  endingValue: z.number().positive().describe('Final investment value in INR'),
  years: z.number().int().min(1).max(100).describe('Number of years'),
});

export const SimpleInterestInputSchemaV4 = z.object({
  principal: z.number().positive().max(100000000).describe('Principal amount in INR'),
  annualRate: z.number().min(0).max(50).describe('Annual interest rate as a percentage'),
  tenureValue: z.number().positive().describe('Tenure duration (interpreted per tenureType)'),
  tenureType: z.enum(['years', 'months', 'days']).describe('Unit for tenureValue'),
});

export const PercentageInputSchemaV4 = z.object({
  valueA: z.number().describe('First value (meaning depends on calculationType)'),
  valueB: z.number().describe('Second value (meaning depends on calculationType)'),
  percentC: z.number().optional().describe('Percentage value, used by hike-discount and sequential modes (default 0)'),
  hikeDirection: z.enum(['hike', 'discount']).optional().describe("Direction for 'hike-discount' mode (default hike)"),
  calculationType: z
    .enum(['percent-of', 'what-percent', 'percent-change', 'hike-discount', 'reverse-percent', 'sequential'])
    .describe(
      "'percent-of': valueA% of valueB. 'what-percent': valueA as a % of valueB. 'percent-change': % change from valueA to valueB. 'hike-discount': apply percentC as hike/discount to valueA. 'reverse-percent': find original value before a percentC change. 'sequential': apply valueB% then percentC% sequentially to valueA."
    ),
});

export const ProfitMarginInputSchemaV4 = z.object({
  costPrice: z.number().positive().max(100000).describe('Cost price per unit in INR'),
  sellingPrice: z.number().nonnegative().max(100000).optional().describe('Selling price in INR (required when calculationBasis is SELLING_PRICE_DRIVEN)'),
  targetMarginPct: z.number().min(0).max(99).optional().describe('Target profit margin percentage (COST_DRIVEN + margin mode)'),
  targetMarkupPct: z.number().min(0).max(300).optional().describe('Target markup percentage (COST_DRIVEN + markup mode)'),
  gstRatePct: z.number().min(0).max(28).optional().describe('GST rate percentage (default 18)'),
  calculationBasis: z.enum(['COST_DRIVEN', 'SELLING_PRICE_DRIVEN']).optional().describe('Whether to compute forward from cost or backward from selling price (default COST_DRIVEN)'),
  gstTreatment: z.enum(['EXCLUSIVE', 'INCLUSIVE']).optional().describe('Whether GST is added on top or already included (default EXCLUSIVE)'),
  marginOrMarkup: z.enum(['margin', 'markup']).optional().describe('Which target field to use in COST_DRIVEN mode (default margin)'),
});

export const RetirementInputSchemaV4 = z.object({
  present_age: z.number().min(18).max(75).describe('Current age in years'),
  retirement_age: z.number().min(25).max(100).describe('Planned retirement age in years'),
  life_expectancy: z.number().min(30).max(120).describe('Life expectancy in years'),
  present_monthly_expenses: z.number().min(5000).describe('Current monthly expenses in INR'),
  expense_reduction_pct: z.number().min(0).max(50).describe('Expected reduction in expenses after retirement, percentage'),
  long_term_inflation_pct: z.number().min(0).max(15).describe('Assumed long-term annual inflation percentage'),
  current_savings: z.number().min(0).describe('Current retirement savings in INR'),
  lump_sum_benefits: z.number().min(0).describe('Expected lump-sum retirement benefits (gratuity, PF, etc.) in INR'),
  pre_retirement_return_pct: z.number().min(4).max(25).describe('Expected annual investment return before retirement, percentage'),
  post_retirement_return_pct: z.number().min(2).max(15).describe('Expected annual investment return after retirement, percentage'),
});

export const BuyVsRentInputSchemaV4 = z.object({
  property_value: z.number().min(100000).max(100000000).describe('Property purchase price in INR'),
  down_payment_pct: z.number().min(5).max(100).describe('Down payment as a percentage of property value'),
  loan_interest_rate_pct: z.number().min(2).max(15).describe('Home loan annual interest rate percentage'),
  loan_tenure_years: z.number().min(1).max(40).describe('Home loan tenure in years'),
  property_growth_rate_pct: z.number().min(-5).max(15).describe('Expected annual property value appreciation percentage'),
  annual_maintenance_pct: z.number().min(0).max(3).describe('Annual maintenance cost as a percentage of property value'),
  initial_monthly_rent: z.number().min(1000).max(500000).describe('Current monthly rent for an equivalent property in INR'),
  annual_rent_increase_pct: z.number().min(0).max(15).describe('Expected annual rent increase percentage'),
  opportunity_return_pct: z.number().min(0).max(30).describe('Expected annual return if the down payment/savings were invested instead'),
  inflation_rate_pct: z.number().min(0).max(15).describe('Assumed annual inflation percentage'),
  projection_tenure_years: z.number().min(1).max(40).describe('Number of years to project the comparison over'),
  apply_tax_benefit: z.boolean().optional().describe('Whether to apply Section 24(b) home loan interest tax deduction (default false)'),
  income_tax_rate_pct: z.number().min(0).max(45).optional().describe('Income tax slab rate percentage, used only if apply_tax_benefit is true'),
});

export const ScientificExpressionInputSchemaV4 = z.object({
  expression: z
    .string()
    .min(1)
    .max(200)
    .describe(
      'Math expression to evaluate, e.g. "45*(12+3)^2", "sin(30)+sqrt(16)", "fact(5)". ' +
        'Use fact(n), not the "n!" postfix form (postfix "!" is parsed but silently ignored ' +
        'by the underlying engine as of this writing). Multi-argument functions like nCr/nPr ' +
        'are not usable through this expression form — the parser does not support ' +
        'comma-separated function arguments.'
    ),
  angleUnit: z.enum(['DEG', 'RAD']).optional().describe('Angle unit for trig functions (default DEG)'),
});

export const IncomeTaxInputSchemaV4 = z.object({
  age: z.enum(['below60', 'between60to80', 'above80']).describe('Age bracket'),
  residentialStatus: z.enum(['resident', 'nri']).describe('Residential status'),
  employerType: z.enum(['government', 'private']).describe('Employer type'),

  grossSalary: z.number().nonnegative().describe('Total annual gross salary / CTC in INR'),
  basicSalary: z.number().nonnegative().describe('Basic salary component in INR (for HRA calculation)'),
  hraReceived: z.number().nonnegative().describe('HRA received from employer in INR'),
  rentPaid: z.number().nonnegative().describe('Annual rent paid in INR (for HRA exemption)'),
  cityType: z.enum(['metro', 'non-metro']).describe('Metro cities: Mumbai, Delhi, Kolkata, Chennai'),
  lta: z.number().nonnegative().describe('Leave Travel Allowance claimed in INR'),
  epfEmployee: z.number().nonnegative().describe('Employee EPF contribution in INR (counts toward 80C)'),

  incomeHouseProperty: z.number().nonnegative().optional().describe('Net rental income in INR (default 0)'),
  incomeOtherSources: z.number().nonnegative().optional().describe('FD interest, other income in INR (default 0)'),
  npsEmployerContribution: z.number().nonnegative().optional().describe('Employer NPS contribution in INR, 80CCD(2) (default 0)'),

  epf: z.number().nonnegative().describe('Employee Provident Fund, part of 80C (max ₹1.5L combined)'),
  ppf: z.number().nonnegative().describe('Public Provident Fund, part of 80C'),
  elss: z.number().nonnegative().describe('ELSS mutual funds, part of 80C'),
  lifeInsurance: z.number().nonnegative().describe('Life insurance premium, part of 80C'),
  homeRepayment: z.number().nonnegative().describe('Home loan principal repayment, part of 80C'),
  ssy: z.number().nonnegative().describe('Sukanya Samriddhi Scheme, part of 80C'),
  nsc: z.number().nonnegative().describe('National Savings Certificate, part of 80C'),
  taxSaverFD: z.number().nonnegative().describe('5-year tax saver FD, part of 80C'),
  tuitionFees: z.number().nonnegative().describe('Tuition fees, part of 80C'),

  npsAdditional: z.number().nonnegative().describe('Additional NPS contribution, 80CCD(1B), max ₹50K'),

  healthInsuranceSelf: z.number().nonnegative().describe('Health insurance premium for self+family (80D)'),
  healthInsuranceParents: z.number().nonnegative().describe("Health insurance premium for parents (80D)"),
  parentsAge: z.enum(['below60', 'above60']).describe('Parents age bracket, determines 80D limit'),

  educationLoanInterest: z.number().nonnegative().describe('Education loan interest paid, 80E (no limit)'),

  donations100: z.number().nonnegative().describe('Donations qualifying for 100% deduction, 80G'),
  donations50: z.number().nonnegative().describe('Donations qualifying for 50% deduction, 80G'),

  savingsInterest: z.number().nonnegative().describe('Savings/bank interest, 80TTA/TTB'),

  homeLoanInterest: z.number().nonnegative().describe('Home loan interest, Section 24(b), max ₹2L self-occupied'),

  regime: z.enum(['old', 'new', 'auto']).describe("Tax regime — 'auto' calculates both and recommends the better one"),
});
