/**
 * @jest-environment node
 */
import {
  handleCalculateEmi,
  handleCalculateSip,
  handleCalculateBmi,
  handleCalculateIncomeTax,
  handleCalculateFd,
  handleCalculateRd,
  handleCalculateGst,
  handleCalculateCagr,
  handleCalculateSimpleInterest,
  handleCalculatePercentage,
  handleCalculateProfitMargin,
  handleCalculateRetirement,
  handleCalculateHomeLoanVsRent,
  handleCalculateExpression,
} from './handlers';
import { calculateEMI } from '@/lib/calculators/emi';
import { calculateSIP } from '@/lib/calculators/sip';
import { calculateBMI } from '@/lib/calculators/bmi';
import { calculateComprehensiveTax } from '@/lib/tax-engine/calculator';
import { buildTaxInput } from '@/lib/tax-engine/buildTaxInput';
import { calculateFD } from '@/lib/calculators/fd';
import { calculateRD } from '@/lib/calculators/rd';
import { calculateGST } from '@/lib/calculators/gst';
import { calculateCAGR } from '@/lib/calculators/cagr';
import { calculateSimpleInterest } from '@/lib/calculators/simple-interest';
import { calculatePercentage } from '@/lib/calculators/percentage';
import { ProfitMarginGstEngine } from '@/lib/calculators/profit-margin';
import { NismRetirementEngine } from '@/lib/calculators/nism-retirement';
import { BuyVsRentEngine } from '@/lib/calculators/buy-vs-rent';

