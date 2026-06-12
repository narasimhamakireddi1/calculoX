'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { TableProperties } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface ProjectionRow {
  year: number;
  age: number;
  phase: 'accumulation' | 'distribution';
  corpus: number;
  annualSip?: number;
  annualWithdrawal?: number;
}

interface ProjectionTableProps {
  projections: ProjectionRow[];
  projectionFirstTwelve: ProjectionRow[];
  showFullSchedule: boolean;
  onToggle: () => void;
}

const TableRow = memo(({ row }: { row: ProjectionRow }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
    <td className="px-4 py-3 font-semibold">{row.year}</td>
    <td className="px-4 py-3">{row.age} years</td>
    <td className="px-4 py-3">
      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.phase === 'accumulation' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
        {row.phase === 'accumulation' ? '📈 Accumulating' : '📉 Distribution'}
      </span>
    </td>
    <td className="px-4 py-3 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
      {formatCurrency(row.corpus)}
    </td>
    <td className="px-4 py-3 text-right font-mono font-semibold">
      {row.phase === 'accumulation' ? (
        <span className="text-green-600 dark:text-green-400">+{formatCurrency(row.annualSip || 0)}</span>
      ) : (
        <span className="text-orange-600 dark:text-orange-400">−{formatCurrency(row.annualWithdrawal || 0)}</span>
      )}
    </td>
  </tr>
));

TableRow.displayName = 'TableRow';

const VirtualizedTableRows = memo(({
  data,
  endIndex
}: {
  data: ProjectionRow[];
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
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="inline-flex w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800/60 items-center justify-center flex-shrink-0">
            <TableProperties className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" />
          </span>
          Year-by-Year Projection
        </h2>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70 rounded-xl text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
        >
          {showFullSchedule ? 'Show First 12 Years' : 'Show All'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          onScroll={handleTableScroll}
        >
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-200 dark:border-blue-800 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Year</th>
                <th className="px-4 py-3 text-left font-bold">Age</th>
                <th className="px-4 py-3 text-left font-bold">Phase</th>
                <th className="px-4 py-3 text-right font-bold">Corpus (₹)</th>
                <th className="px-4 py-3 text-right font-bold">Annual SIP/Withdrawal</th>
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
