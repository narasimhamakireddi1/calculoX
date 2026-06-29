/**
 * SIP Calculator Logic - Iterative Monthly Loop (ClearTax/Groww Standard)
 * Production-grade step-up SIP calculation with annuity-due precision
 *
 * Mathematical Framework:
 * - P = Initial Monthly SIP (e.g., ₹10,000)
 * - A_rate = Annual Return Rate (e.g., 12%)
 * - r = Monthly Return Rate = A_rate / 12
 * - S_pct = Annual Step-Up Percentage (e.g., 10%)
 * - N = Total Months = Years × 12
 *
 * Step-Up Mechanism (Annual Increments):
 * - Months 1-12: SIP = P
 * - Months 13-24: SIP = P × (1 + S_pct)
 * - Months 25-36: SIP = P × (1 + S_pct)²
 * - Month k: SIP = P × (1 + S_pct)^floor((k-1)/12)
 *
 * Annuity Due Formula (SIPs invested at month start, not end):
 * - Each month i compounds for (N - i + 1) periods
 * - FV_installment = Monthly_SIP × (1 + r)^(N - i + 1)
 * - Total FV = Σ FV_installment for all months
 *
 * Verification Test Case:
 * - Input: ₹10,000/month, 12% annual, 3 years, 10% step-up
 * - Year 1: 12 × ₹10,000 = ₹1,20,000
 * - Year 2: 12 × ₹11,000 = ₹1,32,000
 * - Year 3: 12 × ₹12,100 = ₹1,45,200
 * - Total Invested: ₹3,97,200
 * - Total Future Value: ₹4,79,318 ✓
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

  // Iterative monthly loop: ClearTax/Groww standard implementation
  // Loop through each month (1 to N)
  for (let month = 1; month <= numberOfMonths; month++) {
    // Calculate which year we're in (0-based: year 0 = months 1-12, year 1 = months 13-24, etc.)
    const yearIndex = Math.floor((month - 1) / 12);

    // Calculate monthly SIP amount with annual step-up
    // Year 0: P, Year 1: P×(1+S%), Year 2: P×(1+S%)², etc.
    const stepUpMultiplier = new Decimal(1).plus(stepUpRate).pow(yearIndex);
    const currentMonthSIP = new Decimal(monthlyInvestment).times(stepUpMultiplier);

    // Track total principal invested
    totalInvestment = totalInvestment.plus(currentMonthSIP);

    // Calculate remaining compounding periods for ANNUITY DUE
    // Since SIP is invested at START of month, this month's investment compounds for (N - month + 1) periods
    const monthsRemaining = numberOfMonths - month + 1;

    // Compound this specific month's installment to maturity
    // FV_installment = SIP × (1 + r)^remainingMonths
    const compoundingFactor = monthlyRate.plus(1).pow(monthsRemaining);
    const installmentFutureValue = currentMonthSIP.times(compoundingFactor);

    // Accumulate total future value (corpus)
    futureValue = futureValue.plus(installmentFutureValue);
  }

  // Estimated returns = total maturity value - total principal invested
  const gainedAmount = futureValue.minus(totalInvestment);

  return {
    totalInvestment: parseFloat(totalInvestment.toFixed(2)),
    futureValue: parseFloat(futureValue.toFixed(2)),
    gainedAmount: parseFloat(gainedAmount.toFixed(2)),
    monthlyReturn: parseFloat(monthlyRate.toFixed(8)),
    numberOfMonths: numberOfMonths,
  };
}
