'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import ExportButton from '@/components/ui/ExportButton';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';
import { Decimal } from 'decimal.js';

type CalculationMode = 'markup-to-margin' | 'margin-to-markup' | 'cost-revenue' | 'gst-impact';

interface ProfitBreakdown {
  costPrice: number;
  sellingPrice: number;
  profit: number;
  markup: number;
  margin: number;
  gstAmount?: number;
  finalPrice?: number;
  profitAfterGst?: number;
}

interface GSTScenario {
  gstRate: number;
  sellingPrice: number;
  totalWithGst: number;
  gstAmount: number;
  profitBeforeGst: number;
  profitAfterGst: number;
  profitMarginAfterGst: number;
}

export default function ProfitMarginCalculator() {
  const { watch, setValue } = useForm({
    defaultValues: {
      mode: 'markup-to-margin' as CalculationMode,
      costPrice: 100,
      markup: 30,
      sellingPrice: 0,
      margin: 0,
      unitsPerYear: 1000,
      gstRate: 18,
    },
  });

  const watchValues = watch();
  const [results, setResults] = useState<ProfitBreakdown | null>(null);
  const [gstScenarios, setGstScenarios] = useState<GSTScenario[]>([]);
  const [yearlyProjection, setYearlyProjection] = useState<any[]>([]);

  const calculations = useMemo(() => {
    const cp = new Decimal(watchValues.costPrice || 0);
    if (cp.isZero() || cp.isNegative()) return null;

    let breakdown: ProfitBreakdown;

    if (watchValues.mode === 'markup-to-margin') {
      const mkp = new Decimal(watchValues.markup || 0).div(100);
      const sp = cp.mul(new Decimal(1).add(mkp));
      const profit = sp.sub(cp);
      const margin = profit.div(sp).mul(100);

      breakdown = {
        costPrice: cp.toNumber(),
        sellingPrice: sp.toNumber(),
        profit: profit.toNumber(),
        markup: watchValues.markup || 0,
        margin: margin.toNumber(),
      };
    } else if (watchValues.mode === 'margin-to-markup') {
      const mgn = new Decimal(watchValues.margin || 0).div(100);
      const sp = cp.div(new Decimal(1).sub(mgn));
      const profit = sp.sub(cp);
      const markup = profit.div(cp).mul(100);

      breakdown = {
        costPrice: cp.toNumber(),
        sellingPrice: sp.toNumber(),
        profit: profit.toNumber(),
        markup: markup.toNumber(),
        margin: watchValues.margin || 0,
      };
    } else if (watchValues.mode === 'cost-revenue') {
      const sp = new Decimal(watchValues.sellingPrice || 0);
      if (sp.lte(cp)) {
        breakdown = {
          costPrice: cp.toNumber(),
          sellingPrice: sp.toNumber(),
          profit: 0,
          markup: 0,
          margin: 0,
        };
      } else {
        const profit = sp.sub(cp);
        const markup = profit.div(cp).mul(100);
        const margin = profit.div(sp).mul(100);

        breakdown = {
          costPrice: cp.toNumber(),
          sellingPrice: sp.toNumber(),
          profit: profit.toNumber(),
          markup: markup.toNumber(),
          margin: margin.toNumber(),
        };
      }
    } else {
      // GST impact mode
      const mkp = new Decimal(watchValues.markup || 0).div(100);
      const sp = cp.mul(new Decimal(1).add(mkp));
      const gstRate = new Decimal(watchValues.gstRate || 18).div(100);
      const gstAmt = sp.mul(gstRate);
      const finalPrice = sp.add(gstAmt);
      const profit = sp.sub(cp);
      const profitAfterGst = profit.sub(gstAmt);

      breakdown = {
        costPrice: cp.toNumber(),
        sellingPrice: sp.toNumber(),
        profit: profit.toNumber(),
        markup: watchValues.markup || 0,
        margin: profit.div(sp).mul(100).toNumber(),
        gstAmount: gstAmt.toNumber(),
        finalPrice: finalPrice.toNumber(),
        profitAfterGst: profitAfterGst.toNumber(),
      };
    }

    return breakdown;
  }, [watchValues.mode, watchValues.costPrice, watchValues.markup, watchValues.margin, watchValues.sellingPrice, watchValues.gstRate]);

  // Calculate GST scenarios
  useMemo(() => {
    if (!calculations || watchValues.mode !== 'gst-impact') {
      setGstScenarios([]);
      return;
    }

    const sp = new Decimal(calculations.sellingPrice);
    const profit = new Decimal(calculations.profit);

    const rates = [0, 5, 12, 18, 28];
    const scenarios = rates.map((rate) => {
      const gstRate = new Decimal(rate).div(100);
      const gstAmount = sp.mul(gstRate);
      const totalWithGst = sp.add(gstAmount);
      const profitAfterGst = profit.sub(gstAmount);
      const profitMarginAfterGst = profitAfterGst.div(sp).mul(100);

      return {
        gstRate: rate,
        sellingPrice: sp.toNumber(),
        totalWithGst: totalWithGst.toNumber(),
        gstAmount: gstAmount.toNumber(),
        profitBeforeGst: profit.toNumber(),
        profitAfterGst: profitAfterGst.toNumber(),
        profitMarginAfterGst: profitMarginAfterGst.toNumber(),
      };
    });

    setGstScenarios(scenarios);
  }, [calculations, watchValues.mode]);

  // Calculate yearly projection
  useMemo(() => {
    if (!calculations) {
      setYearlyProjection([]);
      return;
    }

    const unitsPerYear = new Decimal(watchValues.unitsPerYear || 1000);
    const revenue = new Decimal(calculations.sellingPrice).mul(unitsPerYear);
    const totalCost = new Decimal(calculations.costPrice).mul(unitsPerYear);
    const totalProfit = new Decimal(calculations.profit).mul(unitsPerYear);

    const projection = [];
    for (let i = 1; i <= 5; i++) {
      const yearRevenue = revenue.mul(i);
      const yearCost = totalCost.mul(i);
      const yearProfit = totalProfit.mul(i);

      projection.push({
        year: `Year ${i}`,
        revenue: yearRevenue.toNumber(),
        cost: yearCost.toNumber(),
        profit: yearProfit.toNumber(),
      });
    }

    setYearlyProjection(projection);
  }, [calculations, watchValues.unitsPerYear]);

  // Update results when calculations change
  useMemo(() => {
    if (calculations) {
      setResults(calculations);
    }
  }, [calculations]);

  const inputsData = useMemo(() => {
    if (!results) return [];

    const inputs = [
      { label: 'Mode', value: watchValues.mode.replace('-', ' ').toUpperCase() },
      { label: 'Cost Price', value: `₹${results.costPrice.toFixed(2)}` },
    ];

    if (watchValues.mode === 'markup-to-margin') {
      inputs.push({ label: 'Markup %', value: `${results.markup.toFixed(2)}%` });
    } else if (watchValues.mode === 'margin-to-markup') {
      inputs.push({ label: 'Margin %', value: `${results.margin.toFixed(2)}%` });
    } else if (watchValues.mode === 'cost-revenue') {
      inputs.push({ label: 'Selling Price', value: `₹${results.sellingPrice.toFixed(2)}` });
    } else {
      inputs.push(
        { label: 'Markup %', value: `${results.markup.toFixed(2)}%` },
        { label: 'GST Rate %', value: `${watchValues.gstRate}%` }
      );
    }

    return inputs;
  }, [results, watchValues.mode, watchValues.gstRate]);

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">💹 Profit Margin & Markup Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">Calculate markups, margins, and GST impact on profitability</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mode Selector */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Select Calculation Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'markup-to-margin', label: 'Markup → Margin' },
              { id: 'margin-to-markup', label: 'Margin → Markup' },
              { id: 'cost-revenue', label: 'Cost & Revenue' },
              { id: 'gst-impact', label: 'GST Impact Analysis' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setValue('mode', mode.id as CalculationMode)}
                aria-pressed={watchValues.mode === mode.id}
                className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                  watchValues.mode === mode.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">Input Parameters</h2>

          {/* Cost Price */}
          <div>
            <label htmlFor="cost-price" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Cost Price (₹)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="cost-price"
                type="range"
                min="1"
                max="100000"
                value={watchValues.costPrice || 0}
                onChange={(e) => setValue('costPrice', parseFloat(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute left-2 top-2.5 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={watchValues.costPrice === 0 ? '' : watchValues.costPrice}
                  onChange={(e) => setValue('costPrice', parseFloat(e.target.value) || 0)}
                  className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹1 - ₹100,000</p>
          </div>

          {/* Markup (Markup → Margin & GST Impact) */}
          {(watchValues.mode === 'markup-to-margin' || watchValues.mode === 'gst-impact') && (
            <div>
              <label htmlFor="markup" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Markup (%)
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  id="markup"
                  type="range"
                  min="0"
                  max="200"
                  step="0.1"
                  value={watchValues.markup || 0}
                  onChange={(e) => setValue('markup', parseFloat(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600 transition-all"
                />
                <div className="w-full md:w-auto relative flex-shrink-0">
                  <span className="absolute right-3 top-2.5 font-bold text-sm">%</span>
                  <input
                    type="number"
                    value={watchValues.markup === 0 ? '' : watchValues.markup}
                    onChange={(e) => setValue('markup', parseFloat(e.target.value) || 0)}
                    className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 200%</p>
            </div>
          )}

          {/* Margin (Margin → Markup) */}
          {watchValues.mode === 'margin-to-markup' && (
            <div>
              <label htmlFor="margin" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Margin (%)
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  id="margin"
                  type="range"
                  min="0"
                  max="99"
                  step="0.1"
                  value={watchValues.margin || 0}
                  onChange={(e) => setValue('margin', parseFloat(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600 transition-all"
                />
                <div className="w-full md:w-auto relative flex-shrink-0">
                  <span className="absolute right-3 top-2.5 font-bold text-sm">%</span>
                  <input
                    type="number"
                    value={watchValues.margin === 0 ? '' : watchValues.margin}
                    onChange={(e) => setValue('margin', parseFloat(e.target.value) || 0)}
                    className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 99%</p>
            </div>
          )}

          {/* Selling Price (Cost & Revenue) */}
          {watchValues.mode === 'cost-revenue' && (
            <div>
              <label htmlFor="selling-price" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Selling Price (₹)
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  id="selling-price"
                  type="range"
                  min="1"
                  max="100000"
                  value={watchValues.sellingPrice || 0}
                  onChange={(e) => setValue('sellingPrice', parseFloat(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600 transition-all"
                />
                <div className="w-full md:w-auto relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={watchValues.sellingPrice === 0 ? '' : watchValues.sellingPrice}
                    onChange={(e) => setValue('sellingPrice', parseFloat(e.target.value) || 0)}
                    className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹1 - ₹100,000</p>
            </div>
          )}

          {/* GST Rate (GST Impact) */}
          {watchValues.mode === 'gst-impact' && (
            <div>
              <label htmlFor="gst-rate" className="block text-sm font-medium mb-2">
                GST Rate (%)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[0, 5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setValue('gstRate', rate)}
                    aria-pressed={watchValues.gstRate === rate}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                      watchValues.gstRate === rate
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Units Per Year (for projection) */}
          <div>
            <label htmlFor="units-per-year" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Units Per Year
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="units-per-year"
                type="range"
                min="10"
                max="100000"
                value={watchValues.unitsPerYear || 1000}
                onChange={(e) => setValue('unitsPerYear', parseFloat(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-rose-300 to-rose-600 rounded-lg appearance-none cursor-pointer accent-rose-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <input
                  type="number"
                  value={watchValues.unitsPerYear === 0 ? '' : watchValues.unitsPerYear}
                  onChange={(e) => setValue('unitsPerYear', parseFloat(e.target.value) || 0)}
                  className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="1000"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10 - 100,000</p>
          </div>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={() => {
              setValue('costPrice', 100);
              setValue('markup', 30);
              setValue('margin', 0);
              setValue('sellingPrice', 0);
              setValue('unitsPerYear', 1000);
              setValue('gstRate', 18);
            }}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div id="results-section" className="card space-y-6">
            <h2 className="text-lg font-semibold">Results & Analysis</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Cost Price</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{results.costPrice.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Selling Price</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{results.sellingPrice.toFixed(2)}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Profit per Unit</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{results.profit.toFixed(2)}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Markup</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{results.markup.toFixed(2)}%</p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{results.margin.toFixed(2)}%</p>
              </div>

              {watchValues.mode === 'gst-impact' && results.gstAmount !== undefined && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">GST Amount</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{results.gstAmount.toFixed(2)}</p>
                </div>
              )}

              {watchValues.mode === 'gst-impact' && results.finalPrice !== undefined && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Final Price (with GST)</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{results.finalPrice.toFixed(2)}</p>
                </div>
              )}

              {watchValues.mode === 'gst-impact' && results.profitAfterGst !== undefined && (
                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Profit After GST</p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">₹{results.profitAfterGst.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Profit Breakdown Chart */}
            {!['gst-impact'].includes(watchValues.mode) && (
              <div>
                <h3 className="text-md font-semibold mb-4">Profit Breakdown</h3>
                <MemoizedPieChart
                  data={[
                    { name: 'Cost', value: results.costPrice },
                    { name: 'Profit', value: results.profit },
                  ]}
                  colors={['#3b82f6', '#10b981']}
                />
              </div>
            )}

            {/* GST Impact Table */}
            {watchValues.mode === 'gst-impact' && gstScenarios.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-4">GST Rate Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">GST Rate</th>
                        <th className="px-4 py-2 text-right">Selling Price</th>
                        <th className="px-4 py-2 text-right">GST Amount</th>
                        <th className="px-4 py-2 text-right">Total with GST</th>
                        <th className="px-4 py-2 text-right">Profit After GST</th>
                        <th className="px-4 py-2 text-right">Margin %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gstScenarios.map((scenario) => (
                        <tr key={scenario.gstRate} className="border-b dark:border-gray-700">
                          <td className="px-4 py-2">{scenario.gstRate}%</td>
                          <td className="px-4 py-2 text-right">₹{scenario.sellingPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">₹{scenario.gstAmount.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">₹{scenario.totalWithGst.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">₹{scenario.profitAfterGst.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">{scenario.profitMarginAfterGst.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Yearly Projection Chart */}
            {yearlyProjection.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-4">5-Year Profit Projection</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearlyProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" strokeWidth={2} />
                    <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Total Cost" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" name="Total Profit" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Export Button */}
            <ExportButton
              fileName="profit-margin-calculator"
              calculatorName="Profit Margin & Markup Calculator"
              resultElementId="results-section"
              inputsData={inputsData}
            />
          </div>
        )}

        {/* Related Calculators */}
        <RelatedCalculators
          calculators={[
            { title: 'GST Calculator', description: 'Calculate GST at 5%, 12%, 18%, or 28% rates', icon: '🧮', href: '/gst-calculator' },
            { title: 'Percentage Calculator', description: '6 calculation modes: Hike/Discount, X% of Y, What %', icon: '📈', href: '/percentage-calculator' },
            { title: 'Simple Interest Calculator', description: 'Calculate SI with Years, Months, or Days precision', icon: '📊', href: '/simple-interest-calculator' },
            { title: 'EMI Calculator', description: 'Calculate loan EMI, total interest, and amortization schedule', icon: '🏦', href: '/emi-calculator' },
          ]}
        />

        {/* Affiliate Banner */}
        <AffiliateBanner
          icon="📱"
          headline="Need GST Billing Software?"
          subtext="Manage GST invoices, track sales tax, and automate billing"
          note="Integrated with profit margin calculations for accurate financial reporting"
          links={[
            { label: 'Try Billin (Free)', href: 'https://billin.in' },
            { label: 'Zoho Invoice', href: 'https://www.zoho.com/invoice/' },
          ]}
          gradient="from-purple-600 to-pink-600"
        />

        {/* FAQ Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

          <details className="card group cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              What is the difference between markup and margin?
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              <strong>Markup</strong> is the percentage added to cost price to get selling price: (Profit / Cost Price) × 100.
              <strong>Margin</strong> is the percentage of profit relative to selling price: (Profit / Selling Price) × 100.
              For example, ₹100 cost with ₹30 profit = 30% markup OR 23% margin (30/130 × 100).
            </p>
          </details>

          <details className="card group cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              How does GST affect profit margins?
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              GST is typically added to the selling price (passed to customer), but may be credited if you're registered for GST. If you absorb GST, it reduces profit margins. For example, ₹100 selling price with 18% GST adds ₹18 cost to you if not credited, reducing margin from 30% to 26%.
            </p>
          </details>

          <details className="card group cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              Why is a 50% markup not the same as 50% margin?
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Markup is calculated on cost, margin on selling price. Since selling price is higher than cost, the same profit becomes a smaller percentage. A 50% markup yields ~33% margin (50 / (100 + 50) × 100).
            </p>
          </details>

          <details className="card group cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              What is a healthy profit margin for retail?
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Healthy margins vary by industry: Electronics 5-15%, Clothing 25-50%, Food 15-25%, Software 70-90%. Online retail typically targets 20-40% margins after accounting for operating costs. Gross margin (before expenses) should be 2-3x your operating cost ratio for profitability.
            </p>
          </details>

          <details className="card group cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              How do I calculate break-even price if I know my margin target?
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Use the Margin → Markup mode: If you want 30% margin, this calculator converts it to the required 42.9% markup, meaning selling price = cost × 1.429. For ₹100 cost, you need to sell at ₹142.90 to achieve 30% margin.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
