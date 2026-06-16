'use client';

import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, CheckCircle2, Search, Landmark, BarChart2, TrendingUp, Lightbulb } from 'lucide-react';

interface BadgeItem {
  icon: LucideIcon;
  text: string;
  link?: string;
}

interface ConfidenceBadgeProps {
  calculatorType: 'emi' | 'tax' | 'sip';
}

export function ConfidenceBadge({ calculatorType }: ConfidenceBadgeProps) {
  const badges: Record<string, { title: string; items: BadgeItem[] }> = {
    emi: {
      title: 'EMI Calculator - Verified & Trusted',
      items: [
        { icon: CheckCircle2, text: 'RBI-Compliant Formula', link: 'https://www.rbi.org.in/' },
        { icon: Search, text: 'Open-source formula, auditable' },
        { icon: Landmark, text: 'Same method as SBI, HDFC, ICICI' },
      ],
    },
    tax: {
      title: 'Tax Calculator - Accurate & Updated',
      items: [
        { icon: CheckCircle2, text: 'FY2025-26 Official Rates', link: 'https://www.incometaxindia.gov.in/' },
        { icon: BarChart2, text: 'All 9 Deductions Included' },
        { icon: Search, text: 'Cross-checked with IT dept. slabs', link: 'https://www.incometaxindia.gov.in/' },
      ],
    },
    sip: {
      title: 'SIP Calculator - Precision Investing',
      items: [
        { icon: CheckCircle2, text: 'SEBI-Standard Calculations' },
        { icon: TrendingUp, text: 'Based on standard FV formula', link: 'https://www.sebi.gov.in/' },
        { icon: Search, text: 'Formula matches AMFI SIP standard' },
      ],
    },
  };

  const badge = badges[calculatorType];

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 md:p-6 border-2 border-green-200 dark:border-green-800/50 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-8 h-8" strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-green-900 dark:text-green-300 mb-3 text-lg">
            {badge.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {badge.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" />
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                      {item.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-green-600 dark:text-green-500 mt-3 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
            We calculate using the same formulas used by banks and government agencies.
          </p>
        </div>
      </div>
    </div>
  );
}
