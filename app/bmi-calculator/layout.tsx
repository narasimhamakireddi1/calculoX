import type { Metadata } from 'next';
import Script from 'next/script';
import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/schemas';
import { CalcPageWrapper } from '@/components/layout/CalcPageWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'BMI Calculator India - Body Mass Index & Health Status | calculox',
  description: 'Free BMI calculator with WHO health categories. Calculate your Body Mass Index, get health recommendations, and understand ideal weight ranges. Accurate for adults, metric & imperial units.',
  keywords: [
    'bmi calculator',
    'body mass index calculator',
    'bmi calculator india',
    'healthy bmi range',
    'bmi check online',
    'weight height calculator',
    'ideal weight calculator',
    'bmi for indians',
    'normal bmi india',
    'bmi chart',
  ],
  alternates: { canonical: `${BASE_URL}/bmi-calculator` },
  openGraph: {
    title: 'BMI Calculator - Check Body Mass Index Online Free | calculox',
    description: 'Free BMI Calculator: Check your Body Mass Index, health category & get personalized health tips. Supports both metric & imperial units.',
    url: `${BASE_URL}/bmi-calculator`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMI Calculator - calculox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator - Check Body Mass Index Online Free | calculox',
    description: 'Free BMI Calculator: Check Body Mass Index, health category & personalized health tips.',
    images: ['/og-image.png'],
  },
};

const faqs = [
  { question: 'What is BMI and how is it calculated?', answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. It is calculated as: BMI = Weight(kg) / Height(m)². For example, a person weighing 70 kg and 1.75 m tall has a BMI of 22.9 (Normal weight).' },
  { question: 'What is a normal BMI range for Indians?', answer: 'For Indians, the WHO-recommended BMI ranges are: Underweight: below 18.5, Normal weight: 18.5-22.9, Overweight: 23-27.4, Obese: 27.5 and above. Note that Indians have a higher health risk at lower BMI compared to Western populations.' },
  { question: 'Can BMI be inaccurate?', answer: 'Yes, BMI has limitations. It does not account for muscle mass, bone density, age, or gender differences. Athletes may have a high BMI due to muscle, while elderly people may have a normal BMI but high body fat.' },
  { question: 'How do I lower my BMI?', answer: 'To lower your BMI: 1) Follow a calorie-deficit diet, 2) Exercise regularly (150+ minutes/week), 3) Reduce processed food and sugar intake, 4) Increase protein intake, 5) Stay hydrated, 6) Get adequate sleep (7-8 hours).' },
  { question: 'What is the difference between BMI in metric and imperial units?', answer: 'The BMI formula differs by unit system. Metric: BMI = kg/m². Imperial: BMI = (lbs × 703) / inches². Our calculator supports both systems and automatically converts for accurate results.' },
];

export default function BMILayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: 'BMI Calculator',
    description: 'Free online BMI Calculator to check Body Mass Index with health categories and personalized tips.',
    slug: 'bmi-calculator',
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'BMI Calculator', href: '/bmi-calculator' },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Body Mass Index (BMI)",
    "totalTime": "PT1M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Your Weight",
        "text": "Enter your current weight in kilograms (metric) or pounds (imperial)"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Enter Your Height",
        "text": "Enter your height in meters or centimeters for metric, feet and inches for imperial"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "View Your BMI Results",
        "text": "Get your BMI value and health category (underweight, normal, overweight, or obese)"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Check Health Recommendations",
        "text": "See personalized health tips and ideal weight range based on WHO standards"
      }
    ]
  };

  return (
    <>
      <Script id="schema-bmi-app" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Script id="schema-bmi-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-bmi-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-bmi-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalcPageWrapper category="Health">
        {children}
      </CalcPageWrapper>
    </>
  );
}

