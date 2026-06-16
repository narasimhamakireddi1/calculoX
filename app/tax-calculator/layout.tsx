import type { Metadata } from "next";

import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";
import { CalcPageWrapper } from "@/components/layout/CalcPageWrapper";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.calculox.in";

export const metadata: Metadata = {
  title:
    "Income Tax Calculator India FY 2025-26 - Calculate Tax & Save | calculox",
  description:
    "Advanced income tax calculator for FY 2025-26. Calculate tax on salary with new/old tax regime, HRA, LTA, 80C deductions, and get instant tax liability. RBI-compliant.",
  keywords: [
    "income tax calculator",
    "income tax calculator india",
    "tax calculator 2025-26",
    "salary tax calculator",
    "income tax calculator with hra",
    "tax slab calculator",
    "tax deduction calculator",
    "income tax new regime",
    "tax liability calculator",
    "income tax comparison",
  ],
  alternates: { canonical: `${BASE_URL}/tax-calculator` },
  openGraph: {
    title: "Income Tax Calculator FY 2024-25 - New vs Old Regime | calculox",
    description:
      "Free Income Tax Calculator India FY 2024-25. Compare New vs Old regime, calculate exact tax with deductions. Updated for Budget 2024.",
    url: `${BASE_URL}/tax-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Income Tax Calculator India - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Income Tax Calculator FY 2024-25 - New vs Old Regime | calculox",
    description:
      "Free Income Tax Calculator India: Compare New vs Old regime & calculate exact tax liability.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "Which tax regime is better - New or Old for FY 2024-25?",
    answer:
      "The New Tax Regime is generally better for those with fewer deductions. If your total deductions (80C + HRA + others) exceed ₹3.75 lakh, the Old Regime may save more tax. Use our calculator to compare both regimes with your specific income and deductions.",
  },
  {
    question: "What are the tax slabs under the New Tax Regime 2024-25?",
    answer:
      "New Tax Regime slabs (FY 2024-25): 0% up to ₹3 lakh, 5% for ₹3-7 lakh, 10% for ₹7-10 lakh, 15% for ₹10-12 lakh, 20% for ₹12-15 lakh, and 30% above ₹15 lakh. There is also a standard deduction of ₹75,000 for salaried employees.",
  },
  {
    question: "What deductions are available under the Old Tax Regime?",
    answer:
      "Major deductions under Old Regime: Section 80C (₹1.5 lakh - PPF, ELSS, LIC), Section 80D (health insurance ₹25,000-₹50,000), HRA exemption, standard deduction (₹50,000), home loan interest (₹2 lakh), Section 80CCD(1B) NPS (₹50,000).",
  },
  {
    question: "Is income up to ₹7 lakh tax-free under the New Regime?",
    answer:
      "Yes, under the New Tax Regime, income up to ₹7 lakh is effectively tax-free due to the Section 87A rebate of ₹25,000. For salaried employees, with the ₹75,000 standard deduction, income up to ₹7.75 lakh is tax-free.",
  },
  {
    question: "When is the last date to file income tax return (ITR)?",
    answer:
      "The last date for filing ITR for FY 2024-25 (AY 2025-26) is typically July 31, 2025 for salaried individuals and October 31, 2025 for businesses requiring audit. Late filing attracts a penalty of ₹5,000 (₹1,000 for income below ₹5 lakh).",
  },
];

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: "Income Tax Calculator India FY 2024-25",
    description:
      "Free online Income Tax Calculator for India FY 2024-25. Compare New vs Old tax regime with deductions.",
    slug: "tax-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Tax Calculator", href: "/tax-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Income Tax in India",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Your Annual Income",
        text: "Enter your gross annual income from salary, business, investments, and other sources for FY 2025-26",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add Applicable Deductions",
        text: "Add deductions like Section 80C (PPF, ELSS, Insurance), HRA exemption, Section 80D (health insurance), Section 80CCD (NPS)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose Tax Regime",
        text: "Select between New Tax Regime (simpler, fewer deductions) or Old Regime (more deductions, higher threshold)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "View Calculated Tax",
        text: "Get your exact income tax liability, applicable slabs, surcharge, health & education cess breakdown",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Compare Regimes",
        text: "See side-by-side comparison of New vs Old regime tax amounts to choose the more beneficial one",
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
      <CalcPageWrapper category="Finance">{children}</CalcPageWrapper>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How Income Tax Is Calculated in India — FY 2025-26
        </h2>
        <p className="mb-4">
          India operates a slab-based income tax system under the Income Tax
          Act, 1961. For FY 2025-26, there are two parallel tax regimes: the New
          Tax Regime (default) with lower slab rates but no major deductions,
          and the Old Tax Regime with higher slab rates but access to exemptions
          under Section 80C, HRA, 80D, and others. Taxpayers can choose the
          regime more beneficial to them when filing returns.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          New Regime Tax Slabs — FY 2025-26 (Finance Act 2025-26)
        </h3>
        <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
          <li>
            Up to ₹4,00,000 — <strong>Nil</strong>
          </li>
          <li>
            ₹4,00,001 to ₹8,00,000 — <strong>5%</strong>
          </li>
          <li>
            ₹8,00,001 to ₹12,00,000 — <strong>10%</strong>
          </li>
          <li>
            ₹12,00,001 to ₹16,00,000 — <strong>15%</strong>
          </li>
          <li>
            ₹16,00,001 to ₹20,00,000 — <strong>20%</strong>
          </li>
          <li>
            ₹20,00,001 to ₹24,00,000 — <strong>25%</strong>
          </li>
          <li>
            Above ₹24,00,000 — <strong>30%</strong>
          </li>
        </ul>
        <p className="mb-4">
          Salaried employees get a standard deduction of ₹75,000 under the new
          regime. Section 87A provides a full tax rebate for net taxable income
          up to ₹12,00,000 (₹12,75,000 for salaried after standard deduction).
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example — New Regime
        </h3>
        <p className="mb-4">
          Gross salary ₹15,00,000 for a salaried individual with no special
          deductions:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Standard deduction: −₹75,000 → Taxable income = ₹14,25,000</li>
          <li>
            Tax on ₹0–4L = ₹0; on ₹4–8L = ₹20,000; on ₹8–12L = ₹40,000; on
            ₹12–14.25L = ₹33,750
          </li>
          <li>
            Total tax = ₹93,750 + 4% cess = <strong>₹97,500</strong>
          </li>
        </ul>
        <p>
          Under the Old Regime with ₹1.5L 80C + ₹25,000 80D + ₹50,000 standard
          deduction, total deductions can reach ₹2.25 lakh, reducing taxable
          income and potentially saving ₹20,000–₹40,000 in tax. Use the
          calculator to compare both regimes for your exact situation.
        </p>
      </section>
    </>
  );
}
