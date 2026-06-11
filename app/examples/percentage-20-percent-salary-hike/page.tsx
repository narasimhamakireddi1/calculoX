import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { ClipboardList, Coins, BarChart2, Calculator } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Percentage Calculator: 20% Salary Hike on ₹50,000',
  description: '20% salary increase calculation: ₹50,000 × 20% = ₹10,000 hike. New salary: ₹60,000.',
  keywords: ['percentage calculator', 'salary hike', 'percentage increase'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/percentage-20-percent-salary-hike`,
  },
};

export default function PercentageSalaryHikeExample() {
  const currentSalary = 50000;
  const hikePercent = 20;
  const hikeAmount = currentSalary * (hikePercent / 100);
  const newSalary = currentSalary + hikeAmount;
  const monthlyGain = hikeAmount;
  const annualGain = monthlyGain * 12;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Percentage Calculator: 20% Salary Hike</h1>
          <p className="text-xl text-green-100">Calculate your salary increase and long-term gains</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><ClipboardList className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Salary Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Current Salary</span><span className="font-bold">{formatCurrency(currentSalary)}</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Hike Percentage</span><span className="font-bold">{hikePercent}%</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><Coins className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Hike Amount</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(hikeAmount)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Monthly increase</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">New Salary</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(newSalary)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After hike</p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Annual & Long-Term Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Annual Gain</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(annualGain)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Extra earnings per year</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">5-Year Gain</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(annualGain * 5)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total extra income</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Understanding This Hike</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              A 20% salary hike on ₹50,000 means ₹10,000 extra monthly. Your monthly salary jumps from ₹50K to ₹60K.
              Annually, this adds ₹1.2L to your income. Over 5 years (assuming no further hikes), you earn ₹6L extra.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Key Insights</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>₹10K/month hike allows you to save ₹6-7K extra (if taxes/expenses remain same)</li>
              <li>Over 5 years, you accumulate ₹30-35L in extra savings (ignoring compounding)</li>
              <li>If invested in SIP at 12%, ₹10K/month becomes ₹76L in 5 years—wealth multiplier!</li>
              <li>This hike improves EMI eligibility: Now eligible for ₹10L+ more loan amount</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Action Plan</h3>
            <p>
              With ₹10K extra monthly, consider:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Invest ₹5K in SIP (builds ₹38L in 5 years)</li>
                <li>Save ₹3K in emergency fund</li>
                <li>Spend ₹2K on lifestyle upgrade</li>
              </ul>
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><Calculator className="w-7 h-7 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Calculate Percentage Changes</h2>
          <Link href="/percentage-calculator" className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50">
            Open Percentage Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
