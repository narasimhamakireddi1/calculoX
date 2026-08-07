'use client';

import { useState, useCallback } from 'react';
import { BarChart2, Rocket, Target, Coins, Clock, HelpCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { EMICalculatorCore, type EMIFormData, type EMIResultData } from '@/components/emi/EMICalculatorCore';
import { calculateEMI } from '@/lib/calculators/emi';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { RelatedBlogPosts } from '@/components/ui/RelatedBlogPosts';
import { getRelatedBlogPosts } from '@/lib/blog/utils';
import { getInternalLinks } from '@/config/internal-links.config';

const DEFAULT_SEO_VALUES: EMIFormData = { principal: 1000000, annualRate: 8.5, years: 5 };
const DEFAULT_SEO_RESULT = calculateEMI(DEFAULT_SEO_VALUES);

export default function EMICalculatorPage() {
  // Mirrors EMICalculatorCore's live result/inputs so the SEO sections below stay
  // reactive to what the user actually entered (same behavior as before the
  // EMICalculatorCore extraction — see onResultChange doc comment on the component).
  const [seoResult, setSeoResult] = useState<EMIResultData>(DEFAULT_SEO_RESULT);
  const [seoValues, setSeoValues] = useState<EMIFormData>(DEFAULT_SEO_VALUES);

  const handleResultChange = useCallback((result: EMIResultData | null, watchValues: EMIFormData) => {
    if (result) setSeoResult(result);
    setSeoValues(watchValues);
  }, []);

  return (
    <div className="space-y-8 py-8">
      <EMICalculatorCore onResultChange={handleResultChange} />

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is EMI?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            EMI (Equated Monthly Installment) is a fixed monthly payment made by a borrower to repay a loan. The EMI includes both principal and interest components, calculated using the formula: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">EMI = [P×R×(1+R)^N]/[(1+R)^N-1]</span> where P is the loan amount, R is the monthly interest rate, and N is the number of months.
          </p>
        </div>

        {/* List Snippet: How to Reduce EMI */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">How to Reduce Your Loan EMI?</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1.</span>
              <span><strong>Make a Larger Down Payment:</strong> Increasing your down payment reduces the loan principal, which directly lowers the EMI amount.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2.</span>
              <span><strong>Choose a Longer Loan Tenure:</strong> Extending the loan duration spreads the payment over more months, reducing the monthly EMI (but increases total interest paid).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3.</span>
              <span><strong>Negotiate a Better Interest Rate:</strong> Shopping around with different lenders or negotiating with your bank can secure a lower interest rate, reducing your EMI.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4.</span>
              <span><strong>Make Prepayments:</strong> Paying lump sums toward the principal reduces the outstanding balance and future EMI amounts.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">5.</span>
              <span><strong>Switch to a Better Lender:</strong> If you have improved credit, consider refinancing with a lender offering better rates.</span>
            </li>
          </ol>
        </div>

        {/* Comparison Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">EMI vs Flat Rate Interest: Which is Better?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><BarChart2 className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> EMI (Reducing Balance)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Interest calculated on the reducing balance monthly. More interest is paid upfront, less later.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Total Interest:</strong> Lower | <strong>Early Payment:</strong> Better savings</p>
            </div>
            <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Coins className="w-4 h-4 flex-shrink-0 text-gray-400" strokeWidth={2} aria-hidden="true" /> Flat Rate Interest</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Interest calculated as a fixed percentage of the original principal throughout the loan tenure.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Total Interest:</strong> Higher | <strong>Early Payment:</strong> Limited benefit</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Verdict:</strong> EMI with reducing balance is significantly better for borrowers. You pay less total interest and benefit more from early repayment. Most Indian banks use the EMI method.
            </p>
          </div>
        </div>

        {/* Is Your EMI Sustainable */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Is Your EMI Sustainable? The 40% Rule</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Financial experts recommend that your total EMI (including all loans) should not exceed 40% of your monthly gross income. This is called the "40% rule" and ensures you have sufficient funds for living expenses, savings, and emergencies.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-1"><Target className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Quick Assessment:</p>
              <p className="text-sm">If your monthly EMI is ₹{formatCurrency(seoResult.emi).replace('₹', '')}, you should have a gross monthly income of at least ₹{formatCurrency(seoResult.emi * 2.5).replace('₹', '')} to stay within the 40% rule.</p>
            </div>
            <p className="text-sm">
              <strong>Why does this matter?</strong> Keeping your EMI within 40% of income ensures you can handle unexpected expenses, maintain an emergency fund, invest for retirement, and avoid financial stress during economic downturns.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-2">
              <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1"><Target className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Income Verification Tips:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Banks typically verify last 2 years of income (salary slips, IT returns)</li>
                <li>Self-employed: 3 years of audited accounts required</li>
                <li>Co-applicant income can be added to improve loan eligibility</li>
                <li>Bonuses count only if received consistently for 2+ years</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Reduce EMI */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Strategic Ways to Reduce Your EMI & Save Interest</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="info-panel">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Coins className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Maximize Down Payment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Increasing your down payment from 20% to 40% can reduce your loan principal by ₹{formatCurrency((seoResult.totalAmount - seoResult.emi * (seoValues.years * 12)) * 0.2).replace('₹', '')}, which directly lowers EMI.</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Example: ₹50L home with 20% down vs 40% down reduces EMI by ₹10,000-15,000/month</p>
              </div>

              <div className="info-panel">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Target className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Negotiate Better Rate</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Even 0.5% reduction in interest rate saves substantial interest. At ₹50L loan, 0.5% cut saves ₹{formatCurrency((seoResult.totalAmount - (seoResult.emi * seoValues.years * 12)) * 0.15).replace('₹', '')} over tenure.</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Negotiation factors: CIBIL score {'>'} 750, existing customer, bulk loans</p>
              </div>

              <div className="info-panel">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Clock className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Extend Tenure Strategically</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Longer tenure reduces monthly EMI but increases total interest. 20-year vs 30-year tenure reduces EMI by 30% but adds ~45% more total interest.</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Strategy: Balance EMI comfort with interest cost</p>
              </div>

              <div className="info-panel">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Rocket className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Prepay Strategically</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Annual bonuses or surplus income can be prepaid toward principal. Prepaying ₹5L in year 5 saves ₹10-15L in total interest on 20-year loans.</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Check prepayment penalties before pursuing this strategy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Tips */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Lightbulb className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Expert Insights on Loan Management</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">1. Understand Your Amortization Schedule</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Early EMI payments are mostly interest. In the first 5 years of a 20-year loan, 70% goes toward interest. Review the amortization table to see your exact principal-to-interest breakdown each month.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">2. Rate Lock & Market Monitoring</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Monitor RBI repo rate changes. When rates fall, refinance your loan. If rates are expected to rise, lock in fixed rates. Current home loan rates: 8.0-9.5% depending on bank and credit profile.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">3. CIBIL Score Impact</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Your credit score directly affects interest rate. Score 750+: Best rates (8.0-8.5%) | Score 700-749: Standard rates (8.5-9.2%) | Score below 700: Expect 9.5%+. Improve your score before applying to save significantly.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">4. Floating vs Fixed Rate Trade-off</p>
              <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Floating:</strong> 0.3-0.5% cheaper, varies with RBI rate | <strong>Fixed:</strong> Stable EMI, peace of mind. Choose floating if rates expected to fall, fixed if rates might rise.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">5. Insurance & Emergency Fund</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Banks require home loan insurance. Also maintain 6-months of EMI in emergency fund. For ₹31,040 EMI, keep ₹1,86,240 emergency corpus in high-yield savings (FD/liquid funds).</p>
            </div>
          </div>
        </div>

        {/* Table Snippet: EMI for Different Loan Amounts */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">EMI for Different Loan Amounts @ 8.5% Interest</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Loan Amount</th>
                  <th className="text-center py-3 px-4 font-bold">5 Years (EMI)</th>
                  <th className="text-center py-3 px-4 font-bold">10 Years (EMI)</th>
                  <th className="text-center py-3 px-4 font-bold">20 Years (EMI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹10 Lakh</td>
                  <td className="text-center py-3 px-4">₹20,138</td>
                  <td className="text-center py-3 px-4">₹11,455</td>
                  <td className="text-center py-3 px-4">₹7,726</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹25 Lakh</td>
                  <td className="text-center py-3 px-4">₹50,344</td>
                  <td className="text-center py-3 px-4">₹28,638</td>
                  <td className="text-center py-3 px-4">₹19,314</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹50 Lakh</td>
                  <td className="text-center py-3 px-4">₹1,00,689</td>
                  <td className="text-center py-3 px-4">₹57,275</td>
                  <td className="text-center py-3 px-4">₹38,629</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹1 Crore</td>
                  <td className="text-center py-3 px-4">₹2,01,378</td>
                  <td className="text-center py-3 px-4">₹1,14,549</td>
                  <td className="text-center py-3 px-4">₹77,258</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('emi-calculator')} />

      <RelatedBlogPosts posts={getRelatedBlogPosts('/emi-calculator')} />


      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is EMI?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              EMI (Equated Monthly Installment) is the fixed amount you pay every month to repay a loan. It includes both principal and interest components, structured so that the total interest is spread evenly across the loan tenure.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              How is EMI calculated?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              EMI is calculated using the formula: EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1], where P is the principal, R is the monthly interest rate, and N is the number of months. Higher principal or rate increases EMI; longer tenure decreases it.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              Can I pay EMI early?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, most loans allow prepayment or early repayment. Paying early reduces the total interest paid. Check with your lender for any prepayment penalties, as some banks charge a small fee for early closure.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What affects EMI amount?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              EMI is affected by three factors: (1) Loan amount - higher principal means higher EMI, (2) Interest rate - higher rate increases EMI, (3) Loan duration - longer tenure reduces EMI but increases total interest paid.
            </p>
          </details>
        </div>
      </div>

    </div>
  );
}
