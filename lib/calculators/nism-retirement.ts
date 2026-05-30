/**
 * NISM Retirement Planning Engine
 * Implements precise 10-input data matrix with inflation-adjusted real rate of return
 * Follows the 4-step mathematical calculation logic for production-grade accuracy
 */

export interface NismInputs {
  demographics: {
    present_age: number;
    retirement_age: number;
    life_expectancy: number;
  };
  financials: {
    present_monthly_expenses: number;
    expense_reduction_pct: number;
    long_term_inflation_pct: number;
    current_savings: number;
    lump_sum_benefits: number;
  };
  investment_returns: {
    pre_retirement_return_pct: number;
    post_retirement_return_pct: number;
  };
}

export interface NismCalculationResult {
  monthly_expense_at_retirement: number;
  total_corpus_required: number;
  fv_of_current_savings: number;
  net_shortfall_to_build: number;
  monthly_sip_required: number;
  accumulationYears: number;
  distributionYears: number;
  totalWorkingMonths: number;
  totalRetirementMonths: number;
}

export interface ProjectionEntry {
  year: number;
  age: number;
  phase: 'accumulation' | 'distribution';
  corpus: number;
  annualSip?: number;
  annualWithdrawal?: number;
  inflationAdjustedExpense?: number;
}

export class NismRetirementEngine {
  /**
   * Main calculation engine following the 4-step NISM framework
   */
  static calculate(inputs: NismInputs): NismCalculationResult {
    const { present_age, retirement_age, life_expectancy } = inputs.demographics;
    const {
      present_monthly_expenses,
      expense_reduction_pct,
      long_term_inflation_pct,
      current_savings,
      lump_sum_benefits,
    } = inputs.financials;
    const { pre_retirement_return_pct, post_retirement_return_pct } = inputs.investment_returns;

    const accumulationYears = retirement_age - present_age;
    const distributionYears = life_expectancy - retirement_age;
    const totalWorkingMonths = accumulationYears * 12;
    const totalRetirementMonths = distributionYears * 12;

    const inflation = long_term_inflation_pct / 100;
    const preReturn = pre_retirement_return_pct / 100;
    const postReturn = post_retirement_return_pct / 100;

    // Step 1: Calculate Post-Retirement Initial Monthly Expense (E_ret)
    const adjustedBaseExpense = present_monthly_expenses * (1 - expense_reduction_pct / 100);
    const monthlyExpenseAtRetirement = adjustedBaseExpense * Math.pow(1 + inflation, accumulationYears);

    // Step 2: Compute Inflation-Adjusted Post-Retirement Return Rate (r_real)
    const realAnnualReturn = (1 + postReturn) / (1 + inflation) - 1;
    const realMonthlyReturn = realAnnualReturn / 12;

    // Step 3: Determine Total Required Corpus (C_target) - Annuity Due
    // Using the annuity due formula: PV = PMT × [(1 - (1+r)^-n) / r] × (1 + r)
    let totalCorpusRequired: number;
    if (Math.abs(realMonthlyReturn) < 1e-10) {
      // If real monthly return is effectively zero
      totalCorpusRequired = monthlyExpenseAtRetirement * totalRetirementMonths;
    } else {
      totalCorpusRequired =
        monthlyExpenseAtRetirement *
        ((1 - Math.pow(1 + realMonthlyReturn, -totalRetirementMonths)) / realMonthlyReturn) *
        (1 + realMonthlyReturn);
    }

    // Step 4: Net Out Current Savings & Calculate Monthly SIP
    const fvOfCurrentSavings = current_savings * Math.pow(1 + preReturn, accumulationYears);
    const shortfallCorpus = Math.max(0, totalCorpusRequired - fvOfCurrentSavings - lump_sum_benefits);

    // Calculate Monthly SIP Required
    let monthlySipRequired = 0;
    if (shortfallCorpus > 0) {
      const preMonthlyReturn = preReturn / 12;
      if (Math.abs(preMonthlyReturn) < 1e-10) {
        monthlySipRequired = shortfallCorpus / totalWorkingMonths;
      } else {
        monthlySipRequired =
          (shortfallCorpus * preMonthlyReturn) /
          (Math.pow(1 + preMonthlyReturn, totalWorkingMonths) - 1);
      }
    }

    return {
      monthly_expense_at_retirement: Math.round(monthlyExpenseAtRetirement),
      total_corpus_required: Math.round(totalCorpusRequired),
      fv_of_current_savings: Math.round(fvOfCurrentSavings),
      net_shortfall_to_build: Math.round(shortfallCorpus),
      monthly_sip_required: Math.round(monthlySipRequired),
      accumulationYears,
      distributionYears,
      totalWorkingMonths,
      totalRetirementMonths,
    };
  }

