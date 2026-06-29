/**
 * Calculator Type Definitions
 */

export interface CalculationResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  timestamp: Date;
}

export interface CalculatorFormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

export interface CalculatorResultsProps {
  results: Record<string, unknown>;
  isLoading?: boolean;
}
