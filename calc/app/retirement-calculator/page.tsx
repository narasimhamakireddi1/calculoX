'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';

const ProjectionTable = lazy(() => import('@/components/retirement/ProjectionTable').then(m => ({ default: m.default })));
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '@/components/charts/useChartColors';
import { NismRetirementEngine, type NismInputs, type NismCalculationResult } from '@/lib/calculators/nism-retirement';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { RelatedBlogPosts } from '@/components/ui/RelatedBlogPosts';
import { getRelatedBlogPosts } from '@/lib/blog/utils';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { Sunset, UserRound, Briefcase, Calendar, Coins, BarChart2, TrendingUp, Target, Trash2, ClipboardList, BookOpen, Lightbulb, AlertTriangle, Calculator, HelpCircle, ChevronRight } from 'lucide-react';
import { getInternalLinks } from '@/config/internal-links.config';
import z from 'zod';
import { RangeSlider } from '@/components/ui/RangeSlider';

// Zod validation schema
const RetirementSchema = z.object({
  present_age: z.number().min(18).max(75),
  retirement_age: z.number().min(25).max(100),
  life_expectancy: z.number().min(30).max(120),
  present_monthly_expenses: z.number().min(5000),
  expense_reduction_pct: z.number().min(0).max(50),
  long_term_inflation_pct: z.number().min(0).max(15),
  current_savings: z.number().min(0),
  lump_sum_benefits: z.number().min(0),
  pre_retirement_return_pct: z.number().min(4).max(25),
  post_retirement_return_pct: z.number().min(2).max(15),
});

type RetirementFormData = z.infer<typeof RetirementSchema>;
type TabType = 'timeline' | 'financials' | 'returns';

interface ChartDataPoint {
  year: number;
  age: number;
  corpus: number;
  accumulated?: number;
  depleted?: number;
}

const DEFAULT_RETIREMENT_INPUTS: NismInputs = {
  demographics: { present_age: 30, retirement_age: 60, life_expectancy: 85 },
  financials: { present_monthly_expenses: 50000, expense_reduction_pct: 20, long_term_inflation_pct: 6, current_savings: 200000, lump_sum_benefits: 0 },
  investment_returns: { pre_retirement_return_pct: 11, post_retirement_return_pct: 7 },
};

function computeRetirementAll(inputs: NismInputs) {
  const validation = NismRetirementEngine.validate(inputs);
  if (!validation.valid) return null;
  const result = NismRetirementEngine.calculate(inputs);
  const projectionData = NismRetirementEngine.generateProjection(inputs, result);
  const projectionFirstTwelve = projectionData.slice(0, 12);
  const chartData: ChartDataPoint[] = projectionData.map((p) => ({
    year: p.year,
    age: p.age,
    corpus: p.corpus,
    accumulated: p.phase === 'accumulation' ? p.corpus : undefined,
    depleted: p.phase === 'distribution' ? p.corpus : undefined,
  }));
  return { result, projections: projectionData, projectionFirstTwelve, chartData };
}

const INITIAL_RETIREMENT_DATA = (() => {
  try { return computeRetirementAll(DEFAULT_RETIREMENT_INPUTS); } catch { return null; }
})();

