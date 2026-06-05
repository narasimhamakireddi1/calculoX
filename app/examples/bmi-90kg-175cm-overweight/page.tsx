import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'BMI Calculator Example: 90kg, 175cm - Overweight',
  description: 'BMI calculation: 90kg, 175cm = BMI 29.4 (Overweight). Health recommendations and weight loss strategies.',
  keywords: ['BMI calculator', 'overweight', 'weight management', 'health'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/bmi-90kg-175cm-overweight`,
  },
};

export default function BMI90KGExample() {
  const weight = 90;
  const height = 175;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const healthyWeightMin = 18.5 * heightInMeters * heightInMeters;
  const healthyWeightMax = 24.9 * heightInMeters * heightInMeters;
  const weightToLose = weight - healthyWeightMax;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-800 dark:to-orange-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">BMI Calculator: 90kg, 175cm - Overweight</h1>
          <p className="text-xl text-orange-100">Assessment and health improvement strategies</p>
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
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg p-8 border-2 border-orange-200 dark:border-orange-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Your BMI</p>
              <p className="text-5xl font-bold text-orange-600 dark:text-orange-400">{bmi.toFixed(1)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Overweight (25-29.9)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">⚠️ Health Risk Level</h3>
              <p className="text-orange-600 dark:text-orange-400 font-bold text-xl">Moderate Risk</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Increased risk of diabetes, hypertension, heart disease
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Weight Loss Recommendation</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              At BMI 29.4, you're in the overweight category (25-29.9). To reach healthy weight:
              <br/>
              <strong>Target range:</strong> {healthyWeightMin.toFixed(1)}-{healthyWeightMax.toFixed(1)} kg
              <br/>
              <strong>Weight to lose:</strong> {weightToLose.toFixed(1)} kg
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">✅ Actionable Steps</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Target weight:</strong> {healthyWeightMax.toFixed(0)} kg (normal BMI)</li>
              <li><strong>Weight loss pace:</strong> 0.5-1 kg/week is healthy</li>
              <li><strong>Timeline:</strong> 6-9 months to reach target</li>
              <li><strong>Diet:</strong> Deficit 500 cal/day = 0.5kg loss/week</li>
              <li><strong>Exercise:</strong> 150 min cardio + 2×/week strength training</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">🏃 Fitness Plan</h3>
            <p>
              <strong>Cardio:</strong> 30 min daily (walking, cycling, swimming)
              <br/>
              <strong>Strength:</strong> 2× weekly (resistance training)
              <br/>
              <strong>Diet:</strong> High protein, low carb, sufficient fiber
              <br/>
              <strong>Sleep:</strong> 7-8 hours (crucial for weight loss)
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">🎯 Health Benefits of Weight Loss</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Reduced diabetes risk by 58%</li>
              <li>Lower blood pressure (hypertension risk)</li>
              <li>Improved heart health and longevity</li>
              <li>Better joint health and reduced pain</li>
              <li>Improved sleep quality and energy</li>
              <li>Better mental health and self-confidence</li>
            </ul>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-800 dark:to-orange-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Calculate Your BMI</h2>
          <Link href="/bmi-calculator" className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-orange-50">
            Open BMI Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
