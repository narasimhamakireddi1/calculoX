/**
 * Deduction Engine
 * Calculates all applicable deductions under Section 80C, 80D, 80E, 80G, 80TTA/TTB, 24(b)
 */

import { Deductions, TaxpayerProfile } from './types';
import { getTaxRulesForFY } from './rules';

interface DeductionResult {
  section80C: number;
  section80CCD1B: number;
  section80D: number;
  section80E: number;
  section80G: number;
  section80TTA_TTB: number;
  section24b: number;
  totalDeductions: number;
  itemizedBreakdown: Array<{
    section: string;
    description: string;
    amount: number;
    maxAllowed: number;
    actualDeduction: number;
  }>;
}

/**
 * Calculate Section 80C Deductions
 * Includes: EPF, PPF, ELSS, Life Insurance, Home Loan Principal, SSY, NSC, Tax Saver FD, Tuition Fees
 * Cap: ₹1.5 Lakh
 */
export function calculateSection80C(deductions: Deductions): {
  totalClaimed: number;
  deduction: number;
  cap: number;
} {
  const rules = getTaxRulesForFY();
  const cap = rules.deductionCaps.section80C;

  const totalClaimed =
    deductions.epf +
    deductions.ppf +
    deductions.elss +
    deductions.lifeInsurance +
    deductions.homeRepayment +
    deductions.ssy +
    deductions.nsc +
    deductions.taxSaverFD +
    deductions.tuitionFees;

  const deduction = Math.min(totalClaimed, cap);

  return {
    totalClaimed,
    deduction,
    cap,
  };
}

/**
 * Calculate Section 80CCD(1B) - NPS Additional Deduction
 * Additional deduction beyond 80C for NPS contributions
 * Cap: ₹50,000
 */
export function calculateSection80CCD1B(npsAdditional: number): {
  claimed: number;
  deduction: number;
  cap: number;
} {
  const rules = getTaxRulesForFY();
  const cap = rules.deductionCaps.section80CCD1B;

  const deduction = Math.min(npsAdditional, cap);

  return {
    claimed: npsAdditional,
    deduction,
    cap,
  };
}

/**
 * Calculate Section 80D - Health Insurance Deduction
 * Different limits for self/family, parents, and based on age
 */
export function calculateSection80D(deductions: Deductions, profile: TaxpayerProfile): {
  selfFamily: number;
  parents: number;
  deduction: number;
} {
  const rules = getTaxRulesForFY();
  const caps = rules.deductionCaps.section80D;

  // Self & Family limit based on own age
  const selfFamilyLimit =
    profile.age === 'below60' ? caps.selfFamilyBelow60 : caps.selfFamilyAbove60;
  const selfFamilyDeduction = Math.min(deductions.healthInsuranceSelf, selfFamilyLimit);

  // Parents limit based on parents' age
  const parentsLimit =
    deductions.parentsAge === 'below60' ? caps.parentsBelow60 : caps.parentsAbove60;
  const parentsDeduction = Math.min(deductions.healthInsuranceParents, parentsLimit);

  return {
    selfFamily: selfFamilyDeduction,
    parents: parentsDeduction,
    deduction: selfFamilyDeduction + parentsDeduction,
  };
}

/**
 * Calculate Section 80E - Education Loan Interest
 * No cap - full interest is deductible (for first 8 years)
 */
export function calculateSection80E(interestPaid: number): {
  claimed: number;
  deduction: number;
} {
  return {
    claimed: interestPaid,
    deduction: Math.max(0, interestPaid), // No cap
  };
}

/**
 * Calculate Section 80G - Charitable Donations
 * 100% of eligible donations + 50% of 50%-eligible donations
 */
export function calculateSection80G(donations100: number, donations50: number): {
  deduction100: number;
  deduction50: number;
  deduction: number;
} {
  const deduction100 = Math.max(0, donations100);
  const deduction50 = Math.max(0, donations50 * 0.5); // Only 50% of 50%-eligible donations

  return {
    deduction100,
    deduction50,
    deduction: deduction100 + deduction50,
  };
}

/**
 * Calculate Section 80TTA / 80TTB
 * 80TTA: Savings account interest (below 60) - cap ₹10,000
 * 80TTB: Bank interest (60+) - cap ₹50,000
 */
