'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { showToast } from './Toast';

interface CopyToClipboardProps {
  text: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function CopyToClipboard({ text, label = 'Copy', className = '', showIcon = true }: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium
        transition-all duration-200 active:scale-95
        ${isCopied
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
        ${className}`}
    >
      {showIcon && (isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />)}
      <span className="text-sm">{isCopied ? 'Copied!' : label}</span>
    </button>
  );
}

interface CopyFieldProps {
  label: string;
  value: string;
}

export function CopyField({ label, value }: CopyFieldProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">{value}</p>
      </div>
      <CopyToClipboard text={value} label="" showIcon={true} />
    </div>
  );
}
