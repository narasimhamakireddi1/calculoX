/**
 * BMI Calculator Logic
 * Calculate Body Mass Index
 *
 * Formula: BMI = Weight (kg) / Height (m)²
 */

export interface BMIInput {
  weight: number; // in kg
  height: number; // in cm
}

export interface BMIResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  description: string;
  heightInMeters: number;
}

export function calculateBMI(input: BMIInput): BMIResult {
  const { weight, height } = input;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category: 'underweight' | 'normal' | 'overweight' | 'obese';
  let description: string;

  if (bmi < 18.5) {
    category = 'underweight';
    description = 'Underweight - You may need to gain weight.';
  } else if (bmi < 25) {
    category = 'normal';
    description = 'Normal Weight - You have a healthy weight.';
  } else if (bmi < 30) {
    category = 'overweight';
    description = 'Overweight - You may need to lose some weight.';
  } else {
    category = 'obese';
    description = 'Obese - Please consult a healthcare professional.';
  }

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    description,
    heightInMeters: parseFloat(heightInMeters.toFixed(2)),
  };
}
