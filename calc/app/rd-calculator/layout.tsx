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
    { name: "Calculators", href: "/" },
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
      <AdUnit slot={AD_SLOTS.calcAboveFold} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <CalcPageWrapper category="Finance" title="RD Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This RD Calculator
        </h2>
        <p className="mb-4">
          This free RD calculator shows exactly what a recurring deposit will
          be worth at maturity — enter your monthly deposit, the bank's annual
          interest rate, and the tenure in months, and it returns the maturity
          amount, total interest earned, and a month-by-month projection of
          your growing balance.
        </p>
        <p className="mb-4">
          Recurring deposits are the quiet workhorse of Indian saving — the
          default choice for anyone who wants FD-like guaranteed returns but
          earns a monthly salary rather than holding a lump sum. Post offices,
          public sector banks, and private banks all offer them, typically at
          6.5–7.5% for tenures of 6 months to 10 years. The catch is that RD
          maturity math is genuinely hard to do in your head: each monthly
          instalment compounds for a different length of time, so the ₹5,000
          you deposit in month one earns far more than the ₹5,000 in month
          thirty-six. A school teacher in Lucknow saving for her daughter's
          admission fees needs one number — "what will ₹4,000 a month become
          in 3 years?" — and this calculator gives it instantly.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need an RD Calculator
        </h2>
        <p className="mb-4">
          The most common RD mistake is setting the deposit amount by feel and
          discovering at maturity that the corpus falls short of the goal — a
          wedding, school admission, or house deposit that had a fixed date
          and a fixed cost. Working backwards from the target ("I need ₹3
          lakh in 30 months, so how much per month?") takes three tries on
          this calculator. The second mistake is leaving money in a savings
          account at 3–3.5% out of inertia: on ₹5,000 a month over 5 years,
          an RD at 7% earns more than double the interest. See our{" "}
          <Link href="/blog/rd-calculator-recurring-deposit-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
            complete recurring deposit guide
          </Link>{" "}
          for rates, premature withdrawal rules, and RD vs SIP comparisons.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This RD Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Monthly Deposit (₹):</strong> The fixed amount you will
            deposit every month. Most banks accept RDs from ₹100 (post
            office) or ₹500–1,000 (banks). Pick an amount you can sustain —
            missed instalments attract penalties.
          </li>
          <li>
            <strong>Annual Interest Rate (%):</strong> The RD rate from your
            bank's rate card for your tenure. Senior citizens usually get
            +0.50%; enter the higher rate directly if it applies to you.
          </li>
          <li>
            <strong>Tenure (Months):</strong> RD tenures are quoted in months
            — 12, 24, 36, 60 are the common buckets. Enter the exact number
            of instalments you plan to make.
          </li>
        </ol>
        <p className="mb-4">
          The results show your total deposits, interest earned, and maturity
          value, with a projection table of the balance after each month.
          Avoid two common errors: entering the tenure in years (the field
          expects months), and comparing the RD's total interest against an
          FD's — an FD holds the full principal from day one, so its interest
          will always look larger even at the same rate.
        </p>

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
        <p className="mb-4">
          Compare this to a savings account at 3.5%: the same ₹3 lakh deposits
          would earn only ₹28,000 in interest — less than half. RDs are
          particularly effective for goal-based saving, such as building a down
          payment or an emergency fund over 1–5 years.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World RD Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Kavita, 34, Lucknow — school admission fund
        </h3>
        <p className="mb-4">
          Kavita needs about ₹1.6 lakh in 3 years for her daughter's school
          admission and first-year fees. Testing ₹4,000 a month at 6.8% for 36
          months, the calculator projects a maturity of roughly{" "}
          <strong>₹1.6 lakh</strong> against ₹1.44 lakh deposited. She rounds
          up to ₹4,200 a month for comfort. The date is fixed, so the
          guaranteed RD beats a market-linked option here.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Arjun, 24, Kochi — building a first emergency fund
        </h3>
        <p className="mb-4">
          Arjun wants a 6-month emergency buffer of about ₹2.4 lakh. At
          ₹9,000 a month and 7% for 24 months, the calculator shows a
          maturity near <strong>₹2.32 lakh</strong>; stretching to 26 months
          crosses his target. Takeaway: an RD converts a vague resolution
          ("save more") into a fixed monthly commitment with a visible finish
          line.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this RD calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — it compounds each instalment for its exact remaining tenure
            using high-precision decimal arithmetic, matching the standard
            bank convention. Rupee-level differences can appear where a bank
            rounds quarterly interest postings.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I choose an RD over a SIP?
          </summary>
          <p className="pt-2">
            Choose an RD when the goal date and amount are fixed and near
            (under ~3 years) — the return is guaranteed. For horizons of 7+
            years where you can ride out market dips, a{" "}
            <Link href="/sip-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              SIP in mutual funds
            </Link>{" "}
            has historically delivered roughly double the RD rate.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is RD interest taxable?
          </summary>
          <p className="pt-2">
            Yes — RD interest is added to your income and taxed at your slab
            rate, and banks deduct TDS once your total deposit interest
            crosses ₹50,000 a year (₹1 lakh for senior citizens). The maturity
            values shown here are pre-tax.
          </p>
        </details>
      </section>
    </>
  );
}
