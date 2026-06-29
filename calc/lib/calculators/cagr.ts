/**
 * CAGR Calculator Logic
 * Calculate Compound Annual Growth Rate (CAGR)
 *
 * Formula: CAGR = (Ending Value / Beginning Value)^(1/Years) - 1
 * Where:
 * - CAGR = Compound Annual Growth Rate (as decimal, multiply by 100 for %)
 * - Ending Value = Final investment value
 * - Beginning Value = Initial investment value
 * - Years = Number of years of investment
 */

import Decimal from 'decimal.js';

export interface CAGRInput {
  beginningValue: number;
  endingValue: number;
  years: number;
}

export interface CAGRResult {
  cagr: number;
  cagrPercentage: number;
}

export function calculateCAGR(input: CAGRInput): CAGRResult {
  const { beginningValue, endingValue, years } = input;

  // CAGR = (Ending Value / Beginning Value)^(1/years) - 1
  const ratio = new Decimal(endingValue).dividedBy(beginningValue);
  const exponent = new Decimal(1).dividedBy(years);
  const cagr = ratio.pow(exponent).minus(1);
  const cagrPercentage = cagr.times(100);

  return {
    cagr: parseFloat(cagr.toFixed(4)),
    cagrPercentage: parseFloat(cagrPercentage.toFixed(2)),
  };
}
