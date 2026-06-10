'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculateRD, generateRDProjection } from '@/lib/calculators/rd';
import { RDSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { getInternalLinks } from '@/config/internal-links.config';
import { useSwipeGesture } from '@/lib/hooks/useSwipeGesture';
import { SwipeHint } from '@/components/mobile/SwipeHint';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

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

  const haptic = useHapticFeedback();

  const handleReset = useCallback(() => {
    haptic.trigger('warning');
    reset();
    setResult(null);
    setProjections([]);
  }, [reset, haptic]);

  // Quick-start scenarios
  const rdScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Starter Plan',
      description: '₹1,000/month for 2 years',
      icon: '🚀',
      values: { monthlyDeposit: 1000, annualRate: 6.5, months: 24 }
    },
    {
      label: 'Regular Saver',
      description: '₹5,000/month for 5 years',
      icon: '💰',
      values: { monthlyDeposit: 5000, annualRate: 7, months: 60 }
    },
    {
      label: 'Long-Term Growth',
      description: '₹10,000/month for 10 years',
      icon: '📈',
      values: { monthlyDeposit: 10000, annualRate: 7.2, months: 120 }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof RDFormData, Number(value), { shouldValidate: true });
    });
  }, [setValue]);

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

  // Swipe navigation to related calculators (mobile only)
  const router = useRouter();
  const relatedCalcs = getInternalLinks('rd-calculator').slice(0, 5);
  const currentIndex = 0;

  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    threshold: 50,
    onSwipe: (direction) => {
      if (direction === 'left' && currentIndex < relatedCalcs.length - 1) {
        router.push(relatedCalcs[currentIndex + 1].href);
      } else if (direction === 'right' && currentIndex > 0) {
        router.push(relatedCalcs[currentIndex - 1].href);
      }
    }
  });

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient inline-flex items-center gap-3">
          <CalculatorIcon idOrHref="rd" className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0" />
          <span>RD Calculator</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate maturity amount and interest for your Recurring Deposits
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div id="rd-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Deposit Details</h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={rdScenarios}
            onSelectScenario={handleSelectScenario}
          />

          <form  className="space-y-6">
            {/* Monthly Deposit */}
            <div className="space-y-3">
              <label htmlFor="monthly-deposit" className="block text-sm font-bold text-gray-900 dark:text-white">Monthly Deposit (₹)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
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
                  id="monthly-deposit"
                  type="number" placeholder="0"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={watchValues.monthlyDeposit === 0 ? "" : watchValues.monthlyDeposit}
                  onChange={(e) => handleInputChange('monthlyDeposit', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('monthlyDeposit', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.monthlyDeposit && <p className="text-red-500 text-sm">{errors.monthlyDeposit.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {[1000, 2000, 5000, 10000].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('monthlyDeposit', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                               bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                               hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                    ₹{val / 1000}K
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 RD is a savings tool with fixed returns. Discipline-friendly alternative to SIP with bank guarantee
              </p>
            </div>

            {/* Annual Rate */}
            <div className="space-y-3">
              <label htmlFor="rate-rd" className="block text-sm font-bold text-gray-900 dark:text-white">Annual Interest Rate (%)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
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
                  id="rate-rd"
                  type="number" placeholder="0"
                  min="0"
                  max="20"
                  step="0.1"
                  value={watchValues.annualRate === 0 ? "" : watchValues.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.annualRate && <p className="text-red-500 text-sm">{errors.annualRate.message}</p>}
            </div>

            {/* Months */}
            <div className="space-y-3">
              <label htmlFor="months-rd" className="block text-sm font-bold text-gray-900 dark:text-white">Tenure (Months)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
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
                  id="months-rd"
                  type="number" placeholder="0"
                  min="1"
                  max="600"
                  step="1"
                  value={watchValues.months === 0 ? "" : watchValues.months}
                  onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                />
              </div>
              {errors.months && <p className="text-red-500 text-sm">{errors.months.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">1 to 600 months (50 years)</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              🗑️ Clear
            </button>

            {/* Formula Reference */}
            <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3">📐 Formula Reference</h4>
              <div className="space-y-2 text-xs text-indigo-800 dark:text-indigo-200">
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded border border-indigo-200 dark:border-indigo-700">
                  A = P × [((1+r)^n-1)/r] × (1+r)
                </p>
                <p><strong>Where:</strong> P = Monthly Deposit | r = Monthly Rate | n = Total Months</p>
                <p><strong>Interest:</strong> Total Interest = Maturity Amount - Total Deposits</p>
              </div>
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
                  <p className="text-xl sm:text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 break-words overflow-hidden">{formatCurrency(result.maturityAmount)}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-5 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    🏦 Total Invested
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-400 break-words overflow-hidden">{formatCurrency(result.totalDeposits)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📈 Total Interest Earned
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 break-words overflow-hidden">{formatCurrency(result.totalInterest)}</p>
                </div>
              </div>

              {/* Understanding Your RD */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">📚 Understanding Your RD Results</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  A Recurring Deposit is a savings instrument where you deposit a fixed amount monthly and earn compound interest. Your money grows through regular deposits + accumulated interest.
                </p>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Monthly Deposit:</strong> {formatCurrency(watchValues.monthlyDeposit)} - Amount you'll invest every month</p>
                  <p><strong>Total Invested:</strong> {formatCurrency(result.totalDeposits)} - Sum of all your monthly deposits over {watchValues.months} months</p>
                  <p><strong>Interest Earned:</strong> {formatCurrency(result.totalInterest)} - Compound interest on your deposits at {watchValues.annualRate}% p.a.</p>
                  <p><strong>Maturity Amount:</strong> {formatCurrency(result.maturityAmount)} - Total amount you'll receive on maturity</p>
                </div>
              </div>

              {/* Key Insights */}
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-300 dark:border-green-700">
                <h3 className="font-bold text-green-900 dark:text-green-300 mb-3">✨ Key Insights</h3>
                <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <p>
                    <strong>Growth Multiple:</strong> <span className="font-bold text-green-700 dark:text-green-300">{(result.maturityAmount / result.totalDeposits).toFixed(2)}x</span> - Your invested amount grows by {((result.maturityAmount / result.totalDeposits - 1) * 100).toFixed(1)}%
                  </p>
                  <p>
                    <strong>Interest vs Investment:</strong> You earn {formatCurrency(result.totalInterest)} interest on {formatCurrency(result.totalDeposits)} invested
                  </p>
                  <p>
                    <strong>Monthly Returns:</strong> {formatCurrency(result.maturityAmount / watchValues.months)} average per month over your entire tenure
                  </p>
                  <p>
                    <strong>Interest Rate Impact:</strong> At {watchValues.annualRate}% p.a., your money compounds monthly for maximum returns
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded mt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This calculator provides an estimate. Actual maturity amount may vary based on the bank&apos;s terms and conditions. Please consult your bank for exact figures.
                </p>
              </div>
              <div className="mt-6">
                <ShareButtons
                  inputs={[
                    { label: 'Monthly Deposit', value: formatCurrency(watchValues.monthlyDeposit) },
                    { label: 'Annual Interest Rate', value: `${watchValues.annualRate}%` },
                    { label: 'Tenure', value: (() => { const y = Math.floor(watchValues.months / 12); const m = watchValues.months % 12; return y > 0 ? `${y}Y ${m}M` : `${m}M`; })() }
                  ]}
                  outputs={[
                    { label: 'Maturity Amount', value: formatCurrency(result.maturityAmount) },
                    { label: 'Total Invested', value: formatCurrency(result.totalDeposits) },
                    { label: 'Total Interest Earned', value: formatCurrency(result.totalInterest) }
                  ]}
                  calculatorName="Recurring Deposit Calculator"
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
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#000000',
                  }}
                  wrapperStyle={{ outline: 'none' }}
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
              <MemoizedPieChart
                data={[
                  { name: 'Total Deposited', value: result.totalDeposits },
                  { name: 'Interest Earned', value: result.totalInterest },
                ]}
                colors={['#3b82f6', '#10b981']}
                height={300}
              />
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

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is Recurring Deposit (RD)?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            A Recurring Deposit (RD) is a savings scheme offered by banks where you invest a fixed amount (e.g., ₹500, ₹1000, ₹5000) monthly for a specified tenure (usually 6 months to 10 years) and earn compound interest on it. Unlike Fixed Deposits where you invest a lump sum, RD allows you to save small amounts regularly, making it ideal for salaried employees. Banks typically offer RD interest rates of 5-7%, higher than savings accounts but lower than FDs.
          </p>
        </div>

        {/* Comparison: RD vs SIP vs FD */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">RD vs SIP vs Fixed Deposit: Which is Right for You?</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">📊 RD</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">Monthly deposits, bank guaranteed, fixed returns</p>
              <p className="text-xs"><strong>Rate:</strong> 5-7% | <strong>Risk:</strong> Nil | <strong>Liquidity:</strong> Low</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">🔄 SIP</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">Monthly investment in mutual funds, market-linked</p>
              <p className="text-xs"><strong>Rate:</strong> 10-15% | <strong>Risk:</strong> Medium | <strong>Liquidity:</strong> High</p>
            </div>
            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">🔐 FD</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">Lump sum deposit, bank guaranteed, fixed returns</p>
              <p className="text-xs"><strong>Rate:</strong> 7-8% | <strong>Risk:</strong> Nil | <strong>Liquidity:</strong> Low</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Best Choice:</strong> RD if you save monthly with zero risk appetite; SIP if you can afford monthly investments and want higher growth; FD if you have lump sum savings.
            </p>
          </div>
        </div>

        {/* Table: RD Returns Comparison */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">RD Maturity Amount @ 6% Interest Rate</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Monthly Deposit</th>
                  <th className="text-center py-3 px-4 font-bold">2 Years</th>
                  <th className="text-center py-3 px-4 font-bold">5 Years</th>
                  <th className="text-center py-3 px-4 font-bold">10 Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹1,000</td>
                  <td className="text-center py-3 px-4">₹24,733</td>
                  <td className="text-center py-3 px-4">₹65,696</td>
                  <td className="text-center py-3 px-4">₹1,47,209</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹5,000</td>
                  <td className="text-center py-3 px-4">₹1,23,665</td>
                  <td className="text-center py-3 px-4">₹3,28,482</td>
                  <td className="text-center py-3 px-4">₹7,36,047</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹10,000</td>
                  <td className="text-center py-3 px-4">₹2,47,330</td>
                  <td className="text-center py-3 px-4">₹6,56,965</td>
                  <td className="text-center py-3 px-4">₹14,72,094</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* List: RD Benefits */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">5 Key Advantages of Recurring Deposits</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1.</span>
              <span><strong>Builds Saving Habit:</strong> Monthly deposits enforce disciplined saving, making it perfect for salaried professionals.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2.</span>
              <span><strong>Higher Returns:</strong> RD interest (5-7%) is significantly higher than savings account interest (2-3%).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3.</span>
              <span><strong>Safe & Guaranteed:</strong> 100% capital protection and guaranteed returns, unlike market-linked investments.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4.</span>
              <span><strong>Loan Against RD:</strong> Use your RD as collateral to get loans at rates 1-2% above RD interest rate.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">5.</span>
              <span><strong>Flexible Tenure:</strong> Choose from 6 months to 10 years based on your savings goal and timeline.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('rd-calculator')} />

      {/* Featured Snippet Sections for SEO */}
      {/* Definition Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">What is a Recurring Deposit (RD)?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          A Recurring Deposit (RD) is a flexible savings and investment scheme offered by banks where you deposit a fixed amount every month for a predetermined tenure (usually 3 months to 10 years). The bank pays you compound interest on your deposits, making RD an excellent tool for building wealth systematically. The formula for calculating RD maturity is: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">A = P × [((1+r)^n-1)/r] × (1+r)</span>, where P is monthly deposit, r is monthly interest rate, and n is number of months.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          RD is ideal for salaried individuals who receive regular income and want to invest disciplined, fixed amounts monthly. It builds savings discipline while offering guaranteed returns with compound interest, making it less risky than equity investments and more rewarding than regular savings accounts.
        </p>
      </div>

      {/* Table Snippet - RD Maturity at Different Rates */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">RD Maturity Amounts: Monthly Deposit of ₹5,000 at Different Interest Rates</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Time Period</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">6% p.a.</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">7% p.a.</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">8% p.a.</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">9% p.a.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">1 Year (12 months)</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹61,644</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹61,885</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹62,128</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹62,373</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">2 Years (24 months)</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹125,847</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹127,101</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹128,395</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹129,727</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">3 Years (36 months)</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹192,849</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹195,632</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹198,535</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹201,562</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">5 Years (60 months)</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹328,679</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹334,850</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹341,431</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">₹348,446</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <strong>Note:</strong> Rates vary by bank and may change quarterly. Current bank RD rates range from 5.5% to 8.5% depending on the bank and tenure. Compare rates before opening an RD account.
        </p>
      </div>

      {/* How-to List Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">How to Calculate RD Maturity Amount in 5 Steps?</h2>
        <ol className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">1.</span>
            <div>
              <strong>Gather Your RD Details:</strong> Collect the monthly deposit amount (P), the annual interest rate offered by your bank (R), and the tenure in months (n). For example: Monthly deposit ₹5,000, Rate 8% p.a., Duration 3 years (36 months).
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">2.</span>
            <div>
              <strong>Convert Annual Rate to Monthly Rate:</strong> Banks compound interest quarterly or monthly. Divide the annual rate by 12 and convert to decimal: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">r = R / (100 × 12)</span>. For 8% p.a.: r = 8 / 1200 = 0.00667.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">3.</span>
            <div>
              <strong>Apply the RD Formula:</strong> Use the compound interest formula for RD: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">A = P × [((1+r)^n - 1) / r] × (1+r)</span>. This accounts for compound interest on all monthly deposits.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">4.</span>
            <div>
              <strong>Calculate Total Investment:</strong> Total amount invested = Monthly Deposit × Number of Months. For ₹5,000/month for 36 months: ₹5,000 × 36 = ₹1,80,000.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">5.</span>
            <div>
              <strong>Calculate Interest Earned:</strong> Interest earned = Maturity Amount - Total Investment. This shows your profit from the RD. For maturity of ₹2,05,000: Interest = ₹2,05,000 - ₹1,80,000 = ₹25,000 earned.
            </div>
          </li>
        </ol>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Real Example:</strong> ₹5,000 monthly for 3 years @ 8% p.a. → Monthly rate = 0.667%. Using the formula, maturity amount ≈ ₹1,98,535, meaning you invest ₹1,80,000 and earn ₹18,535 as interest through compound growth.
          </p>
        </div>
      </div>

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

      {/* Swipe navigation footer (mobile only) */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center md:hidden"
      >
        <SwipeHint
          hasLeft={currentIndex < relatedCalcs.length - 1}
          hasRight={currentIndex > 0}
          calculatorName="RD"
        />
      </div>

      {/* Padding for fixed footer on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
}

