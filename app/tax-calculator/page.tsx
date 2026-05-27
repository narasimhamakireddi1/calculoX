'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ComprehensiveTaxSchema } from '@/lib/validators';
import { calculateComprehensiveTax } from '@/lib/tax-engine/calculator';
import { ComprehensiveTaxInput, ComprehensiveTaxResult, TaxSavingRecommendation } from '@/lib/tax-engine/types';
import { formatCurrency } from '@/lib/utils/format';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';

type FormData = {
  // Profile
  age: 'below60' | 'between60to80' | 'above80';
  residentialStatus: 'resident' | 'nri';
  employerType: 'government' | 'private';
  // Salary
  grossSalary: number;
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  cityType: 'metro' | 'non-metro';
  lta: number;
  epfEmployee: number;
  // Deductions 80C
  epf: number;
  ppf: number;
  elss: number;
  lifeInsurance: number;
  homeRepayment: number;
  ssy: number;
  nsc: number;
  taxSaverFD: number;
  tuitionFees: number;
  // Deductions 80CCD1B
  npsAdditional: number;
  // Deductions 80D
  healthInsuranceSelf: number;
  healthInsuranceParents: number;
  parentsAge: 'below60' | 'above60';
  // Deductions 80E
  educationLoanInterest: number;
  // Deductions 80G
  donations100: number;
  donations50: number;
  // Deductions 80TTA/TTB
  savingsInterest: number;
  // Deductions 24b
  homeLoanInterest: number;
  // Regime
  regime: 'old' | 'new' | 'auto';
};

