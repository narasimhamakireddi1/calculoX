import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'RD Calculator - Recurring Deposit Calculator India Free',
  description: 'Free Recurring Deposit Calculator for RD interest calculation. Calculate maturity amount, total interest & monthly deposits. Plan your RD investments instantly.',
  keywords: ['RD calculator', 'recurring deposit calculator', 'RD calculator India', 'bank RD calculator', 'RD maturity calculator', 'RD interest calculator'],
  alternates: { canonical: `${BASE_URL}/rd-calculator` },
  openGraph: {
    title: 'RD Calculator - Recurring Deposit Calculator | CalculoX',
    description: 'Free RD Calculator: Calculate maturity amount & interest for recurring deposits instantly.',
    url: `${BASE_URL}/rd-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'RD Calculator - CalculoX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RD Calculator - Recurring Deposit Calculator | CalculoX',
    description: 'Free RD Calculator: Calculate RD maturity amount & interest easily.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is a Recurring Deposit (RD)?', answer: 'An RD is a deposit scheme where you invest a fixed amount monthly for a predetermined period. It is ideal for investors who want to save regularly with guaranteed returns.' },
  { question: 'How is RD interest calculated?', answer: 'RD interest is calculated using the formula: A = P × [((1+r)^n - 1) / (1 - (1+r)^-1)], where P is monthly deposit, r is monthly interest rate, and n is number of months.' },
  { question: 'What is the difference between RD and FD?', answer: 'FD requires a lump sum investment, while RD allows monthly deposits. RD is ideal for regular savers, while FD suits those with available capital.' },
  { question: 'Can I withdraw from RD before maturity?', answer: 'Yes, premature withdrawal is allowed after 6 months, but with interest penalty of 0.5% to 1% lower than the contracted rate.' },
  { question: 'What are the typical RD tenure options?', answer: 'Banks typically offer RD tenures ranging from 6 months to 10 years, in multiples of 3 or 6 months.' },
];

export default function RDCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'RD Calculator',
    description: 'Free RD Calculator for recurring deposit interest calculation and maturity amount projection.',
    slug: 'rd-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'RD Calculator', href: '/rd-calculator' }]);

  return (
    <>
      <Script id="schema-rd-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-rd-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-rd-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
