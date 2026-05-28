import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Simple Interest Calculator - Calculate SI Instantly India Free',
  description: 'Free Simple Interest Calculator to calculate simple interest instantly. Calculate SI for years, months & days tenure. Find principal, interest rate & total amount easily.',
  keywords: ['simple interest calculator', 'SI calculator', 'simple interest formula calculator', 'interest calculator', 'loan interest calculator'],
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

  return (
    <>
      <Script id="schema-si-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-si-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-si-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}

