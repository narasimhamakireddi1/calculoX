'use client';

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import * as z from 'zod';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { BuyVsRentEngine, BuyVsRentResult, YearlyData } from '@/lib/calculators/buy-vs-rent';
import { useChartColors } from '@/components/charts/useChartColors';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { formatCurrency } from '@/lib/utils/format';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { Home, Building2, TrendingUp, Landmark, BarChart2, Sparkles } from 'lucide-react';
import { getInternalLinks } from '@/config/internal-links.config';

// Format large numbers for Y-axis (e.g., 1000000 → 10L, 10000000 → 1Cr)
const formatAxisValue = (value: number): string => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(0)}Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(0)}L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

// Zod Schema
const buyVsRentSchema = z.object({
  property_value: z.number().min(100000).max(100000000),
  down_payment_pct: z.number().min(5).max(100),
  loan_interest_rate_pct: z.number().min(2).max(15),
  loan_tenure_years: z.number().min(1).max(40),
  property_growth_rate_pct: z.number().min(-5).max(15),
  annual_maintenance_pct: z.number().min(0).max(3),
  initial_monthly_rent: z.number().min(1000).max(500000),
  annual_rent_increase_pct: z.number().min(0).max(15),
  opportunity_return_pct: z.number().min(0).max(30),
  inflation_rate_pct: z.number().min(0).max(15),
  projection_tenure_years: z.number().min(1).max(40),
  apply_tax_benefit: z.boolean(),
  income_tax_rate_pct: z.number().min(0).max(45),
});

type FormData = z.infer<typeof buyVsRentSchema>;

const rangeInputClasses =
  'w-full md:flex-1 h-3 bg-gradient-to-r rounded-lg appearance-none cursor-pointer slider [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:cursor-pointer';

const numberInputClasses =
  'w-full md:w-28 px-3 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none';

