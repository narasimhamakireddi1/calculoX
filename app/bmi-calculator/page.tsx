'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateBMI } from '@/lib/calculators/bmi';
import { BMISchema } from '@/lib/validators';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';

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
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<BMIFormData>({
    resolver: zodResolver(BMISchema),
    defaultValues: {
      weight: 70,
      height: 170,
    },
  });

  const watchValues = watch();

  // Auto-calculate when inputs or unit system change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.weight && watchValues.height) {
        calculateResults(watchValues);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [watchValues, unitSystem]);

  const calculateResults = (data: BMIFormData) => {
    // Convert imperial to metric if needed
    let weightInKg = data.weight;
    let heightInCm = data.height;

    if (unitSystem === 'imperial') {
      // Convert lbs to kg and inches to cm
      weightInKg = data.weight / 2.205;
      heightInCm = data.height * 2.54;
    }

    const result = calculateBMI({ weight: weightInKg, height: heightInCm });
    setResult(result);
  };

  const handleInputChange = (fieldName: keyof BMIFormData, value: number) => {
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleValidateField = (fieldName: string, value: number) => {
    let min = 10;
    let max = 500;
    let label = 'Weight';

    if (fieldName === 'weight') {
      if (unitSystem === 'metric') {
        min = 10;
        max = 500;
        label = 'Weight (kg)';
      } else {
        min = 22;
        max = 1102;
        label = 'Weight (lbs)';
      }
    } else if (fieldName === 'height') {
      if (unitSystem === 'metric') {
        min = 10;
        max = 300;
        label = 'Height (cm)';
      } else {
        min = 4;
        max = 118;
        label = 'Height (inches)';
      }
    }

    if (value < min || value > max) {
      alert(`${label} must be between ${min} and ${max}`);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
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
          <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-gray-700/30 p-1 rounded-lg">
            <button
              onClick={() => handleUnitChange('metric')}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-200 ${
                unitSystem === 'metric'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🌍 Metric (kg, cm)
            </button>
            <button
              onClick={() => handleUnitChange('imperial')}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-200 ${
                unitSystem === 'imperial'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🇺🇸 Imperial (lbs, in)
            </button>
          </div>

          <form className="space-y-6">
            {/* Weight */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="10"
                  max={unitSystem === 'metric' ? '500' : '1102'}
                  step="0.1"
                  value={watchValues.weight ?? 0}
                  onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('weight', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute right-2 top-2.5 text-blue-600 font-bold text-xs">{unitSystem === 'metric' ? 'kg' : 'lbs'}</span>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max={unitSystem === 'metric' ? '500' : '1102'}
                    value={watchValues.weight ?? 0}
                    onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                    onBlur={(e) => handleValidateField('weight', Number(e.target.value))}
                    className="w-24 px-6 py-2 border-2 border-blue-400 rounded-lg text-right font-bold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
              {errors.weight && (
                <p className="text-red-500 text-sm">{errors.weight.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unitSystem === 'metric' ? '10 - 500 kg' : '10 - 1102 lbs'}
              </p>
            </div>

            {/* Height */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Height ({unitSystem === 'metric' ? 'cm' : 'inches'})</label>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="10"
                  max={unitSystem === 'metric' ? '300' : '118'}
                  step="0.1"
                  value={watchValues.height ?? 0}
                  onChange={(e) => handleInputChange('height', Number(e.target.value))}
                  onBlur={(e) => handleValidateField('height', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="relative flex-shrink-0">
                  <span className="absolute right-2 top-2.5 text-green-600 font-bold text-xs">{unitSystem === 'metric' ? 'cm' : 'in'}</span>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max={unitSystem === 'metric' ? '300' : '118'}
                    value={watchValues.height ?? 0}
                    onChange={(e) => handleInputChange('height', Number(e.target.value))}
                    onBlur={(e) => handleValidateField('height', Number(e.target.value))}
                    className="w-24 px-6 py-2 border-2 border-green-400 rounded-lg text-right font-bold text-green-700 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-green-600 dark:text-green-400"
                  />
                </div>
              </div>
              {errors.height && (
                <p className="text-red-500 text-sm">{errors.height.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unitSystem === 'metric' ? '10 - 300 cm' : '4 - 118 inches'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              🗑️ Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div className={`card border-2 ${colors.bg} ${colors.border}`}>
              <h2 className="text-2xl font-bold mb-6 text-center">Your Results</h2>

              <div className="space-y-6">
                {/* BMI Value - Big Display */}
                <div className="text-center py-6 px-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider font-semibold mb-3">Your BMI</p>
                  <p className={`text-7xl font-black ${colors.text} drop-shadow-lg`}>{result.bmi}</p>
                </div>

                {/* Category */}
                <div className="text-center py-6 px-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                  <p className={`text-3xl font-bold ${colors.text} capitalize mb-3`}>
                    {result.category}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{result.description}</p>
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

      {/* Affiliate Banner */}
      <AffiliateBanner
        icon="🥗"
        headline="Achieve Your Ideal Weight with Expert Guidance"
        subtext="Get a personalized diet plan & fitness routine from certified coaches based on your BMI."
        note="AI-powered nutrition · Certified coaches · 3 Crore+ users in India"
        gradient="bg-gradient-to-r from-pink-500 to-rose-600"
        links={[
          { label: 'Get Free Diet Plan →', href: 'https://www.healthifyme.com', primary: true },
          { label: 'Start Free Trial', href: 'https://www.healthifyme.com' },
        ]}
      />

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
