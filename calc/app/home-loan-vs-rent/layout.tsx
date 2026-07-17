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
    "Buy vs Rent Calculator India - Compare Home Loan vs Renting | calculox",
  description:
    "Smart buy vs rent calculator comparing home ownership vs renting with 20-year projections. Includes break-even point, tax benefits (24b), and opportunity cost analysis.",
  keywords: [
    "buy vs rent calculator",
    "home loan vs rent",
    "should i buy or rent",
    "home affordability calculator",
    "property investment calculator",
    "buy vs rent analysis",
    "home ownership cost calculator",
    "rent vs buy india",
    "EMI vs rent comparison",
    "break-even analysis home",
    "Section 24(b) tax calculator",
    "rent vs buy net worth",
  ],
  alternates: { canonical: `${BASE_URL}/home-loan-vs-rent` },
  openGraph: {
    title: "Buy vs Rent Calculator - Opportunity Cost Framework | calculox",
    description:
      "Compare buying vs renting with parallel financial tracks. Calculate buyer net worth vs renter portfolio, break-even year, and tax benefits.",
    url: `${BASE_URL}/home-loan-vs-rent`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Buy vs Rent Opportunity Cost Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy vs Rent Calculator - Opportunity Cost Framework | calculox",
    description:
      "Compare buying vs renting with parallel financial tracks. Calculate buyer net worth vs renter portfolio, break-even year, and tax benefits.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is the opportunity cost framework?",
    answer:
      "The opportunity cost framework compares two parallel financial tracks over 20 years: (1) Buyer: Invests down payment, pays EMI + maintenance, property appreciates; (2) Renter: Invests down payment + EMI difference into equity/mutual funds (12% annual return). The calculator shows which track yields higher net worth. This approach reveals that renting can beat buying when investment returns exceed property appreciation + tax benefits.",
  },
  {
    question: "Why does the renter invest the down payment?",
    answer:
      "The down payment represents capital the buyer locks into the property. A renter with the same capital would invest it in diversified assets (SIP/FD/mutual funds). Additionally, the renter invests the EMI difference each month (since rent is often lower than EMI). Over 20 years, compound growth in these investments can exceed property appreciation. This realistic comparison levels the playing field between buying and renting.",
  },
  {
    question: "When does renting beat buying mathematically?",
    answer:
      "Renting wins when: (1) Property appreciation < 6% p.a. (below market growth), (2) EMI > Monthly Rent by large margin (>₹10K difference), (3) Comparison period is long (15-20 years, giving compound growth time), (4) Investment returns are high (10%+ p.a. in equities), (5) Rent increase is low (<5% p.a.). In expensive cities like Mumbai/Delhi, renting often wins by ₹50L-₹1Cr over 20 years.",
  },
  {
    question: "What is Section 24(b) and how does it help buyers?",
    answer:
      'Section 24(b) allows home loan interest deduction up to ₹2,00,000 per year on self-occupied properties under the Income Tax Act. If your income tax rate is 20%, a ₹2L deduction saves ₹40,000 annually (₹8L saved over 20 years). This calculator includes this benefit—buyers with higher tax brackets (30-40%) gain ₹6-8L extra advantage. Toggle "Apply Tax Benefit" and adjust your tax bracket to see the impact.',
  },
  {
    question: "How accurate is this 20-year projection?",
    answer:
      "The calculator is highly accurate for: (1) EMI calculations (uses standard reducing-balance formula), (2) Property appreciation projections (assumes constant % growth yearly), (3) Rent escalation (compounds monthly), (4) Investment returns (monthly compounding). It assumes: constant interest rates, no prepayment, inflation-adjusted expenses, and doesn't include selling costs, property taxes, or insurance (you can estimate these separately). Best used for decision-making, not absolute forecasting.",
  },
];

