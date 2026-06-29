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
  title:
    "Percentage Calculator India - Calculate Discount, Markup & Change | calculox",
  description:
    "Free 6-in-1 percentage calculator tool. Calculate percentage of, discount, markup, percentage change, reverse %, sequential %. Instant results for all calculations.",
  keywords: [
    "percentage calculator",
    "percentage of calculator",
    "discount calculator",
    "percentage change calculator",
    "markup calculator",
    "percentage off calculator",
    "reverse percentage calculator",
    "percentage increase calculator",
    "percentage decrease calculator",
    "compound percentage calculator",
  ],
  alternates: { canonical: `${BASE_URL}/percentage-calculator` },
  openGraph: {
    title: "Percentage Calculator - Calculate Any Percentage | calculox",
    description:
      "Free Percentage Calculator: 6 tools to calculate discount, percentage change, reverse percentage & more instantly.",
    url: `${BASE_URL}/percentage-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Percentage Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Calculator - Calculate Percentages | calculox",
    description:
      "Free Percentage Calculator: Calculate percentage change, discount, markup instantly.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "How do I calculate X% of Y?",
    answer:
      "Formula: (X/100) × Y. For example, 20% of 500 = (20/100) × 500 = 100.",
  },
  {
    question: "How do I calculate percentage change?",
    answer:
      "Formula: ((New Value - Old Value) / Old Value) × 100. For example, from 50 to 75: ((75-50)/50) × 100 = 50% increase.",
  },
  {
    question: "What is reverse percentage calculation?",
    answer:
      "If you know the final amount and the percentage applied, find the original amount. Formula: (Final Amount × 100) / Percentage.",
  },
  {
    question: "How do I calculate discount?",
    answer:
      "Discount amount = (Discount % / 100) × Original Price. Final Price = Original Price - Discount Amount.",
  },
  {
    question: "What is markup vs margin?",
    answer:
      "Markup: (Profit / Cost Price) × 100. Margin: (Profit / Selling Price) × 100. They measure profit differently - markup on cost, margin on revenue.",
  },
];

export default function PercentageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "Percentage Calculator",
    description:
      "Free Percentage Calculator with 6 tools for percentage calculations, discount, markup and percentage change.",
    slug: "percentage-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "Percentage Calculator", href: "/percentage-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Percentages",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose Calculation Type",
        text: "Select which percentage calculation you need: hike/discount, X% of Y, percentage change, reverse %, or sequential percentages",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Required Values",
        text: "Fill in the values based on your chosen calculation (original amount, percentage, new value, etc.)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Get Instant Results",
        text: "See calculated percentage value, percentage breakdown in pie chart, and natural language explanation",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Switch Calculation Types",
        text: "Use the quick-access buttons to switch between different percentage calculation methods",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Export Results",
        text: "Copy results to clipboard or download as PDF with input data for records",
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
      <CalcPageWrapper category="Utility" title="Percentage Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Percentage Calculations Explained
        </h2>
        <p className="mb-4">
          Percentages express a quantity as a fraction of 100 and appear in
          everyday financial decisions — salary hikes, GST calculations, EMI
          interest, investment returns, discounts, and profit margins. This
          calculator covers six distinct percentage calculation types so you can
          solve any percentage problem without remembering individual formulas.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Core Percentage Formulas
        </h3>
        <ul className="list-disc pl-5 mb-4 space-y-2 text-sm">
          <li>
            <strong>X% of Y:</strong> Result = (X ÷ 100) × Y
          </li>
          <li>
            <strong>What % is A of B:</strong> Percentage = (A ÷ B) × 100
          </li>
          <li>
            <strong>Percentage increase/decrease:</strong> Change% = ((New −
            Old) ÷ Old) × 100
          </li>
          <li>
            <strong>Reverse percentage (find original):</strong> Original =
            Final × 100 ÷ (100 ± Change%)
          </li>
          <li>
            <strong>Discount amount:</strong> Discount = (Rate ÷ 100) × Original
            Price
          </li>
          <li>
            <strong>Sequential %:</strong> Apply percentages one after another
            (e.g., 10% then 5%)
          </li>
        </ul>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Examples
        </h3>
        <p className="mb-3">
          <strong>Example 1 — Salary hike:</strong> Your salary increases from
          ₹40,000 to ₹50,000. Percentage increase = ((50,000 − 40,000) ÷ 40,000)
          × 100 = <strong>25%</strong>.
        </p>
        <p className="mb-3">
          <strong>Example 2 — Discount:</strong> A ₹3,200 item is offered at 15%
          off. Discount = (15 ÷ 100) × 3,200 = ₹480. Final price = ₹3,200 − ₹480
          = <strong>₹2,720</strong>.
        </p>
        <p className="mb-3">
          <strong>Example 3 — Reverse percentage:</strong> A price of ₹1,180
          includes 18% GST. Original base price = 1,180 ÷ 1.18 ={" "}
          <strong>₹1,000</strong>.
        </p>
        <p>
          Note that sequential percentage changes are not additive: a 10%
          increase followed by a 10% decrease does not return to the original
          value — it gives 99% of the original (a net −1% effect). The
          sequential mode in this calculator handles this correctly.
        </p>
      </section>
    </>
  );
}
