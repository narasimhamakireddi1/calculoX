'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateFD, generateFDProjection } from '@/lib/calculators/fd';
import { FDSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';

type FDFormData = {
  principal: number;
  annualRate: number;
  years: number;
};

interface FDResultData {
  maturityAmount: number;
  totalInterest: number;
}

interface YearlyProjection {
  year: number;
  amount: number;
  interest: number;
}

export default function FDCalculatorPage() {
  const [result, setResult] = useState<FDResultData | null>(null);
  const [projections, setProjections] = useState<YearlyProjection[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FDFormData>({
    resolver: zodResolver(FDSchema),
    defaultValues: {
      principal: 0,
      annualRate: 0,
      years: 0,
    },
  });

  const watchValues = watch();

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    principal: { min: 10000, max: 100000000, label: 'Principal (₹)' },
    annualRate: { min: 0, max: 20, label: 'Annual Rate (%)' },
    years: { min: 1, max: 30, label: 'Years' },
  };

  const handleInputChange = (fieldName: keyof FDFormData, value: number) => {
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

  const onSubmit = (data: FDFormData) => {
    const result = calculateFD(data);
    setResult(result);
    const projections = generateFDProjection(data);
    setProjections(projections);
  };

  const chartData = useMemo(() => {
    return projections;
  }, [projections]);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🏦 FD Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate maturity amount and interest earned on your fixed deposits
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
                  min="10000"
                  max="100000000"
                  step="10000"
                  value={watchValues.principal ?? 0}
                  onChange={(e) => handleInputChange('principal', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  type="number"
                  min="10000"
                  max="100000000"
                  step="10000"
                  value={watchValues.principal ?? 0}
                  onChange={(e) => handleInputChange('principal', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.principal && <p className="text-red-500 text-sm">{errors.principal.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 to ₹10 Crore</p>
            </div>

            {/* Annual Rate */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Annual Interest Rate (%)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={watchValues.annualRate ?? 0}
                  onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={watchValues.annualRate ?? 0}
                  onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.annualRate && <p className="text-red-500 text-sm">{errors.annualRate.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">0.01% to 20%</p>
            </div>

            {/* Years */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Tenure (Years)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={watchValues.years ?? 0}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={watchValues.years ?? 0}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                />
              </div>
              {errors.years && <p className="text-red-500 text-sm">{errors.years.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">1 to 30 years</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                🏦 Calculate Maturity
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
              <h2 className="text-2xl font-bold mb-6">Maturity Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    💰 Maturity Amount
                  </p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(result.maturityAmount)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📈 Total Interest Earned
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalInterest)}</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded mt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This calculator provides an estimate. Actual maturity amount may vary based on the bank&apos;s terms and conditions. Please consult your bank for exact figures.
                </p>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter your FD details and click Calculate to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Projection Table */}
      {projections.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 Year-by-Year Projection</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Year</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount (₹)</th>
                  <th className="px-4 py-3 text-right font-semibold">Interest Earned (₹)</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((proj, idx) => (
                  <tr
                    key={idx}
                    className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'} border-b border-gray-200 dark:border-gray-700`}
                  >
                    <td className="px-4 py-3 font-semibold">{proj.year}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(proj.amount)}</td>
                    <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400 font-semibold">
                      {formatCurrency(proj.interest)}
                    </td>
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
          <h2 className="text-2xl font-bold mb-6">📈 FD Growth Visualization</h2>
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
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Total Amount" dot={false} strokeWidth={2} />
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
              What is a Fixed Deposit?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              A Fixed Deposit (FD) is a financial investment where you deposit a lump sum amount with a bank or financial institution for a fixed period at a predetermined interest rate. The money cannot be withdrawn before maturity without penalties.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How is FD interest calculated?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              FD interest is calculated using compound interest formula: A = P(1 + r)^t, where P is principal, r is annual rate, and t is time in years. Interest compounds annually in most cases.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is the minimum and maximum FD amount?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Minimum and maximum amounts vary by bank. Most banks have minimum FD of ₹1,000 to ₹10,000 and no fixed maximum. Check with your bank for their specific limits.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Can I withdraw from FD before maturity?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Most banks allow premature withdrawal, but with penalties. You may lose interest or get reduced interest. Some senior citizen accounts have more flexible rules.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Is FD interest taxable?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, FD interest is taxable income and should be declared in your income tax return. If interest exceeds ₹40,000 (or ₹50,000 for senior citizens) in a year, Form 15G/15H must be submitted.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
