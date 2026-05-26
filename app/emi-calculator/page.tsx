'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateEMI, generateAmortizationSchedule } from '@/lib/calculators/emi';
import { EMISchema } from '@/lib/validators';
import { formatCurrency } from '@/lib/utils/format';

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

export default function EMICalculatorPage() {
  const [result, setResult] = useState<EMIResultData | null>(null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EMIFormData>({
    resolver: zodResolver(EMISchema),
    defaultValues: {
      principal: 1000000,
      annualRate: 8,
      years: 10,
    },
  });

  const watchValues = watch();

  const onSubmit = (data: EMIFormData) => {
    const result = calculateEMI(data);
    setResult(result);
    const schedule = generateAmortizationSchedule(data, result);
    setSchedule(schedule);
  };

  // Generate chart data (every 12th month for cleaner chart)
  const chartData = useMemo(() => {
    return schedule.filter((row) => row.month % 12 === 0);
  }, [schedule]);

  // Generate pie chart data
  const pieData = result
    ? [
        { name: 'Principal', value: result.totalAmount - result.totalInterest },
        { name: 'Interest', value: result.totalInterest },
      ]
    : [];

  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">EMI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate your Equated Monthly Installment (EMI) for loans. View total interest, amortization schedule, and repayment breakdown.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Loan Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Principal */}
            <div>
              <label className="block text-sm font-semibold mb-2">Loan Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  placeholder="1000000"
                  {...register('principal', { valueAsNumber: true })}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              {errors.principal && (
                <p className="text-red-500 text-sm mt-1">{errors.principal.message}</p>
              )}
            </div>

            {/* Annual Rate */}
            <div>
              <label className="block text-sm font-semibold mb-2">Annual Interest Rate (%)</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="8"
                  {...register('annualRate', { valueAsNumber: true })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <span className="text-lg font-bold text-blue-600 min-w-fit">{(watchValues.annualRate || 8).toFixed(2)}%</span>
              </div>
              {errors.annualRate && (
                <p className="text-red-500 text-sm mt-1">{errors.annualRate.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Current typical rate: 6-10%</p>
            </div>

            {/* Loan Tenure */}
            <div>
              <label className="block text-sm font-semibold mb-2">Loan Tenure (Years)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="30"
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
              <p className="text-xs text-gray-500 mt-1">1 to 30 years</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Calculate EMI
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Loan Summary</h2>

              <div className="space-y-4">
                {/* Monthly EMI */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-400 text-sm mb-1">Monthly EMI</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {formatCurrency(result.emi)}
                  </p>
                </div>

                {/* Total Amount */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Total Amount Payable</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(result.totalAmount)}
                  </p>
                </div>

                {/* Total Interest */}
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-2 border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-400 text-sm mb-1">Total Interest Payable</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-400">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>

                {/* Duration */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-purple-700 dark:text-purple-400 text-sm mb-1">Loan Duration</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                    {result.numberOfMonths} months
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  EMI calculated based on monthly compounding at the specified interest rate.
                </p>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your loan details and click &quot;Calculate EMI&quot; to see results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      {result && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Repayment Breakdown Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottomRight', offset: -5 }} />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="principal" stroke="#3b82f6" name="Principal Paid" strokeWidth={2} />
                <Line type="monotone" dataKey="interest" stroke="#ef4444" name="Interest Paid" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" stroke="#10b981" name="Remaining Balance" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Principal vs Interest</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Principal Amount:</span>
                <span className="font-semibold text-blue-600">{formatCurrency(result.totalAmount - result.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Interest:</span>
                <span className="font-semibold text-red-600">{formatCurrency(result.totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span className="font-semibold">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amortization Schedule */}
      {result && schedule.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Amortization Schedule</h2>
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {showFullSchedule ? 'Show First 12 Months' : 'Show All'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Month</th>
                  <th className="text-right py-3 px-4 font-semibold">Payment</th>
                  <th className="text-right py-3 px-4 font-semibold">Principal</th>
                  <th className="text-right py-3 px-4 font-semibold">Interest</th>
                  <th className="text-right py-3 px-4 font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {(showFullSchedule ? schedule : schedule.slice(0, 12)).map((row) => (
                  <tr key={row.month} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.month}</td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-semibold">{formatCurrency(row.payment)}</td>
                    <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">{formatCurrency(row.principal)}</td>
                    <td className="py-3 px-4 text-right text-red-600 dark:text-red-400">{formatCurrency(row.interest)}</td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Showing {showFullSchedule ? 'all' : 'first 12'} months. Click &quot;Show All&quot; to view complete schedule.
          </p>
        </div>
      )}

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
