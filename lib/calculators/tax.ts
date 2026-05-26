/**
 * Income Tax Calculator Logic (India FY 2024-25)
 * Calculate income tax based on Indian tax slabs
 */

export interface TaxInput {
  income: number;
  regime: 'old' | 'new';
  age: 'below60' | 'between60to80' | 'above80';
}

export interface TaxResult {
  grossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  taxAmount: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  regime: string;
}

export interface TaxBreakdown {
  slab: string;
  rate: number;
  amount: number;
  tax: number;
}

const STANDARD_DEDUCTION = 50000;

function calculateNewRegimeTax(taxableIncome: number): { tax: number; breakdowns: TaxBreakdown[] } {
  const breakdowns: TaxBreakdown[] = [];
  let tax = 0;

  // New Tax Regime Slabs (FY 2024-25)
  const slabs = [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 600000, rate: 5 },
    { min: 600000, max: 900000, rate: 10 },
    { min: 900000, max: 1200000, rate: 15 },
    { min: 1200000, max: 1500000, rate: 20 },
    { min: 1500000, max: Infinity, rate: 30 },
  ];

  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const slabAmount = Math.min(taxableIncome, slab.max) - slab.min;
      const slabTax = (slabAmount * slab.rate) / 100;
      tax += slabTax;

      if (slabTax > 0) {
        breakdowns.push({
          slab: `₹${(slab.min / 100000).toFixed(1)}L - ₹${slab.max === Infinity ? 'Above' : (slab.max / 100000).toFixed(1) + 'L'}`,
          rate: slab.rate,
          amount: slabAmount,
          tax: slabTax,
        });
      }
    }
  }

  return { tax, breakdowns };
}

function calculateOldRegimeTax(
  taxableIncome: number,
  age: 'below60' | 'between60to80' | 'above80'
): { tax: number; breakdowns: TaxBreakdown[] } {
  const breakdowns: TaxBreakdown[] = [];
  let tax = 0;

  let slabs;

  if (age === 'below60') {
    slabs = [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 },
    ];
  } else if (age === 'between60to80') {
    slabs = [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 },
    ];
  } else {
    // above80
    slabs = [
      { min: 0, max: 500000, rate: 0 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 },
    ];
  }

  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const slabAmount = Math.min(taxableIncome, slab.max) - slab.min;
      const slabTax = (slabAmount * slab.rate) / 100;
      tax += slabTax;

      if (slabTax > 0) {
        breakdowns.push({
          slab: `₹${(slab.min / 100000).toFixed(1)}L - ₹${slab.max === Infinity ? 'Above' : (slab.max / 100000).toFixed(1) + 'L'}`,
          rate: slab.rate,
          amount: slabAmount,
          tax: slabTax,
        });
      }
    }
  }

  return { tax, breakdowns };
}

export function calculateTax(input: TaxInput): TaxResult {
  const { income, regime, age } = input;

  const standardDeduction = income > 0 ? STANDARD_DEDUCTION : 0;
  const taxableIncome = Math.max(0, income - standardDeduction);

  let taxAmount = 0;
  if (regime === 'new') {
    const result = calculateNewRegimeTax(taxableIncome);
    taxAmount = result.tax;
  } else {
    const result = calculateOldRegimeTax(taxableIncome, age);
    taxAmount = result.tax;
  }

  // Health and Education Cess: 4% on income tax
  const cess = (taxAmount * 4) / 100;
  const totalTax = taxAmount + cess;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    grossIncome: income,
    standardDeduction,
    taxableIncome,
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    cess: parseFloat(cess.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    effectiveRate: parseFloat(effectiveRate.toFixed(2)),
    regime: regime === 'new' ? 'New Tax Regime' : 'Old Tax Regime',
  };
}

export function getTaxBreakdown(input: TaxInput): TaxBreakdown[] {
  const { income, regime, age } = input;
  const taxableIncome = Math.max(0, income - STANDARD_DEDUCTION);

  if (regime === 'new') {
    return calculateNewRegimeTax(taxableIncome).breakdowns;
  } else {
    return calculateOldRegimeTax(taxableIncome, age).breakdowns;
  }
}
