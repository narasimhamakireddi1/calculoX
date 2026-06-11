import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart2, FlaskConical, Calculator } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Scientific Calculator Example: Power Calculations',
  description: 'Scientific calculator example: 2^10 = 1024, √16 = 4, sin(45°) = 0.707. Advanced mathematical operations.',
  keywords: ['scientific calculator', 'power function', 'square root', 'trigonometry'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/scientific-power-calculation`,
  },
};

export default function ScientificExample() {
  const power = Math.pow(2, 10);
  const sqrt = Math.sqrt(16);
  const sin45 = Math.sin(45 * Math.PI / 180);
  const log10 = Math.log10(1000);
  const factorial5 = 5 * 4 * 3 * 2 * 1;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Scientific Calculator: Power & Function Examples</h1>
          <p className="text-xl text-purple-100">Advanced mathematical operations and calculations</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Example Calculations</h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Power Function (Exponentiation)</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Problem:</strong> Calculate 2^10</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Solution:</strong> 2 raised to power 10</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{power}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Used in: Computer science (binary), exponential growth</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Square Root</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Problem:</strong> Find √16</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Solution:</strong> Number that when squared equals 16</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{sqrt}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Used in: Geometry, physics calculations</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Trigonometry (Sine)</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Problem:</strong> Calculate sin(45°)</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Solution:</strong> Sine of 45 degrees</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{sin45.toFixed(4)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">≈ √2/2 = 0.7071... | Used in: Engineering, wave analysis</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border-l-4 border-orange-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Logarithm (Base 10)</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Problem:</strong> Calculate log₁₀(1000)</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Solution:</strong> Power to which 10 is raised to get 1000</p>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{log10}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Because 10^3 = 1000 | Used in: Decibels, pH, acoustics</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border-l-4 border-red-500">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Factorial</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Problem:</strong> Calculate 5!</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Solution:</strong> 5 × 4 × 3 × 2 × 1</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">{factorial5}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Used in: Permutations, combinations, probability</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><FlaskConical className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> When to Use Scientific Calculator</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Engineering & Physics</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Force calculations (F = m × a)</li>
              <li>Electrical impedance (Z = √(R² + X²))</li>
              <li>Wave frequency and wavelength</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Finance & Statistics</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>CAGR calculations (compound growth)</li>
              <li>Logarithmic returns for investments</li>
              <li>Standard deviation and variance</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Computer Science</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Binary calculations (2^n)</li>
              <li>Algorithmic complexity (log n operations)</li>
              <li>Data structure analysis</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Medical & Health</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>pH calculations (logarithmic scale)</li>
              <li>Medication dosage calculations</li>
              <li>Statistical analysis of clinical data</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Key Functions Available</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Powers:</strong> x^y (square, cube, any power)</li>
              <li><strong>Roots:</strong> √x (square root), ∛x (cube root)</li>
              <li><strong>Trigonometry:</strong> sin, cos, tan (degrees/radians)</li>
              <li><strong>Logarithms:</strong> log (base 10), ln (natural log)</li>
              <li><strong>Constants:</strong> π (pi), e (Euler's number)</li>
              <li><strong>Factorial:</strong> n! (permutations)</li>
              <li><strong>Modulo:</strong> Remainder after division</li>
            </ul>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><Calculator className="w-7 h-7 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Use Advanced Scientific Functions</h2>
          <Link href="/scientific-calculator" className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50">
            Open Scientific Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
