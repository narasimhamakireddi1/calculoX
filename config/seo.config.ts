/**
 * SEO Configuration for calculox
 * Comprehensive keyword strategies, featured snippet opportunities, and content optimization
 */

export interface SEOConfig {
  id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  longTailKeywords: string[];
  relatedSearchQueries: string[];
  featuredSnippetOpportunities: {
    type: 'definition' | 'list' | 'table' | 'comparison';
    question: string;
    answer: string;
  }[];
  internalLinkingTargets: string[];
  contentThemes: string[];
  targetSearchVolume: 'high' | 'medium' | 'low';
}

export const seoConfig: Record<string, SEOConfig> = {
  'sip-calculator': {
    id: 'sip',
    title: 'SIP Calculator',
    metaTitle: 'SIP Calculator India - calculox | Calculate Mutual Fund Returns Online',
    metaDescription: 'calculox SIP calculator - Advanced systematic investment plan calculator for mutual funds. Calculate returns with step-up SIP, monthly investments, 25+ years projections. RBI-compliant, free, instant results, no registration required.',
    keywords: [
      'sip calculator',
      'calculox sip calculator',
      'systematic investment plan calculator',
      'mutual fund calculator',
      'sip returns calculator',
      'sip calculator india',
      'step up sip calculator',
      'monthly sip calculator',
      'investment calculator india',
      'best sip calculator',
      'sip calculator online free',
      'free sip calculator',
      'sip investment calculator',
      'sip calculation tool',
      'rupee cost averaging calculator',
    ],
    longTailKeywords: [
      'how to calculate sip returns',
      'sip calculator with step up',
      'best sip calculator india',
      'monthly investment return calculator',
      'mutual fund sip calculator',
      'systematic investment plan formula',
      'sip returns calculator excel',
      'calculate sip returns online free',
      'sip calculator in calculox',
      'how to use sip calculator',
      'sip calculator for beginners',
      'advanced sip calculator with step up',
      'sip calculator with inflation',
      'sip vs lump sum calculator',
      'sip maturity amount calculator',
    ],
    relatedSearchQueries: [
      'how much returns in sip',
      'sip vs lump sum investment',
      'sip investment strategy',
      'sip calculator excel',
      'sip vs fixed deposit',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'definition',
        question: 'What is SIP (Systematic Investment Plan)?',
        answer: 'A Systematic Investment Plan (SIP) is an investment method where you invest a fixed amount of money in mutual funds at regular intervals (usually monthly). It allows you to build wealth gradually, benefit from rupee cost averaging, and reduce timing risk in the market.',
      },
      {
        type: 'list',
        question: 'What are the benefits of SIP investment?',
        answer: '1) Rupee cost averaging reduces average cost per unit. 2) Flexibility to invest any amount regularly. 3) Disciplined investing habit. 4) Low entry barrier. 5) Long-term wealth creation. 6) Rupee cost averaging benefit. 7) Professional fund management.',
      },
      {
        type: 'comparison',
        question: 'SIP vs Lump Sum Investment - Which is better?',
        answer: 'SIP (Systematic Investment Plan) spreads investments over time with lower risk and automatic rupee cost averaging, while Lump Sum involves investing all money at once. SIP is better for beginners and moderate markets; Lump Sum works well during market downturns.',
      },
    ],
    internalLinkingTargets: [
      '/cagr-calculator',
      '/fd-calculator',
      '/investment-returns',
      '/retirement-calculator',
    ],
    contentThemes: [
      'Mutual fund investment strategy',
      'How SIP builds wealth',
      'Step-up SIP vs regular SIP',
      'SIP vs lump sum returns',
      'Best mutual funds for SIP',
    ],
    targetSearchVolume: 'high',
  },

  'emi-calculator': {
    id: 'emi',
    title: 'EMI Calculator',
    metaTitle: 'EMI Calculator India - calculox | Home Loan Car Loan Personal Loan',
    metaDescription: 'calculox EMI calculator - Calculate monthly EMI for home loan, car loan, personal loan & vehicle loan. Get detailed amortization schedule, total interest. RBI-compliant. Free, instant, no registration.',
    keywords: [
      'emi calculator',
      'calculox emi calculator',
      'loan emi calculator',
      'home loan emi calculator',
      'car loan calculator',
      'personal loan emi',
      'emi calculator india',
      'vehicle loan calculator',
      'mortgage calculator',
      'emi calculator online',
      'emi calculator free',
      'emi payment calculator',
      'loan payment calculator',
      'equated monthly installment calculator',
      'monthly loan payment calculator',
    ],
    longTailKeywords: [
      'how to calculate emi on loan',
      'emi calculator with processing fee',
      'home loan emi calculator excel',
      'car loan monthly payment calculator',
      'personal loan emi calculator india',
      'calculate loan emi online free',
      'emi formula for loans',
      'loan amortization schedule calculator',
      'emi calculator in calculox',
      'how to use emi calculator',
      'emi calculator for home loan',
      'emi calculator for car loan',
      'emi calculator for personal loan',
      'emi calculator with prepayment',
      'emi calculator with floating rate',
    ],
    relatedSearchQueries: [
      'what is emi',
      'how to reduce emi',
      'emi payment schedule',
      'loan calculator',
      'home loan emi chart',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'definition',
        question: 'What is EMI (Equated Monthly Installment)?',
        answer: 'EMI (Equated Monthly Installment) is a fixed monthly payment made by a borrower to a lender consisting of principal and interest components. Calculated using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is principal, R is monthly interest rate, and N is number of months.',
      },
      {
        type: 'list',
        question: 'How to reduce home loan EMI?',
        answer: '1) Make a larger down payment to reduce principal. 2) Choose a longer tenure (increases interest but lowers EMI). 3) Negotiate better interest rate. 4) Make prepayments or foreclosure. 5) Switch to another lender with better rates. 6) Increase income through co-borrower.',
      },
      {
        type: 'table',
        question: 'EMI for different loan amounts and tenures',
        answer: '10 Lakh @ 8% for 20 years = ₹9,364/month. 25 Lakh @ 8.5% for 20 years = ₹24,339/month. 50 Lakh @ 8% for 20 years = ₹18,727/month. 1 Crore @ 8.5% for 20 years = ₹97,357/month.',
      },
    ],
    internalLinkingTargets: [
      '/home-loan-vs-rent',
      '/percentage-calculator',
      '/simple-interest-calculator',
    ],
    contentThemes: [
      'Understanding EMI components',
      'How to calculate EMI',
      'EMI vs flat rate interest',
      'Home loan vs personal loan EMI',
      'EMI reduction strategies',
    ],
    targetSearchVolume: 'high',
  },

  'bmi-calculator': {
    id: 'bmi',
    title: 'BMI Calculator',
    metaTitle: 'BMI Calculator India - calculox | Body Mass Index & Health Status',
    metaDescription: 'calculox BMI calculator - Calculate Body Mass Index (BMI) with WHO health categories. Get ideal weight for your height. Free health recommendations. Supports metric & imperial units. For adults.',
    keywords: [
      'bmi calculator',
      'calculox bmi calculator',
      'body mass index calculator',
      'bmi calculator india',
      'ideal weight calculator',
      'health weight calculator',
      'bmi chart',
      'obesity calculator',
      'fitness calculator',
      'bmi calculator online',
      'bmi calculator free',
      'weight calculator',
      'bmi measurement tool',
      'health calculator online',
      'ideal weight for height',
    ],
    longTailKeywords: [
      'how to calculate bmi',
      'bmi calculator with age',
      'bmi calculator for women',
      'bmi calculator for men',
      'ideal weight for height calculator',
      'bmi calculator kg cm',
      'bmi calculator lbs inches',
      'bmi category chart',
      'bmi calculator in calculox',
      'what is a good bmi',
      'bmi calculator for adults',
      'free online bmi calculator',
      'accurate bmi calculator',
      'bmi calculator with health tips',
      'bmi index calculator',
    ],
    relatedSearchQueries: [
      'what is a good bmi',
      'bmi chart for adults',
      'how to reduce bmi',
      'bmi categories',
      'ideal weight for height',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'definition',
        question: 'What is BMI (Body Mass Index)?',
        answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. Calculated as: BMI = Weight (kg) / Height (m²). Used to assess health risk and obesity levels in adults.',
      },
      {
        type: 'table',
        question: 'BMI categories and health status',
        answer: 'Underweight (BMI < 18.5): May indicate malnutrition. Normal weight (18.5-24.9): Healthy range. Overweight (25-29.9): Increased health risk. Obese (BMI ≥ 30): High health risk.',
      },
    ],
    internalLinkingTargets: [
      '/percentage-calculator',
      '/retirement-calculator',
    ],
    contentThemes: [
      'Understanding BMI categories',
      'Healthy weight loss strategies',
      'BMI limitations and accuracy',
      'Health risks by BMI category',
      'Nutrition and fitness tips',
    ],
    targetSearchVolume: 'medium',
  },

  'tax-calculator': {
    id: 'tax',
    title: 'Income Tax Calculator',
    metaTitle: 'Income Tax Calculator India FY 2025-26 - Calculate Tax & Save | calculox',
    metaDescription: 'Advanced income tax calculator for FY 2025-26. Calculate tax on salary with new/old tax regime, HRA, LTA, 80C deductions, and get instant tax liability. RBI-compliant.',
    keywords: [
      'income tax calculator',
      'income tax calculator india',
      'tax calculator 2025-26',
      'salary tax calculator',
      'income tax calculator with hra',
      'tax slab calculator',
      'tax deduction calculator',
      'income tax new regime',
    ],
    longTailKeywords: [
      'how to calculate income tax',
      'new tax regime vs old regime',
      'income tax calculator with deductions',
      'tax calculator excel india',
      'monthly salary tax calculator',
      'hra tax exemption calculator',
      'section 80c deduction calculator',
      'income tax for freelancers',
    ],
    relatedSearchQueries: [
      'income tax slabs 2025-26',
      'how much tax on salary',
      'hra exemption rules',
      '80c deduction limit',
      'tax saving schemes',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'table',
        question: 'Income tax slabs for FY 2025-26',
        answer: 'Upto ₹3 Lakh: Nil. ₹3-6 Lakh: 5%. ₹6-9 Lakh: 10%. ₹9-12 Lakh: 15%. ₹12-15 Lakh: 20%. Above ₹15 Lakh: 30%. (Standard deduction ₹75,000)',
      },
      {
        type: 'list',
        question: 'Top tax saving strategies in India',
        answer: '1) Invest in Section 80C (₹1.5L limit): LIC, ELSS, FD. 2) HRA exemption: Up to rent/10% salary. 3) LTA claim: ₹30,000 (4 trips). 4) Interest on home loan: ₹2L deduction. 5) NPS (Section 80CCD): ₹2L deduction.',
      },
    ],
    internalLinkingTargets: [
      '/fd-calculator',
      '/retirement-calculator',
      '/emi-calculator',
    ],
    contentThemes: [
      'Understanding income tax brackets',
      'New vs old tax regime comparison',
      'HRA exemption calculation',
      'Section 80C investment options',
      'Tax planning for salaried employees',
    ],
    targetSearchVolume: 'high',
  },

  'home-loan-vs-rent': {
    id: 'home-loan-vs-rent',
    title: 'Home Loan vs Rent Calculator',
    metaTitle: 'Buy vs Rent Calculator India - Compare Home Loan vs Renting | calculox',
    metaDescription: 'Smart buy vs rent calculator comparing home ownership vs renting with 20-year projections. Includes break-even point, tax benefits (24b), and opportunity cost analysis.',
    keywords: [
      'buy vs rent calculator',
      'home loan vs rent',
      'should i buy or rent',
      'home affordability calculator',
      'property investment calculator',
      'buy vs rent analysis',
      'home ownership cost calculator',
      'rent vs buy india',
    ],
    longTailKeywords: [
      'home loan vs rent comparison',
      'when is it better to buy a home',
      'buying a house vs renting calculator',
      'home affordability ratio',
      'rent vs own calculator excel',
      'investment property calculator',
      'opportunity cost of home purchase',
      'section 24b tax benefit calculator',
    ],
    relatedSearchQueries: [
      'is buying a house worth it',
      'rent vs buy break even',
      'property investment returns',
      'home loan interest rates',
      'property appreciation rates',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'comparison',
        question: 'Buy vs Rent - Which is financially better?',
        answer: 'Buying is better for long-term stability (7+ years) with property appreciation and tax benefits. Renting offers flexibility, lower upfront costs, and better returns if you invest savings. Decision depends on your timeline, income, and local property market.',
      },
    ],
    internalLinkingTargets: [
      '/emi-calculator',
      '/retirement-calculator',
      '/percentage-calculator',
    ],
    contentThemes: [
      'Complete buy vs rent analysis',
      'How to calculate home affordability',
      'Tax benefits of home ownership',
      'Property investment strategy',
      'Break-even point for home purchase',
    ],
    targetSearchVolume: 'high',
  },

  'profit-margin-calculator': {
    id: 'profit-margin',
    title: 'Profit Margin & Markup Calculator',
    metaTitle: 'Profit Margin Calculator - Calculate Markup & GST Impact | calculox',
    metaDescription: 'Free profit margin & markup calculator for Indian retailers & businesses. Calculate gross profit, margin %, markup % with GST (5/12/18/28%) impact analysis. Cost & price-driven modes.',
    keywords: [
      'profit margin calculator',
      'markup calculator',
      'profit calculator',
      'gst calculator with margin',
      'business margin calculator',
      'markup vs margin calculator',
      'gross profit calculator',
      'pricing calculator with gst',
    ],
    longTailKeywords: [
      'how to calculate profit margin',
      'markup vs margin difference',
      'gst impact on profit margin',
      'cost price to selling price calculator',
      'retail pricing calculator with gst',
      'business profit calculator excel',
      'markup percentage calculator',
      'profit margin formula',
    ],
    relatedSearchQueries: [
      'healthy profit margin percentage',
      'how to price products with gst',
      'calculate mrp from cost price',
      'markup for retail stores',
      'gst inclusive vs exclusive',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'definition',
        question: 'Difference between profit margin and markup',
        answer: 'Markup is the percentage increase from cost price to selling price: Markup = (Selling Price - Cost Price) / Cost Price × 100. Profit Margin is the percentage of profit on selling price: Margin = (Selling Price - Cost Price) / Selling Price × 100. A 50% markup results in 33% margin.',
      },
    ],
    internalLinkingTargets: [
      '/percentage-calculator',
      '/gst-calculator',
    ],
    contentThemes: [
      'Markup vs margin explained',
      'Healthy profit margins by industry',
      'GST impact on retail pricing',
      'Cost-plus pricing strategy',
      'MRP calculation with GST',
    ],
    targetSearchVolume: 'medium',
  },

  'retirement-calculator': {
    id: 'retirement',
    title: 'Retirement Calculator',
    metaTitle: 'Retirement Calculator India - Calculate Retirement Corpus 25x Rule | calculox',
    metaDescription: 'Advanced retirement calculator using NISM 25x rule. Calculate retirement corpus needed, plan inflation-adjusted expenses, and get 2-phase retirement projections. India-specific.',
    keywords: [
      'retirement calculator',
      'retirement corpus calculator',
      'retirement planning calculator',
      'retirement calculator india',
      'how much need to retire',
      'retirement age calculator',
      'financial independence calculator',
      'retirement savings calculator',
    ],
    longTailKeywords: [
      'retirement corpus calculator 25x rule',
      'how much money needed to retire',
      'retirement planning calculator excel',
      'retirement corpus formula',
      'early retirement calculator',
      'retirement age india calculator',
      'retirement fund calculator',
      'retirement income calculator',
    ],
    relatedSearchQueries: [
      'how to calculate retirement corpus',
      '25x rule retirement',
      'retirement planning strategies',
      'retirement age in india',
      'retirement investment options',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'definition',
        question: 'What is the 25x rule for retirement?',
        answer: 'The 25x rule is a retirement planning framework that suggests you need 25 times your annual expenses as a retirement corpus. This is based on the 4% safe withdrawal rate, meaning you can withdraw 4% of your corpus annually without running out of money in 25+ years.',
      },
    ],
    internalLinkingTargets: [
      '/sip-calculator',
      '/fd-calculator',
      '/tax-calculator',
    ],
    contentThemes: [
      'Retirement planning strategies',
      'How to calculate retirement corpus',
      'Post-retirement inflation planning',
      'Retirement investment options in India',
      'Early retirement strategies',
    ],
    targetSearchVolume: 'high',
  },

  'scientific-calculator': {
    id: 'scientific',
    title: 'Scientific Calculator',
    metaTitle: 'Scientific Calculator Online - Complex Numbers, Matrix & Statistics | calculox',
    metaDescription: 'Advanced online scientific calculator with 4 engines: Standard math, Complex numbers, Matrix operations, and Statistics. Casio ClassWiz-style. Free, no registration.',
    keywords: [
      'scientific calculator',
      'online calculator',
      'scientific calculator online',
      'complex number calculator',
      'matrix calculator',
      'statistics calculator',
      'trigonometry calculator',
      'math calculator online',
    ],
    longTailKeywords: [
      'scientific calculator with matrices',
      'advanced calculator online',
      'complex number calculator online',
      'scientific notation calculator',
      'logarithm calculator',
      'trigonometric functions calculator',
      'statistical calculator online',
      'linear regression calculator',
    ],
    relatedSearchQueries: [
      'best scientific calculator',
      'calculator with matrix operations',
      'statistics calculator for data',
      'scientific calculator app',
      'online math calculator',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'list',
        question: 'Features of advanced scientific calculators',
        answer: '1) Trigonometric functions (sin, cos, tan, inverse). 2) Logarithmic & exponential functions. 3) Complex number operations. 4) Matrix operations (addition, multiplication, inverse). 5) Statistical functions (mean, median, standard deviation). 6) Permutation and combination calculations.',
      },
    ],
    internalLinkingTargets: [
      '/percentage-calculator',
      '/cagr-calculator',
    ],
    contentThemes: [
      'Scientific calculator guide',
      'Complex number operations',
      'Matrix math basics',
      'Statistics for beginners',
      'Advanced mathematical functions',
    ],
    targetSearchVolume: 'low',
  },

  'fd-calculator': {
    id: 'fd',
    title: 'FD Calculator',
    metaTitle: 'FD Calculator India 2026 - Fixed Deposit Maturity & Interest | calculox',
    metaDescription: 'Advanced FD calculator for fixed deposit. Calculate maturity amount with cumulative, quarterly, monthly payouts. RBI-compliant. Senior citizen rate (+0.5%). Instant results.',
    keywords: [
      'fd calculator',
      'fixed deposit calculator',
      'fd calculator india',
      'bank deposit calculator',
      'fixed deposit interest calculator',
      'maturity calculator',
      'compound interest calculator',
      'savings calculator india',
    ],
    longTailKeywords: [
      'how to calculate fixed deposit returns',
      'fd interest calculator excel',
      'fixed deposit maturity calculator',
      'senior citizen fd interest rates',
      'fd calculator cumulative vs payout',
      'sbi fd calculator',
      'icici fd calculator',
      'best fd rates india',
    ],
    relatedSearchQueries: [
      'current fd interest rates',
      'fd vs savings account',
      'best fd for senior citizens',
      'fd tax implications',
      'locked in period for fd',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'table',
        question: 'Current FD interest rates in India (Indicative)',
        answer: 'SBI: 6.5% (General), 7.0% (Senior). ICICI: 6.75%, 7.25% (Senior). HDFC: 6.6%, 7.1% (Senior). Axis: 6.4%, 7.0% (Senior). RBL: 7.5% (Special rates available).',
      },
    ],
    internalLinkingTargets: [
      '/rd-calculator',
      '/simple-interest-calculator',
      '/retirement-calculator',
    ],
    contentThemes: [
      'FD interest rates comparison',
      'How FD returns are calculated',
      'FD vs mutual funds returns',
      'Tax on FD interest',
      'Senior citizen FD benefits',
    ],
    targetSearchVolume: 'medium',
  },

  'gst-calculator': {
    id: 'gst',
    title: 'GST Calculator',
    metaTitle: 'GST Calculator India - Add/Remove Tax 5% 12% 18% 28% | calculox',
    metaDescription: 'Free GST calculator for Indian businesses. Calculate tax amount, CGST/SGST/IGST breakdown at all rates (5%, 12%, 18%, 28%). Add or remove GST instantly.',
    keywords: [
      'gst calculator',
      'gst calculator india',
      'calculate gst',
      'goods and services tax calculator',
      'igst calculator',
      'sgst calculator',
      'cgst calculator',
      'gst rate calculator',
    ],
    longTailKeywords: [
      'how to calculate gst',
      'gst calculator 18 percent',
      'gst inclusive vs exclusive',
      'gst amount from selling price',
      'gst breakdown calculator',
      'gst invoice calculator',
      'igst calculator online',
      'gst paid vs collected',
    ],
    relatedSearchQueries: [
      'current gst rates india',
      'gst registration requirements',
      'gst payment due dates',
      'gst return filing',
      'gst exempted items',
    ],
    featuredSnippetOpportunities: [
      {
        type: 'list',
        question: 'GST rates in India',
        answer: '5% GST: Basic food items, vaccines. 12% GST: Some medicines, seeds, spices. 18% GST: Most products (clothes, electronics, furniture). 28% GST: Luxury items (premium liquor, cars, jewelry). Some items: 0% (exports, healthcare).',
      },
    ],
    internalLinkingTargets: [
      '/percentage-calculator',
      '/profit-margin-calculator',
    ],
    contentThemes: [
      'Understanding GST rates',
      'How to calculate GST correctly',
      'CGST, SGST, and IGST explained',
      'Input tax credit basics',
      'GST compliance for small businesses',
    ],
    targetSearchVolume: 'medium',
  },
};

export function getSEOConfig(calculatorId: string): SEOConfig | undefined {
  return seoConfig[calculatorId];
}

export function getHighValueKeywords(): { [key: string]: string[] } {
  const highValue: { [key: string]: string[] } = {};
  Object.entries(seoConfig).forEach(([id, config]) => {
    if (config.targetSearchVolume === 'high') {
      highValue[id] = config.keywords;
    }
  });
  return highValue;
}
