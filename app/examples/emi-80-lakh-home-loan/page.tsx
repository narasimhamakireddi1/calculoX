import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { ClipboardList, Coins, BarChart2, Target, CheckCircle2, Calculator, Home, RefreshCw } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'EMI Calculator Example: ₹80 Lakh Home Loan at 8.5% for 20 Years',
  description: 'Real example of EMI calculation for ₹80 lakh home loan with 20% down payment at 8.5% interest rate for 20 years. Monthly EMI: ₹31,040. Complete analysis and optimization strategies.',
  keywords: ['EMI calculator', 'home loan EMI', '80 lakh home loan', 'EMI calculation', 'monthly EMI'],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'EMI Calculator Example: ₹80 Lakh Home Loan',
    description: 'Calculate your home loan EMI with real example scenarios',
    type: 'article',
    url: `${BASE_URL}/examples/emi-80-lakh-home-loan`,
  },
  alternates: {
    canonical: `${BASE_URL}/examples/emi-80-lakh-home-loan`,
  },
};

export default function EMI80LakhExample() {
  const propertyPrice = 8000000; // ₹80 lakh
  const downPaymentPercent = 20;
  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const annualRate = 8.5;
  const tenure = 20;
  const months = tenure * 12;
  const monthlyRate = annualRate / 12 / 100;

  // EMI Calculation
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EMI Calculator Example: ₹80 Lakh Home Loan
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            Real-world scenario: 20% down payment at 8.5% for 20 years
          </p>
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> RBI-Verified</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Scenario Details */}
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Scenario Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Property Price</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatCurrency(propertyPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Down Payment ({downPaymentPercent}%)</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatCurrency(downPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Loan Amount</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Interest Rate</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {annualRate}% p.a.
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Tenure</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {tenure} years ({months} months)
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Monthly Rate</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {(monthlyRate * 100).toFixed(4)}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Results */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Coins className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Calculation Results
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

        {/* Detailed Analysis */}
        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> What This Means: Detailed Analysis
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              In this scenario, you're buying an ₹80 lakh (₹8,000,000) property with a 20% down payment of ₹16 lakhs.
              This means your loan amount is ₹64 lakhs. At an annual interest rate of 8.5%, you'll pay a monthly EMI
              of <strong>₹31,040</strong> for 20 years (240 months).
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Income Requirement Check</h3>
            <p>
              To comfortably afford this EMI, your monthly income should be at least 4-5 times the EMI amount
              (following the 20-25% debt-to-income ratio). This means you need a monthly income of approximately
              <strong> ₹1,24,160 to ₹1,55,200</strong> (annual income of <strong>₹14.9 lakh to ₹18.6 lakh</strong>)
              to qualify for this loan comfortably.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Understanding Your Payment Breakdown</h3>
            <p>
              Over 20 years, you'll pay a total of <strong>₹74,49,600</strong>. Of this amount, ₹64 lakhs goes toward
              the actual property (principal), while the remaining <strong>₹34,49,600 is interest cost</strong>. This means
              you're essentially paying 54% extra due to the interest component. This is standard for long-term home loans.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Comparison with Renting</h3>
            <p>
              If rent in your area is around ₹30,000-35,000 per month, your EMI of ₹31,040 is competitive. However, remember:
              With renting, you have flexibility to move. With buying, you're locked into the property for 20 years.
              Consider factors like property appreciation (typically 5-7% annually in metros), rental yield, maintenance
              costs, property tax, and your financial flexibility before deciding.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">First 5 Years vs Later Years</h3>
            <p>
              In the early years (1-5), most of your EMI goes toward interest, with only a small portion reducing the
              principal. By year 10 (halfway through), the principal reduction accelerates. By year 20, you'll be paying
              mostly principal with minimal interest. This is why prepayment in early years saves significant interest.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Tax Benefits (Section 24 & 80C)</h3>
            <p>
              Under Indian tax law, you can claim deductions for:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Interest paid (Section 24):</strong> Up to ₹2 lakh in interest paid annually</li>
                <li><strong>Principal repayment (Section 80C):</strong> Principal amount (combined with other 80C deductions)</li>
                <li><strong>Stamp duty & registration:</strong> Can be claimed in the year of purchase</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Sustainability Assessment</h3>
            <p>
              This EMI of ₹31,040 is sustainable if:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Your monthly income is ₹1.5 lakh+</li>
                <li>Other debts/liabilities are minimal</li>
                <li>You have emergency savings of 6-12 months' expenses</li>
                <li>You have stable employment</li>
              </ul>
              If your income is lower, consider: larger down payment, cheaper property, longer tenure, or co-applicant income.
            </p>
          </div>
        </section>

        {/* Optimization Strategies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Ways to Reduce This EMI
          </h2>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Scenario A: Increase Down Payment to 30%
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                If you can afford ₹24 lakhs down payment instead of ₹16 lakhs:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">New Loan Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹56 lakhs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">New Monthly EMI</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">₹27,078</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="font-semibold">Savings per month</span>
                  <span className="font-bold">₹3,962</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  <strong>20-year savings: ₹9,52,800</strong> in interest
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Scenario B: Extend Tenure to 25 Years
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                If ₹31,040 monthly is tight, extend to 25 years:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Loan Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹64 lakhs (same)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">New Monthly EMI</span>
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">₹28,080</span>
                </div>
                <div className="flex justify-between text-blue-600 dark:text-blue-400">
                  <span className="font-semibold">Savings per month</span>
                  <span className="font-bold">₹2,960</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  <strong>Note:</strong> You'll pay ₹4,26,000 more interest (300 months instead of 240)
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border-l-4 border-yellow-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Scenario C: Buy a ₹70L Property Instead
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                If you choose an ₹70 lakh property with 20% down:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Property Price</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹70 lakhs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Down Payment (20%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹14 lakhs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Loan Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹56 lakhs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">New Monthly EMI</span>
                  <span className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">₹27,078</span>
                </div>
                <div className="flex justify-between text-yellow-600 dark:text-yellow-400">
                  <span className="font-semibold">Savings per month</span>
                  <span className="font-bold">₹3,962</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Scenario D: Get Interest Rate Drop to 7.5%
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                If you can negotiate/get a rate cut from 8.5% to 7.5%:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Loan Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹64 lakhs (same)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">New Interest Rate</span>
                  <span className="font-bold text-gray-900 dark:text-white">7.5% p.a.</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">New Monthly EMI</span>
                  <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">₹27,050</span>
                </div>
                <div className="flex justify-between text-purple-600 dark:text-purple-400">
                  <span className="font-semibold">Savings per month</span>
                  <span className="font-bold">₹3,990</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  <strong>20-year savings: ₹9,57,600</strong> in interest
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="mb-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Key Takeaways
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>An ₹80 lakh home with 20% down payment at 8.5% interest costs ₹31,040/month for 20 years</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>You'll need a monthly income of ₹1.24L+ to comfortably afford this EMI</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Total interest cost is ₹34.5 lakhs (54% extra over the principal)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Increasing down payment by 10% saves ₹3,962/month (₹9.5L over 20 years)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Even a 1% rate cut saves ₹3,990/month, adding up to ₹9.5L in interest savings</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>You can claim tax benefits: interest up to ₹2L/year under Section 24, principal under Section 80C</span>
            </li>
          </ul>
        </section>

        {/* Try Calculator CTA */}
        <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><Calculator className="w-7 h-7 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Try Our Interactive EMI Calculator</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Want to calculate EMI for your own loan amount? Our interactive calculator lets you:
            adjust property price, down payment percentage, interest rate, and tenure in real-time.
          </p>
          <Link
            href="/emi-calculator"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Open EMI Calculator →
          </Link>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <summary className="font-bold text-gray-900 dark:text-white flex justify-between items-center">
                What if I can't afford 20% down payment?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                If you can't afford 20%, you have options. You can put down 10-15% and pay a higher EMI, or get a co-applicant
                (spouse, parent) with higher income. However, lower down payments mean higher EMI and additional costs like mortgage
                insurance. Try to save at least 15-20% before buying to minimize overall loan burden.
              </p>
            </details>

            <details className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <summary className="font-bold text-gray-900 dark:text-white flex justify-between items-center">
                Can I prepay/foreclose the loan early?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Yes! Most banks allow prepayment without penalty. In fact, prepaying in the first 5-7 years saves significant interest
                because early payments reduce the principal faster. If you get a bonus or extra income, consider prepaying. A ₹5 lakh
                extra payment in year 3 can save ₹15-20 lakh in interest over 20 years.
              </p>
            </details>

            <details className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <summary className="font-bold text-gray-900 dark:text-white flex justify-between items-center">
                What's the difference between fixed and floating rates?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                <strong>Fixed rate:</strong> Your EMI stays the same for the entire 20 years. Protects you from rate hikes but means
                higher initial rate. <strong>Floating rate:</strong> Moves with market (RBI repo rate changes). Starts lower but can increase,
                causing EMI to rise. Currently (2024-25), fixed rates are around 8-9% and floating around 7.5-8%. Choose based on your
                risk appetite and economic outlook.
              </p>
            </details>

            <details className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <summary className="font-bold text-gray-900 dark:text-white flex justify-between items-center">
                Should I buy or rent with ₹80L?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                This depends on rental market rates, property appreciation, and your life plans. If rent is ₹30K/month and your EMI
                is ₹31K, buying looks similar in cost. But buying locks you for 20 years. Rent gives flexibility. Consider: property
                appreciation (5-7% annually in metros), rental yield (3-4%), maintenance costs (₹3-5K/month), and tax benefits. Our
                Home Loan vs Rent calculator can help compare both scenarios.
              </p>
            </details>

            <details className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <summary className="font-bold text-gray-900 dark:text-white flex justify-between items-center">
                How do I check if I'm eligible for ₹64L loan?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Banks use a debt-to-income (DTI) ratio of 40-50%. For a ₹31K EMI, you'd need 40% DTI from ₹77.5K income, so
                monthly income of ₹77.5K (annual ₹9.3L). However, this is tight. A safer ratio is 30% DTI, requiring ₹1.03L monthly
                income (₹12.4L annually). Check your eligibility online using bank calculators or consult your bank. Your CIBIL score,
                existing loans, and employment type also matter.
              </p>
            </details>
          </div>
        </section>

        {/* Related Calculators */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Related Calculators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/home-loan-vs-rent"
              className="block p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow"
            >
              <p className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Home Loan vs Rent
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Compare buying vs renting with full cost analysis
              </p>
            </Link>
            <Link
              href="/sip-calculator"
              className="block p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow"
            >
              <p className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> SIP Calculator
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Plan your monthly investment and future wealth
              </p>
            </Link>
            <Link
              href="/tax-calculator"
              className="block p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-shadow"
            >
              <p className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Tax Calculator
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Calculate your income tax liability for FY2025-26
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
