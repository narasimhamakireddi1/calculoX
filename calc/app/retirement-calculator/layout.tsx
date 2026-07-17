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
    "Retirement Calculator India - Calculate Retirement Corpus 25x Rule | calculox",
  description:
    "Advanced retirement calculator using NISM 25x rule. Calculate retirement corpus needed, plan inflation-adjusted expenses, and get 2-phase retirement projections. India-specific.",
  keywords: [
    "retirement calculator",
    "retirement corpus calculator",
    "retirement planning calculator",
    "retirement calculator india",
    "how much need to retire",
    "retirement age calculator",
    "financial independence calculator",
    "retirement savings calculator",
    "retirement SIP calculator",
    "retirement corpus 25x rule",
    "retirement planning tool",
    "retirement expense calculator",
  ],
  alternates: { canonical: `${BASE_URL}/retirement-calculator` },
  openGraph: {
    title: "Retirement Corpus Calculator - Plan Your Retirement | calculox",
    description:
      "Free Retirement Calculator: Calculate corpus needed using 25x rule, monthly SIP required, and get inflation-adjusted projections for worry-free retirement.",
    url: `${BASE_URL}/retirement-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Retirement Corpus Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Corpus Calculator - Plan Your Retirement | calculox",
    description:
      "Calculate retirement corpus needed using 25x rule & get monthly SIP amount required for stress-free retirement.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is the 25x annual expense rule?",
    answer:
      "The 25x rule states that you need a corpus of 25 times your annual expenses to retire safely. This rule is based on the 4% safe withdrawal rate, which means you can withdraw 4% of your corpus annually (1/25th) without running out of money. For example, if your annual expenses are ₹10 lakhs, you need a retirement corpus of ₹2.5 crores.",
  },
  {
    question: "How is inflation factored into the retirement calculator?",
    answer:
      "The calculator adjusts your current monthly expenses by the inflation rate you provide (typically 5-7% for India) to calculate what your expenses will be at retirement. For example, if your monthly expense is ₹50,000 and inflation is 6%, and you retire in 10 years, your monthly expense at retirement will be approximately ₹89,542. This inflation-adjusted amount is used to calculate the corpus needed.",
  },
  {
    question: 'What does "available at retirement" mean?',
    answer:
      "This is the amount your current corpus (investments, savings) will grow to by your retirement age, assuming it grows at the annual return rate you specified. For example, if you have ₹10 lakhs today and it grows at 10% annually for 10 years, you'll have approximately ₹25.94 lakhs available at retirement. The calculator subtracts this from the corpus needed to determine the gap.",
  },
  {
    question: "How is the monthly SIP requirement calculated?",
    answer:
      "The calculator uses the Future Value of Annuity Due formula to determine how much you need to invest monthly to bridge the corpus gap. This assumes you invest at the beginning of each month and your investments grow at the specified annual return rate. The calculation accounts for compounding and ensures your total investments plus growth equals the corpus needed by retirement.",
  },
  {
    question: "What if I don't have 25 years to retirement?",
    answer:
      "The SIP requirement will be much higher if you have fewer years to retirement because you have less time for compounding. For example, if you need a ₹2 crore corpus and have only 10 years, your monthly SIP might be ₹1.2 lakhs. With 20 years, it might be ₹40,000. The calculator automatically adjusts the monthly SIP based on your time horizon and return assumptions.",
  },
  {
    question: "Can I include my expected pension in retirement planning?",
    answer:
      "The calculator assumes you need to fund 100% of your retirement through your corpus. If you have a pension, you can reduce your monthly expense amount in the calculator to reflect the gap your pension will cover. For example, if your expenses are ₹50,000 but your pension will be ₹20,000, enter ₹30,000 as your monthly expense.",
  },
];

export default function RetirementCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "Retirement Corpus Calculator",
    description:
      "Free online Retirement Calculator using 25x rule. Calculate retirement corpus needed, monthly SIP required, and get inflation-adjusted projections for retirement planning.",
    slug: "retirement-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "Retirement Calculator", href: "/retirement-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Retirement Corpus Needed",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Your Current Age",
        text: "Enter your current age (typically 25-50 years). This helps calculate how many years you have until retirement.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set Retirement Age",
        text: "Enter the age at which you plan to retire (typically 55-65 years in India). This determines your working years.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Set Life Expectancy",
        text: "Enter the age until which you want to plan for (typically 80-100 years). This ensures your corpus lasts through your entire retirement.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Enter Monthly Expenses",
        text: "Enter your current monthly expenses (e.g., ₹50,000). Include all living costs: food, housing, healthcare, entertainment, and utilities.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Enter Current Corpus",
        text: "Enter the amount you have saved/invested today (e.g., ₹5 lakhs in PPF, mutual funds, savings). This is used to calculate how much more you need.",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Set Annual Return Rate",
        text: "Enter expected annual return on your investments (typically 6-10% for balanced portfolio, 8-12% for equity-heavy, 4-6% for debt-heavy).",
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: "Set Inflation Rate",
        text: "Enter expected inflation rate (typically 5-7% for India). Your expenses will grow at this rate by retirement.",
      },
      {
        "@type": "HowToStep",
        position: 8,
        name: "Get Your Retirement Plan",
        text: "View corpus needed (25x rule), monthly SIP required, scenario analysis (6%, 10%, 14% returns), and year-by-year projections until retirement.",
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
      <CalcPageWrapper category="Finance" title="Retirement Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This Retirement Calculator
        </h2>
        <p className="mb-4">
          This free retirement calculator uses the four-step NISM (National
          Institute of Securities Markets) framework to answer the two
          questions every earner eventually faces: how large a corpus will I
          need on the day I retire, and how much must I save each month to
          get there? It models both phases of retirement — the accumulation
          years while you earn and the distribution years while you withdraw —
          with separate return assumptions for each, plus inflation, your
          existing savings, and life expectancy.
        </p>
        <p className="mb-4">
          Retirement planning is more urgent in India than almost anywhere
          else: there is no universal social security, joint-family support is
          thinning, and private-sector employees retire with only EPF, which
          alone rarely sustains three decades of expenses. Meanwhile life
          expectancy for those who reach 60 keeps rising — planning to 85 or
          90 is prudent, not pessimistic. A 30-year-old in Chennai spending
          ₹50,000 a month today will need roughly ₹2.87 lakh a month at 60
          just to maintain the same lifestyle at 6% inflation. Numbers like
          that feel abstract until you see your own — which is what this
          calculator is for.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need a Retirement Calculator
        </h2>
        <p className="mb-4">
          The most expensive retirement mistake is starting late: because of
          compounding, every five-year delay roughly doubles the monthly
          saving required for the same corpus. The second is ignoring
          inflation — savers who target "₹1 crore" as a round number discover
          it funds barely 8–10 years of expenses at 2046 prices. The third is
          assuming pre-retirement returns continue after retirement, when the
          corpus must move to safer, lower-yield assets. This calculator
          forces all three realities into the arithmetic. For the full
          methodology, read our{" "}
          <Link href="/blog/retirement-planning-corpus-nism-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
            NISM retirement corpus guide
          </Link>{" "}
          and the{" "}
          <Link href="/blog/complete-investment-planning-guide-india" className="text-blue-600 dark:text-blue-400 hover:underline">
            complete investment planning guide
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This Retirement Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Present Age / Retirement Age / Life Expectancy:</strong>{" "}
            These define your accumulation years (working) and distribution
            years (retired). When unsure, use 85–90 for life expectancy —
            outliving your corpus is the worse error.
          </li>
          <li>
            <strong>Current Monthly Expenses:</strong> What your household
            spends today, excluding EMIs that will end and children's costs
            that won't persist into retirement.
          </li>
          <li>
            <strong>Inflation rate:</strong> 6% is a reasonable Indian
            long-term assumption; healthcare inflation runs higher, so lean
            conservative.
          </li>
          <li>
            <strong>Expected returns (pre- and post-retirement):</strong> Use
            10–12% for the equity-heavy accumulation phase and 7–8% for the
            debt-heavy distribution phase. Using 12% for both is the most
            common way people fool themselves.
          </li>
          <li>
            <strong>Current savings:</strong> Existing corpus (EPF, PPF,
            mutual funds) earmarked for retirement — its future value reduces
            the fresh saving required.
          </li>
        </ol>
        <p className="mb-4">
          The results show your inflation-adjusted expenses at retirement, the
          required corpus, the future value of what you already have, the
          shortfall, and the monthly SIP needed to close it. If the SIP figure
          looks impossible, don't close the tab — test retiring two years
          later or trimming assumed expenses by 10%; small changes move the
          answer dramatically.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Calculate the Retirement Corpus You Need
        </h2>
        <p className="mb-4">
          Retirement planning requires estimating two things: how much money you
          will need each month after you stop working, and how large a savings
          corpus will sustain those withdrawals for your full retirement period.
          Because inflation erodes purchasing power over time, your current
          monthly expenses cannot be used directly — they must be projected
          forward to your retirement date using an estimated annual inflation
          rate (typically 5–7% for India).
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          The 25× Annual Expense Rule
        </h3>
        <p className="mb-4">
          The 25× rule (based on the 4% safe withdrawal rate) states that you
          need a retirement corpus equal to 25 times your annual expenses at
          retirement. This ensures you can withdraw 4% of your corpus every year
          without depleting it over a 25–30 year retirement.
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          Required Corpus = Inflation-Adjusted Annual Expenses × 25
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          Current monthly expenses: ₹50,000. You plan to retire in 20 years.
          Assumed inflation: 6% per year.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            Monthly expenses at retirement = ₹50,000 × (1.06)^20 ={" "}
            <strong>₹1,60,357/month</strong>
          </li>
          <li>Annual expenses at retirement = ₹1,60,357 × 12 = ₹19,24,284</li>
          <li>
            Required corpus = ₹19,24,284 × 25 = <strong>₹4.81 crore</strong>
          </li>
          <li>
            Monthly SIP needed (at 10% return over 20 years) ={" "}
            <strong>≈ ₹59,000/month</strong>
          </li>
        </ul>
        <p className="mb-4">
          If you already have ₹10 lakh saved and it grows at 10% over 20 years,
          it becomes ₹67 lakh — reducing the SIP requirement. Use the calculator
          above to input your exact figures and get a personalised retirement
          savings plan.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World Retirement Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Srinivas, 32, Chennai — starting from EPF alone
        </h3>
        <p className="mb-4">
          Srinivas spends ₹55,000 a month and wants to retire at 60 with
          cover till 85. With 6% inflation, his expenses at 60 will be about
          ₹2.8 lakh a month, and the calculator puts his required corpus
          around the ₹7 crore mark. His ₹8 lakh EPF balance grows meaningfully
          but covers only a fraction, leaving a monthly SIP requirement of
          roughly ₹30,000–35,000 at 11% accumulation returns. Sobering — but
          at 32 it is achievable with step-ups; at 45 it would not be.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Meena, 45, Nagpur — late start, adjusted expectations
        </h3>
        <p className="mb-4">
          Meena starts at 45 with ₹20 lakh saved and ₹40,000 monthly
          expenses. The calculator shows that retiring at 60 needs a monthly
          saving beyond her means — but retiring at 63 with a 10% expense
          trim brings the required SIP within reach. Takeaway: the calculator
          is most useful for testing trade-offs (retire later, spend less,
          save more), not for delivering a single verdict.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this retirement calculator accurate?
          </summary>
          <p className="pt-2">
            The framework follows the NISM retirement planning methodology
            used by certified financial planners, and the arithmetic is
            computed precisely. The projections are only as good as the
            inflation and return assumptions you enter — revisit them yearly
            rather than treating one run as a 30-year plan.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this vs the SIP calculator?
          </summary>
          <p className="pt-2">
            This calculator works backwards from the life you want to the
            saving you need. Once you know the monthly figure, use the{" "}
            <Link href="/sip-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              SIP calculator
            </Link>{" "}
            to model exactly how that contribution grows, including annual
            step-ups.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Does the corpus account for pension or rental income?
          </summary>
          <p className="pt-2">
            Enter only the expenses your investments must cover. If you
            expect a pension or rent covering ₹15,000 of a ₹60,000 monthly
            need, plan the corpus for the remaining ₹45,000 — this single
            adjustment often cuts the required corpus by a quarter or more.
          </p>
        </details>
      </section>
    </>
  );
}
