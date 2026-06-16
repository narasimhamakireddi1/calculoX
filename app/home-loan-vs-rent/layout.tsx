import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';
import { CalcPageWrapper } from '@/components/layout/CalcPageWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Buy vs Rent Calculator India - Compare Home Loan vs Renting | calculox',
  description: 'Smart buy vs rent calculator comparing home ownership vs renting with 20-year projections. Includes break-even point, tax benefits (24b), and opportunity cost analysis.',
  keywords: [
    'buy vs rent calculator',
    'home loan vs rent',
    'should i buy or rent',
    'home affordability calculator',
    'property investment calculator',
    'buy vs rent analysis',
    'home ownership cost calculator',
    'rent vs buy india',
    'EMI vs rent comparison',
    'break-even analysis home',
    'Section 24(b) tax calculator',
    'rent vs buy net worth',
  ],
  alternates: { canonical: `${BASE_URL}/home-loan-vs-rent` },
  openGraph: {
    title: 'Buy vs Rent Calculator - Opportunity Cost Framework | calculox',
    description: 'Compare buying vs renting with parallel financial tracks. Calculate buyer net worth vs renter portfolio, break-even year, and tax benefits.',
    url: `${BASE_URL}/home-loan-vs-rent`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Buy vs Rent Opportunity Cost Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy vs Rent Calculator - Opportunity Cost Framework | calculox',
    description: 'Compare buying vs renting with parallel financial tracks. Calculate buyer net worth vs renter portfolio, break-even year, and tax benefits.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'What is the opportunity cost framework?',
    answer: 'The opportunity cost framework compares two parallel financial tracks over 20 years: (1) Buyer: Invests down payment, pays EMI + maintenance, property appreciates; (2) Renter: Invests down payment + EMI difference into equity/mutual funds (12% annual return). The calculator shows which track yields higher net worth. This approach reveals that renting can beat buying when investment returns exceed property appreciation + tax benefits.',
  },
  {
    question: 'Why does the renter invest the down payment?',
    answer: 'The down payment represents capital the buyer locks into the property. A renter with the same capital would invest it in diversified assets (SIP/FD/mutual funds). Additionally, the renter invests the EMI difference each month (since rent is often lower than EMI). Over 20 years, compound growth in these investments can exceed property appreciation. This realistic comparison levels the playing field between buying and renting.',
  },
  {
    question: 'When does renting beat buying mathematically?',
    answer: 'Renting wins when: (1) Property appreciation < 6% p.a. (below market growth), (2) EMI > Monthly Rent by large margin (>₹10K difference), (3) Comparison period is long (15-20 years, giving compound growth time), (4) Investment returns are high (10%+ p.a. in equities), (5) Rent increase is low (<5% p.a.). In expensive cities like Mumbai/Delhi, renting often wins by ₹50L-₹1Cr over 20 years.',
  },
  {
    question: 'What is Section 24(b) and how does it help buyers?',
    answer: 'Section 24(b) allows home loan interest deduction up to ₹2,00,000 per year on self-occupied properties under the Income Tax Act. If your income tax rate is 20%, a ₹2L deduction saves ₹40,000 annually (₹8L saved over 20 years). This calculator includes this benefit—buyers with higher tax brackets (30-40%) gain ₹6-8L extra advantage. Toggle "Apply Tax Benefit" and adjust your tax bracket to see the impact.',
  },
  {
    question: 'How accurate is this 20-year projection?',
    answer: 'The calculator is highly accurate for: (1) EMI calculations (uses standard reducing-balance formula), (2) Property appreciation projections (assumes constant % growth yearly), (3) Rent escalation (compounds monthly), (4) Investment returns (monthly compounding). It assumes: constant interest rates, no prepayment, inflation-adjusted expenses, and doesn\'t include selling costs, property taxes, or insurance (you can estimate these separately). Best used for decision-making, not absolute forecasting.',
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
    "name": "How to Use Buy vs Rent Opportunity Cost Calculator",
    "totalTime": "PT4M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Tab 1 - Property Details",
        "text": "Enter (1) Property Value (₹10L-₹10Cr range, e.g., ₹80L for an average Indian home), (2) Down Payment % (5-100%, typically 20-30%). The calculator shows down payment amount in rupees. This capital would otherwise be invested by the renter."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Tab 2 - Loan & Rent Details",
        "text": "Enter (1) Home Loan Interest Rate (current 7-9.5% depending on bank), (2) Loan Tenure (15-20 years typical), (3) Monthly Rent (current rent you'd pay if renting), (4) Annual Rent Increase (5-7% typical in Indian cities). Calculator computes monthly EMI automatically."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Tab 3 - Assumptions & Tax Benefits",
        "text": "Enter (1) Property Appreciation Rate (5-7% typical), (2) Opportunity Investment Return (8-12% for equities/mutual funds), (3) Inflation Rate (5-6% typical), (4) Comparison Timeline (5-20 years), (5) Toggle Section 24(b) Tax Benefit and set your Income Tax Bracket (10-45%)."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Review Hero Metrics",
        "text": "See three key cards: (1) Monthly EMI (your buyer monthly cost), (2) Break-Even Year (when buyer net worth exceeds renter net worth, if ever), (3) Net Advantage (which option wins and by how much in rupees and %)."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Analyze Charts",
        "text": "View dual-track comparison: (1) Net Worth Chart (buyer net worth vs renter investment portfolio growth over 20 years, with break-even line marked), (2) Cumulative Cost Chart (total buyer outflow vs renter rent paid), (3) Year-by-year projection table showing all metrics."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Review Winner Banner",
        "text": "See clear verdict: which option (buying or renting) wins financially, by how much (absolute rupees), and percentage advantage. This accounts for property appreciation, investment returns, rent escalation, EMI, maintenance, and Section 24(b) tax benefits."
      },
      {
        "@type": "HowToStep",
        "position": 7,
        "name": "Export and Share Results",
        "text": "Export as PDF with all inputs and results, or copy to clipboard. Share with spouse, financial advisor, or real estate agent to support your buy-vs-rent decision."
      }
    ]
  };

  return (
    <>
      <Script id="schema-home-vs-rent-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-home-vs-rent-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-home-vs-rent-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-home-vs-rent-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Finance">
        {children}
      </CalcPageWrapper>
    </>
  );
}
