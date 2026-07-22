'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { ComprehensiveTaxSchema } from '@/lib/validators';
import { calculateComprehensiveTax } from '@/lib/tax-engine/calculator';
import { ComprehensiveTaxInput, ComprehensiveTaxResult } from '@/lib/tax-engine/types';
import { formatCurrency } from '@/lib/utils/format';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { RelatedBlogPosts } from '@/components/ui/RelatedBlogPosts';
import { getRelatedBlogPosts } from '@/lib/blog/utils';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { UserRound, IndianRupee, Home, BarChart2, Trash2, BookOpen, Lightbulb, TrendingUp, Search, HelpCircle, Clock, Coins, CheckCircle2, PieChart, Sparkles, ChevronRight } from 'lucide-react';
import { getInternalLinks } from '@/config/internal-links.config';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

type FormData = {
  age: 'below60' | 'between60to80' | 'above80';
  residentialStatus: 'resident' | 'nri';
  employerType: 'government' | 'private';
  grossSalary: number;
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  cityType: 'metro' | 'non-metro';
  lta: number;
  epfEmployee: number;
  incomeHouseProperty: number;
  incomeOtherSources: number;
  epf: number;
  ppf: number;
  elss: number;
  lifeInsurance: number;
  homeRepayment: number;
  ssy: number;
  nsc: number;
  taxSaverFD: number;
  tuitionFees: number;
  npsAdditional: number;
  npsEmployerContribution: number;
  healthInsuranceSelf: number;
  healthInsuranceParents: number;
  parentsAge: 'below60' | 'above60';
  educationLoanInterest: number;
  donations100: number;
  donations50: number;
  savingsInterest: number;
  homeLoanInterest: number;
  regime: 'old' | 'new' | 'auto';
};

const DEFAULT_TAX_VALUES: FormData = {
  age: 'below60',
  residentialStatus: 'resident',
  employerType: 'private',
  grossSalary: 500000,
  basicSalary: 300000,
  hraReceived: 100000,
  rentPaid: 60000,
  cityType: 'non-metro',
  lta: 25000,
  epfEmployee: 50000,
  incomeHouseProperty: 0,
  incomeOtherSources: 0,
  epf: 50000,
  ppf: 50000,
  elss: 0,
  lifeInsurance: 0,
  homeRepayment: 0,
  ssy: 0,
  nsc: 0,
  taxSaverFD: 0,
  tuitionFees: 0,
  npsAdditional: 0,
  npsEmployerContribution: 0,
  healthInsuranceSelf: 15000,
  healthInsuranceParents: 0,
  parentsAge: 'below60',
  educationLoanInterest: 0,
  donations100: 0,
  donations50: 0,
  savingsInterest: 0,
  homeLoanInterest: 0,
  regime: 'auto',
};

function buildTaxInput(data: FormData): ComprehensiveTaxInput {
  return {
    profile: {
      age: data.age,
      residentialStatus: data.residentialStatus,
      employerType: data.employerType,
    },
    salary: {
      grossSalary: data.grossSalary,
      basicSalary: data.basicSalary,
      hraReceived: data.hraReceived,
      rentPaid: data.rentPaid,
      cityType: data.cityType,
      lta: data.lta,
      epfEmployee: data.epfEmployee,
      incomeHouseProperty: data.incomeHouseProperty,
      incomeOtherSources: data.incomeOtherSources,
      npsEmployerContribution: data.npsEmployerContribution,
    },
    deductions: {
      epf: data.epf,
      ppf: data.ppf,
      elss: data.elss,
      lifeInsurance: data.lifeInsurance,
      homeRepayment: data.homeRepayment,
      ssy: data.ssy,
      nsc: data.nsc,
      taxSaverFD: data.taxSaverFD,
      tuitionFees: data.tuitionFees,
      npsAdditional: data.npsAdditional,
      healthInsuranceSelf: data.healthInsuranceSelf,
      healthInsuranceParents: data.healthInsuranceParents,
      parentsAge: data.parentsAge,
      educationLoanInterest: data.educationLoanInterest,
      donations100: data.donations100,
      donations50: data.donations50,
      savingsInterest: data.savingsInterest,
      homeLoanInterest: data.homeLoanInterest,
    },
    regime: data.regime,
  };
}

