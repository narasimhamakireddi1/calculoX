import { Suspense } from 'react';
import { CompareClient } from '@/components/compare/CompareClient';

export const metadata = {
  title: 'Compare Calculators | calculox',
  description: 'Compare financial calculators side-by-side. EMI, SIP, FD and more. See different scenarios at once.',
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Loading comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}
