'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateSIP } from '@/lib/calculators/sip';
import { SIPSchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';

type SIPFormData = {
  monthlyInvestment: number;
  years: number;
  annualReturn: number;
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

export default function SIPCalculatorPage() {
  const [result, setResult] = useState<SIPResultData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SIPFormData>({
    resolver: zodResolver(SIPSchema),
    defaultValues: {
      monthlyInvestment: 10000,
      years: 10,
      annualReturn: 12,
    },
  });

  const watchValues = watch();

  const onSubmit = (data: SIPFormData) => {
    const result = calculateSIP(data);
    setResult(result);

    // Generate chart data showing growth over time
    const data_points: ChartDataPoint[] = [];
    const monthlyReturn = (data.annualReturn / 12) / 100;

    for (let month = 0; month <= result.numberOfMonths; month++) {
      const invested = data.monthlyInvestment * month;

      if (month === 0) {
        data_points.push({ month: 0, invested: 0, value: 0 });
      } else {
        const rPlusOne = 1 + monthlyReturn;
        const rPowerN = Math.pow(rPlusOne, month);
        const value = data.monthlyInvestment * ((rPowerN - 1) / monthlyReturn);
        data_points.push({
          month: month,
          invested: invested,
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
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Investment Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Monthly Investment */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Monthly Investment (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  placeholder="10000"
                  {...register('monthlyInvestment', { valueAsNumber: true })}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              {errors.monthlyInvestment && (
                <p className="text-red-500 text-sm mt-1">{errors.monthlyInvestment.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Minimum ₹100, Maximum ₹1 Crore</p>
            </div>

            {/* Years */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Investment Duration
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  {...register('years', { valueAsNumber: true })}
                  className="flex-1"
                />
                <div className="text-lg font-bold text-blue-600 min-w-fit">
                  {watchValues.years || 10} years
                </div>
              </div>
              {errors.years && (
                <p className="text-red-500 text-sm mt-1">{errors.years.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">1 to 50 years</p>
            </div>

            {/* Annual Return */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Expected Annual Return (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  {...register('annualReturn', { valueAsNumber: true })}
                  className="flex-1"
                />
                <div className="text-lg font-bold text-blue-600 min-w-fit">
                  {(watchValues.annualReturn || 12).toFixed(1)}%
                </div>
              </div>
              {errors.annualReturn && (
                <p className="text-red-500 text-sm mt-1">{errors.annualReturn.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Typical: 8-15% for stock markets</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Calculate SIP
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Investment Results</h2>

              <div className="space-y-4">
                {/* Total Investment */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Total Investment</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(result.totalInvestment)}
                  </p>
                </div>

                {/* Future Value */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <p className="text-green-700 dark:text-green-400 text-sm mb-1">Future Value (Maturity Amount)</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(result.futureValue)}
                  </p>
                </div>

                {/* Gain Amount */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-400 text-sm mb-1">Total Gain (Returns)</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {formatCurrency(result.gainedAmount)}
                  </p>
                </div>

                {/* Return Percentage */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-purple-700 dark:text-purple-400 text-sm mb-1">Return on Investment</p>
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

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Growth Visualization</h2>
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
      )}

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
        </div>
      </div>
    </div>
  );
}
