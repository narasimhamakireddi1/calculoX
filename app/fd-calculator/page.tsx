'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { calculateFD, generateFDProjection, type PayoutType } from '@/lib/calculators/fd';
import { FDSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import ExportButton, { type FormattedInput } from '@/components/ui/ExportButton';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { getInternalLinks } from '@/config/internal-links.config';
import { useSwipeGesture } from '@/lib/hooks/useSwipeGesture';
import { SwipeHint } from '@/components/mobile/SwipeHint';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

type TenureType = 'years' | 'months' | 'days';

type FDFormData = {
  principal: number;
  annualRate: number;
  years: number;
  months: number;
  days: number;
  payoutType: PayoutType;
  seniorCitizen: boolean;
  tenureType: TenureType;
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
  const [showAllProjections, setShowAllProjections] = useState(false);

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
      tenureType: 'years',
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
    years: { min: 0, max: 100, label: 'Years' },
    months: { min: 0, max: 11, label: 'Months' },
    days: { min: 0, max: 30, label: 'Days' },
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

  const handleTenureTypeChange = (type: TenureType) => {
    setValue('tenureType', type, { shouldValidate: true });

    // Set sensible defaults for the new tenure type if current value is 0
    if (type === 'years' && watchValues.years === 0) {
      setValue('years', 2, { shouldValidate: true });
    } else if (type === 'months' && watchValues.months === 0) {
      setValue('months', 6, { shouldValidate: true });
    } else if (type === 'days' && watchValues.days === 0) {
      setValue('days', 15, { shouldValidate: true });
    }
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
    setShowAllProjections(false);
  }, [reset, haptic]);

  // Quick-start scenarios
  const fdScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Short-Term (1 Year)',
      description: '₹1L at 6.5% for 1 year',
      icon: '⏱️',
      values: { principal: 100000, annualRate: 6.5, years: 1, months: 0, days: 0, tenureType: 'years', payoutType: 'cumulative' }
    },
    {
      label: 'Medium-Term (5 Years)',
      description: '₹5L at 7% quarterly payout',
      icon: '📅',
      values: { principal: 500000, annualRate: 7, years: 5, months: 0, days: 0, tenureType: 'years', payoutType: 'quarterly' }
    },
    {
      label: 'Long-Term (10 Years)',
      description: '₹10L at 7.5% monthly payout',
      icon: '📈',
      values: { principal: 1000000, annualRate: 7.5, years: 10, months: 0, days: 0, tenureType: 'years', payoutType: 'monthly' }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as any, (key === 'tenureType' || key === 'payoutType') ? (value as any) : Number(value), { shouldValidate: true });
    });
  }, [setValue]);

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.principal && watchValues.annualRate !== undefined) {
        let tenureValue = 0;

        // Get tenure value based on selected type
        if (watchValues.tenureType === 'years') {
          tenureValue = watchValues.years;
        } else if (watchValues.tenureType === 'months') {
          tenureValue = watchValues.months;
        } else {
          tenureValue = watchValues.days;
        }

        if (tenureValue > 0) {
          // Create calculation data with only the selected tenure type
          const calculationData = {
            ...watchValues,
            years: watchValues.tenureType === 'years' ? watchValues.years : 0,
            months: watchValues.tenureType === 'months' ? watchValues.months : 0,
            days: watchValues.tenureType === 'days' ? watchValues.days : 0,
          };
          calculateResults(calculationData);
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

  // Swipe navigation to related calculators (mobile only)
  const router = useRouter();
  const relatedCalcs = getInternalLinks('fd-calculator').slice(0, 5);
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
    <div className="space-y-8 py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <SwipeHint
        hasLeft={currentIndex < relatedCalcs.length - 1}
        hasRight={currentIndex > 0}
        calculatorName="FD"
      />

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

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={fdScenarios}
            onSelectScenario={handleSelectScenario}
          />

          <form className="space-y-6">
            {/* Principal */}
            <div className="space-y-3">
              <label htmlFor="principal-fd" className="block text-sm font-bold text-gray-900 dark:text-white">Principal Amount (₹)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
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
                  id="principal-fd"
                  type="number"
                  placeholder="0"
                  min="10000"
                  max="100000000"
                  step="10000"
                  value={watchValues.principal === 0 ? '' : watchValues.principal}
                  onChange={(e) => handleInputChange('principal', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-emerald-400 rounded-lg font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700"
                />
              </div>
              {errors.principal && <p className="text-red-500 text-sm">{errors.principal.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {[50000, 100000, 500000, 1000000].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('principal', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700
                               bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300
                               hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                    {val === 1000000 ? '₹10L' : `₹${val / 100000}L`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Current bank FD rates: 6.5-7.5% p.a. Senior citizens get additional +0.5% bonus rate
              </p>
            </div>

            {/* Annual Rate */}
            <div className="space-y-3">
              <label htmlFor="rate-fd" className="block text-sm font-bold text-gray-900 dark:text-white">
                Annual Interest Rate (%)
                {watchValues.seniorCitizen && <span className="text-yellow-600 dark:text-yellow-400"> +0.5% (Senior)</span>}
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
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
                  id="rate-fd"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="20"
                  step="0.1"
                  value={watchValues.annualRate === 0 ? '' : watchValues.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.annualRate && <p className="text-red-500 text-sm">{errors.annualRate.message}</p>}
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
                  <label htmlFor="tenure-years" className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Years (0-100)</label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={watchValues.years === 0 ? '' : watchValues.years}
                      onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <input
                      id="tenure-years"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={watchValues.years === 0 ? '' : watchValues.years}
                      onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                      className="w-full md:w-28 px-3 py-3 border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                    />
                  </div>
                  {errors.years && <p className="text-red-500 text-sm">{errors.years.message}</p>}
                </div>
              )}

              {/* Months Input - Only shows when tenure type is 'months' */}
              {watchValues.tenureType === 'months' && (
                <div>
                  <label htmlFor="tenure-months" className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Months (0-11)</label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="11"
                      step="1"
                      value={watchValues.months === 0 ? '' : watchValues.months}
                      onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      id="tenure-months"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="11"
                      value={watchValues.months === 0 ? '' : watchValues.months}
                      onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                      className="w-full md:w-28 px-3 py-3 border-2 border-purple-400 rounded-lg font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700"
                    />
                  </div>
                  {errors.months && <p className="text-red-500 text-sm">{errors.months.message}</p>}
                </div>
              )}

              {/* Days Input - Only shows when tenure type is 'days' */}
              {watchValues.tenureType === 'days' && (
                <div>
                  <label htmlFor="tenure-days" className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 block">Days (0-30)</label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={watchValues.days === 0 ? '' : watchValues.days}
                      onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-pink-300 to-pink-600 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <input
                      id="tenure-days"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="30"
                      value={watchValues.days === 0 ? '' : watchValues.days}
                      onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                      className="w-full md:w-28 px-3 py-3 border-2 border-pink-400 rounded-lg font-bold text-pink-700 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-700"
                    />
                  </div>
                  {errors.days && <p className="text-red-500 text-sm">{errors.days.message}</p>}
                </div>
              )}

              {isShortTerm && (
                <p className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                  ⚠️ Short-term FD (under 6 months) calculated using Simple Interest method
                </p>
              )}
            </div>

            {/* Payout Type */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Payout Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['cumulative', 'quarterly', 'monthly'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={watchValues.payoutType === type}
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
                  <p className="text-xl sm:text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 break-words overflow-hidden">{formatCurrency(result.maturityAmount)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📈 Total Interest Earned
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 break-words overflow-hidden">{formatCurrency(result.totalInterest)}</p>
                </div>

                {result.periodicPayout !== undefined && result.periodicPayout > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 p-5 rounded-lg border-2 border-amber-300 dark:border-amber-700 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wide font-semibold mb-2">
                      {watchValues.payoutType === 'quarterly' ? '📊 Per Quarter Payout' : '📅 Per Month Payout'}
                    </p>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-400 break-words overflow-hidden">{formatCurrency(result.periodicPayout)}</p>
                  </div>
                )}
              </div>

              {/* Result Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">📚 Understanding Your FD Results</h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Maturity Amount:</strong> The total amount you'll receive at the end of the FD tenure (Principal + Interest)</p>
                  <p><strong>Total Interest Earned:</strong> The profit you earn from your Fixed Deposit investment</p>
                  {result.periodicPayout !== undefined && result.periodicPayout > 0 && (
                    <p><strong>Periodic Payout:</strong> Interest paid to you {watchValues.payoutType === 'quarterly' ? 'every quarter' : 'every month'} while FD is active</p>
                  )}
                  <p><strong>Tenure:</strong> {result.tenure.years}Y {result.tenure.months}M {result.tenure.days}D ({result.tenure.totalDays} days total)</p>
                  <p><strong>Interest Rate:</strong> {watchValues.seniorCitizen ? watchValues.annualRate + 0.5 : watchValues.annualRate}% p.a. {watchValues.seniorCitizen && '(includes 0.5% senior citizen bonus)'}</p>
                </div>
              </div>

              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📊 How Do You Compare?</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your effective annual yield is <strong>{((result.totalInterest / (watchValues.principal * (result.tenure.totalDays / 365))) * 100).toFixed(2)}%</strong>. Current bank FD rates range from 5-7%, so your {watchValues.annualRate}% rate {watchValues.annualRate >= 7 ? 'is competitive' : watchValues.annualRate >= 6 ? 'is reasonable' : 'is below market rates'}. {watchValues.seniorCitizen && 'Your 0.5% senior citizen bonus adds ₹' + (result.totalInterest - (watchValues.principal * (watchValues.annualRate / 100) * (result.tenure.totalDays / 365))).toFixed(0) + ' in extra returns.'} Compare with RD for monthly investment habits.
                </p>
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
                {(showAllProjections ? projections : projections.slice(0, Math.min(projections.length, 24))).map((proj, idx) => (
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
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {showAllProjections ? `Showing all ${projections.length} periods` : `Showing first ${Math.min(projections.length, 24)} periods`}
            </p>
            {projections.length > 24 && (
              <button
                onClick={() => setShowAllProjections(!showAllProjections)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
              >
                {showAllProjections ? '▲ Show Less' : '▼ Show All'}
              </button>
            )}
          </div>
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
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
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
                  <Tooltip
                    formatter={(v) => formatCurrency(v as number)}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#000000',
                    }}
                    wrapperStyle={{ outline: 'none' }}
                  />
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

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is Fixed Deposit (FD)?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            A Fixed Deposit (FD) is a safe investment product offered by banks and financial institutions where you deposit a lump sum amount for a fixed tenure (3 months to 10 years) at a predetermined interest rate. The interest is paid either at maturity (cumulative), quarterly, monthly, or annually depending on the payout option you choose. FDs are FDIC-insured (up to ₹5 lakhs per bank per depositor in India), making them one of the safest investment options with guaranteed returns.
          </p>
        </div>

        {/* Comparison Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">FD vs Savings Account vs Recurring Deposit (RD)</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">💳 FD (Fixed Deposit)</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">Lump sum invested for fixed tenure</p>
              <p className="text-xs"><strong>Rate:</strong> 7-8% | <strong>Tenure:</strong> 3m-10y | <strong>Safety:</strong> Very High</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">🏦 Savings Account</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">Liquid funds with withdrawal anytime</p>
              <p className="text-xs"><strong>Rate:</strong> 2-3% | <strong>Tenure:</strong> Ongoing | <strong>Safety:</strong> Very High</p>
            </div>
            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">📈 RD (Recurring)</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">Monthly investments over fixed period</p>
              <p className="text-xs"><strong>Rate:</strong> 5-7% | <strong>Tenure:</strong> 6m-10y | <strong>Safety:</strong> Very High</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Best Use:</strong> FD for lump sum savings, Savings Account for emergency funds, RD for monthly savings habit.
            </p>
          </div>
        </div>

        {/* Table Snippet: FD Returns by Tenure */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">FD Returns Projection @ 7% Interest Rate</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Principal</th>
                  <th className="text-center py-3 px-4 font-bold">1 Year</th>
                  <th className="text-center py-3 px-4 font-bold">3 Years</th>
                  <th className="text-center py-3 px-4 font-bold">5 Years</th>
                  <th className="text-center py-3 px-4 font-bold">10 Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹1 Lakh</td>
                  <td className="text-center py-3 px-4">₹1,07,000</td>
                  <td className="text-center py-3 px-4">₹1,22,505</td>
                  <td className="text-center py-3 px-4">₹1,40,255</td>
                  <td className="text-center py-3 px-4">₹1,96,715</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹5 Lakh</td>
                  <td className="text-center py-3 px-4">₹5,35,000</td>
                  <td className="text-center py-3 px-4">₹6,12,526</td>
                  <td className="text-center py-3 px-4">₹7,01,275</td>
                  <td className="text-center py-3 px-4">₹9,83,575</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹10 Lakh</td>
                  <td className="text-center py-3 px-4">₹10,70,000</td>
                  <td className="text-center py-3 px-4">₹12,25,043</td>
                  <td className="text-center py-3 px-4">₹14,02,552</td>
                  <td className="text-center py-3 px-4">₹19,67,151</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* List Snippet: Benefits of FD */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Key Advantages of Fixed Deposits</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1.</span>
              <span><strong>Guaranteed Returns:</strong> Fixed interest rate known upfront, unlike stock market investments.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2.</span>
              <span><strong>FDIC Protection:</strong> Deposits up to ₹5 lakhs per bank are protected against bank failure.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3.</span>
              <span><strong>Better Than Savings Account:</strong> FD rates (7-8%) are significantly higher than savings account rates (2-3%).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4.</span>
              <span><strong>Senior Citizen Benefit:</strong> Senior citizens (60+ years) get an additional 0.5% interest rate.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">5.</span>
              <span><strong>Easy Loan Access:</strong> Use FD as collateral to get a loan at rates 1-2% above FD interest.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('fd-calculator')} />

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
