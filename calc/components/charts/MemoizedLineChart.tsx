'use client';

import { memo, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartColors } from './useChartColors';

interface MemoizedLineChartProps {
  data: Array<{ [key: string]: any }>;
  lines: Array<{ key: string; stroke: string; name: string }>;
  title?: string;
  height?: number;
  xAxisKey?: string;
}

export const MemoizedLineChart = memo(function LineChartComponent({
  data,
  lines,
  title,
  height = 300,
  xAxisKey = 'month',
}: MemoizedLineChartProps) {
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);
  const { tooltipStyle, gridColor, axisColor, axisFill } = useChartColors();

  return (
    <div className="w-full" role="img" aria-label={title || 'Line chart visualization'}>
      {title && <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
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
          {lines.map((line, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={line.key}
              stroke={line.stroke}
              name={line.name}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

MemoizedLineChart.displayName = 'MemoizedLineChart';
