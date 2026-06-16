import type { Metadata } from "next";

import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";
import { CalcPageWrapper } from "@/components/layout/CalcPageWrapper";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.calculox.in";

export const metadata: Metadata = {
  title: "BMI Calculator India - Body Mass Index & Health Status | calculox",
  description:
    "Free BMI calculator with WHO health categories. Calculate your Body Mass Index, get health recommendations, and understand ideal weight ranges. Accurate for adults, metric & imperial units.",
  keywords: [
    "bmi calculator",
    "body mass index calculator",
    "bmi calculator india",
    "healthy bmi range",
    "bmi check online",
    "weight height calculator",
    "ideal weight calculator",
    "bmi for indians",
    "normal bmi india",
    "bmi chart",
  ],
  alternates: { canonical: `${BASE_URL}/bmi-calculator` },
  openGraph: {
    title: "BMI Calculator - Check Body Mass Index Online Free | calculox",
    description:
      "Free BMI Calculator: Check your Body Mass Index, health category & get personalized health tips. Supports both metric & imperial units.",
    url: `${BASE_URL}/bmi-calculator`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BMI Calculator - calculox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator - Check Body Mass Index Online Free | calculox",
    description:
      "Free BMI Calculator: Check Body Mass Index, health category & personalized health tips.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is BMI and how is it calculated?",
    answer:
      "BMI (Body Mass Index) is a measure of body fat based on height and weight. It is calculated as: BMI = Weight(kg) / Height(m)². For example, a person weighing 70 kg and 1.75 m tall has a BMI of 22.9 (Normal weight).",
  },
  {
    question: "What is a normal BMI range for Indians?",
    answer:
      "For Indians, the WHO-recommended BMI ranges are: Underweight: below 18.5, Normal weight: 18.5-22.9, Overweight: 23-27.4, Obese: 27.5 and above. Note that Indians have a higher health risk at lower BMI compared to Western populations.",
  },
  {
    question: "Can BMI be inaccurate?",
    answer:
      "Yes, BMI has limitations. It does not account for muscle mass, bone density, age, or gender differences. Athletes may have a high BMI due to muscle, while elderly people may have a normal BMI but high body fat.",
  },
  {
    question: "How do I lower my BMI?",
    answer:
      "To lower your BMI: 1) Follow a calorie-deficit diet, 2) Exercise regularly (150+ minutes/week), 3) Reduce processed food and sugar intake, 4) Increase protein intake, 5) Stay hydrated, 6) Get adequate sleep (7-8 hours).",
  },
  {
    question:
      "What is the difference between BMI in metric and imperial units?",
    answer:
      "The BMI formula differs by unit system. Metric: BMI = kg/m². Imperial: BMI = (lbs × 703) / inches². Our calculator supports both systems and automatically converts for accurate results.",
  },
];

export default function BMILayout({ children }: { children: React.ReactNode }) {
  const appSchema = generateWebApplicationSchema({
    name: "BMI Calculator",
    description:
      "Free online BMI Calculator to check Body Mass Index with health categories and personalized tips.",
    slug: "bmi-calculator",
  });
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "BMI Calculator", href: "/bmi-calculator" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Body Mass Index (BMI)",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter Your Weight",
        text: "Enter your current weight in kilograms (metric) or pounds (imperial)",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Your Height",
        text: "Enter your height in meters or centimeters for metric, feet and inches for imperial",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "View Your BMI Results",
        text: "Get your BMI value and health category (underweight, normal, overweight, or obese)",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Check Health Recommendations",
        text: "See personalized health tips and ideal weight range based on WHO standards",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <CalcPageWrapper category="Health">{children}</CalcPageWrapper>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What Is BMI and How Is It Calculated?
        </h2>
        <p className="mb-4">
          Body Mass Index (BMI) is a numerical value derived from a
          person&apos;s weight and height, used by healthcare professionals
          worldwide to screen for weight categories that may lead to health
          problems. The World Health Organization (WHO) defines BMI ranges, but
          the Asian Body Mass Index cutoffs — adopted by the Indian Council of
          Medical Research (ICMR) — recommend lower thresholds because South
          Asian populations carry higher metabolic risk at lower BMI values
          compared to Western populations.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          BMI Formula
        </h3>
        <p className="mb-4">
          BMI is calculated differently depending on the unit system:
        </p>
        <p className="mb-2 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          Metric: BMI = Weight (kg) ÷ Height (m)²
        </p>
        <p className="mb-4 font-mono bg-gray-100 dark:bg-gray-800 rounded px-4 py-3 text-sm">
          Imperial: BMI = 703 × Weight (lbs) ÷ Height (inches)²
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Worked Example
        </h3>
        <p className="mb-4">
          A person weighing 70 kg at a height of 175 cm (1.75 m):
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            BMI = 70 ÷ (1.75 × 1.75) = 70 ÷ 3.0625 = <strong>22.9</strong>
          </li>
          <li>
            WHO classification: <strong>Normal weight</strong> (18.5–24.9)
          </li>
          <li>
            Asian/Indian classification: <strong>Normal weight</strong>{" "}
            (18.5–22.9)
          </li>
        </ul>
        <p className="mb-4">
          Note that a BMI of 23 for the same person would still be
          &quot;Normal&quot; under WHO guidelines but shift to
          &quot;Overweight&quot; under Asian cutoffs. This distinction matters
          for Indians: cardiovascular and diabetes risk rises at lower BMI
          values in South Asian populations compared to those of European
          descent.
        </p>
        <p>
          BMI is a screening tool, not a diagnostic one. Athletes may register
          as overweight due to high muscle mass. Consult a doctor for a complete
          health assessment.
        </p>
      </section>
    </>
  );
}
