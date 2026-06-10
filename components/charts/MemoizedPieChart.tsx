'use client';

import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useChartColors } from './useChartColors';

interface MemoizedPieChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  title?: string;
  height?: number;
  formatter?: (value: number) => string;
}

export const MemoizedPieChart = memo(function PieChartComponent({
  data,
  colors,
  title,
  height = 300,
  formatter,
}: MemoizedPieChartProps) {
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);
  const { tooltipStyle } = useChartColors();

  return (
    <div className="w-full" role="img" aria-label={title || 'Pie chart visualization'}>
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
          <Tooltip
            formatter={(value: number) =>
              formatter ? formatter(value) : value.toLocaleString('en-IN')
            }
            contentStyle={tooltipStyle}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

MemoizedPieChart.displayName = 'MemoizedPieChart';
