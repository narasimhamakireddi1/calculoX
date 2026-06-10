'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { ComprehensiveTaxSchema } from '@/lib/validators';
import { calculateComprehensiveTax } from '@/lib/tax-engine/calculator';
import { ComprehensiveTaxInput, ComprehensiveTaxResult } from '@/lib/tax-engine/types';
import { formatCurrency } from '@/lib/utils/format';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
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

export default function TaxCalculator() {
  const [result, setResult] = useState<ComprehensiveTaxResult | null>(null);

  const { register, watch, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(ComprehensiveTaxSchema),
    defaultValues: {
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
    },
  });

  const watchValues = watch();

  const haptic = useHapticFeedback();

  const calculateResults = (data: FormData) => {
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

    try {
      const calculatedResult = calculateComprehensiveTax(input);
      setResult(calculatedResult);
    } catch (error) {
      console.error('Tax calculation error:', error);
    }
  };

  const handleInputChange = (fieldName: keyof FormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleReset = useCallback(() => {
    haptic.trigger('warning');
    reset();
    setResult(null);
  }, [reset, haptic]);

  // Quick-start scenarios
  const taxScenarios: QuickStartScenario[] = useMemo(() => [
    {
      label: 'Mid-Level Professional',
      description: '₹12,00,000/year salary',
      icon: '👨‍💼',
      values: { grossSalary: 1200000, hra: 0, standardDeduction: 0, '80C': 150000, '80D': 25000, regime: 'new', age: 'below60', city: 'metro', childrenCount: 0 }
    },
    {
      label: 'Senior Executive',
      description: '₹50,00,000/year + investments',
      icon: '💼',
      values: { grossSalary: 5000000, hra: 500000, standardDeduction: 50000, '80C': 150000, '80D': 50000, regime: 'old', age: 'below60', city: 'metro', childrenCount: 2 }
    },
    {
      label: 'Senior Citizen',
      description: '₹25,00,000/year, above 60',
      icon: '👴',
      values: { grossSalary: 2500000, hra: 0, standardDeduction: 0, '80C': 150000, '80D': 50000, regime: 'new', age: 'above60', city: 'metro', childrenCount: 0 }
    }
  ], []);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as any, value, { shouldValidate: true });
    });
  }, [setValue]);

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
  }, [watchValues]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gradient">📋 Income Tax Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">FY 2025-26 | AY 2026-27 | Old & New Regime</p>
        </div>

        <ConfidenceBadge calculatorType="tax" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div id="tax-inputs" className="lg:col-span-1 space-y-6">
            {/* Quick-Start Examples */}
            <QuickStartExamples
              scenarios={taxScenarios}
              onSelectScenario={handleSelectScenario}
            />

            {/* Personal Details */}
            <div className="card p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">👤 Personal Details</h2>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Age Group</label>
                <div className="space-y-2">
                  {(['below60', 'between60to80', 'above80'] as const).map((age) => (
                    <label key={age} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={age}
                        {...register('age')}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {age === 'below60' ? 'Below 60 years' : age === 'between60to80' ? '60-80 years' : '80+ years'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Income Details */}
            <div className="card p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">💰 Income Details</h2>

              <div className="space-y-4">
                {/* Gross Salary */}
                <div>
                  <label htmlFor="gross-salary" className="block text-xs uppercase tracking-wide font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    Gross Salary
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="10000"
                      value={watchValues.grossSalary ?? 0}
                      onChange={(e) => handleInputChange('grossSalary', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-blue-600 dark:text-blue-400 font-bold text-xs md:text-sm">₹</span>
                      <input
                        id="gross-salary"
                        type="number"
                        min="0"
                        value={watchValues.grossSalary === 0 ? '' : watchValues.grossSalary}
                        onChange={(e) => handleInputChange('grossSalary', e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val < 100000) alert('Gross Salary must be at least ₹1,00,000');
                        }}
                        className="w-full md:w-28 px-3 py-3 pl-8 md:pl-7 border-2 border-blue-400 rounded-lg text-right font-bold text-blue-700 bg-blue-50 dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹1L - ₹1Cr</p>
                  <div className="flex gap-2 flex-wrap mt-3">
                    {[500000, 800000, 1200000, 2000000].map(val => (
                      <button key={val} type="button" onClick={() => handleInputChange('grossSalary', val)}
                        className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                                   bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                                   hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                        ₹{val >= 1000000 ? `${val / 1000000}Cr` : `${val / 100000}L`}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 New regime is often better for salaries without deductions. Old regime better if you maximize 80C deductions
                  </p>
                </div>

                {/* House Property Income */}
                <div>
                  <label htmlFor="house-property" className="block text-xs uppercase tracking-wide font-semibold text-orange-700 dark:text-orange-400 mb-2">
                    Income from House Property (₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={watchValues.incomeHouseProperty ?? 0}
                      onChange={(e) => handleInputChange('incomeHouseProperty', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-orange-600 dark:text-orange-400 font-bold text-xs md:text-sm">₹</span>
                      <input
                        id="house-property"
                        type="number"
                        min="0"
                        value={watchValues.incomeHouseProperty === 0 ? '' : watchValues.incomeHouseProperty}
                        onChange={(e) => handleInputChange('incomeHouseProperty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 pl-8 md:pl-7 border-2 border-orange-400 rounded-lg text-right font-bold text-orange-700 bg-orange-50 dark:bg-gray-700 dark:border-orange-600 dark:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Net rental income after 30% deduction</p>
                </div>

                {/* Other Sources Income */}
                <div>
                  <label htmlFor="other-sources" className="block text-xs uppercase tracking-wide font-semibold text-purple-700 dark:text-purple-400 mb-2">
                    Income from Other Sources (₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={watchValues.incomeOtherSources ?? 0}
                      onChange={(e) => handleInputChange('incomeOtherSources', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-purple-600 dark:text-purple-400 font-bold text-xs md:text-sm">₹</span>
                      <input
                        id="other-sources"
                        type="number"
                        min="0"
                        value={watchValues.incomeOtherSources === 0 ? '' : watchValues.incomeOtherSources}
                        onChange={(e) => handleInputChange('incomeOtherSources', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 pl-8 md:pl-7 border-2 border-purple-400 rounded-lg text-right font-bold text-purple-700 bg-purple-50 dark:bg-gray-700 dark:border-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">FD interest, capital gains, etc.</p>
                </div>
              </div>
            </div>

            {/* HRA Details */}
            <details className="card p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer group" open>
              <summary className="flex justify-between items-center font-bold text-lg mb-4 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                <span>🏠 HRA Calculation</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>

              <div className="space-y-4 mt-4">
                {/* Basic Salary */}
                <div>
                  <label htmlFor="basic-salary" className="block text-xs uppercase tracking-wide font-semibold text-green-700 dark:text-green-400 mb-2">
                    Basic Salary
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={watchValues.basicSalary ?? 0}
                      onChange={(e) => handleInputChange('basicSalary', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-green-600 dark:text-green-400 font-bold text-xs md:text-sm">₹</span>
                      <input
                        id="basic-salary"
                        type="number"
                        min="0"
                        value={watchValues.basicSalary === 0 ? '' : watchValues.basicSalary}
                        onChange={(e) => handleInputChange('basicSalary', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 pl-8 md:pl-7 border-2 border-green-400 rounded-lg text-right font-bold text-green-700 bg-green-50 dark:bg-gray-700 dark:border-green-600 dark:text-green-400 focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* HRA Received */}
                <div>
                  <label htmlFor="hra-received" className="block text-xs uppercase tracking-wide font-semibold text-red-700 dark:text-red-400 mb-2">
                    HRA Received (₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={watchValues.hraReceived ?? 0}
                      onChange={(e) => handleInputChange('hraReceived', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-red-300 to-red-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-red-600 dark:text-red-400 font-bold text-xs md:text-sm">₹</span>
                      <input
                        id="hra-received"
                        type="number"
                        min="0"
                        value={watchValues.hraReceived === 0 ? '' : watchValues.hraReceived}
                        onChange={(e) => handleInputChange('hraReceived', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 pl-8 md:pl-7 border-2 border-red-400 rounded-lg text-right font-bold text-red-700 bg-red-50 dark:bg-gray-700 dark:border-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Rent Paid */}
                <div>
                  <label htmlFor="rent-paid" className="block text-xs uppercase tracking-wide font-semibold text-amber-700 dark:text-amber-400 mb-2">
                    Rent Paid (Annual, ₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={watchValues.rentPaid ?? 0}
                      onChange={(e) => handleInputChange('rentPaid', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-amber-300 to-amber-600 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-amber-600 dark:text-amber-400 font-bold text-xs md:text-sm">₹</span>
                      <input
                        id="rent-paid"
                        type="number"
                        min="0"
                        value={watchValues.rentPaid === 0 ? '' : watchValues.rentPaid}
                        onChange={(e) => handleInputChange('rentPaid', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 pl-8 md:pl-7 border-2 border-amber-400 rounded-lg text-right font-bold text-amber-700 bg-amber-50 dark:bg-gray-700 dark:border-amber-600 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* City Type */}
                <div>
                  <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City Type
                  </label>
                  <div className="flex gap-2">
                    {(['metro', 'non-metro'] as const).map((city) => (
                      <label key={city} className="flex-1 flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value={city}
                          {...register('cityType')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{city === 'metro' ? 'Metro' : 'Non-Metro'}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Metro: Mumbai, Delhi, Kolkata, Chennai</p>
                </div>

                {/* LTA */}
                <div>
                  <label htmlFor="lta-claimed" className="block text-xs uppercase tracking-wide font-semibold text-cyan-700 dark:text-cyan-400 mb-2">
                    LTA Claimed (₹)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={watchValues.lta ?? 0}
                      onChange={(e) => handleInputChange('lta', Number(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-cyan-300 to-cyan-600 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    />
                    <div className="w-full md:w-auto relative flex-shrink-0">
                      <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 text-cyan-600 dark:text-cyan-400 font-bold text-xs md:text-sm">₹</span>
                      <input
                        id="lta-claimed"
                        type="number"
                        min="0"
                        value={watchValues.lta === 0 ? '' : watchValues.lta}
                        onChange={(e) => handleInputChange('lta', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full md:w-28 px-3 py-3 pl-8 md:pl-7 border-2 border-cyan-400 rounded-lg text-right font-bold text-cyan-700 bg-cyan-50 dark:bg-gray-700 dark:border-cyan-600 dark:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Leave Travel Allowance (Old Regime only)</p>
                </div>
              </div>
            </details>

            {/* Tax Regime */}
            <div className="card p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🏛️ Tax Regime</h2>

              <div className="space-y-3">
                {(['new', 'old', 'auto'] as const).map((reg) => (
                  <label key={reg} className="flex items-start cursor-pointer p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      value={reg}
                      {...register('regime')}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                        {reg === 'new' ? 'New Regime (Default)' : reg === 'old' ? 'Old Regime' : 'Auto (Best Choice)'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {reg === 'new'
                          ? '₹75K deduction, no deductions allowed'
                          : reg === 'old'
                          ? '₹50K deduction, all deductions allowed'
                          : 'Calculate both and choose better'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Deductions (conditionally shown) */}
            {(watchValues.regime === 'old' || watchValues.regime === 'auto') && (
              <details className="card p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 cursor-pointer group" open>
                <summary className="flex justify-between items-center font-bold text-lg mb-4 text-gray-900 dark:text-white hover:text-blue-600">
                  <span>📊 Deductions (Old Regime)</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>

                <div className="space-y-4 mt-4">
                  {/* Section 80C */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Section 80C Total (Max ₹1.5L) - includes EPF ₹{(watchValues.epfEmployee ?? 0).toLocaleString('en-IN')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        max="1500000"
                        {...register('epf', { valueAsNumber: true })}
                        className="w-full px-3 py-2 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Section 80D */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Section 80D - Health Insurance (Self & Family)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        {...register('healthInsuranceSelf', { valueAsNumber: true })}
                        className="w-full px-3 py-2 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Section 80D Parents */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Section 80D - Health Insurance (Parents)
                    </label>
                    <div className="flex gap-2 mb-2">
                      {(['below60', 'above60'] as const).map((age) => (
                        <label key={age} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            value={age}
                            {...register('parentsAge')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{age === 'below60' ? 'Below 60' : '60+'}</span>
                        </label>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        {...register('healthInsuranceParents', { valueAsNumber: true })}
                        className="w-full px-3 py-2 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Section 24b */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Home Loan Interest - Sec 24(b) (Max ₹2L)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        max="200000"
                        {...register('homeLoanInterest', { valueAsNumber: true })}
                        className="w-full px-3 py-2 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* NPS Additional */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      NPS Additional - Sec 80CCD(1B) (Max ₹50K)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        {...register('npsAdditional', { valueAsNumber: true })}
                        className="w-full px-3 py-2 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </details>
            )}

            {/* NPS Employer (Both Regimes) */}
            <div className="card p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">💼 NPS Employer - Sec 80CCD(2)</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Allowed in both Old and New Regime</p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  min="0"
                  {...register('npsEmployerContribution', { valueAsNumber: true })}
                  className="w-full px-3 py-2 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg text-right dark:bg-gray-700 dark:text-gray-300"
                  placeholder="0"
                />
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

          {/* Results Section */}
          {result && (
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Cards */}
              {getRegimeResult() && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all">
                    <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-1">Total Income</p>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400 break-words overflow-hidden">
                      {formatCurrency(getRegimeResult()!.grossSalary + (getRegimeResult()!.grossTotalIncome - (getRegimeResult()!.grossSalary - getRegimeResult()!.standardDeduction)))}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-5 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all">
                    <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-1">
                      Net Taxable Income ({result.recommended === 'new' ? 'New' : 'Old'})
                    </p>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-400 break-words overflow-hidden">
                      {formatCurrency(getRegimeResult()!.taxableIncome)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 p-5 rounded-lg border-2 border-orange-300 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all">
                    <p className="text-orange-700 dark:text-orange-300 text-xs uppercase tracking-wide font-semibold mb-1">Slab Tax (Before Rebate)</p>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-400 break-words overflow-hidden">
                      {formatCurrency(getRegimeResult()!.slabTax)}
                    </p>
                  </div>

                  <div
                    className={`bg-gradient-to-br ${
                      getRegimeResult()!.totalTax === 0
                        ? 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700'
                        : 'from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-300 dark:border-red-700'
                    } p-5 rounded-lg border-2 shadow-lg hover:shadow-xl transition-all`}
                  >
                    <p
                      className={`${
                        getRegimeResult()!.totalTax === 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                      } text-xs uppercase tracking-wide font-semibold mb-1`}
                    >
                      Total Tax Payable
                    </p>
                    <p
                      className={`text-xl sm:text-3xl md:text-4xl font-bold break-words overflow-hidden ${
                        getRegimeResult()!.totalTax === 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {formatCurrency(getRegimeResult()!.totalTax)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Effective Rate: {getRegimeResult()!.effectiveRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Regime Comparison */}
              <div id="tax-results" className="card bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📊 Regime Comparison</h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      result.recommended === 'new'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white mb-2">New Regime</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(result.newRegime.totalTax)}</p>
                    {result.recommended === 'new' && <p className="text-xs text-green-700 dark:text-green-400 mt-2">✓ Recommended</p>}
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 ${
                      result.recommended === 'old'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white mb-2">Old Regime</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{formatCurrency(result.oldRegime.totalTax)}</p>
                    {result.recommended === 'old' && <p className="text-xs text-green-700 dark:text-green-400 mt-2">✓ Recommended</p>}
                  </div>
                </div>

                {result.savings > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      💰 You can save {formatCurrency(result.savings)} by choosing {result.recommended === 'new' ? 'New' : 'Old'} Regime
                    </p>
                  </div>
                )}

                {/* Explanation Section */}
                <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-300 dark:border-amber-800">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-3">📚 How Your Tax is Calculated</h4>
                  <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
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
                <div className="mt-6">
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
                      { label: 'Recommended Regime', value: result?.recommended === 'new' ? 'New Regime' : 'Old Regime' }
                    ]}
                    calculatorName="Income Tax Calculator"
                  />
                </div>
              </div>

              {/* How Do You Compare */}
              {getRegimeResult() && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📊 How Do You Compare?</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    You save <strong>{formatCurrency(result.savings)}</strong> by choosing the <strong>{result.recommended === 'new' ? 'New' : 'Old'}</strong> regime. With an effective tax rate of <strong>{getRegimeResult()!.effectiveRate.toFixed(2)}%</strong>, your deductions and income level position you well. Consider maximizing 80C (₹1.5L), 80D (health insurance), and 24(b) (₹2L home loan interest) in the Old Regime for additional tax savings.
                  </p>
                </div>
              )}

              {/* Income Breakup Pie Chart */}
              {getRegimeResult() && (
                <div className="card">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">💰 Income Breakup ({result.recommended === 'new' ? 'New' : 'Old'} Regime)</h3>
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
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full inline-block bg-green-500" />
                          <span className="text-gray-600 dark:text-gray-400">Take-Home Pay</span>
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(getRegimeResult()!.grossSalary - getRegimeResult()!.totalTax)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full inline-block bg-red-500" />
                          <span className="text-gray-600 dark:text-gray-400">Tax Payable</span>
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(getRegimeResult()!.totalTax)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/20 dark:to-red-900/20 rounded-lg border-t-2 border-gray-300 dark:border-gray-700 mt-2 pt-4">
                        <span className="text-gray-600 dark:text-gray-400 font-semibold">Gross Income</span>
                        <span className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(getRegimeResult()!.grossSalary)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 mt-2">
                        <span className="text-gray-600 dark:text-gray-400 font-semibold">Effective Tax Rate</span>
                        <span className="font-bold text-blue-700 dark:text-blue-400 text-lg">{getRegimeResult()!.effectiveRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slab Breakdown */}
              <details className="card bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer group" open>
                <summary className="flex justify-between items-center font-bold text-lg mb-4 text-gray-900 dark:text-white hover:text-blue-600">
                  <span>📈 Slab Tax Breakdown</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>

                {getRegimeResult() && (
                  <div className="overflow-x-auto mt-4">
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

              {/* Calculation Trace */}
              <details className="card bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer group">
                <summary className="flex justify-between items-center font-bold text-lg mb-4 text-gray-900 dark:text-white hover:text-blue-600">
                  <span>🔍 Detailed Calculation Trace</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>

                {getRegimeResult() && (
                  <div className="space-y-3 mt-4 text-sm">
                    {getRegimeResult()!.trace.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.step}</p>
                          <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white ml-4 flex-shrink-0">{formatCurrency(item.value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </details>

              {/* Tax Saving Tips */}
              {result.recommendations.length > 0 && (
                <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">💡 Tax Saving Opportunities</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.recommendations.slice(0, 4).map((rec, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-300 dark:border-blue-600">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{rec.section}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400 mt-2">
                          Save up to {formatCurrency(rec.potentialSaving)}
                        </p>
                      </div>
                    ))}
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
                          <td className="py-3 px-4 font-semibold">Upto ₹3 Lakh</td>
                          <td className="text-center py-3 px-4">Nil (0%)</td>
                          <td className="text-center py-3 px-4">₹0</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-semibold">₹3L - ₹6L</td>
                          <td className="text-center py-3 px-4">5%</td>
                          <td className="text-center py-3 px-4">₹15,000</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-semibold">₹6L - ₹9L</td>
                          <td className="text-center py-3 px-4">10%</td>
                          <td className="text-center py-3 px-4">₹30,000</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-semibold">₹9L - ₹12L</td>
                          <td className="text-center py-3 px-4">15%</td>
                          <td className="text-center py-3 px-4">₹45,000</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-semibold">₹12L - ₹15L</td>
                          <td className="text-center py-3 px-4">20%</td>
                          <td className="text-center py-3 px-4">₹60,000</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-semibold">Above ₹15L</td>
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
                    <div className="border-l-4 border-green-600 pl-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">🆕 New Regime (Default)</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3"><strong>Lower tax rates, no deductions (except specific ones)</strong></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2"><strong>Pros:</strong> Lower tax rates, rebate up to ₹60K, standard deduction of ₹75K</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Cons:</strong> No HRA, LTA, 80C, 80D deductions</p>
                    </div>
                    <div className="border-l-4 border-blue-600 pl-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">🕐 Old Regime</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3"><strong>Higher rates, but maximum deductions available</strong></p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2"><strong>Pros:</strong> HRA, LTA, 80C, 80D, 24b deductions allowed</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Cons:</strong> Higher tax rates, complex calculations</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Verdict:</strong> Old Regime is better if your deductions (HRA + 80C + 80D) exceed ₹5-7 lakhs. New Regime is better for those with minimal deductions. Always calculate both and choose the one that gives lower tax!
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">❓ FAQs</h3>
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
                        <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-sm text-gray-600 dark:text-gray-400 py-2 ml-4">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Related Calculators */}
              <RelatedCalculators calculators={getInternalLinks('tax-calculator')} />

              {/* Affiliate Banner */}
              <AffiliateBanner
                icon="🧮"
                headline="File Your ITR Correctly"
                subtext="Use ClearTax for accurate ITR filing with expert guidance"
                note="Get personalized tax saving tips tailored to your income"
                links={[
                  { label: 'File ITR with ClearTax', href: 'https://cleartax.in' },
                  { label: 'ITR Filing Guide', href: 'https://cleartax.in/s/itr-filing' },
                ]}
                gradient="from-orange-300 to-orange-600"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
