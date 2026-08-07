/**
 * @jest-environment node
 */
import {
  handleCalculateEmi,
  handleCalculateSip,
  handleCalculateBmi,
  handleCalculateIncomeTax,
} from './handlers';
import { calculateEMI } from '@/lib/calculators/emi';
import { calculateSIP } from '@/lib/calculators/sip';
import { calculateBMI } from '@/lib/calculators/bmi';
import { calculateComprehensiveTax } from '@/lib/tax-engine/calculator';
import { buildTaxInput } from '@/lib/tax-engine/buildTaxInput';

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
