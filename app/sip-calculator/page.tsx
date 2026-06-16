'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { Shield, Rocket, Target, TrendingUp, BarChart2, Coins, BookOpen, Lightbulb, Trash2, RefreshCw, HelpCircle } from 'lucide-react';

const ProjectionTable = lazy(() => import('@/components/sip/ProjectionTable').then(m => ({ default: m.default })));
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '@/components/charts/useChartColors';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculateSIP } from '@/lib/calculators/sip';
import { SIPSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { getInternalLinks } from '@/config/internal-links.config';
import { useSwipeGesture } from '@/lib/hooks/useSwipeGesture';
import { SwipeHint } from '@/components/mobile/SwipeHint';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

type SIPFormData = {
  monthlyInvestment: number;
  years: number;
  annualReturn: number;
  stepUpPercent: number;
};

interface SIPResultData {
  totalInvestment: number;
  futureValue: number;
  gainedAmount: number;
}

interface ChartDataPoint {
  month: number;
  invested: number;
  value: number;
}

interface YearlyProjection {
  year: number;
  monthlyInvestment: number;
  annualInvestment: number;
  cumulativeInvestment: number;
}

export default function SIPCalculatorPage() {
  const chartColors = useChartColors();
  const [result, setResult] = useState<SIPResultData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [projections, setProjections] = useState<YearlyProjection[]>([]);
  const [projectionFirstTwelve, setProjectionFirstTwelve] = useState<YearlyProjection[]>([]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SIPFormData>({
    resolver: zodResolver(SIPSchema),
    defaultValues: {
      monthlyInvestment: 10000,
      years: 10,
      annualReturn: 12,
      stepUpPercent: 5,
    },
  });

  const watchValues = watch();

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    monthlyInvestment: { min: 100, max: 1000000, label: 'Monthly Investment (₹)' },
    years: { min: 1, max: 50, label: 'Years' },
    annualReturn: { min: 0, max: 100, label: 'Annual Return (%)' },
    stepUpPercent: { min: 0, max: 50, label: 'Step Up (%)' },
  };

  const handleInputChange = (fieldName: keyof SIPFormData, value: number) => {
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
    setChartData([]);
    setProjections([]);
  }, [reset, haptic]);

  // Quick-start scenarios
  const sipScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Conservative Investor',
      description: '₹5,000/month, 12% returns',
      icon: Shield,
      values: { monthlyInvestment: 5000, years: 10, annualReturn: 12, stepUpPercent: 0 }
    },
    {
      label: 'Aggressive Investor',
      description: '₹25,000/month, 15% returns',
      icon: Rocket,
      values: { monthlyInvestment: 25000, years: 20, annualReturn: 15, stepUpPercent: 5 }
    },
    {
      label: 'Retirement Planning',
      description: '₹10,000/month, 20 years',
      icon: Target,
      values: { monthlyInvestment: 10000, years: 20, annualReturn: 13, stepUpPercent: 3 }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof SIPFormData, Number(value), { shouldValidate: true });
    });
  }, [setValue]);

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.monthlyInvestment && watchValues.years && watchValues.annualReturn !== undefined) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues]);

  const calculateResults = (data: SIPFormData) => {
    const result = calculateSIP(data);
    setResult(result);

    // Generate yearly projection data
    const yearlyProj: YearlyProjection[] = [];
    let cumulativeInvestment = 0;
    const stepUpRate = (data.stepUpPercent || 0) / 100;

    for (let year = 1; year <= data.years; year++) {
      const monthlyInvestment = data.monthlyInvestment * Math.pow(1 + stepUpRate, year - 1);
      const annualInvestment = monthlyInvestment * 12;
      cumulativeInvestment += annualInvestment;

      yearlyProj.push({
        year,
        monthlyInvestment: Math.round(monthlyInvestment),
        annualInvestment: Math.round(annualInvestment),
        cumulativeInvestment: Math.round(cumulativeInvestment),
      });
    }

    setProjections(yearlyProj);
    setProjectionFirstTwelve(yearlyProj.slice(0, 12));

    // Generate chart data showing growth over time
    const data_points: ChartDataPoint[] = [];
    const monthlyReturn = (data.annualReturn / 12) / 100;

    for (let month = 0; month <= result.numberOfMonths; month++) {
      if (month === 0) {
        data_points.push({ month: 0, invested: 0, value: 0 });
      } else {
        // Calculate invested amount considering step-up
        let invested = 0;
        let currentMonthlyAmount = data.monthlyInvestment;

        for (let m = 1; m <= month; m++) {
          if (m > 1 && (m - 1) % 12 === 0) {
            currentMonthlyAmount = currentMonthlyAmount * (1 + stepUpRate);
          }
          invested += currentMonthlyAmount;
        }

        const rPlusOne = 1 + monthlyReturn;
        const rPowerN = Math.pow(rPlusOne, month);
        const value = data.monthlyInvestment * ((rPowerN - 1) / monthlyReturn);
        data_points.push({
          month: month,
          invested: Math.round(invested),
          value: Math.round(value),
        });
      }
    }

    setChartData(data_points);
  };

  // Swipe navigation to related calculators (mobile only)
  const router = useRouter();
  const relatedCalcs = getInternalLinks('sip-calculator').slice(0, 5);
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
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
            <CalculatorIcon idOrHref="sip" className="w-6 h-6 text-white" />
          </span>
          <span>SIP Calculator</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
          Calculate your Systematic Investment Plan (SIP) returns and projected wealth growth. See how regular monthly investments compound over time.
        </p>
      </div>

      <ConfidenceBadge calculatorType="sip" />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="sip-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={sipScenarios}
            onSelectScenario={handleSelectScenario}
          />

          <form className="space-y-6">
            {/* Monthly Investment */}
            <div className="space-y-3">
              <label htmlFor="monthly-investment" className="block text-sm font-bold text-gray-900 dark:text-white">Monthly Investment (₹)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="100"
                  max="1000000"
                  step="100"
                  value={watchValues.monthlyInvestment === 0 ? "" : watchValues.monthlyInvestment}
                  onChange={(e) => handleInputChange('monthlyInvestment', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('monthlyInvestment', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  id="monthly-investment"
                  type="number" placeholder="0"
                  min="100"
                  max="1000000"
                  step="100"
                  value={watchValues.monthlyInvestment === 0 ? "" : watchValues.monthlyInvestment}
                  onChange={(e) => handleInputChange('monthlyInvestment', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('monthlyInvestment', Number(e.target.value))}
                  className="w-full md:w-36 px-3 py-3 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.monthlyInvestment && (
                <p className="text-red-500 text-sm">{errors.monthlyInvestment.message}</p>
              )}
              <div className="flex gap-2 flex-wrap mt-3">
                {[1000, 5000, 10000, 25000].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('monthlyInvestment', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                               bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                               hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                    ₹{val >= 1000 ? `${val / 1000}K` : val}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Start as low as ₹500/month. Increase with salary hikes. Even small amounts compound significantly over 10+ years
              </p>
            </div>

            {/* Years */}
            <div className="space-y-3">
              <label htmlFor="years" className="block text-sm font-bold text-gray-900 dark:text-white">Investment Duration (Years)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  id="years"
                  type="number" placeholder="0"
                  min="0"
                  max="50"
                  step="1"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-full md:w-40 px-3 py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.years && (
                <p className="text-red-500 text-sm">{errors.years.message}</p>
              )}
              <div className="flex gap-2 flex-wrap mt-3">
                {[5, 10, 15, 20].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('years', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                               bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    {val}y
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Index funds historically average 12-13% CAGR. Longer periods smooth out market volatility
              </p>
            </div>

            {/* Annual Return */}
            <div className="space-y-3">
              <label htmlFor="annual-return" className="block text-sm font-bold text-gray-900 dark:text-white">Expected Annual Return (%)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={watchValues.annualReturn === 0 ? "" : watchValues.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualReturn', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <input
                  id="annual-return"
                  type="number" placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                  value={watchValues.annualReturn === 0 ? "" : watchValues.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualReturn', Number(e.target.value))}
                  className="w-full md:w-40 px-3 py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                />
              </div>
              {errors.annualReturn && (
                <p className="text-red-500 text-sm">{errors.annualReturn.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">Typical: 8-15% for stock markets</p>
            </div>

            {/* Step Up Percentage */}
            <div className="space-y-3">
              <label htmlFor="step-up" className="block text-sm font-bold text-gray-900 dark:text-white">Annual Step Up (%)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={watchValues.stepUpPercent === 0 ? "" : watchValues.stepUpPercent}
                  onChange={(e) => handleInputChange('stepUpPercent', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('stepUpPercent', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <input
                  id="step-up"
                  type="number" placeholder="0"
                  min="0"
                  max="50"
                  step="0.5"
                  value={watchValues.stepUpPercent === 0 ? "" : watchValues.stepUpPercent}
                  onChange={(e) => handleInputChange('stepUpPercent', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('stepUpPercent', Number(e.target.value))}
                  className="w-full md:w-40 px-3 py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-purple-400 rounded-lg font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700"
                />
              </div>
              {errors.stepUpPercent && (
                <p className="text-red-500 text-sm">{errors.stepUpPercent.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">Increase investment by this % each year (0-50%)</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Trash2 className="w-4 h-4 inline mr-1" aria-hidden="true" /> Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div id="sip-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Investment Results</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Total Investment */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide font-semibold mb-2">Total Invested</p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words overflow-hidden">
                    {formatCurrency(result.totalInvestment)}
                  </p>
                </div>

                {/* Future Value - Highlighted */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-lg hover:shadow-xl transition-all">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1"><Target className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Future Value (Maturity)</p>
                  <p className="text-xl sm:text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 break-words overflow-hidden">
                    {formatCurrency(result.futureValue)}
                  </p>
                </div>

                {/* Gain Amount */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 inline flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Total Gains (Returns)</p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400 break-words overflow-hidden">
                    {formatCurrency(result.gainedAmount)}
                  </p>
                </div>

                {/* Return Percentage */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-5 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">Return Rate (%)</p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-400 break-words overflow-hidden">
                    {((result.gainedAmount / result.totalInvestment) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Result Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Understanding Your Results</h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Total Invested:</strong> The sum of all your monthly SIP contributions over {watchValues.years} year{watchValues.years > 1 ? 's' : ''} (including step-up increases)</p>
                  <p><strong>Future Value:</strong> Your total amount after growth at {watchValues.annualReturn}% annual return - this is your maturity amount</p>
                  <p><strong>Total Gains:</strong> The profit you'll earn = Future Value - Total Invested. This is your investment growth from compound returns</p>
                  <p><strong>Return Rate:</strong> The percentage gain on your invested amount. Higher % = better investment performance</p>
                </div>
              </div>

              {/* Investment Insights */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Key Insights</h3>
                <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <p>• Your money grows <strong>{((result.futureValue / result.totalInvestment) - 1).toFixed(1)}x</strong> over {watchValues.years} year{watchValues.years > 1 ? 's' : ''}</p>
                  <p>• Monthly investment of <strong>₹{watchValues.monthlyInvestment.toLocaleString('en-IN')}</strong> becomes <strong>₹{(result.futureValue / (watchValues.years * 12)).toLocaleString('en-IN')}</strong> per month in terms of value</p>
                  <p>• <strong>{((result.gainedAmount / result.futureValue) * 100).toFixed(0)}%</strong> of your final amount is pure profit from returns</p>
                  {watchValues.stepUpPercent > 0 && <p>• Annual {watchValues.stepUpPercent}% step-up adds ₹{((result.totalInvestment - (watchValues.monthlyInvestment * 12 * watchValues.years))).toLocaleString('en-IN')} extra over the period</p>}
                </div>
              </div>

              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2"><BarChart2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> How Do You Compare?</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your projected corpus of <strong>{formatCurrency(result.futureValue)}</strong> demonstrates the power of disciplined investing. Consistent SIP investments typically outperform market timing, and a 12-13% return rate (index fund average) has historically beaten inflation by 6-7% annually. Your {watchValues.stepUpPercent}% annual step-up accelerates wealth accumulation.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ⚠️ <strong>Disclaimer:</strong> This calculation assumes regular monthly investments and consistent {watchValues.annualReturn}% annual returns. Actual returns vary based on market conditions, fund selection, and economic factors.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                {/* Share Section */}
                <ShareButtons
                  inputs={[
                    { label: 'Monthly Investment', value: `₹${watchValues.monthlyInvestment.toLocaleString('en-IN')}` },
                    { label: 'Investment Period', value: `${watchValues.years} years` },
                    { label: 'Expected Annual Return', value: `${watchValues.annualReturn}%` },
                    { label: 'Annual Step-Up', value: `${watchValues.stepUpPercent}%` },
                  ]}
                  outputs={[
                    { label: 'Future Value', value: `₹${result.futureValue.toLocaleString('en-IN')}` },
                    { label: 'Total Invested', value: `₹${result.totalInvestment.toLocaleString('en-IN')}` },
                    { label: 'Total Gains', value: `₹${result.gainedAmount.toLocaleString('en-IN')}` },
                    { label: 'Return Rate', value: `${((result.gainedAmount / result.totalInvestment) * 100).toFixed(1)}%` },
                  ]}
                  calculatorName="SIP Calculator"
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your investment details and click &quot;Calculate SIP&quot; to see your results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Investment Projection Section */}
      {projections.length > 0 && (
        <Suspense fallback={<div className="card h-32" />}>
          <ProjectionTable
            projections={projections}
            projectionFirstTwelve={projectionFirstTwelve}
            showFullSchedule={showFullSchedule}
            onToggle={() => setShowFullSchedule(!showFullSchedule)}
          />
        </Suspense>
      )}

      {/* Step-up Info */}
      {projections.length > 0 && (watchValues.stepUpPercent || 0) > 0 && (
        <div className="card p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500">
          <p className="text-sm text-purple-900 dark:text-purple-300">
            <span className="font-semibold">Step-up Active:</span> Your monthly investment increases by <span className="font-bold text-lg">{(watchValues.stepUpPercent || 0).toFixed(1)}%</span> each year. This helps your SIP grow with your income!
          </p>
        </div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart2 className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Growth Visualization</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sipInvestedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="sipValueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
                <XAxis
                  dataKey="month"
                  label={{ value: 'Months', position: 'insideBottomRight', offset: -5 }}
                  stroke={chartColors.axisColor}
                  tick={{ fill: chartColors.axisFill, fontSize: 12 }}
                />
                <YAxis
                  stroke={chartColors.axisColor}
                  tick={{ fill: chartColors.axisFill, fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={chartColors.tooltipStyle}
                  wrapperStyle={{ outline: 'none' }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#sipInvestedGrad)"
                  name="Total Invested"
                  dot={false}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#sipValueGrad)"
                  name="Future Value"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          {result && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Coins className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> SIP Breakup</h2>
              <MemoizedPieChart
                data={[
                  { name: 'Total Invested', value: result.totalInvestment },
                  { name: 'Returns Gained', value: result.gainedAmount },
                ]}
                colors={['#3b82f6', '#10b981']}
                height={300}
              />
              <div className="space-y-2 text-sm px-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Total Invested</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">Returns Gained</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.gainedAmount)}</span>
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
          <h2 className="text-2xl font-bold mb-4">What is SIP (Systematic Investment Plan)?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            A Systematic Investment Plan (SIP) is an investment method where you invest a fixed amount regularly (usually monthly) in mutual funds. Instead of investing a lump sum, SIP enables rupee cost averaging, which reduces the impact of market volatility and makes investing more disciplined and automated. SIPs are ideal for long-term wealth creation starting with amounts as low as ₹500/month.
          </p>
        </div>

        {/* List Snippet: Benefits of SIP */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Key Benefits of SIP Investment</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">1.</span>
              <span><strong>Rupee Cost Averaging:</strong> You buy more units when prices are low and fewer when prices are high, reducing the average cost per unit over time.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">2.</span>
              <span><strong>Flexibility:</strong> Adjust or stop your SIP anytime without penalties. Most funds allow pauses and increases.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">3.</span>
              <span><strong>Low Entry Barrier:</strong> Start with as little as ₹500/month. No lump sum needed to begin investing.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">4.</span>
              <span><strong>Disciplined Investing:</strong> Automatic monthly deductions encourage consistent habit-building without emotional decisions.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">5.</span>
              <span><strong>Power of Compounding:</strong> Long-term SIP investments can create substantial wealth through compound returns.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">6.</span>
              <span><strong>Less Stressful:</strong> No need to time the market. SIP works well in both bull and bear markets.</span>
            </li>
          </ol>
        </div>

        {/* Comparison Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">SIP vs Lump Sum Investment: Which is Better?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><RefreshCw className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> SIP (Regular Investment)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Fixed amount invested monthly over extended period. Spreads risk through rupee cost averaging.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Best For:</strong> Beginners, low income, risk-averse</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Returns:</strong> Moderate, steady, lower volatility</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Coins className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Lump Sum (One-Time)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Entire amount invested at once. Best if you have bulk cash available.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Best For:</strong> Downturn timing, inheritance, bonus</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Returns:</strong> Higher potential, but higher timing risk</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Verdict:</strong> SIP is recommended for most Indian investors as it removes the pressure of market timing and ensures disciplined wealth creation. Even small monthly amounts (₹500-1000) can grow to ₹10-20 lakhs over 20 years with 12% returns.
            </p>
          </div>
        </div>

        {/* Table Snippet: SIP Returns Example */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">SIP Returns Projection @ 12% Annual Return</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Monthly SIP</th>
                  <th className="text-center py-3 px-4 font-bold">5 Years</th>
                  <th className="text-center py-3 px-4 font-bold">10 Years</th>
                  <th className="text-center py-3 px-4 font-bold">20 Years</th>
                  <th className="text-center py-3 px-4 font-bold">30 Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹500</td>
                  <td className="text-center py-3 px-4">₹37,349</td>
                  <td className="text-center py-3 px-4">₹92,297</td>
                  <td className="text-center py-3 px-4">₹311,624</td>
                  <td className="text-center py-3 px-4">₹1,04,51,858</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹10,000</td>
                  <td className="text-center py-3 px-4">₹7,46,984</td>
                  <td className="text-center py-3 px-4">₹18,45,937</td>
                  <td className="text-center py-3 px-4">₹62,32,475</td>
                  <td className="text-center py-3 px-4">₹2,09,03,716</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹25,000</td>
                  <td className="text-center py-3 px-4">₹18,67,461</td>
                  <td className="text-center py-3 px-4">₹46,14,843</td>
                  <td className="text-center py-3 px-4">₹1,55,81,188</td>
                  <td className="text-center py-3 px-4">₹5,22,59,290</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹50,000</td>
                  <td className="text-center py-3 px-4">₹37,34,922</td>
                  <td className="text-center py-3 px-4">₹92,29,686</td>
                  <td className="text-center py-3 px-4">₹3,11,62,377</td>
                  <td className="text-center py-3 px-4">₹10,45,18,580</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('sip-calculator')} />


      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is SIP?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Systematic Investment Plan (SIP) is a method of investing fixed amounts regularly in mutual funds. Instead of investing a lump sum, you invest a small amount every month, which helps in rupee cost averaging and reduces market volatility risk.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s a good expected return rate?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Expected returns vary by investment type: Equity/Stock funds: 12-15% per annum, Balanced funds: 8-10%, Debt/Bond funds: 5-7%, Bank FDs: 6-7%. Past performance doesn&apos;t guarantee future results.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s the minimum SIP amount?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Most mutual funds allow SIPs starting from ₹100-500 per month. Some funds have no minimum. Higher amounts don&apos;t necessarily give better returns, but consistent investing does.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is Step Up in SIP?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Step Up SIP allows you to increase your monthly investment by a fixed percentage each year. For example, with 10% step-up on a ₹10,000 SIP: Year 1 = ₹10,000/month, Year 2 = ₹11,000/month, Year 3 = ₹12,100/month, etc. This is ideal as your income grows and you can afford higher investments.
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
          calculatorName="SIP"
        />
      </div>

      {/* Padding for fixed footer on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
}

