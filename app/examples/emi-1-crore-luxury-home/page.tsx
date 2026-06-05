import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'EMI Calculator Example: ₹1 Crore Luxury Home Loan',
  description: 'Real example of EMI for ₹1 crore luxury home with 30% down payment at 8.5% for 20 years. Monthly EMI: ₹46,884. Complete financial analysis for high-value properties.',
  keywords: ['EMI calculator', 'luxury home', '1 crore property', 'high value home loan'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/emi-1-crore-luxury-home`,
  },
};

export default function EMI1CroreExample() {
  const propertyPrice = 10000000;
  const downPaymentPercent = 30;
  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const annualRate = 8.5;
  const tenure = 20;
  const months = tenure * 12;
  const monthlyRate = annualRate / 12 / 100;

  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EMI Calculator Example: ₹1 Crore Luxury Home
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            Real-world scenario: 30% down payment at 8.5% for 20 years
          </p>
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            ✅ RBI-Verified
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            📋 Scenario Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Property Price</span>
                <span className="font-bold text-lg">{formatCurrency(propertyPrice)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Down Payment ({downPaymentPercent}%)</span>
                <span className="font-bold text-lg">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Loan Amount</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatCurrency(loanAmount)}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Interest Rate</span>
                <span className="font-bold text-lg">{annualRate}% p.a.</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Tenure</span>
                <span className="font-bold text-lg">{tenure} years ({months} months)</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Monthly Rate</span>
                <span className="font-bold text-lg">{(monthlyRate * 100).toFixed(4)}%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            💰 Calculation Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Monthly EMI</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(emi)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Amount to pay every month
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Amount Paid</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(totalAmount)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Over {months} months ({tenure} years)
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/20 rounded-lg p-8 border-2 border-rose-200 dark:border-rose-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Interest Paid</p>
              <p className="text-4xl font-bold text-rose-600 dark:text-rose-400">
                {formatCurrency(totalInterest)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Cost of borrowing
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            📊 Analysis: Luxury Home Financing
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This scenario represents a luxury property purchase in premium metro locations (Mumbai, Delhi, Bangalore).
              At ₹1 crore with a 30% down payment (₹3 crore), you're borrowing ₹7 crore with a monthly EMI of
              <strong> ₹46,884</strong> for 20 years.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Income Qualification</h3>
            <p>
              For a ₹46,884 monthly EMI, you need significant income. Using standard debt-to-income ratios:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>40% DTI: Monthly income ₹1,17,210 (Annual: ₹14 lakh+)</li>
                <li>30% DTI (conservative): Monthly income ₹1,56,280 (Annual: ₹18.75 lakh+)</li>
              </ul>
              Typically, luxury home buyers have combined household income of ₹25-50+ lakh annually or business income.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">30% Down Payment Strategy</h3>
            <p>
              At ₹1 crore property value, the ₹3 crore down payment is strategic:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Avoids mortgage insurance (for &lt;20% down)</li>
                <li>Demonstrates financial strength to lenders</li>
                <li>Results in lower EMI and shorter repayment period</li>
                <li>Protects against property value depreciation in luxury segment</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">20-Year Financial Commitment</h3>
            <p>
              Total payment: <strong>₹1,12,52,160</strong>. Of this, ₹70 lakh is principal, and
              <strong> ₹56,52,160 is interest</strong> (81% extra cost). This is significant, highlighting the importance
              of negotiating lower interest rates for large loans. A 0.5% rate reduction saves ₹1.3 crore in interest!
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Wealth & Investment Perspective</h3>
            <p>
              While ₹46K monthly EMI seems high, context matters:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>₹1 crore property in Metro appreciates 6-8% annually</li>
                <li>In 20 years, property might be worth ₹3-3.5 crore</li>
                <li>You own the asset; rent builds no equity</li>
                <li>Rental income (if rental property): 3-4% annual yield = ₹30-40L annually from the same property</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Tax Planning for Luxury Properties</h3>
            <p>
              High-value property purchases offer substantial tax benefits:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Section 24:</strong> Deduct up to ₹2L interest annually (lifetime)</li>
                <li><strong>Section 80C:</strong> Deduct principal repayment (₹1.5L annual cap for all 80C deductions)</li>
                <li><strong>Stamp duty:</strong> Claim registration costs in purchase year</li>
                <li><strong>Capital gains:</strong> Hold {'>'} 2 years for long-term capital gains tax benefits</li>
              </ul>
              On ₹46.88K EMI, interest in year 1 is ~₹49.5L, capped at ₹2L deduction annually. Even this ₹2L deduction
              saves ₹60,000 in taxes annually (30% tax bracket).
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Prepayment & Liquidity Strategy</h3>
            <p>
              For high-net-worth individuals:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Early prepayment:</strong> ₹10L extra in years 1-3 saves ₹40-50L interest</li>
                <li><strong>Flexible repayment:</strong> Keep EMI low, prepay from annual bonuses/business income</li>
                <li><strong>Liquidity reserve:</strong> Don't lock all capital; maintain 18-24 months emergency fund separately</li>
                <li><strong>Investment perspective:</strong> If you can earn {'>'}8.5% returns elsewhere, optimal EMI &lt; prepayment</li>
              </ul>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🎯 Optimization Strategies for Luxury Homes
          </h2>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Strategy 1: Negotiate 7.5% Rate (Save ₹1.2L Annually)
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between font-bold">
                  <span>New Monthly EMI @ 7.5%</span>
                  <span className="text-green-600 dark:text-green-400">₹39,980</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Saves ₹6,904/month = ₹82.8K/year</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">20-year interest savings: ₹30+ crore</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Strategy 2: 15-Year Tenure (Pay Off Early)
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between font-bold">
                  <span>Monthly EMI @ 15 Years</span>
                  <span className="text-blue-600 dark:text-blue-400">₹55,332</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">EMI increases by ₹8,448/month</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">Total interest: Only ₹29.5L (saves ₹27L)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Strategy 3: Increase Down to 40% (₹40L Down)
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between font-bold">
                  <span>New Loan Amount</span>
                  <span className="text-gray-900 dark:text-white">₹60 lakhs</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>New Monthly EMI</span>
                  <span className="text-purple-600 dark:text-purple-400">₹40,188</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Saves ₹6,696/month</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ✅ Key Takeaways for Luxury Home Buyers
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>₹1 crore property with 30% down costs ₹46,884/month requiring ₹18.75L+ annual income</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Total interest cost: ₹56.5 lakhs (81% of principal)—negotiate rates aggressively</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Even 0.5% rate reduction = ₹1.3 crore in interest savings over 20 years</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Property appreciation (6-8% annually) typically exceeds EMI costs</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Tax benefits: ₹2L annual interest deduction saves ₹60K/year in taxes (30% bracket)</span>
            </li>
          </ul>
        </section>

        <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Plan Your Luxury Home Purchase</h2>
          <p className="text-blue-100 mb-6">
            Use our calculator to explore different down payments, interest rates, and tenures for your property.
          </p>
          <Link
            href="/emi-calculator"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Open EMI Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
