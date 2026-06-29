/**
 * Simple Interest Calculator Logic (FY 2025-26)
 * Supports 3 tenure types: Years, Months, Days
 * Automatic leap year detection for maximum accuracy
 *
 * Formulas:
 * - Years: SI = (P × R × Years) / 100
 * - Months: SI = (P × R × Months) / 1200
 * - Days: SI = (P × R × Days) / (100 × DaysInYear)
 * Where DaysInYear = 365 (standard year) or 366 (leap year)
 */

import Decimal from 'decimal.js';

export type TenureType = 'years' | 'months' | 'days';

export interface SimpleInterestInput {
  principal: number;
  annualRate: number;
  tenureValue: number;
  tenureType: TenureType;
  startDate?: Date;
  endDate?: Date;
}

export interface SimpleInterestResult {
  principalAmount: number;
  interestAccrued: number;
  totalMaturityValue: number;
  timeFactor: number;
  dailyAccrual?: number;
  tenure: {
    value: number;
    type: TenureType;
    inYears: number;
    inMonths: number;
    inDays: number;
  };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInYear(startDate?: Date, endDate?: Date): number {
  if (!startDate || !endDate) {
    const currentYear = new Date().getFullYear();
    return isLeapYear(currentYear) ? 366 : 365;
  }

  const start = startDate.getFullYear();
  const end = endDate.getFullYear();

  if (start === end) {
    return isLeapYear(start) ? 366 : 365;
  }

  let totalDays = 0;
  for (let year = start; year <= end; year++) {
    totalDays += isLeapYear(year) ? 366 : 365;
  }
  return totalDays;
}


export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const { principal, annualRate, tenureValue, tenureType, startDate, endDate } = input;

  const principal_d = new Decimal(principal);
  const rate_d = new Decimal(annualRate).dividedBy(100);

  // Calculate time factor based on tenure type
  let timeFactor = 0;
  let daysInYear = 365;

  switch (tenureType) {
    case 'years':
      timeFactor = tenureValue;
      break;
    case 'months':
      timeFactor = tenureValue / 12;
      break;
    case 'days':
      daysInYear = getDaysInYear(startDate, endDate);
      timeFactor = tenureValue / daysInYear;
      break;
  }

  // SI = P × R × T (where T is already divided by 100 or denominator)
  let simpleInterest: Decimal;
  if (tenureType === 'years') {
    simpleInterest = principal_d.times(annualRate).times(tenureValue).dividedBy(100);
  } else if (tenureType === 'months') {
    simpleInterest = principal_d.times(annualRate).times(tenureValue).dividedBy(1200);
  } else {
    simpleInterest = principal_d
      .times(annualRate)
      .times(tenureValue)
      .dividedBy(100)
      .dividedBy(daysInYear);
  }

  const totalAmount = principal_d.plus(simpleInterest);

  // Daily accrual for user insight
  const dailyAccrual = principal_d.times(rate_d).dividedBy(daysInYear);

  return {
    principalAmount: parseFloat(principal_d.toFixed(2)),
    interestAccrued: parseFloat(simpleInterest.toFixed(2)),
    totalMaturityValue: parseFloat(totalAmount.toFixed(2)),
    timeFactor: parseFloat(new Decimal(timeFactor).toFixed(4)),
    dailyAccrual: parseFloat(dailyAccrual.toFixed(2)),
    tenure: {
      value: tenureValue,
      type: tenureType,
      inYears: parseFloat(new Decimal(timeFactor).toFixed(4)),
      inMonths: parseFloat(new Decimal(timeFactor).times(12).toFixed(2)),
      inDays: parseFloat(new Decimal(timeFactor).times(daysInYear).toFixed(0)),
    },
  };
}

export function generateSimpleInterestProjection(
  input: SimpleInterestInput
): Array<{ period: number; label: string; interest: number; totalAmount: number }> {
  const projections: Array<{ period: number; label: string; interest: number; totalAmount: number }> = [];
  const principal_d = new Decimal(input.principal);
  const annualRate = input.annualRate;

  if (input.tenureType === 'years') {
    const yearlyInterest = principal_d.times(annualRate).dividedBy(100);
    for (let year = 1; year <= input.tenureValue; year++) {
      const interest = yearlyInterest.times(year);
      const totalAmount = principal_d.plus(interest);
      projections.push({
        period: year,
        label: `Year ${year}`,
        interest: parseFloat(interest.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      });
    }
  } else if (input.tenureType === 'months') {
    const monthlyInterest = principal_d.times(annualRate).dividedBy(1200);
    for (let month = 1; month <= input.tenureValue; month++) {
      const interest = monthlyInterest.times(month);
      const totalAmount = principal_d.plus(interest);
      projections.push({
        period: month,
        label: `Month ${month}`,
        interest: parseFloat(interest.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      });
    }
  } else {
    const daysInYear = getDaysInYear(input.startDate, input.endDate);
    const dailyInterest = principal_d.times(annualRate).dividedBy(100).dividedBy(daysInYear);
    const interval = Math.max(1, Math.floor(input.tenureValue / 12));

    for (let day = interval; day <= input.tenureValue; day += interval) {
      const interest = dailyInterest.times(day);
      const totalAmount = principal_d.plus(interest);
      projections.push({
        period: day,
        label: `Day ${day}`,
        interest: parseFloat(interest.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      });
    }
  }

  return projections;
}
