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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Finance">
        {children}
      </CalcPageWrapper>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Is an EMI and How Is It Calculated?</h2>
        <p className="mb-4">
          An Equated Monthly Instalment (EMI) is the fixed amount a borrower pays to a lender every month until the loan is fully repaid. Each payment covers both principal and interest, with the interest portion being higher in early months and the principal portion rising over time — this is called a reducing-balance schedule. EMI calculators are used for home loans, car loans, personal loans, and education loans.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">EMI Formula</h3>
        <p className="mb-4">
          The standard EMI formula used by Indian banks (per RBI guidelines) is:
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          EMI = P × R × (1 + R)^N ÷ [(1 + R)^N − 1]
        </p>
        <p className="mb-4">
          Where <strong>P</strong> is the loan principal, <strong>R</strong> is the monthly interest rate (annual rate ÷ 12 ÷ 100), and <strong>N</strong> is the loan tenure in months.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Worked Example</h3>
        <p className="mb-4">
          Suppose you take a home loan of ₹20,00,000 at an annual interest rate of 8.5% for 20 years (240 months).
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Monthly rate R = 8.5 ÷ 12 ÷ 100 = 0.007083</li>
          <li>N = 240 months</li>
          <li>EMI = 20,00,000 × 0.007083 × (1.007083)^240 ÷ [(1.007083)^240 − 1]</li>
          <li><strong>Monthly EMI = ₹17,356</strong></li>
          <li>Total amount paid = ₹41,65,440</li>
          <li>Total interest = ₹21,65,440 (the cost of borrowing)</li>
        </ul>
        <p>
          Use the calculator above to adjust the loan amount, interest rate, and tenure to find the EMI that fits your monthly budget.
        </p>
      </section>
    </>
  );
}