const INITIAL_TAX_RESULT = (() => {
  try { return calculateComprehensiveTax(buildTaxInput(DEFAULT_TAX_VALUES)); } catch { return null; }
})();

// Single blue accent for every slider (design-system: one accent per page).
// Keys retained so call sites need no change; all resolve to the blue treatment.
const BLUE_SLIDER = {
  track: 'bg-gradient-to-r from-blue-300 to-blue-600 accent-blue-600',
  input: 'border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700',
} as const;

const SLIDER_COLORS = {
  blue: BLUE_SLIDER,
  orange: BLUE_SLIDER,
  purple: BLUE_SLIDER,
  green: BLUE_SLIDER,
  red: BLUE_SLIDER,
  amber: BLUE_SLIDER,
  cyan: BLUE_SLIDER,
} as const;

const SliderField = memo(({
  id,
  label,
  value,
  min,
  max,
  step,
  color,
  helper,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: keyof typeof SLIDER_COLORS;
  helper?: string;
  onChange: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  const c = SLIDER_COLORS[color];
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <RangeSlider
          min={String(min)}
          max={String(max)}
          step={String(step)}
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`flex-1 h-3 ${c.track} rounded-lg appearance-none cursor-pointer`}
        />
        <input
          id={id}
          type="number"
          min={min}
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          onBlur={onBlur}
          className={`w-full md:w-28 px-2 py-1.5 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 ${c.input} rounded-lg font-bold text-sm`}
          placeholder="0"
        />
      </div>
      {helper && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</p>}
    </div>
  );
});

SliderField.displayName = 'SliderField';

function PillGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="grid gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            value === opt.value
              ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function TaxCalculator() {
  const [result, setResult] = useState<ComprehensiveTaxResult | null>(INITIAL_TAX_RESULT);

  const { register, watch, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(ComprehensiveTaxSchema),
    defaultValues: DEFAULT_TAX_VALUES,
  });

  const watchValues = watch();

  const haptic = useHapticFeedback();

  const calculateResults = useCallback((data: FormData) => {
    try {
      setResult(calculateComprehensiveTax(buildTaxInput(data)));
    } catch (error) {
      console.error('Tax calculation error:', error);
    }
  }, []);

  const handleInputChange = useCallback((fieldName: keyof FormData, value: number | string) => {
    setValue(fieldName, value as never, { shouldValidate: true });
  }, [setValue]);

  const handleReset = useCallback(() => {
    haptic.trigger('warning');
    reset();
    setResult(null);
  }, [reset, haptic]);

  const getRegimeResult = () => {
    if (!result) return null;
    return result.recommended === 'new' ? result.newRegime : result.oldRegime;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.grossSalary > 0) {
        calculateResults(watchValues);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [watchValues, calculateResults]);

  const showOldRegimeFields = watchValues.regime !== 'new';

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0">
            <CalculatorIcon idOrHref="tax" className="w-6 h-6 text-white" />
          </span>
          <span>Income Tax Calculator</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">FY 2025-26 | AY 2026-27 | Old & New Regime</p>
      </div>

      <ConfidenceBadge calculatorType="tax" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div id="tax-inputs" className="space-y-3 min-w-0">
          {/* Profile & Regime */}
          <div className="card">
            <h2 className="text-base font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <UserRound className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Profile &amp; Regime
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tax Regime</label>
                <PillGroup
                  ariaLabel="Tax Regime"
                  options={[
                    { value: 'new' as const, label: 'New' },
                    { value: 'old' as const, label: 'Old' },
                    { value: 'auto' as const, label: 'Auto (Best)' },
                  ]}
                  value={watchValues.regime}
                  onChange={(v) => handleInputChange('regime', v)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Age Group</label>
                <PillGroup
                  ariaLabel="Age Group"
                  options={[
                    { value: 'below60' as const, label: '<60' },
                    { value: 'between60to80' as const, label: '60-80' },
                    { value: 'above80' as const, label: '80+' },
                  ]}
                  value={watchValues.age}
                  onChange={(v) => handleInputChange('age', v)}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {watchValues.regime === 'new'
                ? 'New Regime: ₹75K standard deduction, lower rates, no other deductions'
                : watchValues.regime === 'old'
                ? 'Old Regime: ₹50K standard deduction, all deductions (HRA, 80C, 80D, 24b) allowed'
                : 'Auto: we calculate both regimes and recommend the one with lower tax'}
            </p>
          </div>

          {/* Income */}
          <div className="card">
            <h2 className="text-base font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Income
            </h2>

            <div className="space-y-3">
              <div>
                <SliderField
                  id="gross-salary"
                  label="Gross Salary (₹)"
                  value={watchValues.grossSalary ?? 0}
                  min={100000}
                  max={10000000}
                  step={10000}
                  color="blue"
                  helper="₹1L - ₹1Cr annual"
                  onChange={(v) => handleInputChange('grossSalary', v)}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val < 100000) alert('Gross Salary must be at least ₹1,00,000');
                  }}
                />
                <div className="flex gap-2 flex-wrap mt-2">
                  {[500000, 800000, 1200000, 2000000].map(val => (
                    <button key={val} type="button" onClick={() => handleInputChange('grossSalary', val)}
                      className="text-xs px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700
                                 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                                 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      ₹{val / 100000}L
                    </button>
                  ))}
                </div>
              </div>

              <SliderField
                id="house-property"
                label="Income from House Property (₹)"
                value={watchValues.incomeHouseProperty ?? 0}
                min={0}
                max={5000000}
                step={10000}
                color="orange"
                helper="Net rental income after 30% deduction"
                onChange={(v) => handleInputChange('incomeHouseProperty', v)}
              />

              <SliderField
                id="other-sources"
                label="Income from Other Sources (₹)"
                value={watchValues.incomeOtherSources ?? 0}
                min={0}
                max={5000000}
                step={10000}
                color="purple"
                helper="FD interest, capital gains, etc."
                onChange={(v) => handleInputChange('incomeOtherSources', v)}
              />

              {/* NPS Employer - allowed in both regimes */}
              <div>
                <label htmlFor="nps-employer" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  NPS Employer Contribution - Sec 80CCD(2) <span className="font-normal text-gray-500 dark:text-gray-400">(both regimes)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                  <input
                    id="nps-employer"
                    type="number"
                    min="0"
                    {...register('npsEmployerContribution', { valueAsNumber: true })}
                    className="w-full px-3 py-1.5 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right text-sm dark:bg-gray-700 dark:text-gray-300"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* HRA & Exemptions (Old Regime only) */}
          {showOldRegimeFields && (
            <details className="card cursor-pointer group">
              <summary className="flex justify-between items-center font-bold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                <span className="flex items-center gap-2"><Home className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> HRA &amp; Exemptions <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Old Regime)</span></span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
              </summary>

              <div className="space-y-3 mt-3">
                <SliderField
                  id="basic-salary"
                  label="Basic Salary (₹)"
                  value={watchValues.basicSalary ?? 0}
                  min={0}
                  max={5000000}
                  step={10000}
                  color="green"
                  onChange={(v) => handleInputChange('basicSalary', v)}
                />

                <SliderField
                  id="hra-received"
                  label="HRA Received (₹)"
                  value={watchValues.hraReceived ?? 0}
                  min={0}
                  max={5000000}
                  step={10000}
                  color="red"
                  onChange={(v) => handleInputChange('hraReceived', v)}
                />

                <SliderField
                  id="rent-paid"
                  label="Rent Paid (Annual, ₹)"
                  value={watchValues.rentPaid ?? 0}
                  min={0}
                  max={5000000}
                  step={10000}
                  color="amber"
                  onChange={(v) => handleInputChange('rentPaid', v)}
                />

                <div className="grid sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">City Type</label>
                    <PillGroup
                      ariaLabel="City Type"
                      options={[
                        { value: 'metro' as const, label: 'Metro' },
                        { value: 'non-metro' as const, label: 'Non-Metro' },
                      ]}
                      value={watchValues.cityType}
                      onChange={(v) => handleInputChange('cityType', v)}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Metro: Mumbai, Delhi, Kolkata, Chennai</p>
                  </div>
                  <SliderField
                    id="lta-claimed"
                    label="LTA Claimed (₹)"
                    value={watchValues.lta ?? 0}
                    min={0}
                    max={1000000}
                    step={10000}
                    color="cyan"
                    onChange={(v) => handleInputChange('lta', v)}
                  />
                </div>
              </div>
            </details>
          )}

          {/* Deductions (Old Regime only) */}
          {showOldRegimeFields && (
            <details className="card border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 cursor-pointer group" open>
              <summary className="flex justify-between items-center font-bold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                <span className="flex items-center gap-2"><BarChart2 className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Deductions <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Old Regime)</span></span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
              </summary>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label htmlFor="deduction-80c" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    80C Total (Max ₹1.5L)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                    <input
                      id="deduction-80c"
                      type="number"
                      min="0"
                      max="1500000"
                      {...register('epf', { valueAsNumber: true })}
                      className="w-full px-3 py-1.5 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right text-sm dark:bg-gray-700 dark:text-gray-300"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Incl. EPF ₹{(watchValues.epfEmployee ?? 0).toLocaleString('en-IN')}, PPF, ELSS, LIC</p>
                </div>

                <div>
                  <label htmlFor="deduction-80d-self" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    80D Health Insurance (Self &amp; Family)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                    <input
                      id="deduction-80d-self"
                      type="number"
                      min="0"
                      max="50000"
                      {...register('healthInsuranceSelf', { valueAsNumber: true })}
                      className="w-full px-3 py-1.5 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right text-sm dark:bg-gray-700 dark:text-gray-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="deduction-80d-parents" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    80D Health Insurance (Parents)
                  </label>
                  <div className="relative mb-1.5">
                    <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                    <input
                      id="deduction-80d-parents"
                      type="number"
                      min="0"
                      max="50000"
                      {...register('healthInsuranceParents', { valueAsNumber: true })}
                      className="w-full px-3 py-1.5 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right text-sm dark:bg-gray-700 dark:text-gray-300"
                      placeholder="0"
                    />
                  </div>
                  <PillGroup
                    ariaLabel="Parents Age"
                    options={[
                      { value: 'below60' as const, label: 'Below 60' },
                      { value: 'above60' as const, label: '60+' },
                    ]}
                    value={watchValues.parentsAge}
                    onChange={(v) => handleInputChange('parentsAge', v)}
                  />
                </div>

                <div>
                  <label htmlFor="deduction-24b" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Home Loan Interest - 24(b) (Max ₹2L)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                    <input
                      id="deduction-24b"
                      type="number"
                      min="0"
                      max="200000"
                      {...register('homeLoanInterest', { valueAsNumber: true })}
                      className="w-full px-3 py-1.5 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right text-sm dark:bg-gray-700 dark:text-gray-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="deduction-nps" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    NPS Additional - 80CCD(1B) (Max ₹50K)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                    <input
                      id="deduction-nps"
                      type="number"
                      min="0"
                      max="50000"
                      {...register('npsAdditional', { valueAsNumber: true })}
                      className="w-full px-3 py-1.5 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right text-sm dark:bg-gray-700 dark:text-gray-300"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </details>
          )}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleReset}
            className="btn-ghost w-full flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Clear All
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-3 min-w-0">
          {result ? (
            <>
              {/* Compact Tax Summary */}
              <div id="tax-results" className="card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Tax Summary
                  </h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">FY 2025-26</span>
                </div>

                {/* Old vs New side by side */}
                <div className="grid grid-cols-2 gap-3">
                  {([['new', result.newRegime], ['old', result.oldRegime]] as const).map(([reg, r]) => {
                    const isRecommended = result.recommended === reg;
                    return (
                      <div
                        key={reg}
                        className={`p-3 rounded-xl border-2 min-w-0 ${
                          isRecommended
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                          {reg === 'new' ? 'New Regime' : 'Old Regime'}
                          {isRecommended && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" />}
                        </p>
                        <p className={`text-lg sm:text-2xl font-black whitespace-nowrap ${isRecommended ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {formatCurrency(r.totalTax)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Effective: {r.effectiveRate.toFixed(2)}%</p>
                      </div>
                    );
                  })}
                </div>

                {/* Recommendation */}
                {result.savings > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                      Choose {result.recommended === 'new' ? 'New' : 'Old'} Regime — save {formatCurrency(result.savings)}
                    </p>
                  </div>
                )}

                {/* Secondary metrics */}
                {getRegimeResult() && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="stat-tile p-2.5">
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-0.5">Total Income</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(getRegimeResult()!.grossSalary + (getRegimeResult()!.grossTotalIncome - (getRegimeResult()!.grossSalary - getRegimeResult()!.standardDeduction)))}
                      </p>
                    </div>
                    <div className="stat-tile p-2.5">
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-0.5">Taxable Income</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(getRegimeResult()!.taxableIncome)}
                      </p>
                    </div>
                    <div className="stat-tile p-2.5">
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-0.5">Slab Tax</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(getRegimeResult()!.slabTax)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <ShareButtons
                    inputs={[
                      { label: 'Gross Salary', value: formatCurrency(watchValues.grossSalary) },
                      { label: 'Basic Salary', value: formatCurrency(watchValues.basicSalary) },
                      { label: 'HRA Received', value: formatCurrency(watchValues.hraReceived) },
                      { label: 'Rent Paid', value: formatCurrency(watchValues.rentPaid) }
                    ]}
                    outputs={[
                      { label: 'Net Taxable Income', value: formatCurrency(getRegimeResult()?.taxableIncome || 0) },
                      { label: 'Total Tax', value: formatCurrency(getRegimeResult()?.totalTax || 0) },
                      { label: 'Effective Rate', value: `${getRegimeResult()?.effectiveRate.toFixed(2) || 0}%` },
                      { label: 'Recommended Regime', value: result.recommended === 'new' ? 'New Regime' : 'Old Regime' }
                    ]}
                    calculatorName="Income Tax Calculator"
                  />
                </div>
              </div>

              {/* Slab Breakdown (collapsed) */}
              <details className="card cursor-pointer group">
                <summary className="flex justify-between items-center font-bold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Slab Tax Breakdown</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
                </summary>

                {getRegimeResult() && (
                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                          <th className="text-left py-2 text-gray-700 dark:text-gray-300 font-semibold">Slab Range</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300 font-semibold">Tax Rate</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300 font-semibold">Income in Slab</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300 font-semibold">Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRegimeResult()!.breakdown.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="py-2 text-gray-700 dark:text-gray-300">{item.slab}</td>
                            <td className="text-right py-2 font-semibold text-gray-900 dark:text-white">{item.rate}%</td>
                            <td className="text-right py-2 text-gray-700 dark:text-gray-300">{formatCurrency(item.incomeInSlab)}</td>
                            <td className="text-right py-2 font-bold text-gray-900 dark:text-white">{formatCurrency(item.tax)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </details>

              {/* Calculation Trace (collapsed) */}
              <details className="card cursor-pointer group">
                <summary className="flex justify-between items-center font-bold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="flex items-center gap-2"><Search className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Detailed Calculation Trace</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
                </summary>

                {getRegimeResult() && (
                  <div className="space-y-2 mt-3 text-sm">
                    {getRegimeResult()!.trace.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.step}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{item.description}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white ml-4 flex-shrink-0">{formatCurrency(item.value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </details>

              {/* Tax Saving Tips (collapsed) */}
              {result.recommendations.length > 0 && (
                <details className="card border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 cursor-pointer group">
                  <summary className="flex justify-between items-center font-bold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4 flex-shrink-0 text-amber-500 dark:text-amber-400" strokeWidth={2} aria-hidden="true" /> Tax Saving Opportunities</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
                  </summary>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {result.recommendations.slice(0, 4).map((rec, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{rec.section}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-2">
                          Save up to {formatCurrency(rec.potentialSaving)}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your income details and results will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Below the fold: educational & visualization content ── */}

      {result && getRegimeResult() && (
        <div className="space-y-6">
          {/* Income Breakup Pie Chart */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><PieChart className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Income Breakup ({result.recommended === 'new' ? 'New' : 'Old'} Regime)</h3>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <MemoizedPieChart
                data={[
                  { name: 'Take-Home Pay', value: getRegimeResult()!.grossSalary - getRegimeResult()!.totalTax },
                  { name: 'Tax Payable', value: getRegimeResult()!.totalTax },
                ]}
                colors={['#10b981', '#ef4444']}
                height={300}
              />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">Take-Home Pay</span>
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(getRegimeResult()!.grossSalary - getRegimeResult()!.totalTax)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Tax Payable</span>
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(getRegimeResult()!.totalTax)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl border-t-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 mt-2 pt-4">
                  <span className="text-gray-600 dark:text-gray-400 font-semibold">Gross Income</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(getRegimeResult()!.grossSalary)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 mt-2">
                  <span className="text-gray-600 dark:text-gray-400 font-semibold">Effective Tax Rate</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400 text-lg">{getRegimeResult()!.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* How Your Tax is Calculated */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2"><BookOpen className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> How Your Tax is Calculated</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Gross Salary:</strong> Your total annual income before any deductions</p>
              <p><strong>Deductions:</strong> Amounts subtracted from gross salary (HRA, LTA, Medical, 80C, 80D, etc.)</p>
              <p><strong>Taxable Income:</strong> Gross salary minus deductions (used to calculate tax)</p>
              <p><strong>Tax Slabs:</strong> Progressive tax rates - you pay higher % only on income in that bracket</p>
              <p><strong>Effective Rate:</strong> Your actual tax as % of gross income (not the bracket %)</p>
              {result.recommended && (
                <p><strong>Why {result.recommended === 'new' ? 'New' : 'Old'} Regime?:</strong> {result.recommended === 'new' ? 'Lower tax due to simpler slab structure and potential benefit from current income level' : 'Better tax savings due to available deductions exceeding standard deduction benefit'}</p>
              )}
            </div>
          </div>

          {/* How Do You Compare */}
          <div className="info-panel">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><BarChart2 className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} aria-hidden="true" /> How Do You Compare?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You save <strong className="text-gray-900 dark:text-white">{formatCurrency(result.savings)}</strong> by choosing the <strong className="text-gray-900 dark:text-white">{result.recommended === 'new' ? 'New' : 'Old'}</strong> regime. With an effective tax rate of <strong className="text-gray-900 dark:text-white">{getRegimeResult()!.effectiveRate.toFixed(2)}%</strong>, your deductions and income level position you well. Consider maximizing 80C (₹1.5L), 80D (health insurance), and 24(b) (₹2L home loan interest) in the Old Regime for additional tax savings.
            </p>
          </div>
        </div>
      )}

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is Income Tax?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Income Tax is a mandatory financial charge imposed by the government on individuals and organizations earning income in India. The amount of tax depends on your income level, which is divided into tax slabs with increasing rates. For FY 2025-26 (AY 2026-27), India offers two tax regimes: Old Regime with multiple deductions (80C, 80D, 24b) and New Regime with lower tax rates but fewer deductions. Section 87A provides a rebate up to ₹60,000 for income up to ₹12 lakhs in the New Regime.
          </p>
        </div>

        {/* Table Snippet: Income Tax Slabs 2025-26 */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Income Tax Slabs FY 2025-26 (New Regime)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">Income Slab</th>
                  <th className="text-center py-3 px-4 font-bold">Tax Rate</th>
                  <th className="text-center py-3 px-4 font-bold">Tax on Slab Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">Upto ₹4 Lakh</td>
                  <td className="text-center py-3 px-4">Nil (0%)</td>
                  <td className="text-center py-3 px-4">₹0</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹4L - ₹8L</td>
                  <td className="text-center py-3 px-4">5%</td>
                  <td className="text-center py-3 px-4">₹20,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹8L - ₹12L</td>
                  <td className="text-center py-3 px-4">10%</td>
                  <td className="text-center py-3 px-4">₹40,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹12L - ₹16L</td>
                  <td className="text-center py-3 px-4">15%</td>
                  <td className="text-center py-3 px-4">₹60,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹16L - ₹20L</td>
                  <td className="text-center py-3 px-4">20%</td>
                  <td className="text-center py-3 px-4">₹80,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">₹20L - ₹24L</td>
                  <td className="text-center py-3 px-4">25%</td>
                  <td className="text-center py-3 px-4">₹1,00,000</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-semibold">Above ₹24L</td>
                  <td className="text-center py-3 px-4">30%</td>
                  <td className="text-center py-3 px-4">30% of excess</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* List Snippet: Tax Saving Strategies */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Top Tax Saving Strategies for Salaried Employees</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1.</span>
              <span><strong>Maximize Section 80C Deductions:</strong> Invest up to ₹1.5 lakh in PPF, ELSS, Life Insurance, Home Loan Principal, or Tuition Fees to reduce taxable income.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2.</span>
              <span><strong>Claim HRA Exemption:</strong> If renting, claim HRA against rent paid (max 40%-50% of salary, but varies by city and employer policy).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3.</span>
              <span><strong>Deduct Home Loan Interest (Section 24b):</strong> Claim up to ₹2 lakh annual deduction on home loan interest for self-occupied property.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4.</span>
              <span><strong>Invest in Health Insurance (Section 80D):</strong> Deduct health insurance premiums for self and family (₹25,000 regular/₹50,000 senior citizens).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">5.</span>
              <span><strong>Donate to Charity (Section 80G):</strong> Donations to approved charities qualify for 50%-100% deduction depending on type.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">6.</span>
              <span><strong>Education Loan Interest (Section 80E):</strong> Full deduction of education loan interest (no limit) for up to 8 years.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">7.</span>
              <span><strong>NPS Contribution (Section 80CCD):</strong> Additional ₹50,000 deduction on top of ₹1.5L 80C limit (employee contribution).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">8.</span>
              <span><strong>Rent Receipt for LTA Claim:</strong> Always maintain rent receipts for LTA exemption claims (₹10,000 to ₹16,000 per year typically).</span>
            </li>
          </ol>
        </div>

        {/* Comparison Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">New vs Old Tax Regime: Which Should You Choose?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> New Regime (Default)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3"><strong>Lower tax rates, no deductions (except specific ones)</strong></p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2"><strong>Pros:</strong> Lower tax rates, rebate up to ₹60K, standard deduction of ₹75K</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Cons:</strong> No HRA, LTA, 80C, 80D deductions</p>
            </div>
            <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Clock className="w-5 h-5 flex-shrink-0 text-gray-400" strokeWidth={2} aria-hidden="true" /> Old Regime</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3"><strong>Higher rates, but maximum deductions available</strong></p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2"><strong>Pros:</strong> HRA, LTA, 80C, 80D, 24b deductions allowed</p>
              <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Cons:</strong> Higher tax rates, complex calculations</p>
            </div>
          </div>
          <div className="info-panel mt-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Verdict:</strong> The Old Regime only wins if your deductions (HRA + 80C + 80D + home loan) are very large — roughly ₹8 lakh or more at higher incomes. For most salaried people the New Regime is cheaper (income up to ₹12.75L is tax-free). Always calculate both and choose the one that gives lower tax!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> FAQs</h3>
        <div className="space-y-3">
          {[
            {
              q: 'When should I choose Old Regime?',
              a: 'Choose Old Regime if your deductions (80C, 80D, 24b) are substantial and reduce your taxable income below the New Regime threshold.',
            },
            {
              q: 'What is Section 87A Rebate?',
              a: 'Section 87A provides a tax rebate up to ₹60,000 (New Regime) if your income is ≤₹12L, or ₹12,500 (Old Regime) if income is ≤₹5L.',
            },
            {
              q: 'Can I claim HRA and LTA in New Regime?',
              a: 'No, HRA and LTA exemptions are only available under Old Regime. New Regime provides a flat ₹75,000 standard deduction instead.',
            },
            {
              q: 'Is NPS employer contribution allowed in both regimes?',
              a: 'Yes, Section 80CCD(2) employer NPS contribution is allowed as a deduction in both Old and New Regimes.',
            },
          ].map((faq, idx) => (
            <details key={idx} className="group cursor-pointer">
              <summary className="font-semibold text-gray-900 dark:text-white py-2 hover:text-blue-600 flex justify-between items-center">
                <span>{faq.q}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
              </summary>
              <p className="text-sm text-gray-600 dark:text-gray-400 py-2 ml-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('tax-calculator')} />

      <RelatedBlogPosts posts={getRelatedBlogPosts('/tax-calculator')} />
    </div>
  );
}
