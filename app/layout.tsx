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
      "calculox - Free Online Calculators India | SIP EMI BMI Tax FD RD GST CAGR Percentage Scientific Profit Margin Retirement Home Loan Rent Simple Interest",
    template: "%s | calculox - Free Online Calculator",
  },
  description:
    "calculox - Free online calculators for India. SIP, EMI, BMI, Tax, FD, RD, GST, CAGR & 8 more calculators. Fast, accurate, mobile-friendly. No ads. No registration. Calculate instantly online.",
  keywords: [
    "calculox",
    "calculox calculator",
    "calculox sip calculator",
    "calculox emi calculator",
    "calculox bmi calculator",
    "calculox tax calculator",
    "calculox fd calculator",
    "calculox rd calculator",
    "calculox gst calculator",
    "online calculator",
    "free online calculators",
    "calculator online free",
    "free calculator india",
    "online calculator india",
    "sip calculator",
    "sip calculox",
    "emi calculator",
    "emi calculox",
    "loan emi calculator",
    "home loan emi calculator",
    "car loan emi calculator",
    "personal loan emi calculator",
    "bmi calculator",
    "body mass index calculator",
    "ideal weight calculator",
    "tax calculator",
    "income tax calculator",
    "income tax calculator india",
    "tax calculator india 2024-25",
    "fd calculator",
    "fixed deposit calculator",
    "rd calculator",
    "recurring deposit calculator",
    "gst calculator",
    "gst calculation tool",
    "percentage calculator",
    "cagr calculator",
    "simple interest calculator",
    "scientific calculator online",
    "profit margin calculator",
    "retirement calculator",
    "home loan vs rent calculator",
    "investment calculator",
    "mutual fund calculator",
    "financial calculator india",
    "loan calculator",
    "mortgage calculator",
    "emi payment calculator",
    "investment return calculator",
    "calculators for students",
    "calculators for business",
    "calculators for finance",
    "free calculation tools",
    "online calculation",
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
    title: "calculox - Free Online Calculators for India | 14+ Tools",
    description:
      "calculox offers 14+ free online calculators for Indian users. Calculate SIP returns, EMI, BMI, income tax, FD, RD, GST, CAGR, and more. Fast, accurate, no ads, no registration.",
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
    title: "calculox - 14+ Free Online Calculators for India",
    description:
      "SIP calculator, EMI calculator, BMI calculator, income tax calculator, FD calculator, RD calculator, GST calculator, and 7+ more. Free, accurate, instant results. No ads.",
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7034746357427731"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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

