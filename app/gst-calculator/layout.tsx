import type { Metadata } from 'next';
import Script from 'next/script';
import { generateWebApplicationSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'GST Calculator - Calculate GST Tax Instantly India Free',
  description: 'Free GST Calculator to calculate GST tax quickly. Add or remove GST at 5%, 12%, 18%, 28% rates. Calculate tax breakdowns for all GST slabs instantly.',
  keywords: ['GST calculator', 'GST tax calculator', 'GST rate calculator', 'GST India', 'tax calculator India', 'GST breakdown calculator'],
  alternates: { canonical: `${BASE_URL}/gst-calculator` },
  openGraph: {
    title: 'GST Calculator - Calculate GST Tax | calculox',
    description: 'Free GST Calculator: Add/remove GST tax at all rates (5%, 12%, 18%, 28%) instantly.',
    url: `${BASE_URL}/gst-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GST Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GST Calculator - Calculate GST Tax | calculox',
    description: 'Free GST Calculator to add/remove GST at all rates instantly.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is GST and how is it calculated?', answer: 'GST (Goods & Services Tax) is a consumption tax applied at 5%, 12%, 18%, or 28% depending on the product/service. If including GST: Total = Base × (1 + GST%/100). If excluding: Base = Total / (1 + GST%/100).' },
  { question: 'What are the different GST rates in India?', answer: 'GST rates are: 5% (essential items), 12% (standard goods), 18% (most goods/services), 28% (luxury items, vehicles, appliances). Some items have 0% (food) or special rates.' },
  { question: 'What is SGST, CGST, and IGST?', answer: 'CGST (Central) and SGST (State) together make GST on intra-state transactions (9%+9%=18%). IGST (Integrated) is applied on inter-state transactions at full rate. They are components of the total GST.' },
  { question: 'Who needs to register for GST?', answer: 'Businesses with annual turnover exceeding ₹40 lakhs (₹20 lakhs for special category states) must register for GST. Voluntary registration is also allowed.' },
  { question: 'How do I claim GST refund?', answer: 'Registered businesses can claim refund of Input Tax Credit (ITC) on purchases. File GSTR-1 and GSTR-3B monthly returns to track refunds.' },
];

export default function GSTCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'GST Calculator',
    description: 'Free GST Calculator to calculate tax at all GST rates (5%, 12%, 18%, 28%).',
    slug: 'gst-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'GST Calculator', href: '/gst-calculator' }]);

  return (
    <>
      <Script id="schema-gst-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-gst-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-gst-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}

