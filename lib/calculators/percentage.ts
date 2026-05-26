/**
 * Percentage Calculator Logic
 * Calculate percentages in three different ways
 *
 * Mode 1 - Percent Of: What is A% of B? → Result = (A / 100) × B
 * Mode 2 - Percent Change: % change from A to B? → Result = ((B - A) / A) × 100
 * Mode 3 - What Percent: A is what % of B? → Result = (A / B) × 100
 */

import Decimal from 'decimal.js';

export interface PercentageInput {
  valueA: number;
  valueB: number;
  calculationType: 'percent-of' | 'percent-change' | 'what-percent';
}

export interface PercentageResult {
  result: number;
  description: string;
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const { valueA, valueB, calculationType } = input;

  if (calculationType === 'percent-of') {
    // What is A% of B?
    const result = new Decimal(valueA).times(valueB).dividedBy(100);
    return {
      result: parseFloat(result.toFixed(2)),
      description: `${valueA}% of ${valueB}`,
    };
  } else if (calculationType === 'percent-change') {
    // What is the percentage change from A to B?
    const change = new Decimal(valueB).minus(valueA);
    const percentChange = change.dividedBy(valueA).times(100);
    return {
      result: parseFloat(percentChange.toFixed(2)),
      description: `Percentage change from ${valueA} to ${valueB}`,
    };
  } else {
    // A is what percentage of B?
    const percentage = new Decimal(valueA).dividedBy(valueB).times(100);
    return {
      result: parseFloat(percentage.toFixed(2)),
      description: `${valueA} is what % of ${valueB}`,
    };
  }
}
