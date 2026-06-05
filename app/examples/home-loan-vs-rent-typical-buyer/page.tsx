import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Home Loan vs Rent Calculator: ₹80L Property, 20 Years',
  description: 'Buy vs Rent analysis: ₹80L property with ₹31K EMI vs ₹35K monthly rent. Complete financial comparison and break-even analysis.',
  keywords: ['home loan', 'buy vs rent', 'property investment', 'real estate analysis'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/home-loan-vs-rent-typical-buyer`,
  },
};

export default function HomeLoanVsRentExample() {
  const propertyPrice = 8000000;
  const downPayment = propertyPrice * 0.20;
  const loanAmount = propertyPrice - downPayment;
  const monthlyEMI = 31040;
  const monthlyRent = 35000;
  const years = 20;
  const months = years * 12;
  const totalEMI = monthlyEMI * months;
  const totalRent = monthlyRent * months;
  const totalCosts = totalEMI + (150 * months); // EMI + maintenance
  const propertyAppreciation = propertyPrice * Math.pow(1.065, years);
  const netWorthAfterBuying = propertyAppreciation - loanAmount;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Home Loan vs Rent: ₹80L Property Analysis</h1>
          <p className="text-xl text-green-100">Complete financial comparison over 20 years</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Scenario Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Property Price</span><span className="font-bold">{formatCurrency(propertyPrice)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Down Payment (20%)</span><span className="font-bold">{formatCurrency(downPayment)}</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Loan Amount</span><span className="font-bold">{formatCurrency(loanAmount)}</span></div>
            </div>
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Monthly EMI</span><span className="font-bold">{formatCurrency(monthlyEMI)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Monthly Rent</span><span className="font-bold">{formatCurrency(monthlyRent)}</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Duration</span><span className="font-bold">{years} years</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Financial Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total EMI + Maintenance</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalCosts)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">20 years cost</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg p-8 border-2 border-orange-200 dark:border-orange-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Rent Paid</p>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(totalRent)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">20 years cost</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Property Value (6.5% p.a.)</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(propertyAppreciation)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After 20 years</p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Net Worth After 20 Years</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Buyer's Net Worth</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(netWorthAfterBuying)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Property value - remaining loan</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Renter's Net Worth</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">₹0</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">No asset ownership</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Analysis & Verdict</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              In this scenario, <strong>buying is financially superior to renting</strong>. Here's why:
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Cost Comparison</h3>
            <p>
              <strong>Buyer costs:</strong> ₹83.78 lakh (EMI + maintenance) + Down payment ₹16L = Total ₹99.78L
              <br/>
              <strong>Renter costs:</strong> ₹84 lakh (pure expense, no asset)
              <br/>
              <strong>Difference:</strong> Buyer pays ₹15.78L more but OWNS ₹2.64 crore property!
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Wealth Creation</h3>
            <p>
              After 20 years:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Buyer:</strong> Owns ₹2.64 crore property (wealth = ₹2.64 crore)</li>
                <li><strong>Renter:</strong> Has nothing to show for ₹84L spent (wealth = ₹0)</li>
                <li><strong>Gap:</strong> Buyer ahead by ₹2.64 crore in wealth!</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Break-Even Analysis</h3>
            <p>
              With ₹31K EMI vs ₹35K rent, buying costs ₹4K/month LESS than renting!
              Over 20 years, buyer saves ₹9.6L in rent while building ₹2.64 crore equity.
              Property appreciation alone (₹1.64L over cost) makes buying a no-brainer.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">When Renting Wins</h3>
            <p>
              Renting is better if: (1) Frequent relocations expected; (2) Rent vs EMI gap &gt; 20%; (3) Poor property appreciation outlook;
              (4) Limited down payment available; (5) Property prices likely to fall.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Recommendation</h3>
            <p>
              <strong>Buy the property!</strong> At equal monthly costs (EMI ≈ Rent), buying gives you ownership, wealth building,
              and inflation protection. You can refinance or prepay to reduce interest. Renting offers only flexibility—valuable but
              financially inferior long-term.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Compare Your Own Scenarios</h2>
          <Link href="/home-loan-vs-rent" className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50">
            Open Home Loan vs Rent Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
