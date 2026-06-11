'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculatePercentage } from '@/lib/calculators/percentage';
import { PercentageSchema } from '@/lib/validators';
import { formatNumber } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { getInternalLinks } from '@/config/internal-links.config';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, Target, BarChart2, RefreshCw, Search, Hash, ShoppingBag, HelpCircle } from 'lucide-react';

type CalculationType = 'hike-discount' | 'percent-of' | 'what-percent' | 'percent-change' | 'reverse-percent' | 'sequential';

type PercentageFormData = {
  valueA: number;
  valueB: number;
  percentC: number;
  hikeDirection: 'hike' | 'discount';
  calculationType: CalculationType;
};

interface PercentageResultData {
  result: number;
  description: string;
  direction?: 'increase' | 'decrease' | 'unchanged';
  breakdown?: { label: string; value: number }[];
}

const TRACKS: Array<{
  id: CalculationType;
  icon: LucideIcon;
  name: string;
  desc: string;
  example: string;
}> = [
  {
    id: 'hike-discount',
    icon: TrendingUp,
    name: 'Hike / Discount',
    desc: 'Apply % increase or decrease',
    example: '₹50K + 12% hike = ₹56K',
  },
  {
    id: 'percent-of',
    icon: Target,
    name: 'X% of Y',
    desc: 'Find value from a percentage',
    example: '20% of 500 = 100',
  },
  {
    id: 'what-percent',
    icon: BarChart2,
    name: 'What % of',
    desc: 'A is what percent of B',
    example: '450 of 600 = 75%',
  },
  {
    id: 'percent-change',
    icon: RefreshCw,
    name: '% Change',
    desc: 'Percentage change from A to B',
    example: '1,20,000 → 1,44,200 = +20.17%',
  },
  {
    id: 'reverse-percent',
    icon: Search,
    name: 'Reverse %',
    desc: 'X is Y% of what total?',
    example: '₹9K is 18% → base = ₹50K',
  },
  {
    id: 'sequential',
    icon: Hash,
    name: 'Sequential',
    desc: 'Apply two % steps in sequence',
    example: '₹10K + 10% + 4% = ₹11,440',
  },
];

const PIE_COLORS: Record<string, string[]> = {
  'hike-discount': ['#3b82f6', '#10b981'],
  'percent-of': ['#3b82f6', '#e5e7eb'],
  'reverse-percent': ['#3b82f6', '#a78bfa'],
};

