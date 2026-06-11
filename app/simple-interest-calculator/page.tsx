'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';

const ProjectionTable = lazy(() => import('@/components/simple-interest/ProjectionTable').then(m => ({ default: m.default })));
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { Landmark, GraduationCap, Briefcase, Coins, TrendingUp, Target, Sunrise, BookOpen, Lightbulb, Trash2, Calculator, Calendar, CalendarDays, Clock, HelpCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '@/components/charts/useChartColors';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculateSimpleInterest, generateSimpleInterestProjection, type TenureType } from '@/lib/calculators/simple-interest';
import { SimpleInterestSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { getInternalLinks } from '@/config/internal-links.config';

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
  const chartColors = useChartColors();
  const [result, setResult] = useState<SIResultData | null>(null);
  const [projections, setProjections] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [projectionFirstTwelve, setProjectionFirstTwelve] = useState<any[]>([]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

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

    // Set sensible defaults for the new tenure type if current value is 0
    if (type === 'years' && watchValues.years === 0) {
      setValue('years', 3, { shouldValidate: true });
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

  const handleReset = () => {
    reset();
    setResult(null);
    setProjections([]);
    setChartData([]);
    setShowFullSchedule(false);
  };

  // Quick-start scenarios
  const siScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Short-Term Loan',
      description: '₹1,00,000 at 8% for 2 years',
      icon: Landmark,
      values: { principal: 100000, annualRate: 8, years: 2, months: 0, days: 0, tenureType: 'years' }
    },
    {
      label: 'Education Fund',
      description: '₹5,00,000 at 6% for 5 years',
      icon: GraduationCap,
      values: { principal: 500000, annualRate: 6, years: 5, months: 0, days: 0, tenureType: 'years' }
    },
    {
      label: 'Business Investment',
      description: '₹10,00,000 at 10% for 3 years',
      icon: Briefcase,
      values: { principal: 1000000, annualRate: 10, years: 3, months: 0, days: 0, tenureType: 'years' }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as any, key === 'tenureType' ? (value as any) : Number(value), { shouldValidate: true });
    });
  }, [setValue]);

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
          setProjectionFirstTwelve(projections.slice(0, 12));
          setChartData(projections.slice(0, Math.min(projections.length, 24)));
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues]);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient inline-flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800/40 flex-shrink-0">
            <CalculatorIcon idOrHref="simple-interest" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </span>
          <span>Simple Interest Calculator</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate simple interest with precision across Years, Months, or Days. Automatic leap year detection ensures maximum accuracy.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="simple-interest-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={siScenarios}
            onSelectScenario={handleSelectScenario}
          />

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
              <div className="flex gap-2 flex-wrap mt-3">
                {[10000, 50000, 100000, 500000].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('principal', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700
                               bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300
                               hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                    ₹{val >= 100000 ? `${val / 100000}L` : `${val / 1000}K`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 - ₹10 Crore</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Principal amount in Simple Interest. Interest is calculated on this amount without compounding</p>
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
              <div className="flex gap-2 flex-wrap mt-3">
                {[3, 6, 9, 12].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('annualRate', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                               bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    {val}%
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">0% - 50% p.a.</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Current bank interest rates: 6-7% p.a. for Savings Accounts. Higher for FDs (7-8% p.a.)</p>
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
                    {type === 'years' && <Calendar className="w-3.5 h-3.5 inline" aria-hidden="true" />}
                    {type === 'months' && <CalendarDays className="w-3.5 h-3.5 inline" aria-hidden="true" />}
                    {type === 'days' && <Clock className="w-3.5 h-3.5 inline" aria-hidden="true" />}
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
                  <label htmlFor="tenure-years-si" className="block text-xs uppercase tracking-wide font-semibold text-orange-700 dark:text-orange-400 mb-2">Years (0-100)</label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={watchValues.years === 0 ? '' : watchValues.years}
                      onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <input
                        id="tenure-years-si"
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={watchValues.years === 0 ? '' : watchValues.years}
                        onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 border-2 border-orange-400 rounded-lg text-right font-bold text-orange-700 bg-orange-50 dark:bg-gray-700 dark:border-orange-600 dark:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Months Input - Only shows when tenure type is 'months' */}
              {watchValues.tenureType === 'months' && (
                <div>
                  <label htmlFor="tenure-months-si" className="block text-xs uppercase tracking-wide font-semibold text-purple-700 dark:text-purple-400 mb-2">Months (0-11)</label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="11"
                      value={watchValues.months === 0 ? '' : watchValues.months}
                      onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <input
                        id="tenure-months-si"
                        type="number"
                        placeholder="0"
                        min="0"
                        max="11"
                        value={watchValues.months === 0 ? '' : watchValues.months}
                        onChange={(e) => handleInputChange('months', e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={(e) => handleValidateField('months', Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 border-2 border-purple-400 rounded-lg text-right font-bold text-purple-700 bg-purple-50 dark:bg-gray-700 dark:border-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Days Input - Only shows when tenure type is 'days' */}
              {watchValues.tenureType === 'days' && (
                <div>
                  <label htmlFor="tenure-days-si" className="block text-xs uppercase tracking-wide font-semibold text-pink-700 dark:text-pink-400 mb-2">Days (0-30)</label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={watchValues.days === 0 ? '' : watchValues.days}
                      onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-pink-300 to-pink-600 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <input
                        id="tenure-days-si"
                        type="number"
                        placeholder="0"
                        min="0"
                        max="30"
                        value={watchValues.days === 0 ? '' : watchValues.days}
                        onChange={(e) => handleInputChange('days', e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={(e) => handleValidateField('days', Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 border-2 border-pink-400 rounded-lg text-right font-bold text-pink-700 bg-pink-50 dark:bg-gray-700 dark:border-pink-600 dark:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Trash2 className="w-4 h-4 inline mr-1" aria-hidden="true" /> Clear All
            </button>

            {/* Formula Reference */}
            <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2"><Calculator className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Formula Reference</h4>
              <div className="space-y-2 text-xs text-indigo-800 dark:text-indigo-200">
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded border border-indigo-200 dark:border-indigo-700">
                  SI = (P × R × T) / 100
                </p>
                <p><strong>Where:</strong> P = Principal | R = Rate (% p.a.) | T = Time (years)</p>
                <p><strong>Maturity:</strong> Amount = P + SI</p>
              </div>
            </div>
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
                  <p className="text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1"><Coins className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Principal Amount</p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400 break-words overflow-hidden">{formatCurrency(result.principalAmount)}</p>
                </div>

                {/* Interest - Highlighted */}
                <div className="bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-lg hover:shadow-xl transition-all">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Interest Accrued</p>
                  <p className="text-xl sm:text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 break-words overflow-hidden">{formatCurrency(result.interestAccrued)}</p>
                </div>

                {/* Total Maturity Value */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1"><Target className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Total Maturity Value</p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400 break-words overflow-hidden">{formatCurrency(result.totalMaturityValue)}</p>
                </div>

                {/* Daily Accrual */}
                {result.dailyAccrual !== undefined && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-5 rounded-lg border border-amber-300 dark:border-amber-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1"><Sunrise className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Daily Interest Accrual</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{formatCurrency(result.dailyAccrual)}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">Interest earned per day</p>
                  </div>
                )}
              </div>

              {/* Understanding Your Simple Interest */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Understanding Your Simple Interest</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Simple Interest is calculated only on the principal amount throughout the tenure. Unlike compound interest, it doesn't earn interest on interest.
                </p>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Principal Amount:</strong> {formatCurrency(result.principalAmount)} - Your initial investment</p>
                  <p><strong>Interest Earned:</strong> {formatCurrency(result.interestAccrued)} - Money earned at {watchValues.annualRate}% p.a. for {watchValues.tenureType === 'years' ? watchValues.years + ' year(s)' : watchValues.tenureType === 'months' ? watchValues.months + ' month(s)' : watchValues.days + ' day(s)'}</p>
                  <p><strong>Maturity Amount:</strong> {formatCurrency(result.totalMaturityValue)} - Total amount you'll receive (Principal + Interest)</p>
                </div>
              </div>

              {/* Key Insights */}
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-300 dark:border-green-700">
                <h3 className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Key Insights</h3>
                <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <p>
                    <strong>Return Multiple:</strong> <span className="font-bold text-green-700 dark:text-green-300">{(result.totalMaturityValue / result.principalAmount).toFixed(2)}x</span> - Your money will grow by {((result.totalMaturityValue / result.principalAmount - 1) * 100).toFixed(1)}%
                  </p>
                  <p>
                    <strong>Interest Rate Comparison:</strong> At {watchValues.annualRate}% p.a., you earn {formatCurrency(result.interestAccrued / (watchValues.tenureType === 'years' ? watchValues.years : watchValues.tenureType === 'months' ? watchValues.months / 12 : watchValues.days / 365))} per year
                  </p>
                  {result.dailyAccrual !== undefined && (
                    <p>
                      <strong>Daily Earnings:</strong> {formatCurrency(result.dailyAccrual)} per day - Or {formatCurrency(result.dailyAccrual * 30)} per month on average
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This calculation assumes constant interest rates and regular calculations. Actual amounts may vary based on lender terms and conditions.
                </p>
              </div>
              <div className="mt-6">
                <ShareButtons
                  inputs={[
                    { label: 'Principal Amount', value: formatCurrency(result.principalAmount) },
                    { label: 'Annual Interest Rate', value: `${watchValues.annualRate}%` },
                    { label: 'Tenure', value: watchValues.tenureType === 'years' ? `${watchValues.years} Year(s)` : watchValues.tenureType === 'months' ? `${watchValues.years}Y ${watchValues.months}M` : `${watchValues.days} Day(s)` }
                  ]}
                  outputs={[
                    { label: 'Total Maturity Value', value: formatCurrency(result.totalMaturityValue) },
                    { label: 'Interest Accrued', value: formatCurrency(result.interestAccrued) },
                    ...(result.dailyAccrual !== undefined ? [{ label: 'Daily Interest Accrual', value: formatCurrency(result.dailyAccrual) }] : [])
                  ]}
                  calculatorName="Simple Interest Calculator"
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
        <Suspense fallback={<div className="card h-32" />}>
          <ProjectionTable
            projections={projections}
            projectionFirstTwelve={projectionFirstTwelve}
            showFullSchedule={showFullSchedule}
            onToggle={() => setShowFullSchedule(!showFullSchedule)}
            tenureType={watchValues.tenureType}
          />
        </Suspense>
      )}

      {/* OLD - DELETE */}
      {false && (
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
                {(() => {
                  const tenure = watchValues.tenureType === 'years' ? watchValues.years : watchValues.tenureType === 'months' ? watchValues.months : watchValues.days;
                  const shouldShowAll = tenure <= 12 || showFullSchedule;
                  return projections.slice(0, shouldShowAll ? projections.length : 5).map((proj, idx) => (
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
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Show All Button */}
          {(() => {
            const tenure = watchValues.tenureType === 'years' ? watchValues.years : watchValues.tenureType === 'months' ? watchValues.months : watchValues.days;
            const periodLabel = watchValues.tenureType === 'years' ? 'Years' : watchValues.tenureType === 'months' ? 'Months' : 'Days';
            return tenure > 12 && !showFullSchedule ? (
              <button
                onClick={() => {
                  setShowFullSchedule(true);
                                  }}
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                📊 Show All {projections.length} {periodLabel}
              </button>
            ) : showFullSchedule ? (
              <button
                onClick={() => setShowFullSchedule(false)}
                className="mt-6 w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all duration-200"
              >
                ▲ Show Less
              </button>
            ) : null;
          })()}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Growth Visualization</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="siAmountGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="siInterestGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
                <XAxis
                  dataKey="period"
                  label={{ value: `${watchValues.tenureType.charAt(0).toUpperCase() + watchValues.tenureType.slice(1)}`, position: 'insideBottomRight', offset: -5 }}
                  stroke={chartColors.axisColor}
                  tick={{ fill: chartColors.axisFill, fontSize: 12 }}
                />
                <YAxis stroke={chartColors.axisColor} tick={{ fill: chartColors.axisFill, fontSize: 12 }} tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={chartColors.tooltipStyle}
                  wrapperStyle={{ outline: 'none' }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(l) => `Period ${l}`}
                />
                <Legend />
                <Area type="monotone" dataKey="totalAmount" stroke="#3b82f6" strokeWidth={2} fill="url(#siAmountGrad)" name="Total Amount" dot={false} isAnimationActive={false} />
                <Area type="monotone" dataKey="interest" stroke="#10b981" strokeWidth={2} fill="url(#siInterestGrad)" name="Interest Earned" dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          {result && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Coins className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> SI Breakup</h2>
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
      <RelatedCalculators calculators={getInternalLinks('simple-interest-calculator')} />

      {/* Featured Snippet Sections for SEO */}
      {/* Definition Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">What is Simple Interest?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Simple Interest (SI) is interest calculated only on the principal amount throughout the entire tenure, without any compounding. Unlike compound interest, simple interest does not earn interest on previously accumulated interest. The formula for simple interest is: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">SI = (P × R × T) / 100</span>, where P is the principal amount, R is the annual interest rate (%), and T is the time period in years.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Simple interest is commonly used in personal loans, auto loans, home loans, and government savings schemes. Because SI doesn't compound, the total amount you earn or pay is proportional to the time period, making it predictable and easy to calculate for short-term investments and loans.
        </p>
      </div>

      {/* Table Snippet - SI vs Compound Interest Comparison */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Simple Interest vs Compound Interest: Key Differences</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Aspect</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Simple Interest</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Compound Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Calculation Basis</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Only on principal</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">On principal + earned interest</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Formula</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">SI = (P × R × T) / 100</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">A = P(1 + R/100)^T</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Interest Growth</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Linear (straight line)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Exponential (accelerating)</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Total Returns (5 yrs @ 10%)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹1,00,000 → ₹1,50,000</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹1,00,000 → ₹1,61,051</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Common Uses</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Personal loans, car loans, home loans</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">FDs, savings accounts, investments</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Predictability</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Easy to calculate, predictable</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">More complex, accelerating returns</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <strong>Key Insight:</strong> Over longer periods, compound interest significantly outpaces simple interest. For investments, compound interest works in your favor. For loans, simple interest is more borrower-friendly than compound interest.
        </p>
      </div>

      {/* How-to List Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">How to Calculate Simple Interest in 5 Steps?</h2>
        <ol className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">1.</span>
            <div>
              <strong>Gather the Required Information:</strong> You need three pieces of data: Principal Amount (P) — the initial amount invested or borrowed; Annual Interest Rate (R) — the percentage charged per year; Time Period (T) — how long the money is invested or borrowed (in years, months, or days).
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">2.</span>
            <div>
              <strong>Identify the Time Period Type:</strong> Determine if your time period is in years, months, or days. If in years, use T as-is. If in months, divide by 12. If in days, divide by 365 (or 366 for leap years). This ensures the calculation aligns with the annual interest rate.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">3.</span>
            <div>
              <strong>Apply the Simple Interest Formula:</strong> Use the formula: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">SI = (P × R × T) / 100</span>. For example, if Principal is ₹1,00,000, Rate is 8% p.a., and Time is 3 years: SI = (100,000 × 8 × 3) / 100 = ₹24,000.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">4.</span>
            <div>
              <strong>Calculate the Maturity Amount:</strong> Add the interest earned to the principal to get the total amount: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">Maturity Amount = Principal + SI</span>. In our example: ₹1,00,000 + ₹24,000 = ₹1,24,000 (the total you receive).
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">5.</span>
            <div>
              <strong>Verify Using the Complete Formula:</strong> Alternatively, calculate maturity in one step using: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">A = P × (1 + R×T/100)</span>. This combines principal and interest into one calculation for convenience.
            </div>
          </li>
        </ol>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Real Example:</strong> You invest ₹50,000 in a savings scheme offering 7% simple interest for 2 years. SI = (50,000 × 7 × 2) / 100 = ₹7,000. Maturity amount = ₹50,000 + ₹7,000 = ₹57,000 (your total after 2 years).
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HelpCircle className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Frequently Asked Questions</h2>
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
