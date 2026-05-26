import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">CalculoX</h3>
            <p className="text-gray-400">
              Premium online calculators for financial, health, and daily calculations in India.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h4 className="font-semibold mb-4">Calculators</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/sip-calculator" className="hover:text-white">SIP Calculator</Link></li>
              <li><Link href="/emi-calculator" className="hover:text-white">EMI Calculator</Link></li>
              <li><Link href="/bmi-calculator" className="hover:text-white">BMI Calculator</Link></li>
              <li><Link href="/tax-calculator" className="hover:text-white">Tax Calculator</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@calculox.in</li>
              <li>Made with ❤️ for India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CalculoX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
