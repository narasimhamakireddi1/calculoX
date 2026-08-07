import { z } from 'zod';
import { ComprehensiveTaxSchema } from '@/lib/validators';
import { ComprehensiveTaxInput } from '@/lib/tax-engine/types';

type TaxFormData = z.infer<typeof ComprehensiveTaxSchema>;

// Single source of truth for mapping the flat ComprehensiveTaxSchema shape into the
// nested {profile, salary, deductions, regime} shape calculateComprehensiveTax expects.
// Shared by the /tax-calculator page and the MCP calculate_income_tax tool so the two
// can never silently diverge on this mapping.
export function buildTaxInput(data: TaxFormData): ComprehensiveTaxInput {
  return {
    profile: {
      age: data.age,
      residentialStatus: data.residentialStatus,
      employerType: data.employerType,
    },
    salary: {
      grossSalary: data.grossSalary,
      basicSalary: data.basicSalary,
      hraReceived: data.hraReceived,
      rentPaid: data.rentPaid,
      cityType: data.cityType,
      lta: data.lta,
      epfEmployee: data.epfEmployee,
      incomeHouseProperty: data.incomeHouseProperty,
      incomeOtherSources: data.incomeOtherSources,
      npsEmployerContribution: data.npsEmployerContribution,
    },
    deductions: {
      epf: data.epf,
      ppf: data.ppf,
      elss: data.elss,
      lifeInsurance: data.lifeInsurance,
      homeRepayment: data.homeRepayment,
      ssy: data.ssy,
      nsc: data.nsc,
      taxSaverFD: data.taxSaverFD,
      tuitionFees: data.tuitionFees,
      npsAdditional: data.npsAdditional,
      healthInsuranceSelf: data.healthInsuranceSelf,
      healthInsuranceParents: data.healthInsuranceParents,
      parentsAge: data.parentsAge,
      educationLoanInterest: data.educationLoanInterest,
      donations100: data.donations100,
      donations50: data.donations50,
      savingsInterest: data.savingsInterest,
      homeLoanInterest: data.homeLoanInterest,
    },
    regime: data.regime,
  };
}
