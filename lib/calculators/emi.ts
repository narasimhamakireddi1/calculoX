/**
 * EMI Calculator Logic
 * Calculate Equated Monthly Installment for loans
 *
 * Formula: EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1]
 * Where:
 * - P = Principal amount
 * - R = Monthly interest rate (annual rate / 12 / 100)
 * - N = Number of months
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

  // Calculate EMI: EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1]
  const rPluOne = monthlyRate.plus(1);
  const rPowerN = rPluOne.pow(numberOfMonths);
  const numerator = principalDecimal.times(monthlyRate).times(rPowerN);
  const denominator = rPowerN.minus(1);
  const emi = numerator.dividedBy(denominator);

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
  let balance = new Decimal(input.principal);
  const monthlyRate = new Decimal(input.annualRate).dividedBy(12).dividedBy(100);
  const emi = new Decimal(emiResult.emi);

  for (let month = 1; month <= emiResult.numberOfMonths; month++) {
    const interestPayment = balance.times(monthlyRate);
    const principalPayment = emi.minus(interestPayment);
    balance = balance.minus(principalPayment);

    schedule.push({
      month,
      payment: parseFloat(emi.toFixed(2)),
      principal: parseFloat(principalPayment.toFixed(2)),
      interest: parseFloat(interestPayment.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });
  }

  return schedule;
}
