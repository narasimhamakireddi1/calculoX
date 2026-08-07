import { BMICalculatorCore, type BMIFormData } from '@/components/bmi/BMICalculatorCore';
import { parseNumericEmbedParams } from '@/lib/utils/embedParams';

export default async function EmbedBMICalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialValues = parseNumericEmbedParams<BMIFormData>(params, ['weight', 'height']);

  return <BMICalculatorCore embed initialValues={initialValues} />;
}
