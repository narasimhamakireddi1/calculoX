import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Home Loan vs Rent Calculator India - Buy vs Rent Decision Tool | calculox',
  description: 'Compare home loan vs rent with our calculator. Calculate EMI, total cost, break-even point, and property appreciation. Make informed buy vs rent decisions.',
  keywords: [
    'home loan vs rent calculator',
    'buy vs rent calculator',
    'home loan calculator',
    'rent vs buy',
    'property investment calculator',
    'EMI calculator home',
    'break-even calculator home',
    'rent calculator India',
    'home affordability calculator',
  ],
  alternates: { canonical: `${BASE_URL}/home-loan-vs-rent` },
  openGraph: {
    title: 'Home Loan vs Rent Calculator - Make Better Housing Decisions | calculox',
    description: 'Compare buying vs renting: Calculate EMI, total costs, break-even point, and find the best option for your financial situation.',
    url: `${BASE_URL}/home-loan-vs-rent`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Home Loan vs Rent Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Loan vs Rent Calculator - Buy vs Rent Decision Tool | calculox',
    description: 'Compare buying vs renting: Calculate EMI, total costs, and find your break-even point for informed housing decisions.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'When is it better to buy than to rent?',
    answer: 'It\'s generally better to buy when: 1) You plan to stay in the property for 5+ years (to justify transaction costs), 2) Property prices are appreciating in your area, 3) Your EMI is comparable to or less than rent, 4) You have the financial capacity for down payment and EMI, 5) Interest rates are reasonable. This calculator helps you find your break-even point.',
  },
  {
    question: 'What is EMI and how is it calculated?',
    answer: 'EMI (Equated Monthly Installment) is the fixed monthly payment you make on your home loan. Formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P = Principal, R = Monthly Interest Rate, N = Number of Months. For example, a ₹40 lakh loan at 8.5% interest for 20 years = ₹38,800 monthly EMI.',
  },
  {
    question: 'What factors affect the break-even point?',
    answer: 'Break-even point depends on: 1) EMI vs monthly rent ratio (lower EMI = earlier break-even), 2) Property appreciation rate (higher appreciation = earlier break-even), 3) Rent increase rate (higher rent increase = earlier break-even), 4) Interest rates (lower rates = earlier break-even), 5) Down payment percentage (higher down payment = earlier break-even).',
  },
  {
    question: 'Should I consider maintenance and property taxes?',
    answer: 'Yes, the calculator doesn\'t include these. Typical costs: 1) Maintenance = 1-2% of property value annually (₹50L property = ₹50K-1L/year), 2) Property tax = 5-10% of rental value (varies by municipality), 3) Insurance = 0.5-1% of property value, 4) HOA fees = ₹2K-10K/month (if applicable). These reduce buying advantage by 10-20%.',
  },
  {
    question: 'What if I sell the property before the loan ends?',
    answer: 'If you sell before 5 years, subtract: 1) Selling costs (5-8% brokerage + stamp duty = 8-12% total), 2) Prepayment charges (0.5-1% of outstanding principal), 3) Capital gains tax (if applicable). For properties held 2-5 years, total selling costs typically exceed rent savings, so renting might be cheaper.',
  },
];

export default function HomeLoanVsRentLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Home Loan vs Rent Calculator',
    description: 'Free calculator to compare buying vs renting. Calculate EMI, total costs, break-even point, and property appreciation for informed housing decisions.',
    slug: 'home-loan-vs-rent',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Home Loan vs Rent', href: '/home-loan-vs-rent' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use Home Loan vs Rent Calculator",
    "totalTime": "PT3M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Home Price",
        "text": "Enter the property price you're considering (e.g., ₹50 lakhs, ₹1 crore). This is the total cost of the home."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Set Down Payment",
        "text": "Enter the down payment amount (typically 20-30% of home price, e.g., ₹10 lakhs for ₹50L property)."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Set Loan Details",
        "text": "Enter loan tenure (15-20 years typical) and interest rate (currently 7-9.5% in India depending on bank and credit score)."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Enter Rent Details",
        "text": "Enter your current monthly rent and expected annual rent increase rate (5-7% typical in Indian cities)."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Set Assumptions",
        "text": "Enter property appreciation rate (5-7% typical), investment return for down payment savings (8-10%), and comparison period (5-20 years)."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Review Comparison",
        "text": "See monthly EMI, total interest, total rent, cost comparison chart, break-even point, and which option wins financially."
      },
      {
        "@type": "HowToStep",
        "position": 7,
        "name": "Export and Share",
        "text": "Export results as PDF or copy to clipboard to share with family, financial advisor, or real estate agent."
      }
    ]
  };

  return (
    <>
      <Script id="schema-home-vs-rent-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-home-vs-rent-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-home-vs-rent-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-home-vs-rent-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}
