import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'RD Calculator Example: ₹5,000/Month for 5 Years at 5.5%',
  description: '₹5,000 recurring deposit for 5 years at 5.5% = ₹3.26 lakhs. Bank savings with guaranteed returns.',
  keywords: ['RD calculator', 'recurring deposit', 'bank savings'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/rd-5000-monthly-5-years`,
  },
};

export default function RD5000Example() {
  const monthlyDeposit = 5000;
  const months = 60;
  const rate = 5.5;
  const monthlyRate = rate / 12 / 100;
  const maturityValue = monthlyDeposit * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalDeposited = monthlyDeposit * months;
  const interest = maturityValue - totalDeposited;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-800 dark:to-orange-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">RD Calculator: ₹5,000/Month for 5 Years</h1>
          <p className="text-xl text-orange-100">Safe, guaranteed recurring deposits at 5.5% interest</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 RD Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Monthly Deposit</span><span className="font-bold">{formatCurrency(monthlyDeposit)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Duration</span><span className="font-bold">5 years (60 months)</span></div>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Final amount after 5 years</p>
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
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Understanding RD</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              RD (Recurring Deposit) is perfect for salaried professionals. You deposit ₹5,000 monthly for 5 years
              (₹3 lakh total), earning ₹26K in interest, growing to ₹3.26 lakh. Interest is fully guaranteed by banks.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Who Should Use RD?</h3>
            <p>
              RD suits: Salaried employees, those saving for goals 5 years away, people who prefer discipline,
              risk-averse investors, and those building savings from salary.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">RD vs FD vs SIP</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>RD:</strong> Monthly deposits, safe, 5.5% return, low returns</li>
              <li><strong>FD:</strong> Lump sum, safe, 6.5% return, better than RD</li>
              <li><strong>SIP:</strong> Monthly deposits, growth-oriented, 12% expected, higher volatility</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Taxation</h3>
            <p>
              RD interest is fully taxable. ₹26K interest added to income, taxed at your slab rate (10-30%).
              After 30% tax, net gain: ₹18.2K. Still better than keeping money idle.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Better Alternative?</h3>
            <p>
              If you increase to SIP (₹5K monthly), you'd earn ₹3.4L returns in 10 years vs ₹26K in RD for 5 years.
              SIP compounds better long-term, but has market risk. Choose based on risk tolerance.
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
