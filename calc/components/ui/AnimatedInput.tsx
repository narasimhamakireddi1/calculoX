'use client';

import { useState, useCallback } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface AnimatedInputProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number | string;
  error?: string;
  success?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export function AnimatedInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  error,
  success,
  helperText,
  placeholder,
  className = '',
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value === '' ? 0 : Number(e.target.value);
      onChange(raw);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const borderColor = error ? 'border-red-400 dark:border-red-600' : success ? 'border-green-400 dark:border-green-600' : 'border-gray-300 dark:border-gray-600';
  const bgColor = error ? 'bg-red-50 dark:bg-red-900/10' : 'bg-white dark:bg-gray-900';
  const focusRing = isFocused ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-950' : '';
  const shakeClass = error ? 'input-invalid-shake' : '';

  return (
    <div className="space-y-2">
      {label && <label htmlFor={id} className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</label>}

      <div className="relative">
        <input
          id={id}
          type="number"
          placeholder={placeholder}
          value={value === 0 ? '' : value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2.5 border-2 rounded-lg font-medium
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            transition-all duration-200
            ${borderColor} ${bgColor} ${focusRing} ${shakeClass}
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            ${className}`}
        />

        {/* Status Icon */}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 flex-shrink-0" />
        )}
        {success && !error && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 flex-shrink-0 animate-scale-in" />
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">{error}</p>}

      {/* Helper Text */}
      {helperText && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
}
