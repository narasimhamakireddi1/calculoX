import Link from 'next/link';
import { Heart, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white mt-24 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand — full-width on mobile, 1 col on desktop */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-8 h-8 mb-2"
            >
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="6" fill="url(#grad)" />
              <text
                x="16"
                y="22"
                fontFamily="Arial, sans-serif"
                fontSize="14"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
                letterSpacing="-0.5"
              >
                CX
              </text>
            </svg>
            <h2 className="font-bold text-lg mb-3">calculox</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free premium online calculators for Indian users – finance, health & utility tools.
            </p>
            <p className="text-gray-400 text-xs mt-3 flex items-center gap-1">Made with <Heart className="w-3 h-3 fill-red-400 text-red-400 inline" strokeWidth={0} aria-hidden="true" /> for India</p>
          </div>

          {/* On mobile: 2-col grid (Finance left, Company/Legal right).
              On desktop: display:contents so all 4 columns flow into the parent 5-col grid. */}
          <div className="grid grid-cols-2 gap-4 md:contents">

            {/* Finance — left on mobile */}
            <div className="min-w-0">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Finance</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/sip-calculator" className="hover:text-white transition-colors">SIP Calculator</Link></li>
                <li><Link href="/emi-calculator" className="hover:text-white transition-colors">EMI Calculator</Link></li>
                <li><Link href="/fd-calculator" className="hover:text-white transition-colors">FD Calculator</Link></li>
                <li><Link href="/rd-calculator" className="hover:text-white transition-colors">RD Calculator</Link></li>
                <li><Link href="/retirement-calculator" className="hover:text-white transition-colors">Retirement Calculator</Link></li>
                <li><Link href="/home-loan-vs-rent" className="hover:text-white transition-colors">Home Loan vs Rent</Link></li>
                <li><Link href="/profit-margin-calculator" className="hover:text-white transition-colors">Profit Margin Calculator</Link></li>
                <li><Link href="/simple-interest-calculator" className="hover:text-white transition-colors">Simple Interest</Link></li>
                <li><Link href="/cagr-calculator" className="hover:text-white transition-colors">CAGR Calculator</Link></li>
              </ul>
            </div>

            {/* Company — right on mobile */}
            <div className="min-w-0">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>

              {/* Legal merged under Company on mobile to keep right column tidy */}
              <h3 className="font-semibold mt-6 mb-4 text-sm uppercase tracking-wider text-gray-300 md:hidden">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm md:hidden">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link></li>
                <li>
                  <address className="not-italic mt-3 text-gray-400 text-xs">
                    <a href="mailto:supportcalculox@gmail.com" className="hover:text-white transition-colors break-all">
                      supportcalculox@gmail.com
                    </a>
                  </address>
                </li>
              </ul>
            </div>

            {/* Other Tools — left col, row 2 on mobile */}
            <div className="min-w-0">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Other Tools</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/bmi-calculator" className="hover:text-white transition-colors">BMI Calculator</Link></li>
                <li><Link href="/tax-calculator" className="hover:text-white transition-colors">Tax Calculator</Link></li>
                <li><Link href="/gst-calculator" className="hover:text-white transition-colors">GST Calculator</Link></li>
                <li><Link href="/percentage-calculator" className="hover:text-white transition-colors">Percentage Calculator</Link></li>
                <li><Link href="/scientific-calculator" className="hover:text-white transition-colors">Scientific Calculator</Link></li>
              </ul>
            </div>

            {/* Legal — desktop only (hidden on mobile, shown in Company column above) */}
            <div className="hidden md:block">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link></li>
                <li>
                  <address className="not-italic mt-3 text-gray-400 text-xs">
                    <a href="mailto:supportcalculox@gmail.com" className="hover:text-white transition-colors break-all">
                      supportcalculox@gmail.com
                    </a>
                  </address>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <div className="text-center md:text-left">
            <p className="font-medium">&copy; {new Date().getFullYear()} <span className="text-blue-400 font-bold">calculox</span>. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">Made with <Heart className="w-3 h-3 fill-red-400 text-red-400 inline" strokeWidth={0} aria-hidden="true" /> for India</p>
          </div>
          <p className="text-xs bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={2} aria-hidden="true" /> Disclaimer: Results are estimates only. Not financial, medical, or tax advice. Consult professionals.</p>
        </div>
      </div>
    </footer>
  );
}
