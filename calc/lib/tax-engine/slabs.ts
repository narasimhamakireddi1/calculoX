/**
 * Slab Tax Calculation Engine
 * Progressive tax calculation based on income slabs
 */

import { TaxBreakdownItem } from './types';
import { TaxSlab } from './rules';

/**
 * Calculate slab tax using progressive slabs
 * Returns tax amount and detailed breakdown for each slab
 */
export function calculateSlabTax(
  taxableIncome: number,
  slabs: TaxSlab[]
): {
  tax: number;
  breakdown: TaxBreakdownItem[];
  marginalRate: number;
} {
  const breakdown: TaxBreakdownItem[] = [];
  let totalTax = 0;
  let marginalRate = 0;

  for (const slab of slabs) {
    // Check if income falls in this slab
    if (taxableIncome > slab.min) {
      // Calculate income in this slab
      const slabMax = slab.max || Infinity;
      const incomeInSlab = Math.min(taxableIncome, slabMax) - slab.min;

      // Calculate tax for this slab
      const taxInSlab = (incomeInSlab * slab.rate) / 100;
      totalTax += taxInSlab;

      // Update marginal rate (rate of the slab that income falls into)
      if (taxableIncome > slab.min) {
        marginalRate = slab.rate;
      }

      // Add to breakdown only if there's tax in this slab
      if (taxInSlab > 0) {
        const slabLabel = `₹${formatSlabMin(slab.min)} - ${
          slab.max ? `₹${formatSlabMax(slab.max)}` : 'Above'
        }`;

        breakdown.push({
          slab: slabLabel,
          rate: slab.rate,
          incomeInSlab,
          tax: taxInSlab,
        });
      }
    }
  }

  // Round tax to 2 decimal places
  const roundedTax = Math.round(totalTax * 100) / 100;

  return {
    tax: roundedTax,
    breakdown,
    marginalRate,
  };
}

/**
 * Format slab minimum for display (convert to Lakh for readability)
 */
function formatSlabMin(amount: number): string {
  if (amount === 0) return '0';
  return `${(amount / 100000).toFixed(1)}L`;
}

/**
 * Format slab maximum for display
 */
function formatSlabMax(amount: number): string {
  if (amount === Infinity) return '∞';
  return `${(amount / 100000).toFixed(1)}L`;
}

/**
 * Calculate marginal tax rate at given income level
 * Returns the tax rate applicable to the last rupee of income
 */
export function getMarginalRate(taxableIncome: number, slabs: TaxSlab[]): number {
  for (const slab of slabs) {
    const slabMax = slab.max || Infinity;
    if (taxableIncome > slab.min && taxableIncome <= slabMax) {
      return slab.rate;
    }
  }
  // Return highest rate if income exceeds all slabs
  return slabs[slabs.length - 1]?.rate || 0;
}
