/**
 * GST Calculator Logic
 * Calculate GST addition or removal from amounts
 *
 * Formula (Add GST): Total = Base + (Base × Rate / 100)
 * Formula (Remove GST): Base = Total / (1 + Rate / 100)
 * Where:
 * - Base = Amount without GST
 * - Total = Amount with GST
 * - Rate = GST rate (5%, 12%, 18%, or 28%)
 */

import Decimal from 'decimal.js';

export interface GSTInput {
  amount: number;
  gstRate: number;
  calculationType: 'add' | 'remove';
}

export interface GSTResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export function calculateGST(input: GSTInput): GSTResult {
  const { amount, gstRate, calculationType } = input;

  if (calculationType === 'add') {
    // GST added: Total = Base + (Base × Rate / 100)
    const baseAmount = new Decimal(amount);
    const gstAmount = baseAmount.times(gstRate).dividedBy(100);
    const totalAmount = baseAmount.plus(gstAmount);

    return {
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  } else {
    // GST removed: Base = Total / (1 + Rate / 100)
    const totalAmount = new Decimal(amount);
    const divisor = new Decimal(100).plus(gstRate).dividedBy(100);
    const baseAmount = totalAmount.dividedBy(divisor);
    const gstAmount = totalAmount.minus(baseAmount);

    return {
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  }
}
