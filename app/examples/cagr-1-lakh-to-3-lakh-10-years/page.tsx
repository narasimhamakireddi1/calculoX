import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { ClipboardList, TrendingUp, BarChart2, Calculator } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'CAGR Calculator: ₹1 Lakh to ₹3 Lakh in 10 Years',
  description: 'CAGR calculation: Investment grows from ₹1L to ₹3L in 10 years = 11.61% CAGR. Understanding compound annual growth rate.',
  keywords: ['CAGR calculator', 'compound annual growth rate', 'investment growth'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/cagr-1-lakh-to-3-lakh-10-years`,
  },
};

export default function CAGR1LakhExample() {
  const beginning = 100000;
  const ending = 300000;
  const years = 10;
  const cagr = (Math.pow(ending / beginning, 1 / years) - 1) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">CAGR Calculator: ₹1L to ₹3L in 10 Years</h1>
          <p className="text-xl text-blue-100">Measuring investment growth rate and benchmarks</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><ClipboardList className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Investment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Beginning Value</span><span className="font-bold">{formatCurrency(beginning)}</span></div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Ending Value</span><span className="font-bold">{formatCurrency(ending)}</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Time Period</span><span className="font-bold">{years} years</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> CAGR Result</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">CAGR</p>
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{cagr.toFixed(2)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Annual growth rate</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Growth</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">200%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">From ₹1L to ₹3L</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Understanding CAGR</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              CAGR (Compound Annual Growth Rate) is the average annual growth rate of an investment over a period.
              At 11.61% CAGR, your investment is growing well—significantly above inflation (6-7%) and average fixed deposits (6.5%).
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Why CAGR Matters</h3>
            <p>
              CAGR smooths out volatility. If your investment fluctuated wildly but ended at ₹3L, CAGR shows the
              average annual growth, letting you compare with other investments fairly. It accounts for compounding.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Benchmark Comparisons</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>11.61% CAGR:</strong> Your investment (excellent performance)</li>
              <li><strong>7-9% CAGR:</strong> Stock market average (good)</li>
              <li><strong>6.5% CAGR:</strong> FD/RD returns (safe)</li>
              <li><strong>6-7% CAGR:</strong> Inflation (baseline)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Realistic Expectations</h3>
            <p>
              11.61% CAGR is achievable with: (1) Diversified equity portfolio (stocks, mutual funds); (2) Long-term holding;
              (3) Consistent compounding. However, past performance doesn't guarantee future results. Markets are volatile.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Future Projections</h3>
            <p>
              If your ₹3L investment continues at 11.61% CAGR:
              <br/>
              Year 15: ₹5.88L | Year 20: ₹11.55L | Year 25: ₹22.66L | Year 30: ₹44.44L
              <br/>
              At 30-year horizon, your wealth could grow to ₹44 lakh—the power of sustained growth and compounding!
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><Calculator className="w-7 h-7 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Calculate Your Investment CAGR</h2>
          <Link href="/cagr-calculator" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50">
            Open CAGR Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