export default function HomeLoanVsRentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "Home Loan vs Rent Calculator",
    description:
      "Free calculator to compare buying vs renting. Calculate EMI, total costs, break-even point, and property appreciation for informed housing decisions.",
    slug: "home-loan-vs-rent",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "Home Loan vs Rent", href: "/home-loan-vs-rent" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Use Buy vs Rent Opportunity Cost Calculator",
    totalTime: "PT4M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Tab 1 - Property Details",
        text: "Enter (1) Property Value (₹10L-₹10Cr range, e.g., ₹80L for an average Indian home), (2) Down Payment % (5-100%, typically 20-30%). The calculator shows down payment amount in rupees. This capital would otherwise be invested by the renter.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Tab 2 - Loan & Rent Details",
        text: "Enter (1) Home Loan Interest Rate (current 7-9.5% depending on bank), (2) Loan Tenure (15-20 years typical), (3) Monthly Rent (current rent you'd pay if renting), (4) Annual Rent Increase (5-7% typical in Indian cities). Calculator computes monthly EMI automatically.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Tab 3 - Assumptions & Tax Benefits",
        text: "Enter (1) Property Appreciation Rate (5-7% typical), (2) Opportunity Investment Return (8-12% for equities/mutual funds), (3) Inflation Rate (5-6% typical), (4) Comparison Timeline (5-20 years), (5) Toggle Section 24(b) Tax Benefit and set your Income Tax Bracket (10-45%).",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Review Hero Metrics",
        text: "See three key cards: (1) Monthly EMI (your buyer monthly cost), (2) Break-Even Year (when buyer net worth exceeds renter net worth, if ever), (3) Net Advantage (which option wins and by how much in rupees and %).",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Analyze Charts",
        text: "View dual-track comparison: (1) Net Worth Chart (buyer net worth vs renter investment portfolio growth over 20 years, with break-even line marked), (2) Cumulative Cost Chart (total buyer outflow vs renter rent paid), (3) Year-by-year projection table showing all metrics.",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Review Winner Banner",
        text: "See clear verdict: which option (buying or renting) wins financially, by how much (absolute rupees), and percentage advantage. This accounts for property appreciation, investment returns, rent escalation, EMI, maintenance, and Section 24(b) tax benefits.",
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: "Export and Share Results",
        text: "Export as PDF with all inputs and results, or copy to clipboard. Share with spouse, financial advisor, or real estate agent to support your buy-vs-rent decision.",
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
      <CalcPageWrapper category="Finance" title="Home Loan vs Rent">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This Home Loan vs Rent Calculator
        </h2>
        <p className="mb-4">
          This calculator answers India's most emotionally loaded money
          question with arithmetic instead of opinion: after 15–25 years, will
          you be wealthier having bought a home or having rented and invested
          the difference? It simulates both paths month by month — the buyer's
          EMI, maintenance, property appreciation, and Section 24(b) tax
          benefit against the renter's escalating rent and the investment
          growth of the down payment plus the monthly EMI–rent gap — and shows
          the break-even point where one path overtakes the other.
        </p>
        <p className="mb-4">
          The pressure to buy is uniquely strong in India — from family,
          from "rent is money down the drain" folk wisdom, and from watching
          city prices climb. Yet in Mumbai, Delhi NCR, and Bengaluru,
          rental yields run just 2.5–3.5% of property value, meaning renting
          the same flat often costs less than half the EMI to own it. Whether
          the difference, invested in equity, beats the property's
          appreciation depends entirely on the numbers — city, rate,
          appreciation, and how long you stay. That's a 13-input problem no
          one should solve by gut feel.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need This Calculator
        </h2>
        <p className="mb-4">
          The costliest version of this mistake is buying early in your
          career, paying stamp duty and registration (7–8% of the property
          value, unrecoverable), then relocating for work within five years —
          the break-even on buying almost never arrives that fast. The
          opposite error is renting for decades in a city where you'll
          definitely stay, while property appreciation compounds beyond
          reach. Neither wisdom is universal; run your own numbers before an
          ₹80 lakh commitment. For the full framework, read our{" "}
          <Link href="/blog/home-loan-vs-rent-financial-analysis" className="text-blue-600 dark:text-blue-400 hover:underline">
            buy vs rent financial analysis
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Property Value &amp; Down Payment:</strong> The full
            purchase price and what you'd pay upfront (banks require at least
            10–20%). The down payment matters doubly — it's also the lump sum
            the renter track invests instead.
          </li>
          <li>
            <strong>Loan Interest Rate &amp; Loan Tenure:</strong> Your home
            loan terms; 8.25–9.5% and 20 years are typical today.
          </li>
          <li>
            <strong>Initial Monthly Rent:</strong> The actual rent for an
            equivalent home in the same locality — not a smaller flat. Rent
            escalation (typically 5–8%/year) is applied automatically.
          </li>
          <li>
            <strong>Property appreciation &amp; investment return:</strong>{" "}
            The two assumptions that decide the verdict. Indian residential
            property has historically appreciated 5–8% annually in most
            cities; equity has returned 11–13%. Test both optimistic and
            pessimistic pairs.
          </li>
          <li>
            <strong>Tax Benefit:</strong> Keep Section 24(b) enabled if
            you'll claim the home loan interest deduction (Old regime, up to
            ₹2 lakh/year on self-occupied property).
          </li>
        </ol>
        <p className="mb-4">
          The verdict shows both net worths, the winner, and the year-by-year
          gap. The most common misreading is treating the result as permanent
          — a 1% change in appreciation can flip it, so check how much
          daylight there is between the two outcomes, not just who wins.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Should You Buy a Home or Continue Renting? The Numbers
        </h2>
        <p className="mb-4">
          The buy-versus-rent decision is one of the most significant financial
          choices an Indian household makes. Common wisdom says &quot;buying is
          always better than renting,&quot; but this is not mathematically true
          in all cases. The correct answer depends on property price, loan
          interest rate, expected appreciation, current rent, and — critically —
          what the down payment and EMI-rent difference could earn if invested
          instead. This calculator uses an opportunity cost framework to compare
          both paths objectively.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          How the Comparison Works
        </h3>
        <p className="mb-4">
          Two parallel financial tracks are simulated over your chosen timeline
          (typically 20 years):
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <strong>Buyer track:</strong> Pays down payment + monthly EMI +
            maintenance. Property appreciates in value. Section 24(b) provides
            tax deduction on home loan interest up to ₹2 lakh/year.
          </li>
          <li>
            <strong>Renter track:</strong> Invests the down payment in mutual
            funds/equity. Invests the monthly difference between EMI and rent.
            Rent escalates annually.
          </li>
        </ul>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          Property value: ₹60,00,000. Down payment: 20% = ₹12,00,000. Home loan:
          ₹48,00,000 at 8.5% for 20 years. Monthly rent for equivalent property:
          ₹22,000.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            Monthly EMI = ₹41,688. Rent = ₹22,000. Monthly difference = ₹19,688
            (renter invests this)
          </li>
          <li>
            Renter also invests ₹12 lakh down payment at 10% p.a. in equity
          </li>
          <li>
            After 20 years: Buyer net worth (property value minus loan) ≈ ₹1.49
            crore
          </li>
          <li>
            Renter net worth (down payment + monthly investments) ≈ ₹1.75 crore
          </li>
          <li>
            <strong>Renter wins by ≈ ₹26 lakh in this scenario</strong>
          </li>
        </ul>
        <p className="mb-4">
          Results reverse if property appreciates above 8% p.a. or if the
          investment return assumption is lowered. Change any assumption in the
          calculator to see how sensitive the outcome is to your specific city
          and property type.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World Scenarios
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Aditya, 29, Bengaluru — mobile career, expensive market
        </h3>
        <p className="mb-4">
          Aditya is eyeing a ₹90 lakh flat in Whitefield that rents for
          ₹28,000 a month — a rental yield under 4%. With 20% down, an 8.5%
          loan, and equity returns at 12%, the renter track wins by a wide
          margin over 15 years, and the break-even year never arrives within
          his likely stay. Since his career may move him to Hyderabad or
          abroad, renting and investing the ₹18 lakh down payment is the
          clear call today.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          The Sharmas, 38, Indore — settled family, cheaper market
        </h3>
        <p className="mb-4">
          In Indore the same quality home costs ₹55 lakh and rents for
          ₹18,000 — a much higher yield — and the family will stay 25+
          years. With rent escalating 7% annually and modest 6.5% property
          appreciation, the buyer track overtakes the renter around year
          11–13 and wins comfortably by year 25. Takeaway: the same
          calculator, honestly used, gives opposite answers in different
          cities and life stages.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this buy vs rent calculator accurate?
          </summary>
          <p className="pt-2">
            The simulation is exact month-by-month arithmetic — EMI
            amortization, rent escalation, and investment compounding are all
            computed precisely. The verdict's reliability depends on your
            appreciation and return assumptions, which is why testing a range
            matters more than any single run.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this vs the EMI calculator?
          </summary>
          <p className="pt-2">
            Use this while deciding <em>whether</em> to buy. Once you've
            decided, the{" "}
            <Link href="/emi-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              EMI calculator
            </Link>{" "}
            gives you the detailed instalment and amortization schedule for
            structuring the loan itself.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Does the comparison include stamp duty and registration?
          </summary>
          <p className="pt-2">
            Factor them into your inputs — stamp duty and registration
            typically add 7–8% to the purchase cost in most states, and
            brokerage adds to the renter's side. Including them in the
            property cost makes the buyer track realistic.
          </p>
        </details>
      </section>
    </>
  );
}
