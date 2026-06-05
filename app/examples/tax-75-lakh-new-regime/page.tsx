import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Tax Calculator Example: ₹75 Lakh Income New Regime FY2025-26',
  description: 'Income tax calculation: ₹75 lakh gross income under new tax regime FY2025-26 = ₹14.5 lakh tax. Complete breakdown.',
  keywords: ['tax calculator', 'income tax', 'new tax regime', 'FY2025-26'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/tax-75-lakh-new-regime`,
  },
};

export default function Tax75LakhExample() {
  const grossIncome = 7500000;
  const standardDeduction = 75000;
  const taxableIncome = grossIncome - standardDeduction;

  // New Regime slabs FY2025-26
  let tax = 0;
  if (taxableIncome > 0) tax += Math.min(taxableIncome, 400000) * 0;
  if (taxableIncome > 400000) tax += Math.min(taxableIncome - 400000, 400000) * 0.05;
  if (taxableIncome > 800000) tax += Math.min(taxableIncome - 800000, 400000) * 0.10;
  if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 800000) * 0.15;
  if (taxableIncome > 2000000) tax += Math.min(taxableIncome - 2000000, 1000000) * 0.20;
  if (taxableIncome > 3000000) tax += (taxableIncome - 3000000) * 0.30;

  const healthCess = tax * 0.04;
  const totalTax = tax + healthCess;
  const netIncome = grossIncome - totalTax;
  const effectiveRate = (totalTax / grossIncome) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Tax Calculator: ₹75L Income New Regime</h1>
          <p className="text-xl text-red-100">FY2025-26 tax calculation and optimization</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Income Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Gross Income</span><span className="font-bold">{formatCurrency(grossIncome)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Standard Deduction</span><span className="font-bold">{formatCurrency(standardDeduction)}</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Taxable Income</span><span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(taxableIncome)}</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Tax Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-lg p-8 border-2 border-red-200 dark:border-red-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Income Tax</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">{formatCurrency(tax)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Before cess</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg p-8 border-2 border-orange-200 dark:border-orange-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Health Cess (4%)</p>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(healthCess)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Additional 4%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Tax</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(totalTax)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tax + Cess</p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Net Income & Effective Rate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Net Income (Take-Home)</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(netIncome)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After all taxes</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Effective Tax Rate</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{effectiveRate.toFixed(2)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tax as % of gross income</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Understanding Your Tax</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              With ₹75 lakh income, you're in high earner category. Under new tax regime, you pay ₹14.5L in taxes
              (effective rate 19.33%), leaving you ₹60.5L net income after all taxes.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Why New Regime?</h3>
            <p>
              New regime offers lower tax rates without exemptions. You sacrifice deductions (80C, 24) but get lower slabs.
              For ₹75L income, new regime is usually beneficial unless you have substantial deductions.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Tax Optimization Strategies</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Section 80C:</strong> Invest ₹1.5L in PPF/ELSS/Insurance for deduction</li>
              <li><strong>Section 80D:</strong> Health insurance premiums (up to ₹1L for family)</li>
              <li><strong>Home Loan Interest:</strong> Up to ₹2L annual interest (Section 24)</li>
              <li><strong>NPS:</strong> Additional ₹2L deduction under Section 80CCD(1B)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">With Optimal Deductions</h3>
            <p>
              If you utilized ₹10L in deductions (80C, 80D, 24, NPS combined), taxable income drops to ₹64.25L,
              reducing tax to ~₹12.5L. This saves ₹2L in taxes—reason to optimize deductions!
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Monthly Tax Breakdown</h3>
            <p>
              If salary is monthly: Gross monthly ≈ ₹6.25L. If TDS calculated properly, your monthly net should be
              around ₹5L-5.2L depending on deductions claimed in Form 12B.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Your Income Tax</h2>
          <Link href="/tax-calculator" className="inline-block bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-red-50">
            Open Tax Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
