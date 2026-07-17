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
    { name: "Calculators", href: "/" },
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
      <AdUnit slot={AD_SLOTS.calcAboveFold} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <CalcPageWrapper category="Finance" title="Tax Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This Income Tax Calculator
        </h2>
        <p className="mb-4">
          This free income tax calculator computes your exact tax liability for
          FY 2025-26 (AY 2026-27) under both the New and Old regimes
          side-by-side, so you can see which one leaves more money in your
          hands. It handles salary income, house property, other sources, HRA
          exemption with metro/non-metro rules, and nine deduction categories
          including 80C, 80D, and home loan interest — using the slab rates
          from the Finance Act 2025.
        </p>
        <p className="mb-4">
          Every April, lakhs of Indian employees are asked by their HR portal
          to pick a tax regime for the year — and most pick blindly. The
          choice is not trivial: for a typical ₹15 lakh salary, the gap
          between regimes can exceed ₹40,000 a year depending on how much you
          invest in 80C instruments, pay in rent, or pay as home loan
          interest. A Gurgaon renter claiming full HRA may save more in the
          Old regime, while a Bengaluru techie with no deductions is almost
          always better off in the New regime. This calculator answers that
          question with your actual numbers in under a minute.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need an Income Tax Calculator
        </h2>
        <p className="mb-4">
          Choosing the wrong regime is a silent, recurring cost — you pay the
          extra tax every single month through TDS and only notice (if ever)
          at filing time. The other common mistake is investing in tax-saving
          products you don't need: locking ₹1.5 lakh into an ELSS or PPF for
          80C benefits is pointless if the New regime is already cheaper for
          you. Run both regimes here before your investment declaration, not
          after. For detailed guidance, read{" "}
          <Link href="/blog/how-to-calculate-income-tax-india" className="text-blue-600 dark:text-blue-400 hover:underline">
            how to calculate income tax in India
          </Link>
          ,{" "}
          <Link href="/blog/new-vs-old-tax-regime-comparison" className="text-blue-600 dark:text-blue-400 hover:underline">
            our New vs Old regime comparison
          </Link>
          , and{" "}
          <Link href="/blog/tax-saving-strategies-salaried-employees" className="text-blue-600 dark:text-blue-400 hover:underline">
            tax-saving strategies for salaried employees
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This Tax Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Gross Salary:</strong> Your total annual salary before any
            deductions — the CTC minus employer PF and gratuity, or simply the
            "gross" figure on your salary slip × 12.
          </li>
          <li>
            <strong>House Property / Other Sources:</strong> Add rental income
            or interest income (savings account, FDs) if any. Leaving out FD
            interest is the most common cause of a surprise tax demand later.
          </li>
          <li>
            <strong>HRA details (Old regime):</strong> Enter Basic Salary, HRA
            Received, annual Rent Paid, and select metro or non-metro city.
            The calculator applies the least-of-three HRA exemption rule
            automatically.
          </li>
          <li>
            <strong>Deductions (Old regime):</strong> Fill in 80C (PF, ELSS,
            LIC — capped at ₹1.5 lakh), 80D health insurance, home loan
            interest, NPS, and other applicable sections.
          </li>
          <li>
            <strong>Age group:</strong> Select your bracket — senior citizens
            get higher exemption limits under the Old regime.
          </li>
        </ol>
        <p className="mb-4">
          The results panel shows tax under both regimes, the effective tax
          rate, and a clear verdict on which regime saves you more and by how
          much. Standard deduction (₹75,000 New / ₹50,000 Old) and the 4%
          health-and-education cess are applied automatically — do not
          subtract them yourself before entering your salary.
        </p>

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
        <p className="mb-4">
          Under the Old Regime with ₹1.5L 80C + ₹25,000 80D + ₹50,000 standard
          deduction, total deductions can reach ₹2.25 lakh, reducing taxable
          income and potentially saving ₹20,000–₹40,000 in tax. Use the
          calculator to compare both regimes for your exact situation.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World Tax Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Ananya, 27, Bengaluru — ₹12.75 lakh salary, no investments
        </h3>
        <p className="mb-4">
          Ananya rents a flat but has no 80C investments or health insurance.
          Under the New regime, the ₹75,000 standard deduction brings her
          taxable income to ₹12 lakh — fully covered by the Section 87A
          rebate, so her tax is <strong>zero</strong>. Under the Old regime
          she would owe well over ₹1 lakh. Verdict: New regime, and no need to
          lock money into tax-saving products she doesn't want.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Rajesh, 41, Delhi — ₹18 lakh salary, heavy deductions
        </h3>
        <p className="mb-4">
          Rajesh pays ₹25,000/month rent, invests the full ₹1.5 lakh in 80C,
          pays ₹28,000 for family health insurance (80D), and contributes
          ₹50,000 to NPS. With HRA exemption plus ₹2.28 lakh of deductions,
          his Old-regime taxable income drops sharply — the calculator shows
          the Old regime beating the New by roughly ₹15,000–30,000 depending
          on his exact HRA figures. Takeaway: high rent + maxed deductions is
          the classic Old-regime profile; always verify with your own numbers.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this tax calculator accurate for FY 2025-26?
          </summary>
          <p className="pt-2">
            Yes — slab rates, the ₹75,000 standard deduction, Section 87A
            rebate, marginal relief, and the 4% cess follow the Finance Act
            2025 as published by the Income Tax Department. It is an estimate
            for planning; your final liability can differ with capital gains,
            surcharge above ₹50 lakh, or employer-specific perquisites.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Can I switch between the New and Old regime every year?
          </summary>
          <p className="pt-2">
            Salaried taxpayers can choose either regime each year when filing
            their return, regardless of what they told their employer (the
            employer choice only affects monthly TDS). Business income earners
            have restrictions on switching back after opting out of the New
            regime.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this instead of the retirement calculator?
          </summary>
          <p className="pt-2">
            Use this calculator for your current-year tax liability and regime
            choice. For long-term planning — how much corpus you need and how
            tax-advantaged instruments like NPS fit in — use our{" "}
            <Link href="/retirement-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              retirement calculator
            </Link>
            .
          </p>
        </details>
      </section>
    </>
  );
}
