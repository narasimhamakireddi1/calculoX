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
  stepUpPercent?: number;
}

export interface SIPResult {
  totalInvestment: number;
  futureValue: number;
  gainedAmount: number;
  monthlyReturn: number;
  numberOfMonths: number;
}

export function calculateSIP(input: SIPInput): SIPResult {
  const { monthlyInvestment, years, annualReturn, stepUpPercent = 0 } = input;

  const numberOfMonths = years * 12;
  const monthlyReturn = new Decimal(annualReturn).dividedBy(12).dividedBy(100);
  const stepUpRate = new Decimal(stepUpPercent).dividedBy(100);

  let totalInvestment = new Decimal(0);
  let futureValue = new Decimal(0);

  if (stepUpPercent === 0) {
    // No step-up: use original formula
    totalInvestment = new Decimal(monthlyInvestment).times(numberOfMonths);
    const rPlusOne = monthlyReturn.plus(1);
    const rPowerN = rPlusOne.pow(numberOfMonths);
    const numerator = rPowerN.minus(1);
    futureValue = new Decimal(monthlyInvestment).times(numerator.dividedBy(monthlyReturn));
  } else {
    // With step-up: calculate month by month
    let currentMonthlyAmount = new Decimal(monthlyInvestment);

    for (let month = 1; month <= numberOfMonths; month++) {
      // Increase investment at the start of each year
      if (month > 1 && (month - 1) % 12 === 0) {
        currentMonthlyAmount = currentMonthlyAmount.times(stepUpRate.plus(1));
      }

      totalInvestment = totalInvestment.plus(currentMonthlyAmount);

      // Calculate future value of this month's investment
      const monthsRemaining = numberOfMonths - month;
      const monthlyGrowth = monthlyReturn.plus(1).pow(monthsRemaining);
      futureValue = futureValue.plus(currentMonthlyAmount.times(monthlyGrowth));
    }
  }

  const gainedAmount = futureValue.minus(totalInvestment);

  return {
    totalInvestment: parseFloat(totalInvestment.toFixed(2)),
    futureValue: parseFloat(futureValue.toFixed(2)),
    gainedAmount: parseFloat(gainedAmount.toFixed(2)),
    monthlyReturn: parseFloat(monthlyReturn.toFixed(6)),
    numberOfMonths: numberOfMonths,
  };
}
