import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'FD Calculator India 2026 - Fixed Deposit Interest Calculator | calculox',
  description: 'Advanced FD Calculator with RBI-compliant rates. Calculate maturity amount, interest earned, senior citizen benefits. 4 payout types supported. 100% accurate, instant results.',
  keywords: [
    'FD calculator', 'fixed deposit calculator', 'FD interest calculator India',
    'FD calculator with interest rates', 'bank FD calculator', 'senior citizen FD',
    'FD maturity calculator', 'compound interest FD', 'investment FD calculator',
  ],
  alternates: { canonical: `${BASE_URL}/fd-calculator` },
  openGraph: {
    title: 'FD Calculator - Fixed Deposit Interest Calculator | calculox',
    description: 'Free FD Calculator: Calculate maturity amount, interest earned & projections for all FD schemes instantly.',
    url: `${BASE_URL}/fd-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FD Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FD Calculator - Fixed Deposit Interest Calculator | calculox',
    description: 'Free FD Calculator: Calculate maturity amount & interest instantly for all FD schemes.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is a Fixed Deposit (FD)?', answer: 'A Fixed Deposit is a financial instrument offered by banks where you invest a lump sum for a fixed tenure at a predetermined interest rate. The money cannot be withdrawn before maturity without penalty.' },
  { question: 'How is FD interest calculated?', answer: 'FD interest is calculated using compound interest formula: A = P(1+r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time in years. Most FDs compound quarterly.' },
  { question: 'What is the difference between cumulative and non-cumulative FD?', answer: 'Cumulative FD reinvests interest to earn compound returns. Non-cumulative FD pays interest periodically (monthly/quarterly), giving regular income. Cumulative FDs offer higher maturity value.' },
  { question: 'Do senior citizens get higher FD interest rates?', answer: 'Yes, most banks offer an additional 0.50% higher interest rate on FDs for senior citizens (60+ years). Some banks offer up to 0.75% extra.' },
  { question: 'What is the penalty for premature FD withdrawal?', answer: 'Banks typically charge 0.5% to 1% lower interest rate on premature withdrawal. The exact penalty depends on the bank and how long the FD was held.' },
];

export default function FDCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'FD Calculator',
    description: 'Free online FD Calculator for fixed deposit interest calculation. Calculate maturity amount and interest for RBI-compliant FD schemes.',
    slug: 'fd-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'FD Calculator', href: '/fd-calculator' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Fixed Deposit Maturity Amount",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Principal Amount",
        "text": "Enter the amount you want to invest in the fixed deposit (minimum ₹1,000-5,000 depending on bank)"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Annual Interest Rate",
        "text": "Enter the interest rate offered by your bank (typically 6-8% per annum for most banks)"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Select Tenure",
        "text": "Choose your FD tenure in years, months, or days (minimum 7 days, maximum 10 years for most banks)"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Choose Payout Type",
        "text": "Select between cumulative (compound), quarterly, monthly, or short-term (simple interest) payout options"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Get Results",
        "text": "View maturity amount, total interest earned, and compare with other investment options"
      }
    ]
  };

  return (
    <>
      <Script id="schema-fd-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-fd-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-fd-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-fd-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}

