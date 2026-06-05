import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Retirement Calculator: ₹2 Crore Corpus at 60',
  description: 'Retirement planning: ₹2 crore corpus allows 4% annual withdrawal = ₹8 lakh/year (₹66.7K/month) for life.',
  keywords: ['retirement calculator', 'retirement planning', 'corpus planning'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/retirement-2-crore-corpus`,
  },
};

export default function Retirement2CroreExample() {
  const corpus = 20000000;
  const withdrawalRate = 0.04;
  const annualWithdrawal = corpus * withdrawalRate;
  const monthlyWithdrawal = annualWithdrawal / 12;
  const lifeExpectancy = 85;
  const lifespan = lifeExpectancy - 60;
  const totalWithdrawal = annualWithdrawal * lifespan;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Retirement Calculator: ₹2 Crore Corpus</h1>
          <p className="text-xl text-purple-100">Secure retirement with 4% withdrawal rule</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Retirement Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Retirement Corpus</span><span className="font-bold">{formatCurrency(corpus)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Retirement Age</span><span className="font-bold">60 years</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Life Expectancy</span><span className="font-bold">{lifeExpectancy} years</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Annual & Monthly Income</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Monthly Withdrawal</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(monthlyWithdrawal)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">4% annual rule</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Annual Income</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(annualWithdrawal)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Yearly withdrawal</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">25-Year Total</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalWithdrawal)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Until age 85</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Retirement Security Analysis</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              With ₹2 crore corpus at 60, you can withdraw ₹66,700/month (4% rule) without depleting capital.
              Your corpus grows at inflation rate, sustaining your lifestyle indefinitely. This is true financial freedom!
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">The 4% Withdrawal Rule</h3>
            <p>
              The 4% rule states: You can safely withdraw 4% of corpus annually without running out of money,
              assuming 7-8% long-term market returns and 3% inflation. Your corpus continues growing even while you withdraw.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Building ₹2 Crore Corpus</h3>
            <p>
              How to build ₹2 crore by age 60:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Start SIP of ₹25K/month at age 30 with 12% returns = ₹4.08 crore by 60</li>
                <li>Save ₹50L + invest at 10% for 20 years = ₹2.67 crore</li>
                <li>Lump sum ₹80L invested at 10% for 18 years = ₹2.15 crore</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Income Adequacy Check</h3>
            <p>
              ₹66,700/month covers:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Basic living: ₹30K (food, utilities, transport)</li>
                <li>Healthcare: ₹15K (important at 60+)</li>
                <li>Leisure: ₹15K (travel, hobbies)</li>
                <li>Buffer: ₹6.7K (emergencies)</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Key Strategies</h3>
            <p>
              <strong>Downsize housing:</strong> Selling ₹1 crore property, moving to ₹40L apartment frees ₹60L for corpus.
              <br/>
              <strong>Paid-off home:</strong> Ensures housing cost-free retirement (reduces monthly requirement).
              <br/>
              <strong>Regular rebalancing:</strong> Shift equity to debt as you age (60→40% equity).
              <br/>
              <strong>Inflation adjustment:</strong> Every 10 years, increase withdrawal by 30% to match inflation.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Plan Your Retirement</h2>
          <Link href="/retirement-calculator" className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50">
            Open Retirement Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
