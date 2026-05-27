'use client';

import { useState } from 'react';
import { calculateBMI } from '@/lib/calculators/bmi';

interface BMIResultData {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  description: string;
}

const categoryColors = {
  underweight: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400' },
  normal: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400' },
  overweight: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400' },
  obese: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-400' },
};

export default function BMICalculatorPage() {
  const [metricWeight, setMetricWeight] = useState<number>(68);
  const [metricHeight, setMetricHeight] = useState<number>(172);
  const [metricResult, setMetricResult] = useState<BMIResultData | null>(null);

  const [imperialWeight, setImperialWeight] = useState<number>(150);
  const [imperialHeight, setImperialHeight] = useState<number>(68);
  const [imperialResult, setImperialResult] = useState<BMIResultData | null>(null);

  const calculateMetricBMI = () => {
    if (metricWeight && metricHeight) {
      const result = calculateBMI({ weight: metricWeight, height: metricHeight });
      setMetricResult(result);
    }
  };

  const calculateImperialBMI = () => {
    if (imperialWeight && imperialHeight) {
      const weightInKg = imperialWeight / 2.205;
      const heightInCm = imperialHeight * 2.54;
      const result = calculateBMI({ weight: weightInKg, height: heightInCm });
      setImperialResult(result);
    }
  };

  const BMIResultCard = ({ result }: { result: BMIResultData | null }) => {
    if (!result) return null;
    const colors = categoryColors[result.category];
    return (
      <div className={`card border-2 ${colors.bg} ${colors.border} p-6 rounded-lg`}>
        <h3 className="text-xl font-bold mb-4">BMI result</h3>
        <div className="space-y-4">
          <div className="text-center py-4 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Your BMI</p>
            <p className={`text-5xl font-bold ${colors.text}`}>{result.bmi}</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${colors.text} capitalize mb-2`}>{result.category}</p>
            <p className="text-gray-600 dark:text-gray-400">{result.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">⚖️ BMI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Body Mass Index is a screening measure based on weight and height. It can be useful as a quick check, but it does not directly measure body fat or diagnose health conditions.
        </p>
      </div>

      {/* Metric BMI Calculator */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Metric BMI</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Weight (kg)</label>
              <input
                type="number"
                value={metricWeight}
                onChange={(e) => setMetricWeight(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Height (cm)</label>
              <input
                type="number"
                value={metricHeight}
                onChange={(e) => setMetricHeight(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={calculateMetricBMI}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              Calculate Metric BMI
            </button>
          </form>
        </div>
        <BMIResultCard result={metricResult} />
      </div>

      {/* Imperial BMI Calculator */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Imperial BMI</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Weight (lb)</label>
              <input
                type="number"
                value={imperialWeight}
                onChange={(e) => setImperialWeight(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Height (in)</label>
              <input
                type="number"
                value={imperialHeight}
                onChange={(e) => setImperialHeight(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={calculateImperialBMI}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              Calculate Imperial BMI
            </button>
          </form>
        </div>
        <BMIResultCard result={imperialResult} />
      </div>

      {/* Formula and Categories */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Formula and categories</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Metric formula:</h3>
            <p className="text-gray-600 dark:text-gray-400">BMI = kg / m<sup>2</sup></p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Imperial formula:</h3>
            <p className="text-gray-600 dark:text-gray-400">BMI = 703 × lb / in<sup>2</sup></p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">BMI</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Below 18.5</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Underweight</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">18.5 to 24.9</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Normal weight</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">25.0 to 29.9</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Overweight</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">30.0 and above</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Obesity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Important Limitation */}
      <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700">
        <h2 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-400">Important limitation</h2>
        <p className="text-yellow-700 dark:text-yellow-300">
          BMI can misclassify people with high muscle mass, older adults, athletes, or people with different body compositions. It is a screening tool, not a diagnosis.
        </p>
      </div>

      {/* Use Cases */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Use cases</h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• Quick self-screening for health education.</li>
          <li>• Classroom and public-health examples.</li>
          <li>• Converting between metric and imperial tracking habits.</li>
        </ul>
      </div>

      {/* Worked Examples */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Worked examples</h2>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
          <li><strong>68 kg and 1.72 m:</strong> 68 / 1.72<sup>2</sup> = 22.99, which is in the normal range.</li>
          <li><strong>150 lb and 68 in:</strong> 703 × 150 / 68<sup>2</sup> = 22.8.</li>
          <li><strong>90 kg and 1.70 m:</strong> 90 / 1.70<sup>2</sup> = 31.14, which falls in the obesity category.</li>
        </ul>
      </div>

      {/* Common Mistakes */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Common mistakes</h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• Entering centimeters where meters are expected in the formula.</li>
          <li>• Forgetting the 703 factor in the imperial formula.</li>
          <li>• Treating BMI as a full health diagnosis instead of one screening signal.</li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What is BMI?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Body Mass Index (BMI) is a measure of body fat based on height and weight. It&apos;s calculated as weight (kg) divided by height (m) squared. BMI helps screen for weight categories that may lead to health problems.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              Is BMI accurate for everyone?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              BMI doesn&apos;t measure body fat directly. It may overestimate in muscular people and underestimate in older people with low muscle mass. For accurate health assessment, consult a healthcare professional.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              What&apos;s the healthy BMI range?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              For adults, a BMI of 18.5 to 25 is considered normal/healthy weight. This range is the same for both men and women. However, BMI recommendations may vary for children and athletes.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
              How can I improve my BMI?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Eat a balanced diet, exercise regularly (150 minutes per week), stay hydrated, get enough sleep, and manage stress. For significant changes, consult a doctor or nutritionist for personalized guidance.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
