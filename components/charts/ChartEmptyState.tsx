import { BarChart2, PieChart } from 'lucide-react';

interface ChartEmptyStateProps {
  columns?: 1 | 2;
}

const PlaceholderCard = ({ icon: Icon }: { icon: typeof BarChart2 }) => (
  <div className="card flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900 flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-blue-300 dark:text-blue-600" strokeWidth={1.5} />
    </div>
    <p className="text-gray-400 dark:text-gray-500 text-sm">Enter values above to see your chart</p>
  </div>
);

export function ChartEmptyState({ columns = 2 }: ChartEmptyStateProps) {
  if (columns === 1) {
    return <PlaceholderCard icon={BarChart2} />;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <PlaceholderCard icon={BarChart2} />
      <PlaceholderCard icon={PieChart} />
    </div>
  );
}
