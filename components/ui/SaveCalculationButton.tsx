'use client';

import { useState } from 'react';
import { useSavedCalculations } from '@/lib/hooks/useSavedCalculations';

interface SaveCalculationButtonProps {
  calculatorType: string;
  calculatorName: string;
  inputs: Record<string, any>;
  results?: Record<string, any>;
}

export function SaveCalculationButton({
  calculatorType,
  calculatorName,
  inputs,
  results,
}: SaveCalculationButtonProps) {
  const { saveCalculation } = useSavedCalculations();
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (name?: string) => {
    saveCalculation(calculatorType, calculatorName, inputs, results, name || undefined);
    setSaved(true);
    setShowModal(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
        title="Save this calculation for later"
      >
        <span>💾</span>
        {saved ? 'Saved!' : 'Save Calculation'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Save Calculation</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Calculator: {calculatorName}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Access this in "Saved Calculations" from the home page
                </p>
              </div>

              <div>
                <label htmlFor="customName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Give it a name (optional)
                </label>
                <input
                  id="customName"
                  type="text"
                  placeholder="e.g., Home Loan - 50L Budget"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={50}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(customName)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
