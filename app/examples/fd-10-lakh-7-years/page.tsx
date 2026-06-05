import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'FD Calculator Example: ₹10 Lakh for 7 Years at 7%',
  description: 'FD calculation: ₹10 lakh principal for 7 years at 7% annual interest = ₹15.07 lakh final. Safe long-term investment.',
  keywords: ['FD calculator', 'fixed deposit', '7 year FD'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/fd-10-lakh-7-years`,
  },
};

export default function FD10LakhExample() {
  const principal = 1000000;
  const rate = 7;
  const years = 7;
  const amount = principal * Math.pow(1 + rate / 100, years);
  const interest = amount - principal;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">FD Calculator: ₹10 Lakh for 7 Years at 7%</h1>
          <p className="text-xl text-teal-100">Secure long-term investment with guaranteed returns</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 FD Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Principal</span><span className="font-bold">{formatCurrency(principal)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Rate</span><span className="font-bold">{rate}% p.a.</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Duration</span><span className="font-bold">{years} years</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 rounded-lg p-8 border-2 border-teal-200 dark:border-teal-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Maturity Amount</p>
              <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">{formatCurrency(amount)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After 7 years</p>
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
              This FD is for someone with ₹10L surplus needing long-term guaranteed returns. You'll earn ₹5.07L in interest
              over 7 years, growing your principal to ₹15.07L. Banks guarantee this return (RBI-regulated).
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">7-Year FD Advantages</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>7% is higher than 5-year rates (usually 6-6.5%)</li>
              <li>Banks reward longer lock-in with better rates</li>
              <li>Ideal for retirement planning (5-7 year horizon)</li>
              <li>Less volatile than stock market over 7 years</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Inflation Impact</h3>
            <p>
              At 7% return and 6% inflation, real return is only 1% p.a. This means purchasing power growth is minimal.
              Over 7 years, your ₹15.07L can buy what ₹12.61L buys today. FDs are safe but don't beat inflation significantly.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Taxation (30% Bracket)</h3>
            <p>
              Interest earned: ₹5.07L
              <br/>
              Tax at 30%: ₹1.52L
              <br/>
              Net gain: ₹3.55L
              <br/>
              Effective return: 3.55% after tax (significant impact!)
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Better Strategy?</h3>
            <p>
              Consider SIP instead: ₹1.43L/month SIP for 7 years at 12% return = ₹15.36L final value
              (vs ₹15.07L from FD). Similar final amount, but SIP builds discipline and grows wealth faster initially.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Your FD</h2>
          <Link href="/fd-calculator" className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-teal-50">
            Open FD Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
