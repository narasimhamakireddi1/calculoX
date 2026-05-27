/**
 * EMI Calculator Logic - Monthly Reducing Balance Method
 * Based on industry standard used by major Indian banks (HDFC, Axis, SBI, Kotak)
 *
 * The EMI (Equated Monthly Installment) remains constant throughout the loan tenure,
 * but the internal split between interest and principal changes every month.
 * As the outstanding principal reduces, the interest component shrinks and more
 * of the EMI goes toward clearing the base debt.
 *
 * Formula: EMI = [P × r × (1 + r)^N] / [(1 + r)^N - 1]
 * Where:
 * - P = Principal Loan Amount
 * - A_rate = Annual Interest Rate (e.g., 12 means 12%)
 * - r = Monthly Interest Rate = A_rate / (12 × 100)
 * - N = Total Repayment Tenure in Months (Years × 12)
 */

import Decimal from 'decimal.js';

export interface EMIInput {
  principal: number;
  annualRate: number;
  years: number;
}

export interface EMIResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  numberOfMonths: number;
  monthlyRate: number;
}

export function calculateEMI(input: EMIInput): EMIResult {
  const { principal, annualRate, years } = input;

  const numberOfMonths = years * 12;
  const monthlyRate = new Decimal(annualRate).dividedBy(12).dividedBy(100);
  const principalDecimal = new Decimal(principal);

  let emi: Decimal;

  // Edge case: 0% interest loan (simple division)
  if (monthlyRate.equals(0)) {
    emi = principalDecimal.dividedBy(numberOfMonths);
  } else {
    // Standard EMI calculation: EMI = [P × r × (1 + r)^N] / [(1 + r)^N - 1]
    const rPluOne = monthlyRate.plus(1);
    const rPowerN = rPluOne.pow(numberOfMonths);
    const numerator = principalDecimal.times(monthlyRate).times(rPowerN);
    const denominator = rPowerN.minus(1);
    emi = numerator.dividedBy(denominator);
  }

  const totalAmount = emi.times(numberOfMonths);
  const totalInterest = totalAmount.minus(principalDecimal);

  return {
    emi: parseFloat(emi.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    numberOfMonths,
    monthlyRate: parseFloat(monthlyRate.toFixed(6)),
  };
}

export interface AmortizationScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function generateAmortizationSchedule(
  input: EMIInput,
  emiResult: EMIResult
): AmortizationScheduleRow[] {
  const schedule: AmortizationScheduleRow[] = [];
  let outstandingBalance = new Decimal(input.principal);
  const monthlyRate = new Decimal(input.annualRate).dividedBy(12).dividedBy(100);
  const emiAmount = new Decimal(emiResult.emi);
  const numberOfMonths = emiResult.numberOfMonths;

  for (let month = 1; month <= numberOfMonths; month++) {
    // Calculate interest on the remaining reducing balance
    const interestComponent = outstandingBalance.times(monthlyRate);

    // The remainder of the EMI pays off the principal base
    let principalComponent = emiAmount.minus(interestComponent);

    // Special case for the very last month to handle minor floating-point rounding issues
    // Ensure the last principal payment exactly clears the remaining balance
    if (month === numberOfMonths) {
      principalComponent = outstandingBalance;
    }

    outstandingBalance = outstandingBalance.minus(principalComponent);

    // Ensure balance doesn't go negative due to rounding
    if (outstandingBalance.lessThan(0)) {
      outstandingBalance = new Decimal(0);
    }

    schedule.push({
      month,
      payment: parseFloat(emiAmount.toFixed(2)),
      principal: parseFloat(principalComponent.toFixed(2)),
      interest: parseFloat(interestComponent.toFixed(2)),
      balance: parseFloat(outstandingBalance.toFixed(2)),
    });
  }

  return schedule;
}
