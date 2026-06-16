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
    "RD Calculator India - Recurring Deposit Maturity & Interest | calculox",
  description:
    "Free RD calculator for recurring deposits. Calculate maturity amount, interest earned, monthly deposits. RBI-compliant formulas. Includes senior citizen rates. Instant results.",
  keywords: [
    "rd calculator",
    "recurring deposit calculator",
    "rd calculator india",
    "bank rd calculator",
    "rd maturity calculator",
    "rd interest calculator",
    "recurring deposit interest",
    "monthly deposit calculator",
    "savings deposit calculator",
    "sbi rd calculator",
  ],
  alternates: { canonical: `${BASE_URL}/rd-calculator` },
  openGraph: {
    title: "RD Calculator - Recurring Deposit Calculator | calculox",
    description:
      "Free RD Calculator: Calculate maturity amount & interest for recurring deposits instantly.",
    url: `${BASE_URL}/rd-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RD Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RD Calculator - Recurring Deposit Calculator | calculox",
    description:
      "Free RD Calculator: Calculate RD maturity amount & interest easily.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is a Recurring Deposit (RD)?",
    answer:
      "An RD is a deposit scheme where you invest a fixed amount monthly for a predetermined period. It is ideal for investors who want to save regularly with guaranteed returns.",
  },
  {
    question: "How is RD interest calculated?",
    answer:
      "RD interest is calculated using the formula: A = P × [((1+r)^n - 1) / (1 - (1+r)^-1)], where P is monthly deposit, r is monthly interest rate, and n is number of months.",
  },
  {
    question: "What is the difference between RD and FD?",
    answer:
      "FD requires a lump sum investment, while RD allows monthly deposits. RD is ideal for regular savers, while FD suits those with available capital.",
  },
  {
    question: "Can I withdraw from RD before maturity?",
    answer:
      "Yes, premature withdrawal is allowed after 6 months, but with interest penalty of 0.5% to 1% lower than the contracted rate.",
  },
  {
    question: "What are the typical RD tenure options?",
    answer:
      "Banks typically offer RD tenures ranging from 6 months to 10 years, in multiples of 3 or 6 months.",
  },
];

export default function RDCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "RD Calculator",
    description:
      "Free RD Calculator for recurring deposit interest calculation and maturity amount projection.",
    slug: "rd-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "RD Calculator", href: "/rd-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Recurring Deposit Maturity Amount",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Monthly Deposit Amount",
        text: "Enter the fixed amount you plan to deposit every month (typically ₹100-1,00,000 depending on bank)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Interest Rate",
        text: "Enter the annual interest rate offered by your bank (typically 6-7% per annum for RDs)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter Deposit Period",
        text: "Specify the duration in months or years (typical range: 6 months to 10 years)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "View RD Maturity Value",
        text: "Get total amount deposited, interest earned, and final maturity value with compound growth",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Compare with Other Options",
        text: "Compare RD returns with SIP, FD, and other investment options to choose the best savings plan",
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
          How Recurring Deposit Maturity Is Calculated
        </h2>
        <p className="mb-4">
          A Recurring Deposit (RD) is a savings scheme where you deposit a fixed
          amount every month for a predetermined period. Unlike an FD where you
          invest once, an RD builds savings gradually — making it ideal for
          salaried individuals who want to save a portion of income each month.
          Banks compound RD interest quarterly in India, and the RBI mandates
          this calculation method for all scheduled commercial banks.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          RD Maturity Formula
        </h3>
        <p className="mb-4">
          The maturity value of an RD with quarterly compounding is:
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          A = P × [(1 + r/4)^(4t) − 1] ÷ [1 − (1 + r/4)^(−1/3)]
        </p>
        <p className="mb-4">
          Where <strong>P</strong> is the monthly deposit amount,{" "}
          <strong>r</strong> is the annual interest rate (decimal), and{" "}
          <strong>t</strong> is the tenure in years. Each monthly installment
          matures at a different point, so the total is a sum of all installment
          future values.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          You open an RD depositing ₹5,000 per month for 5 years at 7% per annum
          (quarterly compounding).
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            Total deposited = ₹5,000 × 60 months = <strong>₹3,00,000</strong>
          </li>
          <li>
            Interest earned through compounding = <strong>₹60,692</strong>
          </li>
          <li>
            <strong>Maturity amount = ₹3,60,692</strong>
          </li>
        </ul>
        <p>
          Compare this to a savings account at 3.5%: the same ₹3 lakh deposits
          would earn only ₹28,000 in interest — less than half. RDs are
          particularly effective for goal-based saving, such as building a down
          payment or an emergency fund over 1–5 years.
        </p>
      </section>
    </>
  );
}
