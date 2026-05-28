'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import { calculateSIP } from '@/lib/calculators/sip';
import { SIPSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import ExportButton, { type FormattedInput } from '@/components/ui/ExportButton';

type SIPFormData = {
  monthlyInvestment: number;
  years: number;
  annualReturn: number;
  stepUpPercent: number;
};

interface SIPResultData {
  totalInvestment: number;
  futureValue: number;
  gainedAmount: number;
}

interface ChartDataPoint {
  month: number;
  invested: number;
  value: number;
}

interface YearlyProjection {
  year: number;
  monthlyInvestment: number;
  annualInvestment: number;
  cumulativeInvestment: number;
}

export default function SIPCalculatorPage() {
  const [result, setResult] = useState<SIPResultData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [projections, setProjections] = useState<YearlyProjection[]>([]);

  const {
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SIPFormData>({
    resolver: zodResolver(SIPSchema),
    defaultValues: {
      monthlyInvestment: 10000,
      years: 10,
      annualReturn: 12,
      stepUpPercent: 5,
    },
  });

  const watchValues = watch();

  const inputsData: FormattedInput[] = useMemo(() => {
    const data: FormattedInput[] = [];
    if (watchValues.monthlyInvestment) {
      data.push({ label: 'Monthly Investment', value: formatCurrency(watchValues.monthlyInvestment) });
    }
    if (watchValues.years) {
      data.push({ label: 'Investment Duration', value: `${watchValues.years} Year(s)` });
    }
    if (watchValues.annualReturn !== undefined) {
      data.push({ label: 'Expected Annual Return', value: `${watchValues.annualReturn}%` });
    }
    if (watchValues.stepUpPercent) {
      data.push({ label: 'Annual Step-Up', value: `${watchValues.stepUpPercent}%` });
    }
    return data;
  }, [watchValues]);

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    monthlyInvestment: { min: 100, max: 1000000, label: 'Monthly Investment (₹)' },
    years: { min: 1, max: 50, label: 'Years' },
    annualReturn: { min: 0, max: 100, label: 'Annual Return (%)' },
    stepUpPercent: { min: 0, max: 50, label: 'Step Up (%)' },
  };

  const handleInputChange = (fieldName: keyof SIPFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleValidateField = (fieldName: string, value: number) => {
    const range = fieldRanges[fieldName];
    if (range && (value < range.min || value > range.max)) {
      alert(`${range.label} must be between ${range.min} and ${range.max}`);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setChartData([]);
    setProjections([]);
  };

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.monthlyInvestment && watchValues.years && watchValues.annualReturn !== undefined) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues]);

  const calculateResults = (data: SIPFormData) => {
    const result = calculateSIP(data);
    setResult(result);

    // Generate yearly projection data
    const yearlyProj: YearlyProjection[] = [];
    let cumulativeInvestment = 0;
    const stepUpRate = (data.stepUpPercent || 0) / 100;

    for (let year = 1; year <= data.years; year++) {
      const monthlyInvestment = data.monthlyInvestment * Math.pow(1 + stepUpRate, year - 1);
      const annualInvestment = monthlyInvestment * 12;
      cumulativeInvestment += annualInvestment;

      yearlyProj.push({
        year,
        monthlyInvestment: Math.round(monthlyInvestment),
        annualInvestment: Math.round(annualInvestment),
        cumulativeInvestment: Math.round(cumulativeInvestment),
      });
    }

    setProjections(yearlyProj);

    // Generate chart data showing growth over time
    const data_points: ChartDataPoint[] = [];
    const monthlyReturn = (data.annualReturn / 12) / 100;

    for (let month = 0; month <= result.numberOfMonths; month++) {
      if (month === 0) {
        data_points.push({ month: 0, invested: 0, value: 0 });
      } else {
        // Calculate invested amount considering step-up
        let invested = 0;
        let currentMonthlyAmount = data.monthlyInvestment;

        for (let m = 1; m <= month; m++) {
          if (m > 1 && (m - 1) % 12 === 0) {
            currentMonthlyAmount = currentMonthlyAmount * (1 + stepUpRate);
          }
          invested += currentMonthlyAmount;
        }

        const rPlusOne = 1 + monthlyReturn;
        const rPowerN = Math.pow(rPlusOne, month);
        const value = data.monthlyInvestment * ((rPowerN - 1) / monthlyReturn);
        data_points.push({
          month: month,
          invested: Math.round(invested),
          value: Math.round(value),
        });
      }
    }

    setChartData(data_points);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">SIP Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate your Systematic Investment Plan (SIP) returns and projected wealth growth. See how regular monthly investments compound over time.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="sip-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>
          <form className="space-y-6">
            {/* Monthly Investment */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Monthly Investment (₹)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="100"
                  max="1000000"
                  step="100"
                  value={watchValues.monthlyInvestment === 0 ? "" : watchValues.monthlyInvestment}
                  onChange={(e) => handleInputChange('monthlyInvestment', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('monthlyInvestment', Number(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="w-full md:w-auto relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 text-green-600 font-bold text-sm">₹</span>
                  <input
                    type="number" placeholder="0"
                    min="100"
                    max="1000000"
                    step="100"
                    value={watchValues.monthlyInvestment === 0 ? "" : watchValues.monthlyInvestment}
                    onChange={(e) => handleInputChange('monthlyInvestment', e.target.value === '' ? 0 : Number(e.target.value))}
                    onBlur={(e) => handleValidateField('monthlyInvestment', Number(e.target.value))}
                    className="w-full md:w-28 px-6 py-2 pl-7 border-2 border-green-400 rounded-lg text-right font-bold text-green-700 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-green-600 dark:text-green-400"
                  />
                </div>
              </div>
              {errors.monthlyInvestment && (
                <p className="text-red-500 text-sm">{errors.monthlyInvestment.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹100 - ₹10,00,000</p>
            </div>

            {/* Years */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Investment Duration (Years)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number" placeholder="0"
                  min="0"
                  max="50"
                  step="1"
                  value={watchValues.years === 0 ? "" : watchValues.years}
                  onChange={(e) => handleInputChange('years', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="w-full md:w-28 px-3 py-2 border-2 border-blue-400 rounded-lg text-center font-bold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400"
                />
              </div>
              {errors.years && (
                <p className="text-red-500 text-sm">{errors.years.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">1 - 50 years</p>
            </div>

            {/* Annual Return */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Expected Annual Return (%)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={watchValues.annualReturn === 0 ? "" : watchValues.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualReturn', Number(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="w-full md:w-auto relative flex-shrink-0">
                  <span className="absolute right-3 top-2.5 text-orange-600 font-bold text-sm">%</span>
                  <input
                    type="number" placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    value={watchValues.annualReturn === 0 ? "" : watchValues.annualReturn}
                    onChange={(e) => handleInputChange('annualReturn', e.target.value === '' ? 0 : Number(e.target.value))}
                    onBlur={(e) => handleValidateField('annualReturn', Number(e.target.value))}
                    className="w-full md:w-20 px-3 py-2 pr-6 border-2 border-orange-400 rounded-lg text-right font-bold text-orange-700 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-orange-600 dark:text-orange-400"
                  />
                </div>
              </div>
              {errors.annualReturn && (
                <p className="text-red-500 text-sm">{errors.annualReturn.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">Typical: 8-15% for stock markets</p>
            </div>

            {/* Step Up Percentage */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Annual Step Up (%)</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={watchValues.stepUpPercent === 0 ? "" : watchValues.stepUpPercent}
                  onChange={(e) => handleInputChange('stepUpPercent', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('stepUpPercent', Number(e.target.value))}
                  className="w-full md:flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="w-full md:w-auto relative flex-shrink-0">
                  <span className="absolute right-3 top-2.5 text-purple-600 font-bold text-sm">%</span>
                  <input
                    type="number" placeholder="0"
                    min="0"
                    max="50"
                    step="0.5"
                    value={watchValues.stepUpPercent === 0 ? "" : watchValues.stepUpPercent}
                    onChange={(e) => handleInputChange('stepUpPercent', e.target.value === '' ? 0 : Number(e.target.value))}
                    onBlur={(e) => handleValidateField('stepUpPercent', Number(e.target.value))}
                    className="w-full md:w-20 px-3 py-2 pr-6 border-2 border-purple-400 rounded-lg text-right font-bold text-purple-700 bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>
              {errors.stepUpPercent && (
                <p className="text-red-500 text-sm">{errors.stepUpPercent.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">Increase investment by this % each year (0-50%)</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              🗑️ Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div id="sip-results" className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Investment Results</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Total Investment */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide font-semibold mb-2">Total Invested</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(result.totalInvestment)}
                  </p>
                </div>

                {/* Future Value - Highlighted */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-5 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-lg hover:shadow-xl transition-all">
                  <p className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wide font-semibold mb-2">🎯 Future Value (Maturity)</p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(result.futureValue)}
                  </p>
                </div>

                {/* Gain Amount */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">📈 Total Gains (Returns)</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {formatCurrency(result.gainedAmount)}
                  </p>
                </div>

                {/* Return Percentage */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-5 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">Return Rate (%)</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                    {((result.gainedAmount / result.totalInvestment) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This calculation assumes regular monthly investments and consistent returns. Actual returns may vary based on market conditions.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <ExportButton
                  fileName="SIP_Investment_Results"
                  calculatorName="SIP Calculator Results"
                  resultElementId="sip-results"
                  inputElementId="sip-inputs"
                  inputsData={inputsData}
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your investment details and click &quot;Calculate SIP&quot; to see your results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Income Projection Section */}
      {projections.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📈 Investment Projection</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Year-wise breakdown of your SIP journey with step-up increments</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800">
                  <th className="px-4 py-4 text-left font-bold text-gray-900 dark:text-white">Year</th>
                  <th className="px-4 py-4 text-right font-bold text-blue-700 dark:text-blue-400">Monthly Investment</th>
                  <th className="px-4 py-4 text-right font-bold text-green-700 dark:text-green-400">Annual Investment</th>
                  <th className="px-4 py-4 text-right font-bold text-purple-700 dark:text-purple-400">Cumulative Invested</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((proj, idx) => (
                  <tr
                    key={proj.year}
                    className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                      idx % 2 === 0
                        ? 'bg-white dark:bg-gray-800/50'
                        : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                      Year {proj.year}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        ₹{proj.monthlyInvestment.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        ₹{proj.annualInvestment.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                        ₹{proj.cumulativeInvestment.toLocaleString('en-IN')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Step-up Info Card */}
          {(watchValues.stepUpPercent || 0) > 0 && (
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-lg">
              <p className="text-sm text-purple-900 dark:text-purple-300">
                <span className="font-semibold">Step-up Active:</span> Your monthly investment increases by <span className="font-bold text-lg">{(watchValues.stepUpPercent || 0).toFixed(1)}%</span> each year. This helps your SIP grow with your income!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">📊 Growth Visualization</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  label={{ value: 'Months', position: 'insideBottomRight', offset: -5 }}
                  stroke="#6b7280"
                />
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invested"
                  stroke="#3b82f6"
                  name="Total Invested"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  name="Future Value"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          {result && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">💰 SIP Breakup</h2>
              <MemoizedPieChart
                data={[
                  { name: 'Total Invested', value: result.totalInvestment },
                  { name: 'Returns Gained', value: result.gainedAmount },
                ]}
                colors={['#3b82f6', '#10b981']}
                height={300}
              />
              <div className="space-y-2 text-sm px-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Total Invested</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">Returns Gained</span>
                  </span>
                  <span className="font-bold">{formatCurrency(result.gainedAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related Calculators */}
      <RelatedCalculators
        calculators={[
          {
            title: 'EMI Calculator',
            description: 'Calculate loan EMI and amortization schedules',
            icon: '🏦',
            href: '/emi-calculator',
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
          {
            title: 'RD Calculator',
            description: 'Calculate recurring deposit interest earnings',
            icon: '💰',
            href: '/rd-calculator',
          },
          {
            title: 'Percentage Calculator',
            description: 'Quick percentage and ratio calculations',
            icon: '🔢',
            href: '/percentage-calculator',
          },
          {
            title: 'Tax Calculator',
            description: 'Calculate income tax liability (New/Old Regime)',
            icon: '🧾',
            href: '/tax-calculator',
          },
        ]}
      />

      {/* Affiliate Banner */}
      <AffiliateBanner
        icon="📈"
        headline="Ready to Start Your SIP Investment?"
        subtext="Open a free demat account and start SIP from ₹500/month in top mutual funds."
        note="Free account · ₹0 AMC · 5-minute setup · 1 Crore+ investors"
        gradient="bg-gradient-to-r from-green-600 to-emerald-700"
        links={[
          { label: 'Start SIP on Groww →', href: 'https://groww.in', primary: true },
          { label: 'Open Zerodha Account', href: 'https://zerodha.com' },
        ]}
      />

      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is SIP?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Systematic Investment Plan (SIP) is a method of investing fixed amounts regularly in mutual funds. Instead of investing a lump sum, you invest a small amount every month, which helps in rupee cost averaging and reduces market volatility risk.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s a good expected return rate?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Expected returns vary by investment type: Equity/Stock funds: 12-15% per annum, Balanced funds: 8-10%, Debt/Bond funds: 5-7%, Bank FDs: 6-7%. Past performance doesn&apos;t guarantee future results.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s the minimum SIP amount?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Most mutual funds allow SIPs starting from ₹100-500 per month. Some funds have no minimum. Higher amounts don&apos;t necessarily give better returns, but consistent investing does.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is Step Up in SIP?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Step Up SIP allows you to increase your monthly investment by a fixed percentage each year. For example, with 10% step-up on a ₹10,000 SIP: Year 1 = ₹10,000/month, Year 2 = ₹11,000/month, Year 3 = ₹12,100/month, etc. This is ideal as your income grows and you can afford higher investments.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

