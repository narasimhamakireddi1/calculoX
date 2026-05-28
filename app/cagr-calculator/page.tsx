'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateCAGR } from '@/lib/calculators/cagr';
import { CAGRSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import ExportButton, { type FormattedInput } from '@/components/ui/ExportButton';

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

  const inputsData: FormattedInput[] = useMemo(() => {
    const data: FormattedInput[] = [];
    if (watchValues.beginningValue) {
      data.push({ label: 'Beginning Value', value: formatCurrency(watchValues.beginningValue) });
    }
    if (watchValues.endingValue) {
      data.push({ label: 'Ending Value', value: formatCurrency(watchValues.endingValue) });
    }
    if (watchValues.years) {
      data.push({ label: 'Time Period', value: `${watchValues.years} Year(s)` });
    }
    return data;
  }, [watchValues]);

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
        <h1 className="text-4xl font-bold mb-4 text-gradient">📈 CAGR Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate Compound Annual Growth Rate (CAGR) to measure investment returns over time
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div id="cagr-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>
          <form  className="space-y-6">
            {/* Beginning Value */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Beginning Value (₹)</label>
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
                  type="number" placeholder="0"
                  min="10000"
                  max="10000000"
                  step="1000"
                  value={watchValues.beginningValue === 0 ? "" : watchValues.beginningValue}
                  onChange={(e) => handleInputChange('beginningValue', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('beginningValue', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-2 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.beginningValue && <p className="text-red-500 text-sm">{errors.beginningValue.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 to ₹1 Crore</p>
            </div>

            {/* Ending Value */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Ending Value (₹)</label>
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
                  type="number" placeholder="0"
                  min="10000"
                  max="10000000"
                  step="1000"
                  value={watchValues.endingValue === 0 ? "" : watchValues.endingValue}
                  onChange={(e) => handleInputChange('endingValue', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('endingValue', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-2 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.endingValue && <p className="text-red-500 text-sm">{errors.endingValue.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 to ₹1 Crore</p>
            </div>

            {/* Years */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Time Period (Years)</label>
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
                  type="number" placeholder="0"
                  min="1"
                  max="50"
                  step="1"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-2 border-2 border-orange-400 rounded-lg font-bold text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700"
                />
              </div>
              {errors.years && <p className="text-red-500 text-sm">{errors.years.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">1 to 50 years</p>
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
            <div id="cagr-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">CAGR Results</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📈 CAGR Percentage
                  </p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">{result.cagrPercentage.toFixed(2)}%</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📊 CAGR Factor
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400">{result.cagr.toFixed(4)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Growth multiple ({(result.cagr + 1).toFixed(4)}x)</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded mt-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Formula:</strong> CAGR = (Ending Value / Beginning Value)^(1/Years) - 1
                </p>
              </div>
              <div className="mt-6">
                <ExportButton
                  fileName="CAGR_Results"
                  calculatorName="CAGR Results"
                  resultElementId="cagr-results"
                  inputElementId="cagr-inputs"
                  inputsData={inputsData}
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Initial Investment', value: watchValues.beginningValue },
                    { name: 'Total Growth', value: watchValues.endingValue - watchValues.beginningValue },
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

