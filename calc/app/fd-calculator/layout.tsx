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
    "FD Calculator India 2026 - Fixed Deposit Maturity & Interest | calculox",
  description:
    "Advanced FD calculator for fixed deposit. Calculate maturity amount with cumulative, quarterly, monthly payouts. RBI-compliant. Senior citizen rate (+0.5%). Instant results.",
  keywords: [
    "fd calculator",
    "fixed deposit calculator",
    "fd calculator india",
    "bank deposit calculator",
    "fixed deposit interest calculator",
    "maturity calculator",
    "compound interest calculator",
    "savings calculator india",
    "fd interest calculator",
    "sbi fd calculator",
  ],
  alternates: { canonical: `${BASE_URL}/fd-calculator` },
  openGraph: {
    title: "FD Calculator - Fixed Deposit Interest Calculator | calculox",
    description:
      "Free FD Calculator: Calculate maturity amount, interest earned & projections for all FD schemes instantly.",
    url: `${BASE_URL}/fd-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FD Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FD Calculator - Fixed Deposit Interest Calculator | calculox",
    description:
      "Free FD Calculator: Calculate maturity amount & interest instantly for all FD schemes.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is a Fixed Deposit (FD)?",
    answer:
      "A Fixed Deposit is a financial instrument offered by banks where you invest a lump sum for a fixed tenure at a predetermined interest rate. The money cannot be withdrawn before maturity without penalty.",
  },
  {
    question: "How is FD interest calculated?",
    answer:
      "FD interest is calculated using compound interest formula: A = P(1+r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time in years. Most FDs compound quarterly.",
  },
  {
    question:
      "What is the difference between cumulative and non-cumulative FD?",
    answer:
      "Cumulative FD reinvests interest to earn compound returns. Non-cumulative FD pays interest periodically (monthly/quarterly), giving regular income. Cumulative FDs offer higher maturity value.",
  },
  {
    question: "Do senior citizens get higher FD interest rates?",
    answer:
      "Yes, most banks offer an additional 0.50% higher interest rate on FDs for senior citizens (60+ years). Some banks offer up to 0.75% extra.",
  },
  {
    question: "What is the penalty for premature FD withdrawal?",
    answer:
      "Banks typically charge 0.5% to 1% lower interest rate on premature withdrawal. The exact penalty depends on the bank and how long the FD was held.",
  },
];

export default function FDCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "FD Calculator",
    description:
      "Free online FD Calculator for fixed deposit interest calculation. Calculate maturity amount and interest for RBI-compliant FD schemes.",
    slug: "fd-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "FD Calculator", href: "/fd-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Fixed Deposit Maturity Amount",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Principal Amount",
        text: "Enter the amount you want to invest in the fixed deposit (minimum ₹1,000-5,000 depending on bank)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Annual Interest Rate",
        text: "Enter the interest rate offered by your bank (typically 6-8% per annum for most banks)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Select Tenure",
        text: "Choose your FD tenure in years, months, or days (minimum 7 days, maximum 10 years for most banks)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Choose Payout Type",
        text: "Select between cumulative (compound), quarterly, monthly, or short-term (simple interest) payout options",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Get Results",
        text: "View maturity amount, total interest earned, and compare with other investment options",
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
      <CalcPageWrapper category="Finance" title="FD Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This FD Calculator
        </h2>
        <p className="mb-4">
          This free FD calculator shows the exact maturity value and interest
          earned on a fixed deposit before you walk into the bank. It supports
          all four payout structures Indian banks offer — cumulative
          (reinvested), quarterly payout, monthly payout, and short-tenure
          simple interest — and automatically adds the 0.50% senior citizen
          bonus, so the number you see matches the bank's FD receipt.
        </p>
        <p className="mb-4">
          Fixed deposits remain India's most trusted savings product, holding
          over half of household financial savings. But trust doesn't mean
          transparency: banks advertise headline rates without showing what
          quarterly compounding actually delivers, and few depositors realise
          that a monthly-payout FD earns a slightly lower effective rate than
          a cumulative one. A retiree in Coimbatore comparing a 7.1% cumulative
          FD against a 7.25% monthly-payout FD cannot eyeball which pays more —
          this calculator settles it in seconds, for any principal from ₹1,000
          to several crores and tenures from 7 days to 10 years.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need an FD Calculator
        </h2>
        <p className="mb-4">
          The classic FD mistakes are choosing a payout mode without comparing
          effective yields, breaking a deposit early without checking the
          penalty math, and ignoring tax — FD interest is fully taxable at
          your slab rate, and banks deduct 10% TDS once interest crosses
          ₹50,000 a year (₹1 lakh for senior citizens). Running the numbers
          first shows your real post-compounding return so you can compare
          honestly against debt funds or an RD. For a complete primer on
          rates, laddering, and premature withdrawal rules, read our{" "}
          <Link href="/blog/fd-calculator-fixed-deposit-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
            complete fixed deposit guide
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This FD Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Principal Amount (₹):</strong> The lump sum you plan to
            deposit. Enter the actual amount, not a rounded figure — compounding
            differences grow with the principal.
          </li>
          <li>
            <strong>Interest Rate (%):</strong> The annual rate your bank
            quotes for your chosen tenure. Check the bank's rate card — rates
            differ by tenure bucket, and small finance banks often pay
            0.5–1% more than large banks.
          </li>
          <li>
            <strong>Tenure Type &amp; Tenure Value:</strong> Choose years,
            months, or days and enter the duration. Tenures under 6 months use
            simple interest, which the calculator switches to automatically.
          </li>
          <li>
            <strong>Payout Type:</strong> Cumulative reinvests interest for
            maximum growth; quarterly or monthly payout suits anyone who needs
            regular income. Select senior citizen if applicable for the +0.50%
            rate.
          </li>
        </ol>
        <p className="mb-4">
          The results show your maturity amount, total interest, and effective
          yield. A common mistake is comparing FDs by headline rate alone —
          always compare maturity values for the same tenure, and remember the
          interest shown is pre-tax.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How Fixed Deposit Interest Is Calculated
        </h2>
        <p className="mb-4">
          A Fixed Deposit (FD) is a savings instrument where you deposit a lump
          sum with a bank for a fixed period at a guaranteed interest rate.
          Unlike savings accounts, the interest rate on an FD does not change
          during the tenure, making it predictable. Indian banks typically
          compound FD interest quarterly, which means interest earned in one
          quarter itself earns interest in the next.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          FD Compound Interest Formula
        </h3>
        <p className="mb-4">
          For cumulative FDs (interest reinvested), the maturity amount is:
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          A = P × (1 + r/n)^(n × t)
        </p>
        <p className="mb-4">
          Where <strong>P</strong> is the principal, <strong>r</strong> is the
          annual interest rate (decimal), <strong>n</strong> is the compounding
          frequency per year (4 for quarterly), and <strong>t</strong> is the
          tenure in years. For simple-interest FDs (tenure under 6 months), the
          formula becomes: A = P × (1 + r × t).
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          You deposit ₹1,00,000 in a bank FD at 7% per annum for 3 years with
          quarterly compounding.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>P = ₹1,00,000; r = 0.07; n = 4; t = 3</li>
          <li>A = 1,00,000 × (1 + 0.07/4)^(4×3) = 1,00,000 × (1.0175)^12</li>
          <li>
            <strong>Maturity amount = ₹1,23,144</strong>
          </li>
          <li>Interest earned = ₹23,144 (vs ₹21,000 with simple interest)</li>
        </ul>
        <p className="mb-4">
          Senior citizens (age 60+) receive an additional 0.50% interest from
          most banks, bringing the effective rate to 7.5% in this example —
          yielding ₹1,25,022 at maturity.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World FD Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Suresh, 63, Coimbatore — retirement corpus for monthly income
        </h3>
        <p className="mb-4">
          Suresh parks ₹20 lakh of his retirement corpus in a 5-year FD at
          7% + 0.50% senior citizen bonus. In cumulative mode the calculator
          projects a maturity of about <strong>₹29 lakh</strong>; switching
          to monthly payout shows roughly ₹12,500 a month of income with the
          principal returned at maturity. Seeing both modes side by side lets
          him split the corpus — half for income, half compounding.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Meera, 29, Jaipur — parking an annual bonus
        </h3>
        <p className="mb-4">
          Meera received a ₹2 lakh bonus she'll need for a wedding in 18
          months. A 1.5-year FD at 6.9% (quarterly compounding) matures at
          about <strong>₹2.21 lakh</strong> — guaranteed. She compared this
          against an equity SIP and chose the FD because the goal is too near
          to accept market risk. Takeaway: FDs win when the timeline is short
          and the amount is non-negotiable.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this FD calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — it uses the quarterly compounding convention mandated for
            Indian banks and high-precision decimal arithmetic, so results
            match bank FD receipts. Minor rupee-level differences can occur
            when banks round interest at each quarter.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use an FD instead of an RD or SIP?
          </summary>
          <p className="pt-2">
            Use an FD when you already have a lump sum. If you're saving
            month by month, compare with our{" "}
            <Link href="/rd-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              RD calculator
            </Link>
            ; if your horizon is 7+ years and you can accept market risk, a{" "}
            <Link href="/sip-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              SIP
            </Link>{" "}
            has historically returned more.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is FD interest taxable?
          </summary>
          <p className="pt-2">
            Yes, fully — it is added to your income and taxed at your slab
            rate. Banks deduct 10% TDS when annual interest exceeds ₹50,000
            (₹1 lakh for senior citizens); submit Form 15G/15H if your total
            income is below the taxable limit.
          </p>
        </details>
      </section>
    </>
  );
}
