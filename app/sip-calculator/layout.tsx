import type { Metadata } from "next";

import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";
import { CalcPageWrapper } from "@/components/layout/CalcPageWrapper";

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
      <CalcPageWrapper category="Finance">{children}</CalcPageWrapper>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
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
        <p>
          The power of SIP is that ₹9 lakh invested becomes ₹25 lakh — nearly
          2.8× — purely through compounding. Starting early amplifies this
          effect dramatically; the same SIP over 25 years would grow to over ₹95
          lakh.
        </p>
      </section>
    </>
  );
}
