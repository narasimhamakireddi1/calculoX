import { Suspense } from 'react';
import { CompareClient } from '@/components/compare/CompareClient';

export const metadata = {
  title: 'Compare Calculators Side-by-Side | EMI vs SIP vs FD | calculox',
  description: 'Compare EMI, SIP, and FD calculators side-by-side on calculox. Enter different loan amounts, interest rates, and tenures simultaneously to find the best financial option for your situation. Free, instant, no login required.',
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Loading comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}
