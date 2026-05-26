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
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EMIFormData>({
    resolver: zodResolver(EMISchema),
    defaultValues: {
      principal: 1000000,
      annualRate: 8,
      years: 10,
    },
  });

  const watchValues = watch();

  const fieldRanges: Record<string, { min: number; max: number; label: string }> = {
    principal: { min: 10000, max: 100000000, label: 'Loan Amount (₹)' },
    annualRate: { min: 0, max: 50, label: 'Annual Rate (%)' },
    years: { min: 1, max: 50, label: 'Years' },
  };

  const handleInputChange = (fieldName: keyof EMIFormData, value: number) => {
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
    setSchedule([]);
    setShowFullSchedule(false);
  };

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
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Loan Amount (₹)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={watchValues.principal || 1000000}
                  onChange={(e) => handleInputChange('principal', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute left-2 top-2.5 text-blue-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={watchValues.principal || 1000000}
                    onChange={(e) => handleInputChange('principal', Number(e.target.value))}
                    onBlur={(e) => handleValidateField('principal', Number(e.target.value))}
                    className="w-32 px-6 py-2 pl-7 border-2 border-blue-400 rounded-lg text-right font-bold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
              {errors.principal && (
                <p className="text-red-500 text-sm">{errors.principal.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">₹10,000 - ₹1 Crore</p>
            </div>

            {/* Annual Rate */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Annual Interest Rate (%)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={watchValues.annualRate || 8}
                  onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute right-3 top-2.5 text-orange-600 font-bold text-sm">%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={watchValues.annualRate || 8}
                    onChange={(e) => handleInputChange('annualRate', Number(e.target.value))}
                    onBlur={(e) => handleValidateField('annualRate', Number(e.target.value))}
                    className="w-20 px-3 py-2 pr-6 border-2 border-orange-400 rounded-lg text-right font-bold text-orange-700 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-orange-600 dark:text-orange-400"
                  />
                </div>
              </div>
              {errors.annualRate && (
                <p className="text-red-500 text-sm">{errors.annualRate.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">Typical: 6-10%</p>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Loan Tenure (Years)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={watchValues.years || 10}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  value={watchValues.years || 10}
                  onBlur={(e) => handleValidateField('years', Number(e.target.value))}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  className="w-28 px-3 py-2 border-2 border-green-400 rounded-lg text-center font-bold text-green-700 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-green-600 dark:text-green-400"
                />
              </div>
              {errors.years && (
                <p className="text-red-500 text-sm">{errors.years.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">1 - 30 years</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                💳 Calculate EMI
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                🗑️ Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div className="card space-y-4">
              <h2 className="text-2xl font-bold mb-6">Loan Summary</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Monthly EMI - Highlighted */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-5 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all">
                  <p className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide font-semibold mb-2">💰 Monthly EMI</p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">
                    {formatCurrency(result.emi)}
                  </p>
                </div>

                {/* Total Amount */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide font-semibold mb-2">Total Payable</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(result.totalAmount)}
                  </p>
                </div>

                {/* Total Interest */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 p-5 rounded-lg border-2 border-red-300 dark:border-red-700 shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-red-700 dark:text-red-300 text-xs uppercase tracking-wide font-semibold mb-2">📊 Total Interest</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-400">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>

                {/* Duration */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-5 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wide font-semibold mb-2">Duration</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                    {result.numberOfMonths} <span className="text-xl">months</span>
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
