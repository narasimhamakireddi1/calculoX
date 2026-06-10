'use client';

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculateCAGR } from '@/lib/calculators/cagr';
import { CAGRSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { getInternalLinks } from '@/config/internal-links.config';

type CAGRFormData = {
  beginningValue: number;
  endingValue: number;
  years: number;
};

interface CAGRResultData {
  cagr: number;
  cagrPercentage: number;
}

export default function CAGRCalculatorPage() {
  const [result, setResult] = useState<CAGRResultData | null>(null);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CAGRFormData>({
    resolver: zodResolver(CAGRSchema),
    defaultValues: {
      beginningValue: 100000,
      endingValue: 200000,
      years: 5,
    },
  });

  const watchValues = watch();

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    beginningValue: { min: 10000, max: 100000000, label: 'Beginning Value (₹)' },
    endingValue: { min: 10000, max: 100000000, label: 'Ending Value (₹)' },
    years: { min: 1, max: 50, label: 'Years' },
  };

  const handleInputChange = (fieldName: keyof CAGRFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
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
  };

  // Quick-start scenarios
  const cagrScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Conservative Investment',
      description: '₹1L → ₹5L over 10 years',
      icon: '🛡️',
      values: { beginningValue: 100000, endingValue: 500000, years: 10 }
    },
    {
      label: 'Moderate Growth',
      description: '₹5L → ₹25L over 15 years',
      icon: '📈',
      values: { beginningValue: 500000, endingValue: 2500000, years: 15 }
    },
    {
      label: 'Aggressive Growth',
      description: '₹10L → ₹1Cr over 10 years',
      icon: '🚀',
      values: { beginningValue: 1000000, endingValue: 10000000, years: 10 }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof CAGRFormData, Number(value), { shouldValidate: true });
    });
  }, [setValue]);

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.beginningValue && watchValues.endingValue && watchValues.years) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues]);

  const calculateResults = (data: CAGRFormData) => {
    const result = calculateCAGR(data);
    setResult(result);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient inline-flex items-center gap-3">
          <CalculatorIcon idOrHref="cagr" className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0" />
          <span>CAGR Calculator</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate Compound Annual Growth Rate (CAGR) to measure investment returns over time
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div id="cagr-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={cagrScenarios}
            onSelectScenario={handleSelectScenario}
          />

          <form  className="space-y-6">
            {/* Beginning Value */}
            <div className="space-y-3">
              <label htmlFor="beginning-value" className="block text-sm font-bold text-gray-900 dark:text-white">Beginning Value (₹)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={watchValues.beginningValue === 0 ? "" : watchValues.beginningValue}
                  onChange={(e) => handleInputChange('beginningValue', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('beginningValue', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  id="beginning-value"
                  type="number" placeholder="0"
                  min="10000"
                  max="10000000"
                  step="1000"
                  value={watchValues.beginningValue === 0 ? "" : watchValues.beginningValue}
                  onChange={(e) => handleInputChange('beginningValue', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('beginningValue', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.beginningValue && <p className="text-red-500 text-sm">{errors.beginningValue.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {[10000, 50000, 100000, 500000].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('beginningValue', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                               bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    ₹{val >= 100000 ? `${val / 100000}L` : `${val / 1000}K`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 to ₹1 Crore</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Starting investment amount. Use actual investment sum to calculate realistic CAGR</p>
            </div>

            {/* Ending Value */}
            <div className="space-y-3">
              <label htmlFor="ending-value" className="block text-sm font-bold text-gray-900 dark:text-white">Ending Value (₹)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={watchValues.endingValue === 0 ? "" : watchValues.endingValue}
                  onChange={(e) => handleInputChange('endingValue', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('endingValue', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  id="ending-value"
                  type="number" placeholder="0"
                  min="10000"
                  max="10000000"
                  step="1000"
                  value={watchValues.endingValue === 0 ? "" : watchValues.endingValue}
                  onChange={(e) => handleInputChange('endingValue', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('endingValue', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.endingValue && <p className="text-red-500 text-sm">{errors.endingValue.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {[50000, 100000, 500000, 1000000].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('endingValue', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                               bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                               hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                    ₹{val >= 100000 ? `${val / 100000}L` : `${val / 1000}K`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 to ₹1 Crore</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Final portfolio value after investment period. Must be greater than beginning value for positive CAGR</p>
            </div>

            {/* Years */}
            <div className="space-y-3">
              <label htmlFor="cagr-years" className="block text-sm font-bold text-gray-900 dark:text-white">Time Period (Years)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <input
                  id="cagr-years"
                  type="number" placeholder="0"
                  min="1"
                  max="50"
                  step="1"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-3 border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                />
              </div>
              {errors.years && <p className="text-red-500 text-sm">{errors.years.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {[5, 10, 15, 20].map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('years', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-700
                               bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300
                               hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors">
                    {val}y
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">1 to 50 years</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Stock market CAGR (Nifty 50): ~13% over 20 years. Long-term investing smooths volatility and improves returns</p>
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
                  CAGR = (EV / BV)^(1/n) - 1
                </p>
                <p><strong>Where:</strong> EV = Ending Value | BV = Beginning Value | n = Years</p>
                <p><strong>Result:</strong> Expressed as a percentage (multiply by 100)</p>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div id="cagr-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">CAGR Results</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📈 CAGR Percentage
                  </p>
                  <p className="text-xl sm:text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 break-words overflow-hidden">{result.cagrPercentage.toFixed(2)}%</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📊 CAGR Factor
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 break-words overflow-hidden">{result.cagr.toFixed(4)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Growth multiple ({(result.cagr + 1).toFixed(4)}x)</p>
                </div>
              </div>

              {/* Understanding CAGR */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">📚 Understanding CAGR</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  CAGR (Compound Annual Growth Rate) shows the average annual return on your investment, ignoring volatility. It helps you compare investments fairly across different time periods.
                </p>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Beginning Value:</strong> {formatCurrency(watchValues.beginningValue)} - Your initial investment amount</p>
                  <p><strong>Ending Value:</strong> {formatCurrency(watchValues.endingValue)} - Final value after {watchValues.years} year(s)</p>
                  <p><strong>Total Growth:</strong> {formatCurrency(watchValues.endingValue - watchValues.beginningValue)} - Absolute gain from your investment</p>
                  <p><strong>CAGR:</strong> {result.cagrPercentage.toFixed(2)}% - Average annual growth rate (compounded)</p>
                </div>
              </div>

              {/* Key Insights */}
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-300 dark:border-green-700">
                <h3 className="font-bold text-green-900 dark:text-green-300 mb-3">✨ Key Insights</h3>
                <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <p>
                    <strong>Investment Multiplier:</strong> <span className="font-bold text-green-700 dark:text-green-300">{(watchValues.endingValue / watchValues.beginningValue).toFixed(2)}x</span> - Your money grew by {((watchValues.endingValue / watchValues.beginningValue - 1) * 100).toFixed(1)}%
                  </p>
                  <p>
                    <strong>Comparison Standard:</strong> A CAGR of {result.cagrPercentage.toFixed(2)}% means if you had a fixed-return investment, this % would give the same result
                  </p>
                  <p>
                    <strong>Time Factor:</strong> Over {watchValues.years} year(s), your investment grew at {result.cagrPercentage.toFixed(2)}% annually on average
                  </p>
                  {result.cagrPercentage > 15 && (
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                      💡 <strong>Excellent Return:</strong> A CAGR above 15% is considered very strong for most investments
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded mt-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Formula:</strong> CAGR = (Ending Value / Beginning Value)^(1/Years) - 1
                </p>
              </div>

              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📊 How Do You Compare?</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your CAGR of <strong>{result.cagrPercentage.toFixed(2)}%</strong> {result.cagrPercentage > 15 ? 'is excellent and beats 95% of Indian equity mutual funds' : result.cagrPercentage > 10 ? 'matches the long-term market average' : 'is below inflation and needs attention'}. Nifty 50 has historically averaged ~13% CAGR over 20+ years. Consider diversified index funds for consistent, tax-efficient long-term growth.
                </p>
              </div>

              <div className="mt-6">
                <ShareButtons
                  inputs={[
                    { label: 'Beginning Value', value: formatCurrency(watchValues.beginningValue) },
                    { label: 'Ending Value', value: formatCurrency(watchValues.endingValue) },
                    { label: 'Time Period', value: `${watchValues.years} Year(s)` }
                  ]}
                  outputs={[
                    { label: 'CAGR', value: `${result.cagrPercentage.toFixed(2)}%` }
                  ]}
                  calculatorName="CAGR Calculator"
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter investment details and click Calculate</p>
            </div>
          )}
        </div>
      </div>

      {/* CAGR Value Breakup Pie Chart */}
      {result && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 Value Growth Breakup</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <MemoizedPieChart
                data={[
                  { name: 'Initial Investment', value: watchValues.beginningValue },
                  { name: 'Total Growth', value: watchValues.endingValue - watchValues.beginningValue },
                ]}
                colors={['#3b82f6', '#10b981']}
                height={300}
              />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Initial Investment</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(watchValues.beginningValue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Total Growth</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(watchValues.endingValue - watchValues.beginningValue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border-t-2 border-blue-300 dark:border-blue-700 mt-2 pt-4">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">Final Value</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(watchValues.endingValue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700 mt-2">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">CAGR Return</span>
                <span className="font-bold text-amber-700 dark:text-amber-300 text-lg">{result.cagrPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is CAGR (Compound Annual Growth Rate)?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            CAGR (Compound Annual Growth Rate) is the average annual growth rate of an investment over a specific period, assuming that profits are reinvested at the end of each year. It is calculated using the formula: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">CAGR = (Ending Value / Beginning Value)^(1/Number of Years) - 1</span>. Unlike simple average returns, CAGR accounts for compound growth and provides a more accurate measure of long-term investment performance, smoothing out volatility year-to-year.
          </p>
        </div>

        {/* Table Snippet: CAGR Examples */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">CAGR Examples: Different Investment Scenarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Investment Type</th>
                  <th className="text-center py-3 px-4 font-bold">Start Amount</th>
                  <th className="text-center py-3 px-4 font-bold">End Amount (10y)</th>
                  <th className="text-center py-3 px-4 font-bold">CAGR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">Savings Account (3%)</td>
                  <td className="text-center py-3 px-4">₹1,00,000</td>
                  <td className="text-center py-3 px-4">₹1,34,392</td>
                  <td className="text-center py-3 px-4">3.0%</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">Fixed Deposit (7%)</td>
                  <td className="text-center py-3 px-4">₹1,00,000</td>
                  <td className="text-center py-3 px-4">₹1,96,715</td>
                  <td className="text-center py-3 px-4">7.0%</td>
                </tr>
                <tr className="hover:bg-green-50 dark:hover:bg-green-900/20">
                  <td className="py-3 px-4 font-semibold">Stock Market (12%)</td>
                  <td className="text-center py-3 px-4">₹1,00,000</td>
                  <td className="text-center py-3 px-4">₹3,10,585</td>
                  <td className="text-center py-3 px-4 text-green-700 dark:text-green-400 font-bold">12.0%</td>
                </tr>
                <tr className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <td className="py-3 px-4 font-semibold">Real Estate (9%)</td>
                  <td className="text-center py-3 px-4">₹1,00,000</td>
                  <td className="text-center py-3 px-4">₹2,35,795</td>
                  <td className="text-center py-3 px-4 text-blue-700 dark:text-blue-400 font-bold">9.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* List Snippet: Why CAGR Matters */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Why CAGR Matters: 5 Key Benefits</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">1.</span>
              <span><strong>Smooths Volatility:</strong> CAGR eliminates the impact of short-term market fluctuations, giving a clearer picture of true growth.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">2.</span>
              <span><strong>Compares Investments:</strong> Easily compare returns across different asset classes (stocks, FDs, real estate) on a level playing field.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">3.</span>
              <span><strong>Projects Future Value:</strong> Use historical CAGR to estimate future wealth and plan retirement or financial goals.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">4.</span>
              <span><strong>Evaluates Fund Performance:</strong> Mutual fund returns are best judged using CAGR over 5-10 years, not annual returns.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">5.</span>
              <span><strong>Realistic Expectations:</strong> Helps set realistic investment goals rather than hoping for unrealistic 30%+ annual returns.</span>
            </li>
          </ol>
        </div>

        {/* Comparison Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">CAGR vs Simple Average Return: What's the Difference?</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700">
              <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">📊 CAGR (Compound)</p>
              <p className="text-gray-700 dark:text-gray-300">Assumes profits are reinvested each year. Accounts for "interest on interest" (compounding). More accurate for long-term investments.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2"><strong>Example:</strong> ₹1L → ₹3.1L in 10 years @ 12% CAGR</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 p-4 rounded-lg border-2 border-orange-300 dark:border-orange-700">
              <p className="font-bold text-orange-700 dark:text-orange-300 mb-2">📈 Average Return (Simple)</p>
              <p className="text-gray-700 dark:text-gray-300">Treats each year's return equally. Does NOT account for compounding. Overstates returns for volatile investments.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2"><strong>Example:</strong> Year1: +50%, Year2: -30% → Avg = 10%, but CAGR = 8.8%</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Verdict:</strong> Always use CAGR when evaluating investment performance, especially for periods over 1 year. It gives the true picture of compound growth.
            </p>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('cagr-calculator')} />

      {/* Comparison Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">💡 Understanding CAGR</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
            <p className="font-bold text-blue-700 dark:text-blue-300 mb-3">What is CAGR?</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              CAGR is the average annual growth rate of an investment over a specific period, assuming profits are reinvested each year.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-4 rounded-lg border border-green-300 dark:border-green-700">
            <p className="font-bold text-green-700 dark:text-green-300 mb-3">Why Use CAGR?</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              CAGR smooths out volatility and provides a realistic picture of investment performance over multiple years.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 p-4 rounded-lg border border-orange-300 dark:border-orange-700">
            <p className="font-bold text-orange-700 dark:text-orange-300 mb-3">Good CAGR Range</p>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              For Indian stock market: 12-15% is considered good. For savings/bonds: 6-8% is typical. For real estate: 8-12%.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-4 rounded-lg border border-purple-300 dark:border-purple-700">
            <p className="font-bold text-purple-700 dark:text-purple-300 mb-3">Limitations</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              CAGR assumes constant growth. It doesn&apos;t account for volatility, risk, or timing of cash flows.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What does CAGR tell us?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              CAGR tells us the average annual return on investment. A 15% CAGR means your investment grew by an average of 15% per year.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How is CAGR different from average annual return?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Average annual return treats each year equally, while CAGR accounts for compound growth where profits are reinvested. CAGR is more accurate for long-term investments.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How to use CAGR for investment decisions?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Compare CAGR of different investments over the same period. Higher CAGR indicates better performance, but also consider risk and other factors.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Can CAGR be negative?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, if the ending value is less than the beginning value, CAGR will be negative, indicating a loss on investment.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What&apos;s a healthy CAGR for mutual funds?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              For equity mutual funds, 12-15% CAGR is considered good. For balanced funds, 8-10% is typical. Compare with benchmark indices for better perspective.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

