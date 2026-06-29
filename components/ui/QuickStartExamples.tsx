'use client';

import type { LucideIcon } from 'lucide-react';
import { Lightbulb } from 'lucide-react';

export interface QuickStartScenario {
  label: string;
  description: string;
  icon: LucideIcon;
  values: Record<string, number | string>;
}

interface QuickStartExamplesProps {
  scenarios: QuickStartScenario[];
  onSelectScenario: (values: Record<string, number | string>) => void;
}

export function QuickStartExamples({ scenarios, onSelectScenario }: QuickStartExamplesProps) {
  return (
    <div className="mb-6 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
          Quick-Start Examples
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Select a scenario to auto-fill the form</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectScenario(scenario.values)}
              className="group relative text-left p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:-translate-y-1 min-w-0"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/5 group-hover:to-indigo-400/5 transition-all duration-300 pointer-events-none" />

              <div className="relative min-w-0">
                <div className="mb-1.5">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-1 leading-snug break-words">{scenario.label}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug break-words">{scenario.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
