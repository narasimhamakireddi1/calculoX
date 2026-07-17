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
  title: "EMI Calculator India 2026 - Home, Car & Personal Loan | calculox",
  description:
    "Free EMI calculator for home loan, car loan, personal loan & vehicle loan. Calculate monthly EMI, total interest, and get detailed amortization schedule instantly. No registration needed.",
  keywords: [
    "emi calculator",
    "loan emi calculator",
    "home loan emi calculator",
    "car loan calculator",
    "personal loan emi",
    "emi calculator india",
    "vehicle loan emi",
    "monthly emi calculator",
    "emi formula calculator",
    "bank loan emi",
  ],
  alternates: { canonical: `${BASE_URL}/emi-calculator` },
  openGraph: {
    title: "EMI Calculator - Calculate Loan EMI Instantly Free | calculox",
    description:
      "Free EMI Calculator for home, car & personal loans. Calculate monthly EMI, total interest & amortization schedule instantly.",
    url: `${BASE_URL}/emi-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EMI Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EMI Calculator - Calculate Loan EMI Instantly Free | calculox",
    description:
      "Free EMI Calculator: Calculate monthly EMI, total interest & amortization schedule instantly.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is EMI and how is it calculated?",
    answer:
      "EMI (Equated Monthly Instalment) is a fixed payment made by a borrower to a lender each month. It is calculated using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is principal, R is monthly interest rate, and N is number of months.",
  },
  {
    question: "How can I reduce my loan EMI?",
    answer:
      "You can reduce your EMI by: 1) Choosing a longer loan tenure, 2) Making a larger down payment, 3) Negotiating a lower interest rate, or 4) Making part-prepayments during the loan tenure.",
  },
  {
    question:
      "What is the difference between flat rate and reducing balance EMI?",
    answer:
      "In flat rate EMI, interest is calculated on the full principal throughout the tenure. In reducing balance (used by most banks), interest is calculated on the outstanding principal, making it cheaper.",
  },
  {
    question: "Does EMI change during the loan tenure?",
    answer:
      "For fixed-rate loans, EMI stays constant. For floating-rate loans, EMI can change when the bank revises its base rate (MCLR/Repo Rate linked). Banks either adjust the EMI amount or the tenure.",
  },
  {
    question: "What happens if I miss an EMI payment?",
    answer:
      "Missing an EMI payment attracts a late payment penalty (usually 1-2% per month on the overdue amount), negatively impacts your CIBIL score, and can eventually lead to legal action by the lender.",
  },
];

export default function EMILayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: "EMI Calculator",
    description:
      "Free online EMI Calculator for home loan, car loan and personal loan. Calculate monthly EMI and amortization schedule.",
    slug: "emi-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "EMI Calculator", href: "/emi-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Loan EMI",
    description:
      "Step-by-step guide to calculate your monthly loan EMI using our advanced calculator",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Loan Amount",
        text: "Enter the principal amount you want to borrow (home loan, car loan, or personal loan)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Annual Interest Rate",
        text: "Enter the annual interest rate offered by your bank or lender (typically 7-12% for loans)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter Loan Tenure",
        text: "Enter the loan tenure in years (typically 5-20 years for home loans, 1-7 years for personal loans)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "View Results",
        text: "Get instant results: monthly EMI amount, total interest payable, and complete amortization schedule",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Download Report",
        text: "Export the EMI schedule as PDF or copy results to share with financial advisors",
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
      <CalcPageWrapper category="Finance" title="EMI Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This EMI Calculator
        </h2>
        <p className="mb-4">
          This free EMI calculator computes the exact monthly instalment on any
          home, car, personal, or education loan — along with the total
          interest you will pay over the tenure and a month-by-month
          amortization schedule showing how each payment splits between
          principal and interest. Enter the loan amount, annual interest rate,
          and tenure, and the results update instantly.
        </p>
        <p className="mb-4">
          For most Indian households, a loan EMI is the single largest monthly
          outflow — home loan rates currently range from roughly 8.25–9.5% and
          tenures stretch to 20–30 years, which means the interest paid can
          exceed the amount borrowed. Yet many borrowers sign the loan
          agreement knowing only the EMI the bank quoted, not the total cost.
          Consider a Chennai couple choosing between a ₹40 lakh loan over 15
          years versus 25 years: the longer tenure drops the EMI by about
          ₹8,000 a month but adds over ₹18 lakh in extra interest. Seeing both
          numbers side by side before signing is exactly what this calculator
          is for.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need an EMI Calculator
        </h2>
        <p className="mb-4">
          The costliest borrowing mistakes happen before the first EMI is ever
          paid: stretching the tenure just to lower the instalment, ignoring
          how a 0.5% rate difference compounds over 20 years, or committing
          more than 40% of take-home pay to EMIs (the threshold most banks and
          the RBI's fair-lending norms treat as risky). Running scenarios here
          takes seconds and can save lakhs — a 0.5% lower rate on a ₹50 lakh,
          20-year loan saves roughly ₹3.8 lakh in interest. Before you
          negotiate with a bank, know your numbers. For a full walkthrough,
          see our guides on{" "}
          <Link href="/blog/how-to-calculate-emi" className="text-blue-600 dark:text-blue-400 hover:underline">
            how EMI is calculated
          </Link>{" "}
          and{" "}
          <Link href="/blog/how-to-calculate-home-loan-emi" className="text-blue-600 dark:text-blue-400 hover:underline">
            calculating home loan EMI
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This EMI Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Loan Amount (₹):</strong> The principal you plan to
            borrow — the property price minus your down payment, not the full
            property price. Entering the property value here is the most
            common mistake and overstates the EMI.
          </li>
          <li>
            <strong>Annual Rate (%):</strong> The interest rate quoted by your
            lender. Home loans typically run 8.25–9.5%, car loans 8.5–11%, and
            personal loans 10.5–18%. Use the rate offered to you, not the
            advertised "starting from" rate.
          </li>
          <li>
            <strong>Years:</strong> The repayment tenure. Longer tenures mean
            smaller EMIs but far more total interest — check both figures
            before choosing.
          </li>
        </ol>
        <p className="mb-4">
          The results show your <strong>Monthly EMI</strong>,{" "}
          <strong>Total Interest</strong> (the true cost of borrowing), and{" "}
          <strong>Total Payable</strong>. Scroll down for the amortization
          table — notice how in the early years most of each EMI goes to
          interest, which is why prepayments made early in the tenure save the
          most money. If the EMI exceeds about 40% of your monthly take-home
          income, consider a larger down payment or longer tenure.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What Is an EMI and How Is It Calculated?
        </h2>
        <p className="mb-4">
          An Equated Monthly Instalment (EMI) is the fixed amount a borrower
          pays to a lender every month until the loan is fully repaid. Each
          payment covers both principal and interest, with the interest portion
          being higher in early months and the principal portion rising over
          time — this is called a reducing-balance schedule. EMI calculators are
          used for home loans, car loans, personal loans, and education loans.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          EMI Formula
        </h3>
        <p className="mb-4">
          The standard EMI formula used by Indian banks (per RBI guidelines) is:
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          EMI = P × R × (1 + R)^N ÷ [(1 + R)^N − 1]
        </p>
        <p className="mb-4">
          Where <strong>P</strong> is the loan principal, <strong>R</strong> is
          the monthly interest rate (annual rate ÷ 12 ÷ 100), and{" "}
          <strong>N</strong> is the loan tenure in months.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          Suppose you take a home loan of ₹20,00,000 at an annual interest rate
          of 8.5% for 20 years (240 months).
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Monthly rate R = 8.5 ÷ 12 ÷ 100 = 0.007083</li>
          <li>N = 240 months</li>
          <li>
            EMI = 20,00,000 × 0.007083 × (1.007083)^240 ÷ [(1.007083)^240 − 1]
          </li>
          <li>
            <strong>Monthly EMI = ₹17,356</strong>
          </li>
          <li>Total amount paid = ₹41,65,440</li>
          <li>Total interest = ₹21,65,440 (the cost of borrowing)</li>
        </ul>
        <p className="mb-4">
          Use the calculator above to adjust the loan amount, interest rate, and
          tenure to find the EMI that fits your monthly budget.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World EMI Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Amit &amp; Sneha, Mumbai — first home loan
        </h3>
        <p className="mb-4">
          They are buying a ₹65 lakh flat with ₹15 lakh down, borrowing ₹50
          lakh at 8.5% for 20 years. The calculator shows an EMI of about{" "}
          <strong>₹43,391</strong>, with total interest of roughly ₹54 lakh —
          more than the loan itself. Testing a 15-year tenure raises the EMI
          to about ₹49,237 but cuts total interest to around ₹38.6 lakh.
          Since their combined take-home is ₹1.6 lakh a month, the 15-year EMI
          stays under the 40% threshold, saving them ₹15+ lakh.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Kiran, Delhi — used car loan
        </h3>
        <p className="mb-4">
          Kiran needs ₹8 lakh at 9.5% for 5 years. The EMI works out to about{" "}
          <strong>₹16,801</strong>, with total interest near ₹2.08 lakh.
          Extending to 7 years would drop the EMI to roughly ₹13,075 but push
          interest close to ₹2.98 lakh — for a depreciating asset, the shorter
          tenure is usually the better trade.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this EMI calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — it uses the same reducing-balance formula prescribed for
            Indian banks and NBFCs, computed with high-precision decimal
            arithmetic, so it matches bank-generated schedules to the rupee.
            Small differences can appear if your lender charges processing
            fees or rounds EMIs to the nearest ₹10.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this vs the Home Loan vs Rent calculator?
          </summary>
          <p className="pt-2">
            Use this calculator when you have decided to borrow and want the
            exact instalment and interest cost. If you are still deciding
            whether to buy at all, our{" "}
            <Link href="/home-loan-vs-rent" className="text-blue-600 dark:text-blue-400 hover:underline">
              Home Loan vs Rent calculator
            </Link>{" "}
            compares buying against renting-and-investing over the full
            horizon.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Does the EMI include property taxes or insurance?
          </summary>
          <p className="pt-2">
            No. The EMI covers only principal and interest. Budget separately
            for home insurance, property tax, society maintenance, and the
            one-time processing fee (typically 0.25–1% of the loan).
          </p>
        </details>
      </section>
    </>
  );
}
