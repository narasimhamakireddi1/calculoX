'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils/format';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  scheduleFirstTwelve: AmortizationRow[];
  showFullSchedule: boolean;
  onToggle: () => void;
}

// Memoized table row component
const TableRow = memo(({ row }: { row: AmortizationRow }) => (
  <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.month}</td>
    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-semibold">{formatCurrency(row.payment)}</td>
    <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">{formatCurrency(row.principal)}</td>
    <td className="py-3 px-4 text-right text-red-600 dark:text-red-400">{formatCurrency(row.interest)}</td>
    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.balance)}</td>
  </tr>
));

TableRow.displayName = 'TableRow';

// Virtualized table rows for better performance with large schedules
const VirtualizedTableRows = memo(({
  data,
  startIndex = 0,
  endIndex
}: {
  data: AmortizationRow[];
  startIndex?: number;
  endIndex: number;
}) => {
  return (
    <>
      {data.slice(startIndex, endIndex).map((row) => (
        <TableRow key={row.month} row={row} />
      ))}
    </>
  );
});

VirtualizedTableRows.displayName = 'VirtualizedTableRows';

// Main amortization table component
const AmortizationTableComponent = memo(({
  schedule,
  scheduleFirstTwelve,
  showFullSchedule,
  onToggle,
}: AmortizationTableProps) => {
  const [visibleRowsCount, setVisibleRowsCount] = useState(50); // Show 50 rows at a time in full schedule

  // Determine which data to show
  const displayData = useMemo(() => {
    return showFullSchedule ? schedule : scheduleFirstTwelve;
  }, [showFullSchedule, schedule, scheduleFirstTwelve]);

  // Calculate visible range for virtualization
  const visibleEndIndex = useMemo(() => {
    return showFullSchedule ? Math.min(visibleRowsCount, schedule.length) : scheduleFirstTwelve.length;
  }, [showFullSchedule, visibleRowsCount, schedule.length, scheduleFirstTwelve.length]);

  // Handle scroll for lazy loading more rows
  const handleTableScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollHeight - element.scrollTop < 500) {
      setVisibleRowsCount((prev) => Math.min(prev + 50, schedule.length));
    }
  }, [schedule.length]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Amortization Schedule</h2>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors will-change-auto"
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
                <th className="text-right py-3 px-4 font-semibold">Payment</th>
                <th className="text-right py-3 px-4 font-semibold">Principal</th>
                <th className="text-right py-3 px-4 font-semibold">Interest</th>
                <th className="text-right py-3 px-4 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody>
              <VirtualizedTableRows
                data={displayData}
                endIndex={visibleEndIndex}
              />
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Showing {showFullSchedule ? `${visibleEndIndex} of ${schedule.length}` : 'first 12'} months.
        {showFullSchedule && visibleEndIndex < schedule.length && ' Scroll to load more rows.'}
      </p>
    </div>
  );
});

AmortizationTableComponent.displayName = 'AmortizationTable';

export default AmortizationTableComponent;
