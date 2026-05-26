'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateSimpleInterest, generateSimpleInterestProjection } from '@/lib/calculators/simple-interest';
import { SimpleInterestSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';

type SimpleInterestFormData = {
  principal: number;
  annualRate: number;
  years: number;
};

interface SimpleInterestResultData {
  simpleInterest: number;
  totalAmount: number;
}

interface YearlyProjection {
  year: number;
  principal: number;
  interest: number;
  totalAmount: number;
}

export default function SimpleInterestCalculatorPage() {
  const [result, setResult] = useState<SimpleInterestResultData | null>(null);
  const [projections, setProjections] = useState<YearlyProjection[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SimpleInterestFormData>({
    resolver: zodResolver(SimpleInterestSchema),
    defaultValues: {
      principal: 100000,
      annualRate: 8,
      years: 5,
    },
  });

  const watchValues = watch();

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    principal: { min: 1000, max: 100000000, label: 'Principal (₹)' },
    annualRate: { min: 0, max: 50, label: 'Annual Rate (%)' },
    years: { min: 1, max: 50, label: 'Years' },
  };

  const handleInputChange = (fieldName: keyof SimpleInterestFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleValidateField = (fieldName: string, value: number) => {
    const range = fieldRanges[fieldName];
    if (range && (value < range.min || value > range.max)) {
      alert(`${range.label} must be between ${range.min} and ${range.max}`);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setProjections([]);
  };

  const onSubmit = (data: SimpleInterestFormData) => {
    const result = calculateSimpleInterest(data);
    setResult(result);
    const projections = generateSimpleInterestProjection(data);
    setProjections(projections);
  };

  const chartData = useMemo(() => {
    return projections;
  }, [projections]);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">📊 Simple Interest Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate simple interest on your investments using the formula SI = P × R × T / 100
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Principal */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Principal Amount (₹)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="1000"
                  max="100000000"
                  step="1000"
                  value={watchValues.principal || 100000}
                  onChange={(e) => handleInputChange('principal', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  type="number"
                  min="1000"
                  max="100000000"
                  step="1000"
                  value={watchValues.principal || 100000}
                  onChange={(e) => handleInputChange('principal', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.principal && <p className="text-red-500 text-sm">{errors.principal.message}</p>}
            </div>

            {/* Annual Rate */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Annual Interest Rate (%)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.1"
                  value={watchValues.annualRate || 8}
                  onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={watchValues.annualRate || 8}
                  onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.annualRate && <p className="text-red-500 text-sm">{errors.annualRate.message}</p>}
            </div>

            {/* Years */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Time Period (Years)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={watchValues.years || 5}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={watchValues.years || 5}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                />
              </div>
              {errors.years && <p className="text-red-500 text-sm">{errors.years.message}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                📊 Calculate Interest
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                🗑️ Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Interest Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    💰 Simple Interest
                  </p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(result.simpleInterest)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    🎯 Total Amount
                  </p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalAmount)}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded mt-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Formula:</strong> Simple Interest = P × R × T / 100, where P = Principal, R = Rate, T = Time
                </p>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter investment details and click Calculate</p>
            </div>
          )}
        </div>
      </div>

      {/* Projection Table */}
      {projections.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 Year-by-Year Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Year</th>
                  <th className="px-4 py-3 text-right font-semibold">Interest (₹)</th>
                  <th className="px-4 py-3 text-right font-semibold">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((proj, idx) => (
                  <tr
                    key={idx}
                    className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'} border-b border-gray-200 dark:border-gray-700`}
                  >
                    <td className="px-4 py-3 font-semibold">{proj.year}</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400 font-semibold">
                      {formatCurrency(proj.interest)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(proj.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📈 Simple Interest Growth</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                formatter={(v) => formatCurrency(v as number)}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Legend />
              <Line type="monotone" dataKey="totalAmount" stroke="#3b82f6" name="Total Amount" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="interest" stroke="#10b981" name="Interest Earned" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is Simple Interest?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Simple Interest is interest calculated only on the principal amount. It remains constant throughout the investment period and is calculated using the formula: SI = P × R × T / 100.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What&apos;s the difference between Simple Interest and Compound Interest?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Simple Interest is calculated only on principal, while Compound Interest is calculated on principal plus accumulated interest. Compound Interest grows faster than Simple Interest over time.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Which investments use Simple Interest?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Simple Interest is commonly used in bonds, treasury bills, and some loan products. Most savings accounts and fixed deposits use Compound Interest for better returns.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How to calculate Simple Interest manually?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Use the formula SI = P × R × T / 100. For example, if Principal is ₹1,00,000, Rate is 8% p.a., and Time is 5 years, then SI = 100000 × 8 × 5 / 100 = ₹40,000.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Is Simple Interest taxable?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, Simple Interest earned is treated as income and is subject to income tax as per your tax slab. You must declare it in your income tax return.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
