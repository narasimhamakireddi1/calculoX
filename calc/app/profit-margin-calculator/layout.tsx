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
  title: "Profit Margin Calculator - Calculate Markup & GST Impact | calculox",
  description:
    "Free profit margin & markup calculator for Indian retailers & businesses. Calculate gross profit, margin %, markup % with GST (5/12/18/28%) impact analysis. Cost & price-driven modes.",
  keywords: [
    "profit margin calculator",
    "markup calculator",
    "profit calculator",
    "gst calculator with margin",
    "business margin calculator",
    "markup vs margin calculator",
    "gross profit calculator",
    "pricing calculator with gst",
    "price calculator india",
    "GST profit impact",
    "selling price calculator",
    "cost price calculator",
  ],
  alternates: { canonical: `${BASE_URL}/profit-margin-calculator` },
  openGraph: {
    title: "Profit Margin & Markup Calculator - GST Impact Analysis | calculox",
    description:
      "Calculate markups, margins, and GST impact. 4 calculation modes: Markup→Margin, Margin→Markup, Cost&Revenue, GST Analysis. Perfect for retail, e-commerce, and manufacturing businesses.",
    url: `${BASE_URL}/profit-margin-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Profit Margin & Markup Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Profit Margin & Markup Calculator - Calculate Profits & GST | calculox",
    description:
      "Calculate profit margins, markups, and GST impact with advanced analysis tools. Includes 5-year projection and GST rate comparison.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is the difference between markup and profit margin?",
    answer:
      "Markup is the percentage added to cost price to calculate selling price: (Profit / Cost Price) × 100. Margin is the percentage of profit relative to selling price: (Profit / Selling Price) × 100. Example: ₹100 cost with ₹30 profit = 30% markup but 23% margin (30/130 × 100). Markup is always higher than margin for the same profit.",
  },
  {
    question: "How does GST affect my profit margin?",
    answer:
      "GST impact depends on your GST registration status. If registered, you can claim input credit and GST is neutral. If not registered, GST becomes a cost that reduces profit. Example: ₹100 selling price at 18% GST = ₹18 GST cost to you if not credited = ₹18 reduction in profit. Calculator shows impact across 5 GST rates (0%, 5%, 12%, 18%, 28%).",
  },
  {
    question: "Which calculation mode should I use?",
    answer:
      "Choose based on what you know: (1) Markup→Margin: If you know the markup %, find margin %. (2) Margin→Markup: If you want a target margin %, find required markup. (3) Cost&Revenue: If you know both cost price and selling price, calculate profit %. (4) GST Impact: Analyze how different GST rates affect profitability.",
  },
  {
    question: "What is a healthy profit margin for my business?",
    answer:
      "Healthy margins vary by industry: Electronics 5-15%, Fashion/Clothing 25-50%, Food/F&B 15-25%, Software/SaaS 70-90%, Retail 15-30%. Online commerce typically aims for 20-40% gross margin (before operating expenses). Ensure your margin covers: Operating costs (30%), Taxes (25%), Growth (15%), Profit (20-30%).",
  },
  {
    question: "How do I find the selling price if I know my target margin?",
    answer:
      "Use the Margin→Markup mode: Enter your target margin % and cost price. The calculator converts it to required markup. Example: 30% target margin + ₹100 cost = 42.9% markup needed = ₹142.90 selling price. Formula: Selling Price = Cost Price / (1 - Margin%). This ensures you achieve your target profit percentage.",
  },
  {
    question: "How does the 5-year profit projection work?",
    answer:
      "The projection multiplies your per-unit profit by number of units sold per year, then extends across 5 years. Example: ₹30 profit/unit × 1000 units/year = ₹30K Year 1 profit, ₹60K Year 2, ₹150K Year 5. This shows cumulative profit growth over time for business planning and forecasting.",
  },
];

export default function ProfitMarginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSchema = generateWebApplicationSchema({
    name: "Profit Margin & Markup Calculator",
    description:
      "Advanced profit margin, markup, and GST impact calculator with 4 computation modes. Calculate markups, margins, GST effects, and 5-year profit projections for Indian businesses.",
    slug: "profit-margin-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/" },
    { name: "Profit Margin Calculator", href: "/profit-margin-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Use Profit Margin & Markup Calculator",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select Calculation Mode",
        text: "Choose from 4 modes: (1) Markup→Margin: Convert markup % to profit margin %, (2) Margin→Markup: Find markup % for target margin, (3) Cost&Revenue: Enter cost and selling price to calculate profit, (4) GST Impact: Analyze how different GST rates affect profits.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Cost Price",
        text: "Enter the cost price of your product in rupees (₹). This is what you pay to manufacture or buy the product. Range: ₹1 to ₹100,000.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter Mode-Specific Values",
        text: "Depending on selected mode, enter: Markup % (mode 1), Margin % (mode 2), Selling Price (mode 3), or GST Rate (mode 4). Use sliders for quick adjustment or type exact values.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Set Units Per Year",
        text: "Enter expected annual sales volume (number of units) for 5-year profit projection. Range: 10 to 100,000 units/year.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Review Results",
        text: "Calculator instantly shows: Profit per unit, Markup %, Profit Margin %, GST amount (if applicable), and key financial metrics in color-coded cards.",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Analyze Charts",
        text: "View profit breakdown pie chart showing Cost vs Profit proportion, and 5-year line chart showing Revenue, Cost, and Profit growth.",
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: "Compare GST Scenarios",
        text: "In GST Impact mode, view comparison table showing profit effects across 5 different GST rates (0%, 5%, 12%, 18%, 28%) to understand tax impact.",
      },
      {
        "@type": "HowToStep",
        position: 8,
        name: "Export Results",
        text: "Export calculations as PDF or copy to clipboard to share with accountant, business partners, or save for records.",
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
      <CalcPageWrapper category="Finance" title="Profit Margin Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This Profit Margin &amp; Markup Calculator
        </h2>
        <p className="mb-4">
          This free calculator handles both directions of the pricing problem:
          enter a cost price and selling price to see your margin and markup,
          or enter a cost price and target margin (or markup) to get the
          selling price you should charge. Crucially for Indian sellers, it
          also handles GST — telling you your real margin whether your price
          is GST-inclusive (MRP-style retail) or GST-exclusive (B2B
          invoicing), and warning when GST silently dilutes your margin.
        </p>
        <p className="mb-4">
          India runs on small business — 6+ crore MSMEs, kirana stores,
          boutique sellers, Meesho and Amazon resellers, cloud kitchens — and
          a large share of them price by copying competitors or adding a
          round number to cost. That works until it doesn't: an online seller
          paying 18% GST out of an MRP, a marketplace commission, and shipping
          can believe they earn 30% while actually clearing 8%. The margin vs
          markup confusion alone (a 25% markup is only a 20% margin) has sunk
          countless pricing spreadsheets. This calculator makes the real
          number visible before you print the price tag.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need This Calculator
        </h2>
        <p className="mb-4">
          Underpricing is the silent killer of small businesses — unlike a
          bad month, it compounds invisibly on every sale. The three mistakes
          this tool catches: quoting markup when a buyer asks for margin
          (overstating profitability to yourself), computing margin on a
          GST-inclusive price (inflating it by the tax you must remit), and
          setting a "target margin" price that ignores GST treatment
          entirely. To know what margin your industry actually sustains —
          groceries run 2–5% net while boutique apparel can exceed 50%
          gross — see our guide to{" "}
          <Link href="/blog/healthy-profit-margin-by-industry" className="text-blue-600 dark:text-blue-400 hover:underline">
            healthy profit margins by industry
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Choose your mode:</strong> Cost-driven (you know cost and
            price, want the margin) or price-driven (you know cost and target
            margin/markup, want the price).
          </li>
          <li>
            <strong>Cost Price (₹):</strong> Your full landed cost — purchase
            price plus freight, packaging, and marketplace fees, not just the
            supplier invoice. Understating cost is the most common error.
          </li>
          <li>
            <strong>Selling Price (₹)</strong> or{" "}
            <strong>Target Margin / Target Markup (%):</strong> Enter
            whichever you know; the calculator solves for the rest.
          </li>
          <li>
            <strong>GST Rate &amp; GST Treatment:</strong> Select your slab
            (5/12/18/28%) and whether your selling price includes GST (retail
            MRP) or excludes it (B2B). This is what separates your invoice
            price from your actual revenue.
          </li>
        </ol>
        <p className="mb-4">
          Results show profit per unit, margin, markup, and the GST-adjusted
          figures side by side, with a dilution warning when the inclusive
          price eats your target. Read margin (profit ÷ selling price) when
          judging profitability, and markup (profit ÷ cost) when setting
          prices — they answer different questions.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profit Margin vs Markup — Formulas and Differences
        </h2>
        <p className="mb-4">
          Profit margin and markup both measure how much profit a business makes
          on a product, but they express it as a percentage of different bases.
          Confusing the two is a common pricing mistake that can lead to
          underpricing products or misreporting profitability. For
          GST-registered Indian businesses, an additional consideration is
          whether selling price includes or excludes GST — which directly
          affects the margin available.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Profit Margin and Markup Formulas
        </h3>
        <p className="mb-2 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          Profit Margin (%) = (Selling Price − Cost Price) ÷ Selling Price × 100
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          Markup (%) = (Selling Price − Cost Price) ÷ Cost Price × 100
        </p>
        <p className="mb-4">
          Margin is always lower than markup for the same profit amount. A 50%
          markup gives a 33.3% margin. A 100% markup gives a 50% margin.
          Retailers typically quote markup while accountants and investors focus
          on margin.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example with GST
        </h3>
        <p className="mb-4">
          A clothing retailer sources a kurta for ₹750 (cost price) and sells it
          at ₹1,200 MRP (inclusive of 12% GST).
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Net selling price (ex-GST) = ₹1,200 ÷ 1.12 = ₹1,071.43</li>
          <li>Profit = ₹1,071.43 − ₹750 = ₹321.43</li>
          <li>
            Profit Margin = ₹321.43 ÷ ₹1,071.43 × 100 = <strong>30%</strong>
          </li>
          <li>
            Markup = ₹321.43 ÷ ₹750 × 100 = <strong>42.9%</strong>
          </li>
        </ul>
        <p className="mb-4">
          If the retailer is not GST-registered and cannot claim Input Tax
          Credit, the ₹128.57 GST paid on the ₹1,200 price becomes a cost —
          reducing effective margin to about 17.9%. This calculator accounts for
          GST impact across all applicable rates so you can price products
          accurately.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World Pricing Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Pooja, Jaipur — pricing handmade jewellery for online sale
        </h3>
        <p className="mb-4">
          Pooja's landed cost per piece is ₹420 (materials ₹280 + packaging
          ₹40 + platform fee ₹100). Targeting a 35% margin with a
          GST-inclusive listing at 3%, the calculator solves the selling
          price at about <strong>₹665</strong>. Her earlier price of ₹550 —
          "cost plus 30%" markup — was actually delivering barely a 21%
          margin before the platform fee she'd forgotten to include.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Manoj, Ludhiana — B2B auto parts quote
        </h3>
        <p className="mb-4">
          Manoj supplies parts costing ₹1,850 each and quotes B2B prices
          exclusive of 18% GST. At his standard ₹2,300 quote, the calculator
          shows a margin of <strong>19.6%</strong> and markup of 24.3%. When
          a large buyer demands "10% off", he can see instantly that the
          discounted ₹2,070 price cuts his margin to 10.6% — half his
          profit — and negotiates volume terms instead. Takeaway: knowing
          your margin at each price point turns discount pressure into a
          calculation, not a gamble.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this profit margin calculator accurate?
          </summary>
          <p className="pt-2">
            Yes — margin, markup, and GST extraction are exact formulas
            computed with high-precision decimal arithmetic. Accuracy in
            practice depends on entering your true landed cost, including
            fees and shipping.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Should I price using margin or markup?
          </summary>
          <p className="pt-2">
            Set prices with markup (it starts from cost, which you know) but
            judge the business with margin (it reflects what you keep from
            each rupee of revenue). For the same profit, markup is always the
            bigger number — never compare one seller's markup to another's
            margin.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use this vs the GST calculator?
          </summary>
          <p className="pt-2">
            Use this when setting prices and analysing profitability. If you
            only need the tax split for an invoice — CGST/SGST/IGST on a
            known amount — the{" "}
            <Link href="/gst-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
              GST calculator
            </Link>{" "}
            is quicker.
          </p>
        </details>
      </section>
    </>
  );
}
