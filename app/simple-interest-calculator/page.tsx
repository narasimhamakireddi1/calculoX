'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculateSimpleInterest, generateSimpleInterestProjection, type TenureType } from '@/lib/calculators/simple-interest';
import { SimpleInterestSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import ExportButton, { type FormattedInput } from '@/components/ui/ExportButton';

type SIFormData = {
  principal: number;
  annualRate: number;
  tenureType: TenureType;
  years: number;
  months: number;
  days: number;
  tenureValue: number;
};

interface SIResultData {
  principalAmount: number;
  interestAccrued: number;
  totalMaturityValue: number;
  timeFactor: number;
  dailyAccrual?: number;
  tenure: {
    value: number;
    type: TenureType;
    inYears: number;
    inMonths: number;
    inDays: number;
  };
}

export default function SimpleInterestCalculatorPage() {
  const [result, setResult] = useState<SIResultData | null>(null);
  const [projections, setProjections] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SIFormData>({
    resolver: zodResolver(SimpleInterestSchema),
    defaultValues: {
      principal: 500000,
      annualRate: 9,
      tenureType: 'years',
      years: 3,
      months: 0,
      days: 0,
      tenureValue: 3,
    },
  });

  const watchValues = watch();

  const inputsData: FormattedInput[] = useMemo(() => {
    const data: FormattedInput[] = [];
    if (watchValues.principal) {
      data.push({ label: 'Principal Amount', value: formatCurrency(watchValues.principal) });
    }
    if (watchValues.annualRate !== undefined) {
      data.push({ label: 'Annual Interest Rate (%)', value: `${watchValues.annualRate}%` });
    }
    if (watchValues.tenureType === 'years' && watchValues.years) {
      data.push({ label: 'Tenure', value: `${watchValues.years} Year(s)` });
    } else if (watchValues.tenureType === 'months') {
      const yrs = watchValues.years || 0;
      const mths = watchValues.months || 0;
      const display = yrs > 0 ? `${yrs}Y ${mths}M` : `${mths} Month(s)`;
      data.push({ label: 'Tenure', value: display });
    } else if (watchValues.tenureType === 'days' && watchValues.days) {
      data.push({ label: 'Tenure', value: `${watchValues.days} Day(s)` });
    }
    return data;
  }, [watchValues]);

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    principal: { min: 10000, max: 100000000, label: 'Principal (₹)' },
    annualRate: { min: 0, max: 50, label: 'Annual Rate (%)' },
    years: { min: 0, max: 100, label: 'Years' },
    months: { min: 0, max: 11, label: 'Months' },
    days: { min: 0, max: 30, label: 'Days' },
  };

  const handleInputChange = (fieldName: keyof Omit<SIFormData, 'tenureType'>, value: number) => {
    setValue(fieldName as any, value, { shouldValidate: true });
  };

  const handleTenureTypeChange = (type: TenureType) => {
    setValue('tenureType', type, { shouldValidate: true });
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
    setChartData([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.principal && watchValues.annualRate !== undefined) {
        let tenureVal = 0;

        // Get tenure value based on selected type
        if (watchValues.tenureType === 'years') {
          tenureVal = watchValues.years;
        } else if (watchValues.tenureType === 'months') {
          tenureVal = watchValues.months;
        } else {
          tenureVal = watchValues.days;
        }

        if (tenureVal > 0) {
          const result = calculateSimpleInterest({
            principal: watchValues.principal,
            annualRate: watchValues.annualRate,
            tenureValue: tenureVal,
            tenureType: watchValues.tenureType,
          });
          setResult(result);
          const projections = generateSimpleInterestProjection({
            principal: watchValues.principal,
            annualRate: watchValues.annualRate,
            tenureValue: tenureVal,
            tenureType: watchValues.tenureType,
          });
          setProjections(projections);
          setChartData(projections.slice(0, Math.min(projections.length, 24)));
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues]);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">📊 Simple Interest Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate simple interest with precision across Years, Months, or Days. Automatic leap year detection ensures maximum accuracy.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="simple-interest-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>
          <form className="space-y-6">
            {/* Principal */}
            <div className="space-y-3">
              <label htmlFor="principal-si" className="block text-sm font-bold text-gray-900 dark:text-white">Principal Amount (₹)</label>
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
                <div className="relative flex-shrink-0">
                  <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-emerald-600 font-bold text-xs md:text-sm">₹</span>
                  <input
                    id="principal-si"
                    type="number"
                    placeholder="0"
                    min="10000"
                    max="100000000"
                    step="10000"
                    value={watchValues.principal === 0 ? '' : watchValues.principal}
                    onChange={(e) => handleInputChange('principal', e.target.value === '' ? 0 : Number(e.target.value))}
                    onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                    className="w-40 px-6 py-3 pl-8 md:pl-7 border-2 border-emerald-400 rounded-lg text-right font-bold text-emerald-700 bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:border-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>
              {errors.principal && <p className="text-red-500 text-sm">{errors.principal.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 - ₹10 Crore</p>
            </div>

            {/* Annual Rate */}
            <div className="space-y-3">
              <label htmlFor="rate-si" className="block text-sm font-bold text-gray-900 dark:text-white">Annual Interest Rate (%)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.1"
                  value={watchValues.annualRate === 0 ? '' : watchValues.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute right-2 md:right-3 top-3 md:top-2.5 text-blue-600 font-bold text-xs md:text-sm">%</span>
                  <input
                    id="rate-si"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="50"
                    step="0.1"
                    value={watchValues.annualRate === 0 ? '' : watchValues.annualRate}
                    onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                    onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                    className="w-24 px-3 py-3 pr-7 md:pr-6 border-2 border-blue-400 rounded-lg text-right font-bold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
              {errors.annualRate && <p className="text-red-500 text-sm">{errors.annualRate.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">0% - 50% p.a.</p>
            </div>

            {/* Tenure Type Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Tenure Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['years', 'months', 'days'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={watchValues.tenureType === type}
                    onClick={() => handleTenureTypeChange(type)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all capitalize ${
                      watchValues.tenureType === type
                        ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type === 'years' && '📅'}
                    {type === 'months' && '📆'}
                    {type === 'days' && '📋'}
                    <span className="ml-1 text-xs">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure - Based on Selected Type */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Tenure Value</label>

              {/* Years Input - Only shows when tenure type is 'years' */}
              {watchValues.tenureType === 'years' && (
                <div>
                  <label htmlFor="tenure-years-si" className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Years (0-100)</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={watchValues.years === 0 ? '' : watchValues.years}
                      onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <input
                      id="tenure-years-si"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={watchValues.years === 0 ? '' : watchValues.years}
                      onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                      className="w-20 px-3 py-2 border-2 border-orange-400 rounded text-sm font-bold text-orange-700 bg-orange-50 dark:bg-gray-700 dark:border-orange-600 dark:text-orange-400"
                    />
                  </div>
                </div>
              )}

              {/* Months Input - Only shows when tenure type is 'months' */}
              {watchValues.tenureType === 'months' && (
                <div>
                  <label htmlFor="tenure-months-si" className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Months (0-11)</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="range"
                      min="0"
                      max="11"
                      value={watchValues.months === 0 ? '' : watchValues.months}
                      onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      id="tenure-months-si"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="11"
                      value={watchValues.months === 0 ? '' : watchValues.months}
                      onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                      className="w-20 px-3 py-2 border-2 border-purple-400 rounded text-sm font-bold text-purple-700 bg-purple-50 dark:bg-gray-700 dark:border-purple-600 dark:text-purple-400"
                    />
                  </div>
                </div>
              )}

              {/* Days Input - Only shows when tenure type is 'days' */}
              {watchValues.tenureType === 'days' && (
                <div>
                  <label htmlFor="tenure-days-si" className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Days (0-30)</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={watchValues.days === 0 ? '' : watchValues.days}
                      onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-pink-300 to-pink-600 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <input
                      id="tenure-days-si"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="30"
                      value={watchValues.days === 0 ? '' : watchValues.days}
                      onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                      className="w-20 px-3 py-2 border-2 border-pink-400 rounded text-sm font-bold text-pink-700 bg-pink-50 dark:bg-gray-700 dark:border-pink-600 dark:text-pink-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              🗑️ Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div id="simple-interest-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Maturity Details</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Principal */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/20 p-5 rounded-lg border border-emerald-300 dark:border-emerald-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wide font-semibold mb-2">💰 Principal Amount</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(result.principalAmount)}</p>
                </div>

                {/* Interest - Highlighted */}
                <div className="bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-lg hover:shadow-xl transition-all">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">📈 Interest Accrued</p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.interestAccrued)}</p>
                </div>

                {/* Total Maturity Value */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">🎯 Total Maturity Value</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(result.totalMaturityValue)}</p>
                </div>

                {/* Daily Accrual */}
                {result.dailyAccrual !== undefined && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-5 rounded-lg border border-amber-300 dark:border-amber-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wide font-semibold mb-2">☀️ Daily Interest Accrual</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{formatCurrency(result.dailyAccrual)}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">Interest earned per day</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This calculation assumes constant interest rates and regular calculations. Actual amounts may vary based on lender terms and conditions.
                </p>
              </div>
              <div className="mt-6">
                <ExportButton
                  fileName="Simple_Interest_Results"
                  calculatorName="Simple Interest Results"
                  resultElementId="simple-interest-results"
                  inputElementId="simple-interest-inputs"
                  inputsData={inputsData}
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your investment details to see interest accrual and maturity amount
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projection Table */}
      {projections.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 Interest Projection Schedule</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Period-wise breakdown showing interest accrual over time</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                  <th className="px-4 py-4 text-left font-bold text-gray-900 dark:text-white">Period</th>
                  <th className="px-4 py-4 text-right font-bold text-green-700 dark:text-green-400">Interest Earned (₹)</th>
                  <th className="px-4 py-4 text-right font-bold text-blue-700 dark:text-blue-400">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {projections.slice(0, 12).map((proj, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                      idx % 2 === 0
                        ? 'bg-white dark:bg-gray-800/50'
                        : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                      {watchValues.tenureType === 'years' ? `Year ${proj.period}` : watchValues.tenureType === 'months' ? `Month ${proj.period}` : `Day ${proj.period}`}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(proj.interest)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {formatCurrency(proj.totalAmount)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Showing first {Math.min(projections.length, 12)} periods. {projections.length > 12 && `(${projections.length - 12} more periods available)`}
          </p>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">📈 Growth Visualization</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="period"
                  label={{ value: `${watchValues.tenureType.charAt(0).toUpperCase() + watchValues.tenureType.slice(1)}`, position: 'insideBottomRight', offset: -5 }}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value) => formatCurrency(value as number)} labelFormatter={(l) => `Period ${l}`} />
                <Legend />
                <Line type="monotone" dataKey="totalAmount" stroke="#3b82f6" name="Total Amount" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="interest" stroke="#10b981" name="Interest Earned" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          {result && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">💰 SI Breakup</h2>
              <MemoizedPieChart
                data={[
                  { name: 'Principal', value: result.principalAmount },
                  { name: 'Interest Accrued', value: result.interestAccrued },
                ]}
                colors={['#3b82f6', '#10b981']}
                height={300}
              />
              <div className="space-y-2 text-sm px-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Principal</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.principalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">Interest Accrued</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.interestAccrued)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related Calculators */}
      <RelatedCalculators
        calculators={[
          { title: 'EMI Calculator', description: 'Calculate loan EMI and amortization', icon: '🏠', href: '/emi-calculator' },
          { title: 'FD Calculator', description: 'Calculate Fixed Deposit maturity amount', icon: '🏦', href: '/fd-calculator' },
          { title: 'SIP Calculator', description: 'Plan your systematic investment growth', icon: '📈', href: '/sip-calculator' },
          { title: 'RD Calculator', description: 'Calculate Recurring Deposit returns', icon: '💳', href: '/rd-calculator' },
          { title: 'Tax Calculator', description: 'Calculate income tax for FY 2025-26', icon: '📋', href: '/income-tax-calculator' },
          { title: 'CAGR Calculator', description: 'Measure investment returns over time', icon: '📊', href: '/cagr-calculator' },
        ]}
      />

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
              Simple Interest (SI) is interest calculated only on the principal amount, without compounding. Unlike compound interest, SI doesn&apos;t earn interest on previously earned interest. Formula: SI = (P × R × T) / 100, where P is principal, R is annual rate (%), and T is time period.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What are the three tenure types and when to use them?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              <strong>Years:</strong> Most common for long-term investments and traditional loans (mortgages, vehicle loans). <br />
              <strong>Months:</strong> Used for medium-term arrangements like personal loans, peer-to-peer lending, or short-term bonds. <br />
              <strong>Days:</strong> Essential for banks calculating overdraft charges, short-term credit lines, bond accruals, or any daily interest scenario requiring precision.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How are the formulas adjusted for different time periods?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              <strong>Years:</strong> SI = (P × R × Years) / 100. <br />
              <strong>Months:</strong> SI = (P × R × Months) / 1200. We divide by 1200 because 1200 = 100 × 12. <br />
              <strong>Days:</strong> SI = (P × R × Days) / (100 × DaysInYear). This calculator automatically detects leap years, using 366 days during leap years and 365 days otherwise for maximum accuracy.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is daily interest accrual and why is it useful?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Daily accrual shows how much interest accumulates per day: (P × R) / DaysInYear. For users calculating short-term commercial returns or friendly loans, this provides practical insight into daily interest growth. For example, on ₹1 lakh at 8% p.a., daily accrual is roughly ₹21.92 per day, making it easy to estimate interest for any number of days.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              When is Simple Interest used vs. Compound Interest?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              <strong>Simple Interest:</strong> Used for most personal loans, auto loans, home loans, and government savings schemes like Sukanya Samriddhi. <br />
              <strong>Compound Interest:</strong> Used for Fixed Deposits, savings accounts, mutual funds, and investments where interest is reinvested. Over the same period, CI yields significantly more interest than SI, so always verify which method your financial institution uses.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How does leap year affect daily interest calculations?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              During leap years (366 days instead of 365), interest accrual is slightly lower since the same annual rate is spread across one additional day. This calculator automatically detects leap years when you use the Days tenure type, ensuring your daily interest calculations are accurate down to the penny. This is critical for banks and financial institutions that must maintain regulatory precision.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
