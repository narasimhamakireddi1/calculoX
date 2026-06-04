'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils/format';

interface YearlyProjection {
  year: number;
  monthlyInvestment: number;
  annualInvestment: number;
  cumulativeInvestment: number;
}

interface ProjectionTableProps {
  projections: YearlyProjection[];
  projectionFirstTwelve: YearlyProjection[];
  showFullSchedule: boolean;
  onToggle: () => void;
}

const TableRow = memo(({ row }: { row: YearlyProjection }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Year {row.year}</td>
    <td className="px-4 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">
      ₹{row.monthlyInvestment.toLocaleString('en-IN')}
    </td>
    <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
      ₹{row.annualInvestment.toLocaleString('en-IN')}
    </td>
    <td className="px-4 py-3 text-right font-bold text-purple-600 dark:text-purple-400 text-lg">
      ₹{row.cumulativeInvestment.toLocaleString('en-IN')}
    </td>
  </tr>
));

TableRow.displayName = 'TableRow';

const VirtualizedTableRows = memo(({
  data,
  endIndex
}: {
  data: YearlyProjection[];
  endIndex: number;
}) => (
  <>
    {data.slice(0, endIndex).map((row) => (
      <TableRow key={row.year} row={row} />
    ))}
  </>
));

VirtualizedTableRows.displayName = 'VirtualizedTableRows';

const ProjectionTableComponent = memo(({
  projections,
  projectionFirstTwelve,
  showFullSchedule,
  onToggle,
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
        <h2 className="text-2xl font-bold">📈 Investment Projection</h2>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {showFullSchedule ? 'Show First 12 Years' : 'Show All'}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">Year-wise breakdown of your SIP journey with step-up increments</p>

      <div className="overflow-x-auto">
        <div
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          onScroll={handleTableScroll}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800 z-10">
              <tr>
                <th className="px-4 py-4 text-left font-bold text-gray-900 dark:text-white">Year</th>
                <th className="px-4 py-4 text-right font-bold text-blue-700 dark:text-blue-400">Monthly Investment</th>
                <th className="px-4 py-4 text-right font-bold text-green-700 dark:text-green-400">Annual Investment</th>
                <th className="px-4 py-4 text-right font-bold text-purple-700 dark:text-purple-400">Cumulative Invested</th>
              </tr>
            </thead>
            <tbody>
              <VirtualizedTableRows data={displayData} endIndex={visibleEndIndex} />
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Showing {showFullSchedule ? `${visibleEndIndex} of ${projections.length}` : 'first 12'} years.
        {showFullSchedule && visibleEndIndex < projections.length && ' Scroll to load more rows.'}
      </p>
    </div>
  );
});

ProjectionTableComponent.displayName = 'ProjectionTable';

export default ProjectionTableComponent;
