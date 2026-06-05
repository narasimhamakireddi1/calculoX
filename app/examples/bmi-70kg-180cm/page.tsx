import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'BMI Calculator Example: 70kg, 180cm - Healthy BMI',
  description: 'Real BMI calculation: 70kg, 180cm height = BMI 21.6 (Normal weight). Health assessment and fitness recommendations.',
  keywords: ['BMI calculator', 'body mass index', 'ideal weight', 'healthy weight'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/bmi-70kg-180cm`,
  },
};

export default function BMI70KGExample() {
  const weight = 70;
  const height = 180;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">BMI Calculator: 70kg, 180cm - Healthy Weight</h1>
          <p className="text-xl text-green-100">Understanding healthy body mass index and fitness</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Weight</span><span className="font-bold">{weight} kg</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Height</span><span className="font-bold">{height} cm ({heightInMeters}m)</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Your BMI</p>
              <p className="text-5xl font-bold text-green-600 dark:text-green-400">{bmi.toFixed(1)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Normal Weight (18.5-24.9)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">WHO BMI Categories</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li><strong>Underweight:</strong> BMI &lt; 18.5</li>
                <li><strong>Normal:</strong> 18.5-24.9 ✓ You are here</li>
                <li><strong>Overweight:</strong> 25-29.9</li>
                <li><strong>Obese:</strong> ≥ 30</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">✅ Your Health Status</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              With BMI 21.6, you're at a healthy weight! You're in the ideal range (18.5-24.9). This indicates lower risk of
              weight-related health issues like diabetes, heart disease, and hypertension.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Maintenance Tips</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Maintain current diet and exercise habits</li>
              <li>Aim for 150 minutes moderate cardio weekly</li>
              <li>Include strength training 2x weekly</li>
              <li>Eat balanced diet with whole foods</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Ideal Weight Range for Your Height</h3>
            <p>
              For 180cm height, healthy BMI range (18.5-24.9) means ideal weight: <strong>59.9-80.5 kg</strong>.
              You're at 70kg, comfortably in the middle of this range—excellent position!
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Your BMI</h2>
          <Link href="/bmi-calculator" className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50">
            Open BMI Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
