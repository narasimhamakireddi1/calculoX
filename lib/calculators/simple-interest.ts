/**
 * Simple Interest Calculator Logic
 * Calculate simple interest and total amount
 *
 * Formula: SI = P × R × T / 100
 * Where:
 * - SI = Simple Interest
 * - P = Principal (initial investment)
 * - R = Annual interest rate (%)
 * - T = Time period in years
 * - Total Amount = P + SI
 */

import Decimal from 'decimal.js';

export interface SimpleInterestInput {
  principal: number;
  annualRate: number;
  years: number;
}

export interface SimpleInterestResult {
  simpleInterest: number;
  totalAmount: number;
}

export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const { principal, annualRate, years } = input;

  // SI = P × R × T / 100
  const interest = new Decimal(principal)
    .times(annualRate)
    .times(years)
    .dividedBy(100);

  const totalAmount = new Decimal(principal).plus(interest);

  return {
    simpleInterest: parseFloat(interest.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
  };
}

export function generateSimpleInterestProjection(
  input: SimpleInterestInput
): Array<{ year: number; principal: number; interest: number; totalAmount: number }> {
  const projections: Array<{ year: number; principal: number; interest: number; totalAmount: number }> = [];
  const yearlyInterest = new Decimal(input.principal).times(input.annualRate).dividedBy(100);

  for (let year = 1; year <= input.years; year++) {
    const interest = yearlyInterest.times(year);
    const totalAmount = new Decimal(input.principal).plus(interest);

    projections.push({
      year,
      principal: input.principal,
      interest: parseFloat(interest.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    });
  }

  return projections;
}
