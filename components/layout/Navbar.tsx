'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getActiveCalculators } from '@/config/calculators.config';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      scrollLeft: scrollContainerRef.current?.scrollLeft || 0,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();

    const walkX = e.clientX - dragStartRef.current.x;
    scrollContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - walkX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    checkScroll();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      scrollLeft: scrollContainerRef.current?.scrollLeft || 0,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const walkX = e.touches[0].clientX - dragStartRef.current.x;
    scrollContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - walkX;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    checkScroll();
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
    <nav aria-label="Main navigation" className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-gray-950/85 border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10 will-change-backdrop-filter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enhanced */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-blue-600 hover:text-blue-700 hover:drop-shadow-lg transition-all duration-300 transform flex-shrink-0 group"
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

          {/* Desktop Menu - Horizontally Scrollable */}
          <div className="hidden md:flex gap-2 items-center mx-4" style={{ flex: 1, minWidth: 0 }}>
            {/* Left Arrow Scroll Indicator */}
            {canScrollLeft && (
              <button
                onClick={handleScrollLeft}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60"
                aria-label="Scroll navbar left"
                title="Scroll to see previous calculators"
              >
                <span className="text-lg font-bold">←</span>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
              onScroll={checkScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                flex: 1,
                minWidth: 0,
                scrollBehavior: 'smooth',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: isDragging ? 'none' : 'auto',
              }}
            >
              <div className="flex gap-2 flex-nowrap pb-1">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-sm flex items-center gap-1.5 transform hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 relative group ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
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
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60"
                aria-label="Scroll navbar right"
                title="Scroll to see more calculators"
              >
                <span className="text-lg font-bold">→</span>
              </button>
            )}
          </div>

          {/* Theme Switcher + Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>

            {/* Mobile Menu Button - Enhanced */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 flex-shrink-0 transform hover:-translate-y-0.5 hover:shadow-md"
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
        </div>

        {/* Mobile Menu - Enhanced */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
            {/* Theme Switcher for Mobile */}
            <div className="sm:hidden px-4 py-2">
              <ThemeSwitcher />
            </div>

            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold flex items-center gap-2 transform hover:-translate-y-0.5 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
                  }`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    animation: `slideInLeft 0.3s ease-out ${active ? '0ms' : `${links.indexOf(link) * 50}ms`} forwards`,
                    opacity: 0
                  }}
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
