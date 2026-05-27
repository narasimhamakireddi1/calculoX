/**
 * SIP Calculator Logic - Angel One Accurate Implementation
 * Implements step-up SIP calculation with exact Angel One precision
 *
 * Standard SIP Formula: FV = PMT × (((1 + r)^n - 1) / r) × (1 + r)
 * Where:
 * - FV = Future Value (maturity amount)
 * - PMT = Monthly investment amount (increases yearly by step-up %)
 * - r = Monthly return rate (annual rate / 12 / 100)
 * - n = Number of months
 *
 * Step-Up SIP Logic:
 * - Each month, contribution amount = BaseSIP × (1 + stepUp%)^yearIndex
 * - yearIndex = floor((month - 1) / 12)
 * - Month 1-12: yearIndex = 0 → BaseSIP
 * - Month 13-24: yearIndex = 1 → BaseSIP × (1 + stepUp%)
 * - Month 25-36: yearIndex = 2 → BaseSIP × (1 + stepUp%)^2
 *
 * Calculation: Month-by-month compounding for remaining months
 * FV_month = CurrentSIP × (1 + r)^remainingMonths
 * TotalFV = Sum of all monthly FVs
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
  const monthlyRate = new Decimal(annualReturn).dividedBy(12).dividedBy(100);
  const stepUpRate = new Decimal(stepUpPercent).dividedBy(100);

  let totalInvestment = new Decimal(0);
  let futureValue = new Decimal(0);

  // Month-by-month calculation for both standard and step-up SIP
  for (let month = 1; month <= numberOfMonths; month++) {
    // Calculate which year we're in (0-based)
    const currentYear = Math.floor((month - 1) / 12);

    // SIP amount for this month after applying step-up
    const stepUpMultiplier = new Decimal(1).plus(stepUpRate).pow(currentYear);
    const currentSIP = new Decimal(monthlyInvestment).times(stepUpMultiplier);

    // Add to total investment
    totalInvestment = totalInvestment.plus(currentSIP);

    // Calculate remaining months for compounding
    const remainingMonths = numberOfMonths - month;

    // Future value of this month's investment
    const monthlyCompounding = monthlyRate.plus(1).pow(remainingMonths);
    const monthlyFV = currentSIP.times(monthlyCompounding);

    // Add to total future value
    futureValue = futureValue.plus(monthlyFV);
  }

  const gainedAmount = futureValue.minus(totalInvestment);

  return {
    totalInvestment: parseFloat(totalInvestment.toFixed(2)),
    futureValue: parseFloat(futureValue.toFixed(2)),
    gainedAmount: parseFloat(gainedAmount.toFixed(2)),
    monthlyReturn: parseFloat(monthlyRate.toFixed(8)),
    numberOfMonths: numberOfMonths,
  };
}
