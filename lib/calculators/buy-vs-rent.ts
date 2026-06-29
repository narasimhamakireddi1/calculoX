import Decimal from 'decimal.js';

export interface BuyVsRentInputs {
  property_buying_track: {
    property_value: number;
    down_payment_pct: number;
    loan_interest_rate_pct: number;
    loan_tenure_years: number;
    property_growth_rate_pct: number;
    annual_maintenance_pct: number;
  };
  renting_track: {
    initial_monthly_rent: number;
    annual_rent_increase_pct: number;
  };
  investment_track: {
    opportunity_return_pct: number;
    inflation_rate_pct: number;
  };
  common: {
    projection_tenure_years: number;
    apply_tax_benefit: boolean;
    income_tax_rate_pct: number;
  };
}

export interface YearlyData {
  year: number;
  buyer_net_worth: number;
  renter_net_worth: number;
  buyer_cumulative_outflow: number;
  renter_cumulative_outflow: number;
  property_value: number;
  remaining_loan: number;
  monthly_rent: number;
  monthly_emi: number;
  renter_monthly_savings: number;
}

export interface BuyVsRentResult {
  monthly_emi: number;
  down_payment: number;
  buyer_final_property_value: number;
  buyer_remaining_loan: number;
  buyer_net_worth: number;
  renter_investment_portfolio: number;
  financial_verdict: 'BUYING_IS_BETTER' | 'RENTING_IS_BETTER';
  absolute_delta: number;
  delta_pct: number;
  break_even_year: number | null;
  yearly_data: YearlyData[];
}

