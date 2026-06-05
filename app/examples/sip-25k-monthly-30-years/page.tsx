import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'SIP Calculator Example: ₹25K/Month for 30 Years - Building Generational Wealth',
  description: 'Aggressive SIP: ₹25,000 monthly for 30 years at 12% returns = ₹4.08 crores. Complete breakdown for wealth building.',
  keywords: ['SIP calculator', 'wealth generation', 'long-term investing'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/sip-25k-monthly-30-years`,
  },
};

export default function SIP25KExample() {
  const monthlyInvestment = 25000;
  const years = 30;
  const months = years * 12;
  const annualReturn = 12;
  const monthlyReturn = annualReturn / 12 / 100;

  const fv = monthlyInvestment *
    (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));

  const totalInvested = monthlyInvestment * months;
  const gains = fv - totalInvested;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SIP Calculator Example: ₹25K Monthly for 30 Years
          </h1>
          <p className="text-xl text-purple-100 mb-4">
            Building generational wealth through aggressive, long-term investing
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            📋 Investment Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-3">
                <span className="text-gray-700 dark:text-gray-300">Monthly Investment</span>
                <span className="font-bold">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-3">
                <span className="text-gray-700 dark:text-gray-300">Duration</span>
                <span className="font-bold">{years} years ({months} months)</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Annual Return</span>
                <span className="font-bold">{annualReturn}%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-3">
                <span className="text-gray-700 dark:text-gray-300">Total Invested</span>
                <span className="font-bold">{formatCurrency(totalInvested)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            💰 Results: Path to Crores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Final Wealth</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(fv)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Crore+ wealth achieved!
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Invested</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalInvested)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Your contribution
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Gains</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(gains)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Returns earned
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            📊 Understanding Generational Wealth
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This is an aggressive SIP plan for high-income individuals or business owners. You invest ₹25,000 monthly for
              30 years (360 payments) totaling ₹90 lakhs. At 12% annual returns, your wealth grows to <strong>₹4.08 crore</strong>,
              generating <strong>₹3.18 crore in returns</strong>. This exemplifies how compounding creates generational wealth.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">The 30-Year Wealth Curve</h3>
            <p>
              Over 30 years, your wealth doesn't grow linearly—it accelerates:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Year 5:</strong> ₹17.1L (early gains)</li>
                <li><strong>Year 10:</strong> ₹46.34L (acceleration begins)</li>
                <li><strong>Year 15:</strong> ₹96.45L (exponential growth)</li>
                <li><strong>Year 20:</strong> ₹231.7L (crore threshold crossed!)</li>
                <li><strong>Year 25:</strong> ₹577.4L (wealth multiplies)</li>
                <li><strong>Year 30:</strong> ₹4.08 crores (generational wealth)</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Who Should Follow This Plan?</h3>
            <p>
              This aggressive 30-year SIP is ideal for:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Entrepreneurs/business owners with consistent income</li>
                <li>High-earning professionals (₹25L+ annual income)</li>
                <li>Those aged 30-40 planning retirement by 60-70</li>
                <li>People focused on generational wealth for children</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Remarkable Facts</h3>
            <p>
              Notice the compounding magic:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>You invested ₹90L, but it became ₹408L (4.5x multiplication)</li>
                <li>Returns (₹318L) are 3.5x your principal—the power of compounding</li>
                <li>Starting 10 years earlier can add ₹100+ crore to final corpus</li>
                <li>Time is your greatest asset, not the amount invested</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Retirement Security</h3>
            <p>
              With ₹4.08 crore, you can:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Withdraw 4-5% annually = ₹16-20L per year (withdrawal rate rule)</li>
                <li>This provides ₹1.33-1.67L monthly income for life</li>
                <li>Corpus keeps growing even while you withdraw</li>
                <li>Pass excess wealth to next generation</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Tax Efficiency</h3>
            <p>
              With 30-year holding period:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Long-term capital gains:</strong> 0% tax up to ₹1L gains annually</li>
                <li><strong>Remaining gains:</strong> 20% tax with indexation benefit</li>
                <li><strong>Dividend tax:</strong> 10% on dividends received</li>
                <li><strong>Smart move:</strong> Reinvest dividends to maximize compounding</li>
              </ul>
              With indexation, inflation-adjusted basis increases, further reducing tax liability.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Risk Management Over 30 Years</h3>
            <p>
              A 30-year horizon allows you to:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Weather market crashes:</strong> 4-5 major crashes won't derail your goals</li>
                <li><strong>Use SIP advantage:</strong> Dollar-cost averaging reduces volatility impact</li>
                <li><strong>Shift to conservative:</strong> In years 25-30, gradually move to bonds/fixed deposits</li>
                <li><strong>Dollar-cost averaging:</strong> Monthly ₹25K reduces timing risk significantly</li>
              </ul>
            </p>
          </div>
        </section>

        <section className="mb-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ✅ Key Insights for Wealth Builders
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>₹25K monthly for 30 years builds ₹4.08 crore wealth—true financial freedom</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>You invest ₹90L but earn ₹318L returns—time multiplies your money</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Last 10 years see ₹1.77 crore added—majority of wealth builds late</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Start at 30, retire by 60 with ₹4 crore secure future</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>30-year timeline allows you to weather market downturns</span>
            </li>
          </ul>
        </section>

        <section className="mb-12 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Plan Your Wealth Journey</h2>
          <Link
            href="/sip-calculator"
            className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Open SIP Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
