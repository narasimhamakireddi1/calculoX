'use client';

import { BMICalculatorCore } from '@/components/bmi/BMICalculatorCore';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { RelatedBlogPosts } from '@/components/ui/RelatedBlogPosts';
import { getRelatedBlogPosts } from '@/lib/blog/utils';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import {
  TrendingDown, CheckCircle2, AlertTriangle, AlertOctagon,
  HelpCircle, Scale as ScaleIcon, ChevronRight,
} from 'lucide-react';
import { getInternalLinks } from '@/config/internal-links.config';

export default function BMICalculatorPage() {
  return (
    <div className="space-y-8 py-8">
      <BMICalculatorCore />

      {/* BMI Categories Chart */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-100 dark:ring-rose-900/50 flex-shrink-0">
            <ScaleIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" strokeWidth={2} aria-hidden="true" />
          </span>
          BMI Categories
        </h2>
        <div className="space-y-3">
          {[
            { range: 'Below 18.5', category: 'Underweight', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700', Icon: TrendingDown },
            { range: '18.5 to 24.9', category: 'Normal Weight', color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700', Icon: CheckCircle2 },
            { range: '25.0 to 29.9', category: 'Overweight', color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700', Icon: AlertTriangle },
            { range: '30.0 and above', category: 'Obesity', color: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700', Icon: AlertOctagon },
          ].map((item) => (
            <div key={item.category} className={`border-2 ${item.color} p-4 rounded-lg flex items-center gap-4`}>
              <item.Icon className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{item.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">BMI: {item.range}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Snippet Sections for SEO */}
      <div className="space-y-8">
        {/* Definition Snippet */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What is BMI (Body Mass Index)?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            BMI (Body Mass Index) is a measure of body fat based on height and weight that applies to most adults. It is calculated using the formula: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">BMI = Weight (kg) / Height (m)²</span> or <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">BMI = 703 × Weight (lbs) / Height (inches)²</span>. While not a direct measure of body fat percentage, BMI serves as a useful screening tool for identifying weight categories that may lead to health problems.
          </p>
        </div>

        {/* Table Snippet: BMI Categories */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">BMI Categories and Health Risk</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold">BMI Range</th>
                  <th className="text-left py-3 px-4 font-bold">Category</th>
                  <th className="text-left py-3 px-4 font-bold">Health Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <td className="py-3 px-4 font-semibold">Below 18.5</td>
                  <td className="py-3 px-4">Underweight</td>
                  <td className="py-3 px-4">Increased risk of nutritional deficiency</td>
                </tr>
                <tr className="hover:bg-green-50 dark:hover:bg-green-900/20">
                  <td className="py-3 px-4 font-semibold">18.5 - 24.9</td>
                  <td className="py-3 px-4 text-green-700 dark:text-green-400 font-bold">Normal Weight</td>
                  <td className="py-3 px-4 text-green-700 dark:text-green-400">Lowest health risk</td>
                </tr>
                <tr className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
                  <td className="py-3 px-4 font-semibold">25.0 - 29.9</td>
                  <td className="py-3 px-4">Overweight</td>
                  <td className="py-3 px-4">Increased risk of heart disease, diabetes</td>
                </tr>
                <tr className="hover:bg-red-50 dark:hover:bg-red-900/20">
                  <td className="py-3 px-4 font-semibold">30.0+</td>
                  <td className="py-3 px-4 text-red-700 dark:text-red-400 font-bold">Obese</td>
                  <td className="py-3 px-4">High risk of serious health complications</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* List Snippet: Tips for Healthy BMI */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">8 Tips to Achieve and Maintain a Healthy BMI</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">1.</span>
              <span><strong>Eat Balanced Nutrition:</strong> Include fruits, vegetables, whole grains, lean protein, and healthy fats. Avoid excessive sugary drinks and processed foods.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">2.</span>
              <span><strong>Exercise Regularly:</strong> Aim for 150+ minutes of moderate aerobic activity per week combined with strength training 2x per week.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">3.</span>
              <span><strong>Control Portion Sizes:</strong> Use smaller plates, eat slowly, and stop when you feel 80% full to prevent overeating.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">4.</span>
              <span><strong>Stay Hydrated:</strong> Drink adequate water throughout the day. Sometimes thirst is mistaken for hunger.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">5.</span>
              <span><strong>Get Quality Sleep:</strong> Aim for 7-9 hours per night. Poor sleep affects metabolism and increases hunger hormones.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">6.</span>
              <span><strong>Manage Stress:</strong> Chronic stress leads to weight gain. Practice meditation, yoga, or deep breathing exercises.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">7.</span>
              <span><strong>Track Progress:</strong> Monitor your weight weekly and keep a food diary to identify eating patterns.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 dark:text-green-400 flex-shrink-0">8.</span>
              <span><strong>Consult Professionals:</strong> For personalized guidance, speak with a nutritionist or healthcare provider.</span>
            </li>
          </ol>
        </div>
      </div>

      <ConfidenceBadge calculatorType="bmi" />

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('bmi-calculator')} />

      <RelatedBlogPosts posts={getRelatedBlogPosts('/bmi-calculator')} />

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-100 dark:ring-rose-900/50 flex-shrink-0">
            <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" strokeWidth={2} aria-hidden="true" />
          </span>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What is BMI and why is it important?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Body Mass Index (BMI) is a measure of body fat based on height and weight. It helps identify weight categories that may increase health risks. While not a direct measure of body fat, it serves as a useful screening tool for health assessment.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Is BMI accurate for everyone?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              BMI works well as a screening tool for most people but may not be accurate for athletes (higher muscle mass), older adults, or people with different body compositions. Always consult a healthcare professional for personalized health assessment.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What's the healthy BMI range?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              A BMI of 18.5 to 24.9 is considered healthy for most adults. This applies to both men and women. However, recommendations may vary for children, athletes, and older adults.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How can I achieve a healthy BMI?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Maintain a balanced diet, exercise regularly (150+ minutes per week), stay hydrated, get adequate sleep, and manage stress. For significant changes, consult a healthcare professional or nutritionist for personalized guidance.
            </p>
          </details>
        </div>
      </div>

    </div>
  );
}
