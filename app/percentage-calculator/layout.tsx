import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { CalcPageWrapper } from '@/components/layout/CalcPageWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Percentage Calculator India - Calculate Discount, Markup & Change | calculox',
  description: 'Free 6-in-1 percentage calculator tool. Calculate percentage of, discount, markup, percentage change, reverse %, sequential %. Instant results for all calculations.',
  keywords: [
    'percentage calculator',
    'percentage of calculator',
    'discount calculator',
    'percentage change calculator',
    'markup calculator',
    'percentage off calculator',
    'reverse percentage calculator',
    'percentage increase calculator',
    'percentage decrease calculator',
    'compound percentage calculator',
  ],
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
  { question: 'How do I calculate X% of Y?', answer: 'Formula: (X/100) × Y. For example, 20% of 500 = (20/100) × 500 = 100.' },
  { question: 'How do I calculate percentage change?', answer: 'Formula: ((New Value - Old Value) / Old Value) × 100. For example, from 50 to 75: ((75-50)/50) × 100 = 50% increase.' },
  { question: 'What is reverse percentage calculation?', answer: 'If you know the final amount and the percentage applied, find the original amount. Formula: (Final Amount × 100) / Percentage.' },
  { question: 'How do I calculate discount?', answer: 'Discount amount = (Discount % / 100) × Original Price. Final Price = Original Price - Discount Amount.' },
  { question: 'What is markup vs margin?', answer: 'Markup: (Profit / Cost Price) × 100. Margin: (Profit / Selling Price) × 100. They measure profit differently - markup on cost, margin on revenue.' },
];

export default function PercentageCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Percentage Calculator',
    description: 'Free Percentage Calculator with 6 tools for percentage calculations, discount, markup and percentage change.',
    slug: 'percentage-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Percentage Calculator', href: '/percentage-calculator' }]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Percentages",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Choose Calculation Type",
        "text": "Select which percentage calculation you need: hike/discount, X% of Y, percentage change, reverse %, or sequential percentages"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Required Values",
        "text": "Fill in the values based on your chosen calculation (original amount, percentage, new value, etc.)"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Get Instant Results",
        "text": "See calculated percentage value, percentage breakdown in pie chart, and natural language explanation"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Switch Calculation Types",
        "text": "Use the quick-access buttons to switch between different percentage calculation methods"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Export Results",
        "text": "Copy results to clipboard or download as PDF with input data for records"
      }
    ]
  };

  return (
    <>
      <Script id="schema-percentage-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-percentage-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-percentage-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-percentage-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Utility">
        {children}
      </CalcPageWrapper>
    </>
  );
}

