'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { calculateFD, generateFDProjection, type PayoutType } from '@/lib/calculators/fd';
import { FDSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import ExportButton, { type FormattedInput } from '@/components/ui/ExportButton';

type FDFormData = {
  principal: number;
  annualRate: number;
  years: number;
  months: number;
  days: number;
  payoutType: PayoutType;
  seniorCitizen: boolean;
};

interface FDResultData {
  maturityAmount: number;
  totalInterest: number;
  periodicPayout?: number;
  tenure: {
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalDays: number;
  };
}

interface ProjectionRow {
  month: number;
  amount: number;
  interest: number;
  payout: number;
}

export default function FDCalculatorPage() {
  const [result, setResult] = useState<FDResultData | null>(null);
  const [projections, setProjections] = useState<ProjectionRow[]>([]);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FDFormData>({
    resolver: zodResolver(FDSchema),
    defaultValues: {
      principal: 100000,
      annualRate: 6.5,
      years: 2,
      months: 0,
      days: 0,
      payoutType: 'cumulative',
      seniorCitizen: false,
    },
  });

  const watchValues = watch();

  const inputsData: FormattedInput[] = useMemo(() => {
    const data: FormattedInput[] = [];
    if (watchValues.principal) {
      data.push({ label: 'Principal Amount', value: formatCurrency(watchValues.principal) });
    }
    if (watchValues.annualRate !== undefined) {
      const rateWithBonus = watchValues.seniorCitizen ? watchValues.annualRate + 0.5 : watchValues.annualRate;
      data.push({ label: 'Annual Interest Rate', value: `${rateWithBonus.toFixed(2)}%` });
    }
    if (watchValues.years || watchValues.months || watchValues.days) {
      const parts = [];
      if (watchValues.years > 0) parts.push(`${watchValues.years}Y`);
      if (watchValues.months > 0) parts.push(`${watchValues.months}M`);
      if (watchValues.days > 0) parts.push(`${watchValues.days}D`);
      data.push({ label: 'Tenure', value: parts.length > 0 ? parts.join(' ') : '0 days' });
    }
    if (watchValues.payoutType) {
      const payoutLabels = { cumulative: 'Cumulative', quarterly: 'Quarterly', monthly: 'Monthly' };
      data.push({ label: 'Payout Type', value: payoutLabels[watchValues.payoutType] });
    }
    if (watchValues.seniorCitizen) {
      data.push({ label: 'Senior Citizen', value: 'Yes (+0.50%)' });
    }
    return data;
  }, [watchValues]);

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    principal: { min: 10000, max: 100000000, label: 'Principal (₹)' },
    annualRate: { min: 0, max: 20, label: 'Annual Rate (%)' },
    years: { min: 0, max: 30, label: 'Years' },
    months: { min: 0, max: 11, label: 'Months' },
    days: { min: 0, max: 31, label: 'Days' },
  };

  const handleInputChange = (fieldName: keyof FDFormData, value: number | boolean) => {
    setValue(fieldName as keyof Omit<FDFormData, 'payoutType' | 'seniorCitizen'>, value as number, { shouldValidate: true });
  };

  const handlePayoutChange = (value: PayoutType) => {
    setValue('payoutType', value, { shouldValidate: true });
  };

  const handleSeniorCitizenChange = (value: boolean) => {
    setValue('seniorCitizen', value, { shouldValidate: true });
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
      if (watchValues.principal && watchValues.annualRate !== undefined) {
        const totalMonths = watchValues.years * 12 + watchValues.months;
        if (totalMonths > 0 || watchValues.days > 0) {
          calculateResults(watchValues);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues]);

  const calculateResults = (data: FDFormData) => {
    const result = calculateFD(data);
    setResult(result);
    const projections = generateFDProjection(data);
    setProjections(projections);
  };

  const chartData = useMemo(() => {
    return projections.length > 0 ? projections.slice(0, Math.min(projections.length, 24)) : [];
  }, [projections]);

  const isShortTerm = !!(
    watchValues.years === 0 &&
    watchValues.months < 6
  );

  const payoutLabel = {
    cumulative: '🔄 Cumulative (Reinvested)',
    quarterly: '📊 Quarterly Payout',
    monthly: '📅 Monthly Payout',
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🏦 Fixed Deposit (FD) Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          RBI-compliant FD calculator with support for multiple payout types (Cumulative, Quarterly, Monthly)
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div id="fd-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>
          <form className="space-y-6">
            {/* Principal */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Principal Amount (₹)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="10000"
                  max="100000000"
                  step="10000"
                  value={watchValues.principal === 0 ? '' : watchValues.principal}
                  onChange={(e) => handleInputChange('principal', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-emerald-300 to-emerald-600 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <input
                  type="number"
                  placeholder="0"
                  min="10000"
                  max="100000000"
                  step="10000"
                  value={watchValues.principal === 0 ? '' : watchValues.principal}
                  onChange={(e) => handleInputChange('principal', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-emerald-400 rounded-lg font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700"
                />
              </div>
              {errors.principal && <p className="text-red-500 text-sm">{errors.principal.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 to ₹10 Crore</p>
            </div>

            {/* Annual Rate */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">
                Annual Interest Rate (%)
                {watchValues.seniorCitizen && <span className="text-yellow-600 dark:text-yellow-400"> +0.5% (Senior)</span>}
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={watchValues.annualRate === 0 ? '' : watchValues.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="20"
                  step="0.1"
                  value={watchValues.annualRate === 0 ? '' : watchValues.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.annualRate && <p className="text-red-500 text-sm">{errors.annualRate.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">0.01% to 20%</p>
            </div>

            {/* Tenure - Years, Months, Days */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Tenure</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                {/* Years */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Years</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={watchValues.years === 0 ? '' : watchValues.years}
                      onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="30"
                      value={watchValues.years === 0 ? '' : watchValues.years}
                      onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                      className="w-14 px-2 py-1 border-2 border-orange-400 rounded text-sm font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                    />
                  </div>
                </div>

                {/* Months */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Months</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="range"
                      min="0"
                      max="11"
                      step="1"
                      value={watchValues.months === 0 ? '' : watchValues.months}
                      onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="11"
                      value={watchValues.months === 0 ? '' : watchValues.months}
                      onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                      className="w-14 px-2 py-1 border-2 border-purple-400 rounded text-sm font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700"
                    />
                  </div>
                </div>

                {/* Days */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Days</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="range"
                      min="0"
                      max="31"
                      step="1"
                      value={watchValues.days === 0 ? '' : watchValues.days}
                      onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-pink-300 to-pink-600 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="31"
                      value={watchValues.days === 0 ? '' : watchValues.days}
                      onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                      className="w-14 px-2 py-1 border-2 border-pink-400 rounded text-sm font-bold text-pink-700 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-700"
                    />
                  </div>
                </div>
              </div>
              {errors.years && <p className="text-red-500 text-sm">{errors.years.message}</p>}
              {errors.months && <p className="text-red-500 text-sm">{errors.months.message}</p>}
              {errors.days && <p className="text-red-500 text-sm">{errors.days.message}</p>}
              {isShortTerm && (
                <p className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                  ⚠️ Short-term FD (under 6 months) calculated using Simple Interest method
                </p>
              )}
            </div>

            {/* Payout Type */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Payout Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['cumulative', 'quarterly', 'monthly'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handlePayoutChange(type)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      watchValues.payoutType === type
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type === 'cumulative' && '🔄'}
                    {type === 'quarterly' && '📊'}
                    {type === 'monthly' && '📅'}
                    <span className="ml-1 text-xs capitalize">{type}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{payoutLabel[watchValues.payoutType]}</p>
            </div>

            {/* Senior Citizen */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watchValues.seniorCitizen}
                  onChange={(e) => handleSeniorCitizenChange(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-yellow-500"
                />
                <span className="text-sm font-bold text-gray-900 dark:text-white">Senior Citizen (Age 60+)</span>
              </label>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                {watchValues.seniorCitizen
                  ? `✅ +0.50% bonus rate applied to ${(watchValues.annualRate + 0.5).toFixed(2)}%`
                  : 'Eligible senior citizens get an additional 0.50% interest rate'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              🗑️ Clear
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div id="fd-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Maturity Details</h2>

              {/* Tenure Info */}
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg border-l-4 border-indigo-500">
                <p className="text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1">📅 Tenure</p>
                <p className="text-indigo-900 dark:text-indigo-100 font-bold">
                  {result.tenure.years}Y {result.tenure.months}M {result.tenure.days}D ({result.tenure.totalDays} days)
                </p>
              </div>

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

                {result.periodicPayout !== undefined && result.periodicPayout > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 p-5 rounded-lg border-2 border-amber-300 dark:border-amber-700 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wide font-semibold mb-2">
                      {watchValues.payoutType === 'quarterly' ? '📊 Per Quarter Payout' : '📅 Per Month Payout'}
                    </p>
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{formatCurrency(result.periodicPayout)}</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This calculator provides an estimate. Actual maturity amount may vary based on the bank&apos;s terms and conditions. Please consult your bank for exact figures.
                </p>
              </div>
              <div className="mt-6">
                <ExportButton
                  fileName="FD_Results"
                  calculatorName="Fixed Deposit Results"
                  resultElementId="fd-results"
                  inputElementId="fd-inputs"
                  inputsData={inputsData}
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter your FD details to see maturity amount and returns</p>
            </div>
          )}
        </div>
      </div>

      {/* Projection Table */}
      {projections.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 Projection Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Month</th>
                  {watchValues.payoutType === 'cumulative' && (
                    <>
                      <th className="px-4 py-3 text-right font-semibold">Amount (₹)</th>
                      <th className="px-4 py-3 text-right font-semibold">Interest (₹)</th>
                    </>
                  )}
                  {(watchValues.payoutType === 'quarterly' || watchValues.payoutType === 'monthly') && (
                    <>
                      <th className="px-4 py-3 text-right font-semibold">Periodic Payout (₹)</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Earned (₹)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {projections.map((proj, idx) => (
                  <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'} border-b border-gray-200 dark:border-gray-700`}>
                    <td className="px-4 py-3 font-semibold">{proj.month}</td>
                    {watchValues.payoutType === 'cumulative' && (
                      <>
                        <td className="px-4 py-3 text-right font-mono">{formatCurrency(proj.amount)}</td>
                        <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400 font-semibold">{formatCurrency(proj.interest)}</td>
                      </>
                    )}
                    {(watchValues.payoutType === 'quarterly' || watchValues.payoutType === 'monthly') && (
                      <>
                        <td className="px-4 py-3 text-right font-mono text-amber-600 dark:text-amber-400 font-semibold">{formatCurrency(proj.payout)}</td>
                        <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400 font-semibold">{formatCurrency(proj.interest)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Showing first {Math.min(projections.length, 24)} months. {projections.length > 24 && `(${projections.length - 24} more months omitted)`}
          </p>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line/Bar Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">📈 Growth Visualization</h2>
            {watchValues.payoutType === 'cumulative' ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(v) => formatCurrency(v as number)} labelFormatter={(l) => `Month ${l}`} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Total Amount" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="interest" stroke="#10b981" name="Interest Earned" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(v) => formatCurrency(v as number)} labelFormatter={(l) => `Month ${l}`} />
                  <Legend />
                  <Bar dataKey="payout" fill="#f59e0b" name={watchValues.payoutType === 'quarterly' ? 'Quarterly Payout' : 'Monthly Payout'} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart */}
          {result && watchValues.payoutType === 'cumulative' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">💰 FD Breakup</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Principal', value: result.maturityAmount - result.totalInterest },
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
                    <span className="text-gray-600 dark:text-gray-400">Principal</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.maturityAmount - result.totalInterest)}</span>
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

      {/* Related Calculators */}
      <RelatedCalculators
        calculators={[
          {
            title: 'RD Calculator',
            description: 'Calculate recurring deposit interest earnings',
            icon: '💰',
            href: '/rd-calculator',
          },
          {
            title: 'SIP Calculator',
            description: 'Plan your systematic investment returns',
            icon: '📈',
            href: '/sip-calculator',
          },
          {
            title: 'CAGR Calculator',
            description: 'Measure your investment growth rate annually',
            icon: '📊',
            href: '/cagr-calculator',
          },
          {
            title: 'Simple Interest Calculator',
            description: 'Calculate simple interest on loans/deposits',
            icon: '💵',
            href: '/simple-interest-calculator',
          },
          {
            title: 'Tax Calculator',
            description: 'Calculate income tax liability',
            icon: '🧾',
            href: '/tax-calculator',
          },
          {
            title: 'EMI Calculator',
            description: 'Calculate loan EMI and amortization schedules',
            icon: '🏦',
            href: '/emi-calculator',
          },
        ]}
      />

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What&apos;s the difference between Cumulative, Quarterly, and Monthly payouts?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              <strong>Cumulative:</strong> Interest is reinvested, compounded quarterly. Principal + all interest paid at maturity. <br />
              <strong>Quarterly:</strong> Interest paid every 3 months. Principal returned at maturity. <br />
              <strong>Monthly:</strong> Interest paid monthly at a discounted rate. Principal returned at maturity.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Why is monthly payout less than quarterly?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Banks pay monthly interest at a discounted rate to account for early payout. Since interest hasn&apos;t had the full quarter to mature, the monthly rate is slightly lower to maintain mathematical equivalence to the quarterly rate.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is a short-term FD?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              FDs with tenure less than 181 days (approximately 6 months) are short-term FDs. These are calculated using Simple Interest method instead of compound interest, as per RBI guidelines.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Do senior citizens get higher interest rates?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes! Most Indian banks provide an additional 0.50% interest rate for senior citizens (age 60+). This calculator automatically adds this bonus when you check the Senior Citizen checkbox.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Is FD interest taxable?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, FD interest is taxable income. If interest exceeds ₹40,000 (or ₹50,000 for senior citizens) in a financial year, Form 15G/15H must be submitted to your bank.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What if I need to withdraw before maturity?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Most banks allow premature withdrawal with a penalty. The penalty is typically a reduction in interest rate (0.5% to 1% less than the original rate) or loss of interest. Check your bank&apos;s specific policy.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
