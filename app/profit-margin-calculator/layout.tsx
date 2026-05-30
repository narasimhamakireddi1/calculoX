import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Profit Margin Calculator - Calculate Markup & GST Impact | calculox',
  description: 'Free profit margin & markup calculator for Indian retailers & businesses. Calculate gross profit, margin %, markup % with GST (5/12/18/28%) impact analysis. Cost & price-driven modes.',
  keywords: [
    'profit margin calculator',
    'markup calculator',
    'profit calculator',
    'gst calculator with margin',
    'business margin calculator',
    'markup vs margin calculator',
    'gross profit calculator',
    'pricing calculator with gst',
    'price calculator india',
    'GST profit impact',
    'selling price calculator',
    'cost price calculator',
  ],
  alternates: { canonical: `${BASE_URL}/profit-margin-calculator` },
  openGraph: {
    title: 'Profit Margin & Markup Calculator - GST Impact Analysis | calculox',
    description: 'Calculate markups, margins, and GST impact. 4 calculation modes: Markup→Margin, Margin→Markup, Cost&Revenue, GST Analysis. Perfect for retail, e-commerce, and manufacturing businesses.',
    url: `${BASE_URL}/profit-margin-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Profit Margin & Markup Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profit Margin & Markup Calculator - Calculate Profits & GST | calculox',
    description: 'Calculate profit margins, markups, and GST impact with advanced analysis tools. Includes 5-year projection and GST rate comparison.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'What is the difference between markup and profit margin?',
    answer: 'Markup is the percentage added to cost price to calculate selling price: (Profit / Cost Price) × 100. Margin is the percentage of profit relative to selling price: (Profit / Selling Price) × 100. Example: ₹100 cost with ₹30 profit = 30% markup but 23% margin (30/130 × 100). Markup is always higher than margin for the same profit.',
  },
  {
    question: 'How does GST affect my profit margin?',
    answer: 'GST impact depends on your GST registration status. If registered, you can claim input credit and GST is neutral. If not registered, GST becomes a cost that reduces profit. Example: ₹100 selling price at 18% GST = ₹18 GST cost to you if not credited = ₹18 reduction in profit. Calculator shows impact across 5 GST rates (0%, 5%, 12%, 18%, 28%).',
  },
  {
    question: 'Which calculation mode should I use?',
    answer: 'Choose based on what you know: (1) Markup→Margin: If you know the markup %, find margin %. (2) Margin→Markup: If you want a target margin %, find required markup. (3) Cost&Revenue: If you know both cost price and selling price, calculate profit %. (4) GST Impact: Analyze how different GST rates affect profitability.',
  },
  {
    question: 'What is a healthy profit margin for my business?',
    answer: 'Healthy margins vary by industry: Electronics 5-15%, Fashion/Clothing 25-50%, Food/F&B 15-25%, Software/SaaS 70-90%, Retail 15-30%. Online commerce typically aims for 20-40% gross margin (before operating expenses). Ensure your margin covers: Operating costs (30%), Taxes (25%), Growth (15%), Profit (20-30%).',
  },
  {
    question: 'How do I find the selling price if I know my target margin?',
    answer: 'Use the Margin→Markup mode: Enter your target margin % and cost price. The calculator converts it to required markup. Example: 30% target margin + ₹100 cost = 42.9% markup needed = ₹142.90 selling price. Formula: Selling Price = Cost Price / (1 - Margin%). This ensures you achieve your target profit percentage.',
  },
  {
    question: 'How does the 5-year profit projection work?',
    answer: 'The projection multiplies your per-unit profit by number of units sold per year, then extends across 5 years. Example: ₹30 profit/unit × 1000 units/year = ₹30K Year 1 profit, ₹60K Year 2, ₹150K Year 5. This shows cumulative profit growth over time for business planning and forecasting.',
  },
];

export default function ProfitMarginLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Profit Margin & Markup Calculator',
    description: 'Advanced profit margin, markup, and GST impact calculator with 4 computation modes. Calculate markups, margins, GST effects, and 5-year profit projections for Indian businesses.',
    slug: 'profit-margin-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Profit Margin Calculator', href: '/profit-margin-calculator' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use Profit Margin & Markup Calculator",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Select Calculation Mode",
        "text": "Choose from 4 modes: (1) Markup→Margin: Convert markup % to profit margin %, (2) Margin→Markup: Find markup % for target margin, (3) Cost&Revenue: Enter cost and selling price to calculate profit, (4) GST Impact: Analyze how different GST rates affect profits."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Cost Price",
        "text": "Enter the cost price of your product in rupees (₹). This is what you pay to manufacture or buy the product. Range: ₹1 to ₹100,000."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Enter Mode-Specific Values",
        "text": "Depending on selected mode, enter: Markup % (mode 1), Margin % (mode 2), Selling Price (mode 3), or GST Rate (mode 4). Use sliders for quick adjustment or type exact values."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Set Units Per Year",
        "text": "Enter expected annual sales volume (number of units) for 5-year profit projection. Range: 10 to 100,000 units/year."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Review Results",
        "text": "Calculator instantly shows: Profit per unit, Markup %, Profit Margin %, GST amount (if applicable), and key financial metrics in color-coded cards."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Analyze Charts",
        "text": "View profit breakdown pie chart showing Cost vs Profit proportion, and 5-year line chart showing Revenue, Cost, and Profit growth."
      },
      {
        "@type": "HowToStep",
        "position": 7,
        "name": "Compare GST Scenarios",
        "text": "In GST Impact mode, view comparison table showing profit effects across 5 different GST rates (0%, 5%, 12%, 18%, 28%) to understand tax impact."
      },
      {
        "@type": "HowToStep",
        "position": 8,
        "name": "Export Results",
        "text": "Export calculations as PDF or copy to clipboard to share with accountant, business partners, or save for records."
      }
    ]
  };

  return (
    <>
      <Script id="schema-profit-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-profit-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-profit-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-profit-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}