export default function RetirementCalculatorPage() {
  const chartColors = useChartColors();
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [result, setResult] = useState<NismCalculationResult | null>(INITIAL_RETIREMENT_DATA?.result ?? null);
  const [projections, setProjections] = useState<any[]>(INITIAL_RETIREMENT_DATA?.projections ?? []);
  const [chartData, setChartData] = useState<ChartDataPoint[]>(INITIAL_RETIREMENT_DATA?.chartData ?? []);
  const [projectionFirstTwelve, setProjectionFirstTwelve] = useState<any[]>(INITIAL_RETIREMENT_DATA?.projectionFirstTwelve ?? []);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<RetirementFormData>({
    resolver: zodResolver(RetirementSchema),
    defaultValues: {
      present_age: 30,
      retirement_age: 60,
      life_expectancy: 85,
      present_monthly_expenses: 50000,
      expense_reduction_pct: 20,
      long_term_inflation_pct: 6,
      current_savings: 200000,
      lump_sum_benefits: 0,
      pre_retirement_return_pct: 11,
      post_retirement_return_pct: 7,
    },
  });

  const watchValues = watch();

  const handleInputChange = (fieldName: keyof RetirementFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
    // Enforce ordering: present_age < retirement_age < life_expectancy
    if (fieldName === 'present_age' && watchValues.retirement_age <= value) {
      setValue('retirement_age', value + 1, { shouldValidate: true });
    }
    if (fieldName === 'retirement_age' && watchValues.life_expectancy <= value) {
      setValue('life_expectancy', value + 1, { shouldValidate: true });
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setProjections([]);
    setChartData([]);
    setProjectionFirstTwelve([]);
    setShowFullSchedule(false);
  };

  // Quick-start scenarios
  const retirementScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Early Retirement (40)',
      description: 'Retire at 40, live to 85',
      icon: Sunset,
      values: {
        present_age: 35,
        retirement_age: 40,
        life_expectancy: 85,
        present_monthly_expenses: 50000,
        current_savings: 5000000,
        expense_reduction_pct: 20,
        pre_retirement_return_pct: 12,
        post_retirement_return_pct: 7,
        long_term_inflation_pct: 6,
        lump_sum_benefits: 0,
      }
    },
    {
      label: 'Standard Retirement (60)',
      description: 'Retire at 60, live to 90',
      icon: UserRound,
      values: {
        present_age: 40,
        retirement_age: 60,
        life_expectancy: 90,
        present_monthly_expenses: 75000,
        current_savings: 1000000,
        expense_reduction_pct: 20,
        pre_retirement_return_pct: 11,
        post_retirement_return_pct: 7,
        long_term_inflation_pct: 6,
        lump_sum_benefits: 0,
      }
    },
    {
      label: 'Extended Work (65)',
      description: 'Work till 65, live comfortably',
      icon: Briefcase,
      values: {
        present_age: 45,
        retirement_age: 65,
        life_expectancy: 95,
        present_monthly_expenses: 100000,
        current_savings: 2000000,
        expense_reduction_pct: 15,
        pre_retirement_return_pct: 10,
        post_retirement_return_pct: 6,
        long_term_inflation_pct: 5,
        lump_sum_benefits: 0,
      }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof RetirementFormData, Number(value), { shouldValidate: true });
    });
  }, [setValue]);

  // Auto-calculate on input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const inputs: NismInputs = {
        demographics: {
          present_age: watchValues.present_age,
          retirement_age: watchValues.retirement_age,
          life_expectancy: watchValues.life_expectancy,
        },
        financials: {
          present_monthly_expenses: watchValues.present_monthly_expenses,
          expense_reduction_pct: watchValues.expense_reduction_pct,
          long_term_inflation_pct: watchValues.long_term_inflation_pct,
          current_savings: watchValues.current_savings,
          lump_sum_benefits: watchValues.lump_sum_benefits,
        },
        investment_returns: {
          pre_retirement_return_pct: watchValues.pre_retirement_return_pct,
          post_retirement_return_pct: watchValues.post_retirement_return_pct,
        },
      };

      const computed = computeRetirementAll(inputs);
      if (computed) {
        setResult(computed.result);
        setProjections(computed.projections);
        setProjectionFirstTwelve(computed.projectionFirstTwelve);
        setChartData(computed.chartData);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues]);

  // Single blue accent for every slider (design-system: one accent per page).
  // Keys retained so field call-sites need no change; all resolve to blue.
  const BLUE_RANGE = 'w-full flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600';
  const BLUE_NUMBER = 'w-full md:w-28 px-2 py-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700';
  const sliderRange = {
    blue: BLUE_RANGE, purple: BLUE_RANGE, green: BLUE_RANGE, emerald: BLUE_RANGE, orange: BLUE_RANGE,
    rose: BLUE_RANGE, cyan: BLUE_RANGE, amber: BLUE_RANGE, indigo: BLUE_RANGE, teal: BLUE_RANGE,
  };
  const sliderNumber = {
    blue: BLUE_NUMBER, purple: BLUE_NUMBER, green: BLUE_NUMBER, emerald: BLUE_NUMBER, orange: BLUE_NUMBER,
    rose: BLUE_NUMBER, cyan: BLUE_NUMBER, amber: BLUE_NUMBER, indigo: BLUE_NUMBER, teal: BLUE_NUMBER,
  };

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0">
            <CalculatorIcon idOrHref="retirement" className="w-6 h-6 text-white" />
          </span>
          <span>Retirement Corpus Calculator</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
          NISM Framework-based retirement planning engine. Calculate your exact retirement corpus needed, accounting for inflation-adjusted returns and lifestyle adjustments.
        </p>
      </div>

      {/* Hero Metrics Callout */}
      {result && (
        <div className="space-y-3">
          {/* Hero metric */}
          <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 border-2 border-blue-300 dark:border-blue-700 shadow-lg p-6 sm:p-8">
            <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Monthly SIP Required
            </p>
            <p className="text-[clamp(1.5rem,7.5vw,3.75rem)] font-black text-blue-700 dark:text-blue-400 whitespace-nowrap leading-tight">
              {formatCurrency(result.monthly_sip_required)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-2 font-medium">
              starting today for {result.accumulationYears} years
            </p>
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="stat-tile">
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                <Coins className="w-3 h-3 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Monthly at Retirement
              </p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                {formatCurrency(result.monthly_expense_at_retirement)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">in {result.accumulationYears} years</p>
            </div>

            <div className="stat-tile">
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                <Target className="w-3 h-3 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Corpus Required
              </p>
              <p className="text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                {formatCurrency(result.total_corpus_required)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">for {result.distributionYears} years</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 min-w-0">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Retirement Inputs</h2>

            {/* Quick-Start Examples */}
            <QuickStartExamples
              scenarios={retirementScenarios}
              onSelectScenario={handleSelectScenario}
            />

            {/* Tab Navigation */}
            <div className="grid grid-cols-3 mb-6 border-b border-gray-200 dark:border-gray-700">
              {(['timeline', 'financials', 'returns'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 font-semibold text-sm transition-all ${
                    activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'timeline' && <span className="flex items-center justify-center gap-1.5"><Calendar className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />Timeline</span>}
                  {tab === 'financials' && <span className="flex items-center justify-center gap-1.5"><Coins className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />Financials</span>}
                  {tab === 'returns' && <span className="flex items-center justify-center gap-1.5"><BarChart2 className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />Returns</span>}
                </button>
              ))}
            </div>

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {/* Present Age */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Present Age (Years)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="18"
                      max="75"
                      value={watchValues.present_age}
                      onChange={(e) => handleInputChange('present_age', Number(e.target.value))}
                      className={sliderRange.blue}
                    />
                    <input
                      type="number"
                      min="18"
                      max="75"
                      value={watchValues.present_age}
                      onChange={(e) => handleInputChange('present_age', Number(e.target.value))}
                      className={sliderNumber.blue}
                    />
                  </div>
                  {errors.present_age && <p className="text-red-500 text-sm mt-1">{errors.present_age.message}</p>}
                </div>

                {/* Retirement Age */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Retirement Age (Years)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="25"
                      max="100"
                      value={watchValues.retirement_age}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleInputChange('retirement_age', Math.max(val, watchValues.present_age + 1));
                      }}
                      className={sliderRange.purple}
                    />
                    <input
                      type="number"
                      min="25"
                      max="100"
                      value={watchValues.retirement_age}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleInputChange('retirement_age', Math.max(val, watchValues.present_age + 1));
                      }}
                      className={sliderNumber.purple}
                    />
                  </div>
                  {errors.retirement_age && <p className="text-red-500 text-sm mt-1">{errors.retirement_age.message}</p>}
                </div>

                {/* Life Expectancy */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Life Expectancy (Years)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="30"
                      max="120"
                      value={watchValues.life_expectancy}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleInputChange('life_expectancy', Math.max(val, watchValues.retirement_age + 1));
                      }}
                      className={sliderRange.green}
                    />
                    <input
                      type="number"
                      min="30"
                      max="120"
                      value={watchValues.life_expectancy}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleInputChange('life_expectancy', Math.max(val, watchValues.retirement_age + 1));
                      }}
                      className={sliderNumber.green}
                    />
                  </div>
                  {errors.life_expectancy && <p className="text-red-500 text-sm mt-1">{errors.life_expectancy.message}</p>}
                </div>

                {/* Timeline Summary */}
                {result && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                      Accumulation Phase: {result.accumulationYears} years ({result.totalWorkingMonths} months)
                    </p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                      Distribution Phase: {result.distributionYears} years ({result.totalRetirementMonths} months)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Financials Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-4">
                {/* Monthly Expenses */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Current Monthly Expenses (₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="5000"
                      max="500000"
                      step="5000"
                      value={watchValues.present_monthly_expenses}
                      onChange={(e) => handleInputChange('present_monthly_expenses', Number(e.target.value))}
                      className={sliderRange.emerald}
                    />
                    <input
                      type="number"
                      min="5000"
                      value={watchValues.present_monthly_expenses}
                      onChange={(e) => handleInputChange('present_monthly_expenses', Number(e.target.value))}
                      className={sliderNumber.emerald}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap mt-3">
                    {[30000, 50000, 75000, 100000].map(val => (
                      <button key={val} type="button" onClick={() => handleInputChange('present_monthly_expenses', val)}
                        className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                                   bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                                   hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                        ₹{val >= 100000 ? `${val / 100000}L` : `${val / 1000}K`}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter current monthly expenses. Use the 25x rule: Corpus = 25 × Annual Expense for 4% withdrawal strategy
                  </p>
                </div>

                {/* Expense Reduction */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Expense Reduction Post-Retirement (%)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="0"
                      max="50"
                      value={watchValues.expense_reduction_pct}
                      onChange={(e) => handleInputChange('expense_reduction_pct', Number(e.target.value))}
                      className={sliderRange.orange}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={watchValues.expense_reduction_pct}
                      onChange={(e) => handleInputChange('expense_reduction_pct', Number(e.target.value))}
                      className={sliderNumber.orange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    E.g., 20% for eliminated work commute and home loan
                  </p>
                </div>

                {/* Inflation Rate */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Long-term Inflation Rate (% p.a.)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="0"
                      max="15"
                      step="0.1"
                      value={watchValues.long_term_inflation_pct}
                      onChange={(e) => handleInputChange('long_term_inflation_pct', Number(e.target.value))}
                      className={sliderRange.rose}
                    />
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.1"
                      value={watchValues.long_term_inflation_pct}
                      onChange={(e) => handleInputChange('long_term_inflation_pct', Number(e.target.value))}
                      className={sliderNumber.rose}
                    />
                  </div>
                </div>

                {/* Current Savings */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Current Retirement Savings (₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="0"
                      max="10000000"
                      step="100000"
                      value={watchValues.current_savings}
                      onChange={(e) => handleInputChange('current_savings', Number(e.target.value))}
                      className={sliderRange.cyan}
                    />
                    <input
                      type="number"
                      min="0"
                      value={watchValues.current_savings}
                      onChange={(e) => handleInputChange('current_savings', Number(e.target.value))}
                      className={sliderNumber.cyan}
                    />
                  </div>
                </div>

                {/* Lump Sum Benefits */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Lump Sum Benefits at Retirement (₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="0"
                      max="5000000"
                      step="100000"
                      value={watchValues.lump_sum_benefits}
                      onChange={(e) => handleInputChange('lump_sum_benefits', Number(e.target.value))}
                      className={sliderRange.amber}
                    />
                    <input
                      type="number"
                      min="0"
                      value={watchValues.lump_sum_benefits}
                      onChange={(e) => handleInputChange('lump_sum_benefits', Number(e.target.value))}
                      className={sliderNumber.amber}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    E.g., gratuity, EPF cashout, or other retirement bonuses
                  </p>
                </div>
              </div>
            )}

            {/* Returns Tab */}
            {activeTab === 'returns' && (
              <div className="space-y-4">
                {/* Pre-Retirement Return */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Pre-Retirement Return (% p.a.)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="4"
                      max="25"
                      step="0.5"
                      value={watchValues.pre_retirement_return_pct}
                      onChange={(e) => handleInputChange('pre_retirement_return_pct', Number(e.target.value))}
                      className={sliderRange.indigo}
                    />
                    <input
                      type="number"
                      min="4"
                      max="25"
                      step="0.5"
                      value={watchValues.pre_retirement_return_pct}
                      onChange={(e) => handleInputChange('pre_retirement_return_pct', Number(e.target.value))}
                      className={sliderNumber.indigo}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Typical: 10-12% for balanced growth portfolio
                  </p>
                </div>

                {/* Post-Retirement Return */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Post-Retirement Return (% p.a.)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <RangeSlider
                      min="2"
                      max="15"
                      step="0.5"
                      value={watchValues.post_retirement_return_pct}
                      onChange={(e) => handleInputChange('post_retirement_return_pct', Number(e.target.value))}
                      className={sliderRange.teal}
                    />
                    <input
                      type="number"
                      min="2"
                      max="15"
                      step="0.5"
                      value={watchValues.post_retirement_return_pct}
                      onChange={(e) => handleInputChange('post_retirement_return_pct', Number(e.target.value))}
                      className={sliderNumber.teal}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Typical: 6-8% for conservative income-focused portfolio
                  </p>
                </div>

                {/* Return Comparison */}
                {result && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Real Rate of Return (Post-Retirement):</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                      {(((1 + watchValues.post_retirement_return_pct / 100) / (1 + watchValues.long_term_inflation_pct / 100) - 1) * 100).toFixed(2)}% p.a.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Inflation-adjusted to maintain purchasing power
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Clear Button */}
            <button
              onClick={handleReset}
              className="btn-ghost w-full mt-6 inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 inline mr-1" aria-hidden="true" /> Clear All
            </button>

            {/* Formula Reference */}
            <div className="info-panel mt-6">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5"><Calculator className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> NISM Framework</h4>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <p><strong className="text-gray-900 dark:text-white">25x Rule:</strong> Corpus = 25 × Annual Expense Needed</p>
                <p><strong className="text-gray-900 dark:text-white">Corpus = FV of Savings + SIP Amount</strong></p>
                <p><strong className="text-gray-900 dark:text-white">Real Return:</strong> = Nominal - Inflation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div id="retirement-results" className="lg:col-span-2 min-w-0">
          {result ? (
            <div className="space-y-6">
              {/* Results Cards */}
              <div className="card space-y-4">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Detailed Breakdown</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Current Savings Future Value */}
                  <div className="info-panel">
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> FV of Current Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(result.fv_of_current_savings)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Grown at {watchValues.pre_retirement_return_pct}% p.a. for {result.accumulationYears} years
                    </p>
                  </div>

                  {/* Shortfall Corpus */}
                  <div className="info-panel">
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} aria-hidden="true" /> Shortfall Corpus
                    </p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(result.net_shortfall_to_build)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Amount to be built via SIP from today
                    </p>
                  </div>
                </div>

                {/* Understanding Retirement Corpus */}
                <div className="info-panel">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Understanding Your Retirement Plan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    The NISM framework calculates how much corpus you need to retire comfortably. It accounts for inflation and ensures your money lasts throughout retirement.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p><strong className="text-gray-900 dark:text-white">FV of Current Savings:</strong> {formatCurrency(result.fv_of_current_savings)} - How your existing savings will grow until retirement</p>
                    <p><strong className="text-gray-900 dark:text-white">Shortfall Corpus:</strong> {formatCurrency(result.net_shortfall_to_build)} - Additional amount needed (build via SIP)</p>
                    <p><strong className="text-gray-900 dark:text-white">Accumulation Phase:</strong> {result.accumulationYears} years - Time to save/grow money until retirement</p>
                    <p><strong className="text-gray-900 dark:text-white">Distribution Phase:</strong> {result.distributionYears} years - Years you'll live off corpus post-retirement</p>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="info-panel">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" /> Key Insights</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      <strong>Monthly SIP Needed:</strong> Build {formatCurrency(result.net_shortfall_to_build)} via monthly investments at {watchValues.pre_retirement_return_pct}% returns
                    </p>
                    <p>
                      <strong>Real Returns:</strong> At {watchValues.post_retirement_return_pct}% returns and {watchValues.long_term_inflation_pct}% inflation, your real return is {(((1 + watchValues.post_retirement_return_pct / 100) / (1 + watchValues.long_term_inflation_pct / 100) - 1) * 100).toFixed(2)}% p.a.
                    </p>
                    <p>
                      <strong>Retirement Security:</strong> Your corpus will support {watchValues.present_monthly_expenses * (1 - watchValues.expense_reduction_pct / 100) >= 0 ? 'monthly expenses' : 'inflation-adjusted expenses'} for {result.distributionYears} years
                    </p>
                    <p>
                      Start your SIP now to avoid financial stress during retirement. Every year of delay increases required monthly investment.
                    </p>
                  </div>
                </div>

                <div className="info-panel">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><BarChart2 className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} aria-hidden="true" /> How Do You Compare?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your retirement corpus target of <strong className="text-gray-900 dark:text-white">{formatCurrency(result.net_shortfall_to_build + result.fv_of_current_savings)}</strong> is based on the NISM 25x rule. With a monthly withdrawal of ₹{(watchValues.present_monthly_expenses * (1 - watchValues.expense_reduction_pct / 100)).toFixed(0)} and a {watchValues.post_retirement_return_pct}% real return rate, your corpus is designed to last {result.distributionYears} years while beating inflation. The 4% safe withdrawal rule suggests you can sustain monthly withdrawals without depleting your corpus.
                  </p>
                </div>

                <div className="info-panel border-l-4 border-amber-400">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Note:</strong> This calculator uses NISM framework with inflation-adjusted real rate of return to ensure your purchasing power is preserved during retirement.
                  </p>
                </div>

                {/* Share Button */}
                <div className="mt-4">
                  <ShareButtons
                    inputs={[
                      { label: 'Present Age', value: `${watchValues.present_age} years` },
                      { label: 'Retirement Age', value: `${watchValues.retirement_age} years` },
                      { label: 'Life Expectancy', value: `${watchValues.life_expectancy} years` },
                      { label: 'Current Monthly Expenses', value: formatCurrency(watchValues.present_monthly_expenses) }
                    ]}
                    outputs={[
                      { label: 'FV of Current Savings', value: formatCurrency(result.fv_of_current_savings) },
                      { label: 'Shortfall Corpus', value: formatCurrency(result.net_shortfall_to_build) },
                      { label: 'Accumulation Years', value: `${result.accumulationYears} years` },
                      { label: 'Distribution Years', value: `${result.distributionYears} years` }
                    ]}
                    calculatorName="Retirement Calculator"
                  />
                </div>
              </div>

              {/* Area Chart */}
              {result && (
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" />
                    Wealth Accumulation & Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAccum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDepleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
                      <XAxis dataKey="age" label={{ value: 'Age (years)', position: 'insideBottomRight', offset: -5 }} stroke={chartColors.axisColor} tick={{ fill: chartColors.axisFill, fontSize: 12 }} />
                      <YAxis stroke={chartColors.axisColor} tick={{ fill: chartColors.axisFill, fontSize: 12 }} tickFormatter={(value) => `₹${(value / 10000000).toFixed(0)}Cr`} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={chartColors.tooltipStyle}
                        wrapperStyle={{ outline: 'none' }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="accumulated"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorAccum)"
                        name="Accumulation Phase"
                        isAnimationActive={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="depleted"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorDepleted)"
                        name="Distribution Phase"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    The chart shows your corpus growing during the accumulation phase (working years) and gradually depleting during retirement while earning returns.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your retirement parameters to calculate your corpus needs
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projection Table */}
      {result && (
        <Suspense fallback={<div className="card h-32" />}>
          <ProjectionTable
            projections={projections}
            projectionFirstTwelve={projectionFirstTwelve}
            showFullSchedule={showFullSchedule}
            onToggle={() => setShowFullSchedule(!showFullSchedule)}
          />
        </Suspense>
      )}

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('retirement-calculator')} />

      <RelatedBlogPosts posts={getRelatedBlogPosts('/retirement-calculator')} />

      {/* Featured Snippet Sections for SEO */}
      {/* Definition Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">What is Retirement Corpus?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Retirement Corpus is the total amount of money you need to accumulate by the time you retire to sustain your lifestyle until the end of your life. It's calculated using the "25x Rule" — a popular retirement planning principle suggesting you need 25 times your annual expense saved. For example, if your annual expenses are ₹6 lakhs (₹50K/month), your retirement corpus should be ₹1.5 crores (₹6L × 25).
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          The corpus must grow through investments during your working years (accumulation phase) and then safely withdraw without running out of money during retirement (distribution phase). The NISM Framework uses a sophisticated calculation: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">Corpus = Inflation-Adjusted Expenses ÷ Real Return Rate</span>, which ensures your purchasing power is maintained throughout retirement.
        </p>
      </div>

      {/* Table Snippet - Target Corpus by Monthly Expense */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Target Retirement Corpus by Monthly Expense (25x Rule)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Monthly Expense</th>
                <th className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">Annual Expense</th>
                <th className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">Required Corpus (25x)</th>
                <th className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">Monthly Withdrawal @ 4%</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">₹30,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹3,60,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹90,00,000 (90L)</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹30,000</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">₹50,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹6,00,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹1,50,00,000 (1.5Cr)</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹50,000</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">₹75,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹9,00,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹2,25,00,000 (2.25Cr)</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹75,000</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">₹1,00,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹12,00,000</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹3,00,00,000 (3Cr)</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹1,00,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <strong>Note:</strong> The 25x rule assumes a 4% withdrawal rate annually. The corpus at 4% returns generates enough monthly income to cover your expenses indefinitely without depleting principal.
        </p>
      </div>

      {/* How-to List Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">How to Calculate Retirement Corpus in 5 Steps (NISM Framework)?</h2>
        <ol className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">1.</span>
            <div>
              <strong>Estimate Your Current Monthly Expenses:</strong> List all monthly expenses (rent, food, utilities, entertainment, healthcare, insurance, loans). This becomes your baseline expense. For example: ₹50,000/month = ₹6,00,000/year.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">2.</span>
            <div>
              <strong>Account for Inflation Until Retirement:</strong> Your current ₹50,000 will be worth less in future due to inflation. Assuming 6% inflation and retiring in 20 years, at retirement your monthly expenses will be ₹50,000 × (1.06)^20 ≈ ₹1,60,000.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">3.</span>
            <div>
              <strong>Reduce for Planned Expense Changes:</strong> Estimate how much your expenses will reduce in retirement (typically 10-30%). Examples: no work-related expenses (5-10%), house paid off (-10%), loans cleared (-5-10%). For ₹1,60,000, if 20% reduction: ₹1,60,000 × 0.8 = ₹1,28,000/month.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">4.</span>
            <div>
              <strong>Calculate Real Return Rate:</strong> Real return = (1 + Post-Retirement Return) / (1 + Inflation) - 1. If you expect 7% returns and 5% inflation: Real return = 1.07 / 1.05 - 1 ≈ 1.9% actual purchasing power growth.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">5.</span>
            <div>
              <strong>Calculate Required Corpus:</strong> Use the formula: Corpus = Monthly Expense at Retirement / Monthly Real Return Rate. For ₹1,28,000/month at 1.9% real return: Corpus = ₹1,28,000 / 0.019 ≈ ₹67,368,000 (₹6.7 crores needed).
            </div>
          </li>
        </ol>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Quick Rule of Thumb:</strong> Using the simple 25x rule: If your retirement expense is ₹1,28,000/month (₹15.36L/year), your target corpus is ₹15.36L × 25 = ₹3,84,00,000 (₹3.84Cr). This is a quick approximation without accounting for inflation dynamics.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is the NISM Framework?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              The NISM (National Institute of Securities Markets) Framework is a comprehensive retirement planning methodology that uses a 10-input data matrix and Inflation-Adjusted Real Rate of Return. It ensures your purchasing power doesn't erode during retirement by accounting for inflation in the post-retirement returns calculation.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is the Real Rate of Return?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              The Real Rate of Return is the inflation-adjusted return on your investments. Formula: Real Return = (1 + Nominal Return) / (1 + Inflation) − 1. It shows how much your money actually grows in purchasing power, not just in nominal value. For example, if you earn 7% but inflation is 6%, your real return is only ~0.94%.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How should I set expense reduction percentage?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Typically, 10-30% is realistic. Common reductions: work-related expenses (5-10%), eliminated loan payments (0-10%), reduced travel/entertainment (5-15%). Conservative approach: use 0% (assume same spending). Aggressive: 30%+ only if you have specific plans like debt payoff.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What's a realistic life expectancy to assume?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Use 85-90 for a conservative estimate (you'll have buffer). Current life expectancy in India is ~75 years, but with modern healthcare it's rising. The calculator helps you plan for longer, which is safer. If you live longer, it's a blessing—not a burden.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How accurate is this calculator?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              This calculator uses the production-grade NISM framework verified against institutional standards. For the benchmark case (30→60→85, ₹50K expenses, 11% pre/7% post return), it produces exact results: ₹2,87,175 monthly expense at retirement, ₹3,80,68,935 corpus needed, ₹12,242 monthly SIP required. Real-world results may vary based on actual returns and inflation.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
