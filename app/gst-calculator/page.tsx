'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateGST } from '@/lib/calculators/gst';
import { GSTSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import ExportButton from '@/components/ui/ExportButton';

type GSTFormData = {
  amount: number;
  gstRate: string;
  calculationType: 'add' | 'remove';
};

interface GSTResultData {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export default function GSTCalculatorPage() {
  const [result, setResult] = useState<GSTResultData | null>(null);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<GSTFormData>({
    resolver: zodResolver(GSTSchema),
    defaultValues: {
      amount: 100000,
      gstRate: '18',
      calculationType: 'add',
    },
  });

  const watchValues = watch();
  const calculationType = watch('calculationType');
  const gstRate = watch('gstRate');

  const handleAmountChange = (value: number) => {
    setValue('amount', value, { shouldValidate: true });
  };

  const handleValidateField = (fieldName: string, value: number) => {
    if (fieldName === 'amount' && (value < 100 || value > 100000000)) {
      alert('Amount must be between ₹100 and ₹10 Crore');
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
  };

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.amount && watchValues.gstRate) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues]);

  const calculateResults = (data: GSTFormData) => {
    const result = calculateGST({
      amount: data.amount,
      gstRate: parseFloat(data.gstRate),
      calculationType: data.calculationType,
    });
    setResult(result);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🧮 GST Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Add or remove GST from any amount. Calculate GST at 5%, 12%, 18%, or 28%
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">GST Details</h2>
          <form  className="space-y-6">
            {/* Calculation Type */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Operation Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="add"
                    {...register('calculationType')}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className={`font-semibold ${calculationType === 'add' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    Add GST
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="remove"
                    {...register('calculationType')}
                    className="w-4 h-4 accent-orange-600"
                  />
                  <span className={`font-semibold ${calculationType === 'remove' ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    Remove GST
                  </span>
                </label>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">
                {calculationType === 'add' ? 'Amount (Without GST) (₹)' : 'Amount (With GST) (₹)'}
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="100"
                  max="100000000"
                  step="100"
                  value={watchValues.amount === 0 ? "" : watchValues.amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  onBlur={(e) => handleValidateField('amount', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number" placeholder="0"
                  min="100"
                  max="100000000"
                  step="100"
                  value={watchValues.amount === 0 ? "" : watchValues.amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  onBlur={(e) => handleValidateField('amount', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹100 to ₹10 Crore</p>
            </div>

            {/* GST Rate */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">GST Rate (%)</label>
              <div className="grid grid-cols-4 gap-2">
                {['5', '12', '18', '28'].map((rate) => (
                  <label key={rate} className="relative">
                    <input
                      type="radio"
                      value={rate}
                      {...register('gstRate')}
                      className="sr-only peer"
                    />
                    <div className={`p-3 rounded-lg border-2 font-bold text-center cursor-pointer transition-all ${
                      gstRate === rate
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-purple-400'
                    }`}>
                      {rate}%
                    </div>
                  </label>
                ))}
              </div>
              {errors.gstRate && <p className="text-red-500 text-sm">{errors.gstRate.message}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                🧮 Calculate GST
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
            <div id="gst-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">GST Breakdown</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/20 p-5 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📦 Base Amount
                  </p>
                  <p className="text-4xl font-bold text-gray-700 dark:text-gray-400">{formatCurrency(result.baseAmount)}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-5 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    💜 GST Amount ({gstRate}%)
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{formatCurrency(result.gstAmount)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    ✅ Total Amount
                  </p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalAmount)}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded mt-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Calculation:</strong> {calculationType === 'add' ? 'Total = Base + (Base × Rate / 100)' : 'Base = Total / (1 + Rate / 100)'}
                </p>
              </div>
              <div className="mt-6">
                <ExportButton
                  fileName="GST_Results"
                  calculatorName="GST Breakdown"
                  resultElementId="gst-results"
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter amount and GST rate to calculate</p>
            </div>
          )}
        </div>
      </div>

      {/* GST Breakup Pie Chart */}
      {result && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 GST Distribution</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Base Amount', value: result.baseAmount },
                    { name: 'GST Amount', value: result.gstAmount },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f97316" />
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Base Amount</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(result.baseAmount)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-orange-500" />
                  <span className="text-gray-600 dark:text-gray-400">GST ({gstRate}%)</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(result.gstAmount)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-t-2 border-green-300 dark:border-green-700 mt-2 pt-4">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">Total Amount</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GST Rate Info */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">📋 GST Rate Categories</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-4 rounded-lg border border-green-300 dark:border-green-700">
            <p className="font-bold text-green-700 dark:text-green-300 mb-2">5% GST</p>
            <p className="text-sm text-green-600 dark:text-green-400">Basic essentials: food items, medicines, books</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
            <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">12% GST</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Mid-rate items: clothing, electronics, services</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 p-4 rounded-lg border border-orange-300 dark:border-orange-700">
            <p className="font-bold text-orange-700 dark:text-orange-300 mb-2">18% GST</p>
            <p className="text-sm text-orange-600 dark:text-orange-400">Most goods and services: restaurants, hotels, software</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 p-4 rounded-lg border border-red-300 dark:border-red-700">
            <p className="font-bold text-red-700 dark:text-red-300 mb-2">28% GST</p>
            <p className="text-sm text-red-600 dark:text-red-400">Luxury items: cars, precious metals, high-end goods</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is GST?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Goods and Services Tax (GST) is an indirect tax levied on the supply of goods and services in India. It is calculated based on the value of goods/services and varies from 5% to 28%.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              When was GST introduced in India?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              GST was introduced on July 1, 2017, replacing multiple taxes like VAT, Service Tax, and Excise Duty. It is a unified indirect tax system across India.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How is GST different from other taxes?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              GST replaced multiple taxes (VAT, Service Tax, Excise) with one unified tax system. It reduced tax cascading and made the tax system simpler and more transparent across states.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Who pays GST?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Registered businesses collect GST from customers and remit it to the government. The final consumer bears the GST cost as it is an indirect tax.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is Input Tax Credit (ITC)?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              ITC allows registered businesses to claim credit for GST paid on inputs and use it to offset their GST liability, preventing double taxation.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

