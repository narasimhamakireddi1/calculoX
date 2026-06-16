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
  title: 'SIP Calculator - Calculate Mutual Fund Returns India 2026 | calculox',
  description: 'Advanced SIP calculator for mutual fund investments. Calculate returns with step-up SIP, monthly investments, and 25+ year projections. RBI-compliant formulas. Free, instant results.',
  keywords: [
    'sip calculator',
    'systematic investment plan calculator',
    'mutual fund calculator',
    'sip returns calculator',
    'sip calculator india',
    'step up sip calculator',
    'monthly sip calculator',
    'investment calculator india',
    'sip formula calculator',
    'best sip calculator',
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
  { question: 'How is SIP return calculated?', answer: 'SIP returns are calculated using the formula: FV = PMT × (((1 + r)^n - 1) / r) × (1 + r), where PMT is monthly investment, r is monthly return rate, and n is total months.' },
  { question: 'What is a good SIP return rate to expect?', answer: 'Historically, equity mutual funds in India have delivered 12-15% annual returns over long periods. For conservative estimates, use 10-12% for long-term SIP calculations.' },
  { question: 'What is the minimum SIP amount?', answer: 'Most mutual funds in India allow SIP with a minimum of ₹100-500 per month. Our SIP calculator allows you to start calculations from ₹100.' },
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

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate SIP Returns",
    "description": "Step-by-step guide to calculate your Systematic Investment Plan returns using our advanced calculator",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Monthly Investment Amount",
        "text": "Enter the amount you plan to invest monthly in mutual funds (minimum ₹100-500 for most funds)"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Expected Annual Return",
        "text": "Enter the expected annual return rate (typically 10-15% for equity funds, 6-8% for debt funds)"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Enter Investment Period",
        "text": "Specify the number of years you plan to continue the SIP (5-40 years recommended for long-term wealth)"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "View Results",
        "text": "Get total invested amount, expected returns, final maturity value, and wealth growth projection"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Compare Scenarios",
        "text": "Use sliders to adjust amounts and see how different monthly investments affect your future wealth"
      }
    ]
  };

  return (
    <>
      <Script id="schema-sip-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-sip-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-sip-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-sip-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Finance">
        {children}
      </CalcPageWrapper>
    </>
  );
}

