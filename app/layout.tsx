import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo/schemas";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://calculo-j0blqmgpy-narasimha-project135.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "CalculoX - Free Online Calculators for India | SIP, EMI, BMI, Tax",
    template: "%s | CalculoX",
  },
  description:
    "CalculoX offers free premium online calculators for Indian users. Calculate SIP returns, loan EMI, BMI, income tax (FY 2024-25), and more. Fast, accurate & mobile-friendly.",
  keywords: [
    "calculator",
    "online calculator",
    "free calculator India",
    "SIP calculator",
    "EMI calculator",
    "BMI calculator",
    "tax calculator",
    "income tax calculator India",
    "loan calculator",
    "investment calculator",
    "financial calculator India",
    "SIP return calculator",
    "home loan EMI calculator",
    "body mass index calculator",
    "income tax 2024-25",
    "FD calculator",
    "RD calculator",
    "GST calculator",
    "percentage calculator",
    "CAGR calculator",
    "CalculoX",
    "calculox.in",
  ],
  authors: [{ name: "CalculoX Team", url: BASE_URL }],
  creator: "CalculoX",
  publisher: "CalculoX",
  category: "Finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "CalculoX",
    title: "CalculoX - Free Online Calculators for India",
    description:
      "Free premium online calculators for Indian users - SIP, EMI, BMI, Tax & more. Fast, accurate & mobile-friendly.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculox",
    creator: "@calculox",
    title: "CalculoX - Free Online Calculators for India",
    description:
      "Free premium online calculators for Indian users - SIP, EMI, BMI, Tax & more.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
  other: {
    "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();
  const siteSchema = generateWebSiteSchema();

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