export function calculateSection80TTA_TTB(interest: number, profile: TaxpayerProfile): {
  claimed: number;
  deduction: number;
  cap: number;
  section: 'section80TTA' | 'section80TTB';
} {
  const rules = getTaxRulesForFY();

  const isSeniorCitizen = profile.age !== 'below60';
  const cap = isSeniorCitizen
    ? rules.deductionCaps.section80TTB
    : rules.deductionCaps.section80TTA;
  const deduction = Math.min(interest, cap);
  const section = isSeniorCitizen ? 'section80TTB' : 'section80TTA';

  return {
    claimed: interest,
    deduction,
    cap,
    section,
  };
}

/**
 * Calculate Section 24(b) - Home Loan Interest (Self-occupied)
 * Cap: ₹2,00,000
 */
export function calculateSection24b(interest: number): {
  claimed: number;
  deduction: number;
  cap: number;
} {
  const rules = getTaxRulesForFY();
  const cap = rules.deductionCaps.section24b;

  const deduction = Math.min(interest, cap);

  return {
    claimed: interest,
    deduction,
    cap,
  };
}

/**
 * Calculate Total Deductions for Old Regime
 * Sum of all applicable deductions
 * Note: New regime only allows standard deduction, not these
 */
export function calculateTotalDeductions(deductions: Deductions, profile: TaxpayerProfile): DeductionResult {
  const section80C = calculateSection80C(deductions);
  const section80CCD1B = calculateSection80CCD1B(deductions.npsAdditional);
  const section80D = calculateSection80D(deductions, profile);
  const section80E = calculateSection80E(deductions.educationLoanInterest);
  const section80G = calculateSection80G(deductions.donations100, deductions.donations50);
  const section80TTA_TTB = calculateSection80TTA_TTB(deductions.savingsInterest, profile);
  const section24b = calculateSection24b(deductions.homeLoanInterest);

  const totalDeductions =
    section80C.deduction +
    section80CCD1B.deduction +
    section80D.deduction +
    section80E.deduction +
    section80G.deduction +
    section80TTA_TTB.deduction +
    section24b.deduction;

  const itemizedBreakdown = [
    {
      section: '80C',
      description: 'EPF, PPF, ELSS, Life Insurance, Home Loan Principal, etc.',
      amount: section80C.totalClaimed,
      maxAllowed: section80C.cap,
      actualDeduction: section80C.deduction,
    },
    {
      section: '80CCD1B',
      description: 'NPS (Additional beyond 80C)',
      amount: deductions.npsAdditional,
      maxAllowed: section80CCD1B.cap,
      actualDeduction: section80CCD1B.deduction,
    },
    {
      section: '80D',
      description: 'Health Insurance (Self, Family, Parents)',
      amount: deductions.healthInsuranceSelf + deductions.healthInsuranceParents,
      maxAllowed: section80D.selfFamily + section80D.parents,
      actualDeduction: section80D.deduction,
    },
    {
      section: '80E',
      description: 'Education Loan Interest',
      amount: deductions.educationLoanInterest,
      maxAllowed: Infinity,
      actualDeduction: section80E.deduction,
    },
    {
      section: '80G',
      description: 'Charitable Donations',
      amount: deductions.donations100 + deductions.donations50,
      maxAllowed: Infinity,
      actualDeduction: section80G.deduction,
    },
    {
      section: section80TTA_TTB.section === 'section80TTA' ? '80TTA' : '80TTB',
      description: 'Savings/Bank Interest',
      amount: deductions.savingsInterest,
      maxAllowed: section80TTA_TTB.cap,
      actualDeduction: section80TTA_TTB.deduction,
    },
    {
      section: '24(b)',
      description: 'Home Loan Interest (Self-occupied)',
      amount: deductions.homeLoanInterest,
      maxAllowed: section24b.cap,
      actualDeduction: section24b.deduction,
    },
  ];

  return {
    section80C: section80C.deduction,
    section80CCD1B: section80CCD1B.deduction,
    section80D: section80D.deduction,
    section80E: section80E.deduction,
    section80G: section80G.deduction,
    section80TTA_TTB: section80TTA_TTB.deduction,
    section24b: section24b.deduction,
    totalDeductions,
    itemizedBreakdown,
  };
}
