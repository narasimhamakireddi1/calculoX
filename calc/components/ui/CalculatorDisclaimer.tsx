import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

type Category = 'Finance' | 'Health' | 'Utility';

// Wording varies by category so the warning stays honest: financial pages need
// CA/CFP language, the health page needs medical language, utility tools only
// need an accuracy note.
const copy: Record<Category, { heading: string; body: string }> = {
  Finance: {
    heading: 'Estimates only — not financial advice',
    body: 'Results are estimates for education and planning. Consult a qualified financial advisor (CA, CFP, or SEBI-registered advisor) before any major financial decision.',
  },
  Health: {
    heading: 'Estimates only — not medical advice',
    body: 'Results are a screening estimate, not a diagnosis. Consult a qualified doctor before making health decisions based on these numbers.',
  },
  Utility: {
    heading: 'Verify results independently',
    body: 'Results are provided as-is for convenience. Double-check any figure before using it in academic, professional, or financial work.',
  },
};

export function CalculatorDisclaimer({ category }: { category: Category }) {
  const { heading, body } = copy[category];
  return (
    <div
      role="note"
      aria-label="Disclaimer"
      className="max-w-4xl mx-auto px-4 sm:px-6 pt-4"
    >
      <div className="flex items-start gap-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
        <AlertTriangle
          className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong className="font-bold">{heading}.</strong> {body} See how results are validated on our{' '}
          <Link
            href="/verification-methodology"
            className="font-medium underline underline-offset-2 hover:text-amber-950 dark:hover:text-amber-100"
          >
            Verification Methodology
          </Link>{' '}
          page, or read the full{' '}
          <Link
            href="/terms-of-service"
            className="font-medium underline underline-offset-2 hover:text-amber-950 dark:hover:text-amber-100"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
