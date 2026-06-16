import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { CalcPageWrapper } from '@/components/layout/CalcPageWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'CAGR Calculator India - Compound Annual Growth Rate | calculox',
  description: 'Free CAGR calculator to calculate compound annual growth rate of investments. Compare stock, mutual fund, real estate returns. Includes year-by-year projections.',
  keywords: [
    'cagr calculator',
    'compound annual growth rate calculator',
    'cagr formula',
    'investment growth calculator',
    'mutual fund cagr calculator',
    'cagr calculation',
    'annual growth rate calculator',
    'investment return calculator',
    'stock return calculator',
    'real estate return calculator',
  ],
  alternates: { canonical: `${BASE_URL}/cagr-calculator` },
  openGraph: {
    title: 'CAGR Calculator - Calculate Compound Annual Growth Rate | calculox',
    description: 'Free CAGR Calculator: Calculate compound annual growth rate & investment returns instantly.',
    url: `${BASE_URL}/cagr-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CAGR Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAGR Calculator - Calculate CAGR | calculox',
    description: 'Free CAGR Calculator to calculate compound annual growth rate for investments.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is CAGR and why is it important?', answer: 'CAGR (Compound Annual Growth Rate) is the mean annual growth rate of an investment over a period longer than one year. It shows the smoothed annual return, accounting for compounding effects. It\'s crucial for comparing investments.' },
  { question: 'What is the CAGR formula?', answer: 'CAGR = (Ending Value / Beginning Value)^(1/Number of Years) - 1. For example, if you invested ₹1,00,000 that grew to ₹2,00,000 in 5 years, CAGR = (2,00,000/1,00,000)^(1/5) - 1 = 14.87%.' },
  { question: 'How is CAGR different from average annual return?', answer: 'Average return is simple arithmetic mean, while CAGR accounts for compounding. CAGR is more accurate for multi-year investments as it shows the consistent growth rate.' },
  { question: 'Can CAGR be negative?', answer: 'Yes, if the ending value is less than the beginning value, CAGR will be negative, indicating investment loss over the period.' },
  { question: 'What investments can I use CAGR for?', answer: 'CAGR applies to any investment: stocks, mutual funds, real estate, bonds, savings, FDs, gold, etc. It\'s universally used to compare investment performance across time periods.' },
];

export default function CAGRCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'CAGR Calculator',
    description: 'Free CAGR Calculator to calculate compound annual growth rate for investments and financial returns.',
    slug: 'cagr-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'CAGR Calculator', href: '/cagr-calculator' }]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate CAGR (Compound Annual Growth Rate)",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Beginning Value",
        "text": "Enter the initial investment amount (starting value of your investment)"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Ending Value",
        "text": "Enter the final value of your investment after the investment period"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Enter Number of Years",
        "text": "Specify the duration of investment in years (can be decimal for months/days)"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Get CAGR Result",
        "text": "View calculated CAGR percentage, year-over-year growth breakdown, and investment growth chart"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Compare Investments",
        "text": "Use CAGR to compare returns across different investments and time periods fairly"
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Is CAGR and How to Calculate It</h2>
        <p className="mb-4">
          Compound Annual Growth Rate (CAGR) is the rate at which an investment would have grown if it grew at a steady rate each year. It is the most widely used metric to compare investments across different time horizons because it smooths out year-to-year volatility and reflects the effect of compounding. SEBI mandates that mutual fund performance data in India be disclosed using CAGR for periods of one year and above.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">CAGR Formula</h3>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          CAGR = (Ending Value ÷ Beginning Value)^(1 ÷ Number of Years) − 1
        </p>
        <p className="mb-4">
          The result is expressed as a percentage. A negative CAGR means the investment lost value over the period. CAGR differs from simple average return: if an investment gains 100% one year and loses 50% the next, the simple average is 25%, but the actual return is 0% (back to start) — which CAGR correctly captures.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Worked Example</h3>
        <p className="mb-4">
          You invested ₹1,00,000 in a mutual fund in 2017. In 2024 (7 years later), the value is ₹2,50,000.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>CAGR = (2,50,000 ÷ 1,00,000)^(1 ÷ 7) − 1</li>
          <li>= (2.5)^(0.1429) − 1</li>
          <li>= 1.1401 − 1 = <strong>14.01% per year</strong></li>
        </ul>
        <p>
          This 14% CAGR means your investment would have had to grow at exactly 14% every single year to produce the same ending value. Use CAGR to compare a mutual fund delivering 14% CAGR over 7 years against a bank FD that offered 7% per year — the fund outperformed by 7 percentage points annually on a compounded basis.
        </p>
      </section>
    </>
  );
}

