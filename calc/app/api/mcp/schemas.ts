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
