import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/a11y/SkipToContent";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { AdSenseLoader } from "@/components/ui/AdSenseLoader";
import { GoogleAnalyticsLoader } from "@/components/ui/GoogleAnalyticsLoader";
import { ResultsScrollCue } from "@/components/mobile/ResultsScrollCue";
import { CalcFAB } from "@/components/mobile/CalcFAB";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo/schemas";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.calculox.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "calculox — Free Online Calculators for India | EMI, SIP, BMI & More",
    // Individual calculator layouts already carry their own complete title + brand;
    // passing %s through avoids double-branding ("... | calculox | calculox ...").
    template: "%s",
  },
  description:
    "calculox - Free online calculators for India. SIP, EMI, BMI, Tax, FD, RD, GST, CAGR & 8 more calculators. Fast, accurate, mobile-friendly. No registration required. Calculate instantly online.",
  keywords: [
    "free online calculators india",
    "sip calculator",
    "emi calculator",
    "bmi calculator",
    "income tax calculator india",
    "fd calculator",
    "rd calculator",
    "gst calculator",
    "percentage calculator",
    "cagr calculator",
    "simple interest calculator",
    "scientific calculator",
    "profit margin calculator",
    "retirement calculator india",
    "home loan vs rent calculator",
  ],
  authors: [{ name: "Narasimha Makireddi", url: "https://www.linkedin.com/in/narasimha-makireddi-4807b7223" }],
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
    title: "calculox - Free Online Calculators for India | 14+ Tools",
    description:
      "calculox offers 14+ free online calculators for Indian users. Calculate SIP returns, EMI, BMI, income tax, FD, RD, GST, CAGR, and more. Fast, accurate, no registration required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "calculox - 14 Free Online Calculators for India",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculox",
    creator: "@calculox",
    title: "calculox - 14+ Free Online Calculators for India",
    description:
      "SIP calculator, EMI calculator, BMI calculator, income tax calculator, FD calculator, RD calculator, GST calculator, and 7+ more. Free, accurate, instant results.",
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
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } }
    : {}),
  other: {
    "google-adsense-account": "ca-pub-7034746357427731",
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
        <meta name="rating" content="general" />
        {/* Favicon - Multiple formats for maximum compatibility */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-[#f6f8fd] dark:bg-[#070b15] text-gray-900 dark:text-gray-50`}>
        <SkipToContent />
        <Navbar />
        <main id="main-content" role="main" className="min-h-screen">{children}</main>
        <Footer />
        <ResultsScrollCue />
        <CalcFAB />
        <CookieConsent />
        <AdSenseLoader />
        <GoogleAnalyticsLoader />
        <SpeedInsights />
        <Analytics />
        <Script id="defer-animation" strategy="afterInteractive">
          {`
            if (typeof document !== 'undefined') {
              const style = document.createElement('style');
              style.textContent = '@media (prefers-reduced-motion: no-preference) { body::after { animation: gradientShift 15s ease-in-out infinite; } } @keyframes gradientShift { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.05) translateY(-20px); } }';
              document.head.appendChild(style);
            }
          `}
        </Script>
      </body>
    </html>
  );
}

