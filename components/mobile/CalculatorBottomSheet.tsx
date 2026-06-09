'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getActiveCalculators } from '@/config/calculators.config';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type Theme = 'light' | 'dark' | 'system';

function CompactThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = (localStorage.getItem('theme') as Theme) || 'system';
      setTheme(saved);
    } catch {}
    setMounted(true);
  }, []);

  const apply = (t: Theme) => {
    setTheme(t);
    try { localStorage.setItem('theme', t); } catch {}
    const html = document.documentElement;
    if (t === 'dark') html.classList.add('dark');
    else if (t === 'light') html.classList.remove('dark');
    else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) html.classList.add('dark');
      else html.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
          <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
    },
    {
      value: 'system',
      label: 'Auto',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path strokeLinecap="round" d="M8 21h8M12 17v4" />
        </svg>
      ),
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => apply(opt.value)}
          title={opt.label}
          aria-label={`${opt.label} mode`}
          aria-pressed={theme === opt.value}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            theme === opt.value
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function CalculatorBottomSheet({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const activeCalculators = getActiveCalculators();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null); // kept for potential future focus use
  const prevPathname = useRef(pathname);

  // Close on route change
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      onClose();
      setSearchQuery('');
    }
  }, [pathname, onClose]);

  // Clear query on close
  useEffect(() => {
    if (!isOpen) setSearchQuery('');
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const filteredCalculators = searchQuery.trim()
    ? activeCalculators.filter(
        (calc) =>
          calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (calc.keywords ?? []).some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : activeCalculators;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠', desc: 'Back to homepage' },
    { href: '/blog', label: 'Blog', icon: '📖', desc: '25 financial guides' },
    { href: '/about', label: 'About', icon: 'ℹ️', desc: 'Our team & mission' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-50 md:hidden flex flex-col
          bg-white dark:bg-gray-950
          border-l border-gray-200/80 dark:border-gray-800/80
          shadow-[−20px_0_60px_rgba(0,0,0,0.12)]
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '88vw', maxWidth: 340, height: '100dvh' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 dark:border-gray-800/80 flex-shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 flex-shrink-0">
              <defs>
                <linearGradient id="mobileNavGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="7" fill="url(#mobileNavGrad)" />
              <text x="16" y="22" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="-0.5">CX</text>
            </svg>
            <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              calculox
            </span>
          </Link>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex-shrink-0"
            aria-label="Close menu"
          >
            <span style={{ position: 'relative', display: 'block', width: 18, height: 18, flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 2, borderRadius: 9999, backgroundColor: '#6b7280', transform: 'rotate(45deg)' }} />
              <span style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 2, borderRadius: 9999, backgroundColor: '#6b7280', transform: 'rotate(-45deg)' }} />
            </span>
          </button>
        </div>

        {/* ── Search ── */}
        <div className="px-4 pt-3 pb-3 flex-shrink-0 border-b border-gray-100 dark:border-gray-800/80">
          <div className="relative">
            <svg
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', width: 15, height: 15, flexShrink: 0 }}
              viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              placeholder="Search calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
              style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 40, paddingRight: searchQuery ? 32 : 12 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Nav Links — hidden during search */}
          {!searchQuery && (
            <div className="px-3 pt-1 pb-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 mb-0.5 group ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <span className="text-lg w-7 text-center flex-shrink-0 transition-transform group-hover:scale-110 duration-150">
                      {link.icon}
                    </span>
                    <div className="min-w-0">
                      <div className={`text-sm font-semibold leading-tight ${active ? '' : ''}`}>{link.label}</div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{link.desc}</div>
                    </div>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Section Divider */}
          <div className={`px-4 ${searchQuery ? 'pt-2' : ''} pb-2`}>
            <div className="flex items-center gap-2.5">
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex-shrink-0">
                {searchQuery
                  ? `${filteredCalculators.length} result${filteredCalculators.length !== 1 ? 's' : ''}`
                  : `${activeCalculators.length} calculators`}
              </span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="px-3 pb-4">
            {filteredCalculators.length > 0 ? (
              <div className="grid grid-cols-4 gap-1.5">
                {filteredCalculators.map((calc) => {
                  const active = isActive(calc.href);
                  return (
                    <Link
                      key={calc.id}
                      href={calc.href}
                      onClick={onClose}
                      title={calc.title}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-150 group ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-950/60 ring-1 ring-blue-200 dark:ring-blue-800/60'
                          : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                      }`}
                    >
                      <span className="text-xl leading-none transition-transform duration-150 group-hover:scale-110">
                        {calc.icon}
                      </span>
                      <span className={`text-[10px] text-center leading-snug font-medium line-clamp-2 ${
                        active
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {calc.title.replace(' Calculator', '')}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm text-gray-400 dark:text-gray-500">No calculators found</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: Theme Switcher ── */}
        <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800/80 px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Appearance</span>
          </div>
          <CompactThemeSwitcher />
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
            Free · No signup · No data stored
          </p>
        </div>
      </div>
    </>
  );
}
