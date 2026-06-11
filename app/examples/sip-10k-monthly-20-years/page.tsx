import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { ClipboardList, Coins, BarChart2, Target, CheckCircle2, Calculator } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'SIP Calculator Example: ₹10,000/Month for 20 Years at 12% Returns',
  description: 'Real SIP example: ₹10,000 monthly investment for 20 years at 12% annual returns = ₹92.68 lakhs. Complete breakdown and retirement planning guide.',
  keywords: ['SIP calculator', 'mutual fund investment', 'monthly investment', 'wealth creation'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/sip-10k-monthly-20-years`,
  },
};

export default function SIP10KExample() {
  const monthlyInvestment = 10000;
  const years = 20;
  const months = years * 12;
  const annualReturn = 12;
  const monthlyReturn = annualReturn / 12 / 100;

  // SIP Formula: FV = P × [((1+r)^n - 1) / r] × (1 + r)
  const fv = monthlyInvestment *
    (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));

  const totalInvested = monthlyInvestment * months;
  const gains = fv - totalInvested;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SIP Calculator Example: ₹10K Monthly for 20 Years
          </h1>
          <p className="text-xl text-purple-100 mb-4">
            Wealth creation through consistent monthly investing at 12% annual returns
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Investment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Monthly Investment</span>
                <span className="font-bold text-lg">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Total Duration</span>
                <span className="font-bold text-lg">{years} years ({months} months)</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Annual Return Rate</span>
                <span className="font-bold text-lg">{annualReturn}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Monthly Return Rate</span>
                <span className="font-bold text-lg">{(monthlyReturn * 100).toFixed(4)}%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Total Investment</span>
                <span className="font-bold text-lg">{formatCurrency(totalInvested)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Coins className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Investment Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Final Value</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(fv)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Total wealth after 20 years
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Your Investment</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalInvested)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Amount you invested
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Gains (Interest)</p>
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
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Understanding This SIP Plan
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This is a moderate SIP plan suitable for middle-class professionals. You invest ₹10,000 every month for
              20 years (240 payments) totaling ₹24 lakhs. With 12% annual returns (typical for diversified equity mutual funds),
              your investment grows to <strong>₹92.68 lakhs</strong>, generating <strong>₹68.68 lakhs in returns</strong>.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Power of Compounding</h3>
            <p>
              The magic here is compounding. Your returns earn returns, multiplying your wealth. Notice that:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>You invested ₹24L, but it became ₹92.68L</li>
                <li>Returns are nearly 3x your principal investment</li>
                <li>This is why Einstein called compounding the "8th wonder of the world"</li>
              </ul>
              Starting early is crucial because compounding accelerates in later years (years 15-20 see maximum returns).
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Year-by-Year Breakdown</h3>
            <p>
              To understand how your SIP grows:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Year 1:</strong> ₹10K/month × 12 = ₹1.2L (minimal returns)</li>
                <li><strong>Year 5:</strong> ~₹6.8L (balance growing)</li>
                <li><strong>Year 10:</strong> ~₹18.5L (exponential growth kicks in)</li>
                <li><strong>Year 15:</strong> ~₹38.6L (compounding accelerates)</li>
                <li><strong>Year 20:</strong> ₹92.68L (final value)</li>
              </ul>
              Notice how the balance accelerates in later years—this is compounding in action.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Who Should Use This Plan?</h3>
            <p>
              This ₹10K/month SIP is ideal for:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Professionals with ₹6-8L annual income</li>
                <li>Those aged 25-35 starting long-term wealth building</li>
                <li>People saving for goals 15+ years away (retirement, child education)</li>
                <li>Those with moderate risk tolerance (equity mutual funds)</li>
              </ul>
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Important Assumption: 12% Returns</h3>
            <p>
              The 12% return assumes:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Diversified equity portfolio:</strong> Mix of large-cap, mid-cap, small-cap funds</li>
                <li><strong>Long-term perspective:</strong> You stay invested through market ups and downs</li>
                <li><strong>Realistic benchmark:</strong> S&amp;P 500 averages 10% historically; Indian markets 12-13%</li>
                <li><strong>Risk:</strong> 12% returns come with volatility—markets can decline short-term</li>
              </ul>
              If markets underperform (return 8-9%), final value would be ₹70-80L instead of ₹92.68L.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Taxation of SIP Returns</h3>
            <p>
              In India, SIP taxation depends on holding period:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Short-term capital gains (&lt;1 year):</strong> 15% tax on gains</li>
                <li><strong>Long-term capital gains (≥1 year):</strong> 0% tax up to ₹1L gains annually, then 20% with indexation</li>
                <li><strong>Dividend:</strong> If your fund distributes dividends, 10% dividend tax (as of 2024-25)</li>
              </ul>
              In your case, at 20-year hold, long-term capital gains apply. You'd pay ~₹0 tax on ₹1L gains + 20% on
              remaining ₹67.68L = ~₹13.5L tax liability. But this is manageable over 20 years and doesn't impact wealth accumulation heavily.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Dollar-Cost Averaging Benefit</h3>
            <p>
              By investing ₹10K monthly (not lump sum), you benefit from dollar-cost averaging:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>When markets are down:</strong> Your ₹10K buys more units</li>
                <li><strong>When markets are up:</strong> Your ₹10K buys fewer units</li>
                <li><strong>Net effect:</strong> You average out market volatility, reducing risk</li>
              </ul>
              This is why SIP is recommended over lump-sum investing for regular investors.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Comparison with Alternative Scenarios
          </h2>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Scenario A: ₹5K Monthly for 20 Years
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">If cash flow is tight:</p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span>Total Investment</span>
                  <span className="font-bold">₹12 lakhs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Final Value</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₹46.34 lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span>Gains</span>
                  <span className="font-bold">₹34.34 lakhs</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Scenario B: ₹25K Monthly for 20 Years
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">If you're a high earner:</p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span>Total Investment</span>
                  <span className="font-bold">₹60 lakhs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Final Value</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">₹231.7 lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span>Gains</span>
                  <span className="font-bold">₹171.7 lakhs</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Scenario C: ₹10K Monthly for 10 Years (Early Achiever)
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">If you want results faster:</p>
              <div className="bg-white dark:bg-gray-800 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span>Total Investment</span>
                  <span className="font-bold">₹12 lakhs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Final Value</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">₹18.5 lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span>Gains</span>
                  <span className="font-bold">₹6.5 lakhs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Key Takeaways
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>₹10K monthly for 20 years grows to ₹92.68L with 12% annual returns</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>You invest ₹24L but earn ₹68.68L in returns—the power of compounding</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Compounding accelerates in later years (years 15-20 see the most growth)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Start early: Even 5 years earlier can increase final value by ₹20-30L</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
              <span>Long-term capital gains tax is favorable in India (0% up to ₹1L annually)</span>
            </li>
          </ul>
        </section>

        <section className="mb-12 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><Calculator className="w-7 h-7 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Start Your SIP Journey Today</h2>
          <p className="text-purple-100 mb-6">
            Use our interactive SIP calculator to explore different amounts, durations, and return rates.
          </p>
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
