import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
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
      "calculox - Free Online Calculators for India | SIP, EMI, BMI, Tax",
    template: "%s | calculox",
  },
  description:
    "calculox offers free premium online calculators for Indian users. Calculate SIP returns, loan EMI, BMI, income tax (FY 2024-25), and more. Fast, accurate & mobile-friendly.",
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
    "calculox",
    "calculox.in",
    "calculox",
  ],
  authors: [{ name: "calculox Team", url: BASE_URL }],
  creator: "calculox",
  publisher: "calculox",
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
    siteName: "calculox",
    title: "calculox - Free Online Calculators for India",
    description:
      "Free premium online calculators for Indian users - SIP, EMI, BMI, Tax & more. Fast, accurate & mobile-friendly.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "calculox Logo - Blue Gradient CX Icon",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculox",
    creator: "@calculox",
    title: "calculox - Free Online Calculators for India",
    description:
      "Free premium online calculators for Indian users - SIP, EMI, BMI, Tax & more.",
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
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
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        {/* Favicon - Multiple formats for maximum compatibility */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
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
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
        <Script id="defer-animation" strategy="afterInteractive">
          {`
            if (typeof document !== 'undefined') {
              const style = document.createElement('style');
              style.textContent = 'body::after { animation: gradientShift 15s ease-in-out infinite; } @keyframes gradientShift { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.05) translateY(-20px); } }';
              document.head.appendChild(style);
            }
          `}
        </Script>
      </body>
    </html>
  );
}

