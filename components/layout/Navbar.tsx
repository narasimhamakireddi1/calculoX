'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getActiveCalculators, type CalculatorConfig } from '@/config/calculators.config';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { CalculatorBottomSheet } from '@/components/mobile/CalculatorBottomSheet';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { Home, BookOpen, Info, ChevronDown } from 'lucide-react';

const FINANCE_IDS = new Set([
  'sip', 'emi', 'tax', 'fd', 'rd', 'simple-interest',
  'gst', 'cagr', 'retirement', 'home-loan-vs-rent', 'profit-margin',
]);

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const activeCalculators = getActiveCalculators();

  const financeCalcs = activeCalculators.filter(c => FINANCE_IDS.has(c.id));
  const otherCalcs = activeCalculators.filter(c => !FINANCE_IDS.has(c.id));

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);
  const isCalcActive = activeCalculators.some(c => isActive(c.href));

  const openMega = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMegaOpen(true);
  }, []);

  const scheduleMegaClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setMegaOpen(false), 200);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMegaOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-gray-950/85 border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10"
        onMouseLeave={scheduleMegaClose}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-2xl text-blue-600 hover:text-blue-700 hover:drop-shadow-lg transition-all duration-300 flex-shrink-0 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-8 h-8 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
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
              <span>calculox</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 mx-6">
              <NavLink
                href="/"
                active={isActive('/')}
                icon={<Home className="w-4 h-4" strokeWidth={2} aria-hidden="true" />}
              >
                Home
              </NavLink>

              {/* Calculators mega-menu trigger */}
              <button
                onMouseEnter={openMega}
                onClick={() => (megaOpen ? setMegaOpen(false) : openMega())}
                aria-haspopup="true"
                aria-expanded={megaOpen}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-1.5 whitespace-nowrap ${
                  isCalcActive || megaOpen
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
                }`}
              >
                <span>Calculators</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </button>

              <NavLink
                href="/blog"
                active={isActive('/blog')}
                icon={<BookOpen className="w-4 h-4" strokeWidth={2} aria-hidden="true" />}
              >
                Blog
              </NavLink>

              <NavLink
                href="/about"
                active={isActive('/about')}
                icon={<Info className="w-4 h-4" strokeWidth={2} aria-hidden="true" />}
              >
                About
              </NavLink>
            </div>

            {/* Right side: Theme switcher + Mobile hamburger */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <ThemeSwitcher />
              </div>
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex-shrink-0"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <span className="flex flex-col gap-[5px]">
                  <span className="block w-[18px] h-[2px] rounded-full bg-gray-800 dark:bg-gray-100" />
                  <span className="block w-[18px] h-[2px] rounded-full bg-gray-800 dark:bg-gray-100" />
                  <span className="block w-[18px] h-[2px] rounded-full bg-gray-800 dark:bg-gray-100" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mega-menu panel — positioned absolute to nav (sticky), full-width */}
        {megaOpen && (
          <div
            onMouseEnter={openMega}
            className="hidden md:block absolute top-full left-0 right-0 bg-white/[0.97] dark:bg-gray-950/[0.97] backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-2xl shadow-gray-900/10 dark:shadow-black/40 mega-panel-enter"
            role="region"
            aria-label="All calculators"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex gap-8">

                {/* Finance section */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                    Finance
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {financeCalcs.map(calc => (
                      <MegaItem
                        key={calc.id}
                        calc={calc}
                        active={isActive(calc.href)}
                        onClose={() => setMegaOpen(false)}
                      />
                    ))}
                  </div>
                </div>

                {/* Vertical divider */}
                <div className="w-px self-stretch bg-gray-200/70 dark:bg-gray-700/70 flex-shrink-0" />

                {/* Health & Utility section */}
                <div className="w-44 flex-shrink-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-3">
                    Health & Utility
                  </p>
                  <div className="flex flex-col gap-1">
                    {otherCalcs.map(calc => (
                      <MegaItem
                        key={calc.id}
                        calc={calc}
                        active={isActive(calc.href)}
                        onClose={() => setMegaOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer row */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  14 free calculators · No signup · Real-time results
                </span>
                <Link
                  href="/compare"
                  onClick={() => setMegaOpen(false)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Compare side-by-side →
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Rendered outside <nav> so backdrop-blur doesn't create a fixed containing block */}
      <CalculatorBottomSheet isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function NavLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30'
          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MegaItem({
  calc,
  active,
  onClose,
}: {
  calc: CalculatorConfig;
  active: boolean;
  onClose: () => void;
}) {
  const label = calc.title
    .replace(' & Markup Calculator', '')
    .replace(/ Calculator$/, '');

  return (
    <Link
      href={calc.href}
      onClick={onClose}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 group ${
        active
          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      <span
        className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 transition-colors duration-150 ${
          active
            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 dark:group-hover:text-blue-400'
        }`}
      >
        <CalculatorIcon idOrHref={calc.href} className="w-4 h-4" />
      </span>
      <span className="text-sm font-medium truncate">{label}</span>
    </Link>
  );
}
