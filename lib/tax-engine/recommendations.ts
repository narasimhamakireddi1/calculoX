/**
 * Tax Saving Recommendations Engine
 * Analyzes deductions and suggests opportunities for tax savings
 */

import { Deductions, TaxpayerProfile, TaxSavingRecommendation } from './types';
import { getTaxRulesForFY } from './rules';

/**
 * Generate tax saving recommendations based on unused deduction capacity
 * Shows which sections have room for more investment/spending
 */
export function generateTaxSavingRecommendations(
  deductions: Deductions,
  profile: TaxpayerProfile,
  marginalRate: number // Marginal tax rate of the taxpayer
): TaxSavingRecommendation[] {
  const rules = getTaxRulesForFY();
  const caps = rules.deductionCaps;
  const recommendations: TaxSavingRecommendation[] = [];

  // RECOMMENDATION 1: Section 80C (Max ₹1.5 Lakh)
  const section80CCurrent =
    deductions.epf +
    deductions.ppf +
    deductions.elss +
    deductions.lifeInsurance +
    deductions.homeRepayment +
    deductions.ssy +
    deductions.nsc +
    deductions.taxSaverFD +
    deductions.tuitionFees;
  const section80CGap = Math.max(0, caps.section80C - section80CCurrent);

  if (section80CGap > 0) {
    recommendations.push({
      section: '80C',
      description: 'Invest in PPF, ELSS, Life Insurance, or home loan repayment (₹1.5 Lakh limit)',
      currentAmount: Math.min(section80CCurrent, caps.section80C),
      maxAmount: caps.section80C,
      gap: section80CGap,
      potentialSavingPerLakh: (marginalRate * 100000) / 100,
      potentialSaving: (section80CGap * marginalRate) / 100,
      priority: 1,
    });
  }

  // RECOMMENDATION 2: Section 80CCD(1B) - NPS (₹50,000)
  const npsGap = Math.max(0, caps.section80CCD1B - deductions.npsAdditional);

  if (npsGap > 0) {
    recommendations.push({
      section: '80CCD1B',
      description: 'Invest extra ₹50,000 in NPS (over and above 80C)',
      currentAmount: Math.min(deductions.npsAdditional, caps.section80CCD1B),
      maxAmount: caps.section80CCD1B,
      gap: npsGap,
      potentialSavingPerLakh: (marginalRate * 100000) / 100,
      potentialSaving: (npsGap * marginalRate) / 100,
      priority: 2,
    });
  }

  // RECOMMENDATION 3: Section 80D - Health Insurance
  let section80DSelfFamilyGap = 0;
  let section80DParentsGap = 0;

  const selfFamilyLimit =
    profile.age === 'below60' ? caps.section80D.selfFamilyBelow60 : caps.section80D.selfFamilyAbove60;
  section80DSelfFamilyGap = Math.max(0, selfFamilyLimit - deductions.healthInsuranceSelf);

  const parentsLimit = deductions.parentsAge === 'below60' ? caps.section80D.parentsBelow60 : caps.section80D.parentsAbove60;
  section80DParentsGap = Math.max(0, parentsLimit - deductions.healthInsuranceParents);

  if (section80DSelfFamilyGap > 0) {
    recommendations.push({
      section: '80D (Self)',
      description: `Buy health insurance for self/family (₹${selfFamilyLimit.toLocaleString(
        'en-IN'
      )} limit)`,
      currentAmount: Math.min(deductions.healthInsuranceSelf, selfFamilyLimit),
      maxAmount: selfFamilyLimit,
      gap: section80DSelfFamilyGap,
      potentialSavingPerLakh: (marginalRate * 100000) / 100,
      potentialSaving: (section80DSelfFamilyGap * marginalRate) / 100,
      priority: 1,
    });
  }

  if (section80DParentsGap > 0) {
    recommendations.push({
      section: '80D (Parents)',
      description: `Buy health insurance for parents (₹${parentsLimit.toLocaleString(
        'en-IN'
      )} limit)`,
      currentAmount: Math.min(deductions.healthInsuranceParents, parentsLimit),
      maxAmount: parentsLimit,
      gap: section80DParentsGap,
      potentialSavingPerLakh: (marginalRate * 100000) / 100,
      potentialSaving: (section80DParentsGap * marginalRate) / 100,
      priority: 2,
    });
  }

  // RECOMMENDATION 4: Section 80G - Charitable Donations
  // Show as recommendation only if currently not donating
  if (deductions.donations100 + deductions.donations50 === 0 && marginalRate >= 20) {
    recommendations.push({
      section: '80G',
      description: 'Make charitable donations to 80G-approved organizations',
      currentAmount: 0,
      maxAmount: 0, // No strict cap
      gap: Infinity,
      potentialSavingPerLakh: (marginalRate * 100000) / 100,
      potentialSaving: 0, // Can't estimate without donation amount
      priority: 3,
    });
  }

  // RECOMMENDATION 5: Section 24(b) - Home Loan Interest
  const section24bGap = Math.max(0, caps.section24b - deductions.homeLoanInterest);

  if (section24bGap > 0 && deductions.homeLoanInterest > 0) {
    recommendations.push({
      section: '24(b)',
      description: 'Pay home loan interest (₹2 Lakh limit for self-occupied)',
      currentAmount: Math.min(deductions.homeLoanInterest, caps.section24b),
      maxAmount: caps.section24b,
      gap: section24bGap,
      potentialSavingPerLakh: (marginalRate * 100000) / 100,
      potentialSaving: (section24bGap * marginalRate) / 100,
      priority: 2,
    });
  }

  // Sort by potential saving (descending) and then by priority
  recommendations.sort((a, b) => {
    if (b.potentialSaving !== a.potentialSaving) {
      return b.potentialSaving - a.potentialSaving;
    }
    return a.priority - b.priority;
  });

  return recommendations;
}

/**
 * Calculate total potential tax saving if all recommendations are followed
 */
export function calculateTotalTaxSavingPotential(recommendations: TaxSavingRecommendation[]): number {
  return recommendations.reduce((sum, rec) => sum + rec.potentialSaving, 0);
}
