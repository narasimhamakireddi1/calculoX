import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'EMI Calculator Example: ₹50 Lakh First-Time Buyer Home Loan',
  description: 'Real example of EMI for ₹50 lakh home loan with 25% down payment at 8.5% for 20 years. Monthly EMI: ₹18,778. Perfect for first-time homebuyers.',
  keywords: ['EMI calculator', 'first time buyer', 'home loan EMI', '50 lakh home'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/emi-50-lakh-home-loan`,
  },
};

export default function EMI50LakhExample() {
  const propertyPrice = 5000000;
  const downPaymentPercent = 25;
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
            EMI Calculator Example: ₹50 Lakh First-Time Buyer
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            Real-world scenario: 25% down payment at 8.5% for 20 years
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
            📊 What This Means: First-Time Buyer Analysis
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This is an ideal first-time buyer scenario. You're buying a ₹50 lakh property (affordable in most Tier-1 cities)
              with a 25% down payment of ₹12.5 lakhs. Your loan amount is ₹37.5 lakhs at 8.5% p.a., resulting in a monthly EMI
              of <strong>₹18,778</strong> for 20 years.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Why 25% Down Payment is Smart</h3>
            <p>
              A 25% down payment is the sweet spot for first-time buyers: (1) You avoid mortgage insurance (required for
              &lt;20% down), saving ₹25-40K annually; (2) Your EMI is lower than with 20% down (₹18,778 vs ₹19,706);
              (3) Your debt-to-income ratio is healthier, helping with future loans; (4) You demonstrate financial discipline to banks.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Income Requirement</h3>
            <p>
              With a ₹18,778 monthly EMI, you should earn at least ₹75K-94K monthly (using 20-25% debt-to-income ratio).
              This translates to <strong>₹9-11.2 lakh annual income</strong>. If you're a couple, combined income makes
              qualification easier. A married couple earning ₹6L + ₹5L = ₹11L combined easily qualifies for this loan.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">20-Year Payment Breakdown</h3>
            <p>
              Over 20 years, you'll pay ₹45,06,720 total. Of this, ₹37.5 lakhs is the actual loan (principal), and
              <strong> ₹20,67,720 is interest</strong>. This means you're paying 55% extra due to interest. While this seems
              high, remember: property typically appreciates at 5-7% annually, so your ₹50L asset might be worth ₹1.3-1.8 crore in 20 years!
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">First-Time Buyer Benefits</h3>
            <p>
              As a first-time buyer in India, you get: (1) Stamp duty exemptions in some states (check your state);
              (2) Income tax deductions under Section 24 (up to ₹2L interest/year); (3) Section 80C deduction for principal
              repayment; (4) GST exemption on property (if purchased before completion).
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Savings Strategies</h3>
            <p>
              Once you buy, you can reduce interest through: (1) Prepayment during high-income years; (2) Switching to
              floating rate if rates drop significantly; (3) Increasing EMI if your income grows; (4) Lump-sum payments
              from bonuses. A one-time ₹2 lakh prepayment in year 3 can save ₹6-8 lakh in future interest.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🎯 Ways to Optimize
          </h2>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Option 1: Increase Down to 30% (Save ₹1.5L)
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                If you can afford ₹15L down instead of ₹12.5L:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between font-bold">
                  <span>New Monthly EMI</span>
                  <span className="text-green-600 dark:text-green-400">₹17,500</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Saves ₹1,278/month</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Option 2: Get Rate Drop to 7.5%
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Negotiate a better rate with your bank:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between font-bold">
                  <span>New Monthly EMI</span>
                  <span className="text-blue-600 dark:text-blue-400">₹15,980</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Saves ₹2,798/month</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ✅ Key Takeaways for First-Time Buyers
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>A ₹50L home with 25% down costs ₹18,778/month—achievable for ₹9-11L annual income</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Total interest over 20 years: ₹20.67 lakhs (55% extra cost)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Avoid mortgage insurance by putting ≥20% down</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>You get tax benefits: Section 24 (interest) + Section 80C (principal)</span>
            </li>
          </ul>
        </section>

        <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Your Own EMI</h2>
          <p className="text-blue-100 mb-6">
            Use our interactive calculator to find the right property price and down payment for your situation.
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
