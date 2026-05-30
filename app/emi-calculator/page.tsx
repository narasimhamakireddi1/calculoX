'use client';

import { useState, useMemo, useEffect, useCallback, memo, Suspense, lazy } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateEMI, generateAmortizationSchedule } from '@/lib/calculators/emi';
import { EMISchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import ExportButton, { type FormattedInput } from '@/components/ui/ExportButton';

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

type EMIFormData = {
  principal: number;
  annualRate: number;
  years: number;
};

interface EMIResultData {
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

// Memoized result cards component
const ResultCards = memo(({ result, inputsData }: { result: EMIResultData | null; inputsData: FormattedInput[] }) => {
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

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all will-change-transform">
          <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">💰 Monthly EMI</p>
          <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">
            {formatCurrency(result.emi)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide font-semibold mb-2">Total Payable</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(result.totalAmount)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 p-5 rounded-lg border-2 border-red-300 dark:border-red-700 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-red-700 dark:text-red-300 text-xs uppercase tracking-wide font-semibold mb-2">📊 Total Interest</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-400">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-5 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">Duration</p>
          <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
            {result.numberOfMonths} <span className="text-xl">months</span>
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          EMI calculated using monthly reducing balance method with compounding interest.
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <ExportButton
          fileName="EMI_Loan_Summary"
          calculatorName="EMI Calculator Results"
          resultElementId="emi-results"
          inputElementId="emi-inputs"
          inputsData={inputsData}
        />
      </div>
    </div>
  );
});

ResultCards.displayName = 'ResultCards';

// Memoized input component with optimized rendering
const LoanInput = memo(({
  id,
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  error,
  prefix,
  suffix,
  rangeText,
  colorFrom,
  colorTo
}: {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number | string;
  error: any;
  prefix?: string;
  suffix?: string;
  rangeText: string;
  colorFrom: string;
  colorTo: string;
}) => (
  <div className="space-y-3">
    <label htmlFor={id} className="block text-sm font-bold text-gray-900 dark:text-white">{label}</label>
    <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? 0}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full md:flex-1 h-3 bg-gradient-to-r ${colorFrom} ${colorTo} rounded-lg appearance-none cursor-pointer accent-${colorTo.split('-')[1]}-600 transition-all will-change-auto`}
      />
      <div className="w-full md:w-auto relative flex-shrink-0">
        {prefix && <span className="absolute left-2 top-2.5 font-bold text-sm">{prefix}</span>}
        {suffix && <span className="absolute right-3 top-2.5 font-bold text-sm">{suffix}</span>}
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
          className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        />
      </div>
    </div>
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
    <p className="text-xs text-gray-500 dark:text-gray-400">{rangeText}</p>
  </div>
));

LoanInput.displayName = 'LoanInput';

export default function EMICalculatorPage() {
  const [result, setResult] = useState<EMIResultData | null>(null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [scheduleFirstTwelve, setScheduleFirstTwelve] = useState<AmortizationRow[]>([]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EMIFormData>({
    resolver: zodResolver(EMISchema),
    defaultValues: {
      principal: 1000000,
      annualRate: 8.5,
      years: 5,
    },
  });

  const watchValues = watch();

  const inputsData: FormattedInput[] = useMemo(() => {
    const data: FormattedInput[] = [];
    if (watchValues.principal) {
      data.push({ label: 'Loan Amount', value: formatCurrency(watchValues.principal) });
    }
    if (watchValues.annualRate !== undefined) {
      data.push({ label: 'Annual Interest Rate', value: `${watchValues.annualRate}%` });
    }
    if (watchValues.years) {
      data.push({ label: 'Loan Duration', value: `${watchValues.years} Year(s)` });
    }
    return data;
  }, [watchValues]);

  const fieldRanges = useMemo(
    () => ({
      principal: { min: 10000, max: 100000000, label: 'Loan Amount (₹)' },
      annualRate: { min: 0, max: 50, label: 'Annual Rate (%)' },
      years: { min: 1, max: 50, label: 'Years' },
    }),
    []
  );

  // Memoize handlers with useCallback
  const handleInputChange = useCallback((fieldName: keyof EMIFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  }, [setValue]);

  const handleValidateField = useCallback((fieldName: string, value: number) => {
    const range = fieldRanges[fieldName as keyof typeof fieldRanges];
    if (range && (value < range.min || value > range.max)) {
      alert(`${range.label} must be between ${range.min} and ${range.max}`);
    }
  }, [fieldRanges]);

  const handleReset = useCallback(() => {
    reset();
    setResult(null);
    setSchedule([]);
    setScheduleFirstTwelve([]);
    setShowFullSchedule(false);
  }, [reset]);

  const handleToggleSchedule = useCallback(() => {
    setShowFullSchedule(prev => !prev);
  }, []);

  // Memoized calculation
  const calculateResults = useCallback((data: EMIFormData) => {
    const result = calculateEMI(data);
    setResult(result);
    const fullSchedule = generateAmortizationSchedule(data, result);
    setSchedule(fullSchedule);
    setScheduleFirstTwelve(fullSchedule.slice(0, 12));
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

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🏦 EMI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate your Equated Monthly Installment (EMI) for loans. View total interest, amortization schedule, and repayment breakdown.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="emi-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Loan Details</h2>
          <form className="space-y-6">
            <LoanInput
              id="principal"
              label="Loan Amount (₹)"
              value={watchValues.principal ?? 0}
              onChange={(e) => handleInputChange('principal', Number(e.target.value))}
              onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
              min={10000}
              max={100000000}
              step={10000}
              error={errors.principal}
              prefix="₹"
              rangeText="₹10,000 - ₹1 Crore"
              colorFrom="from-blue-300"
              colorTo="to-blue-600"
            />

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
              suffix="%"
              rangeText="0% - 50%"
              colorFrom="from-orange-300"
              colorTo="to-orange-600"
            />

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
              colorFrom="from-green-300"
              colorTo="to-green-600"
            />

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] will-change-transform"
            >
              🗑️ Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <ResultCards result={result} inputsData={inputsData} />
      </div>

      {/* Charts Section - Lazy loaded */}
      {result && (
        <Suspense fallback={<ChartLoader />}>
          <Charts result={result} schedule={schedule} />
        </Suspense>
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

      {/* Related Calculators */}
      <RelatedCalculators
        calculators={[
          {
            title: 'SIP Calculator',
            description: 'Plan your systematic investment returns',
            icon: '📈',
            href: '/sip-calculator',
          },
          {
            title: 'Simple Interest Calculator',
            description: 'Calculate simple interest on loans/deposits',
            icon: '💵',
            href: '/simple-interest-calculator',
          },
          {
            title: 'Percentage Calculator',
            description: 'Quick percentage and ratio calculations',
            icon: '🔢',
            href: '/percentage-calculator',
          },
          {
            title: 'Tax Calculator',
            description: 'Calculate income tax liability',
            icon: '🧾',
            href: '/tax-calculator',
          },
          {
            title: 'FD Calculator',
            description: 'Calculate fixed deposit maturity and returns',
            icon: '💳',
            href: '/fd-calculator',
          },
          {
            title: 'CAGR Calculator',
            description: 'Measure your investment growth rate annually',
            icon: '📊',
            href: '/cagr-calculator',
          },
        ]}
      />

      {/* Affiliate Banner */}
      <AffiliateBanner
        icon="🏦"
        headline="Get the Lowest Loan Rate for Your EMI"
        subtext="Compare home loan, car loan & personal loan rates from 20+ banks instantly."
        note="Free comparison · No credit score impact · Instant eligibility check"
        gradient="from-blue-600 to-blue-800"
        links={[
          { label: 'Compare Loan Rates →', href: 'https://www.bankbazaar.com/home-loan.html', primary: true },
          { label: 'Check Eligibility', href: 'https://www.paisabazaar.com/home-loan/' },
        ]}
      />

      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is EMI?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              EMI (Equated Monthly Installment) is the fixed amount you pay every month to repay a loan. It includes both principal and interest components, structured so that the total interest is spread evenly across the loan tenure.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              How is EMI calculated?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              EMI is calculated using the formula: EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1], where P is the principal, R is the monthly interest rate, and N is the number of months. Higher principal or rate increases EMI; longer tenure decreases it.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              Can I pay EMI early?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Yes, most loans allow prepayment or early repayment. Paying early reduces the total interest paid. Check with your lender for any prepayment penalties, as some banks charge a small fee for early closure.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What affects EMI amount?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              EMI is affected by three factors: (1) Loan amount - higher principal means higher EMI, (2) Interest rate - higher rate increases EMI, (3) Loan duration - longer tenure reduces EMI but increases total interest paid.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
