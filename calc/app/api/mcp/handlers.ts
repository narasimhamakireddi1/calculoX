import { z } from 'zod';
import {
  EMISchema,
  SIPSchema,
  BMISchema,
  ComprehensiveTaxSchema,
  FDSchema,
  RDSchema,
  GSTSchema,
  CAGRSchema,
  SimpleInterestSchema,
  PercentageSchema,
  ProfitMarginSchema,
  RetirementSchema,
  BuyVsRentSchema,
  ScientificExpressionSchema,
} from '@/lib/validators';
import { calculateEMI } from '@/lib/calculators/emi';
import { calculateSIP } from '@/lib/calculators/sip';
import { calculateBMI } from '@/lib/calculators/bmi';
import { calculateComprehensiveTax } from '@/lib/tax-engine/calculator';
import { buildTaxInput } from '@/lib/tax-engine/buildTaxInput';
import { calculateFD } from '@/lib/calculators/fd';
import { calculateRD } from '@/lib/calculators/rd';
import { calculateGST } from '@/lib/calculators/gst';
import { calculateCAGR } from '@/lib/calculators/cagr';
import { calculateSimpleInterest } from '@/lib/calculators/simple-interest';
import { calculatePercentage } from '@/lib/calculators/percentage';
import { ProfitMarginGstEngine } from '@/lib/calculators/profit-margin';
import { NismRetirementEngine, type NismInputs } from '@/lib/calculators/nism-retirement';
import { BuyVsRentEngine, type BuyVsRentInputs } from '@/lib/calculators/buy-vs-rent';
import { evaluate, type CalcContext } from '@/lib/calculators/scientific';

export interface McpToolResult {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  structuredContent?: object;
  isError?: boolean;
}

function validationError(error: z.ZodError): McpToolResult {
  const message = error.issues
    .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('; ');
  return {
    isError: true,
    content: [{ type: 'text', text: `Invalid input — ${message}` }],
  };
}

function calculationError(err: unknown): McpToolResult {
  return {
    isError: true,
    content: [{ type: 'text', text: `Calculation failed: ${err instanceof Error ? err.message : String(err)}` }],
  };
}

function success(result: object): McpToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    structuredContent: result,
  };
}

// Each handler re-validates with the real v3 Zod schema from lib/validators (the
// authoritative business-rule source — see app/api/mcp/schemas.ts for why the MCP SDK
// needs a separate v4 schema for protocol advertisement) rather than trusting the SDK's
// own parsing of that v4 schema, then calls the same pure calculator function the
// website uses. Never throws — validation and calculation failures both become
// isError: true tool results so the calling model can react instead of the connection
// dying.

