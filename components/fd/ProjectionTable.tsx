'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils/format';

interface ProjectionRow {
  month: number;
  amount?: number;
  interest?: number;
  payout?: number;
}

interface ProjectionTableProps {
  projections: ProjectionRow[];
  projectionFirstTwelve: ProjectionRow[];
  showFullSchedule: boolean;
  onToggle: () => void;
  payoutType: string;
}

const TableRow = memo(({ row, payoutType }: { row: ProjectionRow; payoutType: string }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
    <td className="px-4 py-3 font-semibold">{row.month}</td>
    {payoutType === 'cumulative' && (
      <>
        <td className="px-4 py-3 text-right font-mono">{formatCurrency(row.amount || 0)}</td>
        <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400 font-semibold">{formatCurrency(row.interest || 0)}</td>
      </>
    )}
    {(payoutType === 'quarterly' || payoutType === 'monthly') && (
      <>
        <td className="px-4 py-3 text-right font-mono text-amber-600 dark:text-amber-400 font-semibold">{formatCurrency(row.payout || 0)}</td>
        <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400 font-semibold">{formatCurrency(row.interest || 0)}</td>
      </>
    )}
  </tr>
));

TableRow.displayName = 'TableRow';

const VirtualizedTableRows = memo(({
  data,
  endIndex,
  payoutType
}: {
  data: ProjectionRow[];
  endIndex: number;
  payoutType: string;
}) => (
  <>
    {data.slice(0, endIndex).map((row) => (
      <TableRow key={row.month} row={row} payoutType={payoutType} />
    ))}
  </>
));

VirtualizedTableRows.displayName = 'VirtualizedTableRows';

const ProjectionTableComponent = memo(({
  projections,
  projectionFirstTwelve,
  showFullSchedule,
  onToggle,
  payoutType,
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

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📊 Projection Schedule</h2>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {showFullSchedule ? 'Show First 12 Months' : 'Show All'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          onScroll={handleTableScroll}
        >
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold">Month</th>
                {payoutType === 'cumulative' && (
                  <>
                    <th className="text-right py-3 px-4 font-semibold">Amount (₹)</th>
                    <th className="text-right py-3 px-4 font-semibold">Interest (₹)</th>
                  </>
                )}
                {(payoutType === 'quarterly' || payoutType === 'monthly') && (
                  <>
                    <th className="text-right py-3 px-4 font-semibold">Periodic Payout (₹)</th>
                    <th className="text-right py-3 px-4 font-semibold">Total Earned (₹)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              <VirtualizedTableRows
                data={displayData}
                endIndex={visibleEndIndex}
                payoutType={payoutType}
              />
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Showing {showFullSchedule ? `${visibleEndIndex} of ${projections.length}` : 'first 12'} months.
        {showFullSchedule && visibleEndIndex < projections.length && ' Scroll to load more rows.'}
      </p>
    </div>
  );
});

ProjectionTableComponent.displayName = 'ProjectionTable';

export default ProjectionTableComponent;
