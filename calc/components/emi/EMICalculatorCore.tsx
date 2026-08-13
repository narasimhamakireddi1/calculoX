'use client';

import { useState, useMemo, useEffect, useCallback, memo, Suspense, lazy } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { Home, BarChart2, Briefcase, Target, Coins, BookOpen, Lightbulb, Trash2, AlertTriangle, Check } from 'lucide-react';
import { calculateEMI, generateAmortizationSchedule } from '@/lib/calculators/emi';
import { EMISchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

import { ChartEmptyState } from '@/components/charts/ChartEmptyState';

// Dynamic imports for charts - lazy load to improve initial page load
const Charts = lazy(() => import('@/components/emi/ChartComponents').then(m => ({ default: m.ChartsSection })));
const AmortizationTable = lazy(() => import('@/components/emi/AmortizationTable').then(m => ({ default: m.default })));

// Fallback loader
const ChartLoader = () => (
  <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="text-center">
      <div className="animate-pulse inline-block w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mb-2"></div>
      <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
    </div>
  </div>
);

export type EMIFormData = {
  principal: number;
  annualRate: number;
  years: number;
};

export interface EMIResultData {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  numberOfMonths: number;
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const ResultCards = memo(({ result, watchValues, embed }: { result: EMIResultData | null; watchValues: EMIFormData; embed?: boolean }) => {
  if (!result) {
    return (
      <div className="card h-full flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Enter your loan details and results will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="emi-results" className="card space-y-4">
      <h2 className="text-2xl font-bold mb-6">Loan Summary</h2>

      {/* Hero metric */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-6 sm:p-8 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg [container-type:inline-size]">
        <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Monthly EMI</p>
        <p className="text-[clamp(1.5rem,7.5cqw,3.75rem)] font-black text-blue-700 dark:text-blue-400 break-all leading-tight">
          {formatCurrency(result.emi)}
        </p>
        <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 font-medium">per month for {result.numberOfMonths} months</p>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        <div className="stat-tile">
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1">Total Payable</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
            {formatCurrency(result.totalAmount)}
          </p>
        </div>

        <div className="stat-tile">
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><BarChart2 className="w-3 h-3 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Interest</p>
          <p className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>

        <div className="stat-tile col-span-2 sm:col-span-1">
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1">Duration</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
            {result.numberOfMonths} <span className="font-normal text-xs text-gray-500">months</span>
          </p>
        </div>
      </div>

      {/* Understanding Your EMI */}
      <div className="info-panel">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" /> Understanding Your EMI</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p><strong className="text-gray-900 dark:text-white">Monthly EMI:</strong> Fixed amount you pay each month. Includes both principal and interest components that change each month</p>
          <p><strong className="text-gray-900 dark:text-white">Total Interest:</strong> Total amount you pay as interest over the entire loan duration. Reduces with early repayment</p>
          <p><strong className="text-gray-900 dark:text-white">Total Payable:</strong> Principal (loan amount) + Total Interest. This is the complete amount you'll pay by maturity</p>
          <p><strong className="text-gray-900 dark:text-white">Interest Breakdown:</strong> Early payments have more interest, later payments have more principal (see amortization table below)</p>
        </div>
      </div>

      {/* Money-Saving Tips */}
      <div className="info-panel">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" /> Money-Saving Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden="true" /><span><strong className="text-gray-900 dark:text-white">Prepay Lump Sums:</strong> Pay extra in good months to reduce total interest significantly</span></li>
          <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden="true" /><span><strong className="text-gray-900 dark:text-white">Shorter Tenure:</strong> 15 years instead of 20 can save substantial interest</span></li>
          <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden="true" /><span><strong className="text-gray-900 dark:text-white">Better Rate:</strong> Even 0.5% lower rate saves thousands over the loan period</span></li>
          <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden="true" /><span><strong className="text-gray-900 dark:text-white">Early Settlement:</strong> Check for prepayment penalties before clearing early</span></li>
        </ul>
      </div>

      <div className="info-panel mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Target className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} aria-hidden="true" /> How Do You Compare?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Your monthly EMI is <strong className="text-gray-900 dark:text-white">{formatCurrency(result.emi)}</strong>. Financial advisors recommend keeping your EMI-to-income ratio below 40% for healthy finances. With an interest rate of 8-9%, home loans are typically more advantageous than personal loans at 12-18%.
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          EMI calculated using monthly reducing balance method with compounding interest.
        </p>
      </div>

      {!embed && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          {/* Share Section */}
          <ShareButtons
            inputs={[
              { label: 'Principal Amount', value: `₹${watchValues.principal.toLocaleString('en-IN')}` },
              { label: 'Interest Rate', value: `${watchValues.annualRate}% p.a.` },
              { label: 'Loan Tenure', value: `${watchValues.years} years` },
            ]}
            outputs={[
              { label: 'Monthly EMI', value: `₹${result.emi.toLocaleString('en-IN')}` },
              { label: 'Total Payable', value: `₹${result.totalAmount.toLocaleString('en-IN')}` },
              { label: 'Total Interest', value: `₹${result.totalInterest.toLocaleString('en-IN')}` },
            ]}
            calculatorName="EMI Calculator"
          />
        </div>
      )}
    </div>
  );
});

ResultCards.displayName = 'ResultCards';

// Memoized input component with optimized rendering - RD design pattern
const LoanInput = memo(({
  id,
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  sliderMax,
  step,
  error,
  warning,
  rangeText,
  colorFrom,
  colorTo,
  presets,
  presetLabels,
  helperText
}: {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  sliderMax?: number;
  step: number | string;
  error: { message?: string } | undefined;
  warning?: string;
  rangeText: string;
  colorFrom: string;
  colorTo: string;
  presets?: number[];
  presetLabels?: string[];
  helperText?: string;
}) => {
  // Extract color names for dynamic styling
  const getColorClasses = () => {
    if (colorFrom.includes('blue')) return { border: 'border-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', dark: 'dark:border-blue-700' };
    if (colorFrom.includes('green')) return { border: 'border-green-400', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', dark: 'dark:border-green-700' };
    if (colorFrom.includes('orange')) return { border: 'border-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', dark: 'dark:border-orange-700' };
    if (colorFrom.includes('purple')) return { border: 'border-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', dark: 'dark:border-purple-700' };
    if (colorFrom.includes('red')) return { border: 'border-red-400', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', dark: 'dark:border-red-700' };
    return { border: 'border-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400', dark: 'dark:border-gray-700' };
  };

  const colors = getColorClasses();
  const effectiveSliderMax = sliderMax ?? max;

  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-bold text-gray-900 dark:text-white">{label}</label>
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Slider - always has a numeric value so thumb position is correct */}
        <RangeSlider
          min={min}
          max={effectiveSliderMax}
          step={step}
          value={value || min}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full flex-1 h-3 bg-gradient-to-r ${colorFrom} ${colorTo} rounded-lg appearance-none cursor-pointer accent-${colorFrom.split('-')[1]}-600`}
        />

        {/* Number Input - matches retirement calculator design */}
        <input
          id={id}
          type="number"
          placeholder="0"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? '' : value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full md:w-28 px-2 py-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 ${colors.border} rounded-lg font-bold ${colors.text} ${colors.bg} ${colors.dark}`}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      {warning && (
        <p className="text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
          {warning}
        </p>
      )}

      {/* Quick Preset Buttons */}
      {presets && presets.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {presets.map((preset, idx) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange({ target: { value: String(preset) } } as unknown as React.ChangeEvent<HTMLInputElement>)}
              className={`text-xs px-3 py-1.5 rounded-full border ${colors.border} ${colors.dark}
                ${colors.bg} hover:brightness-110 transition-colors`}
            >
              {presetLabels?.[idx] || preset}
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-1">
          <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {helperText}
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">{rangeText}</p>
    </div>
  );
});

LoanInput.displayName = 'LoanInput';

const PRINCIPAL_MAX = 15000000;

const DEFAULT_EMI_VALUES: EMIFormData = { principal: 1000000, annualRate: 8.5, years: 5 };

function computeEMIAll(data: EMIFormData) {
  const result = calculateEMI(data);
  const fullSchedule = generateAmortizationSchedule(data, result);
  return { result, schedule: fullSchedule, scheduleFirstTwelve: fullSchedule.slice(0, 12) };
}

const INITIAL_EMI_DATA = (() => {
  try { return computeEMIAll(DEFAULT_EMI_VALUES); } catch { return null; }
})();

export function EMICalculatorCore({
  embed = false,
  initialValues,
  onResultChange,
}: {
  embed?: boolean;
  initialValues?: Partial<EMIFormData>;
  /** Fires whenever the live result/inputs change — lets the parent page mirror
   * them into its own static SEO sections (e.g. "if your EMI is ₹X...") without
   * lifting the whole form state out of this component. */
  onResultChange?: (result: EMIResultData | null, watchValues: EMIFormData) => void;
}) {
  const effectiveDefaults = useMemo(() => ({ ...DEFAULT_EMI_VALUES, ...initialValues }), [initialValues]);
  const initialComputed = useMemo(() => {
    if (!initialValues) return INITIAL_EMI_DATA; // preserves the original zero-CLS module-level precompute
    try { return computeEMIAll(effectiveDefaults); } catch { return null; }
  }, [initialValues, effectiveDefaults]);

  const [result, setResult] = useState<EMIResultData | null>(initialComputed?.result ?? null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>(initialComputed?.schedule ?? []);
  const [scheduleFirstTwelve, setScheduleFirstTwelve] = useState<AmortizationRow[]>(initialComputed?.scheduleFirstTwelve ?? []);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [principalWarning, setPrincipalWarning] = useState('');

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EMIFormData>({
    resolver: zodResolver(EMISchema),
    defaultValues: effectiveDefaults,
  });

  // Restore saved calculation if available (skipped in embed context — no session continuity there)
  useEffect(() => {
    if (embed) return;
    const savedData = sessionStorage.getItem('restore_emi-calculator');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.entries(parsed).forEach(([key, value]) => {
          setValue(key as keyof EMIFormData, value as number, { shouldValidate: true });
        });
        sessionStorage.removeItem('restore_emi-calculator');
      } catch {
        // Ignore if invalid
      }
    }
  }, [setValue, embed]);

  const watchValues = watch();

  const fieldRanges = useMemo(
    () => ({
      principal: { min: 10000, max: PRINCIPAL_MAX, label: 'Loan Amount (₹)' },
      annualRate: { min: 0, max: 50, label: 'Annual Rate (%)' },
      years: { min: 1, max: 50, label: 'Years' },
    }),
    []
  );

  // Memoize handlers with useCallback
  const handleInputChange = useCallback((fieldName: keyof EMIFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  }, [setValue]);

  const handlePrincipalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value === '' ? 0 : Number(e.target.value);
    if (raw > PRINCIPAL_MAX) {
      setValue('principal', PRINCIPAL_MAX, { shouldValidate: true });
      setPrincipalWarning('Maximum loan amount is ₹1.5 Crore. Value set to ₹1,50,00,000.');
    } else {
      setValue('principal', raw, { shouldValidate: true });
      setPrincipalWarning('');
    }
  }, [setValue]);

  const handleValidateField = useCallback((fieldName: string, value: number) => {
    const range = fieldRanges[fieldName as keyof typeof fieldRanges];
    if (!range) return;
    if (value > range.max) {
      setValue(fieldName as keyof EMIFormData, range.max, { shouldValidate: true });
    } else if (value < range.min && value > 0) {
      setValue(fieldName as keyof EMIFormData, range.min, { shouldValidate: true });
    }
  }, [fieldRanges, setValue]);

  const haptic = useHapticFeedback();

  const handleReset = useCallback(() => {
    haptic.trigger('warning');
    setPrincipalWarning('');
    reset();
    setResult(null);
    setSchedule([]);
    setScheduleFirstTwelve([]);
    setShowFullSchedule(false);
  }, [reset, haptic, setPrincipalWarning]);

  const handleToggleSchedule = useCallback(() => {
    setShowFullSchedule(prev => !prev);
  }, []);

  // Quick-start scenarios
  const emiScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'First-Time Homebuyer',
      description: 'Typical home loan scenario',
      icon: Home,
      values: { principal: 5000000, annualRate: 8.5, years: 20 }
    },
    {
      label: 'Refinance Existing',
      description: 'Lower rate on existing loan',
      icon: BarChart2,
      values: { principal: 3000000, annualRate: 7.5, years: 15 }
    },
    {
      label: 'Business Loan',
      description: 'Commercial property/working capital',
      icon: Briefcase,
      values: { principal: 10000000, annualRate: 10.5, years: 10 }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof EMIFormData, Number(value), { shouldValidate: true });
    });
  }, [setValue]);

  // Memoized calculation
  const calculateResults = useCallback((data: EMIFormData) => {
    const computed = computeEMIAll(data);
    setResult(computed.result);
    setSchedule(computed.schedule);
    setScheduleFirstTwelve(computed.scheduleFirstTwelve);
  }, []);

  // Auto-calculate with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.principal && watchValues.annualRate !== undefined && watchValues.years) {
        calculateResults(watchValues);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues, calculateResults]);

  useEffect(() => {
    onResultChange?.(result, watchValues);
    // watchValues is a fresh object from react-hook-form on every render; depending on its
    // individual fields (not the object reference) avoids notifying the parent every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, watchValues.principal, watchValues.annualRate, watchValues.years, onResultChange]);

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0">
            <CalculatorIcon idOrHref="emi" className="w-6 h-6 text-white" />
          </span>
          <span>EMI Calculator</span>
        </h1>
        {!embed && (
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Calculate your Equated Monthly Installment (EMI) for loans. View total interest, amortization schedule, and repayment breakdown.
          </p>
        )}
      </div>

      {!embed && <ConfidenceBadge calculatorType="emi" />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="emi-inputs" className="card min-w-0">
          <h2 className="text-2xl font-bold mb-6">Loan Details</h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={emiScenarios}
            onSelectScenario={handleSelectScenario}
          />

          <form className="space-y-6">
            <div>
              <LoanInput
                id="principal"
                label="Loan Amount (₹)"
                value={watchValues.principal ?? 0}
                onChange={handlePrincipalChange}
                onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                min={10000}
                max={15000000}
                step={10000}
                error={errors.principal}
                warning={principalWarning}
                rangeText="₹10,000 - ₹1.5 Crore"
                colorFrom="from-blue-300"
                colorTo="to-blue-600"
                presets={[2000000, 5000000, 10000000, 15000000]}
                presetLabels={['₹20L', '₹50L', '₹1Cr', '₹1.5Cr']}
                helperText="Typical home loan range: ₹10L – ₹1.5Cr depending on property value and down payment"
              />
            </div>

            <div>
              <LoanInput
                id="annual-rate"
                label="Annual Interest Rate (%)"
                value={watchValues.annualRate ?? 0}
                onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                min={0}
                max={50}
                step={0.1}
                error={errors.annualRate}
                rangeText="0% - 50%"
                colorFrom="from-blue-300"
                colorTo="to-blue-600"
                presets={[7.5, 8.5, 9.5]}
                presetLabels={['7.5%', '8.5%', '9.5%']}
                helperText="Current home loan rates: 7.5-9.5% p.a. (varies by bank and credit score)"
              />
            </div>

            <div>
              <LoanInput
                id="loan-tenure"
                label="Loan Tenure (Years)"
                value={watchValues.years ?? 0}
                onChange={(e) => handleInputChange('years', Number(e.target.value))}
                onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                min={1}
                max={50}
                step={1}
                error={errors.years}
                rangeText="1 - 50 years"
                colorFrom="from-blue-300"
                colorTo="to-blue-600"
                presets={[10, 15, 20, 30]}
                presetLabels={['10Y', '15Y', '20Y', '30Y']}
                helperText="Most home loans: 15-30 years. Shorter tenure = higher EMI but less total interest"
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost w-full inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" /> Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="min-w-0">
          <ResultCards result={result} watchValues={watchValues} embed={embed} />
        </div>
      </div>

      {/* Charts Section - Lazy loaded */}
      {result ? (
        <Suspense fallback={<ChartLoader />}>
          <Charts result={result} schedule={schedule} />
        </Suspense>
      ) : (
        <ChartEmptyState />
      )}

      {/* Amortization Schedule - Lazy loaded */}
      {result && schedule.length > 0 && (
        <Suspense fallback={<div className="card h-40 flex items-center justify-center"><p className="text-gray-500">Loading table...</p></div>}>
          <AmortizationTable
            schedule={schedule}
            scheduleFirstTwelve={scheduleFirstTwelve}
            showFullSchedule={showFullSchedule}
            onToggle={handleToggleSchedule}
          />
        </Suspense>
      )}
    </>
  );
}
