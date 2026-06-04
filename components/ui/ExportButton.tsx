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

  return (
    <button
      onClick={handleExportPDF}
      disabled={disabled || exporting}
      aria-label="Export results as PDF"
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 disabled:shadow-none disabled:scale-100"
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
  );
}
