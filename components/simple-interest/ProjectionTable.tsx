'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils/format';

interface ProjectionRow {
  period: number;
  interest: number;
  totalAmount: number;
}

interface ProjectionTableProps {
  projections: ProjectionRow[];
  projectionFirstTwelve: ProjectionRow[];
  showFullSchedule: boolean;
  onToggle: () => void;
  tenureType: string;
}

const TableRow = memo(({ row, tenureType }: { row: ProjectionRow; tenureType: string }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
      {tenureType === 'years' ? `Year ${row.period}` : tenureType === 'months' ? `Month ${row.period}` : `Day ${row.period}`}
    </td>
    <td className="px-4 py-4 text-right font-semibold text-green-600 dark:text-green-400">
      {formatCurrency(row.interest)}
    </td>
    <td className="px-4 py-4 text-right font-bold text-blue-600 dark:text-blue-400 text-lg">
      {formatCurrency(row.totalAmount)}
    </td>
  </tr>
));

TableRow.displayName = 'TableRow';

const VirtualizedTableRows = memo(({
  data,
  endIndex,
  tenureType
}: {
  data: ProjectionRow[];
  endIndex: number;
  tenureType: string;
}) => (
  <>
    {data.slice(0, endIndex).map((row) => (
      <TableRow key={row.period} row={row} tenureType={tenureType} />
    ))}
  </>
));

VirtualizedTableRows.displayName = 'VirtualizedTableRows';

const ProjectionTableComponent = memo(({
  projections,
  projectionFirstTwelve,
  showFullSchedule,
  onToggle,
  tenureType,
}: ProjectionTableProps) => {
  const [visibleRowsCount, setVisibleRowsCount] = useState(50);

  const displayData = useMemo(() => {
    return showFullSchedule ? projections : projectionFirstTwelve;
  }, [showFullSchedule, projections, projectionFirstTwelve]);

  const visibleEndIndex = useMemo(() => {
    return showFullSchedule ? Math.min(visibleRowsCount, projections.length) : projectionFirstTwelve.length;
  }, [showFullSchedule, visibleRowsCount, projections.length, projectionFirstTwelve.length]);

  const handleTableScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollHeight - element.scrollTop < 500) {
      setVisibleRowsCount((prev) => Math.min(prev + 50, projections.length));
    }
  }, [projections.length]);

  const periodLabel = tenureType === 'years' ? 'Years' : tenureType === 'months' ? 'Months' : 'Days';

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📊 Interest Projection Schedule</h2>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70 rounded-xl text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
        >
          {showFullSchedule ? `Show First 12 ${periodLabel}` : 'Show All'}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">Period-wise breakdown showing interest accrual over time</p>

      <div className="overflow-x-auto">
        <div
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          onScroll={handleTableScroll}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800 z-10">
              <tr>
                <th className="px-4 py-4 text-left font-bold text-gray-900 dark:text-white">Period</th>
                <th className="px-4 py-4 text-right font-bold text-green-700 dark:text-green-400">Interest Earned (₹)</th>
                <th className="px-4 py-4 text-right font-bold text-blue-700 dark:text-blue-400">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <VirtualizedTableRows
                data={displayData}
                endIndex={visibleEndIndex}
                tenureType={tenureType}
              />
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Showing {showFullSchedule ? `${visibleEndIndex} of ${projections.length}` : 'first 12'} periods.
        {showFullSchedule && visibleEndIndex < projections.length && ' Scroll to load more rows.'}
      </p>
    </div>
  );
});

ProjectionTableComponent.displayName = 'ProjectionTable';

export default ProjectionTableComponent;
