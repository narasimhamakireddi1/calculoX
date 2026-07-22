'use client';

import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, CheckCircle2, Search, Landmark, BarChart2, TrendingUp, Lightbulb } from 'lucide-react';

interface BadgeItem {
  icon: LucideIcon;
  text: string;
  link?: string;
}

interface ConfidenceBadgeProps {
  calculatorType: 'emi' | 'tax' | 'sip' | 'bmi';
}

export function ConfidenceBadge({ calculatorType }: ConfidenceBadgeProps) {
  const badges: Record<string, { title: string; items: BadgeItem[]; footnote: string }> = {
    emi: {
      title: 'EMI Calculator - Verified & Trusted',
      items: [
        { icon: CheckCircle2, text: 'RBI-Compliant Formula', link: 'https://www.rbi.org.in/' },
        { icon: Search, text: 'Open-source formula, auditable' },
        { icon: Landmark, text: 'Same method as SBI, HDFC, ICICI' },
      ],
      footnote: 'We use the same reducing-balance formula mandated by RBI for all scheduled banks.',
    },
    tax: {
      title: 'Tax Calculator - Accurate & Updated',
      items: [
        { icon: CheckCircle2, text: 'Finance Act 2025-26 Rates', link: 'https://www.incometaxindia.gov.in/' },
        { icon: BarChart2, text: 'All 9 Deductions Included' },
        { icon: Search, text: 'CBDT-notified slabs & rebates', link: 'https://www.incometaxindia.gov.in/' },
      ],
      footnote: 'Tax slabs and rebates are sourced from the Finance Act 2025-26 as notified by CBDT.',
    },
    sip: {
      title: 'SIP Calculator - Precision Investing',
      items: [
        { icon: CheckCircle2, text: 'SEBI-Regulated Scheme Formula', link: 'https://www.sebi.gov.in/' },
        { icon: TrendingUp, text: 'Open-source FV formula, auditable' },
        { icon: Search, text: 'AMFI-compliant SIP calculation', link: 'https://www.amfiindia.com/' },
      ],
      footnote: 'Uses the standard Future Value formula as applied by SEBI-regulated, AMFI-registered mutual funds.',
    },
    bmi: {
      title: 'BMI Calculator - Clinically Accurate',
      items: [
        { icon: CheckCircle2, text: 'WHO Global BMI Standards', link: 'https://www.who.int/' },
        { icon: Search, text: 'ICMR-adjusted cutoffs for Indians', link: 'https://www.icmr.gov.in/' },
        { icon: Landmark, text: 'Formula per clinical guidelines' },
      ],
      footnote: 'BMI categories follow WHO published standards; Indian-population cutoffs follow ICMR guidance.',
    },
  };

  const badge = badges[calculatorType];

  return (
    <div className="rounded-2xl p-4 md:p-6 border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-950/20 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-200 mb-3 text-lg">
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
                      className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                      {item.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-500 mt-3 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
            {badge.footnote}
          </p>
        </div>
      </div>
    </div>
  );
}
