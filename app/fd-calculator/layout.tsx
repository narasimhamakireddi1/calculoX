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
  title: 'FD Calculator India 2026 - Fixed Deposit Maturity & Interest | calculox',
  description: 'Advanced FD calculator for fixed deposit. Calculate maturity amount with cumulative, quarterly, monthly payouts. RBI-compliant. Senior citizen rate (+0.5%). Instant results.',
  keywords: [
    'fd calculator',
    'fixed deposit calculator',
    'fd calculator india',
    'bank deposit calculator',
    'fixed deposit interest calculator',
    'maturity calculator',
    'compound interest calculator',
    'savings calculator india',
    'fd interest calculator',
    'sbi fd calculator',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Finance">
        {children}
      </CalcPageWrapper>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Fixed Deposit Interest Is Calculated</h2>
        <p className="mb-4">
          A Fixed Deposit (FD) is a savings instrument where you deposit a lump sum with a bank for a fixed period at a guaranteed interest rate. Unlike savings accounts, the interest rate on an FD does not change during the tenure, making it predictable. Indian banks typically compound FD interest quarterly, which means interest earned in one quarter itself earns interest in the next.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">FD Compound Interest Formula</h3>
        <p className="mb-4">
          For cumulative FDs (interest reinvested), the maturity amount is:
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          A = P × (1 + r/n)^(n × t)
        </p>
        <p className="mb-4">
          Where <strong>P</strong> is the principal, <strong>r</strong> is the annual interest rate (decimal), <strong>n</strong> is the compounding frequency per year (4 for quarterly), and <strong>t</strong> is the tenure in years. For simple-interest FDs (tenure under 6 months), the formula becomes: A = P × (1 + r × t).
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Worked Example</h3>
        <p className="mb-4">
          You deposit ₹1,00,000 in a bank FD at 7% per annum for 3 years with quarterly compounding.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>P = ₹1,00,000; r = 0.07; n = 4; t = 3</li>
          <li>A = 1,00,000 × (1 + 0.07/4)^(4×3) = 1,00,000 × (1.0175)^12</li>
          <li><strong>Maturity amount = ₹1,23,144</strong></li>
          <li>Interest earned = ₹23,144 (vs ₹21,000 with simple interest)</li>
        </ul>
        <p>
          Senior citizens (age 60+) receive an additional 0.50% interest from most banks, bringing the effective rate to 7.5% in this example — yielding ₹1,25,022 at maturity.
        </p>
      </section>
    </>
  );
}

