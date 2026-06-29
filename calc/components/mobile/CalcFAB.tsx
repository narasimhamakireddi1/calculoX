'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, RotateCcw, Share2 } from 'lucide-react';

export function CalcFAB() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const ioRef = useRef<IntersectionObserver | null>(null);
  const moRef = useRef<MutationObserver | null>(null);
  const lastElRef = useRef<Element | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetIdRef = useRef<string | null>(null);

  const attachIO = useCallback((el: Element) => {
    ioRef.current?.disconnect();
    lastElRef.current = el;
    ioRef.current = new IntersectionObserver(
      ([entry]) => {
        // Show when results are in viewport OR have been scrolled past
        const inViewOrPast =
          entry.isIntersecting || entry.boundingClientRect.top < 0;
        setShow(inViewOrPast);
      },
      { threshold: 0.1 }
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

  const handleCalculateAgain = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled — no action needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — silent failure
    }
  };

  return (
    <div
      aria-hidden={!show}
      className={`fixed bottom-20 right-4 z-40 md:hidden flex flex-col gap-2 items-end
        transition-all duration-300 ease-out
        ${show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}
      `}
    >
      {/* Share result */}
      <button
        onClick={handleShare}
        aria-label={copied ? 'Link copied' : 'Share result'}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full
          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
          border border-gray-200 dark:border-gray-700
          shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]
          text-sm font-medium active:scale-95 transition-transform will-change-transform"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Share2 className="w-4 h-4 text-blue-500 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
        )}
        {copied ? 'Copied!' : 'Share result'}
      </button>

      {/* Calculate again */}
      <button
        onClick={handleCalculateAgain}
        aria-label="Back to calculator form"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full
          bg-blue-600 text-white
          shadow-[0_4px_14px_rgba(37,99,235,0.4)]
          text-sm font-semibold active:scale-95 transition-transform will-change-transform"
      >
        <RotateCcw className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
        Calculate again
      </button>
    </div>
  );
}
