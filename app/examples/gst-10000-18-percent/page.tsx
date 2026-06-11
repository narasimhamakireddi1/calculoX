import type { Metadata } from 'next';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { ClipboardList, Coins, BarChart2, Calculator } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'GST Calculator: ₹10,000 Product at 18% GST',
  description: 'GST calculation: ₹10,000 base price + 18% GST = ₹11,800 final price. CGST: ₹900, SGST: ₹900.',
  keywords: ['GST calculator', 'tax calculation', 'goods and services tax'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/examples/gst-10000-18-percent`,
  },
};

export default function GST10KExample() {
  const basePrice = 10000;
  const gstRate = 18;
  const gstAmount = basePrice * (gstRate / 100);
  const finalPrice = basePrice + gstAmount;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 dark:from-yellow-800 dark:to-yellow-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">GST Calculator: ₹10K at 18% GST</h1>
          <p className="text-xl text-yellow-100">GST calculation with CGST/SGST breakdown</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><ClipboardList className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> GST Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between pb-3 border-b mb-3"><span>Base Price (Exclusive)</span><span className="font-bold">{formatCurrency(basePrice)}</span></div>
              <div className="flex justify-between pb-3 border-b"><span>GST Rate</span><span className="font-bold">{gstRate}%</span></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><Coins className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> GST Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-lg p-8 border-2 border-yellow-200 dark:border-yellow-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">GST Amount</p>
              <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(gstAmount)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total tax added</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Final Price</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(finalPrice)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Price inclusive of GST</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-8 border-2 border-green-200 dark:border-green-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2">CGST + SGST</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(cgst)} + {formatCurrency(sgst)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Central + State Tax</p>
            </div>
          </div>
        </section>

        <section className="mb-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><BarChart2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Understanding GST</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              In this example, a ₹10,000 product with 18% GST costs ₹11,800 to the customer. The ₹1,800 GST is split:
              ₹900 CGST (Central) and ₹900 SGST (State Tax), each going to respective governments.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">GST Rates in India</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>5% GST:</strong> Essential items (food, vegetables, flour)</li>
              <li><strong>12% GST:</strong> Standard items (clothing, leather goods)</li>
              <li><strong>18% GST:</strong> Most goods/services (electronics, phones, software)</li>
              <li><strong>28% GST:</strong> Luxury items (AC, vehicles, premium goods)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Important Concepts</h3>
            <p>
              <strong>GST Exclusive:</strong> Price shown is before tax (₹10,000). Customer pays ₹11,800.
              <br/>
              <strong>GST Inclusive:</strong> Price shown is after tax (₹11,800). Seller keeps ₹10,000, remits ₹1,800.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">For Businesses</h3>
            <p>
              If you're a registered GST seller: You collect ₹1,800 GST from customer. But if you bought materials
              at 18% GST (₹900), you claim ITC (Input Tax Credit) and only pay net ₹900 to government. This input credit
              system is why GST is efficient.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-yellow-600 to-yellow-700 dark:from-yellow-800 dark:to-yellow-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><Calculator className="w-7 h-7 flex-shrink-0" strokeWidth={2} aria-hidden="true" /> Calculate GST Instantly</h2>
          <Link href="/gst-calculator" className="inline-block bg-white text-yellow-600 font-bold py-3 px-8 rounded-lg hover:bg-yellow-50">
            Open GST Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
