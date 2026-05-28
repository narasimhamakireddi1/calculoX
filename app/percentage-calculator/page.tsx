'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculatePercentage } from '@/lib/calculators/percentage';
import { PercentageSchema } from '@/lib/validators';
import { formatNumber } from '@/lib/utils/format';

type PercentageFormData = {
  valueA: number;
  valueB: number;
  calculationType: 'percent-of' | 'percent-change' | 'what-percent';
};

interface PercentageResultData {
  result: number;
  description: string;
}

export default function PercentageCalculatorPage() {
  const [result, setResult] = useState<PercentageResultData | null>(null);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<PercentageFormData>({
    resolver: zodResolver(PercentageSchema),
    defaultValues: {
      valueA: 20,
      valueB: 100,
      calculationType: 'percent-of',
    },
  });

  const watchValues = watch();
  const calculationType = watch('calculationType');

  const handleInputChange = (fieldName: keyof PercentageFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleValidateField = (fieldName: string, value: number) => {
    if (fieldName === 'valueA' && (value < 0 || value > 1000)) {
      alert('Value A must be between 0 and 1000');
    } else if (fieldName === 'valueB' && (value <= 0 || value > 1000000)) {
      alert('Value B must be between 1 and 10,00,000');
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
  };

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.valueA && watchValues.valueB) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues, calculationType]);

  const calculateResults = (data: PercentageFormData) => {
    const result = calculatePercentage(data);
    setResult(result);
  };

  const getLabelA = () => {
    if (calculationType === 'percent-of') return 'Percentage (%)';
    if (calculationType === 'percent-change') return 'Old Value';
    return 'First Value';
  };

  const getLabelB = () => {
    if (calculationType === 'percent-of') return 'Base Value';
    if (calculationType === 'percent-change') return 'New Value';
    return 'Second Value';
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">📊 Percentage Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate percentage of, percentage change, and what percentage calculations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Percentage Calculation</h2>
          <form  className="space-y-6">
            {/* Calculation Type */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Calculation Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors" >
                  <input
                    type="radio"
                    value="percent-of"
                    {...register('calculationType')}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">What is A% of B?</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Find percentage of a value</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
                  <input
                    type="radio"
                    value="percent-change"
                    {...register('calculationType')}
                    className="w-4 h-4 accent-orange-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Percentage Change from A to B</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Calculate percentage increase or decrease</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-colors">
                  <input
                    type="radio"
                    value="what-percent"
                    {...register('calculationType')}
                    className="w-4 h-4 accent-green-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">A is what % of B?</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Find what percentage a value is of another</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Value A */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">{getLabelA()}</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="1"
                  value={watchValues.valueA === 0 ? "" : watchValues.valueA}
                  onChange={(e) => handleInputChange('valueA', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('valueA', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number" placeholder="0"
                  min="0"
                  max="1000"
                  step="0.01"
                  value={watchValues.valueA === 0 ? "" : watchValues.valueA}
                  onChange={(e) => handleInputChange('valueA', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('valueA', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.valueA && <p className="text-red-500 text-sm">{errors.valueA.message}</p>}
            </div>

            {/* Value B */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">{getLabelB()}</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="1"
                  value={watchValues.valueB === 0 ? "" : watchValues.valueB}
                  onChange={(e) => handleInputChange('valueB', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('valueB', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  type="number" placeholder="0"
                  min="0"
                  max="1000"
                  step="0.01"
                  value={watchValues.valueB === 0 ? "" : watchValues.valueB}
                  onChange={(e) => handleInputChange('valueB', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('valueB', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              {errors.valueB && <p className="text-red-500 text-sm">{errors.valueB.message}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                📊 Calculate
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                🗑️ Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Result</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">📈 Result</p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">
                    {calculationType === 'percent-change'
                      ? `${result.result.toFixed(2)}%`
                      : calculationType === 'what-percent'
                        ? `${result.result.toFixed(2)}%`
                        : formatNumber(result.result, 2)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-5 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">📝 Description</p>
                  <p className="text-lg font-semibold text-purple-700 dark:text-purple-400">{result.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter values and click Calculate</p>
            </div>
          )}
        </div>
      </div>

      {/* Percentage Breakup Pie Chart (only for percent-of mode) */}
      {result && calculationType === 'percent-of' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 Percentage Breakup</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: `${watchValues.valueA}% Portion`, value: result.result },
                    { name: 'Remainder', value: watchValues.valueB - result.result },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip formatter={(v) => formatNumber(v as number, 2)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">{watchValues.valueA}% Portion</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatNumber(result.result, 2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Remainder</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatNumber(watchValues.valueB - result.result, 2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-gray-50 dark:from-blue-900/20 dark:to-gray-900/20 rounded-lg border-t-2 border-blue-300 dark:border-blue-700 mt-2 pt-4">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">Total Base Value</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{formatNumber(watchValues.valueB, 2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">📋 Percentage Calculation Examples</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
            <p className="font-bold text-blue-700 dark:text-blue-300 mb-3">What is A% of B?</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">Example: What&apos;s 20% of 500?</p>
            <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border border-blue-200 dark:border-blue-700">Result = 100</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 p-4 rounded-lg border border-orange-300 dark:border-orange-700">
            <p className="font-bold text-orange-700 dark:text-orange-300 mb-3">Percentage Change</p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">Example: From 100 to 150?</p>
            <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border border-orange-200 dark:border-orange-700">Result = 50%</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-4 rounded-lg border border-green-300 dark:border-green-700">
            <p className="font-bold text-green-700 dark:text-green-300 mb-3">A is what % of B?</p>
            <p className="text-sm text-green-600 dark:text-green-400 mb-3">Example: 25 is what % of 500?</p>
            <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border border-green-200 dark:border-green-700">Result = 5%</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How to calculate percentage?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              To calculate percentage: (Part / Whole) × 100. For example, 25 is what % of 100? Answer: (25/100) × 100 = 25%.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How to find percentage of a number?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              To find X% of Y: (X/100) × Y. For example, 15% of 200 = (15/100) × 200 = 30.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How to calculate percentage change?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Percentage Change = ((New Value - Old Value) / Old Value) × 100. For example, from 100 to 150: ((150-100)/100) × 100 = 50%.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is percentage increase vs decrease?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              If result is positive, it&apos;s a percentage increase. If result is negative, it&apos;s a percentage decrease. For example, 100 to 80 is -20% (decrease).
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

