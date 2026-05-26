/**
 * RD Calculator Logic
 * Calculate Recurring Deposit maturity amount
 *
 * Formula: M = P × [((1 + r)^n - 1) / r] × (1 + r)
 * Where:
 * - M = Maturity Amount
 * - P = Monthly deposit amount
 * - r = Monthly interest rate (annual rate / 12 / 100)
 * - n = Number of months
 */

import Decimal from 'decimal.js';

export interface RDInput {
  monthlyDeposit: number;
  annualRate: number;
  months: number;
}

export interface RDResult {
  maturityAmount: number;
  totalDeposits: number;
  totalInterest: number;
}

export function calculateRD(input: RDInput): RDResult {
  const { monthlyDeposit, annualRate, months } = input;

  const monthlyRate = new Decimal(annualRate).dividedBy(12).dividedBy(100);
  const totalDeposits = new Decimal(monthlyDeposit).times(months);

  // RD Formula: M = P × [((1 + r)^n - 1) / r] × (1 + r)
  // Where P = monthly deposit, r = monthly rate, n = months
  const numerator = monthlyRate.plus(1).pow(months).minus(1);
  const maturityAmount = new Decimal(monthlyDeposit)
    .times(numerator.dividedBy(monthlyRate))
    .times(monthlyRate.plus(1));

  const totalInterest = maturityAmount.minus(totalDeposits);

  return {
    maturityAmount: parseFloat(maturityAmount.toFixed(2)),
    totalDeposits: parseFloat(totalDeposits.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
  };
}

export function generateRDProjection(
  input: RDInput
): Array<{ month: number; deposit: number; amount: number; interest: number }> {
  const projections: Array<{ month: number; deposit: number; amount: number; interest: number }> = [];
  const monthlyRate = new Decimal(input.annualRate).dividedBy(12).dividedBy(100);

  let balance = new Decimal(0);

  for (let month = 1; month <= input.months; month++) {
    balance = balance.times(monthlyRate.plus(1)).plus(input.monthlyDeposit);
    const totalDeposits = new Decimal(input.monthlyDeposit).times(month);
    const interest = balance.minus(totalDeposits);

    projections.push({
      month,
      deposit: parseFloat(totalDeposits.toFixed(2)),
      amount: parseFloat(balance.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
    });
  }

  return projections;
}
