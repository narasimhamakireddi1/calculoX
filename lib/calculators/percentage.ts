import Decimal from 'decimal.js';

export type PercentageCalculationType =
  | 'hike-discount'   // Track 1: Apply % hike or discount
  | 'percent-of'      // Track 2: What is A% of B?
  | 'what-percent'    // Track 3: A is what % of B?
  | 'percent-change'  // Track 4: % change from A to B
  | 'reverse-percent' // Track 5: X is Y% of what total?
  | 'sequential';     // Track 6: Apply P1% then P2% sequentially

export interface PercentageInput {
  valueA: number;
  valueB: number;
  percentC?: number;
  hikeDirection?: 'hike' | 'discount';
  calculationType: PercentageCalculationType;
}

export interface PercentageResult {
  result: number;
  description: string;
  direction?: 'increase' | 'decrease' | 'unchanged';
  breakdown?: { label: string; value: number }[];
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const { valueA, valueB, percentC = 0, hikeDirection = 'hike', calculationType } = input;

  switch (calculationType) {
    case 'hike-discount': {
      const effectivePercent = hikeDirection === 'hike' ? valueB : -valueB;
      const factor = new Decimal(1).plus(new Decimal(effectivePercent).dividedBy(100));
      const finalValue = new Decimal(valueA).times(factor);
      const changeAmount = finalValue.minus(valueA).abs();
      return {
        result: parseFloat(finalValue.toFixed(2)),
        description: hikeDirection === 'hike'
          ? `${formatNum(valueA)} after ${valueB}% hike = ${formatNum(parseFloat(finalValue.toFixed(2)))}`
          : `${formatNum(valueA)} after ${valueB}% discount = ${formatNum(parseFloat(finalValue.toFixed(2)))}`,
        breakdown: [
          { label: 'Original Value', value: valueA },
          { label: hikeDirection === 'hike' ? 'Amount Added' : 'Amount Saved', value: parseFloat(changeAmount.toFixed(2)) },
        ],
      };
    }

    case 'percent-of': {
      const result = new Decimal(valueA).dividedBy(100).times(valueB);
      const remainder = new Decimal(valueB).minus(result);
      return {
        result: parseFloat(result.toFixed(2)),
        description: `${valueA}% of ${formatNum(valueB)} = ${formatNum(parseFloat(result.toFixed(2)))}`,
        breakdown: [
          { label: `${valueA}% Portion`, value: parseFloat(result.toFixed(2)) },
          { label: 'Remainder', value: parseFloat(remainder.toFixed(2)) },
        ],
      };
    }

    case 'what-percent': {
      if (valueB === 0) throw new Error('Total value (B) cannot be zero');
      const result = new Decimal(valueA).dividedBy(valueB).times(100);
      return {
        result: parseFloat(result.toFixed(4)),
        description: `${formatNum(valueA)} is ${result.toFixed(2)}% of ${formatNum(valueB)}`,
      };
    }

    case 'percent-change': {
      if (valueA === 0) throw new Error('Initial value (A) cannot be zero');
      const delta = new Decimal(valueB).minus(valueA);
      const pctChange = delta.dividedBy(valueA).times(100);
      const direction: 'increase' | 'decrease' | 'unchanged' = pctChange.isNegative()
        ? 'decrease'
        : pctChange.isZero()
        ? 'unchanged'
        : 'increase';
      return {
        result: parseFloat(pctChange.abs().toFixed(4)),
        description: `From ${formatNum(valueA)} to ${formatNum(valueB)} → ${pctChange.abs().toFixed(2)}% ${direction}`,
        direction,
      };
    }

    case 'reverse-percent': {
      if (valueB === 0) throw new Error('Percentage (B) cannot be zero');
      const total = new Decimal(valueA).times(100).dividedBy(valueB);
      const remaining = total.minus(valueA);
      return {
        result: parseFloat(total.toFixed(2)),
        description: `If ${formatNum(valueA)} is ${valueB}%, the total is ${formatNum(parseFloat(total.toFixed(2)))}`,
        breakdown: [
          { label: 'Known Amount', value: valueA },
          { label: 'Remaining Amount', value: parseFloat(remaining.toFixed(2)) },
        ],
      };
    }

    case 'sequential': {
      const after1 = new Decimal(valueA).times(new Decimal(1).plus(new Decimal(valueB).dividedBy(100)));
      const after2 = after1.times(new Decimal(1).plus(new Decimal(percentC).dividedBy(100)));
      const totalChange = after2.minus(valueA);
      return {
        result: parseFloat(after2.toFixed(2)),
        description: `${formatNum(valueA)} → +${valueB}% → +${percentC}% = ${formatNum(parseFloat(after2.toFixed(2)))}`,
        breakdown: [
          { label: 'Base Value', value: valueA },
          { label: `After ${valueB}%`, value: parseFloat(after1.toFixed(2)) },
          { label: `After ${percentC}%`, value: parseFloat(after2.toFixed(2)) },
          { label: 'Total Change', value: parseFloat(totalChange.toFixed(2)) },
        ],
      };
    }

    default:
      throw new Error('Invalid calculation type');
  }
}

function formatNum(n: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
}
