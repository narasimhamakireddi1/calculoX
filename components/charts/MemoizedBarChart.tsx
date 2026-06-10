'use client';

import { memo, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartColors } from './useChartColors';

interface MemoizedBarChartProps {
  data: Array<{ [key: string]: any }>;
  bars: Array<{ key: string; fill: string; name: string }>;
  title?: string;
  height?: number;
  xAxisKey?: string;
}

export const MemoizedBarChart = memo(function BarChartComponent({
  data,
  bars,
  title,
  height = 300,
  xAxisKey = 'year',
}: MemoizedBarChartProps) {
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);
  const { tooltipStyle, gridColor, axisColor, axisFill } = useChartColors();

  return (
    <div className="w-full" role="img" aria-label={title || 'Bar chart visualization'}>
      {title && <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={memoizedData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xAxisKey} stroke={axisColor} tick={{ fill: axisFill, fontSize: 12 }} />
          <YAxis stroke={axisColor} tick={{ fill: axisFill, fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => value.toLocaleString('en-IN')}
            contentStyle={tooltipStyle}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={`bar-${index}`}
              dataKey={bar.key}
              fill={bar.fill}
              name={bar.name}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

MemoizedBarChart.displayName = 'MemoizedBarChart';
