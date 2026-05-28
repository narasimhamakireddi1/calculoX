import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'SIP Calculator - Calculate Monthly SIP Returns Free',
  description: 'Free SIP Calculator online. Calculate Systematic Investment Plan returns, future value & total wealth. Enter monthly investment, years & return rate. Instant accurate results for Indian investors.',
  keywords: [
    'SIP calculator', 'SIP calculator online', 'systematic investment plan calculator',
    'SIP return calculator', 'monthly SIP calculator', 'SIP calculator India',
    'mutual fund SIP calculator', 'SIP maturity calculator', 'SIP future value',
    'best SIP calculator', 'SIP investment calculator', 'SIP growth calculator',
  ],
  alternates: { canonical: `${BASE_URL}/sip-calculator` },
  openGraph: {
    title: 'SIP Calculator - Calculate Monthly SIP Returns Free | calculox',
    description: 'Free SIP Calculator: Calculate Systematic Investment Plan returns, future value & wealth growth instantly. Best SIP calculator for Indian investors.',
    url: `${BASE_URL}/sip-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SIP Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIP Calculator - Calculate Monthly SIP Returns Free | calculox',
    description: 'Free SIP Calculator: Calculate SIP returns, future value & wealth growth instantly.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is SIP and how does it work?', answer: 'SIP (Systematic Investment Plan) is a method of investing a fixed amount in mutual funds at regular intervals (monthly/quarterly). It uses rupee-cost averaging to reduce the impact of market volatility on your investments.' },
  { question: 'How is SIP return calculated?', answer: 'SIP returns are calculated using the formula: FV = PMT Ã— (((1 + r)^n - 1) / r) Ã— (1 + r), where PMT is monthly investment, r is monthly return rate, and n is total months.' },
  { question: 'What is a good SIP return rate to expect?', answer: 'Historically, equity mutual funds in India have delivered 12-15% annual returns over long periods. For conservative estimates, use 10-12% for long-term SIP calculations.' },
  { question: 'What is the minimum SIP amount?', answer: 'Most mutual funds in India allow SIP with a minimum of â‚¹100-500 per month. Our SIP calculator allows you to start calculations from â‚¹100.' },
  { question: 'What is Step-Up SIP?', answer: 'Step-Up SIP is when you increase your monthly SIP amount by a fixed percentage each year (e.g., 10% annually). This is recommended to match your income growth and build wealth faster.' },
];

export default function SIPLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'SIP Calculator',
    description: 'Free online SIP Calculator to calculate Systematic Investment Plan returns for Indian investors.',
    slug: 'sip-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'SIP Calculator', href: '/sip-calculator' },
  ]);

  return (
    <>
      <Script id="schema-sip-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-sip-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-sip-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}

