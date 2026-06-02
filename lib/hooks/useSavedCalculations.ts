import { useCallback } from 'react';

export interface SavedCalculation {
  id: string;
  calculatorType: string;
  calculatorName: string;
  inputs: Record<string, any>;
  results?: Record<string, any>;
  savedAt: number;
  customName?: string;
}

const STORAGE_KEY = 'calculox_saved_calculations';
const MAX_SAVED = 10;

export function useSavedCalculations() {
  const getSavedCalculations = useCallback((): SavedCalculation[] => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const saveCalculation = useCallback(
    (
      calculatorType: string,
      calculatorName: string,
      inputs: Record<string, any>,
      results?: Record<string, any>,
      customName?: string
    ): SavedCalculation => {
      const calculations = getSavedCalculations();

      const newCalculation: SavedCalculation = {
        id: `${calculatorType}-${Date.now()}`,
        calculatorType,
        calculatorName,
        inputs,
        results,
        savedAt: Date.now(),
        customName,
      };

      const updated = [newCalculation, ...calculations].slice(0, MAX_SAVED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return newCalculation;
    },
    [getSavedCalculations]
  );

  const deleteCalculation = useCallback((id: string): void => {
    const calculations = getSavedCalculations();
    const updated = calculations.filter(calc => calc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [getSavedCalculations]);

  const clearAllCalculations = useCallback((): void => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    getSavedCalculations,
    saveCalculation,
    deleteCalculation,
    clearAllCalculations,
  };
}
