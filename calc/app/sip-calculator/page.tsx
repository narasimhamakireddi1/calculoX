'use client';

import { RefreshCw, Coins, HelpCircle, ChevronRight } from 'lucide-react';
import { SIPCalculatorCore } from '@/components/sip/SIPCalculatorCore';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { RelatedBlogPosts } from '@/components/ui/RelatedBlogPosts';
import { getRelatedBlogPosts } from '@/lib/blog/utils';
import { getInternalLinks } from '@/config/internal-links.config';

export default function SIPCalculatorPage() {
  return (
    <div className="space-y-8 py-8">
      <SIPCalculatorCore />

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is SIP (Systematic Investment Plan)?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            A Systematic Investment Plan (SIP) is an investment method where you invest a fixed amount regularly (usually monthly) in mutual funds. Instead of investing a lump sum, SIP enables rupee cost averaging, which reduces the impact of market volatility and makes investing more disciplined and automated. SIPs are ideal for long-term wealth creation starting with amounts as low as ₹500/month.
          </p>
        </div>

        {/* List Snippet: Benefits of SIP */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Key Benefits of SIP Investment</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1.</span>
              <span><strong>Rupee Cost Averaging:</strong> You buy more units when prices are low and fewer when prices are high, reducing the average cost per unit over time.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2.</span>
              <span><strong>Flexibility:</strong> Adjust or stop your SIP anytime without penalties. Most funds allow pauses and increases.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3.</span>
              <span><strong>Low Entry Barrier:</strong> Start with as little as ₹500/month. No lump sum needed to begin investing.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4.</span>
              <span><strong>Disciplined Investing:</strong> Automatic monthly deductions encourage consistent habit-building without emotional decisions.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">5.</span>
              <span><strong>Power of Compounding:</strong> Long-term SIP investments can create substantial wealth through compound returns.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">6.</span>
              <span><strong>Less Stressful:</strong> No need to time the market. SIP works well in both bull and bear markets.</span>
            </li>
          </ol>
        </div>

        {/* Comparison Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">SIP vs Lump Sum Investment: Which is Better?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><RefreshCw className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> SIP (Regular Investment)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Fixed amount invested monthly over extended period. Spreads risk through rupee cost averaging.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Best For:</strong> Beginners, low income, risk-averse</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Returns:</strong> Moderate, steady, lower volatility</p>
            </div>
            <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Coins className="w-4 h-4 flex-shrink-0 text-gray-400" strokeWidth={2} aria-hidden="true" /> Lump Sum (One-Time)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Entire amount invested at once. Best if you have bulk cash available.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Best For:</strong> Downturn timing, inheritance, bonus</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Returns:</strong> Higher potential, but higher timing risk</p>
            </div>
          </div>
          <div className="info-panel mt-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Verdict:</strong> SIP is recommended for most Indian investors as it removes the pressure of market timing and ensures disciplined wealth creation. Even small monthly amounts (₹500-1000) can grow to ₹10-20 lakhs over 20 years with 12% returns.
            </p>
          </div>
        </div>

        {/* Table Snippet: SIP Returns Example */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">SIP Returns Projection @ 12% Annual Return</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Monthly SIP</th>
                  <th className="text-center py-3 px-4 font-bold">5 Years</th>
                  <th className="text-center py-3 px-4 font-bold">10 Years</th>
                  <th className="text-center py-3 px-4 font-bold">20 Years</th>
                  <th className="text-center py-3 px-4 font-bold">30 Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹500</td>
                  <td className="text-center py-3 px-4">₹37,349</td>
                  <td className="text-center py-3 px-4">₹92,297</td>
                  <td className="text-center py-3 px-4">₹311,624</td>
                  <td className="text-center py-3 px-4">₹1,04,51,858</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹10,000</td>
                  <td className="text-center py-3 px-4">₹7,46,984</td>
                  <td className="text-center py-3 px-4">₹18,45,937</td>
                  <td className="text-center py-3 px-4">₹62,32,475</td>
                  <td className="text-center py-3 px-4">₹2,09,03,716</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹25,000</td>
                  <td className="text-center py-3 px-4">₹18,67,461</td>
                  <td className="text-center py-3 px-4">₹46,14,843</td>
                  <td className="text-center py-3 px-4">₹1,55,81,188</td>
                  <td className="text-center py-3 px-4">₹5,22,59,290</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹50,000</td>
                  <td className="text-center py-3 px-4">₹37,34,922</td>
                  <td className="text-center py-3 px-4">₹92,29,686</td>
                  <td className="text-center py-3 px-4">₹3,11,62,377</td>
                  <td className="text-center py-3 px-4">₹10,45,18,580</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('sip-calculator')} />

      <RelatedBlogPosts posts={getRelatedBlogPosts('/sip-calculator')} />


      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is SIP?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Systematic Investment Plan (SIP) is a method of investing fixed amounts regularly in mutual funds. Instead of investing a lump sum, you invest a small amount every month, which helps in rupee cost averaging and reduces market volatility risk.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s a good expected return rate?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Expected returns vary by investment type: Equity/Stock funds: 12-15% per annum, Balanced funds: 8-10%, Debt/Bond funds: 5-7%, Bank FDs: 6-7%. Past performance doesn&apos;t guarantee future results.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s the minimum SIP amount?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Most mutual funds allow SIPs starting from ₹100-500 per month. Some funds have no minimum. Higher amounts don&apos;t necessarily give better returns, but consistent investing does.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is Step Up in SIP?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Step Up SIP allows you to increase your monthly investment by a fixed percentage each year. For example, with 10% step-up on a ₹10,000 SIP: Year 1 = ₹10,000/month, Year 2 = ₹11,000/month, Year 3 = ₹12,100/month, etc. This is ideal as your income grows and you can afford higher investments.
            </p>
          </details>
        </div>
      </div>

    </div>
  );
}
