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
    "Simple Interest Calculator India - Calculate SI Loans & Deposits | calculox",
  description:
    "Free simple interest calculator with year, month, day precision. Calculate interest on loans, deposits, bonds. SI formula with instant results. Accurate for all tenures.",
  keywords: [
    "simple interest calculator",
    "si calculator",
    "simple interest formula calculator",
    "interest calculator",
    "loan interest calculator",
    "simple interest on deposits",
    "bond interest calculator",
    "monthly interest calculator",
    "yearly interest calculator",
    "daily interest calculator",
  ],
  alternates: { canonical: `${BASE_URL}/simple-interest-calculator` },
  openGraph: {
    title: "Simple Interest Calculator - Calculate SI | calculox",
    description:
      "Free Simple Interest Calculator: Calculate SI for any tenure (years, months, days) instantly.",
    url: `${BASE_URL}/simple-interest-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Simple Interest Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Interest Calculator - Calculate SI | calculox",
    description:
      "Free Simple Interest Calculator: Calculate simple interest & maturity amount easily.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is Simple Interest and the formula?",
    answer:
      "Simple Interest is calculated only on the principal amount, not on accumulated interest. Formula: SI = (P × R × T) / 100, where P is principal, R is annual rate (%), and T is time (years).",
  },
  {
    question: "How is Simple Interest different from Compound Interest?",
    answer:
      "Simple Interest is calculated only on principal. Compound Interest is calculated on principal + accumulated interest. Compound Interest yields higher returns over longer periods.",
  },
  {
    question: "Can I calculate SI for months or days?",
    answer:
      "Yes. For months: SI = (P × R × M) / 1200. For days: SI = (P × R × D) / 36500 (for 365-day year). This calculator supports all three.",
  },
  {
    question: "Who uses Simple Interest?",
    answer:
      "Simple Interest is used for short-term loans (personal loans, overdrafts), bonds, short-term deposits, and some traditional savings schemes.",
  },
  {
    question: "How do I calculate the principal if I know SI and rate?",
    answer:
      "Rearranging the formula: P = (SI × 100) / (R × T). For example, if SI is ₹5,000 at 10% for 2 years, then P = (5,000 × 100) / (10 × 2) = ₹25,000.",
  },
];

export default function SimpleInterestCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "Simple Interest Calculator",
    description:
      "Free Simple Interest Calculator to calculate SI for principal, rates and tenure in years, months or days.",
    slug: "simple-interest-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "Simple Interest Calculator", href: "/simple-interest-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Simple Interest",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Principal Amount",
        text: "Enter the amount you want to borrow or invest (loan amount or savings amount)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Annual Interest Rate",
        text: "Enter the annual interest rate (percentage per annum) offered by the lender or bank",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Select Time Period",
        text: "Choose whether to calculate for years, months, or days, and enter the duration",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Get Results",
        text: "View calculated simple interest amount, total amount due, and daily accrual breakdown",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Compare with Compound",
        text: "Compare simple interest results with compound interest to understand the difference",
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
      <CalcPageWrapper category="Finance" title="Simple Interest Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This Simple Interest Calculator
        </h2>
        <p className="mb-4">
          This free simple interest calculator computes the interest and total
          repayment on any principal, for any tenure expressed in years,
          months, or days — with automatic leap-year handling for day-based
          calculations. Enter the principal, annual rate, and duration, and it
          instantly shows the interest earned or owed, the maturity amount,
          and a period-by-period projection.
        </p>
        <p className="mb-4">
          Simple interest is everywhere in Indian daily life, even if the
          label isn't: gold loans from NBFCs, informal lending between
          relatives and in chit circles, security deposits, delayed-payment
          penalties on invoices, court-awarded interest, and several
          post-office schemes all use it. When a jeweller-backed lender in
          Vijayawada quotes "1% per month" on a gold loan, most borrowers
          cannot immediately say what that costs on ₹80,000 over 100 days —
          and that gap is where overpaying happens. This calculator exists to
          close it: exact interest, any duration, no mental arithmetic.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need a Simple Interest Calculator
        </h2>
        <p className="mb-4">
          The two costly mistakes with simple interest are confusing monthly
          and annual rates (a "2% per month" hand loan is 24% a year — worse
          than most personal loans) and assuming all interest compounds. On
          the flip side, lenders sometimes quote simple interest but compute
          compound — verifying takes ten seconds here and can save real money
          on a dispute. If you lend money informally, calculating the exact
          amount due on a specific date (in days) keeps the arrangement clean.
          For the full theory, differences from compound interest, and more
          worked cases, read our{" "}
          <Link href="/blog/simple-interest-calculator-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
            simple interest guide
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Principal Amount (₹):</strong> The amount lent, borrowed,
            or deposited.
          </li>
          <li>
            <strong>Annual Interest Rate (%):</strong> Always convert to an
            annual rate first — if you were quoted a monthly rate, multiply
            by 12 (1.5%/month = 18% here).
          </li>
          <li>
            <strong>Tenure Type:</strong> Choose Years, Months, or Days. Use
            Days for loans repaid on a specific date — the calculator
            automatically uses 366 days for leap years.
          </li>
          <li>
            <strong>Tenure Value:</strong> The duration in your chosen unit.
          </li>
        </ol>
        <p className="mb-4">
          The result shows interest, total amount, and effective breakdown.
          Remember that simple interest is linear: doubling the tenure exactly
          doubles the interest, which makes it easy to sanity-check any
          lender's figure against this output.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Simple Interest vs Compound Interest — Formula and Examples
        </h2>
        <p className="mb-4">
          Simple Interest (SI) is calculated only on the original principal
          amount throughout the entire loan or investment tenure. The interest
          does not compound — it does not earn further interest on itself. SI is
          used in short-term personal loans, overdraft facilities, government
          bonds, post-office savings schemes, and some traditional deposit
          products. It is transparent and easy to verify, which is why
          regulatory bodies often mandate SI disclosure alongside compound
          interest figures.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Simple Interest Formula
        </h3>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          SI = (P × R × T) ÷ 100
        </p>
        <p className="mb-4">
          Where <strong>P</strong> is the principal amount, <strong>R</strong>{" "}
          is the annual interest rate (%), and <strong>T</strong> is the time in
          years. For months: T = M ÷ 12. For days: T = D ÷ 365 (or 366 for leap
          years). Total amount at maturity = P + SI.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          You take a personal loan of ₹1,50,000 at 9% per annum for 2 years and
          6 months (2.5 years):
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            SI = (1,50,000 × 9 × 2.5) ÷ 100 = <strong>₹33,750</strong>
          </li>
          <li>
            Total repayment = ₹1,50,000 + ₹33,750 = <strong>₹1,83,750</strong>
          </li>
          <li>Monthly payment = ₹1,83,750 ÷ 30 months = ₹6,125/month</li>
        </ul>
        <p className="mb-4">
          Had this been compound interest (compounded monthly), the total
          interest on the same loan would be ₹36,211 — about ₹2,461 more. The
          difference grows larger with longer tenures, which is why banks
          typically use compound interest for home loans but simple interest for
          certain overdraft products.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lakshmi, Vijayawada — gold loan for 100 days
        </h3>
        <p className="mb-4">
          Lakshmi pledges gold for ₹80,000 at "1% per month" (12% annual) and
          plans to repay in 100 days. Entering ₹80,000, 12%, and 100 days, the
          calculator shows interest of about <strong>₹2,630</strong> — total
          repayment ₹82,630. Knowing the exact figure stopped the branch's
          rounded-up "₹3,500 interest" estimate from going unchallenged.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Deepak, Indore — informal loan to a cousin
        </h3>
        <p className="mb-4">
          Deepak lends ₹2 lakh to a cousin at 9% simple interest for 3 years.
          The calculator shows interest of <strong>₹54,000</strong> and total
          repayment of ₹2,54,000 — a figure both parties agreed to in writing
          on day one. Takeaway: for family lending, a printed calculation
          prevents the misunderstandings that usually sour such arrangements.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this simple interest calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — SI = (P × R × T) ÷ 100 is exact arithmetic with no
            approximation, and day-based tenures correctly use 365 or 366
            days depending on leap years, computed with high-precision
            decimals.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this vs the FD or EMI calculator?
          </summary>
          <p className="pt-2">
            Use this for anything that doesn't compound: gold loans, informal
            lending, penalties, and short-tenure deposits. Bank FDs over 6
            months compound quarterly — use the{" "}
            <Link href="/fd-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              FD calculator
            </Link>{" "}
            — and amortized bank loans need the{" "}
            <Link href="/emi-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              EMI calculator
            </Link>
            .
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            How do I convert a monthly rate to annual?
          </summary>
          <p className="pt-2">
            Multiply by 12. A moneylender's "2% monthly" is 24% per annum —
            entering 2 instead of 24 in the rate field understates the
            interest twelvefold, the single most common input mistake.
          </p>
        </details>
      </section>
    </>
  );
}
