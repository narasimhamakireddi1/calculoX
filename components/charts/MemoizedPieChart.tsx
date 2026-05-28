'use client';

import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MemoizedPieChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  title?: string;
  height?: number;
}

export const MemoizedPieChart = memo(function PieChartComponent({
  data,
  colors,
  title,
  height = 300,
}: MemoizedPieChartProps) {
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={memoizedData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={false}
          >
            {memoizedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

MemoizedPieChart.displayName = 'MemoizedPieChart';