export default function PercentageCalculatorPage() {
  const [result, setResult] = useState<PercentageResultData | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const { watch, setValue, reset } = useForm<PercentageFormData>({
    resolver: zodResolver(PercentageSchema),
    defaultValues: {
      valueA: 20,
      valueB: 500,
      percentC: 4,
      hikeDirection: 'hike',
      calculationType: 'percent-of',
    },
  });

  const watchValues = watch();
  const { calculationType, hikeDirection, valueA, valueB, percentC } = watchValues;

  const getLabels = (): { a: string; b: string; c?: string } => {
    switch (calculationType) {
      case 'hike-discount': return { a: 'Original Value', b: 'Change %' };
      case 'percent-of':    return { a: 'Percentage (%)', b: 'Base Value' };
      case 'what-percent':  return { a: 'Obtained Value', b: 'Total Value' };
      case 'percent-change':return { a: 'Initial Value',  b: 'Final Value' };
      case 'reverse-percent':return { a: 'Given Value',   b: 'Percentage (%)' };
      case 'sequential':    return { a: 'Base Value',     b: 'First %', c: 'Second %' };
    }
  };

  const getSentence = (): string => {
    const a = valueA ?? '__';
    const b = valueB ?? '__';
    const c = percentC ?? '__';
    switch (calculationType) {
      case 'hike-discount':
        return hikeDirection === 'hike'
          ? `Apply a ${b}% hike on ${a}`
          : `Apply a ${b}% discount on ${a}`;
      case 'percent-of':    return `What is ${a}% of ${b}?`;
      case 'what-percent':  return `${a} is what % of ${b}?`;
      case 'percent-change':return `% change from ${a} to ${b}?`;
      case 'reverse-percent':return `${a} is ${b}% of what total?`;
      case 'sequential':    return `${a} → apply ${b}%, then ${c}%`;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setCalcError(null);
        const res = calculatePercentage({
          valueA: valueA ?? 0,
          valueB: valueB ?? 0,
          percentC: percentC ?? 0,
          hikeDirection: hikeDirection ?? 'hike',
          calculationType,
        });
        setResult(res);
      } catch (e) {
        setCalcError(e instanceof Error ? e.message : 'Calculation error');
        setResult(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [watchValues]);

  const labels = getLabels();


  const isResultPercent = ['what-percent', 'percent-change'].includes(calculationType);
  const showPie = result?.breakdown && result.breakdown.length >= 2 && ['hike-discount', 'percent-of', 'reverse-percent'].includes(calculationType);
  const pieColors = PIE_COLORS[calculationType] ?? ['#3b82f6', '#10b981'];

  const handleReset = () => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  // Quick-start scenarios
  const percentageScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Salary Hike (10%)',
      description: '₹50,000 → 10% increase',
      icon: TrendingUp,
      values: { value: 50000, percentage: 10, calculationType: 'hike-discount' }
    },
    {
      label: 'Shopping Discount (20%)',
      description: '₹5,000 item → 20% off',
      icon: ShoppingBag,
      values: { value: 5000, percentage: 20, calculationType: 'hike-discount' }
    },
    {
      label: 'What Percentage (5% of 1000)',
      description: 'Find 5% of ₹1,000',
      icon: HelpCircle,
      values: { value: 1000, percentage: 5, calculationType: 'percent-of' }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as any, value as any, { shouldValidate: true });
    });
  }, [setValue]);

  const switchTrack = (id: CalculationType) => {
    setValue('calculationType', id);
    setResult(null);
    setCalcError(null);
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient inline-flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-200 dark:ring-violet-800/40 flex-shrink-0">
            <CalculatorIcon idOrHref="percentage" className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </span>
          <span>Percentage Calculator</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          6 calculation modes — salary hike, discounts, GST reverse, sequential compounding &amp; more
        </p>
      </div>

      {/* Track Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => switchTrack(track.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all hover:scale-105 active:scale-95 ${
              calculationType === track.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-300 dark:ring-blue-700'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="mb-1">{(() => { const Icon = track.icon; return <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />; })()}</div>
            <div className="font-bold text-xs text-gray-900 dark:text-white leading-tight">{track.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{track.desc}</div>
          </button>
        ))}
      </div>

      {/* Dynamic Sentence Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700 text-center">
        <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">{getSentence()}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div id="percentage-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {(() => { const track = TRACKS.find(t => t.id === calculationType); if (!track) return null; const Icon = track.icon; return <Icon className="w-6 h-6 flex-shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />; })()}
            {TRACKS.find(t => t.id === calculationType)?.name}
          </h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={percentageScenarios}
            onSelectScenario={handleSelectScenario}
          />

          <div className="space-y-5">
            {/* Hike / Discount toggle */}
            {calculationType === 'hike-discount' && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setValue('hikeDirection', 'hike')}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold border-2 transition-all ${
                    hikeDirection === 'hike'
                      ? 'bg-green-500 border-green-500 text-white shadow-md'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-400'
                  }`}
                >
                  📈 Hike (Increase)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('hikeDirection', 'discount')}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold border-2 transition-all ${
                    hikeDirection === 'discount'
                      ? 'bg-red-500 border-red-500 text-white shadow-md'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-400'
                  }`}
                >
                  📉 Discount (Decrease)
                </button>
              </div>
            )}

            {/* Value A */}
            <div className="space-y-2">
              <label htmlFor="percentage-value-a" className="block text-sm font-bold text-gray-900 dark:text-white">{labels.a}</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="0"
                  max={['percent-of', 'reverse-percent'].includes(calculationType) ? '100' : '1000000'}
                  step={['percent-of', 'reverse-percent'].includes(calculationType) ? '1' : '1000'}
                  value={String(valueA ?? 0)}
                  onChange={(e) => setValue('valueA', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  id="percentage-value-a"
                  type="number"
                  placeholder="0"
                  value={valueA === 0 ? '' : valueA}
                  onChange={(e) => setValue('valueA', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full md:w-32 px-3 py-3 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                />
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {['percent-of', 'reverse-percent'].includes(calculationType) ?
                  [10, 25, 50, 100].map(val => (
                    <button key={val} type="button" onClick={() => setValue('valueA', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                                 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                                 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      {val}%
                    </button>
                  )) :
                  [100, 500, 1000, 5000].map(val => (
                    <button key={val} type="button" onClick={() => setValue('valueA', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                                 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                                 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      ₹{val}
                    </button>
                  ))
                }
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Enter the {calculationType === 'percent-of' || calculationType === 'reverse-percent' ? 'percentage value' : 'base or starting amount'} for your calculation</p>
            </div>

            {/* Value B */}
            <div className="space-y-2">
              <label htmlFor="percentage-value-b" className="block text-sm font-bold text-gray-900 dark:text-white">{labels.b}</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="0"
                  max={['hike-discount', 'what-percent', 'sequential', 'reverse-percent'].includes(calculationType) ? '200' : '1000000'}
                  step={['hike-discount', 'what-percent', 'sequential', 'reverse-percent'].includes(calculationType) ? '0.5' : '1000'}
                  value={String(valueB ?? 0)}
                  onChange={(e) => setValue('valueB', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  id="percentage-value-b"
                  type="number"
                  placeholder="0"
                  value={valueB === 0 ? '' : valueB}
                  onChange={(e) => setValue('valueB', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full md:w-32 px-3 py-3 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                />
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {['hike-discount', 'what-percent', 'sequential', 'reverse-percent'].includes(calculationType) ?
                  [5, 10, 20, 50].map(val => (
                    <button key={val} type="button" onClick={() => setValue('valueB', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                                 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                                 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                      {val}%
                    </button>
                  )) :
                  [1000, 5000, 10000, 50000].map(val => (
                    <button key={val} type="button" onClick={() => setValue('valueB', val)}
                      className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                                 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                                 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                      ₹{val >= 1000 ? `${val / 1000}K` : val}
                    </button>
                  ))
                }
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 {calculationType === 'percent-of' ? 'Total or base amount' : calculationType === 'what-percent' ? 'Total amount to compare against' : calculationType === 'percent-change' ? 'Final amount after change' : calculationType === 'hike-discount' ? 'Percentage to apply' : 'Percentage value (0-200%)'}</p>
            </div>

            {/* Percent C — only for Sequential */}
            {calculationType === 'sequential' && (
              <div className="space-y-2">
                <label htmlFor="percentage-value-c" className="block text-sm font-bold text-gray-900 dark:text-white">{labels.c ?? 'Second %'}</label>
                <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="0.5"
                    value={String(percentC ?? 0)}
                    onChange={(e) => setValue('percentC', Number(e.target.value))}
                    className="flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <input
                    id="percentage-value-c"
                    type="number"
                    placeholder="0"
                    value={percentC === 0 ? '' : percentC}
                    onChange={(e) => setValue('percentC', e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full md:w-32 px-3 py-3 border-2 border-purple-400 rounded-lg font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Second percentage in sequence. Applied after the first percentage change</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              🗑️ Clear All
            </button>

            {/* Formula Reference */}
            <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3">📐 Quick Formulas</h4>
              <div className="space-y-2 text-xs text-indigo-800 dark:text-indigo-200">
                <p><strong>X% of Y:</strong> (X ÷ 100) × Y</p>
                <p><strong>What %:</strong> (Part ÷ Whole) × 100</p>
                <p><strong>% Change:</strong> ((New - Old) ÷ Old) × 100</p>
                <p><strong>Reverse %:</strong> Final ÷ (1 ± %) × 100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {calcError ? (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-4xl mb-3">⚠️</p>
                <p className="text-red-500 font-semibold">{calcError}</p>
              </div>
            </div>
          ) : result ? (
            <div id="percentage-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-4">Result</h2>

              {/* Main result */}
              <div className={`p-5 rounded-xl border-2 ${
                calculationType === 'percent-change' && result.direction === 'decrease'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  : calculationType === 'percent-change' && result.direction === 'increase'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
              }`}>
                <p className="text-xs uppercase tracking-wide font-semibold mb-2 text-gray-500">Result</p>
                <div className="flex items-center gap-3">
                  {calculationType === 'percent-change' && (
                    <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                      result.direction === 'increase' ? 'text-green-500' :
                      result.direction === 'decrease' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {result.direction === 'increase' ? '↑' : result.direction === 'decrease' ? '↓' : '→'}
                    </span>
                  )}
                  <p className={`text-2xl sm:text-4xl md:text-5xl font-bold break-words overflow-hidden ${
                    calculationType === 'percent-change' && result.direction === 'decrease'
                      ? 'text-red-600 dark:text-red-400'
                      : calculationType === 'percent-change' && result.direction === 'increase'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-blue-700 dark:text-blue-400'
                  }`}>
                    {isResultPercent
                      ? `${formatNumber(result.result, 2)}%`
                      : formatNumber(result.result, 2)
                    }
                  </p>
                </div>
                {calculationType === 'percent-change' && result.direction && (
                  <p className={`text-sm font-bold mt-2 ${
                    result.direction === 'increase' ? 'text-green-600 dark:text-green-400' :
                    result.direction === 'decrease' ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                  }`}>
                    {result.direction === 'increase' ? '▲ Increased by' :
                     result.direction === 'decrease' ? '▼ Decreased by' : 'No change —'}{' '}
                    {formatNumber(result.result, 2)}%
                  </p>
                )}
              </div>

              {/* Explanation */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                <p className="text-xs uppercase tracking-wide font-semibold mb-1 text-purple-500">Explanation</p>
                <p className="text-purple-800 dark:text-purple-300 font-medium">{result.description}</p>
              </div>

              {/* Breakdown rows */}
              {result.breakdown && result.breakdown.length > 0 && (
                <div className="space-y-1">
                  {result.breakdown.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 px-3 rounded-lg odd:bg-gray-50 dark:odd:bg-gray-800/50"
                    >
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{item.label}</span>
                      <span className={`font-bold ${item.label === 'Total Change' && item.value < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {item.label === 'Total Change' && item.value >= 0 ? '+' : ''}{formatNumber(item.value, 2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Understanding Percentages */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">📚 Understanding the Calculation</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  {calculationType === 'percent-change' && 'Percentage change shows how much a value has increased or decreased relative to the original value.'}
                  {calculationType === 'percent-of' && 'This calculates what amount represents the given percentage of the total value.'}
                  {calculationType === 'what-percent' && 'This finds what percentage one value is compared to another value.'}
                  {calculationType === 'reverse-percent' && 'This calculates the original value before a percentage was applied.'}
                  {calculationType === 'sequential' && 'This applies multiple percentage changes in sequence to see cumulative effects.'}
                  {calculationType === 'hike-discount' && 'This applies a percentage increase (hike) or decrease (discount) to a value.'}
                </p>
              </div>

              {/* Key Insights */}
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-300 dark:border-green-700">
                <h3 className="font-bold text-green-900 dark:text-green-300 mb-3">✨ Quick Tips</h3>
                <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  {calculationType === 'percent-change' && (
                    <>
                      <p>💡 Positive % = Value increased | Negative % = Value decreased</p>
                      <p>💡 Larger the percentage, bigger the change relative to original</p>
                    </>
                  )}
                  {calculationType === 'percent-of' && (
                    <>
                      <p>💡 Formula: (X% × Y) / 100 = Result</p>
                      <p>💡 Useful for discounts, commissions, and portions</p>
                    </>
                  )}
                  {calculationType === 'what-percent' && (
                    <>
                      <p>💡 Formula: (Part / Whole) × 100 = Percentage</p>
                      <p>💡 Always compare same units (both in rupees, same timeframe, etc.)</p>
                    </>
                  )}
                  {calculationType === 'reverse-percent' && (
                    <>
                      <p>💡 Useful when you know the final value after percentage change</p>
                      <p>💡 Common in reverse calculating original price before discount</p>
                    </>
                  )}
                  {calculationType === 'sequential' && (
                    <>
                      <p>💡 Changes compound — second % applies to result of first %</p>
                      <p>💡 Order doesn't always matter: 10% then 20% = 20% then 10%</p>
                    </>
                  )}
                  {calculationType === 'hike-discount' && (
                    <>
                      <p>💡 Hike = Value increases | Discount = Value decreases</p>
                      <p>💡 Formula: New Value = Original × (1 ± Percentage/100)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <ShareButtons
                  inputs={[
                    { label: labels.a, value: formatNumber(valueA ?? 0, 2) },
                    { label: labels.b, value: formatNumber(valueB ?? 0, 2) },
                    ...(calculationType === 'sequential' ? [{ label: labels.c ?? 'Second %', value: formatNumber(percentC ?? 0, 2) }] : []),
                    { label: 'Type', value: TRACKS.find(t => t.id === calculationType)?.name ?? calculationType }
                  ]}
                  outputs={[
                    { label: 'Result', value: isResultPercent ? `${formatNumber(result.result, 2)}%` : formatNumber(result.result, 2) }
                  ]}
                  calculatorName="Percentage Calculator"
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <p className="text-gray-500 dark:text-gray-400">Enter values to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart — Tracks 1, 2, 5 */}
      {showPie && result?.breakdown && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📊 Percentage Breakup</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <MemoizedPieChart
              data={result.breakdown.slice(0, 2).map(item => ({ name: item.label, value: item.value }))}
              colors={pieColors}
              height={300}
            />
            <div className="space-y-3 text-sm">
              {result.breakdown.slice(0, 2).map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg border"
                  style={{ borderColor: (pieColors[i] ?? '#94a3b8') + '60', backgroundColor: (pieColors[i] ?? '#94a3b8') + '15' }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i] ?? '#94a3b8' }} />
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNumber(item.value, 2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-t-2 border-gray-300 dark:border-gray-600">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  {formatNumber(result.breakdown.slice(0, 2).reduce((s, d) => s + d.value, 0), 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sequential Steps Visual — Track 6 */}
      {result && calculationType === 'sequential' && result.breakdown && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">🔢 Sequential Steps</h2>
          <div className="flex flex-wrap items-center gap-4">
            {result.breakdown.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-xs font-semibold mb-2 ${i === 0 ? 'text-blue-500' : i === 1 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {item.label}
                  </div>
                  <div className={`text-2xl font-bold px-5 py-4 rounded-xl ${
                    i === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                    i === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  }`}>
                    {formatNumber(item.value, 2)}
                  </div>
                </div>
                {i < 2 && <span className="text-gray-400 text-2xl font-bold">→</span>}
              </div>
            ))}
            {result.breakdown[3] && (
              <div className="ml-auto text-right">
                <div className="text-xs font-semibold text-gray-500 mb-2">Total Change</div>
                <div className={`text-xl font-bold px-4 py-3 rounded-xl ${
                  result.breakdown[3].value >= 0
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700'
                }`}>
                  {result.breakdown[3].value >= 0 ? '+' : ''}{formatNumber(result.breakdown[3].value, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Examples */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Quick Examples</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRACKS.map((track) => {
            const TrackIcon = track.icon;
            return (
              <button
                key={track.id}
                onClick={() => switchTrack(track.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md hover:scale-102 ${
                  calculationType === track.id
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="mb-2"><TrackIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /></div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">{track.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{track.desc}</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{track.example}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('percentage-calculator')} />

      {/* Featured Snippet Sections for SEO */}
      {/* Definition Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">What is a Percentage?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          A percentage is a fraction or ratio expressed as a number out of 100, denoted by the symbol <strong>%</strong>. It represents how much of one quantity relates to another, expressed per hundred. For example, 50% means 50 out of 100 or half. The basic formula for calculating percentage is: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Percentage = (Part / Whole) × 100</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Percentages are widely used in everyday life for discounts, salary hikes, tax calculations, test scores, profit margins, and many other applications. Understanding percentages is essential for financial decisions, comparing values, and analyzing data.
        </p>
      </div>

      {/* Table Snippet - Percentage Use Cases */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Common Percentage Calculations and Use Cases</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Calculation Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Formula</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-white">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">X% of Y</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">(X/100) × Y</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">20% of ₹1000 = ₹200</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Percentage Hike/Discount</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">New = Original × (1 ± %/100)</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">₹500 with 10% hike = ₹550</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">What % is A of B</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">(A/B) × 100</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">₹250 is 25% of ₹1000</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Percentage Change</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">((New - Old) / Old) × 100</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">₹100 to ₹150 = 50% increase</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Reverse Percentage</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">Base = Part × 100 / %</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">₹180 is 18% of base = ₹1000</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 bg-white dark:bg-gray-800/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Sequential %</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-sm">Apply % one after another</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">₹100 + 10% then + 5% = ₹115.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* How-to List Snippet */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">How to Calculate Percentage Change (Increase or Decrease)?</h2>
        <ol className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">1.</span>
            <div>
              <strong>Identify the Initial and Final Values:</strong> Determine the original value (starting point) and the new value (ending point). For example, if a stock price was ₹100 and is now ₹120, the initial value is ₹100 and final value is ₹120.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">2.</span>
            <div>
              <strong>Calculate the Difference:</strong> Subtract the initial value from the final value: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">Difference = Final - Initial</span>. Using the example: ₹120 - ₹100 = ₹20.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">3.</span>
            <div>
              <strong>Divide by the Initial Value:</strong> Divide the difference by the initial value. This normalizes the change: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">Rate of Change = Difference / Initial</span>. Using the example: ₹20 / ₹100 = 0.2.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">4.</span>
            <div>
              <strong>Multiply by 100:</strong> Convert the decimal to a percentage by multiplying by 100: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">Percentage Change = Rate × 100</span>. Using the example: 0.2 × 100 = 20%.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">5.</span>
            <div>
              <strong>Interpret the Result:</strong> A positive percentage indicates an increase, while a negative percentage indicates a decrease. In our example, a 20% increase means the stock price increased by 20% from its original value.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-lg">6.</span>
            <div>
              <strong>Use the Complete Formula:</strong> The complete percentage change formula is: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">% Change = ((Final - Initial) / Initial) × 100</span>
            </div>
          </li>
        </ol>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Example:</strong> If your salary increased from ₹30,000 to ₹36,000: % Change = ((36,000 - 30,000) / 30,000) × 100 = (6,000 / 30,000) × 100 = 20% salary increase.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-1">
          {[
            {
              q: 'How to calculate salary hike percentage?',
              a: 'Use Track 1 (Hike/Discount): Enter current salary as Original Value and the hike % as Change %. E.g., ₹50,000 with 12% hike = ₹50,000 × 1.12 = ₹56,000.',
            },
            {
              q: 'What is reverse percentage? How to find base price before GST?',
              a: 'Reverse percentage (Track 5) finds the whole when you know a part and its percentage. If ₹9,000 is 18% GST, base price = ₹9,000 × 100 ÷ 18 = ₹50,000.',
            },
            {
              q: 'How does sequential compounding differ from simple addition?',
              a: 'Sequential (Track 6) applies each % on the running total. ₹10,000 with 10% then 4%: ₹10,000 × 1.10 = ₹11,000, then × 1.04 = ₹11,440. Adding 14% directly gives only ₹11,400 — a ₹40 difference.',
            },
            {
              q: 'How to calculate percentage change (increase or decrease)?',
              a: 'Track 4: % Change = ((Final − Initial) ÷ Initial) × 100. A positive result shows an increase (shown in green ↑). A negative result shows a decrease (shown in red ↓).',
            },
            {
              q: 'What is "A is what % of B"?',
              a: 'Track 3 (Fraction Converter): Calculates what fraction A is of B, expressed as a percentage. E.g., scored 450 out of 600 marks → (450 ÷ 600) × 100 = 75%.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group border-b border-gray-200 dark:border-gray-700">
              <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
                {q}
                <span className="transition-transform group-open:rotate-180 text-gray-400 ml-4 flex-shrink-0">▼</span>
              </summary>
              <p className="pb-4 text-gray-600 dark:text-gray-400 pr-6">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
