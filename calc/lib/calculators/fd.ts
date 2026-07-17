import Decimal from 'decimal.js';

export type PayoutType = 'cumulative' | 'quarterly' | 'monthly';

export interface FDInput {
  principal: number;
  annualRate: number;
  years: number;
  months?: number;
  days?: number;
  payoutType?: PayoutType;
  seniorCitizen?: boolean;
}

export interface FDResult {
  maturityAmount: number;
  totalInterest: number;
  periodicPayout?: number;
  tenure: {
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalDays: number;
  };
}

function isShortTermFD(totalMonths: number): boolean {
  return totalMonths < 6;
}

function calculateShortTermFD(principal: Decimal, r: Decimal, totalDays: number): FDResult {
  const maturity = principal.times(new Decimal(1).plus(r.times(new Decimal(totalDays).dividedBy(365))));
  const interest = maturity.minus(principal);

  return {
    maturityAmount: parseFloat(maturity.toFixed(2)),
    totalInterest: parseFloat(interest.toFixed(2)),
    tenure: {
      years: 0,
      months: Math.floor(totalDays / 30.41),
      days: Math.round(totalDays % 30.41),
      totalMonths: Math.floor(totalDays / 30.41),
      totalDays,
    },
  };
}

function calculateCumulativeFD(principal: Decimal, r: Decimal, years: number, months: number, days: number): FDResult {
  const totalMonthsDecimal = new Decimal(years).times(12).plus(months).plus(new Decimal(days).dividedBy(30.41));
  const fullQuarters = Math.floor(totalMonthsDecimal.toNumber() / 3);
  const leftoverMonths = totalMonthsDecimal.toNumber() % 3;

  const compoundedPrincipal = principal.times(new Decimal(1).plus(r.dividedBy(4)).pow(fullQuarters));
  const maturity = compoundedPrincipal.times(new Decimal(1).plus(r.times(new Decimal(leftoverMonths).dividedBy(12))));
  const interest = maturity.minus(principal);

  return {
    maturityAmount: parseFloat(maturity.toFixed(2)),
    totalInterest: parseFloat(interest.toFixed(2)),
    tenure: {
      years,
      months,
      days,
      totalMonths: years * 12 + months,
      totalDays: Math.round((years * 12 + months + days / 30.41) * 30.41),
    },
  };
}

function calculateQuarterlyPayoutFD(principal: Decimal, r: Decimal, years: number, months: number, days: number): FDResult {
  const totalMonthsDecimal = new Decimal(years).times(12).plus(months).plus(new Decimal(days).dividedBy(30.41));
  const totalQuarters = totalMonthsDecimal.dividedBy(3);

  const quarterlyPayout = principal.times(r.dividedBy(4));
  const totalInterest = quarterlyPayout.times(totalQuarters);

  return {
    maturityAmount: parseFloat(principal.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    periodicPayout: parseFloat(quarterlyPayout.toFixed(2)),
    tenure: {
      years,
      months,
      days,
      totalMonths: years * 12 + months,
      totalDays: Math.round((years * 12 + months + days / 30.41) * 30.41),
    },
  };
}

function calculateMonthlyPayoutFD(principal: Decimal, r: Decimal, years: number, months: number, days: number): FDResult {
  const totalMonthsDecimal = new Decimal(years).times(12).plus(months).plus(new Decimal(days).dividedBy(30.41));

  const divisor = new Decimal(12).times(new Decimal(1).plus(r.dividedBy(4)).pow(new Decimal(1).dividedBy(3)));
  const monthlyPayout = principal.times(r).dividedBy(divisor);
  const totalInterest = monthlyPayout.times(totalMonthsDecimal);

  return {
    maturityAmount: parseFloat(principal.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    periodicPayout: parseFloat(monthlyPayout.toFixed(2)),
    tenure: {
      years,
      months,
      days,
      totalMonths: years * 12 + months,
      totalDays: Math.round((years * 12 + months + days / 30.41) * 30.41),
    },
  };
}

export function calculateFD(input: FDInput): FDResult {
  const {
    principal: principalNum,
    annualRate,
    years = 0,
    months = 0,
    days = 0,
    payoutType = 'cumulative',
    seniorCitizen = false,
  } = input;

  const principal = new Decimal(principalNum);
  let rate = new Decimal(annualRate);

  if (seniorCitizen) {
    rate = rate.plus(0.5);
  }

  const r = rate.dividedBy(100);
  const totalMonths = years * 12 + months;
  const totalDays = Math.round((years * 12 + months + days / 30.41) * 30.41);

  if (isShortTermFD(totalMonths)) {
    return calculateShortTermFD(principal, r, totalDays);
  }

  switch (payoutType) {
    case 'quarterly':
      return calculateQuarterlyPayoutFD(principal, r, years, months, days);
    case 'monthly':
      return calculateMonthlyPayoutFD(principal, r, years, months, days);
    case 'cumulative':
    default:
      return calculateCumulativeFD(principal, r, years, months, days);
  }
}

export function generateFDProjection(
  input: FDInput,
): Array<{ month: number; amount: number; interest: number; payout: number }> {
  const {
    principal: principalNum,
    annualRate,
    years = 0,
    months = 0,
    payoutType = 'cumulative',
    seniorCitizen = false,
  } = input;

  const principal = new Decimal(principalNum);
  let rate = new Decimal(annualRate);

  if (seniorCitizen) {
    rate = rate.plus(0.5);
  }

  const r = rate.dividedBy(100);
  const totalMonths = years * 12 + months;
  const projections: Array<{ month: number; amount: number; interest: number; payout: number }> = [];

  if (payoutType === 'quarterly') {
    for (let m = 3; m <= totalMonths; m += 3) {
      const quarterlyPayout = principal.times(r.dividedBy(4));
      const quarter = m / 3;
      const totalPayout = quarterlyPayout.times(quarter);
      projections.push({
        month: m,
        amount: parseFloat(principal.toFixed(2)),
        interest: parseFloat(totalPayout.toFixed(2)),
        payout: parseFloat(quarterlyPayout.toFixed(2)),
      });
    }
  } else if (payoutType === 'monthly') {
    const divisor = new Decimal(12).times(new Decimal(1).plus(r.dividedBy(4)).pow(new Decimal(1).dividedBy(3)));
    const monthlyPayout = principal.times(r).dividedBy(divisor);

    for (let m = 1; m <= totalMonths; m += 1) {
      const totalPayout = monthlyPayout.times(m);
      projections.push({
        month: m,
        amount: parseFloat(principal.toFixed(2)),
        interest: parseFloat(totalPayout.toFixed(2)),
        payout: parseFloat(monthlyPayout.toFixed(2)),
      });
    }
  } else {
    for (let m = 3; m <= totalMonths; m += 3) {
      const fullQuarters = Math.floor(m / 3);
      const leftoverMonths = m % 3;

      const compounded = principal.times(new Decimal(1).plus(r.dividedBy(4)).pow(fullQuarters));
      const amount = compounded.times(new Decimal(1).plus(r.times(new Decimal(leftoverMonths).dividedBy(12))));
      const interest = amount.minus(principal);

      projections.push({
        month: m,
        amount: parseFloat(amount.toFixed(2)),
        interest: parseFloat(interest.toFixed(2)),
        payout: 0,
      });
    }
  }

  return projections;
}
