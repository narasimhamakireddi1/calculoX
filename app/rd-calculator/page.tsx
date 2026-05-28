'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateRD, generateRDProjection } from '@/lib/calculators/rd';
import { RDSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import ExportButton from '@/components/ui/ExportButton';

type RDFormData = {
  monthlyDeposit: number;
  annualRate: number;
  months: number;
};

interface RDResultData {
  maturityAmount: number;
  totalDeposits: number;
  totalInterest: number;
}

interface MonthlyProjection {
  month: number;
  deposit: number;
  amount: number;
  interest: number;
}

export default function RDCalculatorPage() {
  const [result, setResult] = useState<RDResultData | null>(null);
  const [projections, setProjections] = useState<MonthlyProjection[]>([]);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<RDFormData>({
    resolver: zodResolver(RDSchema),
    defaultValues: {
      monthlyDeposit: 5000,
      annualRate: 6,
      months: 36,
    },
  });

  const watchValues = watch();

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    monthlyDeposit: { min: 1000, max: 10000000, label: 'Monthly Deposit (₹)' },
    annualRate: { min: 0, max: 20, label: 'Annual Rate (%)' },
    months: { min: 1, max: 600, label: 'Months' },
  };

  const handleInputChange = (fieldName: keyof RDFormData, value: number) => {
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

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.monthlyDeposit && watchValues.annualRate !== undefined && watchValues.months) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues]);

  const calculateResults = (data: RDFormData) => {
    const result = calculateRD(data);
    setResult(result);
    const projections = generateRDProjection(data);
    setProjections(projections);
  };

  const chartData = useMemo(() => {
    return projections.filter((_, idx) => idx % 12 === 11 || idx === projections.length - 1);
  }, [projections]);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">💳 RD Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate maturity amount and interest for your Recurring Deposits
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Deposit Details</h2>
          <form  className="space-y-6">
            {/* Monthly Deposit */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Monthly Deposit (₹)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={watchValues.monthlyDeposit === 0 ? "" : watchValues.monthlyDeposit}
                  onChange={(e) => handleInputChange('monthlyDeposit', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('monthlyDeposit', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  type="number" placeholder="0"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={watchValues.monthlyDeposit === 0 ? "" : watchValues.monthlyDeposit}
                  onChange={(e) => handleInputChange('monthlyDeposit', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('monthlyDeposit', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.monthlyDeposit && <p className="text-red-500 text-sm">{errors.monthlyDeposit.message}</p>}
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
                  value={watchValues.annualRate === 0 ? "" : watchValues.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number" placeholder="0"
                  min="0"
                  max="20"
                  step="0.1"
                  value={watchValues.annualRate === 0 ? "" : watchValues.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.annualRate && <p className="text-red-500 text-sm">{errors.annualRate.message}</p>}
            </div>

            {/* Months */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Tenure (Months)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="1"
                  max="600"
                  step="1"
                  value={watchValues.months === 0 ? "" : watchValues.months}
                  onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <input
                  type="number" placeholder="0"
                  min="1"
                  max="600"
                  step="1"
                  value={watchValues.months === 0 ? "" : watchValues.months}
                  onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                />
              </div>
              {errors.months && <p className="text-red-500 text-sm">{errors.months.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">1 to 600 months (50 years)</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                💳 Calculate Maturity
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
            <div id="rd-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Maturity Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    💰 Maturity Amount
                  </p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(result.maturityAmount)}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-5 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    🏦 Total Invested
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{formatCurrency(result.totalDeposits)}</p>
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
              <div className="mt-6">
                <ExportButton
                  fileName="RD_Results"
                  calculatorName="Recurring Deposit Results"
                  resultElementId="rd-results"
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter your RD details and click Calculate to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">📈 RD Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  formatter={(v) => formatCurrency(v as number)}
                  labelFormatter={(l) => `Month ${l}`}
                />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Total Amount" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="interest" stroke="#10b981" name="Interest Earned" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          {result && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">💰 RD Breakup</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Total Deposited', value: result.totalDeposits },
                      { name: 'Interest Earned', value: result.totalInterest },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v as number)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-sm px-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Total Deposited</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.totalDeposits)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">Interest Earned</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.totalInterest)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is a Recurring Deposit?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              A Recurring Deposit (RD) is a savings scheme where you deposit a fixed amount monthly for a specified period. It helps build discipline in saving and offers fixed returns with compound interest.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What are the benefits of RD over savings account?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              RD offers higher interest rates compared to regular savings accounts, promotes regular saving habit, has flexible tenure options, and provides fixed returns with compound interest.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Can I break my RD before maturity?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, most banks allow premature withdrawal after a certain period (usually 6 months), but with penalty. After 1 year, you may get better withdrawal terms with minimal penalty.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What happens if I miss a monthly deposit?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              If you miss a monthly deposit, you can deposit it later with penalty. If you don&apos;t deposit within a specified period (usually 2-3 months), the RD account may be closed.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Is RD interest taxable?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, interest earned on RD is taxable income. Form 15G/15H is required if interest exceeds ₹40,000 (or ₹50,000 for senior citizens) annually.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

