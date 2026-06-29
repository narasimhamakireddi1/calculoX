/**
 * Comprehensive Tax Calculation Types (India FY 2025-26)
 * Production-grade type definitions for deterministic tax computation
 */

// Taxpayer Profile
export interface TaxpayerProfile {
  age: 'below60' | 'between60to80' | 'above80';
  residentialStatus: 'resident' | 'nri';
  employerType: 'government' | 'private';
}

// Salary Income Components
export interface SalaryIncome {
  grossSalary: number; // Total CTC / Annual salary
  basicSalary: number; // Basic salary component (for HRA calculation)
  hraReceived: number; // HRA received from employer
  rentPaid: number; // Annual rent paid (for HRA exemption)
  cityType: 'metro' | 'non-metro'; // Metro cities: Mumbai, Delhi, Kolkata, Chennai
  lta: number; // Leave Travel Allowance claimed
  epfEmployee: number; // Employee EPF contribution (goes into 80C)

  // Additional Income Sources
  incomeHouseProperty?: number; // Net rental income (after 30% standard deduction)
  incomeOtherSources?: number; // FD interest, capital gains, etc.

  // NPS Employer Contribution (80CCD(2) - allowed in both regimes)
  npsEmployerContribution?: number; // Employer NPS contribution (allowed in both old & new regime)
}

// All Deduction Components
export interface Deductions {
  // Section 80C (max ₹1.5 Lakh)
  epf: number; // Employee Provident Fund
  ppf: number; // Public Provident Fund
  elss: number; // ELSS Mutual Funds
  lifeInsurance: number; // Life Insurance Premium
  homeRepayment: number; // Home loan principal repayment
  ssy: number; // Sukanya Samriddhi Scheme
  nsc: number; // National Savings Certificate
  taxSaverFD: number; // 5-year tax saver FD
  tuitionFees: number; // Tuition fees

  // Section 80CCD (1B) - NPS additional ₹50K
  npsAdditional: number;

  // Section 80D - Health Insurance
  healthInsuranceSelf: number; // Self + family premium
  healthInsuranceParents: number; // Parents' premium
  parentsAge: 'below60' | 'above60'; // Determines 80D limit

  // Section 80E - Education Loan Interest (no limit)
  educationLoanInterest: number;

  // Section 80G - Donations
  donations100: number; // 100% qualifying donations
  donations50: number; // 50% qualifying donations

  // Section 80TTA/TTB - Savings/Bank Interest
  savingsInterest: number;

  // Section 24(b) - Home Loan Interest (max ₹2 Lakh, self-occupied)
  homeLoanInterest: number;
}

// Input for comprehensive tax calculation
export interface ComprehensiveTaxInput {
  profile: TaxpayerProfile;
  salary: SalaryIncome;
  deductions: Deductions;
  regime: 'old' | 'new' | 'auto'; // 'auto' = calculate both and recommend
}

// Calculation Trace (for audit trail)
export interface TaxCalculationTrace {
  step: string; // Name of step (e.g., "HRA Exemption", "Slab Tax")
  description: string; // Human-readable description
  value: number; // Calculated value
}

// Tax Slab Breakdown Item
export interface TaxBreakdownItem {
  slab: string; // Slab range (e.g., "₹0L - ₹4L")
  rate: number; // Tax rate (%)
  incomeInSlab: number; // Income falling in this slab
  tax: number; // Tax calculated for this slab
}

// Single Regime Calculation Result
export interface RegimeResult {
  regime: 'old' | 'new';

  // Exemptions & Deductions
  grossSalary: number;
  hraExemption: number; // Exemption from HRA
  ltaExemption: number; // Exemption from LTA
  standardDeduction: number; // Regime-specific standard deduction
  grossTotalIncome: number; // GI = salary - exemptions
  totalDeductions: number; // Sum of 80C, 80D, 80E, 80G, 80TTA/TTB, 24b

  // Tax Computation
  taxableIncome: number; // GTI - deductions
  slabTax: number; // Tax calculated from slabs
  rebate: number; // Section 87A rebate
  marginalRelief: number; // Marginal relief at threshold
  taxAfterRebate: number; // Tax after applying rebate & marginal relief

  // Additions
  surcharge: number; // Surcharge on high income
  cess: number; // 4% Health & Education Cess

  // Final Result
  totalTax: number; // Total tax payable
  effectiveRate: number; // Effective tax rate (%)
  marginalRate: number; // Marginal tax rate at last slab (%)

  // Breakdown & Trace
  breakdown: TaxBreakdownItem[];
  trace: TaxCalculationTrace[];
}
// Tax Saving Opportunity
export interface TaxSavingRecommendation {
  section: string; // e.g., "80C", "NPS 80CCD1B"
  description: string; // e.g., "Invest in PPF"
  currentAmount: number; // Amount already invested
  maxAmount: number; // Maximum allowed
  gap: number; // Remaining capacity
  potentialSavingPerLakh: number; // Estimated saving per ₹1 lakh (at marginal rate)
  potentialSaving: number; // Estimated total saving if gap is filled
  priority: number; // 1 = highest priority, 3 = lowest
}

// Comprehensive Tax Calculation Result
export interface ComprehensiveTaxResult {
  // Both regimes calculated
  oldRegime: RegimeResult;
  newRegime: RegimeResult;

  // Recommendation
  recommended: 'old' | 'new';
  savings: number; // Amount saved by choosing recommended regime
  explanation: string; // Why this regime is better

  // Suggestions for tax savings
  recommendations: TaxSavingRecommendation[];

  // Metadata
  fy: string; // Financial Year (e.g., "2025-26")
  ay: string; // Assessment Year (e.g., "2026-27")
  timestamp: Date;
}
