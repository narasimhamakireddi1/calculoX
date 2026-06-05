import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Profit Margin Calculator: Cost ₹50, Target Margin 40%',
  description: 'Profit margin calculation: Cost ₹50 + 40% margin = Selling Price ₹70. Profit: ₹20 per unit.',
  keywords: ['profit margin calculator', 'markup', 'pricing strategy'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/profit-margin-cost-50-target-40`,
  },
};

export default function ProfitMarginCost50Example() {
  const costPrice = 50;
  const targetMarginPercent = 40;
  const profit = costPrice * (targetMarginPercent / 100);
  const sellingPrice = costPrice + profit;
  const marginPercent = (profit / costPrice) * 100;
  const forHundredUnits = sellingPrice * 100;
  const totalProfit = profit * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-800 dark:to-orange-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Profit Margin Calculator: Cost ₹50</h1>
          <p className="text-xl text-orange-100">Optimal pricing with 40% profit margin</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📋 Cost Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Cost Price</span><span className="font-bold">{formatCurrency(costPrice)}</span></div>
              <div className="flex justify-between pb-3 border-b"><span>Target Margin</span><span className="font-bold">{targetMarginPercent}%</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">💰 Pricing Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg p-8 border-2 border-orange-200 dark:border-orange-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Selling Price</p>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(sellingPrice)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Price per unit</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Profit per Unit</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(profit)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Revenue after cost</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Margin Percentage</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{marginPercent.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Profit ratio</p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 100-Unit Revenue Projection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Revenue (100 units)</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(forHundredUnits)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">100 × ₹{sellingPrice}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Total Profit (100 units)</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalProfit)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">100 × ₹{profit}</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Understanding Profit Margins</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              With ₹50 cost and 40% margin, you sell at ₹70. Per unit profit: ₹20. Selling 100 units generates ₹2,000 profit.
              This 40% margin is solid for retail business—higher than average (25-35%) but sustainable with good operations.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Margin vs Markup Distinction</h3>
            <p>
              <strong>Margin (40%):</strong> Profit as % of cost. Profit ÷ Cost = 20 ÷ 50 = 40%
              <br/>
              <strong>Markup (40%):</strong> Same as margin percentage in this case. But if you calculate on selling price:
              Profit ÷ Selling Price = 20 ÷ 70 = 28.6% profit margin on revenue.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Industry Benchmarks</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Grocery:</strong> 15-20% margin (high volume, low margin)</li>
              <li><strong>Retail:</strong> 25-35% margin (clothes, electronics)</li>
              <li><strong>Your business:</strong> 40% margin (premium products)</li>
              <li><strong>Luxury:</strong> 50-100%+ margin (exclusive items)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">After GST Implications</h3>
            <p>
              If you sell at ₹70 and GST is 18%:
              <br/>
              Selling Price (inclusive): ₹82.60
              <br/>
              GST collected: ₹12.60 (you remit to government)
              <br/>
              Net after GST: ₹70 (your margin remains 40% on base)
              <br/>
              <strong>Important:</strong> GST doesn't affect profit margin, just accounting complexity.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Pricing Strategy</h3>
            <p>
              40% margin allows:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Cover operating costs (rent, utilities, staff): 15-20%</li>
                <li>Taxes and obligations: 5-10%</li>
                <li>Net profit: 15-20%</li>
                <li>Buffer for discounts/promotions: 0-5%</li>
              </ul>
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-800 dark:to-orange-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🧮 Optimize Your Pricing</h2>
          <Link href="/profit-margin-calculator" className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-orange-50">
            Open Profit Margin Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
