'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateSimpleInterest, generateSimpleInterestProjection, type TenureType } from '@/lib/calculators/simple-interest';
import { SimpleInterestSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';

type SIFormData = {
  principal: number;
  annualRate: number;
  tenureType: TenureType;
  years: number;
  months: number;
  days: number;
  tenureValue: number;
};

interface SIResultData {
  principalAmount: number;
  interestAccrued: number;
  totalMaturityValue: number;
  timeFactor: number;
  dailyAccrual?: number;
  tenure: {
    value: number;
    type: TenureType;
    inYears: number;
    inMonths: number;
    inDays: number;
  };
}

export default function SimpleInterestCalculatorPage() {
  const [result, setResult] = useState<SIResultData | null>(null);
  const [projections, setProjections] = useState<any[]>([]);

  const {
    watch,
    setValue,
    reset,
  } = useForm<SIFormData>({
    resolver: zodResolver(SimpleInterestSchema),
    defaultValues: {
      principal: 500000,
      annualRate: 9,
      tenureType: 'years',
      years: 3,
      months: 0,
      days: 0,
      tenureValue: 3,
    },
  });

  const watchValues = watch();

  const handleInputChange = (fieldName: keyof Omit<SIFormData, 'tenureType'>, value: number) => {
    setValue(fieldName as any, value, { shouldValidate: true });
  };

  const handleTenureTypeChange = (type: TenureType) => {
    setValue('tenureType', type, { shouldValidate: true });
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setProjections([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.principal && watchValues.annualRate !== undefined) {
        let tenureVal = 0;
        if (watchValues.tenureType === 'years') {
          tenureVal = watchValues.years;
        } else if (watchValues.tenureType === 'months') {
          tenureVal = watchValues.years * 12 + watchValues.months;
        } else {
          tenureVal = watchValues.years * 365 + watchValues.months * 30 + watchValues.days;
        }

        if (tenureVal > 0) {
          const result = calculateSimpleInterest({
            principal: watchValues.principal,
            annualRate: watchValues.annualRate,
            tenureValue: tenureVal,
            tenureType: watchValues.tenureType,
          });
          setResult(result);
          const projections = generateSimpleInterestProjection({
            principal: watchValues.principal,
            annualRate: watchValues.annualRate,
            tenureValue: tenureVal,
            tenureType: watchValues.tenureType,
          });
          setProjections(projections);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues]);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">📊 Simple Interest Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate SI with Years, Months, or Days. Automatic leap year detection.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>
          <form className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold">Principal (₹)</label>
              <div className="flex gap-3">
                <input
                  type="range"
                  min="10000"
                  max="100000000"
                  step="10000"
                  value={watchValues.principal || 0}
                  onChange={(e) => handleInputChange('principal', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-emerald-300 to-emerald-600 rounded-lg"
                />
                <input
                  type="number"
                  value={watchValues.principal || ''}
                  onChange={(e) => handleInputChange('principal', e.target.value ? Number(e.target.value) : 0)}
                  className="w-28 px-3 py-2 border-2 border-emerald-400 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold">Annual Rate (%)</label>
              <div className="flex gap-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.1"
                  value={watchValues.annualRate || 0}
                  onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg"
                />
                <input
                  type="number"
                  value={watchValues.annualRate || ''}
                  onChange={(e) => handleInputChange('annualRate', e.target.value ? Number(e.target.value) : 0)}
                  className="w-28 px-3 py-2 border-2 border-blue-400 rounded-lg"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold">Tenure Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['years', 'months', 'days'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTenureTypeChange(type)}
                    className={`py-2 rounded-lg text-sm font-semibold capitalize ${watchValues.tenureType === type ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold">Tenure</label>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="Years" min="0" max="50" value={watchValues.years || ''} onChange={(e) => handleInputChange('years', e.target.value ? Number(e.target.value) : 0)} className="px-2 py-1 border rounded" />
                <input type="number" placeholder="Months" min="0" max="11" value={watchValues.months || ''} onChange={(e) => handleInputChange('months', e.target.value ? Number(e.target.value) : 0)} className="px-2 py-1 border rounded" />
                <input type="number" placeholder="Days" min="0" max="365" value={watchValues.days || ''} onChange={(e) => handleInputChange('days', e.target.value ? Number(e.target.value) : 0)} className="px-2 py-1 border rounded" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Calculate</button>
              <button type="button" onClick={handleReset} className="flex-1 bg-red-500 text-white py-2 rounded">Clear</button>
            </div>
          </form>
        </div>

        <div>
          {result ? (
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Results</h2>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs font-semibold">Principal</p>
                  <p className="text-2xl font-bold">{formatCurrency(result.principalAmount)}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs font-semibold">Interest</p>
                  <p className="text-2xl font-bold">{formatCurrency(result.interestAccrued)}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs font-semibold">Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(result.totalMaturityValue)}</p>
                </div>
                {result.dailyAccrual && (
                  <div className="bg-amber-50 p-3 rounded">
                    <p className="text-xs font-semibold">Daily Accrual</p>
                    <p className="text-2xl font-bold">{formatCurrency(result.dailyAccrual)}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center">
              <p>Enter details to calculate</p>
            </div>
          )}
        </div>
      </div>

      {projections.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">📊 Projection</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-2 text-left">Period</th>
                  <th className="px-4 py-2 text-right">Interest (₹)</th>
                  <th className="px-4 py-2 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {projections.slice(0, 12).map((proj, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{proj.period}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(proj.interest)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(proj.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
