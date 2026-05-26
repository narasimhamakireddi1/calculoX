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
