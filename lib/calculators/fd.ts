/**
 * FD Calculator Logic
 * Calculate Fixed Deposit maturity amount and interest
 *
 * Formula: A = P(1 + r)^t
 * Where:
 * - A = Maturity Amount
 * - P = Principal (initial investment)
 * - r = Annual interest rate (as decimal)
 * - t = Time period in years
 */

import Decimal from 'decimal.js';

export interface FDInput {
  principal: number;
  annualRate: number;
  years: number;
}

export interface FDResult {
  maturityAmount: number;
  totalInterest: number;
}

export function calculateFD(input: FDInput): FDResult {
  const { principal, annualRate, years } = input;

  const r = new Decimal(annualRate).dividedBy(100);
  const maturity = new Decimal(principal).times(r.plus(1).pow(years));
  const interest = maturity.minus(principal);

  return {
    maturityAmount: parseFloat(maturity.toFixed(2)),
    totalInterest: parseFloat(interest.toFixed(2)),
  };
}

export function generateFDProjection(input: FDInput): Array<{ year: number; amount: number; interest: number }> {
  const projections: Array<{ year: number; amount: number; interest: number }> = [];
  const r = new Decimal(input.annualRate).dividedBy(100);

  for (let year = 1; year <= input.years; year++) {
    const amount = new Decimal(input.principal).times(r.plus(1).pow(year));
    const interest = amount.minus(input.principal);

    projections.push({
      year,
      amount: parseFloat(amount.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
    });
  }

  return projections;
}
