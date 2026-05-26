'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateBMI } from '@/lib/calculators/bmi';
import { BMISchema } from '@/lib/validators';

type BMIFormData = {
  weight: number;
  height: number;
};

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

const categoryTips = {
  underweight: [
    'Eat more calorie-dense foods like nuts, avocados, and whole grains',
    'Include protein-rich foods like eggs, dairy, and lean meats',
    'Consult a doctor to rule out any underlying health conditions',
  ],
  normal: [
    'Maintain your healthy weight with balanced diet and regular exercise',
    'Continue healthy habits to prevent weight gain',
    'Aim for 150 minutes of moderate activity per week',
  ],
  overweight: [
    'Reduce calorie intake by 500-750 calories per day',
    'Increase physical activity to 150-200 minutes per week',
    'Consult a nutritionist or doctor for personalized advice',
  ],
  obese: [
    'Seek guidance from a healthcare professional immediately',
    'Consider a structured weight loss program',
    'Start with low-impact exercises like walking or swimming',
  ],
};

export default function BMICalculatorPage() {
  const [result, setResult] = useState<BMIResultData | null>(null);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BMIFormData>({
    resolver: zodResolver(BMISchema),
    defaultValues: {
      weight: 70,
      height: 170,
    },
  });

  const watchValues = watch();

  const onSubmit = (data: BMIFormData) => {
    const result = calculateBMI(data);
    setResult(result);
  };

  const handleUnitChange = (unit: 'metric' | 'imperial') => {
    if (unit === 'imperial' && unitSystem === 'metric') {
      // Convert kg to lbs, cm to inches
      const weightInLbs = Math.round(watchValues.weight * 2.205);
      const heightInInches = Math.round(watchValues.height / 2.54);
      setValue('weight', weightInLbs);
      setValue('height', heightInInches);
    } else if (unit === 'metric' && unitSystem === 'imperial') {
      // Convert lbs to kg, inches to cm
      const weightInKg = Math.round((watchValues.weight / 2.205) * 10) / 10;
      const heightInCm = Math.round(watchValues.height * 2.54);
      setValue('weight', weightInKg);
      setValue('height', heightInCm);
    }
    setUnitSystem(unit);
  };

  const colors = result ? categoryColors[result.category] : categoryColors.normal;

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">BMI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Calculate your Body Mass Index (BMI) and check your health status. BMI helps determine if your weight is healthy for your height.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Measurements</h2>

          {/* Unit Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleUnitChange('metric')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => handleUnitChange('imperial')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Imperial (lbs, in)
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder={unitSystem === 'metric' ? '70' : '155'}
                {...register('weight', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {unitSystem === 'metric' ? 'Min: 10 kg, Max: 500 kg' : 'Min: 22 lbs, Max: 1102 lbs'}
              </p>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder={unitSystem === 'metric' ? '170' : '67'}
                {...register('height', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.height && (
                <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {unitSystem === 'metric' ? 'Min: 10 cm, Max: 300 cm' : 'Min: 4 in, Max: 118 in'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Calculate BMI
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div className={`card border-2 ${colors.bg} ${colors.border}`}>
              <h2 className="text-2xl font-bold mb-6 text-center">Your Results</h2>

              <div className="space-y-6">
                {/* BMI Value */}
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Your BMI</p>
                  <p className={`text-6xl font-bold ${colors.text}`}>{result.bmi}</p>
                </div>

                {/* Category */}
                <div className="text-center">
                  <p className={`text-2xl font-bold ${colors.text} capitalize mb-2`}>
                    {result.category}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{result.description}</p>
                </div>

                {/* BMI Range Indicator */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">BMI Range</p>
                  <div className="flex gap-1 h-8">
                    <div className="flex-1 bg-blue-400 rounded-l-lg flex items-center justify-center text-white text-xs font-bold">
                      &lt;18.5
                    </div>
                    <div className="flex-1 bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                      18.5-25
                    </div>
                    <div className="flex-1 bg-orange-400 flex items-center justify-center text-white text-xs font-bold">
                      25-30
                    </div>
                    <div className="flex-1 bg-red-500 rounded-r-lg flex items-center justify-center text-white text-xs font-bold">
                      &gt;30
                    </div>
                  </div>
                  <div className="flex text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex-1">Underweight</span>
                    <span className="flex-1 text-center">Normal</span>
                    <span className="flex-1 text-center">Overweight</span>
                    <span className="flex-1 text-right">Obese</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter your weight and height, then click &quot;Calculate BMI&quot; to see your results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Tips Section */}
      {result && (
        <div className={`card border-2 ${colors.bg} ${colors.border}`}>
          <h2 className={`text-2xl font-bold mb-6 ${colors.text}`}>
            Health Recommendations for {result.category} Category
          </h2>
          <ul className="space-y-3">
            {categoryTips[result.category].map((tip, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className={`${colors.text} font-bold min-w-fit mt-1`}>✓</span>
                <span className="text-gray-600 dark:text-gray-400">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* BMI Chart Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">BMI Categories Chart</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-12 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-white">
              BMI &lt; 18.5
            </div>
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-400">Underweight</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Below healthy weight range. May need to gain weight.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-12 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white">
              BMI 18.5-25
            </div>
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400">Normal Weight</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Healthy weight range. Maintain current habits.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-12 bg-orange-400 rounded-lg flex items-center justify-center font-bold text-white">
              BMI 25-30
            </div>
            <div>
              <p className="font-semibold text-orange-700 dark:text-orange-400">Overweight</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Above healthy weight. Consider lifestyle changes.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-12 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white">
              BMI ≥ 30
            </div>
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">Obese</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Health risks present. Consult healthcare professional.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
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