describe('handleCalculateEmi', () => {
  it('returns the same result as calling calculateEMI directly for valid input', () => {
    const input = { principal: 2500000, annualRate: 8.5, years: 20 };
    const result = handleCalculateEmi(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateEMI(input));
    expect(result.content[0].text).toContain('"emi"');
  });

  it('returns isError with a readable message for invalid input', () => {
    const result = handleCalculateEmi({ principal: -100, annualRate: 8.5, years: 20 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toMatch(/principal/i);
  });

  it('rejects a loan principal above the ₹1.5 crore cap', () => {
    const result = handleCalculateEmi({ principal: 20000000, annualRate: 8.5, years: 20 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toMatch(/1\.5 Crore/i);
  });
});

describe('handleCalculateSip', () => {
  it('returns the same result as calling calculateSIP directly for valid input', () => {
    const input = { monthlyInvestment: 10000, years: 15, annualReturn: 12, stepUpPercent: 0 };
    const result = handleCalculateSip(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateSIP(input));
  });

  it('returns isError for a non-numeric field', () => {
    const result = handleCalculateSip({ monthlyInvestment: 'a lot', years: 15, annualReturn: 12 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateBmi', () => {
  it('returns the same result as calling calculateBMI directly for valid input', () => {
    const input = { weight: 70, height: 175 };
    const result = handleCalculateBmi(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateBMI(input));
  });

  it('returns isError for a zero height', () => {
    const result = handleCalculateBmi({ weight: 70, height: 0 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toMatch(/height/i);
  });
});

describe('handleCalculateIncomeTax', () => {
  const validInput = {
    age: 'below60' as const,
    residentialStatus: 'resident' as const,
    employerType: 'private' as const,
    grossSalary: 1200000,
    basicSalary: 600000,
    hraReceived: 200000,
    rentPaid: 180000,
    cityType: 'metro' as const,
    lta: 20000,
    epfEmployee: 72000,
    incomeHouseProperty: 0,
    incomeOtherSources: 0,
    npsEmployerContribution: 0,
    epf: 72000,
    ppf: 0,
    elss: 0,
    lifeInsurance: 0,
    homeRepayment: 0,
    ssy: 0,
    nsc: 0,
    taxSaverFD: 0,
    tuitionFees: 0,
    npsAdditional: 0,
    healthInsuranceSelf: 15000,
    healthInsuranceParents: 0,
    parentsAge: 'below60' as const,
    educationLoanInterest: 0,
    donations100: 0,
    donations50: 0,
    savingsInterest: 0,
    homeLoanInterest: 0,
    regime: 'auto' as const,
  };

  // Both calculateComprehensiveTax() calls stamp a live `timestamp: new Date()` —
  // strip it before comparing so two independent calls a moment apart still match.
  function withoutTimestamp(result: ReturnType<typeof calculateComprehensiveTax>) {
    const clone: Partial<ReturnType<typeof calculateComprehensiveTax>> = { ...result };
    delete clone.timestamp;
    return clone;
  }

  it('returns the same result as calling calculateComprehensiveTax directly for valid input', () => {
    const result = handleCalculateIncomeTax(validInput);
    expect(result.isError).toBeUndefined();
    expect(withoutTimestamp(result.structuredContent as ReturnType<typeof calculateComprehensiveTax>)).toEqual(
      withoutTimestamp(calculateComprehensiveTax(buildTaxInput(validInput)))
    );
  });

  it('returns isError for a missing required field', () => {
    const incomplete: Partial<typeof validInput> = { ...validInput };
    delete incomplete.grossSalary;
    const result = handleCalculateIncomeTax(incomplete);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toMatch(/grossSalary/i);
  });
});

describe('buildTaxInput', () => {
  it('maps the flat schema shape into the nested engine input shape', () => {
    const mapped = buildTaxInput({
      age: 'below60',
      residentialStatus: 'resident',
      employerType: 'private',
      grossSalary: 1200000,
      basicSalary: 600000,
      hraReceived: 200000,
      rentPaid: 180000,
      cityType: 'metro',
      lta: 20000,
      epfEmployee: 72000,
      incomeHouseProperty: 0,
      incomeOtherSources: 0,
      npsEmployerContribution: 0,
      epf: 72000,
      ppf: 0,
      elss: 0,
      lifeInsurance: 0,
      homeRepayment: 0,
      ssy: 0,
      nsc: 0,
      taxSaverFD: 0,
      tuitionFees: 0,
      npsAdditional: 0,
      healthInsuranceSelf: 15000,
      healthInsuranceParents: 0,
      parentsAge: 'below60',
      educationLoanInterest: 0,
      donations100: 0,
      donations50: 0,
      savingsInterest: 0,
      homeLoanInterest: 0,
      regime: 'auto',
    });

    expect(mapped).toEqual({
      profile: { age: 'below60', residentialStatus: 'resident', employerType: 'private' },
      salary: {
        grossSalary: 1200000,
        basicSalary: 600000,
        hraReceived: 200000,
        rentPaid: 180000,
        cityType: 'metro',
        lta: 20000,
        epfEmployee: 72000,
        incomeHouseProperty: 0,
        incomeOtherSources: 0,
        npsEmployerContribution: 0,
      },
      deductions: {
        epf: 72000,
        ppf: 0,
        elss: 0,
        lifeInsurance: 0,
        homeRepayment: 0,
        ssy: 0,
        nsc: 0,
        taxSaverFD: 0,
        tuitionFees: 0,
        npsAdditional: 0,
        healthInsuranceSelf: 15000,
        healthInsuranceParents: 0,
        parentsAge: 'below60',
        educationLoanInterest: 0,
        donations100: 0,
        donations50: 0,
        savingsInterest: 0,
        homeLoanInterest: 0,
      },
      regime: 'auto',
    });
  });
});

describe('handleCalculateFd', () => {
  it('returns the same result as calling calculateFD directly for valid input', () => {
    const input = { principal: 100000, annualRate: 7, years: 5 };
    const result = handleCalculateFd(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateFD(input));
  });

  it('returns isError for a negative principal', () => {
    const result = handleCalculateFd({ principal: -100, annualRate: 7, years: 5 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateRd', () => {
  it('returns the same result as calling calculateRD directly for valid input', () => {
    const input = { monthlyDeposit: 5000, annualRate: 6.5, months: 24 };
    const result = handleCalculateRd(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateRD(input));
  });

  it('returns isError for zero months', () => {
    const result = handleCalculateRd({ monthlyDeposit: 5000, annualRate: 6.5, months: 0 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateGst', () => {
  it('returns the same result as calling calculateGST directly for valid input', () => {
    const input = { amount: 1000, gstRate: '18' as const, calculationType: 'add' as const };
    const result = handleCalculateGst(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateGST({ ...input, gstRate: 18 }));
  });

  it('returns isError for an invalid gstRate', () => {
    const result = handleCalculateGst({ amount: 1000, gstRate: '15', calculationType: 'add' });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateCagr', () => {
  it('returns the same result as calling calculateCAGR directly for valid input', () => {
    const input = { beginningValue: 100000, endingValue: 200000, years: 5 };
    const result = handleCalculateCagr(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateCAGR(input));
  });

  it('returns isError for a negative beginning value', () => {
    const result = handleCalculateCagr({ beginningValue: -100, endingValue: 200000, years: 5 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateSimpleInterest', () => {
  it('returns the same result as calling calculateSimpleInterest directly for valid input', () => {
    const input = { principal: 100000, annualRate: 8, tenureValue: 3, tenureType: 'years' as const };
    const result = handleCalculateSimpleInterest(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculateSimpleInterest(input));
  });

  it('returns isError for a missing tenureType', () => {
    const result = handleCalculateSimpleInterest({ principal: 100000, annualRate: 8, tenureValue: 3 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculatePercentage', () => {
  it('returns the same result as calling calculatePercentage directly for valid input', () => {
    const input = { valueA: 25, valueB: 200, calculationType: 'percent-of' as const };
    const result = handleCalculatePercentage(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(calculatePercentage(input));
  });

  it('returns isError for a missing calculationType', () => {
    const result = handleCalculatePercentage({ valueA: 25, valueB: 200 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateProfitMargin', () => {
  it('returns the same result as calling ProfitMarginGstEngine.calculatePricing directly for valid input', () => {
    const input = {
      costPrice: 1000,
      sellingPrice: 0,
      targetMarginPct: 20,
      targetMarkupPct: 0,
      gstRatePct: 18,
      calculationBasis: 'COST_DRIVEN' as const,
      gstTreatment: 'EXCLUSIVE' as const,
      marginOrMarkup: 'margin' as const,
    };
    const result = handleCalculateProfitMargin(input);
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual(
      ProfitMarginGstEngine.calculatePricing(
        { costPrice: input.costPrice, sellingPrice: input.sellingPrice, targetMarginPct: input.targetMarginPct, targetMarkupPct: input.targetMarkupPct, gstRatePct: input.gstRatePct },
        { calculationBasis: input.calculationBasis, gstTreatment: input.gstTreatment, marginOrMarkup: input.marginOrMarkup }
      )
    );
  });

  it('returns isError for a negative cost price', () => {
    const result = handleCalculateProfitMargin({ costPrice: -100, gstRatePct: 18 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateRetirement', () => {
  const validInput = {
    present_age: 30,
    retirement_age: 60,
    life_expectancy: 85,
    present_monthly_expenses: 50000,
    expense_reduction_pct: 20,
    long_term_inflation_pct: 6,
    current_savings: 200000,
    lump_sum_benefits: 0,
    pre_retirement_return_pct: 11,
    post_retirement_return_pct: 7,
  };

  it('returns the same result as calling NismRetirementEngine.calculate directly for valid input', () => {
    const result = handleCalculateRetirement(validInput);
    expect(result.isError).toBeUndefined();
    const expected = NismRetirementEngine.calculate({
      demographics: { present_age: 30, retirement_age: 60, life_expectancy: 85 },
      financials: {
        present_monthly_expenses: 50000,
        expense_reduction_pct: 20,
        long_term_inflation_pct: 6,
        current_savings: 200000,
        lump_sum_benefits: 0,
      },
      investment_returns: { pre_retirement_return_pct: 11, post_retirement_return_pct: 7 },
    });
    expect(result.structuredContent).toEqual(expected);
  });

  it('returns isError when retirement_age is not greater than present_age (cross-field check)', () => {
    const result = handleCalculateRetirement({ ...validInput, retirement_age: 25 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateHomeLoanVsRent', () => {
  const validInput = {
    property_value: 8000000,
    down_payment_pct: 20,
    loan_interest_rate_pct: 8.5,
    loan_tenure_years: 20,
    property_growth_rate_pct: 6,
    annual_maintenance_pct: 0.5,
    initial_monthly_rent: 25000,
    annual_rent_increase_pct: 7,
    opportunity_return_pct: 12,
    inflation_rate_pct: 6,
    projection_tenure_years: 20,
    apply_tax_benefit: false,
    income_tax_rate_pct: 20,
  };

  it('returns the same summary fields as BuyVsRentEngine.calculate (minus yearly_data)', () => {
    const result = handleCalculateHomeLoanVsRent(validInput);
    expect(result.isError).toBeUndefined();
    const expectedFull: Partial<ReturnType<typeof BuyVsRentEngine.calculate>> = {
      ...BuyVsRentEngine.calculate({
        property_buying_track: {
          property_value: 8000000,
          down_payment_pct: 20,
          loan_interest_rate_pct: 8.5,
          loan_tenure_years: 20,
          property_growth_rate_pct: 6,
          annual_maintenance_pct: 0.5,
        },
        renting_track: { initial_monthly_rent: 25000, annual_rent_increase_pct: 7 },
        investment_track: { opportunity_return_pct: 12, inflation_rate_pct: 6 },
        common: { projection_tenure_years: 20, apply_tax_benefit: false, income_tax_rate_pct: 20 },
      }),
    };
    delete expectedFull.yearly_data;
    expect(result.structuredContent).toEqual(expectedFull);
    expect(result.structuredContent).not.toHaveProperty('yearly_data');
  });

  it('returns isError for a property value below the minimum', () => {
    const result = handleCalculateHomeLoanVsRent({ ...validInput, property_value: 1000 });
    expect(result.isError).toBe(true);
  });
});

describe('handleCalculateExpression', () => {
  it('evaluates a standard arithmetic expression', () => {
    const result = handleCalculateExpression({ expression: '2+2*3' });
    expect(result.isError).toBeUndefined();
    expect((result.structuredContent as { value: number }).value).toBe(8);
  });

  it('evaluates a trig function in degrees', () => {
    const result = handleCalculateExpression({ expression: 'sin(30)', angleUnit: 'DEG' });
    expect(result.isError).toBeUndefined();
    expect((result.structuredContent as { value: number }).value).toBeCloseTo(0.5, 5);
  });

  it('returns isError for an empty expression', () => {
    const result = handleCalculateExpression({ expression: '' });
    expect(result.isError).toBe(true);
  });
});
