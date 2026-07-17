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
  title: "CAGR Calculator India - Compound Annual Growth Rate | calculox",
  description:
    "Free CAGR calculator to calculate compound annual growth rate of investments. Compare stock, mutual fund, real estate returns. Includes year-by-year projections.",
  keywords: [
    "cagr calculator",
    "compound annual growth rate calculator",
    "cagr formula",
    "investment growth calculator",
    "mutual fund cagr calculator",
    "cagr calculation",
    "annual growth rate calculator",
    "investment return calculator",
    "stock return calculator",
    "real estate return calculator",
  ],
  alternates: { canonical: `${BASE_URL}/cagr-calculator` },
  openGraph: {
    title: "CAGR Calculator - Calculate Compound Annual Growth Rate | calculox",
    description:
      "Free CAGR Calculator: Calculate compound annual growth rate & investment returns instantly.",
    url: `${BASE_URL}/cagr-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CAGR Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CAGR Calculator - Calculate CAGR | calculox",
    description:
      "Free CAGR Calculator to calculate compound annual growth rate for investments.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is CAGR and why is it important?",
    answer:
      "CAGR (Compound Annual Growth Rate) is the mean annual growth rate of an investment over a period longer than one year. It shows the smoothed annual return, accounting for compounding effects. It's crucial for comparing investments.",
  },
  {
    question: "What is the CAGR formula?",
    answer:
      "CAGR = (Ending Value / Beginning Value)^(1/Number of Years) - 1. For example, if you invested ₹1,00,000 that grew to ₹2,00,000 in 5 years, CAGR = (2,00,000/1,00,000)^(1/5) - 1 = 14.87%.",
  },
  {
    question: "How is CAGR different from average annual return?",
    answer:
      "Average return is simple arithmetic mean, while CAGR accounts for compounding. CAGR is more accurate for multi-year investments as it shows the consistent growth rate.",
  },
  {
    question: "Can CAGR be negative?",
    answer:
      "Yes, if the ending value is less than the beginning value, CAGR will be negative, indicating investment loss over the period.",
  },
  {
    question: "What investments can I use CAGR for?",
    answer:
      "CAGR applies to any investment: stocks, mutual funds, real estate, bonds, savings, FDs, gold, etc. It's universally used to compare investment performance across time periods.",
  },
];

export default function CAGRCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "CAGR Calculator",
    description:
      "Free CAGR Calculator to calculate compound annual growth rate for investments and financial returns.",
    slug: "cagr-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "CAGR Calculator", href: "/cagr-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate CAGR (Compound Annual Growth Rate)",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Beginning Value",
        text: "Enter the initial investment amount (starting value of your investment)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Ending Value",
        text: "Enter the final value of your investment after the investment period",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter Number of Years",
        text: "Specify the duration of investment in years (can be decimal for months/days)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Get CAGR Result",
        text: "View calculated CAGR percentage, year-over-year growth breakdown, and investment growth chart",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Compare Investments",
        text: "Use CAGR to compare returns across different investments and time periods fairly",
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
      <CalcPageWrapper category="Finance" title="CAGR Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This CAGR Calculator
        </h2>
        <p className="mb-4">
          This free CAGR calculator turns any "I invested X and now it's
          worth Y" story into a single comparable number: the compound annual
          growth rate. Enter the beginning value, ending value, and the number
          of years, and it returns the annualized return along with a
          year-by-year growth path and benchmarks against common Indian asset
          classes.
        </p>
        <p className="mb-4">
          Indians hear absolute returns constantly — "my flat doubled in ten
          years", "this fund gave 80% in three years", "gold went up 60%" —
          and absolute numbers are how bad investments hide. A flat that
          doubles in 10 years grew at just 7.2% a year, barely beating an FD
          and likely trailing inflation once maintenance and taxes are
          counted; a fund that gained 80% in 3 years compounded at 21.6%.
          Without annualizing, those two can't be compared at all. SEBI
          requires mutual funds to report CAGR for exactly this reason, and
          this calculator lets you apply the same standard to your own
          property, gold, stocks, ULIPs, or business revenue.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need a CAGR Calculator
        </h2>
        <p className="mb-4">
          The classic mistake is judging investments by total gain while
          ignoring time — the friend who "tripled his money" in 15 years
          earned 7.6% a year, less than many debt funds. The reverse mistake
          is dividing total return by years (a "60% in 5 years" gain is 9.86%
          CAGR, not 12%), which overstates every multi-year return. Checking
          CAGR before you buy a "guaranteed doubling" insurance-linked product
          or before you celebrate a property sale keeps your comparisons
          honest. New to the concept? Start with our explainer{" "}
          <Link href="/blog/what-is-cagr" className="text-blue-600 dark:text-blue-400 hover:underline">
            What is CAGR?
          </Link>{" "}
          and our guide to{" "}
          <Link href="/blog/best-mutual-fund-selection-criteria" className="text-blue-600 dark:text-blue-400 hover:underline">
            selecting mutual funds
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This CAGR Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Beginning Value (₹):</strong> What the investment was
            worth at the start — the purchase price or initial invested
            amount.
          </li>
          <li>
            <strong>Ending Value (₹):</strong> Its value today or at sale.
            For property, use realistic net sale value, not the asking price.
          </li>
          <li>
            <strong>Time Period (Years):</strong> The holding period. Use
            decimals for partial years (3 years 6 months = 3.5) — rounding to
            whole years is the most common source of inflated CAGR figures.
          </li>
        </ol>
        <p className="mb-4">
          The result is the annualized growth rate, benchmarked against
          typical Indian asset returns (FDs ~7%, Nifty 50 ~12-13% long term,
          gold ~9-10%). One caveat: CAGR assumes a single investment at the
          start. If you added money along the way — like a SIP — CAGR
          overstates or understates your true return; use the{" "}
          <Link href="/sip-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
            SIP calculator
          </Link>{" "}
          for recurring investments instead.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What Is CAGR and How to Calculate It
        </h2>
        <p className="mb-4">
          Compound Annual Growth Rate (CAGR) is the rate at which an investment
          would have grown if it grew at a steady rate each year. It is the most
          widely used metric to compare investments across different time
          horizons because it smooths out year-to-year volatility and reflects
          the effect of compounding. SEBI mandates that mutual fund performance
          data in India be disclosed using CAGR for periods of one year and
          above.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          CAGR Formula
        </h3>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          CAGR = (Ending Value ÷ Beginning Value)^(1 ÷ Number of Years) − 1
        </p>
        <p className="mb-4">
          The result is expressed as a percentage. A negative CAGR means the
          investment lost value over the period. CAGR differs from simple
          average return: if an investment gains 100% one year and loses 50% the
          next, the simple average is 25%, but the actual return is 0% (back to
          start) — which CAGR correctly captures.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          You invested ₹1,00,000 in a mutual fund in 2017. In 2024 (7 years
          later), the value is ₹2,50,000.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>CAGR = (2,50,000 ÷ 1,00,000)^(1 ÷ 7) − 1</li>
          <li>= (2.5)^(0.1429) − 1</li>
          <li>
            = 1.1401 − 1 = <strong>14.01% per year</strong>
          </li>
        </ul>
        <p className="mb-4">
          This 14% CAGR means your investment would have had to grow at exactly
          14% every single year to produce the same ending value. Use CAGR to
          compare a mutual fund delivering 14% CAGR over 7 years against a bank
          FD that offered 7% per year — the fund outperformed by 7 percentage
          points annually on a compounded basis.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World CAGR Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Vivek, Hyderabad — was the flat a good investment?
        </h3>
        <p className="mb-4">
          Vivek bought a flat for ₹45 lakh in 2014 and sold it for ₹85 lakh
          in 2026 (12 years). The calculator shows a CAGR of about{" "}
          <strong>5.4%</strong> — below FD rates for most of that period, and
          before subtracting registration, maintenance, and property tax. The
          "₹40 lakh profit" headline hid an underperforming asset; the same
          money in a Nifty index fund at ~12% would have grown past ₹1.75
          crore.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nisha, Delhi — comparing two fund statements
        </h3>
        <p className="mb-4">
          Nisha's ELSS grew from ₹3 lakh to ₹5.1 lakh in 4 years; her
          friend's fund turned ₹2 lakh into ₹3.9 lakh in 6 years. The
          calculator shows <strong>14.2%</strong> vs <strong>11.8%</strong>{" "}
          CAGR — Nisha's fund performed better despite the friend's larger
          multiple. Takeaway: never compare investments across different
          periods without annualizing first.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this CAGR calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — the CAGR formula is a closed-form calculation with no
            estimation involved, computed with high-precision decimal
            arithmetic. It matches the methodology SEBI mandates for mutual
            fund disclosures.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            What is a good CAGR for Indian investments?
          </summary>
          <p className="pt-2">
            Context matters: 6.5–7.5% matches FDs (risk-free), 10–12% beats
            inflation meaningfully, and 12–15% matches long-term Indian
            equity. Anything claiming a sustained 20%+ CAGR deserves heavy
            scrutiny.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use CAGR vs absolute return?
          </summary>
          <p className="pt-2">
            Use absolute return only for periods under a year. For anything
            longer, CAGR is the honest metric because it accounts for
            compounding and lets you compare investments held for different
            lengths of time.
          </p>
        </details>
      </section>
    </>
  );
}
