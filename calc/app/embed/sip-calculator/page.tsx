import { SIPCalculatorCore, type SIPFormData } from '@/components/sip/SIPCalculatorCore';
import { parseNumericEmbedParams } from '@/lib/utils/embedParams';

export default async function EmbedSIPCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialValues = parseNumericEmbedParams<SIPFormData>(params, [
    'monthlyInvestment',
    'years',
    'annualReturn',
    'stepUpPercent',
  ]);

  return <SIPCalculatorCore embed initialValues={initialValues} />;
}
