'use client';

import { useState } from 'react';

export interface FormattedInput {
  label: string;
  value: string;
}

interface ExportButtonProps {
  fileName: string;
  calculatorName: string;
  resultElementId: string;
  inputElementId?: string;
  inputsData?: FormattedInput[];
  disabled?: boolean;
}

export default function ExportButton({
  fileName,
  calculatorName,
  resultElementId,
  inputElementId,
  inputsData,
  disabled = false,
}: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { exportResultsAsPDF } = await import('@/lib/utils/pdf-export');
      exportResultsAsPDF(resultElementId, {
        fileName,
        calculatorName,
        timestamp: true,
        inputsSectionId: inputElementId,
        resultsSectionId: resultElementId,
        inputsData,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleCopy = async () => {
    try {
      const { copyResultsToClipboard } = await import('@/lib/utils/pdf-export');
      const success = await copyResultsToClipboard(resultElementId);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy results:', error);
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={handleExportPDF}
        disabled={disabled || exporting}
        aria-label="Export results as PDF"
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 disabled:shadow-none disabled:scale-100"
        title="Export results as PDF"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4"
          />
        </svg>
        <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
      </button>

      <button
        onClick={handleCopy}
        disabled={disabled}
        aria-label={copied ? 'Copied to clipboard' : 'Copy results to clipboard'}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 disabled:shadow-none disabled:scale-100"
        title="Copy results to clipboard"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span>{copied ? '✓ Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
