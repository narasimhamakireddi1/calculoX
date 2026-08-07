import { EMICalculatorCore, type EMIFormData } from '@/components/emi/EMICalculatorCore';
import { parseNumericEmbedParams } from '@/lib/utils/embedParams';

export default async function EmbedEMICalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialValues = parseNumericEmbedParams<EMIFormData>(params, ['principal', 'annualRate', 'years']);

  return <EMICalculatorCore embed initialValues={initialValues} />;
}
