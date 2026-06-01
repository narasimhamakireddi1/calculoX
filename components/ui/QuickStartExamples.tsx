'use client';

export interface QuickStartScenario {
  label: string;
  description: string;
  icon: string;
  values: Record<string, number | string>;
}

interface QuickStartExamplesProps {
  scenarios: QuickStartScenario[];
  onSelectScenario: (values: Record<string, number | string>) => void;
}

export function QuickStartExamples({ scenarios, onSelectScenario }: QuickStartExamplesProps) {
  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">💡 Quick-Start Examples</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Select a scenario to auto-fill the form</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map((scenario, index) => (
          <button
            key={index}
            onClick={() => onSelectScenario(scenario.values)}
            className="group relative overflow-hidden text-left p-4 rounded-lg bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/5 group-hover:to-indigo-400/5 transition-all duration-300" />

            <div className="relative">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{scenario.icon}</span>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Use
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{scenario.label}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{scenario.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