export default function ComprehensiveTaxCalculator() {
  const [result, setResult] = useState<ComprehensiveTaxResult | null>(null);

  const {
    register,
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(ComprehensiveTaxSchema),
    defaultValues: {
      age: 'below60',
      residentialStatus: 'resident',
      employerType: 'private',
      grossSalary: 0,
      basicSalary: 0,
      hraReceived: 0,
      rentPaid: 0,
      cityType: 'non-metro',
      lta: 0,
      epfEmployee: 0,
      epf: 0,
      ppf: 0,
      elss: 0,
      lifeInsurance: 0,
      homeRepayment: 0,
      ssy: 0,
      nsc: 0,
      taxSaverFD: 0,
      tuitionFees: 0,
      npsAdditional: 0,
      healthInsuranceSelf: 0,
      healthInsuranceParents: 0,
      parentsAge: 'below60',
      educationLoanInterest: 0,
      donations100: 0,
      donations50: 0,
      savingsInterest: 0,
      homeLoanInterest: 0,
      regime: 'auto',
    },
  });

  const watchValues = watch();

  const handleInputChange = (fieldName: keyof FormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleValidateField = (fieldName: string, value: number, min: number, max: number) => {
    if (value < min || value > max) {
      alert(`${fieldName} must be between ₹${min.toLocaleString('en-IN')} and ₹${max.toLocaleString('en-IN')}`);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    if (watchValues.grossSalary && watchValues.basicSalary) {
      calculateResults(watchValues);
    }
  }, [watchValues]);

  const calculateResults = (data: FormData) => {
    try {
      const input: ComprehensiveTaxInput = {
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

      const calculationResult = calculateComprehensiveTax(input);
      setResult(calculationResult);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Error calculating tax. Please check your inputs.');
    }
  };

  const section80CTotal =
    (watchValues.epf ?? 0) +
    (watchValues.ppf ?? 0) +
    (watchValues.elss ?? 0) +
    (watchValues.lifeInsurance ?? 0) +
    (watchValues.homeRepayment ?? 0) +
    (watchValues.ssy ?? 0) +
    (watchValues.nsc ?? 0) +
    (watchValues.taxSaverFD ?? 0) +
    (watchValues.tuitionFees ?? 0);

  const section80CLimit = 150000;
  const section80CPercentage = Math.min(100, (section80CTotal / section80CLimit) * 100);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Income Tax Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Complete Indian tax calculator for FY 2025-26. Calculate salary, deductions, compare tax regimes, and get
          personalized recommendations to minimize your tax liability.
        </p>
      </div>

      <form  className="space-y-6">
        {/* PERSONAL PROFILE SECTION */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Personal Profile</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Age Group */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">👤 Age Group</label>
              <div className="space-y-2">
                {(['below60', 'between60to80', 'above80'] as const).map((age) => (
                  <label key={age} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      {...register('age')}
                      value={age}
                      className="w-4 h-4"
                    />
                    <span>
                      {age === 'below60' ? 'Below 60' : age === 'between60to80' ? '60-80 (Senior)' : 'Above 80 (Super Senior)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Residential Status */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">🏠 Residential Status</label>
              <select
                {...register('residentialStatus')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="resident">Resident of India</option>
                <option value="nri">NRI (Non-Resident)</option>
              </select>
            </div>

            {/* Employer Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">💼 Employer Type</label>
              <select
                {...register('employerType')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="private">Private Sector</option>
                <option value="government">Government</option>
              </select>
            </div>
          </div>
        </div>

        {/* TAX REGIME SELECTION */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Tax Regime</h2>
          <div className="space-y-3">
            {(['new', 'old', 'auto'] as const).map((regime) => (
              <label key={regime} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <input
                  type="radio"
                  {...register('regime')}
                  value={regime}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-semibold">
                    {regime === 'new' ? '📉 New Tax Regime' : regime === 'old' ? '📈 Old Tax Regime' : '🔄 Auto (Compare Both)'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {regime === 'new'
                      ? 'Lower rates, no deductions (except standard deduction)'
                      : regime === 'old'
                      ? 'Higher rates, but allows 80C, 80D, 80E deductions'
                      : 'Calculate both regimes and show which is better'}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Info message based on selected regime */}
          {watchValues.regime === 'new' && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>ℹ️ New Regime:</strong> Deductions section is hidden as the new regime doesn't allow them. You get a fixed ₹75,000 standard deduction instead.
              </p>
            </div>
          )}

          {watchValues.regime === 'old' && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>ℹ️ Old Regime:</strong> You can claim deductions (80C, 80D, 80E, etc.) in the Deductions section below.
              </p>
            </div>
          )}

          {watchValues.regime === 'auto' && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>ℹ️ Auto Mode:</strong> Fill deductions below. We'll calculate both regimes and recommend the one that saves you more tax.
              </p>
            </div>
          )}
        </div>

        {/* SALARY INCOME SECTION */}
        <details className="card cursor-pointer group" open>
          <summary className="flex justify-between items-center font-bold text-lg mb-6 hover:text-blue-600">
            <span>💼 Salary Income</span>
            <span className="transition-transform group-open:rotate-180">▼</span>
          </summary>

          <div className="space-y-6">
            {/* Gross Salary */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Gross Annual Salary / CTC (₹)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="10000"
                  value={watchValues.grossSalary ?? 0}
                  onChange={(e) => handleInputChange('grossSalary', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('Gross Salary', Number(e.target.value), 0, 100000000)}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 text-blue-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    max="100000000"
                    step="10000"
                    value={watchValues.grossSalary ?? 0}
                    onChange={(e) => handleInputChange('grossSalary', Number(e.target.value))}
                    className="w-32 px-6 py-2 pl-7 border-2 border-blue-400 rounded-lg text-right font-bold text-blue-700 bg-blue-50 dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">₹0 - ₹10 Crore (annual CTC or gross salary)</p>
            </div>

            {/* Basic Salary */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Basic Salary (₹) [For HRA calculation]</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="10000"
                  value={watchValues.basicSalary ?? 0}
                  onChange={(e) => handleInputChange('basicSalary', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 text-green-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    max="100000000"
                    step="10000"
                    value={watchValues.basicSalary ?? 0}
                    onChange={(e) => handleInputChange('basicSalary', Number(e.target.value))}
                    className="w-32 px-6 py-2 pl-7 border-2 border-green-400 rounded-lg text-right font-bold text-green-700 bg-green-50 dark:bg-gray-700 dark:border-green-600 dark:text-green-400"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Needed to calculate HRA exemption</p>
            </div>

            {/* HRA & Rent */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold">HRA Received from Employer (₹)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="5000"
                    value={watchValues.hraReceived ?? 0}
                    onChange={(e) => handleInputChange('hraReceived', Number(e.target.value))}
                    className="flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="relative flex-shrink-0">
                    <span className="absolute left-2 top-2.5 text-purple-600 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="50000000"
                      step="5000"
                      value={watchValues.hraReceived ?? 0}
                      onChange={(e) => handleInputChange('hraReceived', Number(e.target.value))}
                      className="w-32 px-6 py-2 pl-7 border-2 border-purple-400 rounded-lg text-right font-bold text-purple-700 bg-purple-50 dark:bg-gray-700 dark:border-purple-600 dark:text-purple-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold">Annual Rent Paid (₹)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="5000"
                    value={watchValues.rentPaid ?? 0}
                    onChange={(e) => handleInputChange('rentPaid', Number(e.target.value))}
                    className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="relative flex-shrink-0">
                    <span className="absolute left-2 top-2.5 text-orange-600 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="50000000"
                      step="5000"
                      value={watchValues.rentPaid ?? 0}
                      onChange={(e) => handleInputChange('rentPaid', Number(e.target.value))}
                      className="w-32 px-6 py-2 pl-7 border-2 border-orange-400 rounded-lg text-right font-bold text-orange-700 bg-orange-50 dark:bg-gray-700 dark:border-orange-600 dark:text-orange-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* City Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">City Type [For HRA %]</label>
              <div className="grid md:grid-cols-2 gap-3">
                {(['metro', 'non-metro'] as const).map((city) => (
                  <label key={city} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      {...register('cityType')}
                      value={city}
                      className="w-4 h-4"
                    />
                    <span>{city === 'metro' ? '🏙️ Metro (50% of basic)' : '🏘️ Non-Metro (40% of basic)'}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500">Metro: Mumbai, Delhi, Kolkata, Chennai</p>
            </div>

            {/* LTA */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">LTA Claimed (₹)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="5000"
                  value={watchValues.lta ?? 0}
                  onChange={(e) => handleInputChange('lta', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-cyan-300 to-cyan-600 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 text-cyan-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    max="10000000"
                    step="5000"
                    value={watchValues.lta ?? 0}
                    onChange={(e) => handleInputChange('lta', Number(e.target.value))}
                    className="w-32 px-6 py-2 pl-7 border-2 border-cyan-400 rounded-lg text-right font-bold text-cyan-700 bg-cyan-50 dark:bg-gray-700 dark:border-cyan-600 dark:text-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* EPF Employee */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Employee EPF Contribution (₹) [Goes into 80C]</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={watchValues.epfEmployee ?? 0}
                  onChange={(e) => handleInputChange('epfEmployee', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-red-300 to-red-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 text-red-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="1000"
                    value={watchValues.epfEmployee ?? 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      handleInputChange('epfEmployee', value);
                      handleInputChange('epf', value);
                    }}
                    className="w-32 px-6 py-2 pl-7 border-2 border-red-400 rounded-lg text-right font-bold text-red-700 bg-red-50 dark:bg-gray-700 dark:border-red-600 dark:text-red-400"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Automatically synced to Section 80C</p>
            </div>
          </div>
        </details>

        {/* DEDUCTIONS SECTION - Only visible for Old Regime or Auto */}
        {(watchValues.regime === 'old' || watchValues.regime === 'auto') && (
          <details className="card cursor-pointer group">
            <summary className="flex justify-between items-center font-bold text-lg mb-6 hover:text-blue-600">
              <span>💰 Deductions {watchValues.regime === 'auto' && '(Old Regime Only)'}</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>

            <div className="space-y-6">
              {watchValues.regime === 'auto' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> These deductions apply only to the <strong>Old Regime</strong>. The New Regime uses only the standard deduction (₹75,000) without these deductions.
                  </p>
                </div>
              )}

            {/* SECTION 80C */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Section 80C (Max ₹1.5 Lakh)</h3>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Current: {formatCurrency(section80CTotal)}</span>
                  <span>Limit: {formatCurrency(section80CLimit)}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      section80CPercentage > 100
                        ? 'bg-red-500'
                        : section80CPercentage > 80
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, section80CPercentage)}%` }}
                  />
                </div>
              </div>

              {/* 80C Sub-items */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'epf', label: 'EPF', hint: '(synced from salary)' },
                  { key: 'ppf', label: 'PPF' },
                  { key: 'elss', label: 'ELSS Mutual Funds' },
                  { key: 'lifeInsurance', label: 'Life Insurance Premium' },
                  { key: 'homeRepayment', label: 'Home Loan Principal' },
                  { key: 'ssy', label: 'Sukanya Samriddhi' },
                  { key: 'nsc', label: 'NSC' },
                  { key: 'taxSaverFD', label: '5-Year Tax Saver FD' },
                  { key: 'tuitionFees', label: 'Tuition Fees' },
                ].map(({ key, label, hint }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-xs font-semibold">
                      {label} {hint && <span className="text-gray-500">{hint}</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        max="1500000"
                        step="1000"
                        {...register(key as keyof FormData)}
                        className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                        disabled={key === 'epf'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 80CCD1B */}
            <div className="space-y-3 border-t pt-6">
              <label className="block text-sm font-semibold">Section 80CCD(1B) - NPS Additional (Max ₹50,000)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max="50000"
                  step="1000"
                  {...register('npsAdditional')}
                  className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            {/* SECTION 80D */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-base">Section 80D - Health Insurance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Self/Family Health Insurance (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="1000"
                      {...register('healthInsuranceSelf')}
                      className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {watchValues.age === 'below60' ? 'Limit: ₹25,000' : 'Limit: ₹50,000'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Parents Health Insurance (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="1000"
                      {...register('healthInsuranceParents')}
                      className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2 mt-2">
                    <label className="block text-xs font-semibold">Parents Age</label>
                    <select
                      {...register('parentsAge')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="below60">Below 60: ₹25,000 limit</option>
                      <option value="above60">60+: ₹50,000 limit</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 80E */}
            <div className="space-y-3 border-t pt-6">
              <label className="block text-sm font-semibold">Section 80E - Education Loan Interest (No Limit)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max="10000000"
                  step="1000"
                  {...register('educationLoanInterest')}
                  className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <p className="text-xs text-gray-500">Interest paid on education loan (full amount deductible for 8 years)</p>
            </div>

            {/* SECTION 80G */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-base">Section 80G - Charitable Donations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">100% Qualifying Donations (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="100000000"
                      step="1000"
                      {...register('donations100')}
                      className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">50% Qualifying Donations (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="100000000"
                      step="1000"
                      {...register('donations50')}
                      className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 80TTA/TTB */}
            <div className="space-y-3 border-t pt-6">
              <label className="block text-sm font-semibold">
                {watchValues.age === 'below60' ? '80TTA - Savings Interest' : '80TTB - Bank Interest'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="500"
                  {...register('savingsInterest')}
                  className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <p className="text-xs text-gray-500">
                {watchValues.age === 'below60'
                  ? 'Savings account interest (limit: ₹10,000)'
                  : 'All bank interest including savings (limit: ₹50,000)'}
              </p>
            </div>

            {/* SECTION 24(b) */}
            <div className="space-y-3 border-t pt-6">
              <label className="block text-sm font-semibold">Section 24(b) - Home Loan Interest (Max ₹2 Lakh)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max="300000"
                  step="1000"
                  {...register('homeLoanInterest')}
                  className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <p className="text-xs text-gray-500">Home loan interest for self-occupied property</p>
            </div>
          </div>
          </details>
        )}

        {/* CALCULATE & RESET BUTTONS */}
        <div className="flex gap-3">
          <button
            type="button" onClick={handleReset}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            🧮 Calculate Tax
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            🗑️ Clear All
          </button>
        </div>
      </form>

      {/* RESULTS SECTION */}
      {result && (
        <>
          <ResultsSection result={result} />
          <RecommendationsSection recommendations={result.recommendations} />
        </>
      )}

      {/* AFFILIATE BANNER */}
      <AffiliateBanner
        icon="📋"
        headline="File Your ITR for Free — FY 2025-26"
        subtext="India's #1 tax filing platform. File ITR in minutes with auto-filled data from Form 16."
        note="New & Old regime support · CA assistance available · 6 Crore+ ITRs filed"
        gradient="bg-gradient-to-r from-orange-500 to-amber-600"
        links={[
          { label: 'File ITR Free on ClearTax →', href: 'https://cleartax.in', primary: true },
          { label: 'Get CA Assistance', href: 'https://cleartax.in/ca-assisted-filing' },
        ]}
      />

      {/* FAQ */}
      <FAQSection />

      {/* TAX SAVING TIPS */}
      <TaxSavingTips />
    </div>
  );
}

// RESULTS COMPONENT
function ResultsSection({ result }: { result: ComprehensiveTaxResult }) {
  return (
    <div className="space-y-8">
      {/* SUMMARY CARDS */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Tax Calculation Summary</h2>

        {result.recommended === 'new' ? (
          <SingleRegimeResults regime={result.newRegime} />
        ) : (
          <SingleRegimeResults regime={result.oldRegime} />
        )}
      </div>

      {/* REGIME COMPARISON (if auto) */}
      {result.oldRegime && result.newRegime && (
        <RegimeComparisonPanel oldRegime={result.oldRegime} newRegime={result.newRegime} recommended={result.recommended} />
      )}
    </div>
  );
}

// Single Regime Results
function SingleRegimeResults({ regime }: { regime: any }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
        <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide font-semibold mb-2">Gross Salary</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(regime.grossSalary)}</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-5 rounded-lg border border-green-300 dark:border-green-700">
        <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">✂️ Exemptions</p>
        <p className="text-3xl font-bold text-green-700 dark:text-green-400">
          {formatCurrency(regime.hraExemption + regime.ltaExemption)}
        </p>
        <p className="text-xs text-green-600 dark:text-green-500 mt-1">HRA: {formatCurrency(regime.hraExemption)}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700">
        <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">📊 Gross Total Income</p>
        <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(regime.grossTotalIncome)}</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 p-5 rounded-lg border border-orange-300 dark:border-orange-700">
        <p className="text-orange-700 dark:text-orange-300 text-xs uppercase tracking-wide font-semibold mb-2">💼 Deductions</p>
        <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(regime.totalDeductions)}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-5 rounded-lg border-2 border-purple-300 dark:border-purple-700">
        <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">🎯 Taxable Income</p>
        <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{formatCurrency(regime.taxableIncome)}</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 p-5 rounded-lg border-2 border-red-300 dark:border-red-700 shadow-lg">
        <p className="text-red-700 dark:text-red-300 text-xs uppercase tracking-wide font-semibold mb-2">🚨 Total Tax Payable</p>
        <p className="text-4xl font-bold text-red-700 dark:text-red-400">{formatCurrency(regime.totalTax)}</p>
        <p className="text-xs text-red-600 dark:text-red-500 mt-1">Rate: {regime.effectiveRate.toFixed(2)}%</p>
      </div>
    </div>
  );
}

// Regime Comparison Panel
function RegimeComparisonPanel({ oldRegime, newRegime, recommended }: { oldRegime: any; newRegime: any; recommended: string }) {
  const comparisonData = [
    { regime: 'New Regime', tax: newRegime.totalTax, color: '#3b82f6' },
    { regime: 'Old Regime', tax: oldRegime.totalTax, color: '#ef4444' },
  ];

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">New vs Old Regime Comparison</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="regime" />
              <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="tax" radius={[8, 8, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-700 dark:text-blue-400 font-semibold">New Regime</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(newRegime.totalTax)}</p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
            <p className="text-red-700 dark:text-red-400 font-semibold">Old Regime</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{formatCurrency(oldRegime.totalTax)}</p>
          </div>

          <div className={`p-4 rounded-lg border-l-4 ${
            recommended === 'new'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
              : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
          }`}>
            <p className={`font-semibold ${recommended === 'new' ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
              {recommended === 'new' ? '✅ New Regime is Better' : '✅ Old Regime is Better'}
            </p>
            <p className={`text-2xl font-bold ${recommended === 'new' ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
              Save {formatCurrency(Math.abs(newRegime.totalTax - oldRegime.totalTax))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recommendations Component
function RecommendationsSection({ recommendations }: { recommendations: TaxSavingRecommendation[] }) {
  if (recommendations.length === 0) return null;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">💡 Tax Saving Opportunities</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {recommendations.slice(0, 4).map((rec, idx) => (
          <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-700 dark:text-green-400">{rec.section}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
            <p className="text-sm mt-2">
              Current: <span className="font-bold">{formatCurrency(rec.currentAmount)}</span> / Max: {formatCurrency(rec.maxAmount || rec.gap + rec.currentAmount)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-500 font-semibold mt-1">
              Potential Saving: {formatCurrency(rec.potentialSaving)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ Component
function FAQSection() {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
      <div className="space-y-4">
        {[
          {
            q: 'What is Section 87A Rebate?',
            a: 'Section 87A provides a rebate to lower and middle-income earners. New regime: ₹60,000 rebate for taxable income ≤ ₹12L. Old regime: ₹12,500 rebate for taxable income ≤ ₹5L.',
          },
          {
            q: 'How is HRA exemption calculated?',
            a: 'HRA exemption is the MINIMUM of: (1) Actual HRA received, (2) 50% of basic salary (metro) or 40% (non-metro), (3) Rent paid minus 10% of basic salary.',
          },
          {
            q: 'Can I claim Section 80C in new regime?',
            a: 'No, new regime does not allow 80C, 80D, or other deductions. Only standard deduction (₹75,000) is allowed. Old regime allows all deductions.',
          },
          {
            q: 'What is marginal relief?',
            a: 'Marginal relief ensures that when your income crosses a tax bracket threshold (e.g., ₹12L in new regime), the tax increase should not exceed your income increase.',
          },
          {
            q: 'Can I claim LTA in both years of 4-year cycle?',
            a: 'LTA is allowed once in 4 financial years. This calculator shows LTA claimed in current FY. Ensure you haven\'t claimed in the past 3 FYs.',
          },
        ].map((item, idx) => (
          <details key={idx} className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              {item.q}
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

// Tax Saving Tips Component
function TaxSavingTips() {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">💰 Tax Saving Tips</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-400">Section 80C (₹1.5 Lakh)</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• PPF: Safe, long-term, tax-free returns</li>
            <li>• ELSS: Equity-based, 3-year lock-in, capital appreciation</li>
            <li>• Life Insurance: Protection + savings</li>
            <li>• Home Loan Principal: Build equity while saving tax</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-green-700 dark:text-green-400">Section 80D (Health Insurance)</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Buy health insurance for yourself + family</li>
            <li>• Also covers elderly parents (separate limit)</li>
            <li>• Below 60: ₹25K | Above 60: ₹50K per person</li>
            <li>• Includes preventive health checkup</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-400">Section 80CCD1B (NPS)</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Extra ₹50,000 deduction in old regime</li>
            <li>• On top of ₹1.5L 80C limit</li>
            <li>• Tax-free growth, retirement benefit</li>
            <li>• Partial withdrawal allowed at 50%</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-orange-700 dark:text-orange-400">General Tips</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Choose old regime if deductions &gt; ₹75K</li>
            <li>• File ITR within deadline to avoid penalties</li>
            <li>• Keep proofs of deductions for 6+ years</li>
            <li>• Consult CA for personalized advice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
