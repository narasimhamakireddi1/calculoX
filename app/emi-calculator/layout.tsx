import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'EMI Calculator India 2026 - Home, Car & Personal Loan | calculox',
  description: 'Free EMI calculator for home loan, car loan, personal loan & vehicle loan. Calculate monthly EMI, total interest, and get detailed amortization schedule instantly. No registration needed.',
  keywords: [
    'emi calculator',
    'loan emi calculator',
    'home loan emi calculator',
    'car loan calculator',
    'personal loan emi',
    'emi calculator india',
    'vehicle loan emi',
    'monthly emi calculator',
    'emi formula calculator',
    'bank loan emi',
  ],
  alternates: { canonical: `${BASE_URL}/emi-calculator` },
  openGraph: {
    title: 'EMI Calculator - Calculate Loan EMI Instantly Free | calculox',
    description: 'Free EMI Calculator for home, car & personal loans. Calculate monthly EMI, total interest & amortization schedule instantly.',
    url: `${BASE_URL}/emi-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EMI Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMI Calculator - Calculate Loan EMI Instantly Free | calculox',
    description: 'Free EMI Calculator: Calculate monthly EMI, total interest & amortization schedule instantly.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is EMI and how is it calculated?', answer: 'EMI (Equated Monthly Instalment) is a fixed payment made by a borrower to a lender each month. It is calculated using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is principal, R is monthly interest rate, and N is number of months.' },
  { question: 'How can I reduce my loan EMI?', answer: 'You can reduce your EMI by: 1) Choosing a longer loan tenure, 2) Making a larger down payment, 3) Negotiating a lower interest rate, or 4) Making part-prepayments during the loan tenure.' },
  { question: 'What is the difference between flat rate and reducing balance EMI?', answer: 'In flat rate EMI, interest is calculated on the full principal throughout the tenure. In reducing balance (used by most banks), interest is calculated on the outstanding principal, making it cheaper.' },
  { question: 'Does EMI change during the loan tenure?', answer: 'For fixed-rate loans, EMI stays constant. For floating-rate loans, EMI can change when the bank revises its base rate (MCLR/Repo Rate linked). Banks either adjust the EMI amount or the tenure.' },
  { question: 'What happens if I miss an EMI payment?', answer: 'Missing an EMI payment attracts a late payment penalty (usually 1-2% per month on the overdue amount), negatively impacts your CIBIL score, and can eventually lead to legal action by the lender.' },
];

export default function EMILayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'EMI Calculator',
    description: 'Free online EMI Calculator for home loan, car loan and personal loan. Calculate monthly EMI and amortization schedule.',
    slug: 'emi-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'EMI Calculator', href: '/emi-calculator' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Loan EMI",
    "description": "Step-by-step guide to calculate your monthly loan EMI using our advanced calculator",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Loan Amount",
        "text": "Enter the principal amount you want to borrow (home loan, car loan, or personal loan)"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Annual Interest Rate",
        "text": "Enter the annual interest rate offered by your bank or lender (typically 7-12% for loans)"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Enter Loan Tenure",
        "text": "Enter the loan tenure in years (typically 5-20 years for home loans, 1-7 years for personal loans)"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "View Results",
        "text": "Get instant results: monthly EMI amount, total interest payable, and complete amortization schedule"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Download Report",
        "text": "Export the EMI schedule as PDF or copy results to share with financial advisors"
      }
    ]
  };

  return (
    <>
      <Script id="schema-emi-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-emi-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-emi-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-emi-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}

