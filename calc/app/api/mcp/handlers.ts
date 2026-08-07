import { z } from 'zod';
import { EMISchema, SIPSchema, BMISchema, ComprehensiveTaxSchema } from '@/lib/validators';
import { calculateEMI } from '@/lib/calculators/emi';
import { calculateSIP } from '@/lib/calculators/sip';
import { calculateBMI } from '@/lib/calculators/bmi';
import { calculateComprehensiveTax } from '@/lib/tax-engine/calculator';
import { buildTaxInput } from '@/lib/tax-engine/buildTaxInput';

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
