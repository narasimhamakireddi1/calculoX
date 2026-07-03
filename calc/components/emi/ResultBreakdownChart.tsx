'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface ResultBreakdownChartProps {
  principal: number;
  interest: number;
}

export function ResultBreakdownChart({ principal, interest }: ResultBreakdownChartProps) {
  const data = [
    {
      name: 'Principal',
      value: principal,
      percentage: ((principal / (principal + interest)) * 100).toFixed(1),
    },
    {
      name: 'Interest',
      value: interest,
      percentage: ((interest / (principal + interest)) * 100).toFixed(1),
    },
  ];

  const COLORS = ['#3b82f6', '#ef4444'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold">{data.payload.name}</p>
          <p className="text-sm text-gray-300">{formatCurrency(data.value)}</p>
          <p className="text-xs text-gray-400">{data.payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Loan Amount Breakdown</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationDuration={600}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => `${value}: ${formatCurrency(entry?.payload?.value || 0)}`}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">PRINCIPAL</p>
            <p className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(principal)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{((principal / (principal + interest)) * 100).toFixed(1)}% of total</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1"></div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">INTEREST</p>
            <p className="font-bold text-red-600 dark:text-red-400">{formatCurrency(interest)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{((interest / (principal + interest)) * 100).toFixed(1)}% of total</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>💡 Insight:</strong> Over your loan tenure, you pay {((interest / (principal + interest)) * 100).toFixed(0)}% more than the original loan amount as interest.
          Early repayment can significantly reduce this.
        </p>
      </div>
    </div>
  );
}
