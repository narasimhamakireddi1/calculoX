/**
 * Income Tax Calculator Logic (India FY 2025-26)
 * Accurate calculation based on official government tax rates, surcharge, and rebates
 * Sources: incometax.gov.in, CBDT, ClearTax
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
  rebate: number;
  surcharge: number;
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

// Standard deduction varies by regime (FY 2024-25)
const STANDARD_DEDUCTION_NEW = 75000; // New regime: ₹75,000
const STANDARD_DEDUCTION_OLD = 50000; // Old regime: ₹50,000

function calculateNewRegimeTax(taxableIncome: number): { tax: number; breakdowns: TaxBreakdown[] } {
  const breakdowns: TaxBreakdown[] = [];
  let tax = 0;

  const slabs = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400000, max: 800000, rate: 5 },
    { min: 800000, max: 1200000, rate: 10 },
    { min: 1200000, max: 1600000, rate: 15 },
    { min: 1600000, max: 2000000, rate: 20 },
    { min: 2000000, max: 2400000, rate: 25 },
    { min: 2400000, max: Infinity, rate: 30 },
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

// Calculate Section 87A Rebate (FY 2025-26)
function calculateRebate(taxAmount: number, taxableIncome: number, regime: 'old' | 'new'): number {
  if (regime === 'new') {
    // New regime: ₹60,000 rebate for taxable income ≤ ₹12,00,000 (makes income up to ₹12L tax-free)
    if (taxableIncome <= 1200000) {
      return Math.min(60000, taxAmount);
    }
  } else {
    // Old regime: ₹12,500 rebate for taxable income ≤ ₹5,00,000 (makes income up to ₹5L tax-free)
    if (taxableIncome <= 500000) {
      return Math.min(12500, taxAmount);
    }
  }
  return 0;
}

// Calculate Surcharge (FY 2025-26)
function calculateSurcharge(taxAmount: number, grossIncome: number): number {
  if (grossIncome <= 5000000) {
    return 0; // No surcharge up to ₹50 lakh
  } else if (grossIncome <= 10000000) {
    // 10% surcharge for ₹50L - ₹1Cr
    return (taxAmount * 10) / 100;
  } else {
    // 15% surcharge for above ₹1Cr
    return (taxAmount * 15) / 100;
  }
}

// Calculate Health & Education Cess (4% on tax + surcharge)
function calculateCess(taxAmount: number, surchargeAmount: number): number {
  return ((taxAmount + surchargeAmount) * 4) / 100;
}

export function calculateTax(input: TaxInput): TaxResult {
  const { income, regime, age } = input;

  // Determine standard deduction based on regime
  const standardDeduction = income > 0 ? (regime === 'new' ? STANDARD_DEDUCTION_NEW : STANDARD_DEDUCTION_OLD) : 0;
  const taxableIncome = Math.max(0, income - standardDeduction);

  // Calculate income tax based on slabs
  let taxAmount = 0;
  if (regime === 'new') {
    taxAmount = calculateNewRegimeTax(taxableIncome).tax;
  } else {
    taxAmount = calculateOldRegimeTax(taxableIncome, age).tax;
  }

  // Apply Section 87A Rebate
  const rebate = calculateRebate(taxAmount, taxableIncome, regime);
  const taxAfterRebate = Math.max(0, taxAmount - rebate);

  // Calculate Surcharge (on tax after rebate)
  const surcharge = calculateSurcharge(taxAfterRebate, income);

  // Calculate Health & Education Cess (4% on tax + surcharge)
  const cess = calculateCess(taxAfterRebate, surcharge);

  // Total tax liability
  const totalTax = taxAfterRebate + surcharge + cess;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    grossIncome: income,
    standardDeduction,
    taxableIncome,
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    rebate: parseFloat(rebate.toFixed(2)),
    surcharge: parseFloat(surcharge.toFixed(2)),
    cess: parseFloat(cess.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    effectiveRate: parseFloat(effectiveRate.toFixed(2)),
    regime: regime === 'new' ? 'New Tax Regime' : 'Old Tax Regime',
  };
}

export function getTaxBreakdown(input: TaxInput): TaxBreakdown[] {
  const { income, regime, age } = input;
  const standardDeduction = regime === 'new' ? STANDARD_DEDUCTION_NEW : STANDARD_DEDUCTION_OLD;
  const taxableIncome = Math.max(0, income - standardDeduction);

  if (regime === 'new') {
    return calculateNewRegimeTax(taxableIncome).breakdowns;
  } else {
    return calculateOldRegimeTax(taxableIncome, age).breakdowns;
  }
}
