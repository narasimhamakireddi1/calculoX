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
  title: 'Scientific Calculator Online - Complex Numbers, Matrix & Statistics | calculox',
  description: 'Advanced online scientific calculator with 4 engines: Standard math, Complex numbers, Matrix operations, and Statistics. Casio ClassWiz-style. Free, no registration.',
  keywords: [
    'scientific calculator',
    'online calculator',
    'scientific calculator online',
    'complex number calculator',
    'matrix calculator',
    'statistics calculator',
    'trigonometry calculator',
    'math calculator online',
    'trigonometry calculator',
    'statistics calculator',
    'calculator with complex numbers',
    'engineering calculator',
    'scientific calculation tool',
  ],
  alternates: { canonical: `${BASE_URL}/scientific-calculator` },
  openGraph: {
    title: 'Scientific Calculator - Advanced Math & Complex Numbers | calculox',
    description: 'Free Scientific Calculator: Trigonometry, complex numbers, matrices, statistics, and advanced math operations. Perfect for engineering and scientific calculations.',
    url: `${BASE_URL}/scientific-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Scientific Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scientific Calculator - Advanced Math & Complex Numbers | calculox',
    description: 'Free Scientific Calculator with trigonometry, complex numbers, matrices & statistics. Perfect for engineers and scientists.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'What functions does this scientific calculator support?',
    answer: 'This calculator supports all standard scientific functions including trigonometry (sin, cos, tan, inverse), logarithms (log, ln, log₂), exponentials, factorials, permutations (nPr), combinations (nCr), and more. It also supports complex numbers, matrix operations, and statistical analysis.',
  },
  {
    question: 'How do I use DEG vs RAD mode?',
    answer: 'Click the DEG/RAD button to toggle between degree and radian mode. Trigonometric functions use the currently selected angle mode. For example, sin(45) returns 0.7071 in DEG mode and 0.8509 in RAD mode.',
  },
  {
    question: 'Can this calculator handle complex numbers?',
    answer: 'Yes! Switch to COMPLEX mode using the MODE button. Enter complex numbers using the format a+bi (e.g., 3+4i). The calculator performs all arithmetic operations on complex numbers and displays results in a+bi format.',
  },
  {
    question: 'How do I use Matrix operations?',
    answer: 'Switch to MATRIX mode via the MODE button. Click "Mat A" or "Mat B" to enter 2×2 or 3×3 matrices. Then use operations like det(A) for determinant, inv(A) for inverse, T(A) for transpose, and A+B or A×B for arithmetic operations.',
  },
  {
    question: 'How does the SHIFT key work?',
    answer: 'SHIFT toggles between primary and secondary functions. When SHIFT is active, sin becomes asin (arcsine), cos becomes acos, log becomes 10^, and ln becomes e^. Press SHIFT again to deactivate.',
  },
  {
    question: 'How can I store values in memory?',
    answer: 'Use M+ to add the current result to memory, M- to subtract, MC to clear memory, and MR to recall the memory value. The memory status displays in the calculator screen. You can also use "M" in expressions.',
  },
  {
    question: 'What is the precision of the calculations?',
    answer: 'This calculator uses high-precision floating-point arithmetic with up to 10 decimal places for most calculations. For financial or scientific calculations requiring higher precision, Decimal.js is used for critical operations.',
  },
  {
    question: 'Can I use physical keyboard input?',
    answer: 'Yes! You can type numbers (0-9), operators (+, -, *, /), parentheses, press Enter to calculate, Backspace to delete, and Escape to clear all. The calculator responds to both button clicks and keyboard input.',
  },
];

export default function ScientificCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'Scientific Calculator',
    description: 'Advanced scientific calculator with trigonometry, complex numbers, matrices, and statistics.',
    slug: 'scientific-calculator',
  });

  const faqSchema = generateFAQSchema(faqs);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Scientific Calculator', href: '/scientific-calculator' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use the Scientific Calculator",
    "totalTime": "PT3M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Select Computation Mode",
        "text": "Press MODE to switch between Standard (trigonometry, logarithms), Complex (a+bi numbers), Matrix (2×2/3×3), or Statistics mode"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Toggle Angle Mode",
        "text": "Click DEG/RAD button to select degree or radian mode for trigonometric functions"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Enter Expression",
        "text": "Type your mathematical expression using number keys, operation buttons, or physical keyboard. Use () for grouping."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Use SHIFT for Inverse Functions",
        "text": "Press SHIFT to access inverse trigonometric functions (asin, acos, atan), exponentials (e^x), and other secondary functions"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Get Results",
        "text": "Press = or Enter to calculate. View result on display. Use MR to recall stored values or continue calculations"
      }
    ]
  };

  return (
    <>
      <Script id="schema-scientific-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-scientific-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-scientific-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-scientific-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Utility">
        {children}
      </CalcPageWrapper>
    </>
  );
}

