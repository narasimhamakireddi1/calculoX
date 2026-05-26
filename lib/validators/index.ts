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
