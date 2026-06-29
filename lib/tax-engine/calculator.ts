/**
 * Comprehensive Tax Calculator Engine
 * Orchestrates all tax calculation modules
 * Deterministic, auditable, versioned calculations
 */

import {
  ComprehensiveTaxInput,
  ComprehensiveTaxResult,
  RegimeResult,
  TaxCalculationTrace,
} from './types';
import { getTaxRulesForFY } from './rules';
import { calculateSalaryExemptions } from './exemptions';
import { calculateTotalDeductions } from './deductions';
import { calculateSlabTax } from './slabs';
import { calculateRebate87A } from './rebate';
import { calculateSurcharge } from './surcharge';
import { generateTaxSavingRecommendations } from './recommendations';

/**
 * Main tax calculation function
 * Calculates both old and new regimes, compares, and recommends
 */
export function calculateComprehensiveTax(input: ComprehensiveTaxInput): ComprehensiveTaxResult {
  const rules = getTaxRulesForFY();

  // Calculate both regimes
  const newRegimeResult = calculateRegimeTax('new', input);
  const oldRegimeResult = calculateRegimeTax('old', input);

  // Determine recommended regime
  const recommended = newRegimeResult.totalTax <= oldRegimeResult.totalTax ? 'new' : 'old';
  const savings = Math.abs(newRegimeResult.totalTax - oldRegimeResult.totalTax);

  // Generate explanation
  const explanation = generateRegimeRecommendationExplanation(
    newRegimeResult.totalTax,
    oldRegimeResult.totalTax,
    recommended,
    savings
  );

  // Generate tax saving recommendations (for old regime)
  const recommendations = generateTaxSavingRecommendations(
    input.deductions,
    input.profile,
    oldRegimeResult.marginalRate
  );

  return {
    oldRegime: oldRegimeResult,
    newRegime: newRegimeResult,
    recommended,
    savings,
    explanation,
    recommendations,
    fy: rules.fy,
    ay: rules.ay,
    timestamp: new Date(),
  };
}

/**
 * Calculate tax for a single regime
 */
