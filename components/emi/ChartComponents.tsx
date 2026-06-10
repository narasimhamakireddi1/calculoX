'use client';

import { memo, useMemo } from 'react';
import { AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';
import { useChartColors } from '@/components/charts/useChartColors';

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

const PIE_COLORS = ['#3b82f6', '#ef4444'];

// Memoized area chart component
const LineChartSection = memo(({ chartData }: { chartData: AmortizationRow[] }) => {
  const { tooltipStyle, gridColor, axisColor, axisFill } = useChartColors();

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Repayment Breakdown Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="emiPrincipalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="emiInterestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="emiBalanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            label={{ value: 'Months', position: 'insideBottomRight', offset: -5 }}
            stroke={axisColor}
            tick={{ fill: axisFill, fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
            stroke={axisColor}
            tick={{ fill: axisFill, fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={tooltipStyle}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="principal"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#emiPrincipalGrad)"
            name="Principal Paid"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="interest"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#emiInterestGrad)"
            name="Interest Paid"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#emiBalanceGrad)"
            name="Remaining Balance"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

LineChartSection.displayName = 'LineChartSection';

// Memoized pie chart component
const PieChartSection = memo(({ pieData, result }: { pieData: any[]; result: EMIResultData }) => {
  const { tooltipStyle } = useChartColors();

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Principal vs Interest</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={false}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={tooltipStyle}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend />
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
  );
});

PieChartSection.displayName = 'PieChartSection';

// Main charts component
export const ChartsSection = memo(({ result, schedule }: ChartsProps) => {
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
