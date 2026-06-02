'use client';

import { useState } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-bold text-gray-900 dark:text-white">
        {label}
      </label>

      {/* Desktop: Slider + Input side-by-side | Mobile: Stacked */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-3 md:items-center">
        {/* Enhanced Slider */}
        <div className="flex-1 flex items-center justify-center md:block h-12 md:h-auto">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value ?? 0}
            onChange={onChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onBlur={onBlur}
            className={`w-full slider-input h-2 md:h-2.5 bg-gradient-to-r ${colorFrom} ${colorTo} rounded-full appearance-none cursor-pointer transition-all ${
              isDragging ? 'scale-105 shadow-lg' : 'hover:scale-102'
            } will-change-transform`}
            style={{
              WebkitAppearance: 'none',
            }}
          />

          <style>{`
            input[type='range'].slider-input::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: white;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              border: 3px solid currentColor;
              transition: all 0.15s ease;
            }
            input[type='range'].slider-input::-webkit-slider-thumb:active {
              width: 32px;
              height: 32px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            input[type='range'].slider-input::-webkit-slider-thumb:hover {
              box-shadow: 0 3px 10px rgba(0,0,0,0.25);
            }
            input[type='range'].slider-input::-moz-range-thumb {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: white;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              border: 3px solid currentColor;
              transition: all 0.15s ease;
            }
            input[type='range'].slider-input::-moz-range-thumb:active {
              width: 32px;
              height: 32px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            input[type='range'].slider-input::-moz-range-thumb:hover {
              box-shadow: 0 3px 10px rgba(0,0,0,0.25);
            }
            input[type='range'].slider-input:focus {
              outline: none;
            }
          `}</style>
        </div>

        {/* Enhanced Number Input - 56px+ touch target on mobile */}
        <div className="w-full md:w-auto relative flex-shrink-0 h-14 md:h-auto">
          {prefix && (
            <span className="absolute left-3 md:left-2 top-1/2 -translate-y-1/2 md:translate-y-0 md:top-3 font-bold text-base md:text-sm">
              {prefix}
            </span>
          )}
          {suffix && (
            <span className="absolute right-3 md:right-3 top-1/2 -translate-y-1/2 md:translate-y-0 md:top-3 font-bold text-base md:text-sm">
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
            className="w-full h-full md:h-auto md:w-32 px-10 md:px-6 py-3 md:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-right font-bold text-base focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all hover:border-gray-400 dark:hover:border-gray-500"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <p className="text-xs text-gray-500 dark:text-gray-400">{rangeText}</p>
    </div>
  );
}
