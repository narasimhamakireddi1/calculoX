'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function ResultsScrollCue() {
  const [show, setShow] = useState(false);
  const targetIdRef = useRef<string | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);
  const moRef = useRef<MutationObserver | null>(null);
  const lastElRef = useRef<Element | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attachIO = useCallback((el: Element) => {
    ioRef.current?.disconnect();
    lastElRef.current = el;
    ioRef.current = new IntersectionObserver(
      ([entry]) => {
        // Only show when element is below the fold (not above it)
        const isBelow = !entry.isIntersecting && entry.boundingClientRect.top > 0;
        setShow(isBelow);
      },
      { threshold: 0.15 }
    );
    ioRef.current.observe(el);
  }, []);

  const scan = useCallback(() => {
    const el = document.querySelector('[id$="-results"]');
    if (el) {
      if (el !== lastElRef.current) {
        targetIdRef.current = el.id;
        attachIO(el);
      }
    } else if (lastElRef.current) {
      lastElRef.current = null;
      targetIdRef.current = null;
      ioRef.current?.disconnect();
      setShow(false);
    }
  }, [attachIO]);

  const scheduleScan = useCallback(() => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(scan, 80);
  }, [scan]);

  useEffect(() => {
    scan();
    moRef.current = new MutationObserver(scheduleScan);
    moRef.current.observe(document.body, { childList: true, subtree: true });
    return () => {
      moRef.current?.disconnect();
      ioRef.current?.disconnect();
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, [scan, scheduleScan]);

  const handleClick = () => {
    const id = targetIdRef.current;
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to calculator results"
      className={`fixed bottom-20 left-1/2 z-40 md:hidden
        flex items-center gap-2 px-5 py-2.5 rounded-full
        bg-blue-600 text-white font-semibold text-sm
        shadow-[0_4px_20px_rgba(37,99,235,0.45)]
        transition-all duration-300 ease-out
        -translate-x-1/2
        ${show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}
      `}
    >
      See Results
      <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
