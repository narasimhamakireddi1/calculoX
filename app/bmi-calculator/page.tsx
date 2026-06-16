'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { calculateBMI } from '@/lib/calculators/bmi';
import { BMISchema } from '@/lib/validators';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { QuickStartExamples, type QuickStartScenario } from '@/components/ui/QuickStartExamples';
import {
  UserRound, Dumbbell, Activity, TrendingDown, CheckCircle2, AlertTriangle, AlertOctagon,
  Globe, Ruler, Trash2, BookOpen, Info, Lightbulb, Target, Utensils, Stethoscope,
  HeartPulse, HelpCircle, Zap, Star, Scale as ScaleIcon,
} from 'lucide-react';
import { getInternalLinks } from '@/config/internal-links.config';
import { useSwipeGesture } from '@/lib/hooks/useSwipeGesture';
import { SwipeHint } from '@/components/mobile/SwipeHint';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

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
  underweight: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-400', label: 'Underweight' },
  normal: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-300 dark:border-green-700', text: 'text-green-700 dark:text-green-400', label: 'Normal Weight' },
  overweight: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-400', label: 'Overweight' },
  obese: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-700', text: 'text-red-700 dark:text-red-400', label: 'Obese' },
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
      height: 175,
    },
  });

  const watchValues = watch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchValues.weight && watchValues.height) {
        calculateResults(watchValues);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchValues, unitSystem]);

  const haptic = useHapticFeedback();

  const calculateResults = (data: BMIFormData) => {
    let weightInKg = data.weight;
    let heightInCm = data.height;

    if (unitSystem === 'imperial') {
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
    let min = 10, max = 500, label = 'Weight';

    if (fieldName === 'weight') {
      if (unitSystem === 'metric') {
        min = 10; max = 500; label = 'Weight (kg)';
      } else {
        min = 22; max = 1102; label = 'Weight (lbs)';
      }
    } else if (fieldName === 'height') {
      if (unitSystem === 'metric') {
        min = 10; max = 300; label = 'Height (cm)';
      } else {
        min = 4; max = 118; label = 'Height (inches)';
      }
    }

    if (value < min || value > max) {
      alert(`${label} must be between ${min} and ${max}`);
    }
  };

  const handleReset = useCallback(() => {
    haptic.trigger('warning');
    reset();
    setResult(null);
  }, [reset, haptic]);

  const handleUnitChange = (unit: 'metric' | 'imperial') => {
    if (unit === 'imperial' && unitSystem === 'metric') {
      const weightInLbs = Math.round(watchValues.weight * 2.205);
      const heightInInches = Math.round(watchValues.height / 2.54);
      setValue('weight', weightInLbs);
      setValue('height', heightInInches);
    } else if (unit === 'metric' && unitSystem === 'imperial') {
      const weightInKg = Math.round((watchValues.weight / 2.205) * 10) / 10;
      const heightInCm = Math.round(watchValues.height * 2.54);
      setValue('weight', weightInKg);
      setValue('height', heightInCm);
    }
    setUnitSystem(unit);
  };

  // Quick-start scenarios (dynamic based on unit system)
  const bmiScenarios: QuickStartScenario[] = useMemo(() => {
    if (unitSystem === 'metric') {
      return [
        {
          label: 'Average Adult (Metric)',
          description: '70 kg, 175 cm - Normal BMI',
          icon: UserRound,
          values: { weight: 70, height: 175 }
        },
        {
          label: 'Fitness Enthusiast',
          description: '75 kg, 180 cm - Healthy range',
          icon: Dumbbell,
          values: { weight: 75, height: 180 }
        },
        {
          label: 'Lightweight Person',
          description: '55 kg, 165 cm - Normal BMI',
          icon: Activity,
          values: { weight: 55, height: 165 }
        }
      ];
    } else {
      return [
        {
          label: 'Average Adult (Imperial)',
          description: '154 lbs, 69 inches - Normal BMI',
          icon: UserRound,
          values: { weight: 154, height: 69 }
        },
        {
          label: 'Fitness Enthusiast',
          description: '165 lbs, 71 inches - Healthy range',
          icon: Dumbbell,
          values: { weight: 165, height: 71 }
        },
        {
          label: 'Lightweight Person',
          description: '121 lbs, 65 inches - Normal BMI',
          icon: Activity,
          values: { weight: 121, height: 65 }
        }
      ];
    }
  }, [unitSystem]);

  const handleSelectScenario = useCallback((values: Record<string, number | string>) => {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof BMIFormData, Number(value), { shouldValidate: true });
    });
  }, [setValue]);

  const colors = result ? categoryColors[result.category] : categoryColors.normal;

  // Swipe navigation to related calculators (mobile only)
  const router = useRouter();
  const relatedCalcs = getInternalLinks('bmi-calculator').slice(0, 5);
  const currentIndex = 0;

  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    threshold: 50,
    onSwipe: (direction) => {
      if (direction === 'left' && currentIndex < relatedCalcs.length - 1) {
        router.push(relatedCalcs[currentIndex + 1].href);
      } else if (direction === 'right' && currentIndex > 0) {
        router.push(relatedCalcs[currentIndex - 1].href);
      }
    }
  });

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient inline-flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg flex-shrink-0">
            <CalculatorIcon idOrHref="bmi" className="w-6 h-6 text-white" />
          </span>
          <span>BMI Calculator</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
          Calculate your Body Mass Index and check your health status instantly
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div id="bmi-inputs" className="card">
          <h2 className="text-2xl font-bold mb-6">Your Measurements</h2>

          {/* Quick-Start Examples */}
          <QuickStartExamples
            scenarios={bmiScenarios}
            onSelectScenario={handleSelectScenario}
          />

          {/* Unit Toggle */}
          <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-gray-700/30 p-1 rounded-lg">
            <button
              onClick={() => handleUnitChange('metric')}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                unitSystem === 'metric'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              Metric (kg, cm)
            </button>
            <button
              onClick={() => handleUnitChange('imperial')}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                unitSystem === 'imperial'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Ruler className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              Imperial (lbs, in)
            </button>
          </div>

          <form className="space-y-6">
            {/* Weight */}
            <div className="space-y-3">
              <label htmlFor="weight" className="block text-sm font-bold text-gray-900 dark:text-white">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="10"
                  max={unitSystem === 'metric' ? '500' : '1102'}
                  step="0.1"
                  value={watchValues.weight === 0 ? "" : watchValues.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('weight', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  id="weight"
                  type="number" placeholder="0"
                  step="0.1"
                  min="10"
                  max={unitSystem === 'metric' ? '500' : '1102'}
                  value={watchValues.weight === 0 ? "" : watchValues.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('weight', Number(e.target.value))}
                  className="w-full md:w-36 px-3 py-3 border-2 border-blue-400 rounded-lg font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {(unitSystem === 'metric' ? [50, 70, 90] : [110, 154, 198]).map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('weight', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700
                               bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    {val}{unitSystem === 'metric' ? 'kg' : 'lbs'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" strokeWidth={2} aria-hidden="true" />
                Normal BMI range: 18.5–24.9. Asian guidelines suggest &lt;23 for optimal health
              </p>
            </div>

            {/* Height */}
            <div className="space-y-3">
              <label htmlFor="height" className="block text-sm font-bold text-gray-900 dark:text-white">Height ({unitSystem === 'metric' ? 'cm' : 'inches'})</label>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
                <input
                  type="range"
                  min="10"
                  max={unitSystem === 'metric' ? '300' : '118'}
                  step="0.1"
                  value={watchValues.height === 0 ? "" : watchValues.height}
                  onChange={(e) => handleInputChange('height', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('height', Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <input
                  id="height"
                  type="number" placeholder="0"
                  step="0.1"
                  min="10"
                  max={unitSystem === 'metric' ? '300' : '118'}
                  value={watchValues.height === 0 ? "" : watchValues.height}
                  onChange={(e) => handleInputChange('height', e.target.value === '' ? 0 : Number(e.target.value))}
                  onBlur={(e) => handleValidateField('height', Number(e.target.value))}
                  className="w-full md:w-36 px-3 py-3 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              {errors.height && <p className="text-red-500 text-sm">{errors.height.message}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {(unitSystem === 'metric' ? [160, 170, 180] : [64, 68, 72]).map(val => (
                  <button key={val} type="button" onClick={() => handleInputChange('height', val)}
                    className="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                               bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                               hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                    {val}{unitSystem === 'metric' ? 'cm' : '\"'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" strokeWidth={2} aria-hidden="true" />
                Be precise with your height — even small variations impact BMI significantly
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              Clear All
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <div id="bmi-results" className={`card border-2 ${colors.bg} ${colors.border}`}>
              <h2 className="text-2xl font-bold mb-6">Your Results</h2>

              <div className="space-y-6">
                {/* BMI Value */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700/50 dark:to-gray-700/30 p-6 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider font-semibold mb-3">Your BMI</p>
                  <p className={`text-7xl font-black ${colors.text} drop-shadow-lg`}>{result.bmi}</p>
                </div>

                {/* Category */}
                <div className="text-center py-6 px-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                  <p className={`text-3xl font-bold ${colors.text} capitalize mb-3`}>{result.category}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{result.description}</p>
                </div>

                {/* BMI Range Indicator */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">BMI Range Spectrum</p>
                  <div className="flex gap-1 h-10">
                    <div className="flex-1 bg-blue-400 rounded-l-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                      &lt;18.5
                    </div>
                    <div className="flex-1 bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      18.5-25
                    </div>
                    <div className="flex-1 bg-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      25-30
                    </div>
                    <div className="flex-1 bg-red-500 rounded-r-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                      &gt;30
                    </div>
                  </div>
                  <div className="flex text-xs text-gray-600 dark:text-gray-400 font-semibold">
                    <span className="flex-1">Under</span>
                    <span className="flex-1 text-center">Normal</span>
                    <span className="flex-1 text-center">Over</span>
                    <span className="flex-1 text-right">Obese</span>
                  </div>
                </div>
              </div>

              {/* Health Insights & Recommendations */}
              <div className="mt-6 bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800">
                <h3 className="font-bold text-rose-900 dark:text-rose-300 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                  Understanding Your BMI
                </h3>
                <p className="text-sm text-rose-800 dark:text-rose-200 mb-3">
                  BMI (Body Mass Index) is a measure of body fat based on height and weight. A BMI of <strong>{result.bmi}</strong> falls in the <strong className={colors.text}>{result.category}</strong> category.
                </p>
                <div className="space-y-2 text-sm">
                  {result.category === 'underweight' && (
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex gap-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" strokeWidth={2} aria-hidden="true" />
                      <p className="text-blue-800 dark:text-blue-200"><strong>Recommendation:</strong> You may need to gain weight. Consult a healthcare provider for a balanced diet plan that includes nutrient-rich foods.</p>
                    </div>
                  )}
                  {result.category === 'normal' && (
                    <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg flex gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" strokeWidth={2} aria-hidden="true" />
                      <p className="text-green-800 dark:text-green-200"><strong>Great!</strong> Your weight is healthy. Maintain this by regular exercise (150 min/week) and a balanced diet.</p>
                    </div>
                  )}
                  {result.category === 'overweight' && (
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" strokeWidth={2} aria-hidden="true" />
                      <p className="text-amber-800 dark:text-amber-200"><strong>Recommendation:</strong> Consider gradual weight loss through increased physical activity and dietary changes. Aim for 0.5–1 kg loss per week.</p>
                    </div>
                  )}
                  {result.category === 'obese' && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-lg flex gap-2">
                      <AlertOctagon className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" strokeWidth={2} aria-hidden="true" />
                      <p className="text-red-800 dark:text-red-200"><strong>Important:</strong> Consult a doctor or nutritionist for a personalized weight management plan. Regular exercise and lifestyle changes are recommended.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <ScaleIcon className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                  How Do You Compare?
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your BMI of {result.bmi.toFixed(1)} places you in the <strong>{result.category}</strong> category. Research indicates that overweight and obesity affect approximately 30-40% of urban populations in India. Maintaining a healthy BMI through regular exercise and a balanced diet significantly reduces chronic disease risk.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <ShareButtons
                  inputs={[
                    { label: `Weight (${unitSystem === 'metric' ? 'kg' : 'lbs'})`, value: watchValues.weight.toString() },
                    { label: `Height (${unitSystem === 'metric' ? 'cm' : 'inches'})`, value: watchValues.height.toString() }
                  ]}
                  outputs={[
                    { label: 'BMI Score', value: result.bmi.toFixed(1) },
                    { label: 'Category', value: result.category.charAt(0).toUpperCase() + result.category.slice(1) }
                  ]}
                  calculatorName="BMI Calculator"
                />
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center min-h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Enter your measurements to see your BMI</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BMI Spectrum — horizontal gauge, works on all screen sizes */}
      {result && (() => {
        // Scale: 10 → 45  (35-pt range)
        const BMI_MIN = 10, BMI_RANGE = 35;
        const pct = Math.min(Math.max(((result.bmi - BMI_MIN) / BMI_RANGE) * 100, 1.5), 98.5);
        const triangleColor =
          result.category === 'underweight' ? '#3b82f6' :
          result.category === 'normal'      ? '#22c55e' :
          result.category === 'overweight'  ? '#f59e0b' :
                                              '#ef4444';
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-100 dark:ring-rose-900/50 flex-shrink-0">
                <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" strokeWidth={2} aria-hidden="true" />
              </span>
              BMI Spectrum
            </h2>

            {/* Gauge */}
            <div className="mb-8 px-1">
              {/* Floating label + pointer */}
              <div className="relative h-10 mb-1 select-none pointer-events-none">
                <div
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${pct}%` }}
                >
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-sm whitespace-nowrap ${colors.bg} ${colors.border} ${colors.text}`}>
                    You · {result.bmi.toFixed(1)}
                  </span>
                  <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden="true" className="mt-0.5">
                    <polygon points="0,0 10,0 5,7" fill={triangleColor} />
                  </svg>
                </div>
              </div>

              {/* Coloured bar — widths proportional to BMI scale 10–45 */}
              <div className="flex h-8 rounded-2xl overflow-hidden shadow-inner ring-1 ring-black/5 dark:ring-white/5">
                {/* Underweight  10→18.5  (8.5/35 = 24.3%) */}
                <div className="bg-blue-400 dark:bg-blue-500" style={{ width: '24.3%' }} />
                {/* Normal       18.5→25  (6.5/35 = 18.6%) */}
                <div className="bg-green-500" style={{ width: '18.6%' }} />
                {/* Overweight   25→30    (5/35   = 14.3%) */}
                <div className="bg-amber-400 dark:bg-amber-500" style={{ width: '14.3%' }} />
                {/* Obese        30→45+               rest */}
                <div className="bg-red-500 flex-1" />
              </div>

              {/* Scale ticks */}
              <div className="flex mt-1.5 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium select-none">
                <span style={{ width: '24.3%' }} className="text-left">10</span>
                <span style={{ width: '18.6%' }} className="text-left">18.5</span>
                <span style={{ width: '14.3%' }} className="text-left">25</span>
                <span className="flex-1 text-left">30</span>
                <span>45+</span>
              </div>
            </div>

            {/* 4 category cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { cat: 'underweight', label: 'Underweight', range: '< 18.5', bg: 'bg-blue-50 dark:bg-blue-950/30',  border: 'border-blue-200 dark:border-blue-800',  text: 'text-blue-700 dark:text-blue-400',  ring: 'ring-blue-400',  Icon: TrendingDown  },
                { cat: 'normal',      label: 'Normal',      range: '18.5–25', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', ring: 'ring-green-400', Icon: CheckCircle2  },
                { cat: 'overweight',  label: 'Overweight',  range: '25–30',   bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', ring: 'ring-amber-400', Icon: AlertTriangle },
                { cat: 'obese',       label: 'Obese',       range: '> 30',    bg: 'bg-red-50 dark:bg-red-950/30',    border: 'border-red-200 dark:border-red-800',    text: 'text-red-700 dark:text-red-400',    ring: 'ring-red-400',   Icon: AlertOctagon  },
              ] as const).map(({ cat, label, range, bg, border, text, ring, Icon }) => {
                const isActive = result.category === cat;
                return (
                  <div
                    key={cat}
                    className={`rounded-xl border-2 p-3 transition-all duration-200 ${bg} ${border} ${isActive ? `shadow-md ring-2 ${ring}` : 'opacity-50'}`}
                  >
                    <div className={`flex items-center gap-1.5 mb-1 ${text}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                      <span className="font-bold text-sm">{label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">BMI {range}</p>
                    {isActive && (
                      <p className={`text-xl font-black mt-1 ${text}`}>{result.bmi.toFixed(1)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Health Tips */}
      {result && (
        <div className={`card border-2 ${colors.bg} ${colors.border}`}>
          <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${colors.text}`}>
            <Lightbulb className="w-6 h-6 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
            Health Tips for <span className="capitalize">{result.category}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {result.category === 'underweight' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Utensils className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Nutrition
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Eat calorie-dense foods like nuts, avocados, and whole grains</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Stethoscope className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Consultation
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Consult a doctor to rule out underlying health conditions</p>
                </div>
              </>
            )}
            {result.category === 'normal' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Star className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Maintain
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Keep your healthy lifestyle and regular exercise</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Target className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Goal
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aim for 150 minutes of moderate activity per week</p>
                </div>
              </>
            )}
            {result.category === 'overweight' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <Zap className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Exercise
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Increase physical activity to 150–200 minutes/week</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Utensils className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Diet
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reduce calorie intake by 500–750 calories daily</p>
                </div>
              </>
            )}
            {result.category === 'obese' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <HeartPulse className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Professional Help
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Consult a healthcare professional for a personalised plan</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Activity className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    Start Small
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Begin with low-impact exercises like walking or swimming</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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

      {/* Related Calculators */}
      <RelatedCalculators calculators={getInternalLinks('bmi-calculator')} />

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
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Body Mass Index (BMI) is a measure of body fat based on height and weight. It helps identify weight categories that may increase health risks. While not a direct measure of body fat, it serves as a useful screening tool for health assessment.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              Is BMI accurate for everyone?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              BMI works well as a screening tool for most people but may not be accurate for athletes (higher muscle mass), older adults, or people with different body compositions. Always consult a healthcare professional for personalized health assessment.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              What's the healthy BMI range?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              A BMI of 18.5 to 24.9 is considered healthy for most adults. This applies to both men and women. However, recommendations may vary for children, athletes, and older adults.
            </p>
          </details>

          <details className="group border-b border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400">
              How can I achieve a healthy BMI?
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="pb-4 text-gray-600 dark:text-gray-400">
              Maintain a balanced diet, exercise regularly (150+ minutes per week), stay hydrated, get adequate sleep, and manage stress. For significant changes, consult a healthcare professional or nutritionist for personalized guidance.
            </p>
          </details>
        </div>
      </div>

      {/* Swipe navigation footer (mobile only) */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center md:hidden"
      >
        <SwipeHint
          hasLeft={currentIndex < relatedCalcs.length - 1}
          hasRight={currentIndex > 0}
          calculatorName="BMI"
        />
      </div>

      {/* Padding for fixed footer on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
}

