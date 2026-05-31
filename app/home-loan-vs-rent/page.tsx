'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import ExportButton from '@/components/ui/ExportButton';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { formatCurrency } from '@/lib/utils/format';
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
  'w-24 md:w-28 px-3 py-2 border-l-2 border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none';

export default function HomeLoanVsRentCalculator() {
  const [activeTab, setActiveTab] = useState<'property' | 'loan' | 'assumptions'>('property');
  const [result, setResult] = useState<BuyVsRentResult | null>(null);
  const [chartData, setChartData] = useState<YearlyData[]>([]);
  const [showAllProjections, setShowAllProjections] = useState(false);

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

  const downPaymentAmount = watchValues.property_value * (watchValues.down_payment_pct / 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">🏠 Home Loan vs Rent</h1>
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {result.financial_verdict === 'BUYING_IS_BETTER' ? '🏠 Buying Wins' : '📈 Renting Wins'}
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
              {tab === 'property' && '🏠 Property'}
              {tab === 'loan' && '🏦 Loan & Rent'}
              {tab === 'assumptions' && '📊 Assumptions'}
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
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="100000"
                    value={watchValues.property_value}
                    onChange={(e) => setValue('property_value', Number(e.target.value))}
                    className={`${rangeInputClasses} from-blue-500 to-blue-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.property_value === 0 ? '' : watchValues.property_value}
                    onChange={(e) => setValue('property_value', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹1 Lakh - ₹10 Crore</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Down Payment: {watchValues.down_payment_pct}% ({formatCurrency(downPaymentAmount)})
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={watchValues.down_payment_pct}
                    onChange={(e) => setValue('down_payment_pct', Number(e.target.value))}
                    className={`${rangeInputClasses} from-orange-500 to-orange-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.down_payment_pct === 0 ? '' : watchValues.down_payment_pct}
                    onChange={(e) => setValue('down_payment_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5% - 100%</p>
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
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="0.1"
                    value={watchValues.loan_interest_rate_pct}
                    onChange={(e) => setValue('loan_interest_rate_pct', Number(e.target.value))}
                    className={`${rangeInputClasses} from-purple-500 to-purple-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.loan_interest_rate_pct === 0 ? '' : watchValues.loan_interest_rate_pct}
                    onChange={(e) => setValue('loan_interest_rate_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2% - 15%</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Loan Tenure: {watchValues.loan_tenure_years} years
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={watchValues.loan_tenure_years}
                    onChange={(e) => setValue('loan_tenure_years', Number(e.target.value))}
                    className={`${rangeInputClasses} from-green-500 to-green-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.loan_tenure_years === 0 ? '' : watchValues.loan_tenure_years}
                    onChange={(e) => setValue('loan_tenure_years', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 - 40 years</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Initial Monthly Rent: {formatCurrency(watchValues.initial_monthly_rent)}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={watchValues.initial_monthly_rent}
                    onChange={(e) => setValue('initial_monthly_rent', Number(e.target.value))}
                    className={`${rangeInputClasses} from-rose-500 to-rose-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.initial_monthly_rent === 0 ? '' : watchValues.initial_monthly_rent}
                    onChange={(e) => setValue('initial_monthly_rent', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹1K - ₹5 Lakh</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Annual Rent Increase: {watchValues.annual_rent_increase_pct}%
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={watchValues.annual_rent_increase_pct}
                    onChange={(e) => setValue('annual_rent_increase_pct', Number(e.target.value))}
                    className={`${rangeInputClasses} from-cyan-500 to-cyan-600`}
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
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="-5"
                    max="15"
                    step="0.5"
                    value={watchValues.property_growth_rate_pct}
                    onChange={(e) => setValue('property_growth_rate_pct', Number(e.target.value))}
                    className={`${rangeInputClasses} from-amber-500 to-amber-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.property_growth_rate_pct === 0 ? '' : watchValues.property_growth_rate_pct}
                    onChange={(e) => setValue('property_growth_rate_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">-5% - 15% per year</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Annual Maintenance: {watchValues.annual_maintenance_pct}%
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={watchValues.annual_maintenance_pct}
                    onChange={(e) => setValue('annual_maintenance_pct', Number(e.target.value))}
                    className={`${rangeInputClasses} from-indigo-500 to-indigo-600`}
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
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={watchValues.opportunity_return_pct}
                    onChange={(e) => setValue('opportunity_return_pct', Number(e.target.value))}
                    className={`${rangeInputClasses} from-teal-500 to-teal-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.opportunity_return_pct === 0 ? '' : watchValues.opportunity_return_pct}
                    onChange={(e) => setValue('opportunity_return_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 30% per year (equity/MF)</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Inflation Rate: {watchValues.inflation_rate_pct}%
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={watchValues.inflation_rate_pct}
                    onChange={(e) => setValue('inflation_rate_pct', Number(e.target.value))}
                    className={`${rangeInputClasses} from-pink-500 to-pink-600`}
                  />
                  <input
                    type="number"
                    value={watchValues.inflation_rate_pct === 0 ? '' : watchValues.inflation_rate_pct}
                    onChange={(e) => setValue('inflation_rate_pct', Number(e.target.value) || 0)}
                    className={numberInputClasses}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 15% per year</p>
              </div>

              <div className="relative flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Comparison Timeline: {watchValues.projection_tenure_years} years
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={watchValues.projection_tenure_years}
                    onChange={(e) => setValue('projection_tenure_years', Number(e.target.value))}
                    className={`${rangeInputClasses} from-red-500 to-red-600`}
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
                    <div className="flex gap-3 items-center">
                      <input
                        type="range"
                        min="0"
                        max="45"
                        step="1"
                        value={watchValues.income_tax_rate_pct}
                        onChange={(e) => setValue('income_tax_rate_pct', Number(e.target.value))}
                        className={`${rangeInputClasses} from-violet-500 to-violet-600`}
                      />
                      <input
                        type="number"
                        value={watchValues.income_tax_rate_pct === 0 ? '' : watchValues.income_tax_rate_pct}
                        onChange={(e) => setValue('income_tax_rate_pct', Number(e.target.value) || 0)}
                        className={numberInputClasses}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 45%</p>
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
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                  {formatCurrency(result.monthly_emi)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Buyer's fixed monthly payment</div>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
                <div className="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2">Break-Even</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">
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
                  className={`text-3xl font-bold ${
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
                ✨ {result.financial_verdict === 'BUYING_IS_BETTER' ? '🏠 Buying is the Better Choice' : '📈 Renting is the Better Choice'}
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
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData} margin={{ left: 70, right: 30, top: 15, bottom: 20 }}>
                    <defs>
                      <linearGradient id="buyerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="renterGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="year"
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tickFormatter={formatAxisValue}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6',
                      }}
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
                      fillOpacity={1}
                      fill="url(#buyerGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="renter_net_worth"
                      name="Renter Net Worth"
                      stroke="#A855F7"
                      fillOpacity={1}
                      fill="url(#renterGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cumulative Cash Outflow</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <strong>X-axis:</strong> Years | <strong>Y-axis:</strong> Total Amount Paid in ₹
                </p>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData} margin={{ left: 70, right: 30, top: 15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="year"
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tickFormatter={formatAxisValue}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6',
                      }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="buyer_cumulative_outflow"
                      name="Buyer (EMI+Maint)"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="renter_cumulative_outflow"
                      name="Renter (Rent Paid)"
                      stroke="#EF4444"
                      strokeWidth={2}
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
                          {row.buyer_net_worth > row.renter_net_worth ? '🏠' : '📈'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export & Share */}
            <div className="mb-8">
              <ExportButton
                fileName="home-loan-vs-rent-analysis"
                calculatorName="Home Loan vs Rent Calculator"
                resultElementId="results"
                inputsData={[
                  { label: 'Property Value', value: formatCurrency(watchValues.property_value) },
                  { label: 'Down Payment', value: `${watchValues.down_payment_pct}% (${formatCurrency(downPaymentAmount)})` },
                  { label: 'Loan Interest Rate', value: `${watchValues.loan_interest_rate_pct}%` },
                  { label: 'Loan Tenure', value: `${watchValues.loan_tenure_years} years` },
                  { label: 'Initial Monthly Rent', value: formatCurrency(watchValues.initial_monthly_rent) },
                  { label: 'Opportunity Return', value: `${watchValues.opportunity_return_pct}%` },
                  { label: 'Monthly EMI', value: formatCurrency(result.monthly_emi) },
                  { label: 'Verdict', value: result.financial_verdict === 'BUYING_IS_BETTER' ? '🏠 Buying Wins' : '📈 Renting Wins' },
                  { label: 'Advantage', value: formatCurrency(result.absolute_delta) },
                ]}
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

        {/* Related Calculators */}
        <RelatedCalculators calculators={getInternalLinks('home-loan-vs-rent')} />
      </div>
    </div>
  );
}
