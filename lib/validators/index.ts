/**
 * Input Validation Schemas
 * Using Zod for type-safe validation
 */

import { z } from 'zod';

export const SIPSchema = z.object({
  monthlyInvestment: z.number().positive('Must be greater than 0').max(100000000),
  years: z.number().int().min(1).max(50),
  annualReturn: z.number().min(0).max(100),
  stepUpPercent: z.number().min(0).max(50).optional().default(0),
});

export const EMISchema = z.object({
  principal: z.number().positive('Must be greater than 0'),
  annualRate: z.number().min(0).max(50),
  years: z.number().int().min(1).max(50),
});

export const BMISchema = z.object({
  weight: z.number().positive().max(500),
  height: z.number().positive().max(300),
});

export const TaxSchema = z.object({
  income: z.number().nonnegative(),
  regime: z.enum(['old', 'new']),
  age: z.enum(['below60', 'between60to80', 'above80']),
});

export const FDSchema = z.object({
  principal: z.number().positive('Principal must be greater than 0').max(100000000),
  annualRate: z.number().min(0).max(20),
  years: z.number().int().min(1).max(30),
});

export const RDSchema = z.object({
  monthlyDeposit: z.number().positive('Monthly deposit must be greater than 0').max(10000000),
  annualRate: z.number().min(0).max(20),
  months: z.number().int().min(1).max(600),
});

export const SimpleInterestSchema = z.object({
  principal: z.number().positive('Principal must be greater than 0').max(100000000),
  annualRate: z.number().min(0).max(50),
  years: z.number().int().min(1).max(50),
});

export const GSTSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').max(100000000),
  gstRate: z.enum(['5', '12', '18', '28']).transform(Number),
  calculationType: z.enum(['add', 'remove']),
});

export const PercentageSchema = z.object({
  valueA: z.number().nonnegative(),
  valueB: z.number().positive('Value must be greater than 0'),
  calculationType: z.enum(['percent-of', 'percent-change', 'what-percent']),
});

export const CAGRSchema = z.object({
  beginningValue: z.number().positive('Beginning value must be greater than 0'),
  endingValue: z.number().positive('Ending value must be greater than 0'),
  years: z.number().int().min(1).max(100),
});

// Comprehensive Tax Calculator Schema (FY 2025-26)
export const ComprehensiveTaxSchema = z.object({
  // Personal Profile
  age: z.enum(['below60', 'between60to80', 'above80']),
  residentialStatus: z.enum(['resident', 'nri']),
  employerType: z.enum(['government', 'private']),

  // Salary Income
  grossSalary: z.number().nonnegative('Gross salary must be non-negative'),
  basicSalary: z.number().nonnegative('Basic salary must be non-negative'),
  hraReceived: z.number().nonnegative('HRA must be non-negative'),
  rentPaid: z.number().nonnegative('Rent paid must be non-negative'),
  cityType: z.enum(['metro', 'non-metro']),
  lta: z.number().nonnegative('LTA must be non-negative'),
  epfEmployee: z.number().nonnegative('EPF must be non-negative'),

  // Deductions - Section 80C (max ₹1.5L)
  epf: z.number().nonnegative(),
  ppf: z.number().nonnegative(),
  elss: z.number().nonnegative(),
  lifeInsurance: z.number().nonnegative(),
  homeRepayment: z.number().nonnegative(),
  ssy: z.number().nonnegative(),
  nsc: z.number().nonnegative(),
  taxSaverFD: z.number().nonnegative(),
  tuitionFees: z.number().nonnegative(),

  // Deductions - 80CCD1B (max ₹50K)
  npsAdditional: z.number().nonnegative(),

  // Deductions - 80D (Health Insurance)
  healthInsuranceSelf: z.number().nonnegative(),
  healthInsuranceParents: z.number().nonnegative(),
  parentsAge: z.enum(['below60', 'above60']),

  // Deductions - 80E (Education Loan Interest)
  educationLoanInterest: z.number().nonnegative(),

  // Deductions - 80G (Donations)
  donations100: z.number().nonnegative(),
  donations50: z.number().nonnegative(),

  // Deductions - 80TTA/TTB (Savings Interest)
  savingsInterest: z.number().nonnegative(),

  // Deductions - 24(b) (Home Loan Interest, max ₹2L)
  homeLoanInterest: z.number().nonnegative(),

  // Tax Regime
  regime: z.enum(['old', 'new', 'auto']),
});