export class BuyVsRentEngine {
  static calculate(inputs: BuyVsRentInputs): BuyVsRentResult {
    const {
      property_buying_track,
      renting_track,
      investment_track,
      common,
    } = inputs;

    // Convert to Decimal for precision
    const propertyValue = new Decimal(property_buying_track.property_value);
    const downPaymentPct = new Decimal(property_buying_track.down_payment_pct);
    const loanRate = new Decimal(property_buying_track.loan_interest_rate_pct);
    const loanTenure = new Decimal(property_buying_track.loan_tenure_years);
    const propGrowthRate = new Decimal(property_buying_track.property_growth_rate_pct);
    const maintenancePct = new Decimal(property_buying_track.annual_maintenance_pct);

    const initialRent = new Decimal(renting_track.initial_monthly_rent);
    const rentIncreaseRate = new Decimal(renting_track.annual_rent_increase_pct);

    const invReturnRate = new Decimal(investment_track.opportunity_return_pct);

    const projectionYears = new Decimal(common.projection_tenure_years);
    const applyTaxBenefit = common.apply_tax_benefit;
    const incomeTaxRate = new Decimal(common.income_tax_rate_pct);

    // Compute down payment and loan principal
    const downPayment = propertyValue.mul(downPaymentPct).div(100);
    const loanPrincipal = propertyValue.minus(downPayment);

    // Calculate monthly EMI using reducing balance formula
    const totalMonths = loanTenure.mul(12).toNumber();
    const monthlyLoanRate = loanRate.div(100).div(12);
    let monthlyEMI: Decimal;

    if (monthlyLoanRate.greaterThan(0)) {
      const numerator = loanPrincipal.mul(monthlyLoanRate).mul(
        monthlyLoanRate.plus(1).pow(totalMonths)
      );
      const denominator = monthlyLoanRate.plus(1).pow(totalMonths).minus(1);
      monthlyEMI = numerator.div(denominator);
    } else {
      monthlyEMI = loanPrincipal.div(totalMonths);
    }

    // Monthly rates for investment
    const monthlyInvRate = invReturnRate.div(100).div(12);

    // Initialize state tracking
    let currentPropertyValue = propertyValue;
    let currentOutstandingLoan = loanPrincipal;
    let currentMonthlyRent = initialRent;
    let renterOpportunityCorpus = downPayment;

    const yearlyDataPoints: YearlyData[] = [];
    let breakEvenYear: number | null = null;

    // Month-by-month loop
    const totalProjectionMonths = projectionYears.mul(12).toNumber();

    for (let month = 1; month <= totalProjectionMonths; month++) {
      const currentYear = Math.ceil(month / 12);

      // Annual adjustments at the start of each new year (month 1, 13, 25, etc.)
      if (month > 1 && (month - 1) % 12 === 0) {
        currentPropertyValue = currentPropertyValue.mul(
          new Decimal(1).plus(propGrowthRate.div(100))
        );
        currentMonthlyRent = currentMonthlyRent.mul(
          new Decimal(1).plus(rentIncreaseRate.div(100))
        );
      }

      // Calculate monthly outflows for buyer
      const monthlyMaintenance = currentPropertyValue
        .mul(maintenancePct.div(100))
        .div(12);
      const isLoanActive = month <= totalMonths;
      const activeEMI = isLoanActive ? monthlyEMI : new Decimal(0);
      const buyerTotalOutflow = activeEMI.plus(monthlyMaintenance);

      // Handle home loan principal reduction
      if (isLoanActive) {
        const interestComponent = currentOutstandingLoan.mul(monthlyLoanRate);
        const principalComponent = activeEMI.minus(interestComponent);
        currentOutstandingLoan = Decimal.max(
          new Decimal(0),
          currentOutstandingLoan.minus(principalComponent)
        );
      }

      // Opportunity cost gap
      const savingsDifference = buyerTotalOutflow.minus(currentMonthlyRent);

      // Grow renter's investment corpus
      renterOpportunityCorpus = renterOpportunityCorpus.mul(
        new Decimal(1).plus(monthlyInvRate)
      );

      // Add or withdraw savings from renter's corpus
      renterOpportunityCorpus = renterOpportunityCorpus.plus(savingsDifference);

      // Snap yearly data at end of each year
      if (month % 12 === 0) {
        const buyerNetWorth = currentPropertyValue.minus(currentOutstandingLoan);

        // Capture yearly data point
        const yearData: YearlyData = {
          year: currentYear,
          buyer_net_worth: buyerNetWorth.toNumber(),
          renter_net_worth: renterOpportunityCorpus.toNumber(),
          buyer_cumulative_outflow: 0, // Placeholder - computed below
          renter_cumulative_outflow: 0, // Placeholder - computed below
          property_value: currentPropertyValue.toNumber(),
          remaining_loan: currentOutstandingLoan.toNumber(),
          monthly_rent: currentMonthlyRent.toNumber(),
          monthly_emi: activeEMI.toNumber(),
          renter_monthly_savings: savingsDifference.toNumber(),
        };

        yearlyDataPoints.push(yearData);

        // Detect break-even year
        if (
          breakEvenYear === null &&
          buyerNetWorth.greaterThan(renterOpportunityCorpus)
        ) {
          breakEvenYear = currentYear;
        }
      }
    }

    // Compute cumulative outflows for yearly data
    let buyerCumulativeOutflow = new Decimal(0);
    let renterCumulativeOutflow = new Decimal(0);

    for (let i = 0; i < yearlyDataPoints.length; i++) {
      const year = yearlyDataPoints[i].year;
      const yearsOfPayment = year;

      // Buyer cumulative: (EMI + maintenance) for all months up to this year
      const totalEMIMonths = Math.min(totalMonths, yearsOfPayment * 12);
      const emiSubtotal = monthlyEMI.mul(totalEMIMonths);

      // Maintenance: rough approximation per year (simplified)
      let maintenanceSubtotal = new Decimal(0);
      for (let y = 1; y <= year; y++) {
        const propValueAtYear = propertyValue.mul(propGrowthRate.div(100).plus(1).pow(y - 1));
        maintenanceSubtotal = maintenanceSubtotal.plus(
          propValueAtYear.mul(maintenancePct.div(100))
        );
      }

      buyerCumulativeOutflow = emiSubtotal.plus(maintenanceSubtotal);

      // Renter cumulative: rent paid (compound monthly escalation)
      let rentSubtotal = new Decimal(0);
      let tempMonthlyRent = initialRent;
      for (let m = 0; m < yearsOfPayment * 12; m++) {
        if (m > 0 && m % 12 === 0) {
          tempMonthlyRent = tempMonthlyRent.mul(
            new Decimal(1).plus(rentIncreaseRate.div(100))
          );
        }
        rentSubtotal = rentSubtotal.plus(tempMonthlyRent);
      }

      renterCumulativeOutflow = rentSubtotal;

      yearlyDataPoints[i].buyer_cumulative_outflow = buyerCumulativeOutflow.toNumber();
      yearlyDataPoints[i].renter_cumulative_outflow = renterCumulativeOutflow.toNumber();
    }

    // Apply Section 24(b) tax benefit if enabled
    let buyerFinalNetWorth = currentPropertyValue.minus(currentOutstandingLoan);

    if (applyTaxBenefit) {
      // Calculate total interest paid (across all years)
      let totalInterestPaid = new Decimal(0);
      let tempOutstandingLoan = loanPrincipal;
      const monthlyRateDecimal = loanRate.div(100).div(12);

      for (let month = 1; month <= Math.min(totalMonths, totalProjectionMonths); month++) {
        const interestThisMonth = tempOutstandingLoan.mul(monthlyRateDecimal);
        totalInterestPaid = totalInterestPaid.plus(interestThisMonth);

        const principalThisMonth = monthlyEMI.minus(interestThisMonth);
        tempOutstandingLoan = Decimal.max(
          new Decimal(0),
          tempOutstandingLoan.minus(principalThisMonth)
        );
      }

      // Cap deduction at ₹2,00,000 per year, total across tenure
      const maxDeductionPerYear = new Decimal(200000);
      const yearsWithLoan = Math.min(
        projectionYears.toNumber(),
        loanTenure.toNumber()
      );
      const maxTotalDeduction = maxDeductionPerYear.mul(yearsWithLoan);
      const deductibleAmount = Decimal.min(totalInterestPaid, maxTotalDeduction);

      // Tax savings = deductible amount × tax rate
      const taxSavings = deductibleAmount.mul(incomeTaxRate.div(100));

      // Add tax savings as cash refund to buyer's net worth
      buyerFinalNetWorth = buyerFinalNetWorth.plus(taxSavings);
    }

    const renterFinalNetWorth = renterOpportunityCorpus;
    const absoluteDelta = buyerFinalNetWorth.minus(renterFinalNetWorth).abs();
    const deltaPercent = renterFinalNetWorth.greaterThan(0)
      ? absoluteDelta.div(renterFinalNetWorth).mul(100)
      : new Decimal(0);

    const verdict =
      buyerFinalNetWorth.greaterThan(renterFinalNetWorth)
        ? 'BUYING_IS_BETTER'
        : 'RENTING_IS_BETTER';

    return {
      monthly_emi: monthlyEMI.toNumber(),
      down_payment: downPayment.toNumber(),
      buyer_final_property_value: currentPropertyValue.toNumber(),
      buyer_remaining_loan: currentOutstandingLoan.toNumber(),
      buyer_net_worth: buyerFinalNetWorth.toNumber(),
      renter_investment_portfolio: renterFinalNetWorth.toNumber(),
      financial_verdict: verdict,
      absolute_delta: absoluteDelta.toNumber(),
      delta_pct: deltaPercent.toNumber(),
      break_even_year: breakEvenYear,
      yearly_data: yearlyDataPoints,
    };
  }
}
