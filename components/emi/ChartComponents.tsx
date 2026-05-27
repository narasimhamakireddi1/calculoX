'use client';

import { memo, useMemo } from 'react';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface EMIResultData {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  numberOfMonths: number;
}

interface ChartsProps {
  result: EMIResultData;
  schedule: AmortizationRow[];
}

const COLORS = ['#3b82f6', '#ef4444'];

// Memoized line chart component
const LineChartSection = memo(({ chartData }: { chartData: AmortizationRow[] }) => (
  <div className="card">
    <h2 className="text-2xl font-bold mb-6">Repayment Breakdown Over Time</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          label={{ value: 'Months', position: 'insideBottomRight', offset: -5 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="principal"
          stroke="#3b82f6"
          name="Principal Paid"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="interest"
          stroke="#ef4444"
          name="Interest Paid"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#10b981"
          name="Remaining Balance"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
));

LineChartSection.displayName = 'LineChartSection';

// Memoized pie chart component
const PieChartSection = memo(({ pieData, result }: { pieData: any[]; result: EMIResultData }) => (
  <div className="card">
    <h2 className="text-2xl font-bold mb-6">Principal vs Interest</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={false}
        >
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
));

PieChartSection.displayName = 'PieChartSection';

// Main charts component
export const ChartsSection = memo(({ result, schedule }: ChartsProps) => {
  // Memoize chart data calculations
  const chartData = useMemo(() => {
    return schedule.filter((row) => row.month % 12 === 0);
  }, [schedule]);

  const pieData = useMemo(() => {
    return [
      { name: 'Principal', value: result.totalAmount - result.totalInterest },
      { name: 'Interest', value: result.totalInterest },
    ];
  }, [result]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 will-change-contents">
      <LineChartSection chartData={chartData} />
      <PieChartSection pieData={pieData} result={result} />
    </div>
  );
});

ChartsSection.displayName = 'ChartsSection';
