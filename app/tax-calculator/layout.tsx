import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2024-25 - New vs Old Regime India',
  description: 'Free Income Tax Calculator for India FY 2024-25. Compare New vs Old tax regime, calculate exact tax liability with deductions & exemptions for salaried & business income. Updated for Budget 2024.',
  keywords: [
    'income tax calculator', 'income tax calculator India', 'tax calculator 2024-25',
    'new tax regime calculator', 'old vs new tax regime', 'salary tax calculator India',
    'income tax India FY 2024-25', 'tax slab calculator', 'tax liability calculator',
    'IT calculator India', 'income tax comparison', 'budget 2024 tax calculator',
  ],
  alternates: { canonical: `${BASE_URL}/tax-calculator` },
  openGraph: {
    title: 'Income Tax Calculator FY 2024-25 - New vs Old Regime | CalculoX',
    description: 'Free Income Tax Calculator India FY 2024-25. Compare New vs Old regime, calculate exact tax with deductions. Updated for Budget 2024.',
    url: `${BASE_URL}/tax-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Income Tax Calculator India - CalculoX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Tax Calculator FY 2024-25 - New vs Old Regime | CalculoX',
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

  return (
    <>
      <Script id="schema-tax-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-tax-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-tax-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
