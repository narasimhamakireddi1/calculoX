'use client';

import { TaxCalculatorCore } from '@/components/tax/TaxCalculatorCore';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { RelatedBlogPosts } from '@/components/ui/RelatedBlogPosts';
import { getRelatedBlogPosts } from '@/lib/blog/utils';
import { HelpCircle, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { getInternalLinks } from '@/config/internal-links.config';

export default function TaxCalculator() {
  return (
    <div className="space-y-6 py-8">
      <TaxCalculatorCore />

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is Income Tax?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Income Tax is a mandatory financial charge imposed by the government on individuals and organizations earning income in India. The amount of tax depends on your income level, which is divided into tax slabs with increasing rates. For FY 2025-26 (AY 2026-27), India offers two tax regimes: Old Regime with multiple deductions (80C, 80D, 24b) and New Regime with lower tax rates but fewer deductions. Section 87A provides a rebate up to ₹60,000 for income up to ₹12 lakhs in the New Regime.
          </p>
        </div>

        {/* Table Snippet: Income Tax Slabs 2025-26 */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Income Tax Slabs FY 2025-26 (New Regime)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Income Slab</th>
                  <th className="text-center py-3 px-4 font-bold">Tax Rate</th>
                  <th className="text-center py-3 px-4 font-bold">Tax on Slab Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">Upto ₹4 Lakh</td>
                  <td className="text-center py-3 px-4">Nil (0%)</td>
                  <td className="text-center py-3 px-4">₹0</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹4L - ₹8L</td>
                  <td className="text-center py-3 px-4">5%</td>
                  <td className="text-center py-3 px-4">₹20,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹8L - ₹12L</td>
                  <td className="text-center py-3 px-4">10%</td>
                  <td className="text-center py-3 px-4">₹40,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹12L - ₹16L</td>
                  <td className="text-center py-3 px-4">15%</td>
                  <td className="text-center py-3 px-4">₹60,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹16L - ₹20L</td>
                  <td className="text-center py-3 px-4">20%</td>
                  <td className="text-center py-3 px-4">₹80,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹20L - ₹24L</td>
                  <td className="text-center py-3 px-4">25%</td>
                  <td className="text-center py-3 px-4">₹1,00,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">Above ₹24L</td>
                  <td className="text-center py-3 px-4">30%</td>
                  <td className="text-center py-3 px-4">30% of excess</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* List Snippet: Tax Saving Strategies */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Top Tax Saving Strategies for Salaried Employees</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1.</span>
              <span><strong>Maximize Section 80C Deductions:</strong> Invest up to ₹1.5 lakh in PPF, ELSS, Life Insurance, Home Loan Principal, or Tuition Fees to reduce taxable income.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2.</span>
              <span><strong>Claim HRA Exemption:</strong> If renting, claim HRA against rent paid (max 40%-50% of salary, but varies by city and employer policy).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3.</span>
              <span><strong>Deduct Home Loan Interest (Section 24b):</strong> Claim up to ₹2 lakh annual deduction on home loan interest for self-occupied property.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4.</span>
              <span><strong>Invest in Health Insurance (Section 80D):</strong> Deduct health insurance premiums for self and family (₹25,000 regular/₹50,000 senior citizens).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">5.</span>
              <span><strong>Donate to Charity (Section 80G):</strong> Donations to approved charities qualify for 50%-100% deduction depending on type.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">6.</span>
              <span><strong>Education Loan Interest (Section 80E):</strong> Full deduction of education loan interest (no limit) for up to 8 years.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">7.</span>
              <span><strong>NPS Contribution (Section 80CCD):</strong> Additional ₹50,000 deduction on top of ₹1.5L 80C limit (employee contribution).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">8.</span>
              <span><strong>Rent Receipt for LTA Claim:</strong> Always maintain rent receipts for LTA exemption claims (₹10,000 to ₹16,000 per year typically).</span>
            </li>
          </ol>
        </div>

        {/* Comparison Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">New vs Old Tax Regime: Which Should You Choose?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> New Regime (Default)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3"><strong>Lower tax rates, no deductions (except specific ones)</strong></p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2"><strong>Pros:</strong> Lower tax rates, rebate up to ₹60K, standard deduction of ₹75K</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Cons:</strong> No HRA, LTA, 80C, 80D deductions</p>
            </div>
            <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Clock className="w-5 h-5 flex-shrink-0 text-gray-400" strokeWidth={2} aria-hidden="true" /> Old Regime</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3"><strong>Higher rates, but maximum deductions available</strong></p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2"><strong>Pros:</strong> HRA, LTA, 80C, 80D, 24b deductions allowed</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Cons:</strong> Higher tax rates, complex calculations</p>
            </div>
          </div>
          <div className="info-panel mt-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Verdict:</strong> The Old Regime only wins if your deductions (HRA + 80C + 80D + home loan) are very large — roughly ₹8 lakh or more at higher incomes. For most salaried people the New Regime is cheaper (income up to ₹12.75L is tax-free). Always calculate both and choose the one that gives lower tax!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> FAQs</h3>
        <div className="space-y-3">
          {[
            {
              q: 'When should I choose Old Regime?',
              a: 'Choose Old Regime if your deductions (80C, 80D, 24b) are substantial and reduce your taxable income below the New Regime threshold.',
            },
            {
              q: 'What is Section 87A Rebate?',
              a: 'Section 87A provides a tax rebate up to ₹60,000 (New Regime) if your income is ≤₹12L, or ₹12,500 (Old Regime) if income is ≤₹5L.',
            },
            {
              q: 'Can I claim HRA and LTA in New Regime?',
              a: 'No, HRA and LTA exemptions are only available under Old Regime. New Regime provides a flat ₹75,000 standard deduction instead.',
            },
            {
              q: 'Is NPS employer contribution allowed in both regimes?',
              a: 'Yes, Section 80CCD(2) employer NPS contribution is allowed as a deduction in both Old and New Regimes.',
            },
          ].map((faq, idx) => (
            <details key={idx} className="group cursor-pointer">
              <summary className="font-semibold text-gray-900 dark:text-white py-2 hover:text-blue-600 flex justify-between items-center">
                <span>{faq.q}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
              </summary>
              <p className="text-sm text-gray-600 dark:text-gray-400 py-2 ml-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('tax-calculator')} />

      <RelatedBlogPosts posts={getRelatedBlogPosts('/tax-calculator')} />
    </div>
  );
}
