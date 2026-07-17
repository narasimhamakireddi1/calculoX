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
  title: "SIP Calculator - Calculate Mutual Fund Returns India 2026 | calculox",
  description:
    "Advanced SIP calculator for mutual fund investments. Calculate returns with step-up SIP, monthly investments, and 25+ year projections. RBI-compliant formulas. Free, instant results.",
  keywords: [
    "sip calculator",
    "systematic investment plan calculator",
    "mutual fund calculator",
    "sip returns calculator",
    "sip calculator india",
    "step up sip calculator",
    "monthly sip calculator",
    "investment calculator india",
    "sip formula calculator",
    "best sip calculator",
  ],
  alternates: { canonical: `${BASE_URL}/sip-calculator` },
  openGraph: {
    title: "SIP Calculator - Calculate Monthly SIP Returns Free | calculox",
    description:
      "Free SIP Calculator: Calculate Systematic Investment Plan returns, future value & wealth growth instantly. Best SIP calculator for Indian investors.",
    url: `${BASE_URL}/sip-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIP Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP Calculator - Calculate Monthly SIP Returns Free | calculox",
    description:
      "Free SIP Calculator: Calculate SIP returns, future value & wealth growth instantly.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is SIP and how does it work?",
    answer:
      "SIP (Systematic Investment Plan) is a method of investing a fixed amount in mutual funds at regular intervals (monthly/quarterly). It uses rupee-cost averaging to reduce the impact of market volatility on your investments.",
  },
  {
    question: "How is SIP return calculated?",
    answer:
      "SIP returns are calculated using the formula: FV = PMT × (((1 + r)^n - 1) / r) × (1 + r), where PMT is monthly investment, r is monthly return rate, and n is total months.",
  },
  {
    question: "What is a good SIP return rate to expect?",
    answer:
      "Historically, equity mutual funds in India have delivered 12-15% annual returns over long periods. For conservative estimates, use 10-12% for long-term SIP calculations.",
  },
  {
    question: "What is the minimum SIP amount?",
    answer:
      "Most mutual funds in India allow SIP with a minimum of ₹100-500 per month. Our SIP calculator allows you to start calculations from ₹100.",
  },
  {
    question: "What is Step-Up SIP?",
    answer:
      "Step-Up SIP is when you increase your monthly SIP amount by a fixed percentage each year (e.g., 10% annually). This is recommended to match your income growth and build wealth faster.",
  },
  {
    question: "Is this SIP calculator accurate?",
    answer:
      "The mathematics is exact — it uses the standard annuity-due future value formula used by AMFI and fund houses. The uncertainty lies in the assumed return: actual mutual fund returns vary, so projections are estimates, not guarantees.",
  },
  {
    question: "Are SIP returns taxable in India?",
    answer:
      "Yes. For equity funds, long-term capital gains (units held over 12 months) above ₹1.25 lakh a year are taxed at 12.5%; short-term gains at 20%. Each SIP instalment has its own holding period.",
  },
];

export default function SIPLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: "SIP Calculator",
    description:
      "Free online SIP Calculator to calculate Systematic Investment Plan returns for Indian investors.",
    slug: "sip-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "SIP Calculator", href: "/sip-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate SIP Returns",
    description:
      "Step-by-step guide to calculate your Systematic Investment Plan returns using our advanced calculator",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Monthly Investment Amount",
        text: "Enter the amount you plan to invest monthly in mutual funds (minimum ₹100-500 for most funds)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Expected Annual Return",
        text: "Enter the expected annual return rate (typically 10-15% for equity funds, 6-8% for debt funds)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter Investment Period",
        text: "Specify the number of years you plan to continue the SIP (5-40 years recommended for long-term wealth)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "View Results",
        text: "Get total invested amount, expected returns, final maturity value, and wealth growth projection",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Compare Scenarios",
        text: "Use sliders to adjust amounts and see how different monthly investments affect your future wealth",
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
      <CalcPageWrapper category="Finance" title="SIP Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This SIP Calculator
        </h2>
        <p className="mb-4">
          This free SIP calculator projects how much wealth your monthly mutual
          fund investments can build over 1 to 50 years. Enter what you invest
          each month, how long you plan to stay invested, and an expected
          return, and it instantly shows your total invested amount, estimated
          maturity value, and the gains earned purely from compounding — along
          with a year-by-year projection table and growth chart.
        </p>
        <p className="mb-4">
          SIPs have become the default way Indians invest in equity. AMFI data
          shows monthly SIP contributions crossing ₹25,000 crore, driven by
          salaried professionals who want market returns without timing the
          market. Yet most investors underestimate what consistency achieves: a
          28-year-old in Hyderabad putting ₹10,000 a month into an index fund
          at 12% for 20 years invests ₹24 lakh but retires that goal with
          roughly ₹1 crore. Seeing that number — before you start — is often
          the difference between vague intentions and an actual direct-debit
          mandate. This calculator also models <strong>step-up SIPs</strong>,
          where your contribution rises each year with your salary, something
          most basic calculators ignore.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need a SIP Calculator
        </h2>
        <p className="mb-4">
          The two most expensive mistakes in SIP investing are starting late
          and setting an amount by guesswork. Delaying a ₹10,000 monthly SIP by
          just five years (15 years instead of 20 at 12%) shrinks the final
          corpus from about ₹1 crore to ₹50 lakh — half the wealth for a
          five-year delay. Guessing too low is equally costly: many investors
          discover at 45 that their ₹3,000 SIP will never fund the goal they
          had in mind. Running the numbers first tells you exactly what monthly
          amount your target requires, so you can commit realistically and
          step up when income grows. For a deeper walkthrough of how SIPs
          work, read our{" "}
          <Link href="/blog/sip-calculator-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
            complete SIP guide
          </Link>{" "}
          and our comparison of{" "}
          <Link href="/blog/sip-vs-lump-sum-investment" className="text-blue-600 dark:text-blue-400 hover:underline">
            SIP vs lump sum investing
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This SIP Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Monthly Investment (₹):</strong> The amount you will
            invest every month. Most funds accept SIPs from ₹100–500; use the
            quick-select chips (₹1K–₹25K) or the slider up to ₹10 lakh.
          </li>
          <li>
            <strong>Investment Duration (Years):</strong> How long you will
            keep the SIP running. Equity SIPs work best over 7+ years —
            shorter horizons are exposed to market cycles.
          </li>
          <li>
            <strong>Expected Annual Return (%):</strong> Use 10–12% for a
            conservative equity estimate, 12–15% for aggressive equity funds,
            and 6–8% if you are modelling debt funds. Avoid plugging in a
            recent bull-market return like 25% — it will inflate the
            projection.
          </li>
          <li>
            <strong>Annual Step Up (%):</strong> The yearly percentage
            increase in your contribution. Matching this to your typical
            increment (5–10%) is the single easiest way to grow the final
            corpus without feeling the pinch today.
          </li>
        </ol>
        <p className="mb-4">
          Results update automatically as you type. <strong>Future Value</strong>{" "}
          is your projected maturity amount, <strong>Total Invested</strong> is
          the sum of every contribution, and <strong>Total Gains</strong> is
          the difference — money earned by compounding, not by you. A common
          mistake is comparing the gain percentage to an FD rate; SIP returns
          are market-linked and not guaranteed, so treat the output as a
          planning estimate, not a promise.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What Is a SIP and How Are Returns Calculated?
        </h2>
        <p className="mb-4">
          A Systematic Investment Plan (SIP) lets you invest a fixed amount in a
          mutual fund every month instead of making a large lump-sum investment.
          Because you buy fund units at different prices each month, you benefit
          from rupee-cost averaging — buying more units when prices fall and
          fewer when they rise. Over long periods, this smooths out market
          volatility and compounds wealth significantly.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          SIP Future Value Formula
        </h3>
        <p className="mb-4">
          The future value of a SIP is calculated using the annuity formula:
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          FV = PMT × [((1 + r)^n − 1) ÷ r] × (1 + r)
        </p>
        <p className="mb-4">
          Where <strong>PMT</strong> is the monthly investment,{" "}
          <strong>r</strong> is the monthly return rate (annual rate ÷ 12 ÷
          100), and <strong>n</strong> is the total number of months invested.
          The final <strong>× (1 + r)</strong> accounts for beginning-of-month
          investment.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          You invest ₹5,000 every month in an equity mutual fund for 15 years,
          expecting a 12% annual return.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Monthly rate r = 12 ÷ 12 ÷ 100 = 0.01</li>
          <li>n = 15 × 12 = 180 months</li>
          <li>
            Total invested = ₹5,000 × 180 = <strong>₹9,00,000</strong>
          </li>
          <li>
            Estimated corpus at maturity = <strong>₹25,22,880</strong>
          </li>
          <li>
            Returns earned through compounding = <strong>₹16,22,880</strong>
          </li>
        </ul>
        <p className="mb-4">
          The power of SIP is that ₹9 lakh invested becomes ₹25 lakh — nearly
          2.8× — purely through compounding. Starting early amplifies this
          effect dramatically; the same SIP over 25 years would grow to over ₹95
          lakh.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World SIP Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Priya, 32, Bengaluru — saving for a house down payment
        </h3>
        <p className="mb-4">
          Priya wants ₹45–50 lakh in 12 years for a flat down payment. She sets
          Monthly Investment to ₹15,000, Duration to 12 years, and Expected
          Return to 12%. The calculator projects a corpus of about{" "}
          <strong>₹48.3 lakh</strong> against ₹21.6 lakh invested — her goal is
          achievable without a step-up. Had she assumed she needed ₹25,000 a
          month, she might never have started.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Rohan, 25, Pune — first salary, small start
        </h3>
        <p className="mb-4">
          Rohan can spare only ₹5,000 a month but adds a 10% Annual Step Up to
          track his increments. Over 20 years at 12%, a flat ₹5,000 SIP grows
          to roughly <strong>₹50 lakh</strong>; with the 10% yearly step-up the
          projection rises well past ₹90 lakh. Takeaway: a modest SIP with a
          disciplined step-up beats a larger SIP started five years later.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this SIP calculator accurate?
          </summary>
          <p className="pt-2">
            The mathematics is exact — it uses the standard annuity-due future
            value formula used by AMFI and fund houses, computed with
            high-precision decimal arithmetic. The uncertainty lies in the
            return you assume: actual mutual fund returns vary year to year, so
            projections are estimates, not guarantees.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this instead of an FD or RD calculator?
          </summary>
          <p className="pt-2">
            Use this calculator for market-linked monthly investing (mutual
            funds). If you want guaranteed returns with zero market risk,
            compare the same monthly amount in our{" "}
            <Link href="/rd-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              RD calculator
            </Link>{" "}
            — the gap between the two projections is the premium you earn for
            accepting market risk.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Are SIP returns taxable in India?
          </summary>
          <p className="pt-2">
            Yes. For equity funds, long-term capital gains (units held over 12
            months) above ₹1.25 lakh a year are taxed at 12.5%; short-term
            gains at 20%. Each SIP instalment has its own holding period. This
            calculator shows pre-tax values.
          </p>
        </details>
      </section>
    </>
  );
}
