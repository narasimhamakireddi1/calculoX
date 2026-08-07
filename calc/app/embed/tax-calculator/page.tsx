import { TaxCalculatorCore, type TaxFormData } from '@/components/tax/TaxCalculatorCore';
import { parseNumericEmbedParams } from '@/lib/utils/embedParams';

// Numeric fields only — the enum fields (age, regime, cityType, etc.) fall back to
// TaxCalculatorCore's own defaults, which is an acceptable v1 limitation given the
// MCP tax tool's most commonly-varied fields are the income/deduction amounts below.
const NUMERIC_FIELDS: (keyof TaxFormData)[] = [
  'grossSalary', 'basicSalary', 'hraReceived', 'rentPaid', 'lta', 'epfEmployee',
  'incomeHouseProperty', 'incomeOtherSources', 'npsEmployerContribution',
  'epf', 'ppf', 'elss', 'lifeInsurance', 'homeRepayment', 'ssy', 'nsc', 'taxSaverFD',
  'tuitionFees', 'npsAdditional', 'healthInsuranceSelf', 'healthInsuranceParents',
  'educationLoanInterest', 'donations100', 'donations50', 'savingsInterest', 'homeLoanInterest',
];

export default async function EmbedTaxCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialValues = parseNumericEmbedParams<Record<string, number>>(params, NUMERIC_FIELDS as string[]);

  return <TaxCalculatorCore embed initialValues={initialValues} />;
}
