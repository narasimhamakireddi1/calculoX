import type { Metadata } from "next";

import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";
import { CalcPageWrapper } from "@/components/layout/CalcPageWrapper";
import { AdUnit, AD_SLOTS } from "@/components/ui/AdUnit";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.calculox.in";

export const metadata: Metadata = {
  title: "GST Calculator India - Add/Remove Tax 5% 12% 18% 28% | calculox",
  description:
    "Free GST calculator for Indian businesses. Calculate tax amount, CGST/SGST/IGST breakdown at all rates (5%, 12%, 18%, 28%). Add or remove GST instantly.",
  keywords: [
    "gst calculator",
    "gst calculator india",
    "calculate gst",
    "goods and services tax calculator",
    "igst calculator",
    "sgst calculator",
    "cgst calculator",
    "gst rate calculator",
    "gst tax calculator",
    "gst breakdown calculator",
  ],
  alternates: { canonical: `${BASE_URL}/gst-calculator` },
  openGraph: {
    title: "GST Calculator - Calculate GST Tax | calculox",
    description:
      "Free GST Calculator: Add/remove GST tax at all rates (5%, 12%, 18%, 28%) instantly.",
    url: `${BASE_URL}/gst-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GST Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Calculator - Calculate GST Tax | calculox",
    description:
      "Free GST Calculator to add/remove GST at all rates instantly.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is GST and how is it calculated?",
    answer:
      "GST (Goods & Services Tax) is a consumption tax applied at 5%, 12%, 18%, or 28% depending on the product/service. If including GST: Total = Base × (1 + GST%/100). If excluding: Base = Total / (1 + GST%/100).",
  },
  {
    question: "What are the different GST rates in India?",
    answer:
      "GST rates are: 5% (essential items), 12% (standard goods), 18% (most goods/services), 28% (luxury items, vehicles, appliances). Some items have 0% (food) or special rates.",
  },
  {
    question: "What is SGST, CGST, and IGST?",
    answer:
      "CGST (Central) and SGST (State) together make GST on intra-state transactions (9%+9%=18%). IGST (Integrated) is applied on inter-state transactions at full rate. They are components of the total GST.",
  },
  {
    question: "Who needs to register for GST?",
    answer:
      "Businesses with annual turnover exceeding ₹40 lakhs (₹20 lakhs for special category states) must register for GST. Voluntary registration is also allowed.",
  },
  {
    question: "How do I claim GST refund?",
    answer:
      "Registered businesses can claim refund of Input Tax Credit (ITC) on purchases. File GSTR-1 and GSTR-3B monthly returns to track refunds.",
  },
];

export default function GSTCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "GST Calculator",
    description:
      "Free GST Calculator to calculate tax at all GST rates (5%, 12%, 18%, 28%).",
    slug: "gst-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "GST Calculator", href: "/gst-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate GST (Goods and Services Tax)",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Base Amount",
        text: "Enter the price of goods or services (before or after GST, depending on what you're calculating)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select GST Rate",
        text: "Choose the applicable GST rate: 5% (essentials), 12% (standard), 18% (most goods), 28% (luxury items)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose Calculation Type",
        text: "Select whether you want to add GST to the base price or remove GST from the final price (reverse calculation)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "View Results",
        text: "Get GST amount, CGST & SGST breakdown (for intra-state), and final price with or without GST",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Track Input Tax Credit",
        text: "For businesses, track eligible input GST for ITC claims on your GST returns",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <AdUnit slot={AD_SLOTS.calcAboveFold} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <CalcPageWrapper category="Finance" title="GST Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How GST Is Calculated in India
        </h2>
        <p className="mb-4">
          Goods and Services Tax (GST) is a unified indirect tax levied on the
          supply of goods and services across India, replacing multiple earlier
          taxes (excise duty, service tax, VAT). It follows a dual structure:
          CGST (Central GST) and SGST (State GST) apply on intra-state
          transactions, while IGST (Integrated GST) applies on inter-state
          transactions. The GST Council has fixed four primary rates: 5%, 12%,
          18%, and 28%, along with a 0% rate for essential goods.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          GST Calculation Formulas
        </h3>
        <p className="mb-2 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          Adding GST: Total Price = Base Price × (1 + GST Rate ÷ 100)
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          Removing GST: Base Price = Total Price ÷ (1 + GST Rate ÷ 100)
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          A retailer sells a laptop bag with a base price of ₹2,500 at 18% GST
          (most consumer goods category):
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            GST amount = ₹2,500 × 18 ÷ 100 = <strong>₹450</strong>
          </li>
          <li>CGST (9%) = ₹225 | SGST (9%) = ₹225</li>
          <li>
            <strong>Final price to customer = ₹2,950</strong>
          </li>
        </ul>
        <p className="mb-4">
          If a customer pays ₹2,950 and wants to find the base price (reverse
          calculation):
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            Base price = ₹2,950 ÷ 1.18 = <strong>₹2,500</strong>
          </li>
          <li>GST portion = ₹2,950 − ₹2,500 = ₹450</li>
        </ul>
        <p>
          GST-registered businesses can claim Input Tax Credit (ITC) on
          purchases, making the tax system self-policing. Businesses with
          turnover above ₹40 lakh (₹20 lakh in special category states) are
          mandatorily required to register under GST.
        </p>
      </section>
    </>
  );
}
