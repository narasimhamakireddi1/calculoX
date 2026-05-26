/**
 * SIP Calculator Logic
 * Calculate Systematic Investment Plan returns
 *
 * Formula: FV = PMT × (((1 + r)^n - 1) / r)
 * Where:
 * - FV = Future Value (maturity amount)
 * - PMT = Monthly investment amount
 * - r = Monthly return rate (annual rate / 12 / 100)
 * - n = Number of months
 */

import Decimal from 'decimal.js';

export interface SIPInput {
  monthlyInvestment: number;
  years: number;
  annualReturn: number;
}

export interface SIPResult {
  totalInvestment: number;
  futureValue: number;
  gainedAmount: number;
  monthlyReturn: number;
  numberOfMonths: number;
}

export function calculateSIP(input: SIPInput): SIPResult {
  const { monthlyInvestment, years, annualReturn } = input;

  // Calculate basic values
  const numberOfMonths = years * 12;
  const monthlyReturn = new Decimal(annualReturn).dividedBy(12).dividedBy(100);
  const totalInvestment = new Decimal(monthlyInvestment).times(numberOfMonths);

  // Calculate future value: FV = PMT × (((1 + r)^n - 1) / r)
  const rPluOne = monthlyReturn.plus(1);
  const rPowerN = rPluOne.pow(numberOfMonths);
  const numerator = rPowerN.minus(1);
  const futureValue = new Decimal(monthlyInvestment).times(numerator.dividedBy(monthlyReturn));

  const gainedAmount = futureValue.minus(totalInvestment);

  return {
    totalInvestment: parseFloat(totalInvestment.toFixed(2)),
    futureValue: parseFloat(futureValue.toFixed(2)),
    gainedAmount: parseFloat(gainedAmount.toFixed(2)),
    monthlyReturn: parseFloat(monthlyReturn.toFixed(6)),
    numberOfMonths: numberOfMonths,
  };
}
