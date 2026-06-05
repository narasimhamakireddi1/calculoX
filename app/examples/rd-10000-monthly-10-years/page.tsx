import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'RD Calculator Example: ₹10,000/Month for 10 Years at 6%',
  description: 'RD calculation: ₹10,000 monthly for 10 years at 6% = ₹14.31 lakhs final. Disciplined saving with guaranteed returns.',
  keywords: ['RD calculator', 'recurring deposit', '10 year RD'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/rd-10000-monthly-10-years`,
  },
};

export default function RD10KExample() {
  const monthlyDeposit = 10000;
  const months = 120;
  const rate = 6;
  const monthlyRate = rate / 12 / 100;
  const maturityValue = monthlyDeposit * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalDeposited = monthlyDeposit * months;
  const interest = maturityValue - totalDeposited;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-800 dark:to-orange-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">RD Calculator: ₹10K/Month for 10 Years</h1>
          <p className="text-xl text-orange-100">Disciplined saving with guaranteed returns at 6% interest</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 RD Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Monthly Deposit</span><span className="font-bold">{formatCurrency(monthlyDeposit)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Duration</span><span className="font-bold">10 years (120 months)</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Interest Rate</span><span className="font-bold">{rate}% p.a.</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Results at Maturity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg p-8 border-2 border-orange-200 dark:border-orange-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Maturity Amount</p>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(maturityValue)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Final amount after 10 years</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Deposited</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalDeposited)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Your contribution</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Interest Earned</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(interest)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Guaranteed returns</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Understanding This RD</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This RD is ideal for professionals saving ₹10K monthly for 10 years (₹12L total), earning ₹2.31L in
              guaranteed interest, growing to ₹14.31L. Perfect for disciplined savers building a nest egg.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Timeline Projection</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Year 1:</strong> ₹1.2L invested, ~₹300 interest earned</li>
              <li><strong>Year 5:</strong> ₹6L balance, compounding accelerates</li>
              <li><strong>Year 10:</strong> ₹14.31L final value</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">RD vs SIP Comparison</h3>
            <p>
              <strong>This RD:</strong> ₹10K/month × 10 years = ₹14.31L (6% guaranteed)
              <br/>
              <strong>SIP at 12%:</strong> ₹10K/month × 10 years = ₹18.5L (12% expected return)
              <br/>
              <strong>Difference:</strong> SIP would give ₹4.2L more (54% higher), but with market volatility.
              Choose RD if safety is priority, SIP if growth is.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Use Cases</h3>
            <p>
              Perfect for: (1) Saving for wedding in 10 years; (2) Accumulating down payment for home;
              (3) Funding children's higher education; (4) Risk-averse savers wanting guaranteed returns.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">After Tax Impact (30% Bracket)</h3>
            <p>
              Interest earned: ₹2.31L
              <br/>
              Tax: ₹69.3K
              <br/>
              Net gain: ₹1.62L
              <br/>
              Final amount after tax: ₹13.62L
              <br/>
              <strong>Tip:</strong> Consider splitting across family members to optimize tax.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-800 dark:to-orange-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Your RD</h2>
          <Link href="/rd-calculator" className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-orange-50">
            Open RD Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
