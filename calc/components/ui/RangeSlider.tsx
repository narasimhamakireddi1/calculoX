'use client';

import { useState } from 'react';

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formatValue?: (value: number) => string;
}

// Maps accent-{color}-{shade} Tailwind classes → hex fill color for the progress track
const ACCENT_FILL: Record<string, string> = {
  'blue-400': '#60a5fa', 'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8',
  'indigo-500': '#6366f1', 'indigo-600': '#4f46e5',
  'violet-500': '#8b5cf6', 'violet-600': '#7c3aed',
  'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce',
  'pink-400': '#f472b6', 'pink-500': '#ec4899', 'pink-600': '#db2777',
  'rose-500': '#f43f5e', 'rose-600': '#e11d48',
  'red-500': '#ef4444', 'red-600': '#dc2626',
  'orange-400': '#fb923c', 'orange-500': '#f97316', 'orange-600': '#ea580c',
  'amber-500': '#f59e0b', 'amber-600': '#d97706',
  'yellow-500': '#eab308', 'yellow-600': '#ca8a04',
  'green-400': '#4ade80', 'green-500': '#22c55e', 'green-600': '#16a34a', 'green-700': '#15803d',
  'emerald-500': '#10b981', 'emerald-600': '#059669',
  'teal-500': '#14b8a6', 'teal-600': '#0d9488',
  'cyan-500': '#06b6d4', 'sky-500': '#0ea5e9', 'sky-600': '#0284c7',
};

export function RangeSlider({
  formatValue,
  className = '',
  min = 0,
  max = 100,
  value,
  onChange,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  style: propStyle,
  ...props
}: RangeSliderProps) {
  const [active, setActive] = useState(false);

  const numValue = parseFloat(String(value)) || 0;
  const numMin = parseFloat(String(min));
  const numMax = parseFloat(String(max));
  const percent = numMax === numMin ? 0 : ((numValue - numMin) / (numMax - numMin)) * 100;
  // Compensate for browser thumb half-width (~8px) so tooltip tracks center of thumb
  const thumbOffset = 8 - 0.16 * percent;

  const display = formatValue ? formatValue(numValue) : numValue.toLocaleString('en-IN');

  // Move sizing classes (flex-1, w-full, w-*) onto the wrapper so input can use w-full
  // Negative look-behind prevents matching w-* inside min-w-* or max-w-*
  const SIZING_RE = /(?<![-\w])\b(flex-1|w-full|w-\S+)\b/g;
  const sizingClasses = (className.match(SIZING_RE) ?? []).join(' ') || 'flex-1';
  const inputClasses = className.replace(SIZING_RE, '').replace(/\s+/g, ' ').trim();

  // Extract fill color from accent-{color}-{shade} class for CSS custom properties
  const accentMatch = inputClasses.match(/\baccent-([a-z]+-\d+)\b/);
  const fillColor = accentMatch ? (ACCENT_FILL[accentMatch[1]] ?? '#3b82f6') : '#3b82f6';

  return (
    <div className={`relative min-w-0 max-w-full ${sizingClasses}`}>
      {active && (
        <div
          aria-hidden="true"
          className="absolute z-10 pointer-events-none flex flex-col items-center"
          style={{
            left: `calc(${percent}% + ${thumbOffset}px)`,
            bottom: 'calc(100% + 6px)',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
            {display}
          </div>
          {/* downward caret */}
          <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 -mt-1 shadow-sm" />
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className={`w-full ${inputClasses}`}
        onPointerDown={(e) => { setActive(true); onPointerDown?.(e); }}
        onPointerUp={(e) => { setActive(false); onPointerUp?.(e); }}
        onPointerCancel={(e) => { setActive(false); onPointerCancel?.(e); }}
        {...props}
        style={{
          ...propStyle,
          '--fill-pct': `${percent}%`,
          '--fill-color': fillColor,
          '--thumb-color': fillColor,
        } as React.CSSProperties}
      />
    </div>
  );
}
