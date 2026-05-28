import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h2 className="font-bold text-lg mb-3">🧮 CalculoX</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free premium online calculators for Indian users — finance, health & utility tools.
            </p>
            <p className="text-gray-500 text-xs mt-3">Made with ❤️ for India</p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Calculators</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/sip-calculator" className="hover:text-white transition-colors">SIP Calculator</Link></li>
              <li><Link href="/emi-calculator" className="hover:text-white transition-colors">EMI Calculator</Link></li>
              <li><Link href="/bmi-calculator" className="hover:text-white transition-colors">BMI Calculator</Link></li>
              <li><Link href="/tax-calculator" className="hover:text-white transition-colors">Tax Calculator</Link></li>
              <li><Link href="/scientific-calculator" className="hover:text-white transition-colors">Scientific Calculator</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li>
                <address className="not-italic mt-3 text-gray-500 text-xs">
                  <a href="mailto:support@calculox.in" className="hover:text-gray-300 transition-colors">
                    support@calculox.in
                  </a>
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CalculoX. All rights reserved.</p>
          <p className="text-xs">Results are estimates only. Not financial or medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
