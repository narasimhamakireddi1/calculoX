/**
 * SIP Calculator Logic - Production Grade Accuracy
 * Implements step-up SIP calculation matching AngelOne precision
 *
 * Standard SIP Formula: FV = PMT × (((1 + r)^n - 1) / r) × (1 + r)
 * Where:
 * - FV = Future Value (maturity amount)
 * - PMT = Monthly investment amount
 * - r = Monthly return rate (annual rate / 12 / 100)
 * - n = Number of months
 *
 * Step-Up SIP: Each year, monthly investment increases by step-up percentage
 * - Year 1: P, P, P, ..., P (12 months)
 * - Year 2: P×(1+g), P×(1+g), ..., P×(1+g) (12 months)
 * - Year k: P×(1+g)^(k-1) for all 12 months
 *
 * Calculation: Month-by-month compounding for maximum accuracy
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

  if (stepUpPercent === 0 || stepUpPercent < 0.01) {
    // No step-up: use standard SIP formula for maximum precision
    const monthlyInv = new Decimal(monthlyInvestment);
    totalInvestment = monthlyInv.times(numberOfMonths);

    const rPlusOne = monthlyReturn.plus(1);
    const rPowerN = rPlusOne.pow(numberOfMonths);
    const numerator = rPowerN.minus(1);

    // FV = PMT × (((1 + r)^n - 1) / r) × (1 + r)
    futureValue = monthlyInv.times(numerator.dividedBy(monthlyReturn)).times(rPlusOne);
  } else {
    // With step-up: year-by-year calculation for accuracy matching AngelOne
    let currentMonthlyAmount = new Decimal(monthlyInvestment);
    const stepUpMultiplier = new Decimal(1).plus(stepUpRate);

    for (let year = 1; year <= years; year++) {
      // For each month in this year
      for (let monthInYear = 1; monthInYear <= 12; monthInYear++) {
        const monthIndex = (year - 1) * 12 + monthInYear;

        totalInvestment = totalInvestment.plus(currentMonthlyAmount);

        // Calculate months remaining after this investment
        const monthsRemaining = numberOfMonths - monthIndex;

        // Compound this investment for remaining months
        const compoundingFactor = monthlyReturn.plus(1).pow(monthsRemaining);
        futureValue = futureValue.plus(currentMonthlyAmount.times(compoundingFactor));
      }

      // Increase monthly investment for next year (after 12 months complete)
      if (year < years) {
        currentMonthlyAmount = currentMonthlyAmount.times(stepUpMultiplier);
      }
    }
  }

  const gainedAmount = futureValue.minus(totalInvestment);

  return {
    totalInvestment: parseFloat(totalInvestment.toFixed(2)),
    futureValue: parseFloat(futureValue.toFixed(2)),
    gainedAmount: parseFloat(gainedAmount.toFixed(2)),
    monthlyReturn: parseFloat(monthlyReturn.toFixed(8)),
    numberOfMonths: numberOfMonths,
  };
}
