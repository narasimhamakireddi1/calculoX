'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getActiveCalculators } from '@/config/calculators.config';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const activeCalculators = getActiveCalculators();

  // Check if scrollable content exists and update arrow visibility
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const hasHorizontalScroll = scrollWidth > clientWidth;
      setCanScrollLeft(hasHorizontalScroll && scrollLeft > 5);
      setCanScrollRight(hasHorizontalScroll && scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    // Delay to ensure DOM has rendered with correct dimensions
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);

    const resizeObserver = new ResizeObserver(checkScroll);
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    // Also check on window resize
    window.addEventListener('resize', checkScroll);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
      // Check scroll state after animation
      setTimeout(checkScroll, 300);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
      // Check scroll state after animation
      setTimeout(checkScroll, 300);
    }
  };

  const links = [
    { href: '/', label: 'Home', icon: '🏠' },
    ...activeCalculators.map((calc) => ({
      href: calc.href,
      label: calc.title.replace(' Calculator', ''),
      icon: calc.icon,
    })),
    { href: '/blog', label: 'Blog', icon: '📖' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
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
            className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex-shrink-0"
          >
            <span className="text-3xl">🧮</span>
            <span>calculox</span>
          </Link>

          {/* Desktop Menu - Horizontally Scrollable */}
          <div className="hidden md:flex gap-2 items-center flex-1 mx-4">
            {/* Left Arrow Scroll Indicator */}
            {canScrollLeft && (
              <button
                onClick={handleScrollLeft}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-110 flex-shrink-0 shadow-lg shadow-blue-500/30"
                aria-label="Scroll navbar left"
                title="Scroll to see previous calculators"
              >
                <span className="text-lg font-bold">←</span>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto flex-1 scrollbar-hide scroll-smooth"
              onScroll={checkScroll}
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex gap-2 flex-nowrap min-w-min">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center gap-1.5 transform hover:scale-105 whitespace-nowrap flex-shrink-0 ${
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
            </div>

            {/* Right Arrow Scroll Indicator */}
            {canScrollRight && (
              <button
                onClick={handleScrollRight}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-110 flex-shrink-0 shadow-lg shadow-blue-500/30"
                aria-label="Scroll navbar right"
                title="Scroll to see more calculators"
              >
                <span className="text-lg font-bold">→</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex-shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-2xl font-bold">
              {isOpen ? '✕' : '☰'}
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

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          display: none !important;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          display: none !important;
        }
      `}</style>
    </nav>
  );
}
