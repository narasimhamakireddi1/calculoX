'use client';

import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';

// Small copy-to-clipboard code block for the /mcp discoverability page — same
// useState + navigator.clipboard.writeText pattern as ShareButtons' Copy button,
// generalized to arbitrary text (a JSON config snippet or a URL) rather than a
// pre-built share message.
export function CopyCodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      {label && <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{label}</p>}
      <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-black overflow-hidden">
        <pre className="overflow-x-auto p-4 pr-14 text-xs sm:text-sm text-gray-100 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
        >
          {copied
            ? <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
            : <Clipboard className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          }
        </button>
      </div>
    </div>
  );
}
