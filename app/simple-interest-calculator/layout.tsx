import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { CalcPageWrapper } from '@/components/layout/CalcPageWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Simple Interest Calculator India - Calculate SI Loans & Deposits | calculox',
  description: 'Free simple interest calculator with year, month, day precision. Calculate interest on loans, deposits, bonds. SI formula with instant results. Accurate for all tenures.',
  keywords: [
    'simple interest calculator',
    'si calculator',
    'simple interest formula calculator',
    'interest calculator',
    'loan interest calculator',
    'simple interest on deposits',
    'bond interest calculator',
    'monthly interest calculator',
    'yearly interest calculator',
    'daily interest calculator',
  ],
  alternates: { canonical: `${BASE_URL}/simple-interest-calculator` },
  openGraph: {
    title: 'Simple Interest Calculator - Calculate SI | calculox',
    description: 'Free Simple Interest Calculator: Calculate SI for any tenure (years, months, days) instantly.',
    url: `${BASE_URL}/simple-interest-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Simple Interest Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simple Interest Calculator - Calculate SI | calculox',
    description: 'Free Simple Interest Calculator: Calculate simple interest & maturity amount easily.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is Simple Interest and the formula?', answer: 'Simple Interest is calculated only on the principal amount, not on accumulated interest. Formula: SI = (P × R × T) / 100, where P is principal, R is annual rate (%), and T is time (years).' },
  { question: 'How is Simple Interest different from Compound Interest?', answer: 'Simple Interest is calculated only on principal. Compound Interest is calculated on principal + accumulated interest. Compound Interest yields higher returns over longer periods.' },
  { question: 'Can I calculate SI for months or days?', answer: 'Yes. For months: SI = (P × R × M) / 1200. For days: SI = (P × R × D) / 36500 (for 365-day year). This calculator supports all three.' },
  { question: 'Who uses Simple Interest?', answer: 'Simple Interest is used for short-term loans (personal loans, overdrafts), bonds, short-term deposits, and some traditional savings schemes.' },
  { question: 'How do I calculate the principal if I know SI and rate?', answer: 'Rearranging the formula: P = (SI × 100) / (R × T). For example, if SI is ₹5,000 at 10% for 2 years, then P = (5,000 × 100) / (10 × 2) = ₹25,000.' },
];

export default function SimpleInterestCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Simple Interest Calculator',
    description: 'Free Simple Interest Calculator to calculate SI for principal, rates and tenure in years, months or days.',
    slug: 'simple-interest-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Simple Interest Calculator', href: '/simple-interest-calculator' }]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Simple Interest",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Principal Amount",
        "text": "Enter the amount you want to borrow or invest (loan amount or savings amount)"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Annual Interest Rate",
        "text": "Enter the annual interest rate (percentage per annum) offered by the lender or bank"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Select Time Period",
        "text": "Choose whether to calculate for years, months, or days, and enter the duration"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Get Results",
        "text": "View calculated simple interest amount, total amount due, and daily accrual breakdown"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Compare with Compound",
        "text": "Compare simple interest results with compound interest to understand the difference"
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Finance">
        {children}
      </CalcPageWrapper>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Simple Interest vs Compound Interest — Formula and Examples</h2>
        <p className="mb-4">
          Simple Interest (SI) is calculated only on the original principal amount throughout the entire loan or investment tenure. The interest does not compound — it does not earn further interest on itself. SI is used in short-term personal loans, overdraft facilities, government bonds, post-office savings schemes, and some traditional deposit products. It is transparent and easy to verify, which is why regulatory bodies often mandate SI disclosure alongside compound interest figures.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Simple Interest Formula</h3>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          SI = (P × R × T) ÷ 100
        </p>
        <p className="mb-4">
          Where <strong>P</strong> is the principal amount, <strong>R</strong> is the annual interest rate (%), and <strong>T</strong> is the time in years. For months: T = M ÷ 12. For days: T = D ÷ 365 (or 366 for leap years). Total amount at maturity = P + SI.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Worked Example</h3>
        <p className="mb-4">
          You take a personal loan of ₹1,50,000 at 9% per annum for 2 years and 6 months (2.5 years):
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>SI = (1,50,000 × 9 × 2.5) ÷ 100 = <strong>₹33,750</strong></li>
          <li>Total repayment = ₹1,50,000 + ₹33,750 = <strong>₹1,83,750</strong></li>
          <li>Monthly payment = ₹1,83,750 ÷ 30 months = ₹6,125/month</li>
        </ul>
        <p>
          Had this been compound interest (compounded monthly), the total interest on the same loan would be ₹36,211 — about ₹2,461 more. The difference grows larger with longer tenures, which is why banks typically use compound interest for home loans but simple interest for certain overdraft products.
        </p>
      </section>
    </>
  );
}

