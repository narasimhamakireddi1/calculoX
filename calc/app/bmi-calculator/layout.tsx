import type { Metadata } from "next";
import Link from "next/link";

import {
  generateWebApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";
import { CalcPageWrapper } from "@/components/layout/CalcPageWrapper";
import { AdUnit, AD_SLOTS } from "@/components/ui/AdUnit";

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
    { name: "Calculators", href: "/" },
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
      <AdUnit slot={AD_SLOTS.calcAboveFold} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <CalcPageWrapper category="Health" title="BMI Calculator">{children}</CalcPageWrapper>
      <AdUnit slot={AD_SLOTS.calcBelowResult} className="max-w-3xl mx-auto px-4 py-4 text-center" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This BMI Calculator
        </h2>
        <p className="mb-4">
          This free BMI calculator computes your Body Mass Index from your
          weight and height — in metric (kg/cm) or imperial (lbs/inches)
          units — and, unlike most calculators, classifies the result on{" "}
          <strong>both</strong> scales that matter to Indians: the standard
          WHO ranges and the stricter Asian cutoffs adopted by the ICMR. A
          visual gauge shows exactly where you sit in each band and how far
          you are from the healthy range.
        </p>
        <p className="mb-4">
          The dual classification is not a technicality. South Asians develop
          type 2 diabetes, hypertension, and heart disease at significantly
          lower BMI levels than European populations — India already has over
          10 crore people with diabetes, many of whom looked "normal weight"
          on the Western scale for years. A 70 kg, 165 cm office worker in
          Pune has a BMI of 25.7: "just over" the WHO line but firmly
          overweight by the ICMR standard their own doctor would apply. If
          you've only ever checked your BMI against the international chart,
          this calculator may read differently — and that difference is the
          medically relevant one.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why You Need a BMI Calculator
        </h2>
        <p className="mb-4">
          Weight creep is invisible day to day — 2–3 kg a year through a
          desk job and delivery apps doesn't register in the mirror, but it
          moves your BMI a full point every couple of years. Checking twice a
          year takes thirty seconds and catches the drift while a 4–5 kg
          correction still fixes it. It matters in paperwork too: Indian term
          insurance and health insurance premiums are loaded — sometimes
          20–50% higher — above certain BMI thresholds, so knowing your
          number before a medical underwriting exam has direct financial
          value. For what the categories mean and evidence-backed steps for
          each, read our{" "}
          <Link href="/blog/bmi-guide-for-indians" className="text-blue-600 dark:text-blue-400 hover:underline">
            BMI guide for Indians
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use This BMI Calculator
        </h2>
        <ol className="list-decimal pl-5 mb-4 space-y-2">
          <li>
            <strong>Choose your unit system:</strong> Metric (kg and cm) or
            Imperial (lbs and inches). The formula adjusts automatically.
          </li>
          <li>
            <strong>Weight:</strong> Use your morning weight, unclothed,
            after using the toilet — the most repeatable measurement.
            Same-day weights can swing 1–2 kg with meals and hydration.
          </li>
          <li>
            <strong>Height:</strong> Measure against a wall without shoes.
            Don't rely on the height from an old document — adults commonly
            overstate by 2–3 cm, which understates BMI by nearly a point.
          </li>
        </ol>
        <p className="mb-4">
          The gauge shows your BMI and both classifications instantly. Read
          the Asian/ICMR band as your primary reference if you're of South
          Asian descent. Track the trend across months rather than reacting
          to a single reading, and remember the two known blind spots:
          muscular builds read high, and older adults with low muscle mass
          can read deceptively normal.
        </p>

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
        <p className="mb-4">
          BMI is a screening tool, not a diagnostic one. Athletes may register
          as overweight due to high muscle mass. Consult a doctor for a complete
          health assessment.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real-World BMI Examples
        </h2>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Ramesh, 42, Pune — the "normal on paper" desk worker
        </h3>
        <p className="mb-4">
          Ramesh is 165 cm and 70 kg — BMI <strong>25.7</strong>. He had
          always considered himself "barely overweight" by the WHO chart, but
          the ICMR classification places him clearly in the overweight band,
          consistent with his creeping fasting sugar. A 6 kg reduction
          (to 64 kg) brings his BMI to 23.5, at the edge of the Asian normal
          range — a concrete, checkable target instead of a vague "lose some
          weight".
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Divya, 28, Kochi — pre-insurance check
        </h3>
        <p className="mb-4">
          Divya is buying term insurance and knows insurers load premiums at
          higher BMIs. At 158 cm and 62 kg her BMI is <strong>24.8</strong> —
          under the common loading threshold of most insurers but overweight
          by ICMR standards. She uses the calculator to set a 57 kg goal
          (BMI 22.8) before her medical exam. Takeaway: BMI is both a health
          screen and, in India, a line item in your insurance pricing.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Accuracy &amp; Common Questions
        </h2>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Is this BMI calculator accurate?
          </summary>
          <p className="pt-2">
            The calculation is the exact WHO formula (kg/m²), and the category
            cutoffs follow published WHO and ICMR guidelines. The honest
            caveat applies to BMI itself, not the math: it cannot distinguish
            muscle from fat, so treat it as a screening signal to discuss
            with a doctor, not a diagnosis.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Why are the Indian (ICMR) cutoffs lower than WHO?
          </summary>
          <p className="pt-2">
            Research shows South Asians carry more visceral fat and develop
            diabetes and cardiac disease at lower body weights than European
            populations. ICMR therefore sets overweight at BMI 23 (vs 25) and
            obesity at 25 (vs 30) for Indians.
          </p>
        </details>
        <details className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            When should I use BMI vs other measurements?
          </summary>
          <p className="pt-2">
            BMI is the right first screen for most adults. Pair it with waist
            circumference (risk rises above ~90 cm for Indian men, ~80 cm for
            women) for a fuller picture; skip BMI-based conclusions entirely
            if you're pregnant, under 18, or a competitive athlete.
          </p>
        </details>
      </section>
    </>
  );
}
