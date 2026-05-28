import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Percentage Calculator - Calculate Percentages Instantly Free',
  description: 'Free Percentage Calculator with 6 tools: percentage change, percentage of amount, reverse percentage, discount calculator & more. Calculate percentages instantly.',
  keywords: ['percentage calculator', 'percentage of calculator', 'discount calculator', 'percentage change calculator', 'markup calculator', 'percentage off calculator'],
  alternates: { canonical: `${BASE_URL}/percentage-calculator` },
  openGraph: {
    title: 'Percentage Calculator - Calculate Any Percentage | calculox',
    description: 'Free Percentage Calculator: 6 tools to calculate discount, percentage change, reverse percentage & more instantly.',
    url: `${BASE_URL}/percentage-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Percentage Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentage Calculator - Calculate Percentages | calculox',
    description: 'Free Percentage Calculator: Calculate percentage change, discount, markup instantly.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'How do I calculate X% of Y?', answer: 'Formula: (X/100) Ã— Y. For example, 20% of 500 = (20/100) Ã— 500 = 100.' },
  { question: 'How do I calculate percentage change?', answer: 'Formula: ((New Value - Old Value) / Old Value) Ã— 100. For example, from 50 to 75: ((75-50)/50) Ã— 100 = 50% increase.' },
  { question: 'What is reverse percentage calculation?', answer: 'If you know the final amount and the percentage applied, find the original amount. Formula: (Final Amount Ã— 100) / Percentage.' },
  { question: 'How do I calculate discount?', answer: 'Discount amount = (Discount % / 100) Ã— Original Price. Final Price = Original Price - Discount Amount.' },
  { question: 'What is markup vs margin?', answer: 'Markup: (Profit / Cost Price) Ã— 100. Margin: (Profit / Selling Price) Ã— 100. They measure profit differently - markup on cost, margin on revenue.' },
];

export default function PercentageCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Percentage Calculator',
    description: 'Free Percentage Calculator with 6 tools for percentage calculations, discount, markup and percentage change.',
    slug: 'percentage-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Percentage Calculator', href: '/percentage-calculator' }]);

  return (
    <>
      <Script id="schema-percentage-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-percentage-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-percentage-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}

