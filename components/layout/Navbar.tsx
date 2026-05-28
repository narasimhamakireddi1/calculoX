'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: 'ðŸ ' },
    { href: '/sip-calculator', label: 'SIP', icon: 'ðŸ“ˆ' },
    { href: '/emi-calculator', label: 'EMI', icon: 'ðŸ’³' },
    { href: '/bmi-calculator', label: 'BMI', icon: 'âš–ï¸' },
    { href: '/tax-calculator', label: 'Tax', icon: 'ðŸ§®' },
    { href: '/scientific-calculator', label: 'Scientific', icon: 'ðŸ”¬' },
    { href: '/blog', label: 'Blog', icon: 'ðŸ“' },
    { href: '/about', label: 'About', icon: 'â„¹ï¸' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/30 dark:border-gray-800/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enhanced */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-3xl">ðŸ§®</span>
            <span>calculox</span>
          </Link>

          {/* Desktop Menu - Enhanced */}
          <div className="hidden md:flex gap-2 items-center">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-1.5 transform hover:scale-105 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-2xl font-bold">
              {isOpen ? 'âœ•' : 'â˜°'}
            </span>
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

