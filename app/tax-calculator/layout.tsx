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
  title: 'Income Tax Calculator India FY 2025-26 - Calculate Tax & Save | calculox',
  description: 'Advanced income tax calculator for FY 2025-26. Calculate tax on salary with new/old tax regime, HRA, LTA, 80C deductions, and get instant tax liability. RBI-compliant.',
  keywords: [
    'income tax calculator',
    'income tax calculator india',
    'tax calculator 2025-26',
    'salary tax calculator',
    'income tax calculator with hra',
    'tax slab calculator',
    'tax deduction calculator',
    'income tax new regime',
    'tax liability calculator',
    'income tax comparison',
  ],
  alternates: { canonical: `${BASE_URL}/tax-calculator` },
  openGraph: {
    title: 'Income Tax Calculator FY 2024-25 - New vs Old Regime | calculox',
    description: 'Free Income Tax Calculator India FY 2024-25. Compare New vs Old regime, calculate exact tax with deductions. Updated for Budget 2024.',
    url: `${BASE_URL}/tax-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Income Tax Calculator India - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Tax Calculator FY 2024-25 - New vs Old Regime | calculox',
    description: 'Free Income Tax Calculator India: Compare New vs Old regime & calculate exact tax liability.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'Which tax regime is better - New or Old for FY 2024-25?', answer: 'The New Tax Regime is generally better for those with fewer deductions. If your total deductions (80C + HRA + others) exceed ₹3.75 lakh, the Old Regime may save more tax. Use our calculator to compare both regimes with your specific income and deductions.' },
  { question: 'What are the tax slabs under the New Tax Regime 2024-25?', answer: 'New Tax Regime slabs (FY 2024-25): 0% up to ₹3 lakh, 5% for ₹3-7 lakh, 10% for ₹7-10 lakh, 15% for ₹10-12 lakh, 20% for ₹12-15 lakh, and 30% above ₹15 lakh. There is also a standard deduction of ₹75,000 for salaried employees.' },
  { question: 'What deductions are available under the Old Tax Regime?', answer: 'Major deductions under Old Regime: Section 80C (₹1.5 lakh - PPF, ELSS, LIC), Section 80D (health insurance ₹25,000-₹50,000), HRA exemption, standard deduction (₹50,000), home loan interest (₹2 lakh), Section 80CCD(1B) NPS (₹50,000).' },
  { question: 'Is income up to ₹7 lakh tax-free under the New Regime?', answer: 'Yes, under the New Tax Regime, income up to ₹7 lakh is effectively tax-free due to the Section 87A rebate of ₹25,000. For salaried employees, with the ₹75,000 standard deduction, income up to ₹7.75 lakh is tax-free.' },
  { question: 'When is the last date to file income tax return (ITR)?', answer: 'The last date for filing ITR for FY 2024-25 (AY 2025-26) is typically July 31, 2025 for salaried individuals and October 31, 2025 for businesses requiring audit. Late filing attracts a penalty of ₹5,000 (₹1,000 for income below ₹5 lakh).' },
];

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Income Tax Calculator India FY 2024-25',
    description: 'Free online Income Tax Calculator for India FY 2024-25. Compare New vs Old tax regime with deductions.',
    slug: 'tax-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Tax Calculator', href: '/tax-calculator' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Income Tax in India",
    "totalTime": "PT3M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Your Annual Income",
        "text": "Enter your gross annual income from salary, business, investments, and other sources for FY 2025-26"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Add Applicable Deductions",
        "text": "Add deductions like Section 80C (PPF, ELSS, Insurance), HRA exemption, Section 80D (health insurance), Section 80CCD (NPS)"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Choose Tax Regime",
        "text": "Select between New Tax Regime (simpler, fewer deductions) or Old Regime (more deductions, higher threshold)"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "View Calculated Tax",
        "text": "Get your exact income tax liability, applicable slabs, surcharge, health & education cess breakdown"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Compare Regimes",
        "text": "See side-by-side comparison of New vs Old regime tax amounts to choose the more beneficial one"
      }
    ]
  };

  return (
    <>
      <Script id="schema-tax-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-tax-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-tax-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-tax-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Finance">
        {children}
      </CalcPageWrapper>
    </>
  );
}

