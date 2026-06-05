import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Simple Interest Calculator: ₹1 Lakh for 2 Years at 8%',
  description: 'Simple interest calculation: ₹1 lakh principal for 2 years at 8% = ₹16,000 interest. Total amount: ₹1.16 lakh.',
  keywords: ['simple interest', 'interest calculation', 'loan calculator'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/simple-interest-1-lakh-2-years`,
  },
};

export default function SimpleInterest1LakhExample() {
  const principal = 100000;
  const rate = 8;
  const years = 2;
  const simpleInterest = (principal * rate * years) / 100;
  const totalAmount = principal + simpleInterest;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Simple Interest: ₹1 Lakh for 2 Years</h1>
          <p className="text-xl text-blue-100">Understanding simple interest calculations and loans</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Details</h2>
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Simple Interest</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(simpleInterest)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Interest earned</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Principal</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(principal)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Original amount</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(totalAmount)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After 2 years</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Understanding Simple Interest</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Simple interest is straightforward: Interest = (Principal × Rate × Time) / 100
              <br/>
              In your case: (100,000 × 8 × 2) / 100 = ₹16,000
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Simple vs Compound Interest</h3>
            <p>
              <strong>Simple Interest:</strong> Interest calculated only on principal, not on previous interest.
              <br/>
              <strong>Compound Interest:</strong> Interest calculated on principal + accumulated interest.
              <br/>
              <br/>
              For same ₹1L at 8% for 2 years:
              <br/>
              - Simple Interest: ₹16K (total ₹1.16L)
              <br/>
              - Compound Interest: ₹16.64K (total ₹1.1664L) - slightly higher due to compounding
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">When Simple Interest Applies</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Personal loans from banks/NBFCs</li>
              <li>Short-term loans</li>
              <li>Some fixed deposits</li>
              <li>Loan agreements without compounding clause</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Monthly Breakdown</h3>
            <p>
              If you're paying this loan monthly:
              <br/>
              Total Amount Due: ₹1,16,000
              <br/>
              Monthly Payment (24 months): ₹4,833.33
              <br/>
              Interest per month: ₹333.33 (constant across all months)
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Simple Interest</h2>
          <Link href="/simple-interest-calculator" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50">
            Open Simple Interest Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
