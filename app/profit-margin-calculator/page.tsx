'use client';

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import ExportButton from '@/components/ui/ExportButton';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { getInternalLinks } from '@/config/internal-links.config';
import {
  ProfitMarginGstEngine,
  type PricingResult,
  type CalculationBasis,
  type GSTTreatment,
} from '@/lib/calculators/profit-margin';

type FormData = {
  costPrice: number;
  sellingPrice: number;
  targetMarginPct: number;
  targetMarkupPct: number;
  gstRatePct: number;
  calculationBasis: CalculationBasis;
  gstTreatment: GSTTreatment;
  marginOrMarkup: 'margin' | 'markup';
};

interface GstScenario {
  gstRate: number;
  netSellingPrice: number;
  gstAmount: number;
  finalPrice: number;
  profit: number;
  marginPct: number;
  markupPct: number;
}

export default function ProfitMarginCalculator() {
  const { watch, setValue } = useForm<FormData>({
    defaultValues: {
      costPrice: 1000,
      sellingPrice: 0,
      targetMarginPct: 20,
      targetMarkupPct: 0,
      gstRatePct: 18,
      calculationBasis: 'COST_DRIVEN',
      gstTreatment: 'EXCLUSIVE',
      marginOrMarkup: 'margin',
    },
  });

  const watchValues = watch();
  const [results, setResults] = useState<PricingResult | null>(null);
  const [gstScenarios, setGstScenarios] = useState<GstScenario[]>([]);

  const equivalentMargin = useMemo(() => {
    if (watchValues.targetMarkupPct > 0) {
      const markup = watchValues.targetMarkupPct / 100;
      return (markup / (1 + markup)) * 100;
    }
    return 0;
  }, [watchValues.targetMarkupPct]);

  const equivalentMarkup = useMemo(() => {
    if (watchValues.targetMarginPct > 0 && watchValues.targetMarginPct < 100) {
      const margin = watchValues.targetMarginPct / 100;
      return (margin / (1 - margin)) * 100;
    }
    return 0;
  }, [watchValues.targetMarginPct]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = ProfitMarginGstEngine.calculatePricing(
        {
          costPrice: watchValues.costPrice,
          sellingPrice: watchValues.sellingPrice,
          targetMarginPct: watchValues.targetMarginPct,
          targetMarkupPct: watchValues.targetMarkupPct,
          gstRatePct: watchValues.gstRatePct,
        },
        {
          calculationBasis: watchValues.calculationBasis,
          gstTreatment: watchValues.gstTreatment,
          marginOrMarkup: watchValues.marginOrMarkup,
        }
      );
      setResults(result);

      const scenarios = ProfitMarginGstEngine.calculateAllGstScenarios(
        {
          costPrice: watchValues.costPrice,
          sellingPrice: watchValues.sellingPrice,
          targetMarginPct: watchValues.targetMarginPct,
          targetMarkupPct: watchValues.targetMarkupPct,
          gstRatePct: watchValues.gstRatePct,
        },
        {
          calculationBasis: watchValues.calculationBasis,
          marginOrMarkup: watchValues.marginOrMarkup,
        }
      );
      setGstScenarios(scenarios);
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues]);

  const handleReset = () => {
    setValue('costPrice', 1000);
    setValue('sellingPrice', 0);
    setValue('targetMarginPct', 20);
    setValue('targetMarkupPct', 0);
    setValue('gstRatePct', 18);
    setValue('calculationBasis', 'COST_DRIVEN');
    setValue('gstTreatment', 'EXCLUSIVE');
    setValue('marginOrMarkup', 'margin');
  };

  // Quick-start scenarios
  const pmScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Retail Product',
      description: '₹1,000 cost → 25% margin',
      icon: '🛍️',
      values: { costPrice: 1000, targetMarginPct: 25, targetMarkupPct: 0, gstRatePct: 18, calculationBasis: 'COST_DRIVEN', gstTreatment: 'EXCLUSIVE' }
    },
    {
      label: 'Premium Item',
      description: '₹5,000 cost → 40% margin',
      icon: '💎',
      values: { costPrice: 5000, targetMarginPct: 40, targetMarkupPct: 0, gstRatePct: 18, calculationBasis: 'COST_DRIVEN', gstTreatment: 'EXCLUSIVE' }
    },
    {
      label: 'Bulk Sales',
      description: '₹10,000 cost → 15% markup',
      icon: '📦',
      values: { costPrice: 10000, targetMarginPct: 0, targetMarkupPct: 15, gstRatePct: 12, calculationBasis: 'COST_DRIVEN', gstTreatment: 'EXCLUSIVE' }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof FormData, value as any, { shouldValidate: true });
    });
  }, [setValue]);

  const chartData = results
    ? [
        {
          name: 'Price',
          cost: results.inputCostPrice,
          profit: results.absoluteGrossProfit,
          gst: results.gstTaxLiability,
        },
      ]
    : [];

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">💹 Profit Margin & Markup Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Production-grade pricing calculator for Indian retail & e-commerce with GST integration
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Mode Toggle */}
        <div className="flex gap-2 justify-center border-b border-gray-200 dark:border-gray-700 mb-8">
          {[
            { id: 'COST_DRIVEN' as const, label: 'Cost-Driven (Bottom-Up)' },
            { id: 'SELLING_PRICE_DRIVEN' as const, label: 'Price-Driven (Top-Down)' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setValue('calculationBasis', mode.id)}
              className={`px-4 py-3 font-semibold text-sm transition-all ${
                watchValues.calculationBasis === mode.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div id="pricing-inputs" className="lg:col-span-1 card space-y-6">
            <h2 className="text-lg font-semibold mb-6">Input Parameters</h2>

            {/* Quick-Start Examples */}
            <QuickStartExamples
              scenarios={pmScenarios}
              onSelectScenario={handleSelectScenario}
            />

            {/* Cost Price - Common for both modes */}
            <div className="space-y-3">
              <label htmlFor="cost-price" className="block text-sm font-bold text-gray-900 dark:text-white">
                Cost Price (₹)
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="1"
                  max="100000"
                  step="1"
                  value={watchValues.costPrice || 0}
                  onChange={(e) => setValue('costPrice', parseFloat(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="w-full md:w-auto relative flex-shrink-0">
                  <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 font-bold text-xs md:text-sm">₹</span>
                  <input
                    id="cost-price"
                    type="number"
                    value={watchValues.costPrice === 0 ? '' : watchValues.costPrice}
                    onChange={(e) => setValue('costPrice', parseFloat(e.target.value) || 0)}
                    className="w-full md:w-28 px-7 md:px-6 py-3 border-2 border-blue-400 rounded-lg text-right font-bold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {[100, 500, 1000, 5000].map(val => (
                  <button key={val} type="button" onClick={() => setValue('costPrice', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                               bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    ₹{val}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">₹1 - ₹100,000</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Your purchase/manufacturing cost. Profit = Selling Price - Cost Price. Higher cost requires higher margin to stay competitive</p>
            </div>

            {/* Cost-Driven Mode Inputs */}
            {watchValues.calculationBasis === 'COST_DRIVEN' && (
              <>
                <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Calculate using:
                  </label>
                  <div className="flex gap-2">
                    {(['margin', 'markup'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setValue('marginOrMarkup', type)}
                        className={`flex-1 px-3 py-2 rounded font-semibold text-xs transition-all ${
                          watchValues.marginOrMarkup === type
                            ? type === 'margin'
                              ? 'bg-green-600 text-white'
                              : 'bg-orange-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {type === 'margin' ? 'Target Margin %' : 'Target Markup %'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Margin */}
                {watchValues.marginOrMarkup === 'margin' && (
                  <div className="space-y-3">
                    <label htmlFor="target-margin" className="block text-sm font-bold text-gray-900 dark:text-white">
                      Target Margin (%)
                    </label>
                    <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                      <input
                        type="range"
                        min="0.1"
                        max="99"
                        step="0.1"
                        value={watchValues.targetMarginPct || 0}
                        onChange={(e) => setValue('targetMarginPct', parseFloat(e.target.value))}
                        className="w-full md:flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <div className="w-full md:w-auto relative flex-shrink-0">
                        <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">%</span>
                        <input
                          id="target-margin"
                          type="number"
                          value={watchValues.targetMarginPct === 0 ? '' : watchValues.targetMarginPct}
                          onChange={(e) => setValue('targetMarginPct', parseFloat(e.target.value) || 0)}
                          className="w-full md:w-28 px-7 md:px-6 py-3 border-2 border-green-400 rounded-lg text-right font-bold text-green-700 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-green-600 dark:text-green-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Equivalent Markup: ~{equivalentMarkup.toFixed(2)}%
                    </p>
                    <div className="flex gap-2 flex-wrap mt-3">
                      {[20, 30, 40, 50].map(val => (
                        <button key={val} type="button" onClick={() => setValue('targetMarginPct', val)}
                          className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                                     bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                                     hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                          {val}%
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Healthy retail margins: 20-50% depending on industry. E-commerce: 15-30%, Grocery: 5-15%, Electronics: 10-20%</p>
                  </div>
                )}

                {/* Target Markup */}
                {watchValues.marginOrMarkup === 'markup' && (
                  <div className="space-y-3">
                    <label htmlFor="target-markup" className="block text-sm font-bold text-gray-900 dark:text-white">
                      Target Markup (%)
                    </label>
                    <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                      <input
                        type="range"
                        min="0.1"
                        max="300"
                        step="0.1"
                        value={watchValues.targetMarkupPct || 0}
                        onChange={(e) => setValue('targetMarkupPct', parseFloat(e.target.value))}
                        className="w-full md:flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                      <div className="w-full md:w-auto relative flex-shrink-0">
                        <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">%</span>
                        <input
                          id="target-markup"
                          type="number"
                          value={watchValues.targetMarkupPct === 0 ? '' : watchValues.targetMarkupPct}
                          onChange={(e) => setValue('targetMarkupPct', parseFloat(e.target.value) || 0)}
                          className="w-full md:w-28 px-7 md:px-6 py-3 border-2 border-orange-400 rounded-lg text-right font-bold text-orange-700 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-orange-600 dark:text-orange-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Equivalent Margin: ~{equivalentMargin.toFixed(2)}%
                    </p>
                    <div className="flex gap-2 flex-wrap mt-3">
                      {[15, 25, 40, 50].map(val => (
                        <button key={val} type="button" onClick={() => setValue('targetMarkupPct', val)}
                          className="text-xs px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-700
                                     bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300
                                     hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors">
                          {val}%
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Markup: increase from Cost. 25% markup on ₹100 = ₹125 selling price. Higher markup = higher margin (non-linear)</p>
                  </div>
                )}
              </>
            )}

            {/* Price-Driven Mode Input */}
            {watchValues.calculationBasis === 'SELLING_PRICE_DRIVEN' && (
              <div className="space-y-3">
                <label htmlFor="selling-price" className="block text-sm font-bold text-gray-900 dark:text-white">
                  Selling Price / MRP (₹)
                </label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="1"
                    max="100000"
                    step="1"
                    value={watchValues.sellingPrice || 0}
                    onChange={(e) => setValue('sellingPrice', parseFloat(e.target.value))}
                    className="w-full md:flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="w-full md:w-auto relative flex-shrink-0">
                    <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 font-bold text-xs md:text-sm">₹</span>
                    <input
                      id="selling-price"
                      type="number"
                      value={watchValues.sellingPrice === 0 ? '' : watchValues.sellingPrice}
                      onChange={(e) => setValue('sellingPrice', parseFloat(e.target.value) || 0)}
                      className="w-full md:w-28 px-7 md:px-6 py-3 border-2 border-purple-400 rounded-lg text-right font-bold text-purple-700 bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-purple-600 dark:text-purple-400"
                      placeholder="0"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">₹1 - ₹100,000</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Market price or fixed MRP on package. Used in Price-Driven mode when MRP is pre-determined and you need to extract profit</p>
              </div>
            )}

            {/* GST Rate */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">GST Rate</label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setValue('gstRatePct', rate)}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                      watchValues.gstRatePct === rate
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* GST Treatment */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">GST Treatment</label>
              <div className="flex gap-2">
                {(['EXCLUSIVE', 'INCLUSIVE'] as const).map((treatment) => (
                  <button
                    key={treatment}
                    onClick={() => setValue('gstTreatment', treatment)}
                    className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      watchValues.gstTreatment === treatment
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300'
                    }`}
                  >
                    {treatment}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              🗑️ Clear All
            </button>
          </div>

          {/* Right Column - Results */}
          {results && (
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    💰 Cost Price
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400 break-words overflow-hidden">
                    ₹{results.inputCostPrice.toFixed(2)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/20 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📊 Net Price (Pre-GST)
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 break-words overflow-hidden">
                    ₹{results.netSellingPricePreGst.toFixed(2)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/20 p-5 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    💳 Final MRP
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-400 break-words overflow-hidden">
                    ₹{results.finalConsumerMRP.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/20 p-5 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    🎯 Gross Profit
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400 break-words overflow-hidden">
                    ₹{results.absoluteGrossProfit.toFixed(2)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-900/20 p-5 rounded-lg border-2 border-orange-300 dark:border-orange-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-orange-700 dark:text-orange-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    📈 Markup
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-400 break-words overflow-hidden">
                    {results.calculatedMarkupPercentage.toFixed(2)}%
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/20 p-5 rounded-lg border-2 border-cyan-300 dark:border-cyan-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-cyan-700 dark:text-cyan-300 text-xs uppercase tracking-wide font-semibold mb-2">
                    💹 Margin
                  </p>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-cyan-700 dark:text-cyan-400 break-words overflow-hidden">
                    {results.calculatedMarginPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* GST Card */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20 p-5 rounded-lg border-2 border-red-300 dark:border-red-700 shadow-md">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-red-700 dark:text-red-300 text-xs uppercase tracking-wide font-semibold mb-1">
                      🧾 GST Liability
                    </p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                      ₹{results.gstTaxLiability.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-red-700 dark:text-red-300 text-xs uppercase tracking-wide font-semibold mb-1">
                      Rate
                    </p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                      {watchValues.gstRatePct}%
                    </p>
                  </div>
                  <div>
                    <p className="text-red-700 dark:text-red-300 text-xs uppercase tracking-wide font-semibold mb-1">
                      Treatment
                    </p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                      {watchValues.gstTreatment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Margin Warning Badge */}
              {watchValues.gstTreatment === 'INCLUSIVE' && results.marginDilutionByGst && results.marginDilutionByGst > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg p-4">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    <span className="font-semibold">⚠️ Warning:</span> Inclusive GST at {watchValues.gstRatePct}% reduces your actual
                    margin from {results.originalMarginBeforeGst?.toFixed(2)}% to{' '}
                    {(results.originalMarginBeforeGst! - results.marginDilutionByGst).toFixed(2)}%. GST has diluted your
                    margin by <span className="font-bold">{results.marginDilutionByGst.toFixed(2)}</span> percentage points.
                  </p>
                </div>
              )}

              {/* Understanding Markup vs Margin */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">📚 Markup vs Margin Explained</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                  <div>
                    <p><strong>📈 Markup ({results.calculatedMarkupPercentage.toFixed(2)}%):</strong></p>
                    <p className="text-xs mt-1">Percentage increase from Cost Price to Selling Price. Formula: (Selling Price - Cost) / Cost × 100</p>
                    <p className="text-xs mt-2 text-blue-700 dark:text-blue-300"><strong>Example:</strong> If you add 50% markup to ₹100 cost, selling price = ₹150</p>
                  </div>
                  <div>
                    <p><strong>💹 Margin ({results.calculatedMarginPercentage.toFixed(2)}%):</strong></p>
                    <p className="text-xs mt-1">Profit as percentage of Selling Price. Formula: Profit / Selling Price × 100</p>
                    <p className="text-xs mt-2 text-blue-700 dark:text-blue-300"><strong>Example:</strong> ₹50 profit on ₹150 sale = 33.3% margin</p>
                  </div>
                </div>
                <p className="text-xs mt-3 text-blue-700 dark:text-blue-300">💡 <strong>Key Insight:</strong> Same markup always gives lower margin%. Healthy retail margins: 20-50% depending on product</p>
              </div>

              {/* Profitability Indicator */}
              <div
                className={`rounded-lg p-4 text-center font-semibold ${
                  results.isProfitable
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                }`}
              >
                {results.isProfitable ? '✅ Profitable' : '❌ Not Profitable'}
              </div>

              {/* Export Button */}
              <ExportButton
                fileName="profit-margin-pricing"
                calculatorName="Profit Margin & Markup Calculator"
                resultElementId="pricing-inputs"
                inputsData={[
                  { label: 'Mode', value: watchValues.calculationBasis.replace('_', ' ') },
                  { label: 'Cost Price', value: `₹${results.inputCostPrice.toFixed(2)}` },
                  { label: 'Net Selling Price', value: `₹${results.netSellingPricePreGst.toFixed(2)}` },
                  { label: 'Final MRP', value: `₹${results.finalConsumerMRP.toFixed(2)}` },
                  { label: 'GST Treatment', value: watchValues.gstTreatment },
                  { label: 'Markup %', value: `${results.calculatedMarkupPercentage.toFixed(2)}%` },
                  { label: 'Margin %', value: `${results.calculatedMarginPercentage.toFixed(2)}%` },
                ]}
              />
            </div>
          )}
        </div>

        {/* Charts Section */}
        {results && (
          <div className="space-y-8">
            {/* Stacked Bar Chart - Mobile Responsive */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-6">📊 Revenue Breakdown (Stacked)</h2>
              {/* Mobile View - Compact Vertical Layout */}
              <div className="md:hidden overflow-x-auto -mx-4 px-4">
                <div style={{ minWidth: '320px' }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 40, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <Tooltip
                        formatter={(value) => `₹${Number(value).toLocaleString('en-IN', {maximumFractionDigits: 0})}`}
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f3f4f6',
                          fontSize: '12px',
                        }}
                        wrapperStyle={{ outline: 'none' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                      <Bar dataKey="cost" stackId="a" fill="#3b82f6" name="Cost Price" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" stackId="a" fill="#10b981" name="Net Profit" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="gst" stackId="a" fill="#ef4444" name="GST Amount" radius={[0, 0, 4, 4]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Desktop View - Original Vertical Layout */}
              <div className="hidden md:block">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, bottom: 20, left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#000000',
                      }}
                      wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend />
                    <Bar dataKey="cost" stackId="a" fill="#3b82f6" name="Cost Price" />
                    <Bar dataKey="profit" stackId="a" fill="#10b981" name="Net Profit" />
                    <Bar dataKey="gst" stackId="a" fill="#ef4444" name="GST Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GST Scenario Table */}
            {gstScenarios.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold mb-6">🧾 GST Rate Scenarios</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">GST Rate</th>
                        <th className="px-4 py-3 text-right font-semibold">Net Price</th>
                        <th className="px-4 py-3 text-right font-semibold">GST Amount</th>
                        <th className="px-4 py-3 text-right font-semibold">Final Price</th>
                        <th className="px-4 py-3 text-right font-semibold">Profit</th>
                        <th className="px-4 py-3 text-right font-semibold">Margin %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gstScenarios.map((scenario, idx) => (
                        <tr
                          key={scenario.gstRate}
                          className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                            scenario.gstRate === watchValues.gstRatePct
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : idx % 2 === 0
                                ? 'bg-white dark:bg-gray-800/50'
                                : 'bg-gray-50 dark:bg-gray-700/30'
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold">{scenario.gstRate}%</td>
                          <td className="px-4 py-3 text-right">₹{scenario.netSellingPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{scenario.gstAmount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-semibold">₹{scenario.finalPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{scenario.profit.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{scenario.marginPct.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Comparison Pie Chart */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-6">💹 Markup vs Margin</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Markup:</strong> {results.calculatedMarkupPercentage.toFixed(2)}% |{' '}
                <strong>Margin:</strong> {results.calculatedMarginPercentage.toFixed(2)}%
              </p>
              <MemoizedPieChart
                data={[
                  { name: 'Markup %', value: results.calculatedMarkupPercentage },
                  { name: 'Margin %', value: results.calculatedMarginPercentage },
                ]}
                colors={['#f97316', '#06b6d4']}
                height={250}
              />
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="card space-y-4">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is the difference between markup and margin?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              <strong>Markup</strong> is profit as a percentage of cost price. <strong>Margin</strong> is profit as a
              percentage of selling price. For example: ₹100 cost with ₹30 profit = 30% markup (30/100 × 100) or 23%
              margin (30/130 × 100). Margin is always lower than markup for the same profit amount.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              How does GST Inclusive pricing work in India?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              In GST Inclusive pricing, the MRP shown includes the tax. If MRP is ₹1,180 with 18% GST, the government
              receives ₹180 while the seller keeps ₹1,000. This is common for retail goods with fixed MRPs. The seller
              cannot claim GST input credits, so the full tax erodes their profit margin.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is MRP and how is embedded GST calculated?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Maximum Retail Price (MRP) is the price printed on packaging — what customers actually pay. When GST is
              inclusive, the embedded tax is calculated as: GST Amount = MRP ÷ (1 + GST Rate %) × GST Rate %. For
              ₹1,180 MRP with 18% GST: GST = 1,180 ÷ 1.18 × 0.18 = ₹180 (seller gets ₹1,000).
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is a healthy profit margin for Indian e-commerce?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Healthy margins vary by category: Electronics 5-15%, Clothing 25-50%, Food 15-25%, Software 70-90%.
              E-commerce platforms typically aim for 20-40% gross margins to cover logistics, returns, and operating
              costs. After accounting for expenses (payment gateway fees 2-3%, logistics 10-15%), net margin should be
              5-15% for viability.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              How do I set price to achieve a 20% margin with 18% GST?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              For GST Exclusive: If you want 20% margin on ₹100 cost, use this calculator with Target Margin 20% and
              GST Exclusive 18%. Result: Sell at ₹1,250 pre-GST, customer pays ₹1,475 (includes ₹225 GST). For GST
              Inclusive (MRP model): If you want ₹1,180 MRP with ₹100 cost, use Price-Driven mode with MRP ₹1,180 and
              GST Inclusive. Your actual margin is 20% on the pre-tax amount (₹1,000).
            </p>
          </details>
        </div>

        {/* Featured Snippet Sections for SEO */}
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is Profit Margin?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Profit Margin is the percentage of revenue that remains as profit after all expenses are deducted. It measures how much profit a business makes for every rupee of sales. The basic formula is: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Profit Margin (%) = (Profit / Selling Price) × 100</span>. For example, if you sell a product for ₹100 and your profit is ₹20, your profit margin is 20%.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Profit margin is crucial for business sustainability because it shows how efficiently a business converts sales into actual profit. A higher margin indicates better profitability, while a lower margin suggests the business operates with tight budgets and has less room for unexpected expenses.
          </p>
        </div>

        {/* Table Snippet - Healthy Margin Benchmarks by Industry */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Healthy Profit Margin Benchmarks by Industry in India</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                  <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Industry / Category</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">Healthy Margin Range</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Electronics</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">5-15%</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Competitive market, high volume, low margins</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Clothing & Apparel</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">25-50%</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Good margins due to brand value and seasonality</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Food & Beverages</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">15-25%</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Regulated prices, moderate margins, perishable goods</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">E-commerce (Gross)</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">20-40%</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Gross margin before logistics and operational costs</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">E-commerce (Net)</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">5-15%</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">After deducting logistics, returns, and overhead costs</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Software & SaaS</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">60-90%</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">High margins, low variable costs, high development investment</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            <strong>Tip:</strong> Compare your margins with industry benchmarks to assess your business competitiveness. Lower than benchmark may indicate high costs; higher may indicate premium positioning.
          </p>
        </div>

        {/* How-to List Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">How to Price a Product to Achieve a 20% Margin with GST?</h2>
          <ol className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">1.</span>
              <div>
                <strong>Determine Your Cost Price:</strong> Calculate the total cost to produce/procure the product. Include material costs, manufacturing, packaging, and overheads. Example: Cost = ₹100.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">2.</span>
              <div>
                <strong>Decide on GST Treatment:</strong> Choose between GST Exclusive (add GST on top) or GST Inclusive (GST embedded in final price). GST Exclusive is standard for B2B; GST Inclusive for retail with fixed MRP.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">3.</span>
              <div>
                <strong>For GST Exclusive (Standard):</strong> Calculate selling price needed to achieve 20% margin: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">Selling Price = Cost / (1 - Margin%/100)</span>. For ₹100 cost with 20% margin: SP = 100 / 0.8 = ₹125.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">4.</span>
              <div>
                <strong>Add GST (if Exclusive):</strong> Add the applicable GST rate (5%, 12%, or 18%) to the selling price. For ₹125 SP with 18% GST: Customer price = ₹125 × 1.18 = ₹147.50.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">5.</span>
              <div>
                <strong>For GST Inclusive (MRP Model):</strong> If you want a fixed MRP of ₹1,180 with 20% margin: Net SP = MRP / (1 + GST%/100). Your true margin is 20% on the pre-GST amount, not the final price.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">6.</span>
              <div>
                <strong>Verify Your Margin:</strong> Always double-check: Margin% = ((Selling Price - Cost Price) / Selling Price) × 100. Ensure it matches your target before launching the product.
              </div>
            </li>
          </ol>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Real Example:</strong> For a product with ₹500 cost, aiming for 25% margin with 18% GST (Exclusive): Selling price = 500 / 0.75 = ₹667. Customer price = ₹667 × 1.18 = ₹787 (includes ₹120 GST). Your profit margin = (167 / 667) × 100 = 25%.
            </p>
          </div>
        </div>

        {/* Related Calculators */}
        <RelatedCalculators calculators={getInternalLinks('profit-margin-calculator')} />

        {/* Affiliate Banner */}
        <AffiliateBanner
          icon="📱"
          headline="Need Pricing & Billing Software?"
          subtext="Manage dynamic pricing, GST invoicing, and profit tracking for your e-commerce business"
          note="Integrated pricing engine for accurate margin calculation and tax compliance"
          gradient="from-purple-600 to-pink-600"
          links={[
            { label: 'Try Billin (Free)', href: 'https://billin.in' },
            { label: 'Zoho Invoice', href: 'https://www.zoho.com/invoice/' },
          ]}
        />
      </div>
    </div>
  );
}
