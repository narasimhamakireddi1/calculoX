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

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={memoizedData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={line.key}
              stroke={line.stroke}
              name={line.name}
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
