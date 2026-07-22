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
    <div className="info-panel mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
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
              className="group text-left p-2.5 sm:p-3 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-gray-700/60 hover:border-emerald-400/70 dark:hover:border-emerald-500/60 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 min-w-0"
            >
              <div className="min-w-0">
                <div className="mb-1.5">
                  <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" aria-hidden="true" />
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