export function handleCalculateEmi(rawInput: unknown): McpToolResult {
  const parsed = EMISchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateEMI(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateSip(rawInput: unknown): McpToolResult {
  const parsed = SIPSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateSIP(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateBmi(rawInput: unknown): McpToolResult {
  const parsed = BMISchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateBMI(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateIncomeTax(rawInput: unknown): McpToolResult {
  const parsed = ComprehensiveTaxSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    const result = calculateComprehensiveTax(buildTaxInput(parsed.data));
    return success(result);
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateFd(rawInput: unknown): McpToolResult {
  const parsed = FDSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateFD(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateRd(rawInput: unknown): McpToolResult {
  const parsed = RDSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateRD(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateGst(rawInput: unknown): McpToolResult {
  const parsed = GSTSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateGST(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateCagr(rawInput: unknown): McpToolResult {
  const parsed = CAGRSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateCAGR(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateSimpleInterest(rawInput: unknown): McpToolResult {
  const parsed = SimpleInterestSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculateSimpleInterest(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculatePercentage(rawInput: unknown): McpToolResult {
  const parsed = PercentageSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    return success(calculatePercentage(parsed.data));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateProfitMargin(rawInput: unknown): McpToolResult {
  const parsed = ProfitMarginSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    const { costPrice, sellingPrice, targetMarginPct, targetMarkupPct, gstRatePct, calculationBasis, gstTreatment, marginOrMarkup } = parsed.data;
    const result = ProfitMarginGstEngine.calculatePricing(
      { costPrice, sellingPrice, targetMarginPct, targetMarkupPct, gstRatePct },
      { calculationBasis, gstTreatment, marginOrMarkup }
    );
    return success(result);
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateRetirement(rawInput: unknown): McpToolResult {
  const parsed = RetirementSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;
  const inputs: NismInputs = {
    demographics: {
      present_age: data.present_age,
      retirement_age: data.retirement_age,
      life_expectancy: data.life_expectancy,
    },
    financials: {
      present_monthly_expenses: data.present_monthly_expenses,
      expense_reduction_pct: data.expense_reduction_pct,
      long_term_inflation_pct: data.long_term_inflation_pct,
      current_savings: data.current_savings,
      lump_sum_benefits: data.lump_sum_benefits,
    },
    investment_returns: {
      pre_retirement_return_pct: data.pre_retirement_return_pct,
      post_retirement_return_pct: data.post_retirement_return_pct,
    },
  };
  // Cross-field checks (e.g. retirement_age > present_age) that the flat Zod schema
  // can't express on its own — same validation the live page runs before calculating.
  const validation = NismRetirementEngine.validate(inputs);
  if (!validation.valid) {
    return { isError: true, content: [{ type: 'text', text: `Invalid input — ${validation.errors.join('; ')}` }] };
  }
  try {
    return success(NismRetirementEngine.calculate(inputs));
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateHomeLoanVsRent(rawInput: unknown): McpToolResult {
  const parsed = BuyVsRentSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;
  const inputs: BuyVsRentInputs = {
    property_buying_track: {
      property_value: data.property_value,
      down_payment_pct: data.down_payment_pct,
      loan_interest_rate_pct: data.loan_interest_rate_pct,
      loan_tenure_years: data.loan_tenure_years,
      property_growth_rate_pct: data.property_growth_rate_pct,
      annual_maintenance_pct: data.annual_maintenance_pct,
    },
    renting_track: {
      initial_monthly_rent: data.initial_monthly_rent,
      annual_rent_increase_pct: data.annual_rent_increase_pct,
    },
    investment_track: {
      opportunity_return_pct: data.opportunity_return_pct,
      inflation_rate_pct: data.inflation_rate_pct,
    },
    common: {
      projection_tenure_years: data.projection_tenure_years,
      apply_tax_benefit: data.apply_tax_benefit,
      income_tax_rate_pct: data.income_tax_rate_pct,
    },
  };
  try {
    // yearly_data (one row per projected year, up to 40) is dropped from the tool
    // response — useful for the site's chart/table UI, too verbose for a chat reply.
    // The summary fields (verdict, net worth, break-even year) are the useful part here.
    const fullResult: Partial<ReturnType<typeof BuyVsRentEngine.calculate>> = { ...BuyVsRentEngine.calculate(inputs) };
    delete fullResult.yearly_data;
    return success(fullResult);
  } catch (err) {
    return calculationError(err);
  }
}

export function handleCalculateExpression(rawInput: unknown): McpToolResult {
  const parsed = ScientificExpressionSchema.safeParse(rawInput);
  if (!parsed.success) return validationError(parsed.error);
  try {
    const ctx: CalcContext = {
      angleUnit: parsed.data.angleUnit,
      memory: 0,
      ans: 0,
      matrixA: [],
      matrixB: [],
      statX: [],
      statY: [],
    };
    const result = evaluate(parsed.data.expression, ctx);
    if (result.error) {
      return { isError: true, content: [{ type: 'text', text: `Invalid expression — ${result.error}` }] };
    }
    return success({ value: result.value, display: result.display });
  } catch (err) {
    return calculationError(err);
  }
}