export default function HomeLoanVsRentCalculator() {
  const chartColors = useChartColors();
  const [activeTab, setActiveTab] = useState<'property' | 'loan' | 'assumptions'>('property');
  const [result, setResult] = useState<BuyVsRentResult | null>(null);
  const [chartData, setChartData] = useState<YearlyData[]>([]);
  const [showAllProjections, setShowAllProjections] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view for responsive charts
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { watch, setValue } = useForm<FormData>({
    resolver: zodResolver(buyVsRentSchema),
    defaultValues: {
      property_value: 8000000,
      down_payment_pct: 20,
      loan_interest_rate_pct: 8.5,
      loan_tenure_years: 20,
      property_growth_rate_pct: 6,
      annual_maintenance_pct: 0.5,
      initial_monthly_rent: 25000,
      annual_rent_increase_pct: 7,
      opportunity_return_pct: 12,
      inflation_rate_pct: 6,
      projection_tenure_years: 20,
      apply_tax_benefit: false,
      income_tax_rate_pct: 20,
    },
  });

  const watchValues = watch();

  // Calculate results with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const calculationInput = {
        property_buying_track: {
          property_value: watchValues.property_value,
          down_payment_pct: watchValues.down_payment_pct,
          loan_interest_rate_pct: watchValues.loan_interest_rate_pct,
          loan_tenure_years: watchValues.loan_tenure_years,
          property_growth_rate_pct: watchValues.property_growth_rate_pct,
          annual_maintenance_pct: watchValues.annual_maintenance_pct,
        },
        renting_track: {
          initial_monthly_rent: watchValues.initial_monthly_rent,
          annual_rent_increase_pct: watchValues.annual_rent_increase_pct,
        },
        investment_track: {
          opportunity_return_pct: watchValues.opportunity_return_pct,
          inflation_rate_pct: watchValues.inflation_rate_pct,
        },
        common: {
          projection_tenure_years: watchValues.projection_tenure_years,
          apply_tax_benefit: watchValues.apply_tax_benefit,
          income_tax_rate_pct: watchValues.income_tax_rate_pct,
        },
      };

      const calcResult = BuyVsRentEngine.calculate(calculationInput);
      setResult(calcResult);
      setChartData(calcResult.yearly_data);
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues]);

  const handleClearAll = () => {
    setValue('property_value', 8000000);
    setValue('down_payment_pct', 20);
    setValue('loan_interest_rate_pct', 8.5);
    setValue('loan_tenure_years', 20);
    setValue('property_growth_rate_pct', 6);
    setValue('annual_maintenance_pct', 0.5);
    setValue('initial_monthly_rent', 25000);
    setValue('annual_rent_increase_pct', 7);
    setValue('opportunity_return_pct', 12);
    setValue('inflation_rate_pct', 6);
    setValue('projection_tenure_years', 20);
    setValue('apply_tax_benefit', false);
    setValue('income_tax_rate_pct', 20);
  };

  // Quick-start scenarios
  const hlrScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Budget Buyer',
      description: '₹40L property, ₹20K rent',
      icon: Home,
      values: { property_value: 4000000, down_payment_pct: 20, loan_interest_rate_pct: 8.5, loan_tenure_years: 20, initial_monthly_rent: 20000, opportunity_return_pct: 12, projection_tenure_years: 20 }
    },
    {
      label: 'Mid-Range Home',
      description: '₹80L property, ₹40K rent',
      icon: Home,
      values: { property_value: 8000000, down_payment_pct: 25, loan_interest_rate_pct: 8.5, loan_tenure_years: 20, initial_monthly_rent: 40000, opportunity_return_pct: 12, projection_tenure_years: 25 }
    },
    {
      label: 'Premium Property',
      description: '₹1.5Cr property, ₹75K rent',
      icon: Building2,
      values: { property_value: 15000000, down_payment_pct: 30, loan_interest_rate_pct: 8, loan_tenure_years: 25, initial_monthly_rent: 75000, opportunity_return_pct: 11, projection_tenure_years: 30 }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof FormData, value as any, { shouldValidate: true });
    });
  }, [setValue]);

  const downPaymentAmount = watchValues.property_value * (watchValues.down_payment_pct / 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2 inline-flex items-center gap-3">
            <CalculatorIcon idOrHref="home-loan-vs-rent" className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0" />
            <span>Home Loan vs Rent</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Run two parallel financial scenarios: buying with a home loan vs. renting and investing the saved cash.
            Discover which path yields higher net worth using the Opportunity Cost Framework.
          </p>
        </div>

        {/* Winner Banner */}
        {result && (
          <div
            className={`rounded-xl p-6 mb-8 text-white text-center font-semibold text-lg ${
              result.financial_verdict === 'BUYING_IS_BETTER'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
          >
            {result.financial_verdict === 'BUYING_IS_BETTER' ? (
              <>
                🎉 Buying wins by <strong>{formatCurrency(result.absolute_delta)}</strong> over{' '}
                {watchValues.projection_tenure_years} years
              </>
            ) : (
              <>
                📈 Renting + investing yields <strong>{formatCurrency(result.absolute_delta)}</strong> more (
                {result.delta_pct.toFixed(1)}% higher net worth)
              </>
            )}
          </div>
        )}

        {/* Winner Analysis Section */}
        {result && (
          <div className="card mb-8 border-l-4 border-gradient-to-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Verdict & Reasons */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  {result.financial_verdict === 'BUYING_IS_BETTER'
                    ? <><Home className="w-6 h-6 text-emerald-600" strokeWidth={2} aria-hidden="true" /> Buying Wins</>
                    : <><TrendingUp className="w-6 h-6 text-blue-600" strokeWidth={2} aria-hidden="true" /> Renting Wins</>
                  }
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Financial Advantage</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(result.absolute_delta)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ({result.delta_pct.toFixed(1)}% higher net worth)
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Why this option wins:</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {result.financial_verdict === 'BUYING_IS_BETTER' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                            <span>Property appreciation of <strong>{watchValues.property_growth_rate_pct}%/year</strong> builds significant equity</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                            <span>Final property value: <strong>{formatCurrency(result.buyer_final_property_value)}</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                            <span>EMI of <strong>{formatCurrency(result.monthly_emi)}/month</strong> is competitive against rising rents</span>
                          </li>
                          {watchValues.apply_tax_benefit && (
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                              <span>Section 24(b) tax deduction provides additional savings</span>
                            </li>
                          )}
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                            <span>Monthly rent (<strong>{formatCurrency(watchValues.initial_monthly_rent)}</strong>) is lower than EMI (<strong>{formatCurrency(result.monthly_emi)}</strong>)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                            <span>Invested down payment + monthly savings grow at <strong>{watchValues.opportunity_return_pct}%/year</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                            <span>Renter portfolio reaches <strong>{formatCurrency(result.renter_investment_portfolio)}</strong> in {watchValues.projection_tenure_years} years</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                            <span>No property maintenance costs ({watchValues.annual_maintenance_pct}% of property value annually)</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: Key Metrics Comparison */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Metrics Comparison</h4>
                <div className="space-y-3">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Buyer Final Net Worth</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(result.buyer_net_worth)}
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Renter Final Net Worth</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(result.renter_investment_portfolio)}
                    </p>
                  </div>
                  {result.break_even_year && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-amber-50 dark:bg-amber-900/20">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Break-Even Point</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-300">Year {result.break_even_year}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">When buying advantage reaches zero</p>
                    </div>
                  )}
                  {!result.break_even_year && result.financial_verdict === 'RENTING_IS_BETTER' && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Break-Even Point</p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">Never</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Renting stays ahead throughout</p>
                    </div>
                  )}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Rent vs EMI</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs">
                        <p className="text-gray-600 dark:text-gray-400">Rent: {formatCurrency(watchValues.initial_monthly_rent)}/mo</p>
                        <p className="text-gray-600 dark:text-gray-400">EMI: {formatCurrency(result.monthly_emi)}/mo</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${result.monthly_emi > watchValues.initial_monthly_rent ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {formatCurrency(Math.abs(result.monthly_emi - watchValues.initial_monthly_rent))}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">difference</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick-Start Examples */}
        <QuickStartExamples
          scenarios={hlrScenarios}
          onSelectScenario={handleSelectScenario}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-300 dark:border-gray-700">
          {['property', 'loan', 'assumptions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'property' && <span className="flex items-center gap-1.5"><Home className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />Property</span>}
              {tab === 'loan' && <span className="flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />Loan & Rent</span>}
              {tab === 'assumptions' && <span className="flex items-center gap-1.5"><BarChart2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />Assumptions</span>}
            </button>
          ))}
        </div>

        {/* Input Cards */}
        <div className="card mb-8">
          {/* Property Tab */}
          {activeTab === 'property' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Property Details</h3>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Property Value: {formatCurrency(watchValues.property_value)}
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="100000"
                    value={watchValues.property_value}
                    onChange={(e) => setValue('property_value', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-blue-500 to-blue-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.property_value === 0 ? '' : watchValues.property_value}
                    onChange={(e) => setValue('property_value', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {[5000000, 8000000, 15000000, 20000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setValue('property_value', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      ₹{val / 1000000}Cr
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹1 Lakh - ₹10 Crore</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Current property prices in metros: ₹50-200L. Higher property value favors renting if rent is low</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Down Payment: {watchValues.down_payment_pct}% ({formatCurrency(downPaymentAmount)})
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={watchValues.down_payment_pct}
                    onChange={(e) => setValue('down_payment_pct', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-orange-500 to-orange-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.down_payment_pct === 0 ? '' : watchValues.down_payment_pct}
                    onChange={(e) => setValue('down_payment_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {[10, 20, 30, 50].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setValue('down_payment_pct', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                    >
                      {val}%
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5% - 100%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 20% down payment is typical. Lower down payment → higher EMI. The down payment amount goes to investment in renting scenario</p>
              </div>
            </div>
          )}

          {/* Loan & Rent Tab */}
          {activeTab === 'loan' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loan & Rent Details</h3>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Home Loan Interest Rate: {watchValues.loan_interest_rate_pct}%
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="0.1"
                    value={watchValues.loan_interest_rate_pct}
                    onChange={(e) => setValue('loan_interest_rate_pct', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-purple-500 to-purple-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.loan_interest_rate_pct === 0 ? '' : watchValues.loan_interest_rate_pct}
                    onChange={(e) => setValue('loan_interest_rate_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2% - 15%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Current home loan rates (2025): 8-9%. Higher rates favor renting. Lower rates favor buying</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Loan Tenure: {watchValues.loan_tenure_years} years
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={watchValues.loan_tenure_years}
                    onChange={(e) => setValue('loan_tenure_years', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-green-500 to-green-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.loan_tenure_years === 0 ? '' : watchValues.loan_tenure_years}
                    onChange={(e) => setValue('loan_tenure_years', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {[10, 15, 20, 30].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setValue('loan_tenure_years', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    >
                      {val}Y
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 - 40 years</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Initial Monthly Rent: {formatCurrency(watchValues.initial_monthly_rent)}
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={watchValues.initial_monthly_rent}
                    onChange={(e) => setValue('initial_monthly_rent', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-rose-500 to-rose-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.initial_monthly_rent === 0 ? '' : watchValues.initial_monthly_rent}
                    onChange={(e) => setValue('initial_monthly_rent', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {[20000, 30000, 50000, 75000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setValue('initial_monthly_rent', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                    >
                      ₹{val / 1000}K
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹1K - ₹5 Lakh</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Key variable: If rent is lower than EMI, renting looks better initially. But EMI is fixed while rent rises each year</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Annual Rent Increase: {watchValues.annual_rent_increase_pct}%
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={watchValues.annual_rent_increase_pct}
                    onChange={(e) => setValue('annual_rent_increase_pct', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-cyan-500 to-cyan-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.annual_rent_increase_pct === 0 ? '' : watchValues.annual_rent_increase_pct}
                    onChange={(e) => setValue('annual_rent_increase_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 15% per year</p>
              </div>
            </div>
          )}

          {/* Assumptions Tab */}
          {activeTab === 'assumptions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Financial Assumptions</h3>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Property Appreciation Rate: {watchValues.property_growth_rate_pct}%
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="-5"
                    max="15"
                    step="0.5"
                    value={watchValues.property_growth_rate_pct}
                    onChange={(e) => setValue('property_growth_rate_pct', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-amber-500 to-amber-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.property_growth_rate_pct === 0 ? '' : watchValues.property_growth_rate_pct}
                    onChange={(e) => setValue('property_growth_rate_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">-5% - 15% per year</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Historical (2010-2025): 6-8% p.a. in metros. Higher appreciation favors buying, lower favors renting</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Annual Maintenance: {watchValues.annual_maintenance_pct}%
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={watchValues.annual_maintenance_pct}
                    onChange={(e) => setValue('annual_maintenance_pct', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-indigo-500 to-indigo-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.annual_maintenance_pct === 0 ? '' : watchValues.annual_maintenance_pct}
                    onChange={(e) => setValue('annual_maintenance_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 3% of property value</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Opportunity Investment Return: {watchValues.opportunity_return_pct}%
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={watchValues.opportunity_return_pct}
                    onChange={(e) => setValue('opportunity_return_pct', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-teal-500 to-teal-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.opportunity_return_pct === 0 ? '' : watchValues.opportunity_return_pct}
                    onChange={(e) => setValue('opportunity_return_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 30% per year (equity/MF)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Nifty 50 (20y CAGR): 13%. Conservative: 10%, Aggressive: 13-15%. Higher returns favor renting</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Inflation Rate: {watchValues.inflation_rate_pct}%
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={watchValues.inflation_rate_pct}
                    onChange={(e) => setValue('inflation_rate_pct', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-pink-500 to-pink-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.inflation_rate_pct === 0 ? '' : watchValues.inflation_rate_pct}
                    onChange={(e) => setValue('inflation_rate_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 15% per year</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 India's average (2010-2025): 5-6%. Affects rent growth and real returns on investment</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Comparison Timeline: {watchValues.projection_tenure_years} years
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={watchValues.projection_tenure_years}
                    onChange={(e) => setValue('projection_tenure_years', Number(e.target.value))}
                    className={`flex-1 ${rangeInputClasses} from-red-500 to-red-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.projection_tenure_years === 0 ? '' : watchValues.projection_tenure_years}
                    onChange={(e) => setValue('projection_tenure_years', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 - 40 years</p>
              </div>

              {/* Tax Benefit Section */}
              <div className="border-t border-gray-300 dark:border-gray-700 pt-6 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="tax-benefit"
                    checked={watchValues.apply_tax_benefit}
                    onChange={(e) => setValue('apply_tax_benefit', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                  />
                  <label htmlFor="tax-benefit" className="font-semibold text-gray-700 dark:text-gray-300">
                    Apply Section 24(b) Tax Benefit
                  </label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Homeowners under the Old Tax Regime can deduct up to ₹2,00,000 of interest paid per year.
                </p>

                {watchValues.apply_tax_benefit && (
                  <div className="relative flex-shrink-0">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Tax Bracket: {watchValues.income_tax_rate_pct}%
                    </label>
                    <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                      <input
                        type="range"
                        min="0"
                        max="45"
                        step="1"
                        value={watchValues.income_tax_rate_pct}
                        onChange={(e) => setValue('income_tax_rate_pct', Number(e.target.value))}
                        className={`flex-1 ${rangeInputClasses} from-violet-500 to-violet-600`}
                      />
                      <input
                        type="number"
                        value={watchValues.income_tax_rate_pct === 0 ? '' : watchValues.income_tax_rate_pct}
                        onChange={(e) => setValue('income_tax_rate_pct', Number(e.target.value) || 0)}
                        className={numberInputClasses}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 45%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Your tax slab: 20% slab gets ₹40K deduction on ₹2L interest. 30% slab gets ₹60K. Higher tax rates favor buying</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleClearAll}
                className="w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all"
              >
                🔄 Clear All Values
              </button>

              {/* Formula Reference */}
              <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3">📐 Opportunity Cost Framework</h4>
                <div className="space-y-2 text-xs text-indigo-800 dark:text-indigo-200">
                  <p><strong>Buyer NW:</strong> Property Value + Tax Benefits - Loan Balance</p>
                  <p><strong>Renter NW:</strong> (Down Pmt + EMI Savings) × Returns</p>
                  <p><strong>Winner:</strong> Path with higher net worth after 20 years</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                <div className="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2">Monthly EMI</div>
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-300 break-words overflow-hidden">
                  {formatCurrency(result.monthly_emi)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Buyer's fixed monthly payment</div>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
                <div className="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2">Break-Even</div>
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-300 break-words overflow-hidden">
                  {result.break_even_year ? `Year ${result.break_even_year}` : 'Never'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">When buying becomes better (if ever)</div>
              </div>

              <div
                className={`card bg-gradient-to-br ${
                  result.financial_verdict === 'BUYING_IS_BETTER'
                    ? 'from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800'
                    : 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800'
                }`}
              >
                <div className="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2">Net Advantage</div>
                <div
                  className={`text-lg sm:text-2xl md:text-3xl font-bold break-words overflow-hidden ${
                    result.financial_verdict === 'BUYING_IS_BETTER'
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-blue-600 dark:text-blue-300'
                  }`}
                >
                  {formatCurrency(result.absolute_delta)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {result.financial_verdict === 'BUYING_IS_BETTER' ? 'Buying wins' : 'Renting wins'}
                </div>
              </div>
            </div>

            {/* Understanding Your Analysis */}
            <div className="card mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg">📚 Understanding This Analysis</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                This calculator compares two financial paths over {watchValues.projection_tenure_years} years using the Opportunity Cost Framework: <strong>Buy with a loan</strong> vs <strong>Rent and invest the saved capital</strong>.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                <div>
                  <p className="font-semibold mb-2">🏠 Buyer's Path:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Pay down payment: {formatCurrency(downPaymentAmount)}</li>
                    <li>Monthly EMI: {formatCurrency(result.monthly_emi)}</li>
                    <li>Maintenance costs</li>
                    <li>Property appreciates over time</li>
                    <li>Tax benefit from Section 24(b)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">📈 Renter's Path:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Invest down payment amount</li>
                    <li>Invest EMI difference monthly</li>
                    <li>No maintenance costs</li>
                    <li>Portfolio grows at {watchValues.opportunity_return_pct}% p.a.</li>
                    <li>Pay rent (increases annually)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Verdict & Insights */}
            <div className={`card mb-8 ${result.financial_verdict === 'BUYING_IS_BETTER' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}`}>
              <h3 className={`font-bold mb-3 text-lg ${result.financial_verdict === 'BUYING_IS_BETTER' ? 'text-emerald-900 dark:text-emerald-300' : 'text-blue-900 dark:text-blue-300'}`}>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                  {result.financial_verdict === 'BUYING_IS_BETTER' ? 'Buying is the Better Choice' : 'Renting is the Better Choice'}
                </span>
              </h3>
              <div className={`space-y-2 text-sm ${result.financial_verdict === 'BUYING_IS_BETTER' ? 'text-emerald-800 dark:text-emerald-200' : 'text-blue-800 dark:text-blue-200'}`}>
                <p>
                  <strong>Financial Advantage:</strong> <span className="font-bold">{result.financial_verdict === 'BUYING_IS_BETTER' ? 'Buying wins' : 'Renting wins'} by {formatCurrency(Math.abs(result.absolute_delta))}</span> over {watchValues.projection_tenure_years} years
                </p>
                {result.break_even_year && (
                  <p>
                    <strong>Break-Even Point:</strong> Buying becomes financially superior in <span className="font-bold">Year {result.break_even_year}</span> (but {result.financial_verdict === 'BUYING_IS_BETTER' ? 'overall still wins' : 'overall renting still wins'})
                  </p>
                )}
                <p>
                  <strong>Key Reason:</strong> {result.financial_verdict === 'BUYING_IS_BETTER' ? 'Property appreciation and tax benefits outweigh investment returns' : 'Investment returns on saved capital exceed property appreciation gains'}
                </p>
                <p className="text-xs mt-3">
                  💡 This analysis assumes constant rates and returns. Your actual outcome depends on market conditions, personal circumstances, and life changes.
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Net Worth Comparison</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <strong>X-axis:</strong> Years | <strong>Y-axis:</strong> Net Worth in ₹
                </p>
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 360}>
                  <AreaChart data={chartData} margin={{ left: isMobile ? 50 : 70, right: isMobile ? 10 : 30, top: 15, bottom: isMobile ? 10 : 20 }}>
                    <defs>
                      <linearGradient id="buyerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="renterGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
                    <XAxis
                      dataKey="year"
                      stroke={chartColors.axisColor}
                      tick={{ fill: chartColors.axisFill, fontSize: isMobile ? 11 : 12 }}
                    />
                    <YAxis
                      stroke={chartColors.axisColor}
                      tickFormatter={formatAxisValue}
                      tick={{ fill: chartColors.axisFill, fontSize: isMobile ? 11 : 12 }}
                      width={isMobile ? 45 : 60}
                    />
                    <Tooltip
                      contentStyle={chartColors.tooltipStyle}
                      wrapperStyle={{ outline: 'none' }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Legend />
                    {result.break_even_year && (
                      <ReferenceLine x={result.break_even_year} stroke="#EF4444" strokeDasharray="5 5" />
                    )}
                    <Area
                      type="monotone"
                      dataKey="buyer_net_worth"
                      name="Buyer Net Worth"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#buyerGradient)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="renter_net_worth"
                      name="Renter Net Worth"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#renterGradient)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cumulative Cash Outflow</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <strong>X-axis:</strong> Years | <strong>Y-axis:</strong> Total Amount Paid in ₹
                </p>
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 360}>
                  <LineChart data={chartData} margin={{ left: isMobile ? 50 : 70, right: isMobile ? 10 : 30, top: 15, bottom: isMobile ? 10 : 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
                    <XAxis
                      dataKey="year"
                      stroke={chartColors.axisColor}
                      tick={{ fill: chartColors.axisFill, fontSize: isMobile ? 11 : 12 }}
                    />
                    <YAxis
                      stroke={chartColors.axisColor}
                      tickFormatter={formatAxisValue}
                      tick={{ fill: chartColors.axisFill, fontSize: isMobile ? 11 : 12 }}
                      width={isMobile ? 45 : 60}
                    />
                    <Tooltip
                      contentStyle={chartColors.tooltipStyle}
                      wrapperStyle={{ outline: 'none' }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="buyer_cumulative_outflow"
                      name="Buyer (EMI+Maint)"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="renter_cumulative_outflow"
                      name="Renter (Rent Paid)"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Projection Table */}
            <div className="card mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Year-by-Year Projections</h3>
                <button
                  onClick={() => setShowAllProjections(!showAllProjections)}
                  className="text-sm px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {showAllProjections ? 'Show Less' : 'Show All'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Year</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">Buyer NW</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">Renter NW</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.slice(0, showAllProjections ? chartData.length : 12).map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-2 px-2 text-gray-900 dark:text-white font-semibold">Year {row.year}</td>
                        <td className="text-right py-2 px-2 text-blue-600 dark:text-blue-400">
                          {formatCurrency(row.buyer_net_worth)}
                        </td>
                        <td className="text-right py-2 px-2 text-purple-600 dark:text-purple-400">
                          {formatCurrency(row.renter_net_worth)}
                        </td>
                        <td className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                          {row.buyer_net_worth > row.renter_net_worth
                            ? <Home className="w-4 h-4 inline text-emerald-600" strokeWidth={2} aria-hidden="true" />
                            : <TrendingUp className="w-4 h-4 inline text-blue-600" strokeWidth={2} aria-hidden="true" />
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Share */}
            <div className="mb-8">
              <ShareButtons
                inputs={[
                  { label: 'Property Value', value: formatCurrency(watchValues.property_value) },
                  { label: 'Down Payment', value: `${watchValues.down_payment_pct}%` },
                  { label: 'Loan Interest Rate', value: `${watchValues.loan_interest_rate_pct}%` },
                  { label: 'Loan Tenure', value: `${watchValues.loan_tenure_years} years` },
                  { label: 'Initial Monthly Rent', value: formatCurrency(watchValues.initial_monthly_rent) }
                ]}
                outputs={[
                  { label: 'Monthly EMI', value: formatCurrency(result.monthly_emi) },
                  { label: 'Verdict', value: result.financial_verdict === 'BUYING_IS_BETTER' ? '🏠 Buying Wins' : '📈 Renting Wins' },
                  { label: 'Advantage', value: formatCurrency(result.absolute_delta) }
                ]}
                calculatorName="Home Loan vs Rent Calculator"
              />
            </div>
          </>
        )}

        {/* FAQ Section */}
        <div className="card mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {[
              {
                q: 'What is the Opportunity Cost Framework?',
                a: 'It compares two paths: buying a property with a loan vs. renting and investing the saved cash (down payment + EMI difference) in equity/mutual funds. The richer path wins financially.',
              },
              {
                q: 'Why does the calculator invest the down payment on Day 1?',
                a: 'Because if you rent instead of buying, you avoid the large down payment. That money can grow in investments. This opportunity gain compounds over 20+ years.',
              },
              {
                q: 'When does renting mathematically beat buying?',
                a: 'When the investment returns on the saved capital exceed the property appreciation rate. If homes appreciate 6% but your equity fund returns 12%, renting + investing wins.',
              },
              {
                q: 'What is Section 24(b) and how does it help?',
                a: 'Indian homeowners can deduct up to ₹2,00,000 of loan interest per year from taxable income. This tax savings reduces the buyer\'s effective cost. Check the toggle to see the impact.',
              },
              {
                q: 'Is a 20-year projection accurate?',
                a: 'No projection is certain, but 20 years is a meaningful horizon for long-term financial decisions. Use this as a guide, not gospel. Real outcomes depend on actual market returns and personal circumstances.',
              },
            ].map((faq, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h4>
                <p className="text-gray-700 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Snippet Sections for SEO */}
        {/* Definition Snippet */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">What is the Opportunity Cost Framework (Buy vs Rent)?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The Opportunity Cost Framework is a financial comparison method that answers: "Is it better to buy a home or rent and invest the difference?" Instead of simply calculating EMI, it tracks two parallel financial paths over 20 years: the buyer's path (property ownership, loan repayment, maintenance, tax benefits) versus the renter's path (rent payments, but freed capital invested in equity markets). The winner is determined by which path creates greater net worth by the end of the projection.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This framework accounts for property appreciation, investment returns, inflation, Section 24(b) tax benefits for home loan interest, and the break-even year—the first year when the buyer's net worth exceeds the renter's. It provides a quantitative answer to one of life's biggest financial decisions.
          </p>
        </div>

        {/* Table Snippet - Break-Even Years at Different Appreciation Rates */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Break-Even Years at Different Property Appreciation Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                  <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Property Appreciation</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">Investment Returns 10%</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">Investment Returns 12%</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">Investment Returns 15%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">4% p.a.</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 3-4</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Renting wins</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Renting wins</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">6% p.a.</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 5-6</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 8-10</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Renting wins</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">8% p.a.</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 7-8</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 10-12</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 15+</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">10% p.a.</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 8-9</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 11-13</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 16-18</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">12% p.a.</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 9-10</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 12-14</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">Break-even Year 18-20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            <strong>Key Insight:</strong> Buying wins faster when property appreciation is high, but renting wins if investment returns significantly exceed property appreciation. This assumes consistent market conditions and actual returns matching projections.
          </p>
        </div>

        {/* How-to List Snippet */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">How to Decide Whether to Buy or Rent: 6-Step Framework</h2>
          <ol className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">1.</span>
              <div>
                <strong>Calculate Your Down Payment Capacity:</strong> Determine how much capital you can deploy upfront. Banks typically require 20% for homes. Example: For ₹80L property, down payment = ₹16L. This same capital could be invested in stocks/mutual funds if you choose to rent.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">2.</span>
              <div>
                <strong>Estimate Your Rental vs EMI Costs:</strong> Find comparable properties available for rent in your desired location. Compare monthly rent vs estimated EMI. Example: Rent ₹25,000/month vs EMI ₹55,000/month (buying is more expensive per month, but you're building equity).
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">3.</span>
              <div>
                <strong>Project Property Appreciation:</strong> Research historical property appreciation rates in your city. Major metros like Bangalore, Mumbai average 6-8% p.a. Conservative estimate: use 6%. This becomes a variable in comparing both paths.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">4.</span>
              <div>
                <strong>Estimate Investment Returns (for Renting Path):</strong> If you rent and invest, what returns realistically? Conservative: 9-10% (Debt), Moderate: 11-12% (Balanced), Aggressive: 13-15% (Equity). Use moderate (12%) for fair comparison.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">5.</span>
              <div>
                <strong>Account for Tax Benefits (Buyers):</strong> Home buyers get Section 24(b) deduction: up to ₹2L/year of loan interest reduces taxable income. At 30% tax bracket, this saves ₹60K/year in taxes. Renters get no such benefit. This tilts buying favorably in some cases.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">6.</span>
              <div>
                <strong>Run a 20-Year Comparison Using This Calculator:</strong> Input all parameters and observe: which path gives you higher net worth in Year 20? At what year does one path overtake the other (break-even year)? Use this data-driven insight, not emotion, to decide.
              </div>
            </li>
          </ol>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Real Example Scenario:</strong> Property ₹80L, Down 20% (₹16L), Rent ₹25K/month with 7% escalation, Investment return 12%, Property appreciation 8%, Inflation 5% → Buyer's net worth exceeds renter's in Year 6-7. After 20 years: Buyer net worth ₹3.2Cr, Renter ₹2.8Cr. Buying wins by ₹40L, but took 6+ years to break even.
            </p>
          </div>
        </div>

        {/* Related Calculators */}
        <RelatedCalculators calculators={getInternalLinks('home-loan-vs-rent')} />
      </div>
    </div>
  );
}
