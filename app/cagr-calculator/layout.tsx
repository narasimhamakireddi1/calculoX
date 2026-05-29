import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'CAGR Calculator India 2026 - Compound Annual Growth Rate | calculox',
  description: 'Advanced CAGR Calculator for investment analysis. Calculate compound annual growth rate for stocks, mutual funds, real estate. Compare investment returns accurately.',
  keywords: ['CAGR calculator', 'compound annual growth rate calculator', 'CAGR formula', 'investment growth calculator', 'mutual fund returns calculator'],
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
      <Script id="schema-cagr-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-cagr-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-cagr-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-cagr-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}

