'use client';

import { useState } from 'react';

interface InputTooltipProps {
  label: string;
  hint: string;
  children: React.ReactNode;
}

export function InputTooltip({ label, hint, children }: InputTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="font-semibold text-gray-900 dark:text-white text-sm">{label}</label>
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors duration-200 text-xs font-bold"
          aria-label={`Information about ${label}`}
        >
          ⓘ
        </button>
      </div>

      {children}

      {showTooltip && (
        <div className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 animate-fade-in">
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">{hint}</p>
        </div>
      )}
    </div>
  );
}
