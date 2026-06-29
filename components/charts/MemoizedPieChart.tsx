'use client';

import { memo, useMemo, useState } from 'react';
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
  // Track active index explicitly so mobile tap shows the correct segment's data
  // (Recharts' coordinate-based hover detection can misidentify segments on touch)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

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
            onMouseEnter={(_: unknown, index: number) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
            onClick={(_: unknown, index: number) => setActiveIndex(index)}
          >
            {memoizedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            content={() => {
              if (activeIndex === undefined || !memoizedData[activeIndex]) return null;
              const item = memoizedData[activeIndex];
              return (
                <div style={{ ...tooltipStyle, padding: '8px 12px' }}>
                  <p style={{ margin: 0 }}>
                    {`${item.name} : ${
                      formatter ? formatter(item.value) : item.value.toLocaleString('en-IN')
                    }`}
                  </p>
                </div>
              );
            }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

MemoizedPieChart.displayName = 'MemoizedPieChart';
