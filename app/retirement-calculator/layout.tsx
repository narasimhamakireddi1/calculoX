import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';
import { CalcPageWrapper } from '@/components/layout/CalcPageWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Retirement Calculator India - Calculate Retirement Corpus 25x Rule | calculox',
  description: 'Advanced retirement calculator using NISM 25x rule. Calculate retirement corpus needed, plan inflation-adjusted expenses, and get 2-phase retirement projections. India-specific.',
  keywords: [
    'retirement calculator',
    'retirement corpus calculator',
    'retirement planning calculator',
    'retirement calculator india',
    'how much need to retire',
    'retirement age calculator',
    'financial independence calculator',
    'retirement savings calculator',
    'retirement SIP calculator',
    'retirement corpus 25x rule',
    'retirement planning tool',
    'retirement expense calculator',
  ],
  alternates: { canonical: `${BASE_URL}/retirement-calculator` },
  openGraph: {
    title: 'Retirement Corpus Calculator - Plan Your Retirement | calculox',
    description: 'Free Retirement Calculator: Calculate corpus needed using 25x rule, monthly SIP required, and get inflation-adjusted projections for worry-free retirement.',
    url: `${BASE_URL}/retirement-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Retirement Corpus Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement Corpus Calculator - Plan Your Retirement | calculox',
    description: 'Calculate retirement corpus needed using 25x rule & get monthly SIP amount required for stress-free retirement.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'What is the 25x annual expense rule?',
    answer: 'The 25x rule states that you need a corpus of 25 times your annual expenses to retire safely. This rule is based on the 4% safe withdrawal rate, which means you can withdraw 4% of your corpus annually (1/25th) without running out of money. For example, if your annual expenses are ₹10 lakhs, you need a retirement corpus of ₹2.5 crores.',
  },
  {
    question: 'How is inflation factored into the retirement calculator?',
    answer: 'The calculator adjusts your current monthly expenses by the inflation rate you provide (typically 5-7% for India) to calculate what your expenses will be at retirement. For example, if your monthly expense is ₹50,000 and inflation is 6%, and you retire in 10 years, your monthly expense at retirement will be approximately ₹89,542. This inflation-adjusted amount is used to calculate the corpus needed.',
  },
  {
    question: 'What does "available at retirement" mean?',
    answer: 'This is the amount your current corpus (investments, savings) will grow to by your retirement age, assuming it grows at the annual return rate you specified. For example, if you have ₹10 lakhs today and it grows at 10% annually for 10 years, you\'ll have approximately ₹25.94 lakhs available at retirement. The calculator subtracts this from the corpus needed to determine the gap.',
  },
  {
    question: 'How is the monthly SIP requirement calculated?',
    answer: 'The calculator uses the Future Value of Annuity Due formula to determine how much you need to invest monthly to bridge the corpus gap. This assumes you invest at the beginning of each month and your investments grow at the specified annual return rate. The calculation accounts for compounding and ensures your total investments plus growth equals the corpus needed by retirement.',
  },
  {
    question: 'What if I don\'t have 25 years to retirement?',
    answer: 'The SIP requirement will be much higher if you have fewer years to retirement because you have less time for compounding. For example, if you need a ₹2 crore corpus and have only 10 years, your monthly SIP might be ₹1.2 lakhs. With 20 years, it might be ₹40,000. The calculator automatically adjusts the monthly SIP based on your time horizon and return assumptions.',
  },
  {
    question: 'Can I include my expected pension in retirement planning?',
    answer: 'The calculator assumes you need to fund 100% of your retirement through your corpus. If you have a pension, you can reduce your monthly expense amount in the calculator to reflect the gap your pension will cover. For example, if your expenses are ₹50,000 but your pension will be ₹20,000, enter ₹30,000 as your monthly expense.',
  },
];

export default function RetirementCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Retirement Corpus Calculator',
    description: 'Free online Retirement Calculator using 25x rule. Calculate retirement corpus needed, monthly SIP required, and get inflation-adjusted projections for retirement planning.',
    slug: 'retirement-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Retirement Calculator', href: '/retirement-calculator' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Retirement Corpus Needed",
    "totalTime": "PT3M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Your Current Age",
        "text": "Enter your current age (typically 25-50 years). This helps calculate how many years you have until retirement."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Set Retirement Age",
        "text": "Enter the age at which you plan to retire (typically 55-65 years in India). This determines your working years."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Set Life Expectancy",
        "text": "Enter the age until which you want to plan for (typically 80-100 years). This ensures your corpus lasts through your entire retirement."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Enter Monthly Expenses",
        "text": "Enter your current monthly expenses (e.g., ₹50,000). Include all living costs: food, housing, healthcare, entertainment, and utilities."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Enter Current Corpus",
        "text": "Enter the amount you have saved/invested today (e.g., ₹5 lakhs in PPF, mutual funds, savings). This is used to calculate how much more you need."
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Set Annual Return Rate",
        "text": "Enter expected annual return on your investments (typically 6-10% for balanced portfolio, 8-12% for equity-heavy, 4-6% for debt-heavy)."
      },
      {
        "@type": "HowToStep",
        "position": 7,
        "name": "Set Inflation Rate",
        "text": "Enter expected inflation rate (typically 5-7% for India). Your expenses will grow at this rate by retirement."
      },
      {
        "@type": "HowToStep",
        "position": 8,
        "name": "Get Your Retirement Plan",
        "text": "View corpus needed (25x rule), monthly SIP required, scenario analysis (6%, 10%, 14% returns), and year-by-year projections until retirement."
      }
    ]
  };

  return (
    <>
      <Script id="schema-retirement-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-retirement-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-retirement-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-retirement-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Finance">
        {children}
      </CalcPageWrapper>
    </>
  );
}
