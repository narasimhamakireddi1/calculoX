import { Decimal } from 'decimal.js';

export interface PricingInputs {
  costPrice: number;
  sellingPrice: number;
  targetMarginPct: number;
  targetMarkupPct: number;
  gstRatePct: number;
}

export type CalculationBasis = 'COST_DRIVEN' | 'SELLING_PRICE_DRIVEN';
export type GSTTreatment = 'EXCLUSIVE' | 'INCLUSIVE';

export interface OperationalModes {
  calculationBasis: CalculationBasis;
  gstTreatment: GSTTreatment;
  marginOrMarkup?: 'margin' | 'markup';
}

export interface PricingResult {
  inputCostPrice: number;
  netSellingPricePreGst: number;
  gstTaxLiability: number;
  finalConsumerMRP: number;
  absoluteGrossProfit: number;
  calculatedMarkupPercentage: number;
  calculatedMarginPercentage: number;
  isProfitable: boolean;
  originalMarginBeforeGst?: number;
  marginDilutionByGst?: number;
}

export class ProfitMarginGstEngine {
  static calculatePricing(
    inputs: PricingInputs,
    modes: OperationalModes
  ): PricingResult {
    const cost = new Decimal(inputs.costPrice || 0);
    const gstRate = new Decimal(inputs.gstRatePct || 0).div(100);

    if (cost.isZero() || cost.isNegative()) {
      return {
        inputCostPrice: 0,
        netSellingPricePreGst: 0,
        gstTaxLiability: 0,
        finalConsumerMRP: 0,
        absoluteGrossProfit: 0,
        calculatedMarkupPercentage: 0,
        calculatedMarginPercentage: 0,
        isProfitable: false,
      };
    }

    let netSellingPrice: Decimal;
    let finalInvoicePrice: Decimal;
    let gstAmount: Decimal;

    if (modes.calculationBasis === 'COST_DRIVEN') {
      // Bottom-up: cost + target percentage
      const useMargin = modes.marginOrMarkup === 'margin';

      if (useMargin && inputs.targetMarginPct > 0) {
        let marginFraction = new Decimal(inputs.targetMarginPct).div(100);
        if (marginFraction.gte(1)) {
          marginFraction = new Decimal('0.9999');
        }
        netSellingPrice = cost.div(new Decimal(1).sub(marginFraction));
      } else if (!useMargin && inputs.targetMarkupPct > 0) {
        const markupFraction = new Decimal(inputs.targetMarkupPct).div(100);
        netSellingPrice = cost.mul(new Decimal(1).add(markupFraction));
      } else {
        netSellingPrice = cost;
      }

      if (modes.gstTreatment === 'EXCLUSIVE') {
        gstAmount = netSellingPrice.mul(gstRate);
        finalInvoicePrice = netSellingPrice.add(gstAmount);
      } else {
        finalInvoicePrice = netSellingPrice;
        netSellingPrice = finalInvoicePrice.div(new Decimal(1).add(gstRate));
        gstAmount = finalInvoicePrice.sub(netSellingPrice);
      }
    } else {
      // Top-down: market price / MRP driven
      const sellingPrice = new Decimal(inputs.sellingPrice || 0);

      if (sellingPrice.lte(0)) {
        return {
          inputCostPrice: cost.toNumber(),
          netSellingPricePreGst: 0,
          gstTaxLiability: 0,
          finalConsumerMRP: 0,
          absoluteGrossProfit: 0,
          calculatedMarkupPercentage: 0,
          calculatedMarginPercentage: 0,
          isProfitable: false,
        };
      }

      if (modes.gstTreatment === 'INCLUSIVE') {
        finalInvoicePrice = sellingPrice;
        netSellingPrice = finalInvoicePrice.div(new Decimal(1).add(gstRate));
        gstAmount = finalInvoicePrice.sub(netSellingPrice);
      } else {
        netSellingPrice = sellingPrice;
        gstAmount = netSellingPrice.mul(gstRate);
        finalInvoicePrice = netSellingPrice.add(gstAmount);
      }
    }

    const grossProfit = netSellingPrice.sub(cost);
    const markupPct = cost.gt(0)
      ? grossProfit.div(cost).mul(100)
      : new Decimal(0);
    const marginPct = netSellingPrice.gt(0)
      ? grossProfit.div(netSellingPrice).mul(100)
      : new Decimal(0);

    const originalMarginBeforeGst = marginPct.toNumber();
    let marginDilution = 0;

    if (modes.gstTreatment === 'INCLUSIVE' && gstAmount.gt(0)) {
      const realNetProfit = grossProfit.sub(gstAmount);
      const realMargin = netSellingPrice.gt(0)
        ? realNetProfit.div(netSellingPrice).mul(100)
        : new Decimal(0);
      marginDilution = originalMarginBeforeGst - realMargin.toNumber();
    }

    return {
      inputCostPrice: Math.round(cost.toNumber() * 100) / 100,
      netSellingPricePreGst: Math.round(netSellingPrice.toNumber() * 100) / 100,
      gstTaxLiability: Math.round(gstAmount.toNumber() * 100) / 100,
      finalConsumerMRP: Math.round(finalInvoicePrice.toNumber() * 100) / 100,
      absoluteGrossProfit: Math.round(grossProfit.toNumber() * 100) / 100,
      calculatedMarkupPercentage: Math.round(markupPct.toNumber() * 100) / 100,
      calculatedMarginPercentage: Math.round(marginPct.toNumber() * 100) / 100,
      isProfitable: grossProfit.gt(0),
      originalMarginBeforeGst,
      marginDilutionByGst: marginDilution > 0 ? Math.round(marginDilution * 100) / 100 : 0,
    };
  }

  static calculateAllGstScenarios(
    inputs: PricingInputs,
    modes: Omit<OperationalModes, 'gstTreatment'>
  ) {
    const scenarios = [];
    const rates = [0, 5, 12, 18, 28];

    for (const rate of rates) {
      const result = this.calculatePricing(inputs, {
        ...modes,
        gstTreatment: 'EXCLUSIVE',
        gstRatePct: rate,
      } as any);

      scenarios.push({
        gstRate: rate,
        netSellingPrice: result.netSellingPricePreGst,
        gstAmount: result.gstTaxLiability,
        finalPrice: result.finalConsumerMRP,
        profit: result.absoluteGrossProfit,
        marginPct: result.calculatedMarginPercentage,
        markupPct: result.calculatedMarkupPercentage,
      });
    }

    return scenarios;
  }
}
