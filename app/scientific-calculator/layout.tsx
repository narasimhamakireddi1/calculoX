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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Utility">
        {children}
      </CalcPageWrapper>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scientific Calculator — Four Computation Modes Explained</h2>
        <p className="mb-4">
          A scientific calculator goes beyond basic arithmetic to handle trigonometry, logarithms, exponentiation, complex numbers, matrix algebra, and statistical analysis. This online scientific calculator provides four independent modes in one interface, making it suitable for high school and undergraduate mathematics, engineering problems, data analysis, and financial modelling.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">The Four Calculation Modes</h3>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Standard mode:</strong> Handles arithmetic, trigonometry (sin, cos, tan and their inverses), logarithms (log base-10, natural log), powers, roots, factorials, permutations (nPr), and combinations (nCr). Toggle between DEG and RAD for angle input.</li>
          <li><strong>Complex mode:</strong> Performs arithmetic on complex numbers in the form a + bi. Enter numbers like 3+4i and use standard operators. Results show real and imaginary parts separately.</li>
          <li><strong>Matrix mode:</strong> Supports 2×2 and 3×3 matrices. Calculate determinants, inverses, transposes, and perform matrix addition and multiplication.</li>
          <li><strong>Statistics mode:</strong> Enter a dataset and compute mean, median, mode, standard deviation, variance, and quartiles in one step.</li>
        </ul>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Worked Examples</h3>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Trigonometry:</strong> sin(30°) = 0.5 | cos(60°) = 0.5 | tan(45°) = 1</li>
          <li><strong>Logarithms:</strong> log(1000) = 3 | ln(e²) = 2 | log₂(8) = 3</li>
          <li><strong>Complex:</strong> (3 + 4i) × (2 − i) = 10 + 5i (real part 6+4=10; imaginary part 8−3=5)</li>
          <li><strong>Statistics:</strong> Dataset {'{'}2, 4, 4, 4, 5, 5, 7, 9{'}'} → Mean = 5, Std Dev = 2</li>
        </ul>
        <p>
          Physical keyboard input is fully supported: type numbers and operators directly, press Enter to evaluate, and Backspace to delete. The SHIFT key unlocks inverse functions — SHIFT + sin gives arcsin, SHIFT + log gives 10^x.
        </p>
      </section>
    </>
  );
}

