import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'SIP Calculator Example: ₹5,000/Month for 10 Years - Conservative Investing',
  description: '₹5,000 monthly SIP for 10 years at 12% returns = ₹9.24 lakhs. Safe wealth building.',
  keywords: ['SIP', 'conservative investment', 'mutual fund'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/sip-5k-monthly-10-years`,
  },
};

export default function SIP5KExample() {
  const monthlyInvestment = 5000;
  const years = 10;
  const months = years * 12;
  const annualReturn = 12;
  const monthlyReturn = annualReturn / 12 / 100;
  const fv = monthlyInvestment * (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
  const totalInvested = monthlyInvestment * months;
  const gains = fv - totalInvested;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">SIP Example: ₹5K Monthly for 10 Years</h1>
          <p className="text-xl text-purple-100">Conservative wealth building for beginners</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Investment Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Monthly Investment</span><span className="font-bold">{formatCurrency(monthlyInvestment)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Duration</span><span className="font-bold">{years} years</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Annual Return</span><span className="font-bold">{annualReturn}%</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Final Value</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(fv)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After 10 years</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Invested</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalInvested)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Your contribution</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Gains</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(gains)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Returns earned</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Understanding This Plan</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This is ideal for beginners or those with modest income. You invest ₹60,000 total over 10 years and earn
              ₹3.24 lakh in returns, growing to ₹9.24 lakh. Perfect for first-time investors aged 20-30 with ₹3-5L annual income.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Timeline</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Year 1:</strong> ₹60K invested, minimal returns</li>
              <li><strong>Year 5:</strong> ₹3.4L balance, growth accelerating</li>
              <li><strong>Year 10:</strong> ₹9.24L final value</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Key Benefits</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Low monthly investment: ₹5K is achievable for most</li>
              <li>Discipline building: Regular investing creates habits</li>
              <li>Flexibility: After 10 years, can withdraw or continue</li>
              <li>Tax-efficient: Long-term capital gains favorable treatment</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Next Steps</h3>
            <p>
              After 10 years with ₹9.24L, you can: (1) Continue SIP and let it grow to ₹30+ lakh by year 20; (2) Withdraw
              for major goal (car, wedding); (3) Shift to fixed income investments; (4) Use for down payment on property.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Start Your SIP Today</h2>
          <Link href="/sip-calculator" className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50">
            Open SIP Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