function calculateRegimeTax(regime: 'old' | 'new', input: ComprehensiveTaxInput): RegimeResult {
  const rules = getTaxRulesForFY();
  const regimeRules = regime === 'new' ? rules.newRegime : rules.oldRegime;
  const trace: TaxCalculationTrace[] = [];

  // Extract inputs
  const { salary, deductions, profile } = input;
  const { grossSalary, incomeHouseProperty = 0, incomeOtherSources = 0, npsEmployerContribution = 0 } = salary;

  // Step 1: Calculate exemptions (HRA, LTA) - only for Old Regime
  let hraExemption = 0;
  let ltaExemption = 0;

  if (regime === 'old') {
    const exemptions = calculateSalaryExemptions(salary);
    hraExemption = exemptions.hraExemption;
    ltaExemption = exemptions.ltaExemption;
  }

  trace.push({
    step: 'HRA Exemption',
    description: `HRA exemption (${regime === 'old' ? 'Old' : 'New'} regime): ₹${hraExemption.toLocaleString('en-IN')}`,
    value: hraExemption,
  });

  trace.push({
    step: 'LTA Exemption',
    description: `LTA exemption (${regime === 'old' ? 'Old' : 'New'} regime): ₹${ltaExemption.toLocaleString('en-IN')}`,
    value: ltaExemption,
  });

  // Step 2: Apply standard deduction
  const standardDeduction = regimeRules.standardDeduction;

  trace.push({
    step: 'Standard Deduction',
    description: `Standard deduction (${regime === 'new' ? 'New' : 'Old'} regime): ₹${standardDeduction.toLocaleString('en-IN')}`,
    value: standardDeduction,
  });

  // Step 3: Calculate Gross Total Income (GTI)
  // GTI = Gross Salary + House Property + Other Sources - HRA Exemption - LTA Exemption - Standard Deduction
  const grossTotalIncome = Math.max(
    0,
    grossSalary + incomeHouseProperty + incomeOtherSources - hraExemption - ltaExemption - standardDeduction
  );

  trace.push({
    step: 'Gross Total Income',
    description: `Gross Salary + Other Income - Exemptions - Standard Deduction = ₹${grossTotalIncome.toLocaleString(
      'en-IN'
    )}`,
    value: grossTotalIncome,
  });

  // Step 4: Calculate Deductions (old regime allows Chapter VIA; new regime allows 80CCD(2) only)
  let totalDeductions = 0;

  if (regime === 'old') {
    const deductionsResult = calculateTotalDeductions(deductions, profile);
    totalDeductions = deductionsResult.totalDeductions + npsEmployerContribution;

    trace.push({
      step: 'Deductions (80C, 80D, etc.)',
      description: `Total deductions under old regime: ₹${totalDeductions.toLocaleString('en-IN')}`,
      value: totalDeductions,
    });
  } else {
    // New regime: only 80CCD(2) employer NPS is allowed
    totalDeductions = npsEmployerContribution;

    if (npsEmployerContribution > 0) {
      trace.push({
        step: 'Deductions (80CCD(2) only)',
        description: `New regime: Only employer NPS contribution (80CCD(2)) allowed: ₹${npsEmployerContribution.toLocaleString(
          'en-IN'
        )}`,
        value: npsEmployerContribution,
      });
    } else {
      trace.push({
        step: 'Deductions (80CCD(2) only)',
        description: `New regime: No deductions allowed (only standard deduction and employer NPS)`,
        value: 0,
      });
    }
  }

  // Step 5: Calculate Taxable Income
  const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions);

  trace.push({
    step: 'Taxable Income',
    description: `Gross Total Income - Deductions = ₹${taxableIncome.toLocaleString(
      'en-IN'
    )}`,
    value: taxableIncome,
  });

  // Step 6: Calculate Slab Tax
  const slabs = Array.isArray(regimeRules.slabs)
    ? regimeRules.slabs
    : regimeRules.slabs[profile.age];
  const { tax: slabTax, breakdown: slabBreakdown, marginalRate } = calculateSlabTax(taxableIncome, slabs);

  trace.push({
    step: 'Slab Tax',
    description: `Tax calculated from slabs: ₹${slabTax.toLocaleString('en-IN')}`,
    value: slabTax,
  });

  // Step 7: Apply Section 87A Rebate
  const rebateResult = calculateRebate87A(slabTax, taxableIncome, regime);

  trace.push({
    step: 'Section 87A Rebate',
    description: rebateResult.explanation,
    value: rebateResult.rebate,
  });

  // Step 8: Calculate Surcharge (based on gross total income threshold)
  const surchargeResult = calculateSurcharge(rebateResult.taxAfterRebate, grossTotalIncome, regime);

  trace.push({
    step: 'Surcharge',
    description: surchargeResult.explanation,
    value: surchargeResult.surcharge,
  });

  // Step 9: Calculate Cess (4% on tax + surcharge)
  const cessBase = rebateResult.taxAfterRebate + surchargeResult.surcharge;
  const cess = (cessBase * rules.healthEducationCess) / 100;

  trace.push({
    step: 'Health & Education Cess',
    description: `4% cess on (tax after rebate + surcharge): ₹${cess.toLocaleString('en-IN')}`,
    value: cess,
  });

  // Step 10: Calculate Total Tax
  const totalTax = rebateResult.taxAfterRebate + surchargeResult.surcharge + cess;

  trace.push({
    step: 'Total Tax Payable',
    description: `Tax + Surcharge + Cess: ₹${totalTax.toLocaleString('en-IN')}`,
    value: totalTax,
  });

  // Step 11: Calculate Effective Rate
  const effectiveRate = grossSalary > 0 ? (totalTax / grossSalary) * 100 : 0;

  trace.push({
    step: 'Effective Tax Rate',
    description: `(Total Tax / Gross Salary) × 100 = ${effectiveRate.toFixed(2)}%`,
    value: effectiveRate,
  });

  return {
    regime,
    grossSalary,
    hraExemption,
    ltaExemption,
    standardDeduction,
    grossTotalIncome,
    totalDeductions,
    taxableIncome,
    slabTax,
    rebate: rebateResult.rebate,
    marginalRelief: rebateResult.marginalRelief,
    taxAfterRebate: rebateResult.taxAfterRebate,
    surcharge: surchargeResult.surcharge,
    cess,
    totalTax,
    effectiveRate,
    marginalRate,
    breakdown: slabBreakdown,
    trace,
  };
}

/**
 * Generate human-readable explanation for regime recommendation
 */
function generateRegimeRecommendationExplanation(
  newRegimeTax: number,
  oldRegimeTax: number,
  recommended: 'old' | 'new',
  savings: number
): string {
  if (Math.abs(newRegimeTax - oldRegimeTax) < 100) {
    return `Both regimes result in similar tax. Choose based on your financial planning. New regime: ₹${newRegimeTax.toLocaleString(
      'en-IN'
    )}, Old regime: ₹${oldRegimeTax.toLocaleString('en-IN')}.`;
  }

  if (recommended === 'new') {
    return `New regime is better by ₹${savings.toLocaleString(
      'en-IN'
    )}. You'll save tax by choosing new regime. New regime works well for salaried employees with minimal deductions.`;
  } else {
    return `Old regime is better by ₹${savings.toLocaleString(
      'en-IN'
    )}. Your deductions under old regime (80C, 80D, etc.) are substantial enough to offset the higher tax rates.`;
  }
}
