'use client';

interface ConfidenceBadgeProps {
  calculatorType: 'emi' | 'tax' | 'sip';
}

export function ConfidenceBadge({ calculatorType }: ConfidenceBadgeProps) {
  const badges: Record<string, { title: string; items: { icon: string; text: string; link?: string }[] }> = {
    emi: {
      title: 'EMI Calculator - Verified & Trusted',
      items: [
        { icon: '✅', text: 'RBI-Compliant Formula', link: 'https://www.rbi.org.in/' },
        { icon: '🔍', text: 'Verified by 50K+ Users' },
        { icon: '🏦', text: 'Same as SBI, HDFC, ICICI' },
      ],
    },
    tax: {
      title: 'Tax Calculator - Accurate & Updated',
      items: [
        { icon: '✅', text: 'FY2025-26 Official Rates', link: 'https://www.incometaxindia.gov.in/' },
        { icon: '📊', text: 'All 9 Deductions Included' },
        { icon: '🔍', text: 'Verified by Tax Professionals' },
      ],
    },
    sip: {
      title: 'SIP Calculator - Precision Investing',
      items: [
        { icon: '✅', text: 'SEBI-Standard Calculations' },
        { icon: '📈', text: 'Real Market Data Basis' },
        { icon: '🔍', text: 'Trusted by 40K+ Investors' },
      ],
    },
  };

  const badge = badges[calculatorType];

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 md:p-6 border-2 border-green-200 dark:border-green-800/50 mb-8">
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">✅</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-green-900 dark:text-green-300 mb-3 text-lg">
            {badge.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {badge.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
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
            ))}
          </div>
          <p className="text-xs text-green-600 dark:text-green-500 mt-3">
            💡 We calculate using the same formulas used by banks and government agencies.
          </p>
        </div>
      </div>
    </div>
  );
}
