/**
 * Surcharge Calculator
 * Additional tax on very high earners
 * Surcharge tiers: 10%, 15%, 25%, 37% based on gross income
 * New regime caps surcharge at 25%
 */

import { getTaxRulesForFY } from './rules';

interface SurchargeResult {
  rate: number;
  surcharge: number;
  marginalRelief: number;
  explanation: string;
}

/**
 * Calculate Surcharge
 * Surcharge is applied on tax (after rebate), based on gross income brackets
 * Marginal relief: Ensure total tax + surcharge increase doesn't exceed income increase at thresholds
 */
export function calculateSurcharge(
  taxAfterRebate: number,
  grossIncome: number,
  regime: 'old' | 'new'
): SurchargeResult {
  const rules = getTaxRulesForFY();
  const surchargeRules = rules.surcharge;

  let rate = 0;
  let surcharge = 0;
  let marginalRelief = 0;
  let explanation = '';

  // Find applicable surcharge rate based on gross income
  for (const tier of surchargeRules.tiers) {
    const tierMax = tier.maxIncome || Infinity;

    if (grossIncome > tier.minIncome && grossIncome <= tierMax) {
      rate = tier.rate;
      break;
    } else if (grossIncome > tier.minIncome && tier.maxIncome === null) {
      // Last tier (open-ended)
      rate = tier.rate;
      break;
    }
  }

  // Cap surcharge in new regime at 25%
  if (regime === 'new' && rate > 25) {
    rate = 25;
  }

  // Calculate surcharge
  surcharge = (taxAfterRebate * rate) / 100;

  // Apply marginal relief at surcharge threshold crossings
  // Marginal relief: Total tax increase should not exceed income increase at threshold
  //
  // Check if crossing a surcharge bracket boundary
  const surchargeThresholds = [5000000, 10000000, 20000000, 50000000]; // 50L, 1Cr, 2Cr, 5Cr

  for (const threshold of surchargeThresholds) {
    if (grossIncome > threshold && grossIncome - threshold < 1000000) {
      // Close to threshold, check if marginal relief applies
      // Get surcharge rate just below threshold
      const rateBelowThreshold = getSurchargeRateAtIncome(threshold - 1, surchargeRules.tiers);

      // If rate changed at this threshold and new rate is higher
      if (rate > rateBelowThreshold) {
        // Calculate tax at both sides of threshold
        const oldSurcharge = (taxAfterRebate * rateBelowThreshold) / 100;
        const additionalSurcharge = surcharge - oldSurcharge;
        const incomeOverThreshold = grossIncome - threshold;

        // If surcharge increase > income increase, apply marginal relief
        if (additionalSurcharge > incomeOverThreshold) {
          marginalRelief = additionalSurcharge - incomeOverThreshold;
          surcharge -= marginalRelief;
        }
      }
    }
  }

  // Format explanation
  if (rate === 0) {
    explanation = `No Surcharge: Gross income ₹${grossIncome.toLocaleString(
      'en-IN'
    )} is below ₹50 Lakh`;
  } else {
    const ratePercent = rate === 25 && regime === 'new' ? `${rate}% (capped)` : `${rate}%`;
    explanation = `Surcharge ${ratePercent}: ₹${surcharge.toLocaleString(
      'en-IN'
    )} on gross income ₹${grossIncome.toLocaleString('en-IN')}`;

    if (marginalRelief > 0) {
      explanation += ` (Marginal relief applied: ₹${marginalRelief.toLocaleString('en-IN')})`;
    }
  }

  return {
    rate,
    surcharge: Math.round(surcharge * 100) / 100,
    marginalRelief: Math.round(marginalRelief * 100) / 100,
    explanation,
  };
}

/**
 * Helper: Get surcharge rate applicable at a given income level
 */
function getSurchargeRateAtIncome(income: number, tiers: Array<{ minIncome: number; maxIncome: number | null; rate: number }>): number {
  for (const tier of tiers) {
    const tierMax = tier.maxIncome || Infinity;

    if (income > tier.minIncome && income <= tierMax) {
      return tier.rate;
    } else if (income > tier.minIncome && tier.maxIncome === null) {
      return tier.rate;
    }
  }
  return 0;
}
