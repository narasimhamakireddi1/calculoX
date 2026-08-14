'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { Shield, Rocket, Target, TrendingUp, BarChart2, Coins, BookOpen, Lightbulb, Trash2, AlertTriangle } from 'lucide-react';

const ProjectionTable = lazy(() => import('@/components/sip/ProjectionTable').then(m => ({ default: m.default })));
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '@/components/charts/useChartColors';
import { ChartEmptyState } from '@/components/charts/ChartEmptyState';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculateSIP } from '@/lib/calculators/sip';
import { SIPSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

export type SIPFormData = {
  monthlyInvestment: number;
  years: number;
  annualReturn: number;
  stepUpPercent: number;
};

export interface SIPResultData {
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

const DEFAULT_SIP_VALUES: SIPFormData = { monthlyInvestment: 10000, years: 10, annualReturn: 12, stepUpPercent: 5 };

function computeSIPAll(data: SIPFormData) {
  const r = calculateSIP(data);
  const stepUpRate = (data.stepUpPercent || 0) / 100;

  const projections: YearlyProjection[] = [];
  let cumulativeInvestment = 0;
  for (let year = 1; year <= data.years; year++) {
    const monthlyInvestment = data.monthlyInvestment * Math.pow(1 + stepUpRate, year - 1);
    const annualInvestment = monthlyInvestment * 12;
    cumulativeInvestment += annualInvestment;
    projections.push({
      year,
      monthlyInvestment: Math.round(monthlyInvestment),
      annualInvestment: Math.round(annualInvestment),
      cumulativeInvestment: Math.round(cumulativeInvestment),
    });
  }

  const chartData: ChartDataPoint[] = [{ month: 0, invested: 0, value: 0 }];
  const monthlyReturn = (data.annualReturn / 12) / 100;
  for (let month = 1; month <= r.numberOfMonths; month++) {
    let invested = 0;
    let currentMonthlyAmount = data.monthlyInvestment;
    for (let m = 1; m <= month; m++) {
      if (m > 1 && (m - 1) % 12 === 0) {
        currentMonthlyAmount = currentMonthlyAmount * (1 + stepUpRate);
      }
      invested += currentMonthlyAmount;
    }
    const rPowerN = Math.pow(1 + monthlyReturn, month);
    const value = data.monthlyInvestment * ((rPowerN - 1) / monthlyReturn);
    chartData.push({ month, invested: Math.round(invested), value: Math.round(value) });
  }

  return { result: r, chartData, projections, projectionFirstTwelve: projections.slice(0, 12) };
}

const INITIAL_SIP_DATA = (() => {
  try { return computeSIPAll(DEFAULT_SIP_VALUES); } catch { return null; }
})();

export function SIPCalculatorCore({ embed = false, initialValues }: { embed?: boolean; initialValues?: Partial<SIPFormData> }) {
  const effectiveDefaults = useMemo(() => ({ ...DEFAULT_SIP_VALUES, ...initialValues }), [initialValues]);
  const initialComputed = useMemo(() => {
    if (!initialValues) return INITIAL_SIP_DATA;
    try { return computeSIPAll(effectiveDefaults); } catch { return null; }
  }, [initialValues, effectiveDefaults]);

  const chartColors = useChartColors();
  const [result, setResult] = useState<SIPResultData | null>(initialComputed?.result ?? null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>(initialComputed?.chartData ?? []);
  const [projections, setProjections] = useState<YearlyProjection[]>(initialComputed?.projections ?? []);
  const [projectionFirstTwelve, setProjectionFirstTwelve] = useState<YearlyProjection[]>(initialComputed?.projectionFirstTwelve ?? []);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SIPFormData>({
    resolver: zodResolver(SIPSchema),
    defaultValues: effectiveDefaults,
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
    setProjectionFirstTwelve([]);
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

  const calculateResults = useCallback((data: SIPFormData) => {
    const computed = computeSIPAll(data);
    setResult(computed.result);
    setChartData(computed.chartData);
    setProjections(computed.projections);
    setProjectionFirstTwelve(computed.projectionFirstTwelve);
  }, []);

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.monthlyInvestment && watchValues.years && watchValues.annualReturn !== undefined) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues, calculateResults]);

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0">
            <CalculatorIcon idOrHref="sip" className="w-6 h-6 text-white" />
          </span>
          <span>SIP Calculator</span>
        </h1>
        {!embed && (
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Calculate your Systematic Investment Plan (SIP) returns and projected wealth growth. See how regular monthly investments compound over time.
          </p>
        )}
      </div>

      {!embed && <ConfidenceBadge calculatorType="sip" />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="sip-inputs" className="card min-w-0">
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
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center min-w-0">
                <RangeSlider
                  min="100"
                  max="1000000"
                  step="100"
                  value={watchValues.monthlyInvestment === 0 ? "" : watchValues.monthlyInvestment}
                  onChange={(e) => handleInputChange('monthlyInvestment', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('monthlyInvestment', Number(e.target.value))}
                  className="w-full flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                  className="w-full min-w-0 md:w-28 px-2 py-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.monthlyInvestment && (
                <p className="text-red-500 text-sm">{errors.monthlyInvestment.message}</p>
              )}
              <div className="flex gap-2 flex-wrap mt-3">
                {[1000, 5000, 10000, 25000].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('monthlyInvestment', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                               bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    ₹{val >= 1000 ? `${val / 1000}K` : val}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-1">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                Start as low as ₹500/month. Increase with salary hikes. Even small amounts compound significantly over 10+ years
              </p>
            </div>

            {/* Years */}
            <div className="space-y-3">
              <label htmlFor="years" className="block text-sm font-bold text-gray-900 dark:text-white">Investment Duration (Years)</label>
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center min-w-0">
                <RangeSlider
                  min="1"
                  max="50"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-full flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                  className="w-full min-w-0 md:w-28 px-2 py-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-1">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                Index funds historically average 12-13% CAGR. Longer periods smooth out market volatility
              </p>
            </div>

            {/* Annual Return */}
            <div className="space-y-3">
              <label htmlFor="annual-return" className="block text-sm font-bold text-gray-900 dark:text-white">Expected Annual Return (%)</label>
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center min-w-0">
                <RangeSlider
                  min="0"
                  max="100"
                  step="0.1"
                  value={watchValues.annualReturn === 0 ? "" : watchValues.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualReturn', Number(e.target.value))}
                  className="w-full flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                  className="w-full min-w-0 md:w-28 px-2 py-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
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
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center min-w-0">
                <RangeSlider
                  min="0"
                  max="50"
                  step="0.5"
                  value={watchValues.stepUpPercent === 0 ? "" : watchValues.stepUpPercent}
                  onChange={(e) => handleInputChange('stepUpPercent', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('stepUpPercent', Number(e.target.value))}
                  className="w-full flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                  className="w-full min-w-0 md:w-28 px-2 py-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
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
              className="btn-ghost w-full inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" /> Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="min-w-0">
          {result ? (
            <div id="sip-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Investment Results</h2>

              {/* Hero metric */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 p-6 sm:p-8 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg [container-type:inline-size]">
                <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Future Value (Maturity)</p>
                <p className="text-[clamp(1.5rem,7.5cqw,3.75rem)] font-black text-blue-700 dark:text-blue-400 break-all leading-tight">
                  {formatCurrency(result.futureValue)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">after {watchValues.years} year{watchValues.years > 1 ? 's' : ''} at {watchValues.annualReturn}% return</p>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="stat-tile">
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1">Total Invested</p>
                  <p className="text-[clamp(0.8rem,7.5cqw,1.125rem)] font-bold text-gray-900 dark:text-white break-all leading-tight">
                    {formatCurrency(result.totalInvestment)}
                  </p>
                </div>

                <div className="stat-tile">
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Total Gains</p>
                  <p className="text-[clamp(0.8rem,7.5cqw,1.125rem)] font-bold text-emerald-600 dark:text-emerald-400 break-all leading-tight">
                    {formatCurrency(result.gainedAmount)}
                  </p>
                </div>

                <div className="stat-tile col-span-2 sm:col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1">Return Rate</p>
                  <p className="text-[clamp(0.8rem,7.5cqw,1.125rem)] font-bold text-emerald-600 dark:text-emerald-400 break-all leading-tight">
                    {((result.gainedAmount / result.totalInvestment) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Result Explanation */}
              <div className="info-panel">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Understanding Your Results</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong className="text-gray-900 dark:text-white">Total Invested:</strong> The sum of all your monthly SIP contributions over {watchValues.years} year{watchValues.years > 1 ? 's' : ''} (including step-up increases)</p>
                  <p><strong className="text-gray-900 dark:text-white">Future Value:</strong> Your total amount after growth at {watchValues.annualReturn}% annual return - this is your maturity amount</p>
                  <p><strong className="text-gray-900 dark:text-white">Total Gains:</strong> The profit you'll earn = Future Value - Total Invested. This is your investment growth from compound returns</p>
                  <p><strong className="text-gray-900 dark:text-white">Return Rate:</strong> The percentage gain on your invested amount. Higher % = better investment performance</p>
                </div>
              </div>

              {/* Investment Insights */}
              <div className="info-panel">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" /> Key Insights</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>• Your money grows <strong className="text-gray-900 dark:text-white">{((result.futureValue / result.totalInvestment) - 1).toFixed(1)}x</strong> over {watchValues.years} year{watchValues.years > 1 ? 's' : ''}</p>
                  <p>• Monthly investment of <strong className="text-gray-900 dark:text-white">₹{watchValues.monthlyInvestment.toLocaleString('en-IN')}</strong> becomes <strong className="text-gray-900 dark:text-white">₹{(result.futureValue / (watchValues.years * 12)).toLocaleString('en-IN')}</strong> per month in terms of value</p>
                  <p>• <strong className="text-gray-900 dark:text-white">{((result.gainedAmount / result.futureValue) * 100).toFixed(0)}%</strong> of your final amount is pure profit from returns</p>
                  {watchValues.stepUpPercent > 0 && <p>• Annual {watchValues.stepUpPercent}% step-up adds ₹{((result.totalInvestment - (watchValues.monthlyInvestment * 12 * watchValues.years))).toLocaleString('en-IN')} extra over the period</p>}
                </div>
              </div>

              <div className="info-panel mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><BarChart2 className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} aria-hidden="true" /> How Do You Compare?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your projected corpus of <strong className="text-gray-900 dark:text-white">{formatCurrency(result.futureValue)}</strong> demonstrates the power of disciplined investing. Consistent SIP investments typically outperform market timing, and a 12-13% return rate (index fund average) has historically beaten inflation by 6-7% annually. Your {watchValues.stepUpPercent}% annual step-up accelerates wealth accumulation.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <AlertTriangle className="w-3 h-3 inline mr-1 flex-shrink-0" aria-hidden="true" /><strong>Disclaimer:</strong> This calculation assumes regular monthly investments and consistent {watchValues.annualReturn}% annual returns. Actual returns vary based on market conditions, fund selection, and economic factors.
                </p>
              </div>

              {!embed && (
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
              )}
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
        <div className="info-panel border-l-4 border-blue-500">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-white">Step-up Active:</span> Your monthly investment increases by <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{(watchValues.stepUpPercent || 0).toFixed(1)}%</span> each year. This helps your SIP grow with your income!
          </p>
        </div>
      )}

      {/* Chart Section */}
      {result ? (
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
      ) : <ChartEmptyState />}
    </>
  );
}
