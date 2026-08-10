import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CompareClient } from '@/components/compare/CompareClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Compare Calculators Side-by-Side | EMI vs SIP vs FD | calculox',
  description: 'Compare EMI, SIP, and FD calculators side-by-side on calculox. Enter different loan amounts, interest rates, and tenures simultaneously to find the best financial option for your situation. Free, instant, no login required.',
  // Without this, the page inherited the root layout's canonical (the homepage
  // URL) — telling Google this page is a duplicate of "/" and suppressing it
  // from being indexed separately.
  alternates: { canonical: `${BASE_URL}/compare` },
  openGraph: {
    title: 'Compare Calculators Side-by-Side | EMI vs SIP vs FD | calculox',
    description: 'Compare EMI, SIP, and FD calculators side-by-side — enter different amounts, rates, and tenures to find the best option.',
    url: `${BASE_URL}/compare`,
    type: 'website',
  },
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Loading comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}
