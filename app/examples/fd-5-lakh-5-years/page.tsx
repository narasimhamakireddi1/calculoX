import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'FD Calculator Example: ₹5 Lakh for 5 Years at 6.5%',
  description: 'Real FD example: ₹5 lakh fixed deposit for 5 years at 6.5% annual interest = ₹6.76 lakhs. Safe investment analysis.',
  keywords: ['FD calculator', 'fixed deposit', 'savings'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/fd-5-lakh-5-years`,
  },
};

export default function FD5LakhExample() {
  const principal = 500000;
  const rate = 6.5;
  const years = 5;
  const amount = principal * Math.pow(1 + rate / 100, years);
  const interest = amount - principal;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">FD Calculator: ₹5 Lakh for 5 Years at 6.5%</h1>
          <p className="text-xl text-teal-100">Safe, guaranteed investment for short-term goals</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 FD Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3">
                <span>Principal Amount</span>
                <span className="font-bold">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b mb-3">
                <span>Interest Rate</span>
                <span className="font-bold">{rate}% p.a.</span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span>Duration</span>
                <span className="font-bold">{years} years</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 rounded-lg p-8 border-2 border-teal-200 dark:border-teal-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Final Amount</p>
              <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">{formatCurrency(amount)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After 5 years</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Interest Earned</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(interest)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Pure gains</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Return on Investment</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{((interest / principal) * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total ROI</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Understanding This FD</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This FD is ideal for someone with ₹5 lakh surplus needing low-risk, guaranteed returns. You'll earn ₹1.76 lakh
              in interest over 5 years, growing your principal to ₹6.76 lakh. Banks guarantee this return (RBI-regulated).
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Why This Rate?</h3>
            <p>
              6.5% is the current (2024-25) average FD rate for 5-year tenure. Senior citizens get +0.5% (7% p.a.).
              Banks offer varying rates: 6.2-7% depending on bank rating. RBI repo rate is 6.5%, so 6.5% is standard.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Who Should Use FDs?</h3>
            <p>
              FDs are perfect for: Risk-averse investors, those near retirement, funds needed within 5 years, or part of
              portfolio diversification. FDs are safer than stocks but earn less than equity over long term.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Taxation</h3>
            <p>
              FD interest is fully taxable as per your income tax bracket. If you earn ₹1.76L in FD interest, it's added
              to your income and taxed at your slab rate (10-30%). After 30% tax, net gain becomes ₹1.23L.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Comparison: SIP vs FD</h3>
            <p>
              <strong>FD (₹5L for 5 years @ 6.5%):</strong> ₹6.76L final (safe, guaranteed)
              <br/>
              <strong>SIP (₹100K monthly for 5 years @ 12%):</strong> ₹6.88L final (growth, market risk)
              <br/>
              SIP has slight edge but with volatility. FD is steady and guaranteed.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Your FD</h2>
          <Link href="/fd-calculator" className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-teal-50 transition-colors">
            Open FD Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
