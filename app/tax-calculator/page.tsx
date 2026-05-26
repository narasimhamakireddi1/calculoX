'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateTax, getTaxBreakdown } from '@/lib/calculators/tax';
import { TaxSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';

type TaxFormData = {
  income: number;
  regime: 'old' | 'new';
  age: 'below60' | 'between60to80' | 'above80';
};

interface TaxResultData {
  grossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  taxAmount: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  regime: string;
}

interface ComparisonData {
  regime: string;
  tax: number;
}

export default function TaxCalculatorPage() {
  const [result, setResult] = useState<TaxResultData | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [breakdowns, setBreakdowns] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TaxFormData>({
    resolver: zodResolver(TaxSchema),
    defaultValues: {
      income: 1000000,
      regime: 'new',
      age: 'below60',
    },
  });

  const watchValues = watch();

  const onSubmit = (data: TaxFormData) => {
    const result = calculateTax(data);
    setResult(result);

    // Calculate comparison with other regime
    const otherRegime = data.regime === 'new' ? 'old' : 'new';
    const comparisonResult = calculateTax({ ...data, regime: otherRegime });

    setComparisonData([
      { regime: 'New Regime', tax: result.totalTax },
      { regime: 'Old Regime', tax: comparisonResult.totalTax },
    ]);

    // Get tax breakdown
    const breakdown = getTaxBreakdown(data);
    setBreakdowns(breakdown);
  };


  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Income Tax Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate your income tax liability for India (FY 2024-25). Compare old and new tax regimes to find the best option for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Income Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Gross Income */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Gross Annual Income (₹)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="10000"
                  {...register('income', { valueAsNumber: true })}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 text-blue-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    max="10000000"
                    step="10000"
                    {...register('income', { valueAsNumber: true })}
                    className="w-32 px-6 py-2 pl-7 border-2 border-blue-400 rounded-lg text-right font-bold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
              {errors.income && (
                <p className="text-red-500 text-sm">{errors.income.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹0 - ₹1Cr</p>
            </div>

            {/* Tax Regime */}
            <div>
              <label className="block text-sm font-semibold mb-3">Tax Regime</label>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/30 p-1 rounded-lg">
                <label className="flex-1 flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200" style={{
                  backgroundColor: watchValues.regime === 'new' ? 'rgb(59, 130, 246)' : 'transparent',
                  color: watchValues.regime === 'new' ? 'white' : 'inherit'
                }}>
                  <input
                    type="radio"
                    value="new"
                    {...register('regime')}
                    className="w-4 h-4"
                  />
                  <span className={`font-semibold ${watchValues.regime === 'new' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>📉 New Regime</span>
                </label>
                <label className="flex-1 flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200" style={{
                  backgroundColor: watchValues.regime === 'old' ? 'rgb(239, 68, 68)' : 'transparent',
                  color: watchValues.regime === 'old' ? 'white' : 'inherit'
                }}>
                  <input
                    type="radio"
                    value="old"
                    {...register('regime')}
                    className="w-4 h-4"
                  />
                  <span className={`font-semibold ${watchValues.regime === 'old' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>📈 Old Regime</span>
                </label>
              </div>
              {errors.regime && (
                <p className="text-red-500 text-sm mt-2">{errors.regime.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {watchValues.regime === 'new'
                  ? 'Lower rates, minimal deductions'
                  : 'Allows 80C, 80D, 80E deductions'}
              </p>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold mb-3">Age Group</label>
              <select
                {...register('age')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-semibold bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <option value="below60">👤 Below 60 years</option>
                <option value="between60to80">👴 60-80 years (Senior Citizen)</option>
                <option value="above80">👨‍🦳 Above 80 years (Super Senior)</option>
              </select>
              {errors.age && (
                <p className="text-red-500 text-sm mt-2">{errors.age.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Age affects the tax slab exemptions. Senior citizens get higher deduction limits.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              🧮 Calculate Tax
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Note:</strong> This calculator applies a standard deduction of ₹50,000 and 4% Health & Education Cess.
              For accurate results, consult a tax professional.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Tax Calculation Results</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Gross Income */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide font-semibold mb-2">Gross Income</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(result.grossIncome)}
                  </p>
                </div>

                {/* Standard Deduction */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-5 rounded-lg border border-green-300 dark:border-green-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">✂️ Standard Deduction</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(result.standardDeduction)}
                  </p>
                </div>

                {/* Taxable Income */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">📊 Taxable Income</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {formatCurrency(result.taxableIncome)}
                  </p>
                </div>

                {/* Tax Amount */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 p-5 rounded-lg border border-orange-300 dark:border-orange-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-orange-700 dark:text-orange-300 text-xs uppercase tracking-wide font-semibold mb-2">💰 Income Tax</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                    {formatCurrency(result.taxAmount)}
                  </p>
                </div>

                {/* Cess */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-5 rounded-lg border border-purple-300 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">🏥 Health & Education Cess</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                    {formatCurrency(result.cess)}
                  </p>
                </div>

                {/* Total Tax - Highlighted */}
                <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 p-5 rounded-lg border-2 border-red-300 dark:border-red-700 shadow-lg hover:shadow-xl transition-all">
                  <p className="text-red-700 dark:text-red-300 text-xs uppercase tracking-wide font-semibold mb-2">🚨 Total Tax Payable</p>
                  <p className="text-4xl font-bold text-red-700 dark:text-red-400">
                    {formatCurrency(result.totalTax)}
                  </p>
                </div>

                {/* Effective Rate */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 p-5 rounded-lg border border-indigo-300 dark:border-indigo-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-indigo-700 dark:text-indigo-300 text-xs uppercase tracking-wide font-semibold mb-2">📈 Effective Rate</p>
                  <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                    {result.effectiveRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your income and select preferences to calculate tax
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Chart */}
      {result && comparisonData.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Old vs New Regime Comparison</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="regime" stroke="#6b7280" />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="tax" radius={[8, 8, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.regime.includes('New') ? '#3b82f6' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-700 dark:text-blue-400 font-semibold">New Regime Tax</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {formatCurrency(comparisonData[0]?.tax || 0)}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-red-700 dark:text-red-400 font-semibold">Old Regime Tax</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {formatCurrency(comparisonData[1]?.tax || 0)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-green-700 dark:text-green-400 font-semibold">Tax Difference</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(Math.abs((comparisonData[0]?.tax || 0) - (comparisonData[1]?.tax || 0)))}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  {(comparisonData[0]?.tax || 0) < (comparisonData[1]?.tax || 0) ? 'New Regime is better' : 'Old Regime is better'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Breakdown */}
      {result && breakdowns.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Tax Slab Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Income Range</th>
                  <th className="text-right py-3 px-4 font-semibold">Tax Rate</th>
                  <th className="text-right py-3 px-4 font-semibold">Income in Slab</th>
                  <th className="text-right py-3 px-4 font-semibold">Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                {breakdowns.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.slab}</td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-semibold">{row.rate}%</td>
                    <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">{formatCurrency(row.amount)}</td>
                    <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-semibold">{formatCurrency(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s the difference between old and new tax regime?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              <strong>New Regime:</strong> Lower tax rates but no deductions (except standard deduction). Suitable for salaried employees.
              <br />
              <strong>Old Regime:</strong> Higher tax rates but allows deductions like 80C (investments), 80D (insurance), 80E (education loan), etc. Better for those with significant deductible expenses.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is standard deduction?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Standard deduction is ₹50,000 for FY 2024-25. It&apos;s a fixed amount deducted from your gross income before calculating tax, available in both old and new regimes.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is Health & Education Cess?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Health & Education Cess is 4% of the income tax amount. It&apos;s an additional tax collected by the government and is applicable in both tax regimes.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              How can I reduce my tax liability?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              <strong>In Old Regime:</strong> Invest in Section 80C (₹1.5L limit), buy health insurance (80D), repay education loan (80E).
              <br />
              <strong>In New Regime:</strong> Very limited options. Consider switching to old regime if you have deductible expenses.
              <br />
              <strong>Both:</strong> Contribute to NPS, claim HRA exemption, use other income exemptions as applicable.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              How is effective tax rate calculated?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Effective tax rate = (Total Tax / Gross Income) × 100. It shows what percentage of your total income goes towards taxes. A lower effective rate is better.
            </p>
          </details>
        </div>
      </div>

      {/* Tax Saving Tips */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Tax Saving Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-400">Section 80C (₹1.5 Lakh)</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Life Insurance Premium</li>
              <li>• ELSS (Equity Linked Savings Scheme)</li>
              <li>• Public Provident Fund (PPF)</li>
              <li>• Sukanya Samriddhi Scheme</li>
              <li>• Home Loan Principal Payment</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-green-700 dark:text-green-400">Other Deductions</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• 80D: Health Insurance (₹25,000-₹50,000)</li>
              <li>• 80E: Education Loan Interest (No limit)</li>
              <li>• NPS: National Pension Scheme (₹2,50,000)</li>
              <li>• 80DD: Disability (₹75,000-₹1,25,000)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
