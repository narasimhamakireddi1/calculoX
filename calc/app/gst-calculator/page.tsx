'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { ChartEmptyState } from '@/components/charts/ChartEmptyState';
import { calculateGST } from '@/lib/calculators/gst';
import { GSTSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { RelatedBlogPosts } from '@/components/ui/RelatedBlogPosts';
import { getRelatedBlogPosts } from '@/lib/blog/utils';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { ShoppingCart, Package, Sparkles, Trash2, Percent, CheckCircle2, BookOpen, Lightbulb, BarChart2, Tag, Calculator, Info, HelpCircle, ChevronRight } from 'lucide-react';
import { getInternalLinks } from '@/config/internal-links.config';

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
  const [result, setResult] = useState<GSTResultData | null>(() => {
    try { return calculateGST({ amount: 100000, gstRate: 18, calculationType: 'add' }); } catch { return null; }
  });

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

  // Quick-start scenarios
  const gstScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Essential Goods (5%)',
      description: '₹1,000 price, 5% GST',
      icon: ShoppingCart,
      values: { amount: 1000, gstRate: 5, mode: 'add' }
    },
    {
      label: 'Regular Product (18%)',
      description: '₹5,000 price, 18% GST',
      icon: Package,
      values: { amount: 5000, gstRate: 18, mode: 'add' }
    },
    {
      label: 'Luxury Item (28%)',
      description: '₹50,000 price, 28% GST',
      icon: Sparkles,
      values: { amount: 50000, gstRate: 28, mode: 'add' }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof GSTFormData, value as any, { shouldValidate: true });
    });
  }, [setValue]);

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
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0">
            <CalculatorIcon idOrHref="gst" className="w-6 h-6 text-white" />
          </span>
          <span>GST Calculator</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
          Add or remove GST from any amount. Calculate GST at 5%, 12%, 18%, or 28%
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div id="gst-inputs" className="card min-w-0">
          <h2 className="text-2xl font-bold mb-6">GST Details</h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={gstScenarios}
            onSelectScenario={handleSelectScenario}
          />

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
                    className="w-4 h-4 accent-blue-600"
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
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className={`font-semibold ${calculationType === 'remove' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    Remove GST
                  </span>
                </label>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-3">
              <label htmlFor="gst-amount" className="block text-sm font-bold text-gray-900 dark:text-white">
                {calculationType === 'add' ? 'Amount (Without GST) (₹)' : 'Amount (With GST) (₹)'}
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                <RangeSlider
                  min="100"
                  max="100000000"
                  step="100"
                  value={watchValues.amount === 0 ? "" : watchValues.amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  onBlur={(e) => handleValidateField('amount', Number(e.target.value))}
                  className="w-full flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  id="gst-amount"
                  type="number" placeholder="0"
                  min="100"
                  max="100000000"
                  step="100"
                  value={watchValues.amount === 0 ? "" : watchValues.amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  onBlur={(e) => handleValidateField('amount', Number(e.target.value))}
                  className="w-full md:w-28 px-2 py-2 text-center border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {[1000, 5000, 10000, 50000].map(val => (
                  <button key={val} type="button" onClick={() => handleAmountChange(val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                               bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    ₹{val >= 1000 ? `${val / 1000}K` : val}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">₹100 to ₹10 Crore</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-1"><Info className="w-3.5 h-3.5 inline flex-shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" /> 18% applies to most services. 5% for essential goods, 12% for intermediate, 28% for luxury items</p>
            </div>

            {/* GST Rate */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">GST Rate (%)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-blue-400'
                    }`}>
                      {rate}%
                    </div>
                  </label>
                ))}
              </div>
              {errors.gstRate && <p className="text-red-500 text-sm">{errors.gstRate.message}</p>}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost w-full inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 inline mr-1" aria-hidden="true" /> Clear All
            </button>

            {/* Formula Reference */}
            <div className="info-panel mt-6">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Calculator className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Formula Reference</h4>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {calculationType === 'add' ? 'Total = Base × (1 + Rate/100)' : 'Base = Total ÷ (1 + Rate/100)'}
                </p>
                <p><strong className="text-gray-900 dark:text-white">GST Rates (India):</strong> 0%, 5%, 12%, 18%, 28%</p>
                <p><strong className="text-gray-900 dark:text-white">Common:</strong> 18% (Standard), 5% (Essential items)</p>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="min-w-0">
          {result ? (
            <div id="gst-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">GST Breakdown</h2>
              {/* Hero metric */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 p-6 sm:p-8 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Total Amount
                </p>
                <p className="text-[clamp(1.5rem,7.5vw,3.75rem)] font-black text-blue-700 dark:text-blue-400 whitespace-nowrap leading-tight">{formatCurrency(result.totalAmount)}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Base + {gstRate}% GST</p>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="stat-tile">
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                    <Package className="w-3 h-3 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Base Amount
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">{formatCurrency(result.baseAmount)}</p>
                </div>

                <div className="stat-tile">
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                    <Percent className="w-3 h-3 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> GST ({gstRate}%)
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">{formatCurrency(result.gstAmount)}</p>
                </div>
              </div>

              {/* Understanding GST */}
              <div className="info-panel mt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Understanding GST</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  GST (Goods and Services Tax) is an indirect tax in India applied to most products and services. The rate varies based on product category (0%, 5%, 12%, 18%, or 28%).
                </p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong className="text-gray-900 dark:text-white">Base Amount:</strong> {formatCurrency(result.baseAmount)} - {calculationType === 'add' ? 'Your cost or price before GST' : 'Calculated amount excluding GST'}</p>
                  <p><strong className="text-gray-900 dark:text-white">GST Rate:</strong> {gstRate}% - Standard rate for this product/service category</p>
                  <p><strong className="text-gray-900 dark:text-white">GST Amount:</strong> {formatCurrency(result.gstAmount)} - Tax liability ({gstRate}% of base)</p>
                  <p><strong className="text-gray-900 dark:text-white">Total Amount:</strong> {formatCurrency(result.totalAmount)} - Final price {calculationType === 'add' ? 'including' : 'excluding'} GST</p>
                </div>
              </div>

              {/* Key Insights */}
              <div className="info-panel mt-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" /> Key Insights</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    <strong className="text-gray-900 dark:text-white">GST Impact:</strong> {calculationType === 'add' ? 'Your base amount increases by' : 'Your total amount reduces by'} <span className="font-bold text-emerald-600 dark:text-emerald-400">{((result.gstAmount / result.baseAmount) * 100).toFixed(1)}%</span>
                  </p>
                  <p>
                    <strong>Price Comparison:</strong> Base price is {((result.baseAmount / result.totalAmount) * 100).toFixed(1)}% of total | GST is {((result.gstAmount / result.totalAmount) * 100).toFixed(1)}% of total
                  </p>
                  <p>
                    <strong>GST Rate Note:</strong> {Number(gstRate) === 18 && '18% is the standard GST rate for most products and services in India'}
                    {Number(gstRate) === 5 && '5% GST applies to essential items like packaged foods, medicines, and certain services'}
                    {Number(gstRate) === 12 && '12% GST applies to intermediate products like packaged snacks and leather items'}
                    {Number(gstRate) === 28 && '28% is the highest GST rate, applied to luxury items like automobiles'}
                    {Number(gstRate) === 0 && '0% GST applies to essential items like raw foods and newspapers'}
                  </p>
                </div>
              </div>

              <div className="info-panel border-l-4 border-blue-500 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">Calculation:</strong> {calculationType === 'add' ? 'Total = Base + (Base × Rate / 100)' : 'Base = Total / (1 + Rate / 100)'}
                </p>
              </div>
              <div className="mt-6">
                <ShareButtons
                  inputs={[
                    { label: calculationType === 'add' ? 'Amount (Without GST)' : 'Amount (With GST)', value: formatCurrency(watchValues.amount) },
                    { label: 'GST Rate', value: `${gstRate}%` },
                    { label: 'Operation Type', value: calculationType === 'add' ? 'Add GST' : 'Remove GST' }
                  ]}
                  outputs={[
                    { label: calculationType === 'add' ? 'Base Amount' : 'Amount Without GST', value: formatCurrency(result.baseAmount) },
                    { label: 'GST Amount', value: formatCurrency(result.gstAmount) },
                    { label: calculationType === 'add' ? 'Total Amount' : 'Amount With GST', value: formatCurrency(result.totalAmount) }
                  ]}
                  calculatorName="GST Calculator"
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
      {result ? (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart2 className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> GST Distribution</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <MemoizedPieChart
              data={[
                { name: 'Base Amount', value: result.baseAmount },
                { name: 'GST Amount', value: result.gstAmount },
              ]}
              colors={['#3b82f6', '#f59e0b']}
              height={300}
            />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Base Amount</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(result.baseAmount)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-amber-500" />
                  <span className="text-gray-600 dark:text-gray-400">GST ({gstRate}%)</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(result.gstAmount)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-t-2 border-gray-300 dark:border-gray-700 mt-2 pt-4">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">Total Amount</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : <ChartEmptyState columns={1} />}

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('gst-calculator')} />

      <RelatedBlogPosts posts={getRelatedBlogPosts('/gst-calculator')} />

      {/* GST Rate Info */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Tag className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> GST Rate Categories</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="info-panel">
            <p className="font-bold text-blue-700 dark:text-blue-400 mb-2">5% GST</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Basic essentials: food items, medicines, books</p>
          </div>

          <div className="info-panel">
            <p className="font-bold text-blue-700 dark:text-blue-400 mb-2">12% GST</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Mid-rate items: clothing, electronics, services</p>
          </div>

          <div className="info-panel">
            <p className="font-bold text-blue-700 dark:text-blue-400 mb-2">18% GST</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Most goods and services: restaurants, hotels, software</p>
          </div>

          <div className="info-panel">
            <p className="font-bold text-blue-700 dark:text-blue-400 mb-2">28% GST</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Luxury items: cars, precious metals, high-end goods</p>
          </div>
        </div>
      </div>

      {/* Featured Snippet Sections for SEO */}
      {/* Definition Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">What is GST?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          GST (Goods and Services Tax) is a unified indirect tax system in India that applies to the supply of goods and services. Introduced on July 1, 2017, GST replaced multiple taxes including VAT, Service Tax, and Excise Duty. The tax is calculated as a percentage of the transaction value and varies from <strong>5% to 28%</strong> depending on the category of goods or services. The formula for calculating GST is: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GST = Base Amount × (GST Rate / 100)</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          GST is an indirect tax, meaning registered businesses collect it from customers on behalf of the government and remit it to tax authorities. For businesses, Input Tax Credit (ITC) allows them to claim credit for GST paid on business purchases.
        </p>
      </div>

      {/* Table Snippet - GST Rates by Category */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">GST Rates in India: Complete Breakdown by Category</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">GST Rate</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Category Examples</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">0% (Exempt)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Essential food items</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Unpackaged rice, flour, eggs</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">5% (Essential)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Basic essentials</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Packaged food, medicines, books</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-blue-700 dark:text-blue-400">12% (Mid-rate)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Common goods & services</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Clothing, electronics, domestic flights</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-blue-700 dark:text-blue-400">18% (Standard)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Most goods & services</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Restaurants, hotels, software, AC electronics</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400">28% (Luxury)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Luxury items</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Cars, jewelry, precious metals</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <strong>Note:</strong> Some categories like passenger vehicles, petrol, diesel, and banking services have special rates or exceptions. Always verify the applicable GST rate for your specific product or service.
        </p>
      </div>

      {/* How-to List Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">How to Calculate GST on a Product or Service?</h2>
        <ol className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">1.</span>
            <div>
              <strong>Identify the Product Category:</strong> Determine the category of your product or service. Different categories have different GST rates (5%, 12%, 18%, or 28%).
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">2.</span>
            <div>
              <strong>Know the Applicable GST Rate:</strong> Once you identify the category, find out the GST rate. For example, restaurant meals are 5% GST (unpackaged takeaway) or 5% (dine-in for less than ₹1000 bill) or 18% (dine-in for larger bills).
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">3.</span>
            <div>
              <strong>Calculate GST Amount:</strong> Multiply the base amount (before GST) by the GST rate and divide by 100. Formula: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">GST = Amount × (Rate / 100)</span>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">4.</span>
            <div>
              <strong>Add GST to Get Final Price:</strong> The final price paid by the customer is: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">Final Price = Base Amount + GST Amount</span>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">5.</span>
            <div>
              <strong>For Reverse Calculation (Remove GST):</strong> If you have the final price and need to find the base amount: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">Base = Final Price / (1 + Rate/100)</span>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">6.</span>
            <div>
              <strong>Use a GST Calculator (Optional):</strong> For quick and accurate calculations, use an online GST calculator like the one above instead of manual calculations.
            </div>
          </li>
        </ol>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Example:</strong> If you buy an item for ₹1,000 with 18% GST, the GST amount is ₹1,000 × 0.18 = ₹180, and the final price you pay is ₹1,000 + ₹180 = ₹1,180.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is GST?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Goods and Services Tax (GST) is an indirect tax levied on the supply of goods and services in India. It is calculated based on the value of goods/services and varies from 5% to 28%.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              When was GST introduced in India?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              GST was introduced on July 1, 2017, replacing multiple taxes like VAT, Service Tax, and Excise Duty. It is a unified indirect tax system across India.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How is GST different from other taxes?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              GST replaced multiple taxes (VAT, Service Tax, Excise) with one unified tax system. It reduced tax cascading and made the tax system simpler and more transparent across states.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Who pays GST?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Registered businesses collect GST from customers and remit it to the government. The final consumer bears the GST cost as it is an indirect tax.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is Input Tax Credit (ITC)?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
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

