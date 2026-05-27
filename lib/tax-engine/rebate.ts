/**
 * Section 87A Rebate Calculator
 * Rebate for lower and middle-income earners with marginal relief
 */

import { getTaxRulesForFY } from './rules';

interface Rebate87AResult {
  rebate: number;
  marginalRelief: number;
  taxAfterRebate: number;
  explanation: string;
}

/**
 * Calculate Section 87A Rebate
 * New Regime: ₹60,000 rebate for taxable income ≤ ₹12,00,000
 * Old Regime: ₹12,500 rebate for taxable income ≤ ₹5,00,000
 *
 * Also applies marginal relief:
 * - New regime: If taxable income is just above ₹12L, tax is capped at excess income
 * - Old regime: If taxable income is just above ₹5L, tax is capped at excess income
 */
export function calculateRebate87A(
  slabTax: number,
  taxableIncome: number,
  regime: 'old' | 'new'
): Rebate87AResult {
  const rules = getTaxRulesForFY();
  const regimeRules = regime === 'new' ? rules.newRegime : rules.oldRegime;
  const rebateRules = regimeRules.rebate87A;

  let rebate = 0;
  let marginalRelief = 0;
  let taxAfterRebate = slabTax;
  let explanation = '';

  if (regime === 'new') {
    // NEW REGIME: ₹60,000 rebate if taxable income ≤ ₹12,00,000
    if (taxableIncome <= rebateRules.maxTaxableIncome) {
      // Full rebate applies
      rebate = Math.min(rebateRules.maxRebate, slabTax);
      taxAfterRebate = Math.max(0, slabTax - rebate);
      explanation = `Section 87A Rebate applies: ₹${rebate.toLocaleString(
        'en-IN'
      )} (Taxable income ₹${taxableIncome.toLocaleString('en-IN')} ≤ ₹${rebateRules.maxTaxableIncome.toLocaleString(
        'en-IN'
      )})`;
    } else {
      // Income exceeds ₹12L, but marginal relief may still apply
      // Marginal relief: Tax should not exceed excess income over ₹12L
      const excessIncome = taxableIncome - rebateRules.maxTaxableIncome;

      if (slabTax > excessIncome) {
        // Marginal relief applies: cap tax at excess income
        marginalRelief = slabTax - excessIncome;
        taxAfterRebate = excessIncome;
        explanation = `Section 87A Marginal Relief applies: Tax capped at excess income of ₹${excessIncome.toLocaleString(
          'en-IN'
        )} (Taxable income ₹${taxableIncome.toLocaleString('en-IN')} > ₹${rebateRules.maxTaxableIncome.toLocaleString(
          'en-IN'
        )})`;
      } else {
        // No rebate or marginal relief
        taxAfterRebate = slabTax;
        explanation = `No Section 87A Rebate: Taxable income ₹${taxableIncome.toLocaleString(
          'en-IN'
        )} exceeds ₹${rebateRules.maxTaxableIncome.toLocaleString('en-IN')}`;
      }
    }
  } else {
    // OLD REGIME: ₹12,500 rebate if taxable income ≤ ₹5,00,000
    if (taxableIncome <= rebateRules.maxTaxableIncome) {
      // Full rebate applies
      rebate = Math.min(rebateRules.maxRebate, slabTax);
      taxAfterRebate = Math.max(0, slabTax - rebate);
      explanation = `Section 87A Rebate applies: ₹${rebate.toLocaleString(
        'en-IN'
      )} (Taxable income ₹${taxableIncome.toLocaleString('en-IN')} ≤ ₹${rebateRules.maxTaxableIncome.toLocaleString(
        'en-IN'
      )})`;
    } else {
      // Income exceeds ₹5L, but marginal relief may still apply
      const excessIncome = taxableIncome - rebateRules.maxTaxableIncome;

      if (slabTax > excessIncome) {
        // Marginal relief applies
        marginalRelief = slabTax - excessIncome;
        taxAfterRebate = excessIncome;
        explanation = `Section 87A Marginal Relief applies: Tax capped at excess income of ₹${excessIncome.toLocaleString(
          'en-IN'
        )} (Taxable income ₹${taxableIncome.toLocaleString('en-IN')} > ₹${rebateRules.maxTaxableIncome.toLocaleString(
          'en-IN'
        )})`;
      } else {
        // No rebate or marginal relief
        taxAfterRebate = slabTax;
        explanation = `No Section 87A Rebate: Taxable income ₹${taxableIncome.toLocaleString(
          'en-IN'
        )} exceeds ₹${rebateRules.maxTaxableIncome.toLocaleString('en-IN')}`;
      }
    }
  }

  return {
    rebate: Math.round(rebate * 100) / 100,
    marginalRelief: Math.round(marginalRelief * 100) / 100,
    taxAfterRebate: Math.round(taxAfterRebate * 100) / 100,
    explanation,
  };
}
