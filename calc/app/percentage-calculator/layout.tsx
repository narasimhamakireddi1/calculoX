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
    "Percentage Calculator India - Calculate Discount, Markup & Change | calculox",
  description:
    "Free 6-in-1 percentage calculator tool. Calculate percentage of, discount, markup, percentage change, reverse %, sequential %. Instant results for all calculations.",
  keywords: [
    "percentage calculator",
    "percentage of calculator",
    "discount calculator",
    "percentage change calculator",
    "markup calculator",
    "percentage off calculator",
    "reverse percentage calculator",
    "percentage increase calculator",
    "percentage decrease calculator",
    "compound percentage calculator",
  ],
  alternates: { canonical: `${BASE_URL}/percentage-calculator` },
  openGraph: {
    title: "Percentage Calculator - Calculate Any Percentage | calculox",
    description:
      "Free Percentage Calculator: 6 tools to calculate discount, percentage change, reverse percentage & more instantly.",
    url: `${BASE_URL}/percentage-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Percentage Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Calculator - Calculate Percentages | calculox",
    description:
      "Free Percentage Calculator: Calculate percentage change, discount, markup instantly.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "How do I calculate X% of Y?",
    answer:
      "Formula: (X/100) × Y. For example, 20% of 500 = (20/100) × 500 = 100.",
  },
  {
    question: "How do I calculate percentage change?",
    answer:
      "Formula: ((New Value - Old Value) / Old Value) × 100. For example, from 50 to 75: ((75-50)/50) × 100 = 50% increase.",
  },
  {
    question: "What is reverse percentage calculation?",
    answer:
      "If you know the final amount and the percentage applied, find the original amount. Formula: (Final Amount × 100) / Percentage.",
  },
  {
    question: "How do I calculate discount?",
    answer:
      "Discount amount = (Discount % / 100) × Original Price. Final Price = Original Price - Discount Amount.",
  },
  {
    question: "What is markup vs margin?",
    answer:
      "Markup: (Profit / Cost Price) × 100. Margin: (Profit / Selling Price) × 100. They measure profit differently - markup on cost, margin on revenue.",
  },
];

export default function PercentageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "Percentage Calculator",
    description:
      "Free Percentage Calculator with 6 tools for percentage calculations, discount, markup and percentage change.",
    slug: "percentage-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "Percentage Calculator", href: "/percentage-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Percentages",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose Calculation Type",
        text: "Select which percentage calculation you need: hike/discount, X% of Y, percentage change, reverse %, or sequential percentages",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Required Values",
        text: "Fill in the values based on your chosen calculation (original amount, percentage, new value, etc.)",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Get Instant Results",
        text: "See calculated percentage value, percentage breakdown in pie chart, and natural language explanation",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Switch Calculation Types",
        text: "Use the quick-access buttons to switch between different percentage calculation methods",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Export Results",
        text: "Copy results to clipboard or download as PDF with input data for records",
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
      <CalcPageWrapper category="Utility" title="Percentage Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This Percentage Calculator
        </h2>
        <p className="mb-4">
          This free percentage calculator bundles six independent tools into
          one page: find X% of a number, work out what percent one number is
          of another, calculate a percentage increase or decrease (salary
          hike, price rise), reverse a percentage to find the original value,
          compute discounts, and chain sequential percentages correctly. Pick
          the mode that matches your question, enter two or three numbers,
          and the answer appears instantly with the working shown.
        </p>
        <p className="mb-4">
          Percentages are the arithmetic Indians encounter most — appraisal
          letters ("your revised CTC reflects a 12% increase"), festival-sale
          banners ("flat 40% + extra 10%"), mark sheets, GST lines on every
          bill, and mutual fund statements. They're also where everyday math
          most often goes wrong: a Flipkart "40% + 10%" stack is a 46%
          discount, not 50%; a salary that grew from ₹45,000 to ₹52,000 is a
          15.6% hike, not "about 20%". Each mode here exists because of a
          real situation where the mental shortcut gives the wrong answer.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need a Percentage Calculator
        </h2>
        <p className="mb-4">
          Percentage mistakes are small individually and expensive
          cumulatively. Accepting an appraisal without computing the true
          hike percentage weakens your negotiation; misreading a stacked
          discount overstates the deal by hundreds of rupees; and reverse
          percentages — "the bill is ₹1,180 including 18% GST, what was the
          base?" — are genuinely counterintuitive, because dividing by 1.18
          is not the same as subtracting 18%. Verifying takes ten seconds and
          builds the numeric confidence that better financial decisions rest
          on. For every formula with worked examples, see our{" "}
          <Link href="/blog/percentage-calculator-guide" className="text-blue-600 dark:text-blue-400 hover:underline">
            percentage calculation guide
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This Percentage Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Pick the mode</strong> that matches your question — the
            tabs are worded in plain language ("What % is A of B", "Increase
            / Decrease", "Reverse", "Discount", "Sequential").
          </li>
          <li>
            <strong>Enter the values</strong> in the labelled fields; each
            mode asks only for the numbers it needs, and the input labels
            change to match (original value, new value, percentage, and so
            on).
          </li>
          <li>
            <strong>Read the result and the working</strong> — the formula
            used is displayed so you can learn it or verify it by hand.
          </li>
        </ol>
        <p className="mb-4">
          The classic mistake to avoid is choosing the wrong base: a rise
          from ₹40,000 to ₹50,000 is a 25% increase (base ₹40,000), but the
          fall from ₹50,000 to ₹40,000 is only a 20% decrease (base
          ₹50,000). Percent changes are always relative to the{" "}
          <em>starting</em> value — when in doubt, the Increase/Decrease mode
          gets it right for you.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Percentage Calculations Explained
        </h2>
        <p className="mb-4">
          Percentages express a quantity as a fraction of 100 and appear in
          everyday financial decisions — salary hikes, GST calculations, EMI
          interest, investment returns, discounts, and profit margins. This
          calculator covers six distinct percentage calculation types so you can
          solve any percentage problem without remembering individual formulas.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Core Percentage Formulas
        </h3>
        <ul className="list-disc pl-5 mb-4 space-y-2 text-sm">
          <li>
            <strong>X% of Y:</strong> Result = (X ÷ 100) × Y
          </li>
          <li>
            <strong>What % is A of B:</strong> Percentage = (A ÷ B) × 100
          </li>
          <li>
            <strong>Percentage increase/decrease:</strong> Change% = ((New −
            Old) ÷ Old) × 100
          </li>
          <li>
            <strong>Reverse percentage (find original):</strong> Original =
            Final × 100 ÷ (100 ± Change%)
          </li>
          <li>
            <strong>Discount amount:</strong> Discount = (Rate ÷ 100) × Original
            Price
          </li>
          <li>
            <strong>Sequential %:</strong> Apply percentages one after another
            (e.g., 10% then 5%)
          </li>
        </ul>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Examples
        </h3>
        <p className="mb-3">
          <strong>Example 1 — Salary hike:</strong> Your salary increases from
          ₹40,000 to ₹50,000. Percentage increase = ((50,000 − 40,000) ÷ 40,000)
          × 100 = <strong>25%</strong>.
        </p>
        <p className="mb-3">
          <strong>Example 2 — Discount:</strong> A ₹3,200 item is offered at 15%
          off. Discount = (15 ÷ 100) × 3,200 = ₹480. Final price = ₹3,200 − ₹480
          = <strong>₹2,720</strong>.
        </p>
        <p className="mb-3">
          <strong>Example 3 — Reverse percentage:</strong> A price of ₹1,180
          includes 18% GST. Original base price = 1,180 ÷ 1.18 ={" "}
          <strong>₹1,000</strong>.
        </p>
        <p className="mb-4">
          Note that sequential percentage changes are not additive: a 10%
          increase followed by a 10% decrease does not return to the original
          value — it gives 99% of the original (a net −1% effect). The
          sequential mode in this calculator handles this correctly.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Sameer, Gurgaon — checking an appraisal letter
        </h3>
        <p className="mb-4">
          Sameer's CTC moved from ₹9,60,000 to ₹10,80,000 and HR called it
          "one of the best hikes in the band". The Increase mode shows{" "}
          <strong>12.5%</strong> — decent, but below the 15% a competing
          offer implied. Armed with the exact number, he negotiated a joining
          bonus instead of arguing feelings.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Tara, Mumbai — festival sale stacking
        </h3>
        <p className="mb-4">
          A ₹24,000 washing machine is listed at "30% off + extra 10% on
          card". Sequential mode shows the true price: ₹24,000 → ₹16,800 →{" "}
          <strong>₹15,120</strong> — a 37% total discount, not 40%. The ₹720
          difference isn't huge, but knowing it kept her from overvaluing the
          card offer against a flat ₹15,000 price elsewhere. Takeaway:
          stacked percentages always total less than their sum.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this percentage calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — every mode is a closed-form formula computed with
            high-precision decimal arithmetic; there is no rounding until
            the displayed result. The working is shown so you can verify any
            answer by hand.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Which mode do I use for GST on a bill?
          </summary>
          <p className="pt-2">
            Reverse mode extracts the base from a GST-inclusive total. But if
            you're doing GST regularly — invoices, CGST/SGST splits — the
            dedicated{" "}
            <Link href="/gst-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              GST calculator
            </Link>{" "}
            does it in one step with the proper tax breakdown.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Why doesn't a 20% rise then 20% fall return to the start?
          </summary>
          <p className="pt-2">
            Because the fall applies to a bigger base. ₹100 + 20% = ₹120;
            ₹120 − 20% = ₹96. Percent changes compound multiplicatively
            (1.20 × 0.80 = 0.96), which is exactly what Sequential mode
            calculates.
          </p>
        </details>
      </section>
    </>
  );
}
