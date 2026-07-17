import type { Metadata } from "next";
import Link from "next/link";

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
          About This GST Calculator
        </h2>
        <p className="mb-4">
          This free GST calculator works in both directions: add GST to a base
          price to get the final invoice amount, or extract the GST from a
          tax-inclusive price to find the original base. It supports all five
          GST slabs (0%, 5%, 12%, 18%, 28%) and splits the tax into CGST +
          SGST for intra-state sales or IGST for inter-state sales — exactly
          the breakdown a GST-compliant invoice needs.
        </p>
        <p className="mb-4">
          For India's 1.4 crore registered GST businesses — and the freelancers,
          shopkeepers, and service providers joining them every month — GST
          arithmetic is a daily chore with legal consequences. Quote a client
          "₹50,000 inclusive of GST" and you owe the government ₹7,627 of it
          at 18%; quote "₹50,000 plus GST" and you invoice ₹59,000. Mixing
          those up on even a few invoices a month quietly erodes margins or
          triggers mismatches in GSTR filings. A Surat textile trader, a
          Bengaluru consultant, and a Zomato-listed cloud kitchen all face the
          same three questions — how much tax, on what base, split how — and
          this calculator answers all three instantly.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need a GST Calculator
        </h2>
        <p className="mb-4">
          The most expensive GST error is reverse-calculating with the wrong
          method: subtracting 18% from an inclusive price instead of dividing
          by 1.18 understates the base and misstates the tax on every line
          item (on ₹1,18,000 the wrong method yields ₹96,760 instead of
          ₹1,00,000). Consumers benefit too — checking whether an MRP or a
          restaurant bill has applied the correct slab takes seconds. For slab
          lists, ITC rules, and invoice formats, see our{" "}
          <Link href="/blog/gst-calculator-guide-tax-calculation" className="text-blue-600 dark:text-blue-400 hover:underline">
            complete GST calculation guide
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This GST Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Operation Type:</strong> Choose <em>Add GST</em> when you
            have a base price and need the final amount (making an invoice),
            or <em>Remove GST</em> when you have an inclusive price and need
            the base (checking a bill, accounting for an MRP product).
          </li>
          <li>
            <strong>Amount (₹):</strong> Enter the price. Be sure it matches
            the operation — base price for Add, final price for Remove.
          </li>
          <li>
            <strong>GST Rate (%):</strong> Pick the slab for your goods or
            service: 5% (essentials, transport), 12% (processed foods, some
            electronics), 18% (most services and consumer goods), or 28%
            (luxury items, automobiles).
          </li>
        </ol>
        <p className="mb-4">
          The result shows the GST amount, the base and final prices, and the
          CGST/SGST split (half each) alongside the IGST figure for
          inter-state supply. Common mistakes to avoid: using the 18% default
          without checking your actual HSN/SAC slab, and forgetting that
          intra-state invoices must show CGST and SGST separately rather than
          one combined line.
        </p>

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
        <p className="mb-4">
          GST-registered businesses can claim Input Tax Credit (ITC) on
          purchases, making the tax system self-policing. Businesses with
          turnover above ₹40 lakh (₹20 lakh in special category states) are
          mandatorily required to register under GST.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World GST Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Farhan, Bengaluru — freelance developer invoicing a Delhi client
        </h3>
        <p className="mb-4">
          Farhan agreed on ₹1,20,000 for a project, plus GST. Using{" "}
          <em>Add GST</em> at 18%, the calculator shows a GST amount of{" "}
          <strong>₹21,600</strong> and an invoice total of ₹1,41,600. Because
          the client is in another state, the invoice carries a single IGST
          line of ₹21,600 rather than a CGST/SGST split — a detail the
          calculator's breakdown makes obvious.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Rekha, Surat — pricing sarees sold at MRP
        </h3>
        <p className="mb-4">
          Rekha sells sarees at an MRP of ₹2,360 including 18% GST. Using{" "}
          <em>Remove GST</em>, the base price is <strong>₹2,000</strong> and
          the tax ₹360 (CGST ₹180 + SGST ₹180 for local sales). Knowing the
          true base lets her calculate her real margin — many small sellers
          mistakenly compute margin on the inclusive price and overestimate
          profit by the full GST amount.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this GST calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — GST addition and extraction are exact formulas with no
            approximation, computed with high-precision decimal arithmetic
            and matching the GST Council's rate structure published at
            gst.gov.in. Just confirm you've selected the correct slab for
            your HSN/SAC code.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            How do I know whether to apply CGST+SGST or IGST?
          </summary>
          <p className="pt-2">
            It depends on the place of supply: seller and buyer in the same
            state → CGST + SGST (half the rate each); different states →
            IGST (the full rate as one line). The total tax is identical
            either way.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this vs the profit margin calculator?
          </summary>
          <p className="pt-2">
            Use this calculator for the tax itself — invoice amounts and
            CGST/SGST splits. If you're setting selling prices and need
            margin after GST, our{" "}
            <Link href="/profit-margin-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              profit margin calculator
            </Link>{" "}
            handles GST-inclusive and exclusive pricing in one step.
          </p>
        </details>
      </section>
    </>
  );
}