  /**
   * Generate year-by-year projection timeline
   */
  static generateProjection(inputs: NismInputs, result: NismCalculationResult): ProjectionEntry[] {
    const { present_age, retirement_age } = inputs.demographics;
    const { long_term_inflation_pct, present_monthly_expenses, expense_reduction_pct, current_savings } =
      inputs.financials;
    const { pre_retirement_return_pct, post_retirement_return_pct } = inputs.investment_returns;

    const projections: ProjectionEntry[] = [];
    const inflation = long_term_inflation_pct / 100;
    const preReturn = pre_retirement_return_pct / 100;
    const postReturn = post_retirement_return_pct / 100;
    const preMonthlyReturn = preReturn / 12;

    let corpus = current_savings;
    const adjustedBaseExpense = present_monthly_expenses * (1 - expense_reduction_pct / 100);

    // Accumulation phase (pre-retirement)
    for (let year = 0; year <= result.accumulationYears; year++) {
      const age = present_age + year;
      let yearCorpus = corpus;

      // Project forward to end of year
      if (year < result.accumulationYears) {
        // Add 12 months of SIP and growth
        for (let month = 0; month < 12; month++) {
          yearCorpus = yearCorpus * (1 + preMonthlyReturn) + result.monthly_sip_required;
        }
        corpus = yearCorpus;
      }

      if (year % 1 === 0) {
        // Add yearly entries
        projections.push({
          year,
          age,
          phase: 'accumulation',
          corpus: Math.round(yearCorpus),
          annualSip: Math.round(result.monthly_sip_required * 12),
        });
      }
    }

    // Distribution phase (retirement)
    corpus = result.total_corpus_required; // Start with required corpus
    const realAnnualReturn = (1 + postReturn) / (1 + inflation) - 1;
    const realMonthlyReturn = realAnnualReturn / 12;

    for (let year = 1; year <= result.distributionYears; year++) {
      const age = retirement_age + year;
      const yearsInRetirement = year;
      const inflationAdjustedExpense =
        adjustedBaseExpense * Math.pow(1 + inflation, result.accumulationYears + yearsInRetirement);

      let yearCorpus = corpus;
      const annualWithdrawal = Math.round(inflationAdjustedExpense * 12);

      // Project forward to end of year with withdrawals and growth
      for (let month = 0; month < 12; month++) {
        yearCorpus = yearCorpus * (1 + realMonthlyReturn) - inflationAdjustedExpense;
      }

      corpus = Math.max(0, yearCorpus);

      projections.push({
        year,
        age,
        phase: 'distribution',
        corpus: Math.round(corpus),
        annualWithdrawal,
        inflationAdjustedExpense: Math.round(inflationAdjustedExpense),
      });
    }

    return projections;
  }

  /**
   * Validation method to ensure inputs are within reasonable bounds
   */
  static validate(inputs: NismInputs): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (inputs.demographics.present_age < 18 || inputs.demographics.present_age > 75) {
      errors.push('Present age must be between 18 and 75 years');
    }

    if (inputs.demographics.retirement_age <= inputs.demographics.present_age) {
      errors.push('Retirement age must be greater than present age');
    }

    if (inputs.demographics.life_expectancy <= inputs.demographics.retirement_age) {
      errors.push('Life expectancy must be greater than retirement age');
    }

    if (inputs.financials.present_monthly_expenses < 5000) {
      errors.push('Monthly expenses must be at least ₹5,000');
    }

    if (inputs.financials.expense_reduction_pct < 0 || inputs.financials.expense_reduction_pct > 50) {
      errors.push('Expense reduction must be between 0% and 50%');
    }

    if (inputs.financials.long_term_inflation_pct < 0 || inputs.financials.long_term_inflation_pct > 15) {
      errors.push('Inflation rate must be between 0% and 15%');
    }

    if (inputs.investment_returns.pre_retirement_return_pct < 4 || inputs.investment_returns.pre_retirement_return_pct > 25) {
      errors.push('Pre-retirement return must be between 4% and 25%');
    }

    if (inputs.investment_returns.post_retirement_return_pct < 2 || inputs.investment_returns.post_retirement_return_pct > 15) {
      errors.push('Post-retirement return must be between 2% and 15%');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
