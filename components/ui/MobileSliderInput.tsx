'use client';

interface MobileSliderInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number | string;
  prefix?: string;
  suffix?: string;
  rangeText: string;
  colorFrom: string;
  colorTo: string;
  error?: any;
}

export function MobileSliderInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  prefix,
  suffix,
  rangeText,
  colorFrom,
  colorTo,
  error,
}: MobileSliderInputProps) {
  // Extract color class names for styling
  const getColorClasses = () => {
    if (colorFrom.includes('blue')) return { border: 'border-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', dark: 'dark:border-blue-700' };
    if (colorFrom.includes('green')) return { border: 'border-green-400', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', dark: 'dark:border-green-700' };
    if (colorFrom.includes('orange')) return { border: 'border-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', dark: 'dark:border-orange-700' };
    if (colorFrom.includes('purple')) return { border: 'border-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', dark: 'dark:border-purple-700' };
    if (colorFrom.includes('red')) return { border: 'border-red-400', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', dark: 'dark:border-red-700' };
    return { border: 'border-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400', dark: 'dark:border-gray-700' };
  };

  const colors = getColorClasses();

  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-bold text-gray-900 dark:text-white">
        {label}
      </label>

      {/* Mobile: Stacked | Desktop: Side-by-side */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-3 md:items-center">
        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value ?? 0}
          onChange={onChange}
          onBlur={onBlur}
          className={`flex-1 h-3 bg-gradient-to-r ${colorFrom} ${colorTo} rounded-lg appearance-none cursor-pointer transition-all`}
          style={{
            WebkitAppearance: 'none',
          }}
        />

        {/* Number Input - 56px+ touch target on mobile */}
        <div className="w-full md:w-auto relative flex-shrink-0">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-base md:text-sm">
              {prefix}
            </span>
          )}
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-base md:text-sm">
              {suffix}
            </span>
          )}
          <input
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value === 0 ? '' : value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="0"
            className={`w-full md:w-28 px-10 py-3 md:py-2.5 border-2 ${colors.border} ${colors.dark} rounded-lg font-bold text-base ${colors.text} ${colors.bg} focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all`}
          />
        </div>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 2px solid currentColor;
          transition: all 0.15s ease;
        }
        input[type='range']::-webkit-slider-thumb:active {
          width: 28px;
          height: 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        input[type='range']::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 2px solid currentColor;
          transition: all 0.15s ease;
        }
        input[type='range']::-moz-range-thumb:active {
          width: 28px;
          height: 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        input[type='range']:focus {
          outline: none;
        }
      `}</style>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <p className="text-xs text-gray-500 dark:text-gray-400">{rangeText}</p>
    </div>
  );
}
