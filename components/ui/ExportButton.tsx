'use client';

import { useState } from 'react';

interface ExportButtonProps {
  fileName: string;
  calculatorName: string;
  resultElementId: string;
  inputElementId?: string;
  disabled?: boolean;
}

export default function ExportButton({
  fileName,
  calculatorName,
  resultElementId,
  inputElementId,
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
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        title="Export results as PDF"
      >
        <svg
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
        {exporting ? 'Exporting...' : 'Export as PDF'}
      </button>

      <button
        onClick={handleCopy}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        title="Copy results to clipboard"
      >
        <svg
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
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
