/**
 * FY 2025-26 Tax Rules (AY 2026-27)
 * Immutable, versioned tax rules for deterministic computation
 * Source: CBDT, ClearTax, Income Tax India
 */

export interface TaxSlab {
  min: number;
  max: number | null; // null means infinity
  rate: number; // percentage
}

export interface SurchargeRule {
  minIncome: number;
  maxIncome: number | null;
  rate: number;
  maxSurchargeInNewRegime?: number; // New regime has capped surcharge
}

export interface TaxRulesForFY {
  fy: string; // "2025-26"
  ay: string; // "2026-27"

  // NEW REGIME (default option)
  newRegime: {
    name: 'New Tax Regime';
    standardDeduction: number; // ₹75,000
    slabs: TaxSlab[]; // 7 slabs: 0%, 5%, 10%, 15%, 20%, 25%, 30%
    rebate87A: {
      maxTaxableIncome: number; // ₹12,00,000
      maxRebate: number; // ₹60,000
      marginalReliefEnabled: boolean; // True - applies for income just above threshold
    };
    allowedDeductions: string[]; // Only standard deduction (no 80C etc.)
    surchargeCapRate: number; // 25% (capped)
  };

  // OLD REGIME (legacy option, allows deductions)
  oldRegime: {
    name: 'Old Tax Regime';
    standardDeduction: number; // ₹50,000
    // Age-based slabs
    slabs: {
      below60: TaxSlab[];
      between60to80: TaxSlab[];
      above80: TaxSlab[];
    };
    rebate87A: {
      maxTaxableIncome: number; // ₹5,00,000
      maxRebate: number; // ₹12,500
      marginalReliefEnabled: boolean; // True
    };
    allowedDeductions: string[]; // 80C, 80D, 80E, 80G, etc.
    surchargeCapRate: number; // 37% (no cap in old regime)
  };

  // SURCHARGE TIERS (same for both regimes unless noted)
  surcharge: {
    tiers: SurchargeRule[];
    marginalReliefEnabled: boolean;
  };

  // CESS
  healthEducationCess: number; // 4% on (tax + surcharge)

  // DEDUCTION CAPS (OLD REGIME ONLY)
  deductionCaps: {
    section80C: number; // ₹1,50,000
    section80CCD1B: number; // ₹50,000 (NPS extra)
    section80D: {
      selfFamilyBelow60: number; // ₹25,000
      selfFamilyAbove60: number; // ₹50,000
      parentsBelow60: number; // ₹25,000
      parentsAbove60: number; // ₹50,000
    };
    section80E: number | null; // null = no cap
    section80G: {
      maxDeduction: number | null; // no cap, but subject to income limit
      eighty100Percent: boolean;
      eighty50Percent: boolean;
    };
    section80TTA: number; // ₹10,000 (below 60)
    section80TTB: number; // ₹50,000 (60+)
    section24b: number; // ₹2,00,000 (home loan interest, self-occupied)
  };

  // HRA EXEMPTION RULES
  hraExemption: {
    metroPercent: number; // 50% of basic
    nonMetroPercent: number; // 40% of basic
    rentThreshold: number; // 10% of basic (if rent < this, exemption = 0)
    metroList: string[]; // Cities where 50% applies
  };

  // LTA EXEMPTION RULES
  ltaExemption: {
    onceInFourYears: boolean;
    maxPerYear: number | null; // null = no limit, capped by actual amount
  };
}

// IMMUTABLE FY 2025-26 RULES
export const TAX_RULES_FY_2025_26: TaxRulesForFY = {
  fy: '2025-26',
  ay: '2026-27',

  newRegime: {
    name: 'New Tax Regime',
    standardDeduction: 75000,
    slabs: [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 5 },
      { min: 800000, max: 1200000, rate: 10 },
      { min: 1200000, max: 1600000, rate: 15 },
      { min: 1600000, max: 2000000, rate: 20 },
      { min: 2000000, max: 2400000, rate: 25 },
      { min: 2400000, max: null, rate: 30 },
    ],
    rebate87A: {
      maxTaxableIncome: 1200000, // ₹12 Lakh exactly
      maxRebate: 60000, // ₹60,000
      marginalReliefEnabled: true,
    },
    allowedDeductions: ['standard-deduction'],
    surchargeCapRate: 25,
  },

  oldRegime: {
    name: 'Old Tax Regime',
    standardDeduction: 50000,
    slabs: {
      below60: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
      between60to80: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
      above80: [
        { min: 0, max: 500000, rate: 0 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
    },
    rebate87A: {
      maxTaxableIncome: 500000, // ₹5 Lakh
      maxRebate: 12500, // ₹12,500
      marginalReliefEnabled: true,
    },
    allowedDeductions: ['80c', '80ccd1b', '80d', '80e', '80g', '80tta', '80ttb', '24b'],
    surchargeCapRate: 37,
  },

  surcharge: {
    tiers: [
      { minIncome: 0, maxIncome: 5000000, rate: 0 }, // 0% up to ₹50 Lakh
      { minIncome: 5000000, maxIncome: 10000000, rate: 10 }, // 10% for ₹50L - ₹1Cr
      { minIncome: 10000000, maxIncome: 20000000, rate: 15 }, // 15% for ₹1Cr - ₹2Cr
      { minIncome: 20000000, maxIncome: 50000000, rate: 25 }, // 25% for ₹2Cr - ₹5Cr
      { minIncome: 50000000, maxIncome: null, rate: 37 }, // 37% above ₹5Cr
    ],
    marginalReliefEnabled: true,
  },

  healthEducationCess: 4, // 4% on (tax + surcharge)

  deductionCaps: {
    section80C: 150000, // ₹1.5 Lakh total
    section80CCD1B: 50000, // ₹50,000 additional NPS
    section80D: {
      selfFamilyBelow60: 25000,
      selfFamilyAbove60: 50000,
      parentsBelow60: 25000,
      parentsAbove60: 50000,
    },
    section80E: null, // No cap on education loan interest
    section80G: {
      maxDeduction: null, // No strict cap
      eighty100Percent: true,
      eighty50Percent: true,
    },
    section80TTA: 10000, // ₹10K for below 60
    section80TTB: 50000, // ₹50K for 60+
    section24b: 200000, // ₹2 Lakh home loan interest
  },

  hraExemption: {
    metroPercent: 50,
    nonMetroPercent: 40,
    rentThreshold: 10, // If rent < 10% of basic, HRA = 0
    metroList: ['mumbai', 'delhi', 'kolkata', 'chennai'], // Metro cities
  },

  ltaExemption: {
    onceInFourYears: true,
    maxPerYear: null, // Limited to actual amount
  },
};

// Helper function to get rules for a given FY
export function getTaxRulesForFY(fy: string = '2025-26'): TaxRulesForFY {
  // Currently only FY 2025-26 available
  // In future, this can support multiple FYs with versioning
  if (fy === '2025-26') {
    return TAX_RULES_FY_2025_26;
  }
  // Fallback to latest rules
  return TAX_RULES_FY_2025_26;
}
