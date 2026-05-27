/**
 * Exemption Calculations (HRA, LTA)
 * All exemptions are based on actual income and salary structure
 */

import { SalaryIncome } from './types';
import { getTaxRulesForFY } from './rules';

/**
 * Calculate HRA Exemption
 * HRA exemption is the MINIMUM of:
 * 1. Actual HRA received
 * 2. 50% of basic (metro) or 40% of basic (non-metro)
 * 3. Rent paid - 10% of basic salary
 *
 * Result can never be negative (if rent < 10% of basic, exemption = 0)
 */
export function calculateHRAExemption(salary: SalaryIncome): number {
  const rules = getTaxRulesForFY();
  const hraRules = rules.hraExemption;

  const { basicSalary, hraReceived, rentPaid, cityType } = salary;

  // Component 1: Actual HRA received
  const component1 = hraReceived;

  // Component 2: Percentage of basic (metro or non-metro)
  const percentage = cityType === 'metro' ? hraRules.metroPercent : hraRules.nonMetroPercent;
  const component2 = (basicSalary * percentage) / 100;

  // Component 3: Rent paid - 10% of basic
  // If rent paid < 10% of basic, this component becomes 0 or negative (capped at 0)
  const thresholdAmount = (basicSalary * hraRules.rentThreshold) / 100;
  const component3 = Math.max(0, rentPaid - thresholdAmount);

  // Exemption is the MINIMUM of all three components
  // Result is never negative
  const exemption = Math.min(component1, component2, component3);

  return Math.max(0, exemption);
}

/**
 * Calculate LTA Exemption
 * LTA is allowed once in 4 financial years
 * For simplicity, we're not tracking across FYs, just returning what user claims
 * Exemption = minimum of (actual LTA claimed, amount within limit)
 */
export function calculateLTAExemption(salary: SalaryIncome): number {
  const { lta } = salary;

  // In FY 2025-26, there's no specific cap on LTA exemption amount
  // Exemption is limited to:
  // 1. Actual LTA claimed by employee
  // 2. Amount within policy (once in 4 years)
  //
  // For calculation purposes, if user enters LTA claimed, that's the exemption
  // (assuming they're within the 4-year cycle)

  return Math.max(0, lta);
}

/**
 * Calculate total salary-based exemptions (HRA + LTA)
 */
export function calculateSalaryExemptions(salary: SalaryIncome): {
  hraExemption: number;
  ltaExemption: number;
  totalExemption: number;
} {
  const hraExemption = calculateHRAExemption(salary);
  const ltaExemption = calculateLTAExemption(salary);

  return {
    hraExemption,
    ltaExemption,
    totalExemption: hraExemption + ltaExemption,
  };
}

/**
 * Detailed HRA calculation (for explanation)
 */
export function explainHRAExemption(salary: SalaryIncome): {
  component1: number; // Actual HRA
  component2: number; // % of basic
  component3: number; // Rent - 10% of basic
  exemption: number;
  explanation: string;
} {
  const rules = getTaxRulesForFY();
  const hraRules = rules.hraExemption;

  const { basicSalary, hraReceived, rentPaid, cityType } = salary;

  const component1 = hraReceived;
  const percentage = cityType === 'metro' ? hraRules.metroPercent : hraRules.nonMetroPercent;
  const component2 = (basicSalary * percentage) / 100;
  const thresholdAmount = (basicSalary * hraRules.rentThreshold) / 100;
  const component3 = Math.max(0, rentPaid - thresholdAmount);

  const exemption = Math.min(component1, component2, component3);

  const explanation = `HRA Exemption = min(
    Actual HRA (₹${component1.toLocaleString('en-IN')}),
    ${percentage}% of Basic (₹${component2.toLocaleString('en-IN')}),
    Rent - 10% of Basic (₹${component3.toLocaleString('en-IN')})
  ) = ₹${Math.max(0, exemption).toLocaleString('en-IN')}`;

  return {
    component1,
    component2,
    component3,
    exemption: Math.max(0, exemption),
    explanation,
  };
}
